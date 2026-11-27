import * as THREE from 'three';

// HA-DI — primeira habilidade jogável da Casa Brooklyn.
// O desenho do hieróglifo segue a sequência publicada por Frances Foster:
// ḥḏ = 𓉔𓆓 (O4 + I10). Os efeitos e tempos são adaptações de gameplay.
export function createMagicSystem({
  scene,
  camera,
  character,
  controller,
  trainingRoom,
  canSpendEnergy = () => true,
  spendEnergy = () => true,
  spellCost = 30
}) {
  const GOLD = 0xffd36a;
  const PALE_GOLD = 0xffefb2;
  const glyphGroup = new THREE.Group();
  glyphGroup.name = 'HA-DI · hieróglifo ḥḏ';
  glyphGroup.visible = false;
  scene.add(glyphGroup);

  const glyphCanvas = document.createElement('canvas');
  glyphCanvas.width = 768;
  glyphCanvas.height = 512;
  const glyphContext = glyphCanvas.getContext('2d');
  function drawGlyphTexture() {
    glyphContext.clearRect(0, 0, 768, 512);
    glyphContext.textAlign = 'center';
    glyphContext.textBaseline = 'middle';
    glyphContext.shadowColor = '#ffbd42';
    glyphContext.shadowBlur = 52;
    glyphContext.fillStyle = '#fff8dc';
    glyphContext.font = '190px "Noto Sans Egyptian Hieroglyphs", "Segoe UI Historic", serif';
    glyphContext.fillText('𓉔𓆓', 384, 222);
    glyphContext.shadowBlur = 24;
    glyphContext.fillStyle = '#ffe19a';
    glyphContext.font = '600 42px Georgia, serif';
    glyphContext.letterSpacing = '12px';
    glyphContext.fillText('HA-DI', 384, 420);
    glyphTexture.needsUpdate = true;
  }
  const glyphTexture = new THREE.CanvasTexture(glyphCanvas);
  glyphTexture.colorSpace = THREE.SRGBColorSpace;
  glyphTexture.anisotropy = 4;
  drawGlyphTexture();
  if (document.fonts?.load) {
    document.fonts.load('190px "Noto Sans Egyptian Hieroglyphs"')
      .then(drawGlyphTexture)
      .catch(() => {});
  }

  const glyphMaterial = new THREE.MeshBasicMaterial({
    map: glyphTexture,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    toneMapped: false
  });
  // Apenas a inscrição luminosa ḥḏ diante da mão; sem halo circular ou anéis externos.
  const glyphPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 0.62), glyphMaterial);
  glyphPlane.position.z = 0.012;
  glyphGroup.add(glyphPlane);

  // Sprites CC0 do Kenney Particle Pack: texturas e materiais são partilhados.
  function fallbackSprite(kind) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(64, 64, 2, 64, 64, 62);
    if (kind === 'smoke') {
      gradient.addColorStop(0, 'rgba(220,190,140,0.48)');
      gradient.addColorStop(0.45, 'rgba(160,135,100,0.22)');
      gradient.addColorStop(1, 'rgba(120,100,75,0)');
    } else {
      gradient.addColorStop(0, 'rgba(255,255,235,1)');
      gradient.addColorStop(0.2, 'rgba(255,220,130,0.88)');
      gradient.addColorStop(0.55, 'rgba(255,170,55,0.35)');
      gradient.addColorStop(1, 'rgba(255,150,40,0)');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  const spriteTextures = {
    magic: fallbackSprite('magic'),
    smoke: fallbackSprite('smoke'),
    circle: fallbackSprite('magic'),
    spark: fallbackSprite('magic'),
    slash: fallbackSprite('magic')
  };
  const spriteConsumers = { magic: [], smoke: [], circle: [], spark: [], slash: [] };
  function useSprite(key, material) {
    material.map = spriteTextures[key];
    spriteConsumers[key].push(material);
  }

  async function loadKenneySprite(key, filename) {
    try {
      const response = await fetch(new URL('../assets/vfx/' + filename + '.b64', import.meta.url));
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const encoded = (await response.text()).replace(/\\s/g, '');
      const image = new Image();
      image.src = 'data:image/png;base64,' + encoded;
      if (image.decode) await image.decode();
      else await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
      });
      const texture = new THREE.Texture(image);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 2;
      texture.needsUpdate = true;
      const previous = spriteTextures[key];
      spriteTextures[key] = texture;
      for (const material of spriteConsumers[key]) {
        material.map = texture;
        material.needsUpdate = true;
      }
      previous?.dispose?.();
    } catch (error) {
      console.warn('HA-DI: usando textura procedural de fallback para ' + filename, error);
    }
  }

  loadKenneySprite('magic', 'kenney-magic-01.png');
  loadKenneySprite('smoke', 'kenney-smoke-03.png');
  loadKenneySprite('circle', 'kenney-circle-03.png');
  loadKenneySprite('spark', 'kenney-spark-07.png');
  loadKenneySprite('slash', 'kenney-slash-02.png');

  let casting = false;
  let castElapsed = 0;
  let activeTarget = null;
  let projectile = null;
  let impactApplied = false;
  let impactActive = false;
  let impactAge = 0;

  // Projétil persistente: curva, geometria, materiais e luz são construídos uma vez.
  const projectileAxis = new THREE.Vector3(1, 0, 0);
  const projectilePath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.48, 0.16, 0),
    new THREE.Vector3(1, 0, 0)
  ]);
  const projectilePoint = new THREE.Vector3();
  const projectileGroup = new THREE.Group();
  projectileGroup.name = 'HA-DI · pulso dourado reutilizável';
  const projectileTrail = new THREE.Mesh(
    new THREE.TubeGeometry(projectilePath, 36, 0.032, 7, false),
    new THREE.MeshBasicMaterial({
      color: GOLD, transparent: true, opacity: 0.9,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
    })
  );
  projectileGroup.add(projectileTrail);
  const projectileCore = new THREE.Mesh(
    new THREE.SphereGeometry(0.105, 16, 12),
    new THREE.MeshBasicMaterial({
      color: PALE_GOLD, transparent: true, opacity: 0.98,
      blending: THREE.AdditiveBlending, toneMapped: false
    })
  );
  projectileGroup.add(projectileCore);
  const projectileHalo = new THREE.Mesh(
    new THREE.SphereGeometry(0.19, 14, 10),
    new THREE.MeshBasicMaterial({
      color: GOLD, transparent: true, opacity: 0.32,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
    })
  );
  projectileGroup.add(projectileHalo);
  const projectileLight = new THREE.PointLight(GOLD, 2.2, 3.8, 2);
  projectileGroup.add(projectileLight);
  projectileGroup.visible = false;
  scene.add(projectileGroup);

  // Impacto persistente: o conjunto visual é reutilizado em cada conjuração.
  const impactGroup = new THREE.Group();
  impactGroup.name = 'HA-DI · explosão dourada reutilizável';
  impactGroup.visible = false;
  scene.add(impactGroup);

  const impactFlash = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 24, 16),
    new THREE.MeshBasicMaterial({
      color: 0xffefb8, transparent: true, opacity: 0.98,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
    })
  );
  impactGroup.add(impactFlash);

  const impactShell = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 22, 16),
    new THREE.MeshBasicMaterial({
      color: 0xffc34f, transparent: true, opacity: 0.78, wireframe: true,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
    })
  );
  impactGroup.add(impactShell);

  const impactCoreMaterial = new THREE.SpriteMaterial({
    color: 0xffe6a0, transparent: true, opacity: 0.98,
    blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
  });
  useSprite('magic', impactCoreMaterial);
  const impactCoreSprite = new THREE.Sprite(impactCoreMaterial);
  impactCoreSprite.scale.set(0.9, 0.9, 1);
  impactGroup.add(impactCoreSprite);

  const floorSigilMaterial = new THREE.MeshBasicMaterial({
    color: 0xffc04b, transparent: true, opacity: 0.82,
    blending: THREE.AdditiveBlending, depthWrite: false,
    side: THREE.DoubleSide, toneMapped: false
  });
  useSprite('circle', floorSigilMaterial);
  const floorSigil = new THREE.Mesh(new THREE.PlaneGeometry(1.75, 1.75), floorSigilMaterial);
  floorSigil.rotation.x = -Math.PI / 2;
  impactGroup.add(floorSigil);

  const shockwave = new THREE.Mesh(
    new THREE.TorusGeometry(0.34, 0.035, 8, 64),
    new THREE.MeshBasicMaterial({
      color: 0xffe3a0, transparent: true, opacity: 0.98,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
    })
  );
  impactGroup.add(shockwave);

  const groundWave = new THREE.Mesh(
    new THREE.TorusGeometry(0.42, 0.026, 8, 64),
    new THREE.MeshBasicMaterial({
      color: GOLD, transparent: true, opacity: 0.94,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
    })
  );
  groundWave.rotation.x = -Math.PI / 2;
  impactGroup.add(groundWave);

  const slashMaterial = new THREE.SpriteMaterial({
    color: 0xffd36a, transparent: true, opacity: 0.9,
    blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
  });
  useSprite('slash', slashMaterial);
  const slash = new THREE.Sprite(slashMaterial);
  slash.scale.set(1.9, 1.15, 1);
  slash.material.rotation = -0.35;
  impactGroup.add(slash);

  const impactRayCount = 18;
  const impactSparkCount = 46;
  const impactSmokeCount = 9;
  const rayInstances = new THREE.InstancedMesh(
    new THREE.CylinderGeometry(0.008, 0.032, 1, 5, 1),
    new THREE.MeshBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0.94,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
    }),
    impactRayCount
  );
  rayInstances.frustumCulled = false;
  impactGroup.add(rayInstances);

  const sparkMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff, transparent: true, opacity: 0.98,
    blending: THREE.AdditiveBlending, depthWrite: false,
    side: THREE.DoubleSide, toneMapped: false
  });
  useSprite('spark', sparkMaterial);
  const sparkInstances = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(1, 1), sparkMaterial, impactSparkCount
  );
  sparkInstances.frustumCulled = false;
  impactGroup.add(sparkInstances);

  const smokeMaterial = new THREE.MeshBasicMaterial({
    color: 0xc7a36a, transparent: true, opacity: 0.28,
    blending: THREE.NormalBlending, depthWrite: false,
    side: THREE.DoubleSide, toneMapped: false
  });
  useSprite('smoke', smokeMaterial);
  const smokeInstances = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(1, 1), smokeMaterial, impactSmokeCount
  );
  smokeInstances.frustumCulled = false;
  impactGroup.add(smokeInstances);

  const impactRayStates = Array.from({ length: impactRayCount }, (_, i) => ({
    direction: new THREE.Vector3(),
    length: 0.72 + Math.random() * 0.72,
    pale: i % 4 === 0
  }));
  const impactSparkStates = Array.from({ length: impactSparkCount }, (_, i) => ({
    position: new THREE.Vector3(),
    velocity: new THREE.Vector3(),
    baseSize: 0.075 + Math.random() * 0.12,
    spin: Math.random() * Math.PI * 2,
    pale: i % 4 === 0
  }));
  const impactSmokeStates = Array.from({ length: impactSmokeCount }, () => ({
    position: new THREE.Vector3(),
    velocity: new THREE.Vector3(),
    baseSize: 0.3 + Math.random() * 0.34,
    phase: Math.random() * Math.PI * 2
  }));

  const instanceDummy = new THREE.Object3D();
  const instanceUp = new THREE.Vector3(0, 1, 0);
  const instanceZ = new THREE.Vector3(0, 0, 1);
  const instanceSpin = new THREE.Quaternion();
  const instanceCameraSpin = new THREE.Quaternion();

  for (let i = 0; i < impactRayCount; i++) {
    rayInstances.setColorAt(i, new THREE.Color(impactRayStates[i].pale ? PALE_GOLD : GOLD));
  }
  for (let i = 0; i < impactSparkCount; i++) {
    sparkInstances.setColorAt(i, new THREE.Color(impactSparkStates[i].pale ? 0xfff3c0 : 0xffbd42));
  }
  rayInstances.instanceColor.needsUpdate = true;
  sparkInstances.instanceColor.needsUpdate = true;

  function createProjectile(start, end) {
    const delta = end.clone().sub(start);
    const distance = Math.max(0.001, delta.length());
    projectileGroup.position.copy(start);
    projectileGroup.quaternion.setFromUnitVectors(projectileAxis, delta.normalize());
    projectileTrail.scale.set(distance, 1, 1);
    projectileCore.position.set(0, 0, 0);
    projectileHalo.position.set(0, 0, 0);
    projectileLight.position.set(0, 0, 0);
    projectileGroup.visible = true;
    projectile = {
      progress: 0,
      distance,
      duration: THREE.MathUtils.clamp(distance / 28, 0.18, 0.46)
    };
  }

  function disposeProjectile() {
    if (!projectile) return;
    projectileGroup.visible = false;
    projectile = null;
  }

  function createImpact(position, floorHeight = position.y - 1) {
    impactGroup.position.copy(position);
    impactGroup.visible = true;
    impactAge = 0;
    impactActive = true;

    impactFlash.scale.setScalar(0.18);
    impactFlash.material.opacity = 0.98;
    impactShell.scale.setScalar(0.18);
    impactShell.material.opacity = 0.78;
    impactCoreSprite.scale.set(0.9, 0.9, 1);
    impactCoreMaterial.opacity = 0.98;
    floorSigil.position.y = floorHeight - position.y + 0.025;
    floorSigil.scale.setScalar(0.34);
    floorSigilMaterial.opacity = 0.82;
    shockwave.quaternion.copy(camera.quaternion);
    shockwave.scale.setScalar(0.3);
    shockwave.material.opacity = 0.98;
    groundWave.position.y = floorHeight - position.y + 0.045;
    groundWave.scale.setScalar(0.24);
    groundWave.material.opacity = 0.94;
    slash.scale.set(1.1, 0.8, 1);
    slash.material.rotation = -0.35;
    slashMaterial.opacity = 0.9;

    for (const ray of impactRayStates) {
      ray.direction.set(
        Math.random() * 2 - 1,
        0.12 + Math.random() * 1.15,
        Math.random() * 2 - 1
      ).normalize();
    }
    for (const spark of impactSparkStates) {
      spark.velocity.set(
        Math.random() * 2 - 1,
        Math.random() * 1.8 - 0.05,
        Math.random() * 2 - 1
      ).normalize();
      spark.position.copy(spark.velocity).multiplyScalar(0.12 + Math.random() * 0.18);
      spark.velocity.multiplyScalar(2.8 + Math.random() * 4.8);
      spark.spin = Math.random() * Math.PI * 2;
    }
    for (const puff of impactSmokeStates) {
      puff.position.set(
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.42,
        (Math.random() - 0.5) * 0.5
      );
      puff.velocity.set(
        (Math.random() - 0.5) * 0.65,
        0.18 + Math.random() * 0.48,
        (Math.random() - 0.5) * 0.65
      );
      puff.phase = Math.random() * Math.PI * 2;
    }
  }

  function updateImpact(dt) {
    if (!impactActive) return;
    impactAge += dt;
    const t = Math.min(1, impactAge / 1.42);
    const fade = 1 - t;

    impactFlash.scale.setScalar(0.18 + t * 3.1);
    impactFlash.material.opacity = 0.98 * fade;
    impactShell.scale.setScalar(0.18 + t * 2.9);
    impactShell.material.opacity = 0.78 * fade;
    impactCoreSprite.scale.setScalar(0.35 + t * 2.3);
    impactCoreMaterial.opacity = 0.98 * fade;
    floorSigil.scale.setScalar(0.34 + t * 2.55);
    floorSigilMaterial.opacity = 0.82 * fade;
    shockwave.scale.setScalar(0.3 + t * 3.8);
    shockwave.material.opacity = 0.98 * fade;
    groundWave.scale.setScalar(0.24 + t * 4.2);
    groundWave.material.opacity = 0.94 * fade;
    slash.scale.set(1.1 + t * 2.5, 0.8 + t * 1.1, 1);
    slashMaterial.opacity = 0.9 * fade;
    slashMaterial.rotation += dt * 1.8;

    rayInstances.material.opacity = 0.94 * fade;
    for (let i = 0; i < impactRayCount; i++) {
      const ray = impactRayStates[i];
      instanceDummy.position.copy(ray.direction).multiplyScalar(0.2 + t * 0.48);
      instanceDummy.quaternion.setFromUnitVectors(instanceUp, ray.direction);
      instanceDummy.scale.set(1, ray.length * (0.82 + t * 0.9), 1);
      instanceDummy.updateMatrix();
      rayInstances.setMatrixAt(i, instanceDummy.matrix);
    }
    rayInstances.instanceMatrix.needsUpdate = true;

    sparkMaterial.opacity = fade;
    instanceCameraSpin.copy(camera.quaternion);
    for (let i = 0; i < impactSparkCount; i++) {
      const spark = impactSparkStates[i];
      spark.velocity.y -= 5.4 * dt;
      spark.position.addScaledVector(spark.velocity, dt);
      spark.spin += dt * 7;
      const size = spark.baseSize * (0.78 + fade * 0.4);
      instanceSpin.setFromAxisAngle(instanceZ, spark.spin);
      instanceDummy.position.copy(spark.position);
      instanceDummy.quaternion.copy(instanceCameraSpin).multiply(instanceSpin);
      instanceDummy.scale.set(size, size, 1);
      instanceDummy.updateMatrix();
      sparkInstances.setMatrixAt(i, instanceDummy.matrix);
    }
    sparkInstances.instanceMatrix.needsUpdate = true;

    smokeMaterial.opacity = 0.28 * fade;
    for (let i = 0; i < impactSmokeCount; i++) {
      const puff = impactSmokeStates[i];
      puff.position.addScaledVector(puff.velocity, dt);
      puff.position.y += Math.sin(impactAge * 3.2 + puff.phase) * dt * 0.08;
      const size = puff.baseSize * (0.8 + t * 1.65);
      instanceSpin.setFromAxisAngle(instanceZ, impactAge * 0.35 + puff.phase);
      instanceDummy.position.copy(puff.position);
      instanceDummy.quaternion.copy(instanceCameraSpin).multiply(instanceSpin);
      instanceDummy.scale.set(size, size, 1);
      instanceDummy.updateMatrix();
      smokeInstances.setMatrixAt(i, instanceDummy.matrix);
    }
    smokeInstances.instanceMatrix.needsUpdate = true;

    if (t >= 1) {
      impactActive = false;
      impactGroup.visible = false;
    }
  }

  async function prepare(renderer) {
    if (!renderer || typeof renderer.compileAsync !== 'function') return false;
    const warmScene = new THREE.Scene();
    const warmCamera = new THREE.PerspectiveCamera(55, 1, 0.1, 50);
    warmCamera.position.set(0, 0, 5);
    warmCamera.lookAt(0, 0, 0);
    const warmObjects = [glyphGroup, projectileGroup, impactGroup];
    try {
      for (const object of warmObjects) {
        scene.remove(object);
        object.visible = true;
        object.position.set(0, 0, 0);
        warmScene.add(object);
      }
      await renderer.compileAsync(warmScene, warmCamera);
      return true;
    } catch (error) {
      console.warn('HA-DI: pré-compilação indisponível; o feitiço continuará com compilação normal.', error);
      return false;
    } finally {
      for (const object of warmObjects) {
        warmScene.remove(object);
        object.visible = false;
        scene.add(object);
      }
    }
  }

  function handTransform() {
    const position = character.getHandWorldPosition
      ? character.getHandWorldPosition('Right', new THREE.Vector3())
      : controller.getPosition().clone().add(new THREE.Vector3(0.36, 1.35, 0.22));
    const quaternion = character.getHandWorldQuaternion
      ? character.getHandWorldQuaternion('Right', new THREE.Quaternion())
      : character.model.getWorldQuaternion(new THREE.Quaternion());
    const direction = new THREE.Vector3(0, 1, 0).applyQuaternion(quaternion).normalize();
    if (direction.lengthSq() < 0.01) direction.set(0, 0, 1);
    return { position, direction };
  }

  function updateGlyphAnchor() {
    const hand = handTransform();
    glyphGroup.position.copy(hand.position)
      .addScaledVector(hand.direction, 0.19)
      .add(new THREE.Vector3(0, 0.045, 0));
    // Billboard espacial: continua preso à mão no mundo, mas legível pela câmera de terceira pessoa.
    glyphGroup.quaternion.copy(camera.quaternion);
  }

  function finishCast() {
    disposeProjectile();
    glyphGroup.visible = false;
    glyphMaterial.opacity = 0;
    character.setCastingHandPose?.(false);
    character.setCastingBodyPose?.(false);
    character.stopAction?.();
    character.lookAt?.(null);
    controller.setLocked(false);
    casting = false;
    activeTarget = null;
    impactApplied = false;
  }

  function canCastHaDi() {
    if (casting || controller.zone !== 'training' || !canSpendEnergy(spellCost)) return false;
    return Boolean(trainingRoom.findHaDiTarget({
      position: controller.getPosition(),
      forward: controller.getForward(),
      zone: controller.zone
    }));
  }

  function castHaDi() {
    if (casting) return { success: false, message: 'Carter já está conjurando HA-DI.' };
    if (!canSpendEnergy(spellCost)) {
      return { success: false, message: 'Energia insuficiente para conjurar HA-DI. Aguarde a recarga.' };
    }
    const target = trainingRoom.findHaDiTarget({
      position: controller.getPosition(),
      forward: controller.getForward(),
      zone: controller.zone
    });
    if (!target) {
      return {
        success: false,
        message: 'HA-DI exige um Shabti desperto à sua frente, entre 3,5 e 12,5 metros.'
      };
    }

    if (!spendEnergy(spellCost)) {
      return { success: false, message: 'Não foi possível consumir a energia necessária para HA-DI.' };
    }
    activeTarget = target;
    casting = true;
    castElapsed = 0;
    impactApplied = false;
    glyphGroup.visible = true;
    glyphGroup.scale.setScalar(0.12);
    glyphMaterial.opacity = 1;
    controller.setLocked(true);
    character.lookAt?.(null);
    character.faceTarget?.(target.position);
    character.setCastingBodyPose?.(true);
    const throwStarted = character.playAction?.('throw_grenade', { fade: 0.16, interruptOnMovement: false });
    if (!throwStarted) character.playAction?.('point');
    character.setCastingHandPose?.(true);
    updateGlyphAnchor();

    return { success: true, message: 'HA-DI! A inscrição dourada se acende diante da mão de Carter.' };
  }

  function update(dt) {
    if (casting) {
      castElapsed += dt;
      if (controller.zone !== 'training') {
        finishCast();
      } else {
        updateGlyphAnchor();
        const reveal = THREE.MathUtils.clamp(castElapsed / 0.2, 0, 1);
        glyphGroup.scale.setScalar((0.12 + reveal * 0.68) * (1 + Math.sin(castElapsed * 23) * 0.035));
        glyphMaterial.opacity = castElapsed < 1.08
          ? 1
          : THREE.MathUtils.clamp(1 - (castElapsed - 1.08) / 0.36, 0, 1);

        // Ara throw_grenade solta o objeto aos 0,82 s; o pulso HA-DI usa esse marco.
        if (castElapsed >= 0.82 && !projectile && !impactApplied && activeTarget) {
          const hand = handTransform();
          const start = hand.position.clone().addScaledVector(hand.direction, 0.28);
          createProjectile(start, activeTarget.position.clone());
        }

        if (projectile && activeTarget) {
          projectile.progress = Math.min(1, projectile.progress + dt / projectile.duration);
          const t = projectile.progress;
          projectilePath.getPoint(t, projectilePoint);
          projectilePoint.x *= projectile.distance;
          projectileCore.position.copy(projectilePoint);
          projectileHalo.position.copy(projectilePoint);
          projectileLight.position.copy(projectilePoint);
          const pulse = 0.9 + Math.sin(castElapsed * 35) * 0.16;
          projectileCore.scale.setScalar(pulse);
          projectileHalo.scale.setScalar(0.8 + pulse * 0.35);

          if (t >= 1 && !impactApplied) {
            impactApplied = true;
            const targetFloorY = activeTarget.state.group.position.y;
            const impactPosition = activeTarget.state.group.position.clone()
              .add(new THREE.Vector3(0, 1.05 * activeTarget.state.fullScale, 0));
            const destroyed = trainingRoom.applyHaDi(activeTarget);
            if (destroyed) createImpact(impactPosition, targetFloorY);
            disposeProjectile();
          }
        }

        if (castElapsed >= 2.24) finishCast();
      }
    }
    updateImpact(dt);
  }

  return {
    castHaDi,
    canCastHaDi,
    update,
    prepare,
    get isCasting() { return casting; }
  };
}

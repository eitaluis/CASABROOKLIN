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
  const haloCanvas = document.createElement('canvas');
  haloCanvas.width = haloCanvas.height = 256;
  const haloContext = haloCanvas.getContext('2d');
  const haloGradient = haloContext.createRadialGradient(128, 128, 4, 128, 128, 126);
  haloGradient.addColorStop(0, 'rgba(255,248,218,0.92)');
  haloGradient.addColorStop(0.2, 'rgba(255,211,106,0.62)');
  haloGradient.addColorStop(0.58, 'rgba(255,164,40,0.18)');
  haloGradient.addColorStop(1, 'rgba(255,164,40,0)');
  haloContext.fillStyle = haloGradient;
  haloContext.fillRect(0, 0, 256, 256);
  const haloTexture = new THREE.CanvasTexture(haloCanvas);
  haloTexture.colorSpace = THREE.SRGBColorSpace;
  const glyphHalo = new THREE.Mesh(new THREE.PlaneGeometry(1.02, 0.86), new THREE.MeshBasicMaterial({
    map: haloTexture, color: 0xffd36a, transparent: true, opacity: 0.84,
    blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
  }));
  glyphHalo.position.z = -0.022;
  glyphGroup.add(glyphHalo);
  const glyphPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 0.62), glyphMaterial);
  glyphPlane.position.z = 0.012;
  glyphGroup.add(glyphPlane);

  const ringMaterial = new THREE.MeshBasicMaterial({
    color: GOLD,
    transparent: true,
    opacity: 0.78,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false
  });
  const glyphRing = new THREE.Mesh(new THREE.TorusGeometry(0.43, 0.012, 8, 72), ringMaterial);
  glyphGroup.add(glyphRing);
  const glyphRingInner = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.006, 6, 72), ringMaterial.clone());
  glyphRingInner.material.opacity = 0.68;
  glyphRingInner.scale.set(1, 0.72, 1);
  glyphGroup.add(glyphRingInner);
  const glyphRingOuter = new THREE.Mesh(new THREE.TorusGeometry(0.53, 0.008, 6, 88), ringMaterial.clone());
  glyphRingOuter.material.opacity = 0.78;
  glyphRingOuter.scale.set(1, 0.78, 1);
  glyphGroup.add(glyphRingOuter);
  const glyphLight = new THREE.PointLight(GOLD, 2.8, 2.8, 2);
  glyphGroup.add(glyphLight);

  // Sprites CC0 do Kenney Particle Pack: decodificados localmente no navegador.
  function fallbackSprite(kind) {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 128;
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
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 128, 128);
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }
  const spriteTextures = {
    magic: fallbackSprite('magic'), smoke: fallbackSprite('smoke'),
    circle: fallbackSprite('magic'), spark: fallbackSprite('magic'), slash: fallbackSprite('magic')
  };
  async function loadKenneySprite(key, filename) {
    try {
      const response = await fetch(new URL('../assets/vfx/' + filename + '.b64', import.meta.url));
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const encoded = (await response.text()).replace(/\s/g, '');
      const image = new Image(); image.src = 'data:image/png;base64,' + encoded;
      if (image.decode) await image.decode();
      else await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject; });
      const texture = new THREE.Texture(image); texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4; texture.needsUpdate = true;
      spriteTextures[key].dispose(); spriteTextures[key] = texture;
    } catch (error) {
      console.warn('HA-DI: usando sprite procedural de fallback para ' + filename, error);
    }
  }
  loadKenneySprite('magic', 'kenney-magic-01.png');
  loadKenneySprite('smoke', 'kenney-smoke-03.png');
  loadKenneySprite('circle', 'kenney-circle-03.png');
  loadKenneySprite('spark', 'kenney-spark-07.png');
  loadKenneySprite('slash', 'kenney-slash-02.png');

  const activeEffects = [];
  let casting = false;
  let castElapsed = 0;
  let activeTarget = null;
  let projectile = null;
  let impactApplied = false;

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

  function disposeProjectile() {
    if (!projectile) return;
    scene.remove(projectile.group);
    projectile.group.traverse((object) => {
      if (!object.isMesh) return;
      object.geometry?.dispose?.();
      if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
      else object.material?.dispose?.();
    });
    projectile = null;
  }

  function createProjectile(start, end) {
    const group = new THREE.Group();
    group.name = 'HA-DI · pulso destrutivo dourado';
    const mid = start.clone().lerp(end, 0.48).add(new THREE.Vector3(0, 0.16, 0));
    const curve = new THREE.CatmullRomCurve3([start.clone(), mid, end.clone()]);
    const trailMaterial = new THREE.MeshBasicMaterial({
      color: GOLD, transparent: true, opacity: 0.9,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
    });
    const trail = new THREE.Mesh(new THREE.TubeGeometry(curve, 36, 0.032, 7, false), trailMaterial);
    group.add(trail);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: PALE_GOLD, transparent: true, opacity: 0.98,
      blending: THREE.AdditiveBlending, toneMapped: false
    });
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.105, 16, 12), coreMaterial);
    group.add(core);
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(0.19, 14, 10),
      new THREE.MeshBasicMaterial({
        color: GOLD, transparent: true, opacity: 0.32,
        blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
      })
    );
    group.add(halo);
    const light = new THREE.PointLight(GOLD, 2.2, 3.8, 2);
    group.add(light);
    scene.add(group);
    projectile = {
      group, curve, core, halo, light,
      progress: 0,
      duration: THREE.MathUtils.clamp(start.distanceTo(end) / 28, 0.18, 0.46)
    };
  }

  function createImpact(position, floorHeight = position.y - 1) {
    const group = new THREE.Group();
    group.name = 'HA-DI · explosão dourada em camadas';
    group.position.copy(position); scene.add(group);
    const flash = new THREE.Mesh(new THREE.SphereGeometry(0.25, 24, 16), new THREE.MeshBasicMaterial({
      color: 0xffefb8, transparent: true, opacity: 0.98, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
    }));
    const shell = new THREE.Mesh(new THREE.SphereGeometry(0.42, 22, 16), new THREE.MeshBasicMaterial({
      color: 0xffc34f, transparent: true, opacity: 0.78, wireframe: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
    }));
    group.add(flash, shell);
    const coreSprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: spriteTextures.magic, color: 0xffe6a0, transparent: true, opacity: 0.98,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
    }));
    coreSprite.scale.set(0.9, 0.9, 1); group.add(coreSprite);
    const floorSigil = new THREE.Mesh(new THREE.PlaneGeometry(1.75, 1.75), new THREE.MeshBasicMaterial({
      map: spriteTextures.circle, color: 0xffc04b, transparent: true, opacity: 0.82,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false
    }));
    floorSigil.rotation.x = -Math.PI / 2; floorSigil.position.y = floorHeight - position.y + 0.025; group.add(floorSigil);
    const shockwave = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.035, 8, 64), new THREE.MeshBasicMaterial({
      color: 0xffe3a0, transparent: true, opacity: 0.98, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
    }));
    shockwave.quaternion.copy(camera.quaternion); group.add(shockwave);
    const groundWave = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.026, 8, 64), new THREE.MeshBasicMaterial({
      color: GOLD, transparent: true, opacity: 0.94, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
    }));
    groundWave.rotation.x = -Math.PI / 2; groundWave.position.y = floorHeight - position.y + 0.045; group.add(groundWave);
    const slash = new THREE.Sprite(new THREE.SpriteMaterial({
      map: spriteTextures.slash, color: 0xffd36a, transparent: true, opacity: 0.9,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
    }));
    slash.scale.set(1.9, 1.15, 1); slash.material.rotation = -0.35; group.add(slash);
    const rays = [];
    for (let i = 0; i < 18; i++) {
      const direction = new THREE.Vector3(Math.random() * 2 - 1, 0.12 + Math.random() * 1.15, Math.random() * 2 - 1).normalize();
      const ray = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.032, 1, 5, 1), new THREE.MeshBasicMaterial({
        color: i % 4 === 0 ? PALE_GOLD : GOLD, transparent: true, opacity: 0.94,
        blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
      }));
      ray.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
      ray.position.copy(direction).multiplyScalar(0.22);
      const length = 0.72 + Math.random() * 0.72; ray.scale.y = length; group.add(ray);
      rays.push({ mesh: ray, direction, length });
    }
    const sparks = [];
    for (let i = 0; i < 46; i++) {
      const mesh = new THREE.Sprite(new THREE.SpriteMaterial({
        map: spriteTextures.spark, color: i % 4 === 0 ? 0xfff3c0 : 0xffbd42,
        transparent: true, opacity: 0.98, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
      }));
      const size = 0.075 + Math.random() * 0.12; mesh.scale.set(size, size, 1); group.add(mesh);
      const direction = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 1.8 - 0.05, Math.random() * 2 - 1).normalize();
      mesh.position.copy(direction).multiplyScalar(0.12 + Math.random() * 0.18);
      sparks.push({ mesh, velocity: direction.multiplyScalar(2.8 + Math.random() * 4.8), baseSize: size });
    }
    const smoke = [];
    for (let i = 0; i < 9; i++) {
      const mesh = new THREE.Sprite(new THREE.SpriteMaterial({
        map: spriteTextures.smoke, color: 0xc7a36a, transparent: true, opacity: 0.28,
        blending: THREE.NormalBlending, depthWrite: false, toneMapped: false
      }));
      const size = 0.3 + Math.random() * 0.34; mesh.scale.set(size, size, 1);
      mesh.position.set((Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.42, (Math.random() - 0.5) * 0.5);
      group.add(mesh);
      smoke.push({
        mesh, velocity: new THREE.Vector3((Math.random() - 0.5) * 0.65, 0.18 + Math.random() * 0.48, (Math.random() - 0.5) * 0.65),
        baseSize: size, phase: Math.random() * Math.PI * 2
      });
    }
    activeEffects.push({ group, flash, shell, coreSprite, floorSigil, shockwave, groundWave, slash, rays, sparks, smoke, age: 0, duration: 1.42 });
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
    character.playAction?.('point');
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
        const reveal = THREE.MathUtils.clamp(castElapsed / 0.16, 0, 1);
        glyphGroup.scale.setScalar((0.12 + reveal * 0.68) * (1 + Math.sin(castElapsed * 23) * 0.035));
        glyphRing.rotation.z += dt * 1.15;
        glyphRingInner.rotation.z -= dt * 1.8;
        glyphRingOuter.rotation.z += dt * 2.15;
        glyphLight.intensity = 2.8 + Math.sin(castElapsed * 28) * 1.05;
        glyphMaterial.opacity = castElapsed < 0.7
          ? 1
          : THREE.MathUtils.clamp(1 - (castElapsed - 0.7) / 0.38, 0, 1);

        if (castElapsed >= 0.38 && !projectile && !impactApplied && activeTarget) {
          const hand = handTransform();
          const start = hand.position.clone().addScaledVector(hand.direction, 0.28);
          createProjectile(start, activeTarget.position.clone());
        }

        if (projectile && activeTarget) {
          projectile.progress = Math.min(1, projectile.progress + dt / projectile.duration);
          const t = projectile.progress;
          const point = projectile.curve.getPoint(t);
          projectile.core.position.copy(point);
          projectile.halo.position.copy(point);
          projectile.light.position.copy(point);
          const pulse = 0.9 + Math.sin(castElapsed * 35) * 0.16;
          projectile.core.scale.setScalar(pulse);
          projectile.halo.scale.setScalar(0.8 + pulse * 0.35);
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

        if (castElapsed >= 1.48) finishCast();
      }
    }

    for (let i = activeEffects.length - 1; i >= 0; i--) {
      const effect = activeEffects[i]; effect.age += dt;
      const t = Math.min(1, effect.age / effect.duration), fade = 1 - t;
      effect.flash.scale.setScalar(0.18 + t * 3.1); effect.flash.material.opacity = 0.98 * fade;
      effect.shell.scale.setScalar(0.18 + t * 2.9); effect.shell.material.opacity = 0.78 * fade;
      effect.coreSprite.scale.setScalar(0.35 + t * 2.3); effect.coreSprite.material.opacity = 0.98 * fade;
      effect.floorSigil.scale.setScalar(0.34 + t * 2.55); effect.floorSigil.material.opacity = 0.82 * fade;
      effect.shockwave.scale.setScalar(0.3 + t * 3.8); effect.shockwave.material.opacity = 0.98 * fade;
      effect.groundWave.scale.setScalar(0.24 + t * 4.2); effect.groundWave.material.opacity = 0.94 * fade;
      effect.slash.scale.set(1.1 + t * 2.5, 0.8 + t * 1.1, 1);
      effect.slash.material.opacity = 0.9 * fade; effect.slash.material.rotation += dt * 1.8;
      for (const ray of effect.rays) {
        ray.mesh.position.copy(ray.direction).multiplyScalar(0.2 + t * 0.48);
        ray.mesh.scale.y = ray.length * (0.82 + t * 0.9); ray.mesh.material.opacity = 0.94 * fade;
      }
      for (const spark of effect.sparks) {
        spark.velocity.y -= 5.4 * dt; spark.mesh.position.addScaledVector(spark.velocity, dt);
        spark.mesh.material.rotation += dt * 7; spark.mesh.material.opacity = Math.max(0, fade);
        spark.mesh.scale.setScalar(spark.baseSize * (0.78 + fade * 0.4));
      }
      for (const puff of effect.smoke) {
        puff.mesh.position.addScaledVector(puff.velocity, dt); puff.mesh.material.rotation += dt * 0.35;
        puff.mesh.material.opacity = 0.28 * fade;
        const size = puff.baseSize * (0.8 + t * 1.65); puff.mesh.scale.set(size, size, 1);
        puff.mesh.position.y += Math.sin(effect.age * 3.2 + puff.phase) * dt * 0.08;
      }
      if (t >= 1) {
        scene.remove(effect.group);
        effect.group.traverse(object => {
          object.geometry?.dispose?.();
          if (Array.isArray(object.material)) object.material.forEach(material => material.dispose());
          else object.material?.dispose?.();
        });
        activeEffects.splice(i, 1);
      }
    }
  }

  return {
    castHaDi,
    canCastHaDi,
    update,
    get isCasting() { return casting; }
  };
}

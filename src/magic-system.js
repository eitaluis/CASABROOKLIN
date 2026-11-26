import * as THREE from 'three';

// HA-DI — primeira habilidade jogável da Casa Brooklyn.
// O desenho do hieróglifo segue a sequência publicada por Frances Foster:
// ḥḏ = 𓉔𓆓 (O4 + I10). Os efeitos e tempos são adaptações de gameplay.
export function createMagicSystem({
  scene,
  camera,
  character,
  controller,
  trainingRoom
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
  glyphContext.clearRect(0, 0, 768, 512);
  glyphContext.textAlign = 'center';
  glyphContext.textBaseline = 'middle';
  glyphContext.shadowColor = '#ffbd42';
  glyphContext.shadowBlur = 34;
  glyphContext.fillStyle = '#fff0bd';
  glyphContext.font = '190px "Noto Sans Egyptian Hieroglyphs", "Segoe UI Historic", serif';
  glyphContext.fillText('𓉔𓆓', 384, 222);
  glyphContext.shadowBlur = 13;
  glyphContext.fillStyle = '#ffd36a';
  glyphContext.font = '600 42px Georgia, serif';
  glyphContext.letterSpacing = '12px';
  glyphContext.fillText('HA-DI', 384, 420);
  const glyphTexture = new THREE.CanvasTexture(glyphCanvas);
  glyphTexture.colorSpace = THREE.SRGBColorSpace;
  glyphTexture.anisotropy = 4;

  const glyphMaterial = new THREE.MeshBasicMaterial({
    map: glyphTexture,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    toneMapped: false
  });
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
  glyphRingInner.material.opacity = 0.42;
  glyphRingInner.scale.set(1, 0.72, 1);
  glyphGroup.add(glyphRingInner);

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

  function createImpact(position) {
    const flash = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 18, 14),
      new THREE.MeshBasicMaterial({
        color: 0xffe2a0, transparent: true, opacity: 0.92,
        blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
      })
    );
    flash.position.copy(position);
    scene.add(flash);

    const shockwave = new THREE.Mesh(
      new THREE.TorusGeometry(0.28, 0.045, 8, 48),
      new THREE.MeshBasicMaterial({
        color: GOLD, transparent: true, opacity: 0.9,
        blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
      })
    );
    shockwave.position.copy(position);
    shockwave.quaternion.copy(camera.quaternion);
    scene.add(shockwave);

    const sparks = [];
    for (let i = 0; i < 24; i++) {
      const mesh = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.025 + Math.random() * 0.025, 0),
        new THREE.MeshBasicMaterial({
          color: i % 3 === 0 ? PALE_GOLD : GOLD,
          transparent: true, opacity: 0.95,
          blending: THREE.AdditiveBlending, toneMapped: false
        })
      );
      mesh.position.copy(position);
      scene.add(mesh);
      const direction = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 1.6 - 0.25,
        Math.random() * 2 - 1
      ).normalize();
      sparks.push({ mesh, velocity: direction.multiplyScalar(2.2 + Math.random() * 4.5) });
    }
    activeEffects.push({ flash, shockwave, sparks, age: 0, duration: 0.62 });
  }

  function finishCast() {
    disposeProjectile();
    glyphGroup.visible = false;
    glyphMaterial.opacity = 0;
    character.setCastingHandPose?.(false);
    character.lookAt?.(null);
    controller.setLocked(false);
    casting = false;
    activeTarget = null;
    impactApplied = false;
  }

  function canCastHaDi() {
    if (casting || controller.zone !== 'training') return false;
    return Boolean(trainingRoom.findHaDiTarget({
      position: controller.getPosition(),
      forward: controller.getForward(),
      zone: controller.zone
    }));
  }

  function castHaDi() {
    if (casting) return { success: false, message: 'Carter já está conjurando HA-DI.' };
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

    activeTarget = target;
    casting = true;
    castElapsed = 0;
    impactApplied = false;
    glyphGroup.visible = true;
    glyphGroup.scale.setScalar(0.12);
    glyphMaterial.opacity = 1;
    controller.setLocked(true);
    character.lookAt?.(target.position, { amount: 0.9, smoothing: 0.28 });
    character.setCastingHandPose?.(true);
    character.playAction?.('point');
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
        glyphGroup.scale.setScalar(0.12 + reveal * 0.88);
        glyphRing.rotation.z += dt * 1.15;
        glyphRingInner.rotation.z -= dt * 1.8;
        glyphMaterial.opacity = castElapsed < 0.7
          ? 1
          : THREE.MathUtils.clamp(1 - (castElapsed - 0.7) / 0.38, 0, 1);

        if (castElapsed >= 0.38 && !projectile && activeTarget) {
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
            const destroyed = trainingRoom.applyHaDi(activeTarget);
            if (destroyed) createImpact(activeTarget.position.clone());
            disposeProjectile();
          }
        }

        if (castElapsed >= 1.48) finishCast();
      }
    }

    for (let i = activeEffects.length - 1; i >= 0; i--) {
      const effect = activeEffects[i];
      effect.age += dt;
      const t = Math.min(1, effect.age / effect.duration);
      effect.flash.scale.setScalar(0.25 + t * 2.6);
      effect.flash.material.opacity = 0.92 * (1 - t);
      effect.shockwave.scale.setScalar(0.4 + t * 3.1);
      effect.shockwave.material.opacity = 0.9 * (1 - t);
      for (const spark of effect.sparks) {
        spark.velocity.y -= 5.8 * dt;
        spark.mesh.position.addScaledVector(spark.velocity, dt);
        spark.mesh.rotation.x += dt * 8;
        spark.mesh.rotation.y += dt * 11;
        spark.mesh.material.opacity = Math.max(0, 1 - t);
      }
      if (t >= 1) {
        scene.remove(effect.flash, effect.shockwave);
        effect.flash.geometry.dispose(); effect.flash.material.dispose();
        effect.shockwave.geometry.dispose(); effect.shockwave.material.dispose();
        for (const spark of effect.sparks) {
          scene.remove(spark.mesh);
          spark.mesh.geometry.dispose(); spark.mesh.material.dispose();
        }
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

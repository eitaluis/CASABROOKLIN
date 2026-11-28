import * as THREE from 'three';

// Defesa rápida inspirada na função canônica da varinha egípcia.
// Duração, custo, escudo esférico e bloqueio frontal são adaptações de gameplay.
export function createProtectionSystem({
  THREE: Three = THREE,
  scene,
  character,
  controller,
  canSpendEnergy = () => true,
  spendEnergy = () => true,
  energyCost = 18,
  duration = 0.92
}) {
  const root = new Three.Group();
  root.name = 'CarterProtectiveWard';
  root.visible = false;
  scene.add(root);

  // Varinha curta e curva, inspirada no formato de marfim de hipopótamo
  // descrito no material oficial de As Crônicas dos Kane.
  const wand = new Three.Group();
  wand.name = 'CarterIvoryDefensiveWand';
  const ivory = new Three.MeshStandardMaterial({
    color: 0xe8dfc8, roughness: 0.72, metalness: 0.015
  });
  const ivoryShade = new Three.MeshStandardMaterial({
    color: 0xb9aa8d, roughness: 0.82, metalness: 0.01
  });
  const tusk = new Three.Shape();
  tusk.moveTo(-0.035, -0.19);
  tusk.quadraticCurveTo(-0.075, -0.08, -0.025, 0.035);
  tusk.quadraticCurveTo(0.02, 0.15, 0.17, 0.22);
  tusk.quadraticCurveTo(0.105, 0.105, 0.075, 0.015);
  tusk.quadraticCurveTo(0.035, -0.095, 0.035, -0.19);
  tusk.closePath();
  const tuskMesh = new Three.Mesh(
    new Three.ExtrudeGeometry(tusk, {
      depth: 0.035, bevelEnabled: true, bevelSegments: 3,
      bevelSize: 0.012, bevelThickness: 0.01, curveSegments: 18
    }),
    ivory
  );
  tuskMesh.name = 'CurvedHippoIvoryWand';
  tuskMesh.position.z = -0.0175;
  tuskMesh.castShadow = true;
  wand.add(tuskMesh);
  const grip = new Three.Mesh(
    new Three.CylinderGeometry(0.018, 0.021, 0.11, 12),
    ivoryShade
  );
  grip.position.set(0.005, -0.12, 0.018);
  grip.rotation.z = -0.12;
  wand.add(grip);
  root.add(wand);

  const shieldMaterial = new Three.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: Three.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uAlpha: { value: 0 },
      uPulse: { value: 0 }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec3 vLocal;
      void main() {
        vLocal = position;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uAlpha;
      uniform float uPulse;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec3 vLocal;
      void main() {
        vec3 N = normalize(vNormal);
        vec3 V = normalize(vViewPosition);
        float fresnel = pow(1.0 - abs(dot(N, V)), 2.6);
        float flow = 0.5 + 0.5 * sin(vLocal.y * 18.0 + uTime * 5.5
          + sin(vLocal.x * 11.0 + uTime * 2.2) * 0.8);
        float lattice = smoothstep(0.78, 0.98,
          sin(vLocal.x * 24.0 + uTime * 1.4) * sin(vLocal.y * 24.0 - uTime * 1.7));
        float edge = smoothstep(0.18, 0.95, fresnel);
        vec3 cyan = vec3(0.20, 0.82, 0.92);
        vec3 pale = vec3(0.78, 0.97, 1.0);
        vec3 color = mix(cyan, pale, clamp(edge * 0.8 + lattice * 0.25, 0.0, 1.0));
        float alpha = uAlpha * (0.045 + edge * 0.34 + lattice * 0.055 + flow * 0.025)
          + uPulse * edge * 0.18;
        gl_FragColor = vec4(color, alpha);
      }
    `
  });
  const shield = new Three.Mesh(new Three.SphereGeometry(1, 48, 32), shieldMaterial);
  shield.name = 'TranslucentCyanProtectiveField';
  shield.scale.set(1.12, 0.92, 1.12);
  shield.renderOrder = 8;
  root.add(shield);

  const rimMaterial = new Three.MeshBasicMaterial({
    color: 0x9cefff, transparent: true, opacity: 0.48,
    blending: Three.AdditiveBlending, depthWrite: false
  });
  const rim = new Three.Mesh(new Three.SphereGeometry(1.005, 40, 24), rimMaterial);
  rim.scale.copy(shield.scale).multiplyScalar(1.006);
  root.add(rim);

  const impacts = [];
  let active = false;
  let elapsed = 0;
  let cooldown = 0;
  let previousAction = null;

  function activate() {
    if (active || cooldown > 0) return { success: false, message: 'A proteção ainda está se dissipando.' };
    if (!canSpendEnergy(energyCost)) {
      return { success: false, message: 'Energia insuficiente para erguer a proteção. São necessários 18 pontos.' };
    }
    if (!spendEnergy(energyCost)) {
      return { success: false, message: 'Não foi possível consumir a energia da proteção.' };
    }
    active = true;
    elapsed = 0;
    root.visible = true;
    shieldMaterial.uniforms.uAlpha.value = 0;
    shieldMaterial.uniforms.uPulse.value = 0.9;
    previousAction = character.action || null;
    character.playAction?.('fight_idle', {
      loop: true, fade: 0.12, interruptOnMovement: false
    });
    return { success: true, message: 'Proteção erguida.' };
  }

  function makeImpact(hit) {
    const player = controller.getPosition();
    const attacker = hit?.attacker?.clone?.();
    let normal = attacker
      ? player.clone().sub(attacker).setY(0).normalize()
      : controller.getForward().clone().multiplyScalar(-1);
    if (normal.lengthSq() < 0.001) normal.set(0, 0, 1);
    const center = player.clone().add(new Three.Vector3(0, character.height * 0.52, 0));
    const point = center.clone().addScaledVector(normal, 1.08);
    const ring = new Three.Mesh(
      new Three.TorusGeometry(0.16, 0.012, 8, 48),
      new Three.MeshBasicMaterial({
        color: 0xb8f6ff, transparent: true, opacity: 0.9,
        blending: Three.AdditiveBlending, depthWrite: false
      })
    );
    ring.position.copy(point);
    ring.quaternion.setFromUnitVectors(new Three.Vector3(0, 0, 1), normal);
    ring.renderOrder = 10;
    scene.add(ring);
    impacts.push({ ring, elapsed: 0, duration: 0.42 });
    shieldMaterial.uniforms.uPulse.value = 1.0;
  }

  function tryBlockHit(hit) {
    if (!active) return false;
    if (hit?.attacker && hit?.playerPosition) {
      const towardPlayer = hit.playerPosition.clone().sub(hit.attacker).setY(0).normalize();
      const forward = controller.getForward().clone().setY(0).normalize();
      // A proteção cobre o arco frontal; ataques pelas costas continuam perigosos.
      if (forward.dot(towardPlayer.clone().negate()) < -0.05) return false;
    }
    makeImpact(hit);
    return true;
  }

  function update(dt) {
    cooldown = Math.max(0, cooldown - dt);
    const playerPosition = controller.getPosition();
    const handPosition = character.getHandWorldPosition?.('Right', new Three.Vector3())
      || playerPosition.clone().add(new Three.Vector3(0.28, 1.18, -0.2));
    const handQuaternion = character.getHandWorldQuaternion?.('Right', new Three.Quaternion())
      || new Three.Quaternion();
    wand.position.copy(handPosition);
    wand.quaternion.copy(handQuaternion);
    wand.rotateX(-0.22);
    wand.rotateY(Math.PI * 0.5);
    wand.scale.setScalar(character.height / 1.75);

    for (let i = impacts.length - 1; i >= 0; i--) {
      const item = impacts[i];
      item.elapsed += dt;
      const p = Three.MathUtils.clamp(item.elapsed / item.duration, 0, 1);
      item.ring.scale.setScalar(0.65 + p * 2.25);
      item.ring.material.opacity = (1 - p) * 0.9;
      if (p >= 1) {
        scene.remove(item.ring);
        item.ring.geometry.dispose();
        item.ring.material.dispose();
        impacts.splice(i, 1);
      }
    }

    if (!active) return;
    elapsed += dt;
    const reveal = Three.MathUtils.clamp(elapsed / 0.12, 0, 1);
    const fade = Three.MathUtils.clamp((duration - elapsed) / 0.18, 0, 1);
    root.position.copy(playerPosition);
    root.position.y += character.height * 0.52;
    root.scale.setScalar(character.height / 1.75);
    shieldMaterial.uniforms.uTime.value += dt;
    shieldMaterial.uniforms.uAlpha.value = reveal * fade;
    shieldMaterial.uniforms.uPulse.value = Math.max(0, shieldMaterial.uniforms.uPulse.value - dt * 2.8);
    rimMaterial.opacity = 0.48 * reveal * fade;
    shield.rotation.y += dt * 0.18;
    if (elapsed >= duration) {
      active = false;
      root.visible = false;
      wand.visible = false;
      cooldown = 0.35;
      character.resumeLocomotion?.();
      previousAction = null;
    }
  }

  return {
    activate,
    tryBlockHit,
    update,
    get isActive() { return active; },
    get energyCost() { return energyCost; },
    dispose() {
      root.removeFromParent();
      shield.geometry.dispose();
      shieldMaterial.dispose();
      rim.geometry.dispose();
      rimMaterial.dispose();
      tuskMesh.geometry.dispose();
      grip.geometry.dispose();
      ivory.dispose();
      ivoryShade.dispose();
      for (const item of impacts) {
        scene.remove(item.ring);
        item.ring.geometry.dispose();
        item.ring.material.dispose();
      }
    }
  };
}

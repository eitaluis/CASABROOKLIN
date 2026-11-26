import * as THREE from 'three';
const palette = {
  skin: new THREE.MeshStandardMaterial({ color: 0x603a2d, roughness: 0.82 }),
  jacket: new THREE.MeshStandardMaterial({ color: 0x315f91, roughness: 0.88 }),
  shirt: new THREE.MeshStandardMaterial({ color: 0xd8d1bd, roughness: 0.92 }),
  trousers: new THREE.MeshStandardMaterial({ color: 0xb9a078, roughness: 0.9 }),
  shoes: new THREE.MeshStandardMaterial({ color: 0x49372b, roughness: 0.75 }),
  leather: new THREE.MeshStandardMaterial({ color: 0x765638, roughness: 0.82 }),
  hair: new THREE.MeshStandardMaterial({ color: 0x151719, roughness: 0.92 }),
  brass: new THREE.MeshStandardMaterial({ color: 0xb58d50, metalness: 0.62, roughness: 0.32 })
};

function addCapsule(parent, material, radius, length, position, scale = [1, 1, 1]) {
  const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(radius, length, 5, 10), material);
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function makeFallbackFigure(scene) {
  const root = new THREE.Group();
  root.name = 'BrooklynHouse_PlayerFallback';
  root.scale.set(0.94, 0.86, 0.94);
  scene.add(root);
  const joints = {};
  const sphere = (name, parent, size, pos, material) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), material);
    mesh.name = name;
    mesh.scale.set(...size);
    mesh.position.set(...pos);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };
  const torso = sphere('blue shirt torso', root, [0.245, 0.36, 0.15], [0, 1.20, 0], palette.jacket);
  sphere('shirt collar', root, [0.115, 0.08, 0.155], [0, 1.49, -0.02], palette.shirt);
  const head = sphere('Carter head', root, [0.15, 0.175, 0.14], [0, 1.78, 0], palette.skin);
  sphere('curly hair base', root, [0.155, 0.105, 0.148], [0, 1.895, 0.008], palette.hair);
  const eyeWhite = new THREE.MeshStandardMaterial({ color: 0xf1e7d6, roughness: 0.45 });
  const eyeDark = new THREE.MeshStandardMaterial({ color: 0x241913, roughness: 0.35 });
  for (const side of [-1, 1]) {
    sphere('eye white', root, [0.026, 0.018, 0.012], [side * 0.052, 1.79, -0.132], eyeWhite);
    sphere('eye iris', root, [0.011, 0.013, 0.008], [side * 0.052, 1.79, -0.143], eyeDark);
    sphere('ear', root, [0.025, 0.042, 0.025], [side * 0.15, 1.78, 0], palette.skin);
  }
  sphere('nose', root, [0.022, 0.035, 0.025], [0, 1.765, -0.145], palette.skin);
  for (let i = 0; i < 13; i++) {
    const angle = (i / 13) * Math.PI * 2;
    const curl = new THREE.Mesh(new THREE.SphereGeometry(0.045, 9, 7), palette.hair);
    curl.position.set(Math.cos(angle) * 0.105, 1.91 + Math.sin(angle) * 0.018, Math.sin(angle) * 0.09 + 0.008);
    curl.castShadow = true;
    root.add(curl);
  }

  for (const side of [-1, 1]) {
    const key = side < 0 ? 'L' : 'R';
    const hip = new THREE.Group();
    hip.position.set(side * 0.13, 0.90, 0);
    root.add(hip);
    addCapsule(hip, palette.trousers, 0.105, 0.31, [0, -0.22, 0]);
    const knee = new THREE.Group();
    knee.position.y = -0.42;
    hip.add(knee);
    addCapsule(knee, palette.trousers, 0.08, 0.30, [0, -0.18, 0]);
    const foot = new THREE.Group();
    foot.position.y = -0.39;
    knee.add(foot);
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.10, 0.27), palette.shoes);
    shoe.position.set(0, -0.045, -0.06);
    foot.add(shoe);
    joints['hip' + key] = hip;
    joints['knee' + key] = knee;
    joints['foot' + key] = foot;

    const shoulder = new THREE.Group();
    shoulder.position.set(side * 0.29, 1.47, 0);
    root.add(shoulder);
    addCapsule(shoulder, palette.jacket, 0.085, 0.25, [0, -0.16, 0]);
    const elbow = new THREE.Group();
    elbow.position.y = -0.32;
    shoulder.add(elbow);
    addCapsule(elbow, palette.jacket, 0.07, 0.23, [0, -0.12, 0]);
    sphere('hand', elbow, [0.06, 0.07, 0.055], [0, -0.29, 0], palette.skin);
    joints['shoulder' + key] = shoulder;
    joints['elbow' + key] = elbow;
  }
  const strap = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.66, 0.035), palette.leather);
  strap.position.set(-0.10, 1.22, -0.16);
  strap.rotation.z = -0.32;
  root.add(strap);
  const pack = new THREE.Mesh(new THREE.BoxGeometry(0.29, 0.34, 0.14), palette.leather);
  pack.position.set(0.20, 1.03, 0.16);
  root.add(pack);
  const packFlap = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.08, 0.15), palette.brass);
  packFlap.position.set(0.20, 1.19, 0.16);
  root.add(packFlap);
  return {
    root,
    bones: joints,
    update(dt, speed) {
      this.phase = (this.phase || 0) + dt * (5.2 + speed * 1.35);
      const intensity = THREE.MathUtils.clamp(speed / 1.7, 0, 1);
      const p = this.phase;
      const swing = 0.52 * intensity;
      joints.hipL.rotation.x = Math.sin(p) * swing;
      joints.hipR.rotation.x = Math.sin(p + Math.PI) * swing;
      joints.kneeL.rotation.x = Math.max(0, Math.cos(p)) * 0.7 * intensity;
      joints.kneeR.rotation.x = Math.max(0, Math.cos(p + Math.PI)) * 0.7 * intensity;
      joints.shoulderL.rotation.x = -Math.sin(p + 0.25) * 0.40 * intensity;
      joints.shoulderR.rotation.x = -Math.sin(p + Math.PI + 0.25) * 0.40 * intensity;
      joints.elbowL.rotation.x = 0.25 + intensity * 0.18;
      joints.elbowR.rotation.x = 0.25 + intensity * 0.18;
      joints.footL.rotation.x = -Math.max(0, Math.cos(p)) * 0.22 * intensity;
      joints.footR.rotation.x = -Math.max(0, Math.cos(p + Math.PI)) * 0.22 * intensity;
      torso.position.y = 1.20 + Math.sin(p * 2) * 0.018 * intensity;
      torso.rotation.z = Math.sin(p) * 0.025 * intensity;
    }
  };
}

function createFallbackPose(model) {
  const bones = boneMap(model);
  const names = {
    leftThigh: 'mixamorigLeftUpLeg', rightThigh: 'mixamorigRightUpLeg',
    leftShin: 'mixamorigLeftLeg', rightShin: 'mixamorigRightLeg',
    leftFoot: 'mixamorigLeftFoot', rightFoot: 'mixamorigRightFoot',
    leftArm: 'mixamorigLeftArm', rightArm: 'mixamorigRightArm',
    leftForearm: 'mixamorigLeftForeArm', rightForearm: 'mixamorigRightForeArm',
    hips: 'mixamorigHips', spine: 'mixamorigSpine', head: 'mixamorigHead'
  };
  const originals = {};
  for (const [key, name] of Object.entries(names)) {
    if (bones[name]) originals[key] = {
      rotation: bones[name].rotation.clone(),
      position: bones[name].position.clone()
    };
  }
  let phase = 0;
  return {
    update(dt, speed) {
      phase += dt * (4.4 + speed * 2.4);
      const amount = THREE.MathUtils.clamp(speed / 1.8, 0, 1);
      const setX = (key, value) => { const b = bones[names[key]]; if (b && originals[key]) b.rotation.x = originals[key].rotation.x + value; };
      const setZ = (key, value) => { const b = bones[names[key]]; if (b && originals[key]) b.rotation.z = originals[key].rotation.z + value; };
      setX('leftThigh', Math.sin(phase) * .43 * amount);
      setX('rightThigh', Math.sin(phase + Math.PI) * .43 * amount);
      setX('leftShin', Math.max(0, Math.cos(phase)) * .72 * amount);
      setX('rightShin', Math.max(0, Math.cos(phase + Math.PI)) * .72 * amount);
      setX('leftFoot', -Math.max(0, Math.cos(phase)) * .22 * amount);
      setX('rightFoot', -Math.max(0, Math.cos(phase + Math.PI)) * .22 * amount);
      setX('leftArm', -Math.sin(phase + .2) * .32 * amount);
      setX('rightArm', -Math.sin(phase + Math.PI + .2) * .32 * amount);
      setX('leftForearm', .12 * amount);
      setX('rightForearm', .12 * amount);
      setZ('hips', Math.sin(phase) * .025 * amount);
      setX('spine', Math.sin(phase * 2) * .015 * amount);
    },
    reset() {
      for (const [key, name] of Object.entries(names)) {
        const bone = bones[name];
        if (bone && originals[key]) {
          bone.rotation.copy(originals[key].rotation);
          bone.position.copy(originals[key].position);
        }
      }
    }
  };
}

/**
 * Carter Kane — personagem estilizado local.
 * O modelo é construído com geometria e materiais próprios para garantir
 * aparência consistente, sem depender de GLB remoto ou de nomes de ossos externos.
 */
export function createCharacter({ scene, ground, onModeChange = () => {} }) {
  const fallback = makeFallbackFigure(scene);
  const state = {
    model: fallback.root,
    human: null,
    fallback,
    locomotionName: 'Carter Kane · rig local',
    updateFallback(dt, speed) { fallback.update(dt, speed); },
    resetFallback() {
      fallback.root.position.set(0, 0, 0);
      fallback.root.rotation.set(0, 0, 0);
      fallback.phase = 0;
    }
  };
  onModeChange(state.locomotionName);
  return state;
}

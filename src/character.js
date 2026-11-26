import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const MODEL_URL = 'https://cdn.jsdelivr.net/gh/PabloMesquida/three-procedural-locomotion@v0.9.0/modelos/human_mix_propio.glb';
const LOCOMOTION_URL = 'https://esm.sh/gh/PabloMesquida/three-procedural-locomotion@v0.9.0/src/index.ts?external=three';

const palette = {
  skin: new THREE.MeshStandardMaterial({ color: 0x76503d, roughness: 0.78 }),
  jacket: new THREE.MeshStandardMaterial({ color: 0x34433d, roughness: 0.9 }),
  shirt: new THREE.MeshStandardMaterial({ color: 0xd3c6a8, roughness: 0.92 }),
  trousers: new THREE.MeshStandardMaterial({ color: 0x242b2d, roughness: 0.88 }),
  shoes: new THREE.MeshStandardMaterial({ color: 0x49372b, roughness: 0.75 }),
  leather: new THREE.MeshStandardMaterial({ color: 0x765638, roughness: 0.82 }),
  hair: new THREE.MeshStandardMaterial({ color: 0x151719, roughness: 0.92 }),
  brass: new THREE.MeshStandardMaterial({ color: 0xb58d50, metalness: 0.62, roughness: 0.32 })
};

function boneMap(root) {
  const result = {};
  root.traverse((obj) => {
    if (obj.isBone) result[obj.name] = obj;
  });
  return result;
}

function addCapsule(parent, material, radius, length, position, scale = [1, 1, 1]) {
  const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(radius, length, 5, 10), material);
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function addOutfit(root) {
  const bones = boneMap(root);
  const spine = bones.mixamorigSpine;
  const chest = bones.mixamorigSpine2;
  const head = bones.mixamorigHead;

  if (spine) {
    addCapsule(spine, palette.jacket, 0.205, 0.30, [0, -0.12, 0], [1.15, 1, 0.9]);
    const zipper = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.42, 0.012), palette.brass);
    zipper.position.set(0, -0.13, -0.205);
    spine.add(zipper);
  }
  if (chest) {
    addCapsule(chest, palette.jacket, 0.225, 0.31, [0, -0.12, 0], [1.18, 1, 0.92]);
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.018, 6, 18), palette.shirt);
    collar.position.set(0, 0.03, -0.02);
    collar.rotation.x = Math.PI / 2;
    chest.add(collar);

    const pack = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.43, 0.17), palette.leather);
    pack.position.set(0, -0.12, 0.23);
    pack.castShadow = true;
    pack.receiveShadow = true;
    chest.add(pack);
    const packFlap = new THREE.Mesh(new THREE.BoxGeometry(0.29, 0.10, 0.18), palette.brass);
    packFlap.position.set(0, 0.10, 0.23);
    chest.add(packFlap);
  }

  for (const side of ['Left', 'Right']) {
    const thigh = bones['mixamorig' + side + 'UpLeg'];
    const shin = bones['mixamorig' + side + 'Leg'];
    const foot = bones['mixamorig' + side + 'Foot'];
    const upperArm = bones['mixamorig' + side + 'Arm'];
    const forearm = bones['mixamorig' + side + 'ForeArm'];

    if (thigh) addCapsule(thigh, palette.trousers, 0.105, 0.30, [0, -0.20, 0], [1, 1.15, 1]);
    if (shin) addCapsule(shin, palette.trousers, 0.085, 0.30, [0, -0.19, 0], [1, 1.08, 1]);
    if (foot) {
      const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.105, 0.27), palette.shoes);
      shoe.position.set(0, -0.015, -0.07);
      shoe.castShadow = true;
      foot.add(shoe);
    }
    if (upperArm) addCapsule(upperArm, palette.jacket, 0.082, 0.24, [0, -0.16, 0], [1, 1, 1]);
    if (forearm) addCapsule(forearm, palette.jacket, 0.072, 0.21, [0, -0.13, 0], [1, 1, 1]);
  }

  if (head) {
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.135, 14, 10), palette.hair);
    hair.scale.set(1.08, 0.64, 1.04);
    hair.position.set(0, 0.09, 0.005);
    hair.castShadow = true;
    head.add(hair);

    const pendant = new THREE.Group();
    const loop = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.009, 6, 14), palette.brass);
    loop.position.y = 0.03;
    pendant.add(loop);
    const stem = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.10, 0.012), palette.brass);
    stem.position.y = -0.035;
    pendant.add(stem);
    pendant.position.set(0, -0.18, -0.13);
    chest?.add(pendant);
  }
  return bones;
}

function makeFallbackFigure(scene) {
  const root = new THREE.Group();
  root.name = 'BrooklynHouse_PlayerFallback';
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
  const torso = sphere('jacket torso', root, [0.27, 0.38, 0.16], [0, 1.20, 0], palette.jacket);
  sphere('shirt', root, [0.13, 0.20, 0.17], [0, 1.52, -0.01], palette.shirt);
  sphere('head', root, [0.145, 0.18, 0.14], [0, 1.78, 0], palette.skin);
  sphere('hair', root, [0.15, 0.105, 0.145], [0, 1.90, 0.008], palette.hair);

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
  const pack = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.40, 0.15), palette.leather);
  pack.position.set(0, 1.18, 0.20);
  root.add(pack);
  return {
    root,
    bones: joints,
    update(dt, speed) {
      this.phase = (this.phase || 0) + dt * (4.6 + speed * 2.3);
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

function withTimeout(promise, milliseconds, label) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(label + ' excedeu ' + milliseconds + ' ms')), milliseconds);
    })
  ]).finally(() => clearTimeout(timer));
}

/**
 * Retorna um personagem local imediatamente. O GLB e a locomoção avançada são
 * upgrades opcionais carregados em segundo plano; nunca bloqueiam o primeiro frame.
 */
export function createCharacter({ scene, ground, onModeChange = () => {} }) {
  let fallback = makeFallbackFigure(scene);
  const state = {
    model: fallback.root,
    human: null,
    fallback,
    locomotionName: 'personagem local articulado',
    updateFallback(dt, speed) { fallback?.update(dt, speed); },
    resetFallback() { fallback?.reset?.(); }
  };

  const upgrade = async () => {
    try {
      const loader = new GLTFLoader();
      const gltf = await withTimeout(
        loader.loadAsync(MODEL_URL),
        10000,
        'Carregamento do modelo humanoide'
      );
      const model = gltf.scene;
      model.name = 'BrooklynHouse_Explorer';
      model.traverse((obj) => {
        if (!obj.isMesh) return;
        obj.castShadow = true;
        obj.receiveShadow = true;
        if (obj.material) {
          const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
          for (const mat of materials) {
            if (/skin|body/i.test(mat.name || '')) {
              mat.color?.set(0x76503d);
              mat.roughness = 0.78;
            }
          }
        }
      });

      const bounds = new THREE.Box3().setFromObject(model);
      const height = bounds.max.y - bounds.min.y;
      if (height > 0.1) model.scale.multiplyScalar(1.78 / height);
      addOutfit(model);
      model.position.copy(state.model.position);
      model.rotation.copy(state.model.rotation);
      scene.add(model);

      let human = null;
      let nextFallback = null;
      let mode = 'animação local no rig externo';
      try {
        const locomotion = await withTimeout(import(LOCOMOTION_URL), 10000, 'Biblioteca de locomoção');
        human = locomotion.createProceduralHuman({
          model,
          mapping: locomotion.mixamoMapping,
          ground,
          preset: 'athletic',
          bodyScale: 'auto',
          speedScale: 'auto',
          seed: 27,
          config: locomotion.applyBasicControls(locomotion.defaultConfig, {
            naturalness: 1.15,
            armSwing: 1.05,
            hipSway: 1.0,
            looseness: 1.08,
            stride: 0.98
          })
        });
        if (human.warnings?.length) console.info('[Brooklyn House] Rig notes:', human.warnings);
        mode = 'locomoção procedural CMU / IK';
      } catch (error) {
        console.warn('[Brooklyn House] Locomoção avançada indisponível; usando movimento local.', error);
        nextFallback = createFallbackPose(model);
      }

      const old = state.model;
      state.model = model;
      state.human = human;
      state.fallback = nextFallback;
      fallback = nextFallback;
      state.locomotionName = mode;
      if (old?.parent) old.parent.remove(old);
      onModeChange(mode);
      console.info('[Brooklyn House] Personagem externo carregado:', mode);
    } catch (error) {
      console.warn('[Brooklyn House] Usando o personagem local; asset remoto indisponível.', error);
      onModeChange('personagem local articulado');
    }
  };

  // Não aguardar. A cena já pode renderizar com o boneco articulado local.
  upgrade();
  return state;
}

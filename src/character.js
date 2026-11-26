import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const MODEL_URL = 'https://cdn.jsdelivr.net/gh/PabloMesquida/three-procedural-locomotion@v0.9.0/modelos/human_mix_propio.glb';
const LOCOMOTION_URL = 'https://esm.sh/gh/PabloMesquida/three-procedural-locomotion@v0.9.0/src/index.ts?external=three';

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
    addCapsule(spine, palette.jacket, 0.198, 0.30, [0, -0.12, 0], [1.04, 1, 0.9]);
    const placket = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.34, 0.014), palette.shirt);
    placket.position.set(0, -0.13, -0.205);
    spine.add(placket);
    for (let i = 0; i < 4; i++) {
      const button = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), palette.brass);
      button.position.set(0, 0.015 - i * 0.085, -0.218);
      spine.add(button);
    }
  }
  if (chest) {
    addCapsule(chest, palette.jacket, 0.212, 0.30, [0, -0.12, 0], [1.08, 1, 0.92]);
    const collarL = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.12, 0.035), palette.shirt);
    collarL.position.set(-0.065, 0.045, -0.17);
    collarL.rotation.z = -0.28;
    chest.add(collarL);
    const collarR = collarL.clone();
    collarR.position.x = 0.065;
    collarR.rotation.z = 0.28;
    chest.add(collarR);

    const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.105, 0.095, 0.018), palette.jacket);
    pocket.position.set(-0.125, -0.13, -0.192);
    chest.add(pocket);
    const pocketMark = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.012, 0.01), palette.shirt);
    pocketMark.position.set(-0.125, -0.09, -0.207);
    chest.add(pocketMark);

    // Alça diagonal da bolsa de Carter, cruzando a camisa.
    const strapCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.18, 0.12, -0.16),
      new THREE.Vector3(-0.11, 0.02, -0.205),
      new THREE.Vector3(-0.02, -0.12, -0.218),
      new THREE.Vector3(0.10, -0.27, -0.17)
    ]);
    const strap = new THREE.Mesh(new THREE.TubeGeometry(strapCurve, 18, 0.022, 7, false), palette.leather);
    strap.castShadow = true;
    chest.add(strap);

    const pack = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.34, 0.13), palette.leather);
    pack.position.set(0.19, -0.22, 0.20);
    pack.rotation.z = -0.12;
    pack.castShadow = true;
    pack.receiveShadow = true;
    chest.add(pack);
    const packFlap = new THREE.Mesh(new THREE.BoxGeometry(0.285, 0.09, 0.14), palette.brass);
    packFlap.position.set(0.19, -0.07, 0.20);
    chest.add(packFlap);
  }

  for (const side of ['Left', 'Right']) {
    const thigh = bones['mixamorig' + side + 'UpLeg'];
    const shin = bones['mixamorig' + side + 'Leg'];
    const foot = bones['mixamorig' + side + 'Foot'];
    const upperArm = bones['mixamorig' + side + 'Arm'];
    const forearm = bones['mixamorig' + side + 'ForeArm'];

    if (thigh) addCapsule(thigh, palette.trousers, 0.098, 0.29, [0, -0.19, 0], [0.98, 1.12, 1]);
    if (shin) addCapsule(shin, palette.trousers, 0.078, 0.29, [0, -0.18, 0], [0.98, 1.05, 1]);
    if (foot) {
      const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.105, 0.27), palette.shoes);
      shoe.position.set(0, -0.015, -0.07);
      shoe.castShadow = true;
      foot.add(shoe);
    }
    if (upperArm) addCapsule(upperArm, palette.jacket, 0.078, 0.23, [0, -0.15, 0], [0.96, 1, 1]);
    if (forearm) addCapsule(forearm, palette.jacket, 0.068, 0.20, [0, -0.12, 0], [0.96, 1, 1]);
  }

  if (head) {
    const hairBase = new THREE.Mesh(new THREE.SphereGeometry(0.139, 16, 12), palette.hair);
    hairBase.scale.set(1.08, 0.68, 1.04);
    hairBase.position.set(0, 0.085, 0.005);
    hairBase.castShadow = true;
    head.add(hairBase);
    // Cachos curtos com volume irregular, evitando o aspecto de capacete liso.
    const curls = [
      [-0.105,0.105,-0.015],[-0.055,0.145,-0.055],[0,0.155,-0.06],[0.055,0.145,-0.05],[0.105,0.105,-0.01],
      [-0.12,0.065,0.045],[-0.08,0.13,0.075],[-0.025,0.17,0.07],[0.035,0.17,0.07],[0.09,0.13,0.07],[0.12,0.065,0.045],
      [-0.12,0.015,-0.015],[0.12,0.015,-0.015],[-0.08,0.06,-0.095],[0.08,0.06,-0.095]
    ];
    for (const [x,y,z] of curls) {
      const curl = new THREE.Mesh(new THREE.SphereGeometry(0.043, 9, 7), palette.hair);
      curl.position.set(x,y,z);
      curl.scale.set(1,0.88,0.92);
      curl.castShadow = true;
      head.add(curl);
    }

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
              mat.color?.set(0x603a2d);
              mat.roughness = 0.78;
            }
          }
        }
      });

      const bounds = new THREE.Box3().setFromObject(model);
      const height = bounds.max.y - bounds.min.y;
      if (height > 0.1) model.scale.multiplyScalar(1.68 / height);
      model.scale.x *= 0.96;
      model.scale.z *= 0.96;
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

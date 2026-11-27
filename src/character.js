import * as THREE from 'three';
import { clone as cloneSkeleton } from 'three/addons/utils/SkeletonUtils.js';
import { createCharacter as createAraCharacter, ANIMATIONS } from 'ara3d';
import { createCarterAccessories } from './character-accessories.js?v=carter-innerscene-bag-20261127a';

const CARTER_MOVE_PACK_URL = 'https://cdn.jsdelivr.net/gh/eitaluis/CASABROOKLIN@f77ad108a0e81f1ff50152842eb26ba8fa456eeb/assets/animations/carter-movement.ara-pack.json';
const CARTER_MOVE_CLIPS = Object.freeze({
  sprintUnarmed: 'carter-moves/sprint_loop',
  sprintArmed: 'carter-moves/sprint_shield_loop',
  ninjaJump: 'carter-moves/ninjajump_double',
  jumpLand: 'carter-moves/jump_land',
  meleeCombo: 'carter-moves/melee_combo',
  swordHeavyCombo: 'carter-moves/sword_heavy_combo'
});
const CARTER_COMBAT_ANIMATIONS = [
  CARTER_MOVE_CLIPS.meleeCombo,
  CARTER_MOVE_CLIPS.swordHeavyCombo
];

// Link compartilhado do Carter aprovado no Ara 3D Gen.
// A malha humana, o rosto, o cabelo e as proporções permanecem preservados.
const CARTER_SHARE_URL = 'https://ara3dgen.com/app/#c=XVDLboQwDPyVyr2iClbs87ZdqZce-wHImwaIgBg5jlZoxb_XoVTt9pDIM9aMx76Dx8HCCS7IYvnpHb2FDLBRLn_ZbMtyV24O232x_BkMMZh-6ZUZ3KxrWlnByDQSiyMfErNVk5qdQQ-nQuvgUpVnYDCaXxQ6pwVMFH1TrYJqQB2RgZ2sWsGV6eYVtuhYYWh1Sl6sxIV6SuxzsS82-ZuyFKV2Ggo8LasIjQqidzXxUIXWsSh7JREakl10UglTDJaDNhrkwXr5kKlP0-__lEqMKHqplDpQ7z5VY35C6I3OxwvMuteD7aNKW843f3Wv5fG8O8CchC0tWwdvsfuOZJB5SodA0436YP4C';

const CORE_ANIMATIONS = [
  'idle',
  'walk',
  'run',
  'jump_start',
  'jump_air',
  'jump_land',
  'walk_slouch',
  'crouch',
  'hit_front',
  'hit_back',
  'hit_left',
  'hit_right'
];

// A lista pública do Ara é consultada antes do carregamento:
// somente IDs existentes entram no pedido de clips cinematográficos.
const CINEMATIC_ANIMATIONS = [
  'use_press',
  'look_around',
  'talk_gestures',
  'wave',
  'fight_idle',
  'point',
  'bow',
  'sit_down',
  'sit_idle'
];

const ARA_ANIMATION_IDS = new Set(ANIMATIONS.map((animation) => animation.id));
const AVAILABLE_CINEMATIC_ANIMATIONS = CINEMATIC_ANIMATIONS.filter((id) => ARA_ANIMATION_IDS.has(id));
const REACTION_ANIMATIONS = ['hit_front', 'hit_back', 'hit_left', 'hit_right'];
const AVAILABLE_ACTION_ANIMATIONS = [...AVAILABLE_CINEMATIC_ANIMATIONS, ...REACTION_ANIMATIONS]
  .filter((id) => ARA_ANIMATION_IDS.has(id));
const PACK_ACTION_ANIMATIONS = CARTER_COMBAT_ANIMATIONS;

export async function createCharacter({
  scene,
  characterSource = CARTER_SHARE_URL,
  characterName = 'Carter Kane',
  attachCarterAccessories = true,
  onModeChange = () => {},
  onActionChange = () => {}
}) {
  const loading = document.getElementById('loading');
  const hero = await createAraCharacter(characterSource, {
    // The saved Ara share originally included a backpack. Remove that built-in
    // carried prop; Carter now uses only the custom side satchel below.
    carry: 'none',
    rootMotion: false,
    packs: [CARTER_MOVE_PACK_URL],
    animations: [...new Set([
      ...CORE_ANIMATIONS,
      ...AVAILABLE_CINEMATIC_ANIMATIONS,
      ...Object.values(CARTER_MOVE_CLIPS)
    ])],
    detail: 'medium',
    onProgress: (label, fraction) => {
      if (!loading || loading.classList.contains('done')) return;
      const percent = Number.isFinite(fraction) ? Math.round(fraction * 100) : null;
      loading.textContent = percent === null
        ? 'BROOKLYN HOUSE — CARREGANDO CARTER KANE'
        : 'BROOKLYN HOUSE — CARREGANDO CARTER KANE · ' + percent + '%';
    }
  });

  const mixer = new THREE.AnimationMixer(hero.scene);
  let injured = false;
  let sitting = false;
  let actionInterruptOnMovement = true;
  let actionInterruptDelay = 0;
  let actionElapsed = 0;
  let sprintArmed = false;
  // Keep three distinct Ara clips in the blend. Reusing walk_slouch as both
  // walk and run creates two actions for the same clip and can stall the gait.
  // Injured movement is slowed by the controller, so the normal run clip is
  // retained as a valid upper blend endpoint but sprint remains disabled.
  const locomotionOptions = () => injured
    ? { idle: 'crouch', walk: 'walk_slouch', run: 'run', smoothing: 0.18 }
    : {
        run: hero.clip(sprintArmed ? CARTER_MOVE_CLIPS.sprintArmed : CARTER_MOVE_CLIPS.sprintUnarmed)
          ? (sprintArmed ? CARTER_MOVE_CLIPS.sprintArmed : CARTER_MOVE_CLIPS.sprintUnarmed)
          : 'run',
        smoothing: 0.18
      };
  let locomotion = hero.locomotion(mixer, locomotionOptions());
  let jumping = false;
  let movementSpeed = 0;
  let disposed = false;
  let jumpSequence = null;
  let actionSequence = null;
  let finishJump = null;
  let finishAction = null;
  let currentAction = null;
  let castingHandPose = false;
  let castingBodyPose = false;
  let castingBodyWeight = 0;
  let castingGuardPoseActive = false;
  const castingGuardPose = [];
  const castingOffsets = [];
  let state = null;

  // O pivô separa a orientação de navegação da rotação interna do rig Ara.
  const root = new THREE.Group();
  root.name = 'CarterMovementRoot';
  root.add(hero.scene);
  scene.add(root);
  hero.scene.rotation.y = Math.PI;

  function normalizedBoneName(name) {
    return String(name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  }
  function findRigBone(aliases) {
    const wanted = aliases.map(normalizedBoneName);
    let found = null;
    hero.scene.traverse((object) => {
      if (found) return;
      const name = normalizedBoneName(object.name);
      if (wanted.some(alias => name === alias || name.endsWith(alias))) found = object;
    });
    return found;
  }

  // Avatar de Combate de Hórus: uma segunda pele dourada que envolve Carter.
  // A cópia usa o mesmo rig Ara e recebe a pose dos ossos originais a cada frame.
  const horusAvatarRoot = new THREE.Group();
  horusAvatarRoot.name = 'Avatar de Combate de Hórus · energia dourada';
  horusAvatarRoot.visible = false;
  root.add(horusAvatarRoot);
  const horusAvatarScene = cloneSkeleton(hero.scene);
  horusAvatarScene.name = 'Silhueta sincronizada do guerreiro-falcão';
  horusAvatarRoot.add(horusAvatarScene);

  const horusAvatarBodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xe6ad45, emissive: 0xffa51e, emissiveIntensity: 1.15,
    roughness: 0.34, metalness: 0.08, transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false,
    side: THREE.DoubleSide, toneMapped: false
  });
  const horusAvatarHeadMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd071, emissive: 0xffad34, emissiveIntensity: 1.55,
    roughness: 0.3, metalness: 0.04, transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false,
    side: THREE.DoubleSide, toneMapped: false
  });
  const horusAvatarEyeMaterial = new THREE.MeshBasicMaterial({
    color: 0xfff0ba, transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
  });
  horusAvatarScene.traverse((object) => {
    if (!object.isMesh) return;
    object.material = horusAvatarBodyMaterial;
    object.castShadow = false;
    object.receiveShadow = false;
    object.frustumCulled = false;
  });

  const horusAvatarBoneLookup = new Map();
  horusAvatarScene.traverse((object) => {
    if (!object.isBone) return;
    const key = normalizedBoneName(object.name);
    if (key && !horusAvatarBoneLookup.has(key)) horusAvatarBoneLookup.set(key, object);
  });
  const horusAvatarBonePairs = [];
  hero.scene.traverse((object) => {
    if (!object.isBone) return;
    const clone = horusAvatarBoneLookup.get(normalizedBoneName(object.name));
    if (clone) horusAvatarBonePairs.push({ source: object, clone });
  });

  const horusAvatarMeshLookup = new Map();
  horusAvatarScene.traverse((object) => {
    if (object.isMesh && object.name && !horusAvatarMeshLookup.has(object.name)) {
      horusAvatarMeshLookup.set(object.name, object);
    }
  });
  const horusAvatarMorphPairs = [];
  hero.scene.traverse((object) => {
    if (!object.isMesh || !object.morphTargetInfluences) return;
    const clone = horusAvatarMeshLookup.get(object.name);
    if (clone?.morphTargetInfluences) horusAvatarMorphPairs.push({ source: object, clone });
  });

  // Cabeça de falcão simplificada: crânio, bico, olhos e penas curtas na nuca.
  const horusHeadBone = horusAvatarBoneLookup.get('head') || horusAvatarBoneLookup.get('mixamorighead');
  function addHorusHeadPiece(name, geometry, material, position, scale, rotation = null) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.position.copy(position);
    if (scale) mesh.scale.copy(scale);
    if (rotation) mesh.rotation.copy(rotation);
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    horusHeadBone?.add(mesh);
    return mesh;
  }
  const horusHeadUnit = Math.max(0.7, hero.height || 1.75) / 1.75;
  if (horusHeadBone) {
    addHorusHeadPiece(
      'Crânio translúcido de falcão',
      new THREE.SphereGeometry(0.145 * horusHeadUnit, 24, 18),
      horusAvatarHeadMaterial,
      new THREE.Vector3(0, 0.028 * horusHeadUnit, 0.035 * horusHeadUnit),
      new THREE.Vector3(0.98, 1.14, 1.12)
    );
    const beakRotation = new THREE.Euler(Math.PI / 2, 0, 0);
    addHorusHeadPiece(
      'Bico superior do avatar',
      new THREE.ConeGeometry(0.082 * horusHeadUnit, 0.245 * horusHeadUnit, 8, 1),
      horusAvatarHeadMaterial,
      new THREE.Vector3(0, 0.01 * horusHeadUnit, 0.162 * horusHeadUnit),
      new THREE.Vector3(1, 1, 1), beakRotation
    );
    addHorusHeadPiece(
      'Bico inferior do avatar',
      new THREE.ConeGeometry(0.048 * horusHeadUnit, 0.145 * horusHeadUnit, 8, 1),
      horusAvatarHeadMaterial,
      new THREE.Vector3(0, -0.055 * horusHeadUnit, 0.158 * horusHeadUnit),
      new THREE.Vector3(1, 1, 1), beakRotation
    );
    for (const side of [-1, 1]) {
      addHorusHeadPiece(
        'Olho luminoso do falcão',
        new THREE.SphereGeometry(0.018 * horusHeadUnit, 12, 10),
        horusAvatarEyeMaterial,
        new THREE.Vector3(side * 0.112 * horusHeadUnit, 0.045 * horusHeadUnit, 0.118 * horusHeadUnit),
        new THREE.Vector3(1, 1, 0.72)
      );
    }
    for (const index of [-1, 0, 1]) {
      const feather = addHorusHeadPiece(
        'Pena curta da nuca',
        new THREE.ConeGeometry(0.026 * horusHeadUnit, 0.135 * horusHeadUnit, 6, 1),
        horusAvatarHeadMaterial,
        new THREE.Vector3(index * 0.045 * horusHeadUnit, 0.162 * horusHeadUnit, -0.055 * horusHeadUnit),
        new THREE.Vector3(1, 1, 1)
      );
      feather.rotation.z = -index * 0.22;
      feather.rotation.x = -0.12;
    }
  } else {
    console.warn('Avatar de Hórus: osso Head não encontrado; usando cabeça do rig Ara.');
  }

  let horusAvatarActive = false;
  let horusAvatarWeight = 0;
  let horusAvatarElapsed = 0;
  const horusAvatarBasePositionY = hero.scene.position.y;
  const horusAvatarScale = new THREE.Vector3(1.52, 1.48, 1.46);

  function setHorusAvatarActive(enabled) {
    horusAvatarActive = Boolean(enabled);
    if (horusAvatarActive) horusAvatarRoot.visible = true;
    return horusAvatarActive;
  }

  function updateHorusAvatar(dt) {
    horusAvatarElapsed += dt;
    horusAvatarWeight = THREE.MathUtils.damp(
      horusAvatarWeight, horusAvatarActive ? 1 : 0,
      horusAvatarActive ? 5.4 : 7.2, dt
    );
    const hover = (0.12 + Math.sin(horusAvatarElapsed * 2.65) * 0.018) * horusAvatarWeight;
    hero.scene.position.y = horusAvatarBasePositionY + hover;
    horusAvatarScene.position.copy(hero.scene.position);
    horusAvatarScene.quaternion.copy(hero.scene.quaternion);
    horusAvatarScene.scale.copy(hero.scene.scale);
    for (const pair of horusAvatarBonePairs) {
      pair.clone.position.copy(pair.source.position);
      pair.clone.quaternion.copy(pair.source.quaternion);
      pair.clone.scale.copy(pair.source.scale);
    }
    for (const pair of horusAvatarMorphPairs) {
      const sourceWeights = pair.source.morphTargetInfluences;
      const cloneWeights = pair.clone.morphTargetInfluences;
      for (let i = 0; i < Math.min(sourceWeights.length, cloneWeights.length); i++) {
        cloneWeights[i] = sourceWeights[i];
      }
    }
    const weight = horusAvatarWeight;
    horusAvatarRoot.scale.set(
      THREE.MathUtils.lerp(1, horusAvatarScale.x, weight),
      THREE.MathUtils.lerp(1, horusAvatarScale.y, weight),
      THREE.MathUtils.lerp(1, horusAvatarScale.z, weight)
    );
    const pulse = 0.94 + Math.sin(horusAvatarElapsed * 4.8) * 0.06;
    horusAvatarBodyMaterial.opacity = 0.265 * weight * pulse;
    horusAvatarHeadMaterial.opacity = 0.52 * weight * pulse;
    horusAvatarEyeMaterial.opacity = 0.88 * weight;
    horusAvatarRoot.visible = horusAvatarActive || weight > 0.006;
    horusAvatarScene.updateMatrixWorld(true);
    horusAvatarRoot.updateMatrixWorld(true);
    if (!horusAvatarActive && weight < 0.001) {
      horusAvatarRoot.visible = false;
      hero.scene.position.y = horusAvatarBasePositionY;
    }
  }

  const headBones = [
    findRigBone(['Neck', 'mixamorigNeck']),
    findRigBone(['Head', 'mixamorigHead'])
  ].filter(Boolean);
  root.updateMatrixWorld(true);
  const neutralHeadWorldPose = new Map(headBones.map(bone => [
    bone, bone.getWorldQuaternion(new THREE.Quaternion())
  ]));
  const rootWorldQuaternion = new THREE.Quaternion();
  const parentWorldQuaternion = new THREE.Quaternion();
  const desiredHeadWorldQuaternion = new THREE.Quaternion();
  const castingBones = {
    hips: findRigBone(['Hips', 'mixamorigHips']),
    leftUpLeg: findRigBone(['LeftUpLeg', 'mixamorigLeftUpLeg']),
    rightUpLeg: findRigBone(['RightUpLeg', 'mixamorigRightUpLeg']),
    leftLeg: findRigBone(['LeftLeg', 'mixamorigLeftLeg']),
    rightLeg: findRigBone(['RightLeg', 'mixamorigRightLeg']),
    leftFoot: findRigBone(['LeftFoot', 'mixamorigLeftFoot']),
    rightFoot: findRigBone(['RightFoot', 'mixamorigRightFoot']),
    spine: findRigBone(['Spine', 'mixamorigSpine']),
    spine1: findRigBone(['Spine1', 'mixamorigSpine1']),
    leftArm: findRigBone(['LeftArm', 'mixamorigLeftArm']),
    leftForeArm: findRigBone(['LeftForeArm', 'mixamorigLeftForeArm'])
  };

  // Acessórios originais: bolsa no quadril direito, alça cruzada e medalhão.
  const accessories = attachCarterAccessories ? createCarterAccessories({
    characterRoot: hero.scene,
    height: hero.height || 1.75
  }) : null;

  function clearJumpListener() {
    if (finishJump) mixer.removeEventListener('finished', finishJump);
    finishJump = null;
  }

  function clearActionListener() {
    if (finishAction) mixer.removeEventListener('finished', finishAction);
    finishAction = null;
  }

  function restoreLocomotion() {
    if (disposed || jumping) return false;
    // Stop the previous Ara locomotion controller before creating another one.
    // This matters after teleport/room transitions and when changing injury state:
    // otherwise two controllers can keep writing to the same mixer actions.
    locomotion?.stop();
    locomotion = hero.locomotion(mixer, locomotionOptions());
    locomotion.speed = movementSpeed;
    if (state) state.locomotion = locomotion;
    return true;
  }

  function cancelAction() {
    clearActionListener();
    actionSequence?.stop();
    actionSequence = null;
    currentAction = null;
    actionInterruptOnMovement = true;
    actionInterruptDelay = 0;
    actionElapsed = 0;
    onActionChange(null);
  }

  function stopAction() {
    if (disposed || jumping) return;
    cancelAction();
    restoreLocomotion();
  }

  function playAction(id, options = {}) {
    if (disposed || jumping || (
      !AVAILABLE_ACTION_ANIMATIONS.includes(id) &&
      !PACK_ACTION_ANIMATIONS.includes(id)
    )) return false;
    const clip = hero.clip(id);
    if (!clip) return false;

    cancelAction();
    locomotion.stop();
    currentAction = id;
    actionInterruptOnMovement = options.interruptOnMovement !== false;
    actionInterruptDelay = Number.isFinite(options.interruptDelay) ? Math.max(0, options.interruptDelay) : 0;
    actionElapsed = 0;
    if (options.reverse === true) {
      // Ara defines Stand up as Sit down played in reverse; start at the clip's
      // final timestamp and let the same grounded motion return to standing.
      const reverseAction = mixer.clipAction(clip);
      reverseAction.reset();
      reverseAction.enabled = true;
      reverseAction.setLoop(THREE.LoopOnce, 1);
      reverseAction.clampWhenFinished = true;
      reverseAction.time = clip.duration;
      reverseAction.setEffectiveTimeScale(-1);
      reverseAction.setEffectiveWeight(1);
      const fade = Number.isFinite(options.fade) ? options.fade : 0.38;
      if (fade > 0) reverseAction.fadeIn(fade);
      reverseAction.play();
      actionSequence = { stop: () => reverseAction.stop() };
    } else {
      actionSequence = hero.playSequence(mixer, id, {
        repeat: options.loop === true,
        fade: Number.isFinite(options.fade) ? options.fade : 0.38
      });
    }
    onActionChange(id);

    if (options.loop !== true) {
      finishAction = (event) => {
        if (event.action.getClip() !== clip || disposed) return;
        clearActionListener();
        actionSequence?.stop();
        actionSequence = null;
        currentAction = null;
        onActionChange(null);
        const handled = typeof options.onFinish === 'function' ? options.onFinish() : undefined;
        if (handled !== false) restoreLocomotion();
      };
      mixer.addEventListener('finished', finishAction);
    }
    return true;
  }

  const castingFingerRest = new Map();
  function applyCastingHandPose() {
    // O clip Point já projeta o braço e estende o indicador. Espelhamos a cadeia
    // do indicador para o dedo médio, formando os dois dedos do gesto descrito no livro.
    for (let joint = 1; joint <= 3; joint++) {
      const indexFinger = hero.scene.getObjectByName('RightHandIndex' + joint);
      const middleFinger = hero.scene.getObjectByName('RightHandMiddle' + joint);
      if (indexFinger && middleFinger) {
        if (!castingFingerRest.has(middleFinger)) castingFingerRest.set(middleFinger, middleFinger.quaternion.clone());
        middleFinger.quaternion.copy(indexFinger.quaternion);
      }
    }
  }
  function setCastingHandPose(enabled) {
    castingHandPose = Boolean(enabled);
    if (castingHandPose) {
      applyCastingHandPose();
    } else {
      for (const [bone, quaternion] of castingFingerRest) bone.quaternion.copy(quaternion);
      castingFingerRest.clear();
    }
  }

  function setCastingBodyPose(enabled) {
    castingBodyPose = Boolean(enabled);
  }

  function removeCastingBodyOffsets() {
    for (let i = castingOffsets.length - 1; i >= 0; i--) {
      const entry = castingOffsets[i];
      if (entry.quaternion) entry.bone.quaternion.multiply(entry.quaternion.clone().invert());
      if (entry.position) entry.bone.position.copy(entry.position);
    }
    castingOffsets.length = 0;
  }

  function addCastingRotation(bone, axis, angle) {
    if (!bone || Math.abs(angle) < 0.0001) return;
    const offset = new THREE.Quaternion().setFromAxisAngle(axis, angle);
    bone.quaternion.multiply(offset);
    castingOffsets.push({ bone, quaternion: offset });
  }

  function updateCastingBodyPose(dt) {
    castingBodyWeight = THREE.MathUtils.damp(castingBodyWeight, castingBodyPose ? 1 : 0, castingBodyPose ? 12 : 7, dt);
    if (castingBodyWeight < 0.001) {
      castingBodyWeight = 0;
      return;
    }

    // A cabeça permanece ereta no eixo mundial, mesmo com o tronco em ataque.
    if (neutralHeadWorldPose.size) {
      root.updateMatrixWorld(true);
      root.getWorldQuaternion(rootWorldQuaternion);
      for (const [bone, neutralWorldQuaternion] of neutralHeadWorldPose) {
        if (!bone.parent) continue;
        bone.parent.getWorldQuaternion(parentWorldQuaternion);
        desiredHeadWorldQuaternion.copy(rootWorldQuaternion).multiply(neutralWorldQuaternion);
        bone.quaternion.copy(parentWorldQuaternion.invert().multiply(desiredHeadWorldQuaternion));
        root.updateMatrixWorld(true);
      }
    }

    const w = castingBodyWeight;
    const radians = Math.PI / 180;
    const X = new THREE.Vector3(1, 0, 0);
    const Y = new THREE.Vector3(0, 1, 0);
    const Z = new THREE.Vector3(0, 0, 1);

    // Base bladed stance transposta do Ara fight_idle:
    // pé esquerdo à frente, pé direito atrás e os dois joelhos flexionados.
    // O Point do Ara fornece o braço direito; a guarda esquerda é capturada
    // diretamente do fight_idle antes da transição para não cair ao lado do corpo.
    const hips = castingBones.hips;
    if (hips) {
      const position = hips.position.clone();
      hips.position.y -= 0.055 * w;
      hips.position.z -= 0.025 * w;
      castingOffsets.push({ bone: hips, position });
    }

    addCastingRotation(castingBones.leftUpLeg, X, 16 * radians * w);
    addCastingRotation(castingBones.leftUpLeg, Z, 4 * radians * w);
    addCastingRotation(castingBones.rightUpLeg, X, -12 * radians * w);
    addCastingRotation(castingBones.rightUpLeg, Z, -6 * radians * w);
    addCastingRotation(castingBones.leftLeg, X, -24 * radians * w);
    addCastingRotation(castingBones.rightLeg, X, -14 * radians * w);
    addCastingRotation(castingBones.leftFoot, X, 8 * radians * w);
    addCastingRotation(castingBones.rightFoot, X, 4 * radians * w);

    // Peito e cintura acompanham o ataque sem dobrar a cabeça para baixo.
    addCastingRotation(castingBones.spine, X, 6 * radians * w);
    addCastingRotation(castingBones.spine1, X, 4 * radians * w);
    addCastingRotation(castingBones.spine1, Y, -10 * radians * w);
  }

  function captureCastingGuardPose() {
    castingGuardPose.length = 0;
    hero.scene.traverse((object) => {
      if (!object.isBone) return;
      const name = normalizedBoneName(object.name);
      if (!/left(shoulder|arm|forearm|hand)/.test(name)) return;
      castingGuardPose.push({
        bone: object,
        quaternion: object.quaternion.clone(),
        position: object.position.clone()
      });
    });
    castingGuardPoseActive = castingGuardPose.length > 0;
    return castingGuardPoseActive;
  }

  function setCastingGuardPose(enabled) {
    castingGuardPoseActive = Boolean(enabled) && castingGuardPose.length > 0;
    if (!castingGuardPoseActive) castingGuardPose.length = 0;
  }

  function handBone(side = 'Right') {
    return hero.scene.getObjectByName(side + 'Hand')
      || hero.scene.getObjectByName(side === 'Right' ? 'wrist.R' : 'wrist.L')
      || null;
  }

  function sitDown() {
    if (disposed || jumping || sitting) return false;
    if (!AVAILABLE_ACTION_ANIMATIONS.includes('sit_down') ||
        !AVAILABLE_ACTION_ANIMATIONS.includes('sit_idle')) {
      console.warn('As animações de sentar/levantar não estão disponíveis no rig Ara carregado.');
      return false;
    }
    sitting = true;
    const started = playAction('sit_down', {
      fade: 0.24,
      interruptOnMovement: false,
      onFinish: () => {
        if (!sitting) return true;
        const loopStarted = playAction('sit_idle', {
          loop: true, fade: 0.2, interruptOnMovement: false
        });
        if (loopStarted) return false;
        sitting = false;
        return true;
      }
    });
    if (!started) sitting = false;
    return started;
  }

  function standFromSeat(onComplete) {
    if (disposed || jumping || !sitting) return false;
    sitting = false;
    const started = playAction('sit_down', {
      reverse: true,
      fade: 0.22,
      interruptOnMovement: false,
      onFinish: () => { onComplete?.(); }
    });
    if (!started) {
      restoreLocomotion();
      return false;
    }
    return true;
  }

  function createClampedAction(clip, fade = 0.16) {
    if (!clip) return null;
    const action = mixer.clipAction(clip);
    action.reset();
    action.enabled = true;
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight(1);
    if (fade > 0) action.fadeIn(fade);
    action.play();
    return { stop: () => action.stop() };
  }

  function land() {
    if (disposed || !jumping) return false;
    clearJumpListener();
    jumpSequence?.stop();
    jumpSequence = null;

    const clip = hero.clip(CARTER_MOVE_CLIPS.jumpLand) || hero.clip('jump_land');
    if (!clip) {
      jumping = false;
      restoreLocomotion();
      return false;
    }

    const action = createClampedAction(clip, 0.1);
    if (!action) {
      jumping = false;
      restoreLocomotion();
      return false;
    }
    jumpSequence = action;
    finishJump = (event) => {
      if (event.action.getClip() !== clip || disposed) return;
      clearJumpListener();
      jumpSequence?.stop();
      jumpSequence = null;
      jumping = false;
      restoreLocomotion();
    };
    mixer.addEventListener('finished', finishJump);
    return true;
  }

  function jump() {
    if (disposed || jumping || sitting) return false;
    const jumpClip = hero.clip(CARTER_MOVE_CLIPS.ninjaJump) || hero.clip('jump_start');
    const landingClip = hero.clip(CARTER_MOVE_CLIPS.jumpLand) || hero.clip('jump_land');
    if (!jumpClip || !landingClip) {
      console.warn('O conjunto de animações de salto do Carter não está completo.');
      return false;
    }

    cancelAction();
    jumping = true;
    locomotion.stop();
    jumpSequence = createClampedAction(jumpClip, 0.18);
    if (!jumpSequence) {
      jumping = false;
      restoreLocomotion();
      return false;
    }
    // A animação de salto segura a última pose até a física informar contato real
    // com o piso. A aterrissagem começa no instante da colisão, não por cronômetro.
    return true;
  }

  function attack(armed = false) {
    const id = armed ? CARTER_MOVE_CLIPS.swordHeavyCombo : CARTER_MOVE_CLIPS.meleeCombo;
    return playAction(id, { fade: 0.12, interruptOnMovement: false });
  }

  function setSprintArmed(value) {
    const next = Boolean(value);
    if (next === sprintArmed) return;
    sprintArmed = next;
    if (!jumping && !actionSequence) restoreLocomotion();
  }

  state = {
    model: root,
    human: null,
    ara: hero,
    mixer,
    locomotion,
    jump,
    land,
    attack,
    setSprintArmed,
    playAction,
    sitDown,
    standFromSeat,
    get isSitting() { return sitting; },
    stopAction,
    resumeLocomotion() {
      if (disposed || jumping) return false;
      if (actionSequence) cancelAction();
      return restoreLocomotion();
    },
    playReaction(direction = 'front') {
      // Do not restart a reaction that is already playing: hits can arrive at
      // shorter intervals than a full reaction clip and otherwise starve gait.
      if (actionSequence && String(currentAction || '').startsWith('hit_')) return false;
      const id = REACTION_ANIMATIONS.includes('hit_' + direction) ? 'hit_' + direction : 'hit_front';
      // Show a brief impact, then let movement reclaim the mixer even if the
      // authored reaction clip is longer than the player's invulnerability gap.
      return playAction(id, { fade: 0.08, interruptOnMovement: true, interruptDelay: 0.24 });
    },
    setHorusAvatarActive,
    updateHorusAvatar,
    get isHorusAvatarActive() { return horusAvatarActive; },
    setInjured(value) {
      const next = Boolean(value);
      if (next === injured) return;
      injured = next;
      if (!jumping && !actionSequence) restoreLocomotion();
    },
    get isInjured() { return injured; },
    get movementMultiplier() { return injured ? 0.76 : 1; },
    setCastingHandPose,
    setCastingBodyPose,
    captureCastingGuardPose,
    setCastingGuardPose,
    getHandWorldPosition(side = 'Right', target = new THREE.Vector3()) {
      const hand = handBone(side);
      hero.scene.updateMatrixWorld(true);
      if (hand) return hand.getWorldPosition(target);
      return root.localToWorld(target.set(side === 'Right' ? 0.34 : -0.34, 1.34, 0.22));
    },
    getHandWorldQuaternion(side = 'Right', target = new THREE.Quaternion()) {
      const hand = handBone(side);
      hero.scene.updateMatrixWorld(true);
      if (hand) return hand.getWorldQuaternion(target);
      return root.getWorldQuaternion(target);
    },
    faceTarget(target) {
      if (!target || disposed) return;
      const direction = target.clone().sub(root.position).setY(0);
      if (direction.lengthSq() < 0.0001) return;
      root.rotation.y = Math.atan2(-direction.x, -direction.z);
      root.rotation.x = 0;
      root.rotation.z = 0;
    },
    getForward(target = new THREE.Vector3()) {
      return target.set(0, 0, -1).applyQuaternion(root.getWorldQuaternion(new THREE.Quaternion())).normalize();
    },
    lookAt(target, options) {
      if (!disposed && typeof hero.lookAt === 'function') hero.lookAt(target, options);
    },
    setExpression(expression, amount) {
      if (!disposed && typeof hero.setExpression === 'function') hero.setExpression(expression, amount);
    },
    height: hero.height || 1.75,
    characterName,
    locomotionName: characterName + ' · Ara 3D · Cinematic',
    availableActions: [...AVAILABLE_CINEMATIC_ANIMATIONS, ...PACK_ACTION_ANIMATIONS],
    get action() { return currentAction; },
    accessoryAttachment: accessories?.attachment || 'none',
    updateFallback(dt, speed) {
      if (disposed) return;
      movementSpeed = speed;
      // Reactions and gestures have a short authored grace period, then movement
      // can cancel them so repeated incoming hits never lock the locomotion.
      if (actionSequence) actionElapsed += dt;
      if (actionSequence && speed > 0.25 && actionInterruptOnMovement && actionElapsed >= actionInterruptDelay) {
        cancelAction();
        restoreLocomotion();
      }
      if (!jumping && !actionSequence) locomotion.speed = speed;
      removeCastingBodyOffsets();
      mixer.update(dt);
      hero.update(dt);
      if (castingGuardPoseActive) {
        for (const entry of castingGuardPose) {
          entry.bone.quaternion.copy(entry.quaternion);
          entry.bone.position.copy(entry.position);
        }
      }
      // The movement root is yaw-only; no animation or camera-relative turn may
      // leave a residual pitch/roll after strafing or sprinting.
      root.rotation.x = 0;
      root.rotation.z = 0;
      updateCastingBodyPose(dt);
      if (castingHandPose) applyCastingHandPose();
      accessories?.update(dt, movementSpeed);
    },
    resetFallback() {
      if (disposed) return;
      if (jumping) {
        clearJumpListener();
        jumpSequence?.stop();
        jumpSequence = null;
        jumping = false;
      }
      cancelAction();
      castingBodyPose = false;
      castingBodyWeight = 0;
      setCastingGuardPose(false);
      removeCastingBodyOffsets();
      movementSpeed = 0;
      locomotion.speed = 0;
      root.rotation.set(0, 0, 0);
      restoreLocomotion();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      castingHandPose = false;
      castingBodyPose = false;
      setCastingGuardPose(false);
      setHorusAvatarActive(false);
      horusAvatarRoot.visible = false;
      horusAvatarBodyMaterial.dispose();
      horusAvatarHeadMaterial.dispose();
      horusAvatarEyeMaterial.dispose();
      removeCastingBodyOffsets();
      clearJumpListener();
      clearActionListener();
      jumpSequence?.stop();
      actionSequence?.stop();
      jumpSequence = null;
      actionSequence = null;
      mixer.stopAllAction();
      accessories?.dispose();
      hero.dispose();
      root.removeFromParent();
    }
  };

  onModeChange(state.locomotionName);
  return state;
}

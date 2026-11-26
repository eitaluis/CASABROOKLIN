import * as THREE from 'three';
import { createCharacter as createAraCharacter, ANIMATIONS } from 'ara3d';
import { createCarterAccessories } from './character-accessories.js?v=carter-accessories-body-fit-20261126j';

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
  'point',
  'bow'
];

const ARA_ANIMATION_IDS = new Set(ANIMATIONS.map((animation) => animation.id));
const AVAILABLE_CINEMATIC_ANIMATIONS = CINEMATIC_ANIMATIONS.filter((id) => ARA_ANIMATION_IDS.has(id));
const REACTION_ANIMATIONS = ['hit_front', 'hit_back', 'hit_left', 'hit_right'];
const AVAILABLE_ACTION_ANIMATIONS = [...AVAILABLE_CINEMATIC_ANIMATIONS, ...REACTION_ANIMATIONS]
  .filter((id) => ARA_ANIMATION_IDS.has(id));

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
    animations: [...new Set([...CORE_ANIMATIONS, ...AVAILABLE_CINEMATIC_ANIMATIONS])],
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
  let actionInterruptOnMovement = true;
  const locomotionOptions = () => injured
    ? { idle: 'crouch', walk: 'walk_slouch', run: 'walk_slouch', smoothing: 0.12 }
    : { smoothing: 0.12 };
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
    if (disposed || jumping) return;
    locomotion = hero.locomotion(mixer, locomotionOptions());
    locomotion.speed = movementSpeed;
    if (state) state.locomotion = locomotion;
  }

  function cancelAction() {
    clearActionListener();
    actionSequence?.stop();
    actionSequence = null;
    currentAction = null;
    actionInterruptOnMovement = true;
    onActionChange(null);
  }

  function stopAction() {
    if (disposed || jumping) return;
    cancelAction();
    restoreLocomotion();
  }

  function playAction(id, options = {}) {
    if (disposed || jumping || !AVAILABLE_ACTION_ANIMATIONS.includes(id)) return false;
    const clip = hero.clip(id);
    if (!clip) return false;

    cancelAction();
    locomotion.stop();
    currentAction = id;
    actionInterruptOnMovement = options.interruptOnMovement !== false;
    actionSequence = hero.playSequence(mixer, id, {
      repeat: options.loop === true,
      fade: Number.isFinite(options.fade) ? options.fade : 0.38
    });
    onActionChange(id);

    if (options.loop !== true) {
      finishAction = (event) => {
        if (event.action.getClip() !== clip || disposed) return;
        clearActionListener();
        actionSequence?.stop();
        actionSequence = null;
        currentAction = null;
        onActionChange(null);
        restoreLocomotion();
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

    // A cabeça fica no eixo neutro do rig durante o feitiço: não acompanha
    // a altura do Shabti e não inclina para baixo.
    if (castingBodyWeight > 0.001 && neutralHeadWorldPose.size) {
      // Compensa também a inclinação herdada do tronco: a cabeça conserva a
      // orientação mundial neutra, mesmo quando o peito assume a postura de ataque.
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
    const hips = castingBones.hips;
    if (hips) {
      const position = hips.position.clone();
      hips.position.y -= 0.075 * w;
      castingOffsets.push({ bone: hips, position });
    }

    // Agachamento curto, de combate: quadris e joelhos flexionam,
    // tronco inclina poucos graus e o braço livre estabiliza o corpo.
    const X = new THREE.Vector3(1, 0, 0);
    const Z = new THREE.Vector3(0, 0, 1);
    addCastingRotation(castingBones.leftUpLeg, X, -0.17 * w);
    addCastingRotation(castingBones.rightUpLeg, X, -0.17 * w);
    addCastingRotation(castingBones.leftLeg, X, 0.36 * w);
    addCastingRotation(castingBones.rightLeg, X, 0.36 * w);
    addCastingRotation(castingBones.spine, X, -0.045 * w);
    addCastingRotation(castingBones.spine1, X, -0.055 * w);
    addCastingRotation(castingBones.leftArm, Z, -0.10 * w);
    addCastingRotation(castingBones.leftForeArm, X, -0.08 * w);
  }

  function handBone(side = 'Right') {
    return hero.scene.getObjectByName(side + 'Hand')
      || hero.scene.getObjectByName(side === 'Right' ? 'wrist.R' : 'wrist.L')
      || null;
  }

  function jump() {
    if (disposed || jumping) return false;
    if (!hero.clip('jump_start') || !hero.clip('jump_air') || !hero.clip('jump_land')) {
      console.warn('O conjunto de animações de salto não está completo.');
      return false;
    }

    cancelAction();
    jumping = true;
    locomotion.stop();
    jumpSequence = hero.playSequence(mixer, 'jump_start 0.32s, jump_air 0.22s, jump_land', {
      repeat: false,
      fade: 0.22
    });
    finishJump = (event) => {
      if (event.action.getClip() !== hero.clip('jump_land') || disposed) return;
      clearJumpListener();
      jumpSequence?.stop();
      jumpSequence = null;
      jumping = false;
      locomotion = hero.locomotion(mixer, locomotionOptions());
      locomotion.speed = movementSpeed;
      state.locomotion = locomotion;
    };
    mixer.addEventListener('finished', finishJump);
    return true;
  }

  state = {
    model: root,
    human: null,
    ara: hero,
    mixer,
    locomotion,
    jump,
    playAction,
    stopAction,
    playReaction(direction = 'front') {
      const id = REACTION_ANIMATIONS.includes('hit_' + direction) ? 'hit_' + direction : 'hit_front';
      return playAction(id, { fade: 0.08, interruptOnMovement: false });
    },
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
    availableActions: AVAILABLE_CINEMATIC_ANIMATIONS.slice(),
    get action() { return currentAction; },
    accessoryAttachment: accessories?.attachment || 'none',
    updateFallback(dt, speed) {
      if (disposed) return;
      movementSpeed = speed;
      // Release one-shot/gesture poses as soon as navigation resumes to avoid foot sliding.
      if (actionSequence && speed > 0.25 && actionInterruptOnMovement) {
        cancelAction();
        restoreLocomotion();
      }
      if (!jumping && !actionSequence) locomotion.speed = speed;
      removeCastingBodyOffsets();
      mixer.update(dt);
      hero.update(dt);
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

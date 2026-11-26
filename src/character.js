import * as THREE from 'three';
import { createCharacter as createAraCharacter, ANIMATIONS } from 'ara3d';
import { createCarterAccessories } from './character-accessories.js?v=carter-accessories-20261126i';

// Link compartilhado do Carter aprovado no Ara 3D Gen.
// A malha humana, o rosto, o cabelo e as proporções permanecem preservados.
const CARTER_SHARE_URL = 'https://ara3dgen.com/app/#c=XVDLboQwDPyVyr2iClbs87ZdqZce-wHImwaIgBg5jlZoxb_XoVTt9pDIM9aMx76Dx8HCCS7IYvnpHb2FDLBRLn_ZbMtyV24O232x_BkMMZh-6ZUZ3KxrWlnByDQSiyMfErNVk5qdQQ-nQuvgUpVnYDCaXxQ6pwVMFH1TrYJqQB2RgZ2sWsGV6eYVtuhYYWh1Sl6sxIV6SuxzsS82-ZuyFKV2Ggo8LasIjQqidzXxUIXWsSh7JREakl10UglTDJaDNhrkwXr5kKlP0-__lEqMKHqplDpQ7z5VY35C6I3OxwvMuteD7aNKW843f3Wv5fG8O8CchC0tWwdvsfuOZJB5SodA0436YP4C';

const CORE_ANIMATIONS = [
  'idle',
  'walk',
  'run',
  'jump_start',
  'jump_air',
  'jump_land'
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
    animations: [...CORE_ANIMATIONS, ...AVAILABLE_CINEMATIC_ANIMATIONS],
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
  let locomotion = hero.locomotion(mixer);
  let jumping = false;
  let movementSpeed = 0;
  let disposed = false;
  let jumpSequence = null;
  let actionSequence = null;
  let finishJump = null;
  let finishAction = null;
  let currentAction = null;
  let castingHandPose = false;
  let state = null;

  // O pivô separa a orientação de navegação da rotação interna do rig Ara.
  const root = new THREE.Group();
  root.name = 'CarterMovementRoot';
  root.add(hero.scene);
  scene.add(root);
  hero.scene.rotation.y = Math.PI;

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
    locomotion = hero.locomotion(mixer);
    locomotion.speed = movementSpeed;
    if (state) state.locomotion = locomotion;
  }

  function cancelAction() {
    clearActionListener();
    actionSequence?.stop();
    actionSequence = null;
    currentAction = null;
    onActionChange(null);
  }

  function stopAction() {
    if (disposed || jumping) return;
    cancelAction();
    restoreLocomotion();
  }

  function playAction(id, options = {}) {
    if (disposed || jumping || !AVAILABLE_CINEMATIC_ANIMATIONS.includes(id)) return false;
    const clip = hero.clip(id);
    if (!clip) return false;

    cancelAction();
    locomotion.stop();
    currentAction = id;
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

  function handBone(side = 'Right') {
    return hero.scene.getObjectByName(side + 'Hand')
      || hero.scene.getObjectByName(side === 'Right' ? 'wrist.R' : 'wrist.L')
      || null;
  }

  function jump() {
    if (disposed || jumping) return;
    if (!hero.clip('jump_start') || !hero.clip('jump_air') || !hero.clip('jump_land')) {
      console.warn('O conjunto de animações de salto não está completo.');
      return;
    }

    cancelAction();
    jumping = true;
    locomotion.stop();
    jumpSequence = hero.playSequence(mixer, 'jump_start, jump_air 0.45s, jump_land', {
      repeat: false,
      fade: 0.22
    });
    finishJump = (event) => {
      if (event.action.getClip() !== hero.clip('jump_land') || disposed) return;
      clearJumpListener();
      jumpSequence?.stop();
      jumpSequence = null;
      jumping = false;
      locomotion = hero.locomotion(mixer);
      locomotion.speed = movementSpeed;
      state.locomotion = locomotion;
    };
    mixer.addEventListener('finished', finishJump);
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
    setCastingHandPose,
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
      if (actionSequence && speed > 0.25) {
        cancelAction();
        restoreLocomotion();
      }
      if (!jumping && !actionSequence) locomotion.speed = speed;
      mixer.update(dt);
      hero.update(dt);
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
      movementSpeed = 0;
      locomotion.speed = 0;
      root.rotation.set(0, 0, 0);
      restoreLocomotion();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      castingHandPose = false;
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

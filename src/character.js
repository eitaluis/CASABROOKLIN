import * as THREE from 'three';
import { createCharacter as createAraCharacter } from 'ara3d';

// Link compartilhado do Carter aprovado no Ara 3D Gen.
const CARTER_SHARE_URL = 'https://ara3dgen.com/app/#c=XVDLboQwDPyVyr2iClbs87ZdqZce-wHImwaIgBg5jlZoxb_XoVTt9pDIM9aMx76Dx8HCCS7IYvnpHb2FDLBRLn_ZbMtyV24O232x_BkMMZh-6ZUZ3KxrWlnByDQSiyMfErNVk5qdQQ-nQuvgUpVnYDCaXxQ6pwVMFH1TrYJqQB2RgZ2sWsGV6eYVtuhYYWh1Sl6sxIV6SuxzsS82-ZuyFKV2Ggo8LasIjQqidzXxUIXWsSh7JREakl10UglTDJaDNhrkwXr5kKlP0-__lEqMKHqplDpQ7z5VY35C6I3OxwvMuteD7aNKW843f3Wv5fG8O8CchC0tWwdvsfuOZJB5SodA0436YP4C';

export async function createCharacter({ scene, onModeChange = () => {} }) {
  const loading = document.getElementById('loading');
  const hero = await createAraCharacter(CARTER_SHARE_URL, {
    animations: ['idle', 'walk', 'run', 'jump_start', 'jump_air', 'jump_land'],
    detail: 'medium',
    onProgress: (label, fraction) => {
      if (!loading || loading.classList.contains('done')) return;
      const percent = Number.isFinite(fraction) ? Math.round(fraction * 100) : null;
      loading.textContent = percent === null
        ? 'BROOKLYN HOUSE — CARREGANDO CARTER KANE'
        : `BROOKLYN HOUSE — CARREGANDO CARTER KANE · ${percent}%`;
    }
  });

  const mixer = new THREE.AnimationMixer(hero.scene);
  let locomotion = hero.locomotion(mixer);
  let jumping = false;
  let movementSpeed = 0;
  // Um pivô separado controla a orientação sem disputar a rotação do rig/animações Ara.
  const root = new THREE.Group();
  root.name = 'CarterMovementRoot';
  scene.add(root);
  root.add(hero.scene);
  // O modelo Ara tem o eixo frontal invertido em relação ao eixo de movimento do jogo.
  hero.scene.rotation.y = Math.PI;

  function jump() {
    if (jumping) return;
    const startClip = hero.clip('jump_start');
    const airClip = hero.clip('jump_air');
    const landClip = hero.clip('jump_land');
    if (!startClip || !airClip || !landClip) {
      console.warn('O conjunto de animações jump_start/jump_air/jump_land não está completo.');
      return;
    }
    jumping = true;
    locomotion.stop();
    const sequence = hero.playSequence(mixer, 'jump_start, jump_air 0.45s, jump_land', { repeat: false });
    const finishJump = (event) => {
      if (event.action.getClip() !== landClip) return;
      mixer.removeEventListener('finished', finishJump);
      sequence.stop();
      jumping = false;
      locomotion = hero.locomotion(mixer);
      locomotion.speed = movementSpeed;
      state.locomotion = locomotion;
    };
    mixer.addEventListener('finished', finishJump);
  }

  const state = {
    model: root,
    human: null,
    ara: hero,
    mixer,
    locomotion,
    jump,
    locomotionName: 'Carter Kane · Ara 3D',
    updateFallback(dt, speed) {
      movementSpeed = speed;
      if (!jumping) locomotion.speed = speed;
      mixer.update(dt);
      hero.update(dt);
    },
    resetFallback() {
      locomotion.speed = 0;
      root.rotation.set(0, 0, 0);
    },
    dispose() {
      hero.dispose();
    }
  };

  onModeChange(state.locomotionName);
  return state;
}

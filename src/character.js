import * as THREE from 'three';
import { createCharacter as createAraCharacter } from 'ara3d';

// Link compartilhado do Carter aprovado no Ara 3D Gen.
const CARTER_SHARE_URL = 'https://ara3dgen.com/app/#c=XVDLboQwDPyVyr2iClbs87ZdqZce-wHImwaIgBg5jlZoxb_XoVTt9pDIM9aMx76Dx8HCCS7IYvnpHb2FDLBRLn_ZbMtyV24O232x_BkMMZh-6ZUZ3KxrWlnByDQSiyMfErNVk5qdQQ-nQuvgUpVnYDCaXxQ6pwVMFH1TrYJqQB2RgZ2sWsGV6eYVtuhYYWh1Sl6sxIV6SuxzsS82-ZuyFKV2Ggo8LasIjQqidzXxUIXWsSh7JREakl10UglTDJaDNhrkwXr5kKlP0-__lEqMKHqplDpQ7z5VY35C6I3OxwvMuteD7aNKW843f3Wv5fG8O8CchC0tWwdvsfuOZJB5SodA0436YP4C';

export async function createCharacter({ scene, onModeChange = () => {} }) {
  const loading = document.getElementById('loading');
  const hero = await createAraCharacter(CARTER_SHARE_URL, {
    animations: ['idle', 'walk', 'run'],
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
  const locomotion = hero.locomotion(mixer);
  scene.add(hero.scene);

  const state = {
    model: hero.scene,
    human: null,
    ara: hero,
    mixer,
    locomotion,
    locomotionName: 'Carter Kane · Ara 3D',
    updateFallback(dt, speed) {
      locomotion.speed = speed;
      mixer.update(dt);
      hero.update(dt);
    },
    resetFallback() {
      locomotion.speed = 0;
      hero.scene.rotation.set(0, 0, 0);
    },
    dispose() {
      hero.dispose();
    }
  };

  onModeChange(state.locomotionName);
  return state;
}

import * as THREE from 'three';

/*
 * Carter Kane — personagem local procedural, estilo Game 3D gráfico.
 * Geometria original do projeto: formas humanas suaves, proporções juvenis,
 * materiais gráficos sem pele fotográfica e rig articulado compartilhado.
 *
 * Os meshes são organizados sob bones de nomes humanoides (inclui WeaponR).
 * Não há dependência do CDN Ara nem de um GLB remoto.
 */

export async function createCharacter({ scene, onModeChange = () => {} }) {
  const model = new THREE.Group();
  model.name = 'CarterKane_Game3D';
  model.userData.characterStyle = 'graphic-3d-human';
  model.userData.bagPlacement = 'right-hip';
  scene.add(model);

  const unitSphere = new THREE.SphereGeometry(1, 24, 18);
  const materials = [];
  const makeMat = (color, roughness = 0.82, metalness = 0) => {
    const mat = new THREE.MeshStandardMaterial({ color, roughness, metalness });
    materials.push(mat);
    return mat;
  };

  const mat = {
    skin: makeMat(0x956044, 0.86),
    skinLight: makeMat(0xb77757, 0.88),
    skinShade: makeMat(0x754831, 0.9),
    hair: makeMat(0x191614, 0.94),
    hairAlt: makeMat(0x27201d, 0.95),
    shirt: makeMat(0x315ab2, 0.84),
    shirtDark: makeMat(0x24458f, 0.9),
    shirtLight: makeMat(0x5478c7, 0.88),
    pants: makeMat(0xb69a69, 0.94),
    pantsDark: makeMat(0x947b52, 0.96),
    pantsLight: makeMat(0xc8ad7d, 0.92),
    belt: makeMat(0x44352b, 0.82),
    beltMetal: makeMat(0xb48d55, 0.48, 0.62),
    shoe: makeMat(0x253d69, 0.78),
    shoeDark: makeMat(0x182b4d, 0.84),
    shoeAccent: makeMat(0x537fc3, 0.72),
    sole: makeMat(0xe7e1d4, 0.92),
    lace: makeMat(0xe9e5da, 0.88),
    bag: makeMat(0x754628, 0.82),
    bagDark: makeMat(0x4d2c1d, 0.88),
    bagFlap: makeMat(0x895333, 0.8),
    bagStitch: makeMat(0xc39a68, 0.9),
    brass: makeMat(0xb78a4d, 0.42, 0.68),
    eye: makeMat(0xf2e9d9, 0.5),
    iris: makeMat(0x4b2a1f, 0.48),
    pupil: makeMat(0x171311, 0.34),
    brow: makeMat(0x30221d, 0.9),
    mouth: makeMat(0x5d3029, 0.9),
    nostril: makeMat(0x60392f, 0.92)
  };

  const bones = {};
  const makeBone = (parent, name, x = 0, y = 0, z = 0) => {
    const value = new THREE.Bone();
    value.name = name;
    value.position.set(x, y, z);
    parent.add(value);
    bones[name] = value;
    return value;
  };

  const addSphere = (parent, name, position, scale, material, geometry = unitSphere) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.position.set(position[0], position[1], position[2]);
    mesh.scale.set(scale[0], scale[1], scale[2]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };

  const addBox = (parent, name, position, size, material, rotation = [0, 0, 0]) => {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(size[0], size[1], size[2]),
      material
    );
    mesh.name = name;
    mesh.position.set(position[0], position[1], position[2]);
    mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };

  const addCapsule = (parent, name, position, radius, length, material, radial = 14) => {
    const geometry = new THREE.CapsuleGeometry(radius, length, 5, radial);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.position.set(position[0], position[1], position[2]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };

  const addTube = (parent, name, points, radius, material, tubular = 28) => {
    const curve = new THREE.CatmullRomCurve3(
      points.map(point => new THREE.Vector3(point[0], point[1], point[2]))
    );
    const mesh = new THREE.Mesh(
      new THREE.TubeGeometry(curve, tubular, radius, 7, false),
      material
    );
    mesh.name = name;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };

  const roundedRect = (width, height, radius, depth) => {
    const w = width / 2;
    const h = height / 2;
    const r = Math.min(radius, w * 0.8, h * 0.8);
    const shape = new THREE.Shape();
    shape.moveTo(-w + r, -h);
    shape.lineTo(w - r, -h);
    shape.quadraticCurveTo(w, -h, w, -h + r);
    shape.lineTo(w, h - r);
    shape.quadraticCurveTo(w, h, w - r, h);
    shape.lineTo(-w + r, h);
    shape.quadraticCurveTo(-w, h, -w, h - r);
    shape.lineTo(-w, -h + r);
    shape.quadraticCurveTo(-w, -h, -w + r, -h);
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.006,
      bevelThickness: 0.006,
      curveSegments: 8
    });
    geometry.computeVertexNormals();
    return geometry;
  };

  // Esqueleto humanoide leve com nomes compatíveis com convenções de jogo.
  const rigRoot = makeBone(model, 'Root');
  const hips = makeBone(rigRoot, 'Hips', 0, 0.91, 0);
  const spine = makeBone(hips, 'Spine', 0, 0.09, 0);
  const chest = makeBone(spine, 'Spine1', 0, 0.18, 0);
  const neck = makeBone(chest, 'Neck', 0, 0.22, 0);
  const head = makeBone(neck, 'Head', 0, 0.07, 0);

  // Pelve, camiseta e pescoço.
  addSphere(hips, 'Carter · quadril da calça', [0, -0.015, 0], [0.178, 0.155, 0.125], mat.pants);
  addSphere(hips, 'Carter · cós', [0, 0.105, 0], [0.181, 0.045, 0.128], mat.pantsDark);
  addSphere(spine, 'Carter · camiseta inferior', [0, 0.015, 0], [0.197, 0.16, 0.126], mat.shirt);
  addSphere(chest, 'Carter · camiseta', [0, 0.005, 0], [0.211, 0.263, 0.137], mat.shirt);

  // Barra da camiseta, costuras e bolso discreto.
  addTube(chest, 'Costura inferior da camiseta', [
    [-0.17, -0.178, -0.074], [-0.09, -0.194, -0.105],
    [0, -0.2, -0.111], [0.09, -0.194, -0.105], [0.17, -0.178, -0.074]
  ], 0.003, mat.shirtDark, 24);
  addBox(chest, 'Bolso da camiseta', [-0.115, 0.075, -0.128], [0.065, 0.075, 0.009], mat.shirtDark);
  addTube(chest, 'Gola da camiseta', [
    [-0.06, 0.226, -0.057], [-0.045, 0.207, -0.105],
    [0, 0.2, -0.118], [0.045, 0.207, -0.105], [0.06, 0.226, -0.057]
  ], 0.012, mat.shirtDark, 20);
  addSphere(neck, 'Pescoço', [0, 0.018, 0], [0.057, 0.085, 0.055], mat.skin);

  // Cabeça humana estilizada: volumes naturais, sem proporção de anime.
  addSphere(head, 'Rosto · volume principal', [0, 0.06, 0], [0.112, 0.139, 0.099], mat.skin);
  addSphere(head, 'Rosto · mandíbula', [0, -0.025, -0.018], [0.085, 0.075, 0.083], mat.skin);
  addSphere(head, 'Orelha esquerda', [-0.111, 0.035, 0.005], [0.022, 0.043, 0.028], mat.skin);
  addSphere(head, 'Orelha direita', [0.111, 0.035, 0.005], [0.022, 0.043, 0.028], mat.skin);
  addSphere(head, 'Orelha interna esquerda', [-0.119, 0.034, -0.012], [0.008, 0.022, 0.012], mat.skinShade);
  addSphere(head, 'Orelha interna direita', [0.119, 0.034, -0.012], [0.008, 0.022, 0.012], mat.skinShade);

  // Olhos pequenos e naturais, com íris discretas.
  for (const side of [-1, 1]) {
    addSphere(head, 'Olho · branco', [side * 0.043, 0.067, -0.086], [0.022, 0.013, 0.009], mat.eye);
    addSphere(head, 'Olho · íris', [side * 0.043, 0.066, -0.094], [0.0085, 0.0095, 0.0045], mat.iris);
    addSphere(head, 'Olho · pupila', [side * 0.043, 0.066, -0.097], [0.0042, 0.006, 0.0026], mat.pupil);
    addTube(head, 'Sobrancelha', [
      [side * 0.067, 0.094, -0.086],
      [side * 0.046, 0.102, -0.094],
      [side * 0.024, 0.096, -0.088]
    ], 0.005, mat.brow, 8);
  }

  addSphere(head, 'Nariz · ponte', [0, 0.036, -0.092], [0.013, 0.028, 0.018], mat.skinLight);
  addSphere(head, 'Nariz · ponta', [0, 0.018, -0.108], [0.018, 0.012, 0.012], mat.skin);
  addSphere(head, 'Narina esquerda', [-0.009, 0.012, -0.115], [0.004, 0.003, 0.002], mat.nostril);
  addSphere(head, 'Narina direita', [0.009, 0.012, -0.115], [0.004, 0.003, 0.002], mat.nostril);
  addTube(head, 'Boca', [
    [-0.023, -0.034, -0.092], [-0.011, -0.038, -0.098],
    [0, -0.039, -0.1], [0.011, -0.038, -0.098], [0.023, -0.034, -0.092]
  ], 0.0032, mat.mouth, 12);
  addSphere(head, 'Lábio inferior', [0, -0.047, -0.093], [0.018, 0.004, 0.003], mat.skinLight);

  // Cabelo crespo curto: massa base e cachos instanciados para reduzir draw calls.
  addSphere(head, 'Cabelo · base', [0, 0.139, 0.018], [0.119, 0.071, 0.108], mat.hair);
  const curlCount = 42;
  const curls = new THREE.InstancedMesh(unitSphere, mat.hair, curlCount);
  curls.name = 'Cabelo · cachos crespos';
  const dummy = new THREE.Object3D();
  let curlIndex = 0;
  for (let ring = 0; ring < 3; ring++) {
    const count = ring === 0 ? 16 : 13;
    const y = ring === 0 ? 0.19 : (ring === 1 ? 0.145 : 0.102);
    const rx = ring === 0 ? 0.072 : 0.105;
    const rz = ring === 0 ? 0.067 : 0.088;
    for (let i = 0; i < count; i++) {
      if (curlIndex >= curlCount) break;
      const angle = (i / count) * Math.PI * 2 + ring * 0.19;
      const wobble = Math.sin(i * 2.17 + ring) * 0.006;
      dummy.position.set(Math.cos(angle) * (rx + wobble), y + Math.cos(angle * 2) * 0.008, Math.sin(angle) * rz);
      dummy.rotation.set(Math.sin(angle) * 0.25, -angle, Math.cos(angle) * 0.22);
      const radius = ring === 0 ? 0.024 : 0.026;
      dummy.scale.set(radius * 1.05, radius, radius);
      dummy.updateMatrix();
      curls.setMatrixAt(curlIndex, dummy.matrix);
      if ((i + ring) % 4 === 0) curls.setColorAt(curlIndex, new THREE.Color(0x2a211d));
      curlIndex++;
    }
  }
  curls.count = curlIndex;
  curls.instanceMatrix.needsUpdate = true;
  if (curls.instanceColor) curls.instanceColor.needsUpdate = true;
  curls.castShadow = true;
  head.add(curls);
  addSphere(head, 'Cabelo · costeleta esquerda', [-0.099, 0.023, 0.008], [0.024, 0.055, 0.038], mat.hair);
  addSphere(head, 'Cabelo · costeleta direita', [0.099, 0.023, 0.008], [0.024, 0.055, 0.038], mat.hairAlt);

  // Braços: mangas azuis, antebraços naturais e mãos articuladas.
  const armRig = {};
  for (const side of [-1, 1]) {
    const label = side < 0 ? 'Left' : 'Right';
    const upper = makeBone(chest, label + 'Arm', side * 0.19, 0.15, 0);
    const elbow = makeBone(upper, label + 'ForeArm', 0, -0.215, 0);
    const hand = makeBone(elbow, label + 'Hand', 0, -0.225, 0);
    armRig[label] = { upper, elbow, hand };

    addCapsule(upper, label + ' · manga da camiseta', [0, -0.057, 0], 0.071, 0.105, mat.shirt, 14);
    addCapsule(upper, label + ' · braço', [0, -0.165, 0], 0.052, 0.12, mat.skin, 14);
    addSphere(upper, label + ' · cotovelo', [0, -0.214, 0], [0.052, 0.052, 0.051], mat.skin);
    addCapsule(elbow, label + ' · antebraço', [0, -0.115, 0], 0.045, 0.16, mat.skin, 14);
    addSphere(hand, label + ' · mão', [0, -0.018, -0.018], [0.043, 0.052, 0.035], mat.skin);
    addSphere(hand, label + ' · polegar', [side * -0.032, -0.025, -0.027], [0.018, 0.032, 0.018], mat.skinLight);
  }

  // Socket de arma na mão direita, preservando compatibilidade com o inventário.
  const weaponSocket = makeBone(armRig.Right.hand, 'WeaponR', 0, -0.012, -0.045);
  weaponSocket.userData.attachment = 'right-hand-grip';

  // Pernas e calças cargo: silhueta jovem, enxuta e funcional.
  const legRig = {};
  for (const side of [-1, 1]) {
    const label = side < 0 ? 'Left' : 'Right';
    const thigh = makeBone(hips, label + 'UpLeg', side * 0.096, -0.045, 0);
    const knee = makeBone(thigh, label + 'Leg', 0, -0.34, 0);
    const foot = makeBone(knee, label + 'Foot', 0, -0.305, 0);
    const toe = makeBone(foot, label + 'ToeBase', 0, -0.025, -0.115);
    legRig[label] = { thigh, knee, foot, toe };

    addCapsule(thigh, label + ' · coxa cargo', [0, -0.16, 0], 0.077, 0.245, mat.pants, 14);
    addSphere(thigh, label + ' · joelho', [0, -0.322, 0], [0.067, 0.065, 0.068], mat.pants);
    addCapsule(knee, label + ' · canela cargo', [0, -0.145, 0], 0.056, 0.225, mat.pants, 14);
    addSphere(knee, label + ' · tornozelo', [0, -0.292, 0], [0.052, 0.054, 0.056], mat.pantsDark);

    // Bolsos externos com aba e pesponto; colocados no lado de fora de cada coxa.
    const outer = side * 0.066;
    addBox(thigh, label + ' · bolso cargo', [outer, -0.19, -0.062], [0.091, 0.12, 0.035], mat.pantsDark);
    addBox(thigh, label + ' · aba do bolso', [outer, -0.132, -0.084], [0.093, 0.026, 0.012], mat.pantsLight);
    addBox(thigh, label + ' · botão do bolso', [outer, -0.133, -0.093], [0.012, 0.008, 0.006], mat.beltMetal);
    addTube(thigh, label + ' · costura externa', [
      [side * 0.052, -0.055, -0.046],
      [side * 0.07, -0.18, -0.052],
      [side * 0.052, -0.29, -0.044]
    ], 0.0028, mat.pantsLight, 12);

    // Tênis azul-marinho com sola clara, biqueira e cadarços visíveis.
    const shoeGroup = new THREE.Group();
    shoeGroup.name = label + ' · tênis';
    shoeGroup.position.set(0, -0.17, -0.035);
    foot.add(shoeGroup);
    addBox(shoeGroup, label + ' · sola', [0, -0.044, -0.047], [0.132, 0.052, 0.245], mat.sole);
    addSphere(shoeGroup, label + ' · cabedal', [0, 0.002, -0.052], [0.064, 0.064, 0.128], mat.shoe);
    addSphere(shoeGroup, label + ' · biqueira', [0, -0.004, -0.145], [0.058, 0.045, 0.05], mat.shoeAccent);
    addBox(shoeGroup, label + ' · lingueta', [0, 0.052, -0.055], [0.052, 0.014, 0.078], mat.shoeDark);
    for (let lace = 0; lace < 3; lace++) {
      const y = 0.039 - lace * 0.014;
      const z = -0.014 - lace * 0.032;
      addTube(shoeGroup, label + ' · cadarço ' + lace, [
        [-0.027, y, z], [0, y + 0.006, z - 0.006], [0.027, y, z]
      ], 0.0035, mat.lace, 6);
    }
    addBox(shoeGroup, label + ' · faixa lateral', [side * 0.061, 0.003, -0.052], [0.006, 0.022, 0.105], mat.shoeAccent);
  }

  // Cinto e passadores discretos na cintura.
  addBox(hips, 'Cinto de couro', [0, 0.105, -0.004], [0.32, 0.035, 0.255], mat.belt);
  addBox(hips, 'Fivela do cinto', [0, 0.105, -0.134], [0.05, 0.034, 0.012], mat.beltMetal);
  for (const x of [-0.13, -0.045, 0.045, 0.13]) {
    addBox(hips, 'Passador do cinto', [x, 0.11, -0.133], [0.012, 0.046, 0.009], mat.pantsLight);
  }

  // Bolsa transversal de couro conhaque: corpo no quadril direito.
  // A peça segue a descrição/dimensões do asset CC0 aprovado; o GLB original
  // não foi incorporado porque sua entrega binária externa não pôde ser obtida
  // neste ambiente. A geometria local reproduz corpo, aba, ferragens e alça vestível.
  const bagPivot = new THREE.Group();
  bagPivot.name = 'Bolsa transversal · balanço';
  bagPivot.position.set(0.232, -0.085, -0.005);
  hips.add(bagPivot);

  const bagBody = new THREE.Mesh(roundedRect(0.176, 0.205, 0.026, 0.07), mat.bag);
  bagBody.name = 'Bolsa · corpo de couro';
  bagBody.position.set(0, 0, -0.035);
  bagBody.castShadow = true;
  bagBody.receiveShadow = true;
  bagPivot.add(bagBody);

  const bagBase = addBox(bagPivot, 'Bolsa · base', [0, -0.092, -0.003], [0.165, 0.025, 0.075], mat.bagDark);
  const flap = new THREE.Mesh(roundedRect(0.169, 0.092, 0.018, 0.012), mat.bagFlap);
  flap.name = 'Bolsa · aba frontal';
  flap.position.set(0, 0.052, -0.046);
  flap.castShadow = true;
  bagPivot.add(flap);
  addTube(bagPivot, 'Bolsa · pesponto da aba', [
    [-0.073, 0.019, -0.06], [-0.073, 0.079, -0.06],
    [0, 0.091, -0.06], [0.073, 0.079, -0.06], [0.073, 0.019, -0.06]
  ], 0.0022, mat.bagStitch, 24);
  addBox(bagPivot, 'Bolsa · fecho de latão', [0, 0.018, -0.064], [0.035, 0.039, 0.012], mat.brass);
  addBox(bagPivot, 'Bolsa · trava central', [0, 0.018, -0.072], [0.011, 0.025, 0.005], mat.bagDark);
  for (const side of [-1, 1]) {
    addSphere(bagPivot, 'Bolsa · rebite', [side * 0.073, 0.078, -0.058], [0.007, 0.007, 0.004], mat.brass);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.018, 0.004, 7, 16), mat.brass);
    ring.name = 'Bolsa · argola lateral';
    ring.position.set(side * 0.091, 0.067, 0.004);
    ring.rotation.y = Math.PI / 2;
    bagPivot.add(ring);
  }

  // Alça vestível: ombro esquerdo → peito → quadril direito.
  const strap = addTube(model, 'Alça transversal de couro', [
    [-0.158, 1.405, -0.112],
    [-0.145, 1.33, -0.145],
    [-0.088, 1.255, -0.153],
    [-0.015, 1.18, -0.151],
    [0.085, 1.075, -0.132],
    [0.19, 0.965, -0.085]
  ], 0.018, mat.bagDark, 38);
  strap.renderOrder = 2;
  const strapFace = addTube(model, 'Costura da alça', [
    [-0.158, 1.405, -0.131],
    [-0.145, 1.33, -0.164],
    [-0.088, 1.255, -0.172],
    [-0.015, 1.18, -0.17],
    [0.085, 1.075, -0.151],
    [0.19, 0.965, -0.104]
  ], 0.0021, mat.bagStitch, 38);
  strapFace.renderOrder = 3;
  addBox(model, 'Alça · passador de latão', [-0.004, 1.188, -0.176], [0.045, 0.052, 0.014], mat.brass, [0, 0, -0.64]);
  addBox(model, 'Alça · fivela interna', [-0.004, 1.188, -0.185], [0.021, 0.031, 0.006], mat.bagDark, [0, 0, -0.64]);

  // A alça e o corpo da bolsa ficam próximos ao corpo e seguem a animação;
  // a rotação é pequena para não atravessar a roupa durante corrida e salto.
  let phase = 0;
  let elapsed = 0;
  let jumpVelocity = 0;
  let jumpBaseY = 0;
  let airborne = false;
  let landingBlend = 0;
  let movementSpeed = 0;

  const resetPose = () => {
    for (const key of Object.keys(bones)) bones[key].rotation.set(0, 0, 0);
    rigRoot.position.set(0, 0, 0);
    bagPivot.rotation.set(0, 0, 0);
    model.rotation.set(0, 0, 0);
  };

  function jump() {
    if (airborne) return;
    airborne = true;
    jumpBaseY = model.position.y;
    jumpVelocity = 4.75;
  }

  function updateFallback(dt, speed) {
    movementSpeed = speed;
    elapsed += dt;
    const gait = THREE.MathUtils.clamp(speed / 4.2, 0, 1);
    const active = gait > 0.035;
    const strideRate = 3.2 + gait * 7.0;
    if (active) phase += dt * strideRate;

    if (airborne) {
      jumpVelocity -= 12.8 * dt;
      model.position.y += jumpVelocity * dt;
      if (model.position.y <= jumpBaseY) {
        model.position.y = jumpBaseY;
        jumpVelocity = 0;
        airborne = false;
        landingBlend = 0.2;
      }
    }
    landingBlend = Math.max(0, landingBlend - dt);

    const stride = gait * 0.54;
    const armSwing = gait * 0.34;
    const sin = Math.sin(phase);
    const cos = Math.cos(phase);
    const airPose = airborne ? 1 : 0;
    const landing = landingBlend > 0 ? landingBlend / 0.2 : 0;

    legRig.Left.thigh.rotation.x = sin * stride + airPose * 0.38;
    legRig.Right.thigh.rotation.x = -sin * stride + airPose * 0.38;
    legRig.Left.knee.rotation.x = 0.05 + Math.max(0, -sin) * gait * 0.46 + airPose * 0.72;
    legRig.Right.knee.rotation.x = 0.05 + Math.max(0, sin) * gait * 0.46 + airPose * 0.72;
    legRig.Left.foot.rotation.x = -legRig.Left.knee.rotation.x * 0.42;
    legRig.Right.foot.rotation.x = -legRig.Right.knee.rotation.x * 0.42;
    legRig.Left.toe.rotation.x = gait * 0.08;
    legRig.Right.toe.rotation.x = -gait * 0.08;

    const ninjaSprint = THREE.MathUtils.smoothstep(speed, 2.7, 4.0);
    armRig.Left.upper.rotation.x = (-sin * armSwing) * (1 - ninjaSprint) - 0.62 * ninjaSprint - airPose * 0.25;
    armRig.Right.upper.rotation.x = (sin * armSwing) * (1 - ninjaSprint) - 0.62 * ninjaSprint - airPose * 0.25;
    armRig.Left.upper.rotation.z = -0.035 - gait * 0.035 - ninjaSprint * 0.035;
    armRig.Right.upper.rotation.z = 0.035 + gait * 0.035 + ninjaSprint * 0.035;
    armRig.Left.elbow.rotation.x = 0.68 * ninjaSprint + airPose * 0.12;
    armRig.Right.elbow.rotation.x = 0.68 * ninjaSprint + airPose * 0.12;
    armRig.Left.elbow.rotation.z = 0.12 + Math.max(0, sin) * gait * 0.2 + airPose * 0.12;
    armRig.Right.elbow.rotation.z = -0.12 - Math.max(0, -sin) * gait * 0.2 - airPose * 0.12;

    hips.rotation.y = Math.sin(phase * 0.5) * gait * 0.025;
    spine.rotation.x = (active ? -0.018 - gait * 0.035 : Math.sin(elapsed * 1.25) * 0.008)
      + airPose * 0.045 - landing * 0.14;
    chest.rotation.x = active ? -gait * 0.035 : Math.sin(elapsed * 1.25 + 0.5) * 0.012;
    chest.rotation.z = active ? -Math.sin(phase) * gait * 0.018 : 0;
    neck.rotation.x = -chest.rotation.x * 0.55;
    head.rotation.x = -chest.rotation.x * 0.4 + Math.sin(elapsed * 0.8) * 0.012;
    head.rotation.y = Math.sin(elapsed * 0.55) * 0.027;
    rigRoot.position.y = active ? Math.abs(cos) * gait * 0.014 : Math.sin(elapsed * 1.25) * 0.003;

    bagPivot.rotation.x = Math.sin(phase - 0.55) * gait * 0.035 + airPose * 0.045;
    bagPivot.rotation.z = Math.cos(phase - 0.7) * gait * 0.045;
    bagPivot.rotation.y = Math.sin(phase * 0.5) * gait * 0.022;
    if (!active && !airborne) bagPivot.rotation.z *= 0.85;
  }

  const state = {
    model,
    human: null,
    ara: null,
    mixer: null,
    locomotion: null,
    locomotionName: 'Carter Kane · Game 3D gráfico',
    jump,
    updateFallback,
    resetFallback() {
      jumpVelocity = 0;
      airborne = false;
      landingBlend = 0;
      movementSpeed = 0;
      phase = 0;
      model.position.y = jumpBaseY = model.position.y;
      resetPose();
    },
    dispose() {
      model.removeFromParent();
      unitSphere.dispose();
      materials.forEach(material => material.dispose());
    },
    get movementSpeed() { return movementSpeed; },
    get isAirborne() { return airborne; },
    get weaponSocket() { return weaponSocket; }
  };

  onModeChange(state.locomotionName);
  return state;
}

/* Barco de chegada de Carter e Sadie — modelagem original guiada pelo capítulo 5 de The Red Pyramid.
   Casco de feixes de papiro amarrados, cabana de esteiras, tochas na proa e timoneiro
   pequeno na popa. Sem vela, motor ou estrutura de madeira aparente. */
export function buildPapyrusArrivalBoat({ THREE, scene, interactables }) {
  const boat = new THREE.Group();
  boat.name = 'barco de papiro da chegada de Carter e Sadie';
  boat.position.set(33.2, -0.85, 29);
  boat.rotation.y = 0.035;
  scene.add(boat);

  // Textura de esteira tecida: trama irregular de fibras claras e escuras.
  const weaveCanvas = document.createElement('canvas');
  weaveCanvas.width = weaveCanvas.height = 512;
  const g = weaveCanvas.getContext('2d');
  g.fillStyle = '#ae8954';
  g.fillRect(0, 0, 512, 512);
  let seed = 17429;
  const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let y = 0; y < 512; y += 8) {
    g.strokeStyle = y % 16 === 0 ? '#d1ad74' : '#86643e';
    g.lineWidth = 2.4 + rnd() * 1.6;
    g.globalAlpha = 0.55 + rnd() * 0.3;
    g.beginPath();
    g.moveTo(0, y + rnd() * 3);
    g.bezierCurveTo(125, y - 3, 330, y + 5, 512, y + rnd() * 3);
    g.stroke();
  }
  for (let x = 0; x < 512; x += 10) {
    g.strokeStyle = x % 20 === 0 ? '#d8bd8d' : '#6c5135';
    g.lineWidth = 1.6 + rnd() * 1.5;
    g.globalAlpha = 0.38 + rnd() * 0.28;
    g.beginPath();
    g.moveTo(x + rnd() * 2, 0);
    g.lineTo(x - 4 + rnd() * 5, 512);
    g.stroke();
  }
  g.globalAlpha = 1;
  const weave = new THREE.CanvasTexture(weaveCanvas);
  weave.colorSpace = THREE.SRGBColorSpace;
  weave.wrapS = weave.wrapT = THREE.RepeatWrapping;
  weave.repeat.set(2.2, 1.6);
  weave.anisotropy = 8;

  const reedMats = [
    new THREE.MeshStandardMaterial({ color: 0xd2b17b, map: weave, roughness: 0.96 }),
    new THREE.MeshStandardMaterial({ color: 0xb99461, map: weave, roughness: 0.98 }),
    new THREE.MeshStandardMaterial({ color: 0xc5a171, map: weave, roughness: 0.97 })
  ];
  const ropeMat = new THREE.MeshStandardMaterial({ color: 0x6d5030, roughness: 1 });
  const darkRope = new THREE.MeshStandardMaterial({ color: 0x463522, roughness: 1 });
  const matMaterial = new THREE.MeshStandardMaterial({
    map: weave, color: 0xd7bd8d, roughness: 1, side: THREE.DoubleSide
  });
  const timber = new THREE.MeshStandardMaterial({ color: 0x755333, roughness: 0.94 });
  const cloakMat = new THREE.MeshStandardMaterial({ color: 0x343a35, roughness: 1 });
  const hatMat = new THREE.MeshStandardMaterial({ color: 0x4a3a2a, roughness: 1 });

  function tube(name, points, material, radius, segments = 64, radial = 7) {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, segments, radius, radial, false), material);
    mesh.name = name;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    boat.add(mesh);
    return mesh;
  }
  function box(name, position, size, material, castShadow = true) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
    mesh.name = name;
    mesh.position.set(...position);
    mesh.castShadow = castShadow;
    mesh.receiveShadow = true;
    boat.add(mesh);
    return mesh;
  }

  // Feixes longos e arredondados, afinando nas pontas e arqueando para fora d'água.
  // O conjunto substitui um casco rígido: a leitura deve ser de papiro amarrado.
  const longitudinalOffsets = [-1.02, -0.78, -0.54, -0.3, -0.06, 0.18, 0.42, 0.66, 0.9, 1.08];
  longitudinalOffsets.forEach((offset, index) => {
    const points = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const z = -6.0 + t * 12.0;
      const taper = 0.22 + 0.78 * Math.pow(Math.sin(Math.PI * t), 0.68);
      const rise = Math.pow(Math.abs(z) / 6, 3.4) * 0.9;
      const sideLift = Math.pow(Math.abs(offset) / 1.08, 2) * 0.24;
      points.push([offset * taper, 0.42 + rise + sideLift, z]);
    }
    tube('feixe longitudinal de papiro ' + index, points, reedMats[index % reedMats.length], index === 0 || index === 9 ? 0.135 : 0.16, 96, 8);
  });

  // Bordas elevadas e rolos de reforço nas duas pontas.
  for (const side of [-1, 1]) {
    tube('rolo lateral de fibras vegetais', [
      [side * 0.72, 0.7, -5.8], [side * 1.0, 0.78, -4.5],
      [side * 1.12, 0.72, -1.8], [side * 1.1, 0.7, 1.8],
      [side * 0.98, 0.78, 4.5], [side * 0.72, 0.7, 5.8]
    ], reedMats[1], 0.19, 84, 9);
    tube('amurada trançada elevada', [
      [side * 0.82, 0.78, -5.7], [side * 1.12, 0.94, -4.4],
      [side * 1.25, 0.91, -1.5], [side * 1.25, 0.9, 1.5],
      [side * 1.1, 0.94, 4.4], [side * 0.82, 0.78, 5.7]
    ], ropeMat, 0.085, 72, 7);
  }
  for (let i = 0; i < 8; i++) {
    const z = -4.7 + i * 1.34;
    tube('amarração transversal do casco', [
      [-1.08, 0.73, z - 0.18], [-1.12, 0.58, z],
      [-0.72, 0.43, z + 0.04], [0, 0.37, z],
      [0.72, 0.43, z - 0.04], [1.12, 0.58, z],
      [1.08, 0.73, z + 0.18]
    ], i % 2 ? ropeMat : darkRope, 0.047, 36, 6);
  }

  // Piso trançado dentro do casco, sem banco de madeira ostensivo.
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 8.8), matMaterial);
  floor.name = 'esteira de piso do barco';
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0.69, 0);
  floor.receiveShadow = true;
  boat.add(floor);

  // Cabana central: paredes de esteira e cobertura contínua em arco.
  const roofGeometry = new THREE.BufferGeometry();
  const roofPositions = [], roofUvs = [], roofIndices = [];
  const across = 16, along = 16;
  for (let j = 0; j <= along; j++) {
    const v = j / along;
    const z = -2.18 + v * 4.36;
    for (let i = 0; i <= across; i++) {
      const u = i / across;
      const angle = -Math.PI / 2 + u * Math.PI;
      roofPositions.push(1.02 * Math.sin(angle), 2.2 + 0.72 * Math.cos(angle), z);
      roofUvs.push(u, v);
    }
  }
  for (let j = 0; j < along; j++) {
    for (let i = 0; i < across; i++) {
      const a = j * (across + 1) + i;
      const b = a + across + 1;
      roofIndices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  roofGeometry.setAttribute('position', new THREE.Float32BufferAttribute(roofPositions, 3));
  roofGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(roofUvs, 2));
  roofGeometry.setIndex(roofIndices);
  roofGeometry.computeVertexNormals();
  const roofMat = matMaterial.clone();
  roofMat.side = THREE.DoubleSide;
  const roof = new THREE.Mesh(roofGeometry, roofMat);
  roof.name = 'cobertura arqueada de esteiras da cabana';
  roof.castShadow = true;
  roof.receiveShadow = true;
  boat.add(roof);

  for (const side of [-1, 1]) {
    const wall = box('lateral fechada de esteira da cabana', [side * 0.98, 1.72, -0.02], [0.09, 0.94, 4.25], matMaterial);
    wall.material = matMaterial;
  }
  for (const z of [-2.16, 2.16]) {
    const end = box('fechamento de esteira da cabana', [0, 1.72, z], [1.92, 0.92, 0.08], matMaterial);
    end.material = matMaterial;
  }
  // Costuras e bordas de fibra que seguram a cobertura no lugar.
  for (const z of [-2.15, -0.72, 0.72, 2.15]) {
    tube('corda de amarração da cobertura', [
      [-1.02, 2.18, z], [-0.78, 2.65, z],
      [0, 2.94, z], [0.78, 2.65, z], [1.02, 2.18, z]
    ], ropeMat, 0.038, 32, 6);
  }
  tube('acabamento de fibra na borda da cabana', [
    [-1.03, 2.18, -2.16], [-1.03, 2.18, 2.16]
  ], darkRope, 0.055, 32, 6);
  tube('acabamento de fibra na borda da cabana', [
    [1.03, 2.18, -2.16], [1.03, 2.18, 2.16]
  ], darkRope, 0.055, 32, 6);

  // Timoneiro na popa: figura pequena, com o casaco e o chapéu de Amos;
  // o rosto permanece praticamente escondido pela sombra da aba.
  const steersman = new THREE.Group();
  steersman.name = 'pequena figura timoneira com casaco e chapéu de Amos';
  steersman.position.set(0, 0, -4.85);
  boat.add(steersman);
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.4, 0.95, 10), cloakMat);
  torso.position.set(0, 1.18, 0);
  torso.rotation.x = -0.12;
  torso.castShadow = true;
  steersman.add(torso);
  const hood = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 10), cloakMat);
  hood.position.set(0, 1.82, 0.03);
  hood.scale.set(0.88, 1.05, 0.9);
  hood.castShadow = true;
  steersman.add(hood);
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.075, 16), hatMat);
  brim.position.set(0, 2.02, 0.02);
  brim.castShadow = true;
  steersman.add(brim);
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.26, 0.3, 14), hatMat);
  crown.position.set(0, 2.2, 0.02);
  crown.castShadow = true;
  steersman.add(crown);
  // Mangas/casaco abaixadas, sem traços faciais visíveis.
  for (const side of [-1, 1]) {
    const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.58, 8), cloakMat);
    sleeve.position.set(side * 0.28, 1.3, 0.25);
    sleeve.rotation.z = side * -0.42;
    steersman.add(sleeve);
  }
  tube('tiller de madeira junto ao timoneiro', [
    [0, 0.88, -5.35], [0.08, 1.15, -5.0],
    [0.12, 1.45, -4.7], [0.05, 1.62, -4.35]
  ], timber, 0.055, 28, 7);

  // Duas tochas baixas na proa, não mastros.
  const torchWood = new THREE.MeshStandardMaterial({ color: 0x523a25, roughness: 1 });
  const flameMat = new THREE.MeshStandardMaterial({
    color: 0xffc36a, emissive: 0xff8d2c, emissiveIntensity: 2.4, roughness: 0.3
  });
  const flameCore = new THREE.MeshBasicMaterial({ color: 0xffe2a0 });
  for (const x of [-0.58, 0.58]) {
    const support = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.07, 0.48, 8), torchWood);
    support.position.set(x, 0.97, 5.15);
    boat.add(support);
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.38, 9), flameMat);
    flame.name = 'chama da tocha na proa';
    flame.position.set(x, 1.38, 5.15);
    boat.add(flame);
    const core = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.22, 7), flameCore);
    core.position.set(x, 1.42, 5.15);
    boat.add(core);
    const light = new THREE.PointLight(0xffa64d, 0.48, 7);
    light.position.set(x, 1.55, 5.15);
    boat.add(light);
  }

  // Passarela curta de embarque e duas defensas de corda, ligando o barco ao cais.
  box('passarela de embarque entre cais e barco', [-2.1, 1.02, 0.05], [2.0, 0.14, 0.92], timber, true);
  box('travessa da passarela de embarque', [-2.1, 1.11, -0.28], [1.85, 0.06, 0.12], ropeMat, false);
  box('travessa da passarela de embarque', [-2.1, 1.11, 0.36], [1.85, 0.06, 0.12], ropeMat, false);
  for (const z of [-4.4, 4.4]) {
    tube('cabo de amarração ao cais', [
      [-1.18, 1.08, z], [-2.05, 1.02, z + 0.3],
      [-3.0, 0.98, z + 0.5]
    ], ropeMat, 0.045, 24, 6);
  }

  interactables.push({
    label: 'Barco de papiro',
    position: new THREE.Vector3(33.2, 0.95, 29),
    radius: 5.2,
    description: 'Um barco de fibras vegetais trançadas, com uma cabana de esteiras no centro e tochas baixas na proa. Na popa, uma figura pequena usa um casaco e um chapéu que lembram os de Amos; o rosto quase não aparece sob a aba. Não há vela nem motor.',
    onInteract: () => 'O barco deslizou pelo East River e está agora amarrado ao pequeno cais do Brooklyn.'
  });

  return boat;
}

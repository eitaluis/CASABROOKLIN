/* Continuidade urbana do East River: margens, acessos da ponte, cais e Brooklyn/Manhattan.
   As massas próximas usam geometria original. Modelos CC0 do GitHub entram somente
   como marcos distantes, depois de conferência de licença e estrutura do GLB. */
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function buildWaterfrontEnvironment({ THREE, scene, isTouchDevice = false, brickTexture }) {
  const env = new THREE.Group();
  env.name = 'East River — waterfront Brooklyn e Manhattan';
  scene.add(env);

  // Desliga apenas o antigo skyline genérico em cubos: ele é substituído por
  // fachadas industriais, ruas, margens e marcos arquitetônicos mais legíveis.
  const replacedNames = new Set([
    'muralha de cais de Manhattan',
    'armazém baixo da margem de Manhattan',
    'telhado industrial na margem distante',
    'torre distante de Manhattan',
    'recuo superior art déco',
    'coroamento escalonado',
    'agulha art déco no skyline distante',
    'casa de máquinas no topo dos edifícios',
    'janelas iluminadas no skyline de Manhattan',
    'massa urbana atmosférica ao fundo',
    'reflexo difuso da margem distante'
  ]);
  scene.traverse(object => {
    if (replacedNames.has(object.name)) object.visible = false;
  });

  // A névoa continua presente no horizonte, mas deixa de apagar a cidade inteira.
  scene.background = new THREE.Color(0x7796a4);
  if (scene.fog) {
    scene.fog.color.setHex(0x96aeb6);
    scene.fog.density = isTouchDevice ? 0.00048 : 0.00056;
  }

  const brickMap = brickTexture ? brickTexture.clone() : null;
  if (brickMap) {
    brickMap.wrapS = brickMap.wrapT = THREE.RepeatWrapping;
    brickMap.repeat.set(4.2, 3.0);
    brickMap.anisotropy = isTouchDevice ? 2 : 8;
    brickMap.needsUpdate = true;
  }

  const concrete = new THREE.MeshStandardMaterial({ color: 0x8c887e, roughness: 0.98 });
  const weatheredStone = new THREE.MeshStandardMaterial({ color: 0xb1a38e, roughness: 0.96 });
  const darkStone = new THREE.MeshStandardMaterial({ color: 0x5c5a54, roughness: 1 });
  const steel = new THREE.MeshStandardMaterial({ color: 0x59676a, metalness: 0.66, roughness: 0.58 });
  const paintedSteel = new THREE.MeshStandardMaterial({ color: 0x61766f, metalness: 0.42, roughness: 0.72 });
  const asphalt = new THREE.MeshStandardMaterial({ color: 0x394348, roughness: 0.98 });
  const roadStripe = new THREE.MeshStandardMaterial({ color: 0xe4d2a1, roughness: 0.8 });
  const windowGlass = new THREE.MeshStandardMaterial({
    color: 0x8eabb8, metalness: 0.22, roughness: 0.3,
    emissive: 0x182d38, emissiveIntensity: 0.16
  });
  const warmWindow = new THREE.MeshStandardMaterial({
    color: 0xc6a879, emissive: 0x745333, emissiveIntensity: 0.32, roughness: 0.72
  });
  const wood = new THREE.MeshStandardMaterial({ color: 0x76583a, roughness: 0.96 });
  const brickMaterials = [
    new THREE.MeshStandardMaterial({ color: 0xd0a18b, map: brickMap, roughness: 0.97 }),
    new THREE.MeshStandardMaterial({ color: 0xb9826d, map: brickMap, roughness: 0.98 }),
    new THREE.MeshStandardMaterial({ color: 0xc6a18a, map: brickMap, roughness: 0.98 })
  ];
  const limestone = new THREE.MeshStandardMaterial({ color: 0xc2b7a4, roughness: 0.9 });
  const blueFacade = new THREE.MeshStandardMaterial({ color: 0x91a9b1, roughness: 0.48, metalness: 0.12 });

  function addBox(name, position, size, material, cast = true) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
    mesh.name = name;
    mesh.position.set(...position);
    mesh.castShadow = cast;
    mesh.receiveShadow = true;
    env.add(mesh);
    return mesh;
  }
  function addBeam(name, a, b, radius, material, radial = 8) {
    const va = new THREE.Vector3(...a);
    const vb = new THREE.Vector3(...b);
    const delta = new THREE.Vector3().subVectors(vb, va);
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, delta.length(), radial), material);
    mesh.name = name;
    mesh.position.copy(va).add(vb).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    env.add(mesh);
    return mesh;
  }
  function addTube(name, points, radius, material, segments = 48) {
    const curve = new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point)));
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, segments, radius, 7, false), material);
    mesh.name = name;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    env.add(mesh);
    return mesh;
  }
  function addCylinder(name, x, y, z, radiusTop, radiusBottom, height, material, segments = 14) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments), material);
    mesh.name = name;
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    env.add(mesh);
    return mesh;
  }

  // Terra firme contínua nos dois lados; o rio ocupa estritamente o intervalo x=30..590.
  addBox('solo urbano do Brooklyn', [-200, -0.3, 60], [460, 0.5, 420], darkStone, false);
  addBox('solo urbano de Manhattan', [845, -0.3, 60], [510, 0.5, 420], darkStone, false);

  // Ruas transversais entre os quarteirões. O eixo x é a profundidade
  // da cidade em direção ao rio; as faixas ficam nos intervalos entre os galpões.
  for (const z of [-70, -5, 80, 205]) {
    addBox('rua transversal do Brooklyn', [-200, 0.02, z], [430, 0.14, 9], asphalt, false);
    addBox('rua transversal de Manhattan', [845, 0.02, z], [490, 0.14, 9], asphalt, false);
    for (const x of [-390, -320, -250, -180, -110, 620, 700, 780, 860, 940, 1020]) {
      addBox('marcação de faixa da rua transversal', [x, 0.105, z], [4.6, 0.025, 0.16], roadStripe, false);
    }
  }

  // Muros de contenção e coroamento: o vão principal acompanha a pequena doca,
  // em vez de abrir dezenas de metros de cais sem função.
  for (const [z, length] of [[-64, 172], [154, 232]]) {
    addBox('muro de cais do Brooklyn', [30.8, 0.95, z], [1.5, 2.1, length], concrete, false);
    addBox('coroamento de pedra do cais do Brooklyn', [30.8, 2.05, z], [2.5, 0.32, length], weatheredStone, false);
  }
  addBox('muro de cais de Manhattan', [589.1, 1.25, 60], [2.0, 2.7, 420], concrete, false);
  addBox('coroamento de pedra do cais de Manhattan', [589.1, 2.65, 60], [2.7, 0.34, 420], weatheredStone, false);
  for (const x of [29.95, 588.0]) {
    const ranges = x < 100 ? [[-150, 20], [38, 270]] : [[-145, 265]];
    for (const [z0, z1] of ranges) {
      for (let z = z0; z <= z1; z += 18) {
        addBox('pilastra de cantaria do cais', [x, 0.95, z], [1.1, 2.25, 1.2], weatheredStone, false);
      }
    }
  }

  // Pedras de enrocamento sob o coroamento, cobrindo a transição terra/água
  // sem fechar o vão curto da doca principal.
  const riprapGeometry = new THREE.IcosahedronGeometry(.48, 0);
  const riprapMaterial = new THREE.MeshStandardMaterial({ color: 0x777a70, roughness: 1 });
  const riprap = new THREE.InstancedMesh(riprapGeometry, riprapMaterial, 100);
  riprap.name = 'pedras de enrocamento ao longo do cais do Brooklyn';
  const rockDummy = new THREE.Object3D();
  let rockIndex = 0;
  for (const [z0, z1] of [[-150, 20], [38, 270]]) {
    for (let z = z0; z <= z1; z += 4.2) {
      rockDummy.position.set(31.15 + Math.sin(z * .17) * .35, -.38, z);
      rockDummy.rotation.set(.12 * Math.cos(z), .22 * Math.sin(z * .11), .08 * Math.cos(z * .13));
      rockDummy.scale.set(1.45, .7 + Math.abs(Math.sin(z)) * .35, 1.05);
      rockDummy.updateMatrix();
      riprap.setMatrixAt(rockIndex++, rockDummy.matrix);
    }
  }
  riprap.count = rockIndex;
  riprap.instanceMatrix.needsUpdate = true;
  riprap.castShadow = true;
  riprap.receiveShadow = true;
  env.add(riprap);

  // Píeres laterais de carga, afastados do corredor principal da ponte.
  function addFingerPier(centerX, z, length, name, towardRiver = 1) {
    const width = 8.5;
    const midX = centerX + towardRiver * length / 2;
    addBox(name + ' — deck de madeira', [midX, 0.48, z], [length, 0.38, width], wood, true);
    for (let x = centerX + towardRiver * 4; towardRiver > 0 ? x <= centerX + length : x >= centerX - length; x += towardRiver * 12) {
      for (const side of [-1, 1]) addCylinder(name + ' — estaca', x, -0.45, z + side * (width / 2 - 0.6), 0.34, 0.4, 2.2, wood, 12);
    }
    for (const side of [-1, 1]) {
      addBox(name + ' — defensas', [midX, 0.38, z + side * (width / 2 + 0.25)], [length - 4, 0.36, 0.3], darkStone, false);
    }
    for (const x of [centerX + towardRiver * 5, centerX + towardRiver * (length - 4)]) {
      addCylinder(name + ' — cabeço', x, 0.95, z, 0.2, 0.2, 0.8, steel, 12);
    }
  }
  addFingerPier(31.8, -104, 52, 'píer industrial norte do Brooklyn');
  addFingerPier(31.8, 238, 48, 'píer industrial sul do Brooklyn');
  addFingerPier(588.0, -105, 42, 'píer de carga de Manhattan', -1);
  addFingerPier(588.0, 242, 38, 'píer secundário de Manhattan', -1);

  // Cabeços e defensas menores nos trechos de margem livres.
  for (const z of [-12, 0, 12, 44, 56, 68]) {
    addCylinder('cabeço de amarração do cais principal', 29.45, 0.72, z, 0.23, 0.23, 0.78, steel, 12);
    addCylinder('base do cabeço do cais principal', 29.45, 0.32, z, 0.33, 0.33, 0.12, darkStone, 12);
  }

  // Rampas longas e maciças: a estrada liga as margens à ponte sem terminar
  // visualmente no rio. O corredor cruza o East River mais ao sul do píer da casa.
  function surfaceYAt(x, x0, y0, x1, y1) {
    const t = THREE.MathUtils.clamp((x - x0) / (x1 - x0), 0, 1);
    return y0 + (y1 - y0) * t;
  }
  function addApproachRamp(label, x0, y0, x1, y1, zCenter) {
    const width = 18;
    const span = x1 - x0;
    const deckThickness = .85;
    const slope = Math.atan2(y1 - y0, span);
    const road = new THREE.Mesh(new THREE.BoxGeometry(Math.abs(span), deckThickness, width), asphalt);
    road.name = label + ' — tabuleiro maciço da pista de aproximação';
    road.position.set((x0 + x1) / 2, (y0 + y1) / 2 - deckThickness / 2, zCenter);
    road.rotation.z = slope;
    road.castShadow = true;
    road.receiveShadow = true;
    env.add(road);

    // Guarda-corpo, montantes e faixas acompanham a rampa de ponta a ponta.
    for (const side of [-1, 1]) {
      const z = zCenter + side * (width / 2 - 0.35);
      const railPoints = [];
      for (let i = 0; i <= 18; i++) {
        const t = i / 18;
        const x = x0 + span * t;
        railPoints.push([x, surfaceYAt(x, x0, y0, x1, y1) + 1.12, z]);
      }
      addTube(label + ' — guarda-corpo', railPoints, 0.16, concrete, 120);
      for (let i = 0; i <= 30; i++) {
        const t = i / 30;
        const x = x0 + span * t;
        const y = surfaceYAt(x, x0, y0, x1, y1);
        addBeam(label + ' — montante do guarda-corpo',
          [x, y + 0.15, z], [x, y + 1.08, z], 0.075, steel, 7);
      }
    }

    // Vias rodoviárias laterais e trilhos centrais do metrô na mesma estrutura.
    const direction = Math.sign(span);
    for (let x = x0 + direction * 14; direction > 0 ? x < x1 - 8 : x > x1 + 8; x += direction * 25) {
      const y = surfaceYAt(x, x0, y0, x1, y1) + 0.045;
      addBox(label + ' — faixa central da via norte', [x, y, zCenter - 6.0], [8, 0.035, 0.16], roadStripe, false);
      addBox(label + ' — faixa central da via sul', [x, y, zCenter + 6.0], [8, 0.035, 0.16], roadStripe, false);
      addBox(label + ' — limite rodoviário da via norte', [x, y, zCenter - 3.05], [8, 0.035, 0.12], roadStripe, false);
      addBox(label + ' — limite rodoviário da via sul', [x, y, zCenter + 3.05], [8, 0.035, 0.12], roadStripe, false);
    }

    const trackHalfWidth = 2.9;
    const sleeperCount = Math.floor(Math.abs(span) / 4.2) + 1;
    const sleeperMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(.95,.13,5.5), wood, sleeperCount);
    sleeperMesh.name = label + ' — dormentes de madeira';
    const sleeperObject = new THREE.Object3D();
    let sleeperIndex = 0;
    for (let x = x0; direction > 0 ? x <= x1 : x >= x1; x += direction * 4.2) {
      const y = surfaceYAt(x, x0, y0, x1, y1) + .205;
      sleeperObject.position.set(x, y, zCenter);
      sleeperObject.rotation.z = slope;
      sleeperObject.updateMatrix();
      sleeperMesh.setMatrixAt(sleeperIndex++, sleeperObject.matrix);
    }
    sleeperMesh.count = sleeperIndex;
    sleeperMesh.instanceMatrix.needsUpdate = true;
    sleeperMesh.castShadow = true;
    sleeperMesh.receiveShadow = true;
    env.add(sleeperMesh);
    for (const offset of [-1.8, -.4, .4, 1.8]) {
      const points = [];
      for (let i=0;i<=56;i++) {
        const t=i/56;
        const x=x0+span*t;
        points.push([x,surfaceYAt(x,x0,y0,x1,y1)+.34,zCenter+offset]);
      }
      addTube(label + ' — trilho do metrô', points, 0.075, steel, 112);
    }

    // Apoios estruturais afastados da casa e do ponto inicial.
    const step=48;
    for(let x=x0+direction*34;direction>0?x<x1-18:x>x1+18;x+=direction*step){
      const y=surfaceYAt(x,x0,y0,x1,y1);
      if(y<3.2)continue;
      for(const side of [-1,1]){
        const z=zCenter+side*6.25;
        addBox(label+' — pilar retangular de concreto',[x,y/2-.08,z],[2.15,y+.2,2.15],concrete,true);
        addBox(label+' — capitel do pilar',[x,y-.55,z],[2.9,.72,2.85],weatheredStone,false);
      }
      addBox(label+' — travessa dos pilares',[x,y-1.0,zCenter],[3.4,.85,16.0],concrete,true);
    }
  }
  addApproachRamp('aproximação do Brooklyn à Williamsburg Bridge', 21, 41.2, -425, 1.8, 140);
  addApproachRamp('aproximação de Manhattan à Williamsburg Bridge', 591, 41.2, 1040, 1.8, 140);

  // Galpões, fábricas e edifícios de tijolo no lado do Brooklyn e da outra margem.
  const windowGeometry = new THREE.BoxGeometry(0.16, 1.9, 1.3);
  const windowMatrices = [];
  const temp = new THREE.Object3D();
  let litWindowIndex = 0;

  function addFactory({ x, z, width, depth, height, orientation = 1, materialIndex = 0, fireEscape = false, rooftop = true, color }) {
    const base = 0.08;
    const material = color
      ? new THREE.MeshStandardMaterial({ color, map: brickMap, roughness: 0.97 })
      : brickMaterials[materialIndex % brickMaterials.length];
    addBox('fábrica de tijolo do waterfront', [x, base + height / 2, z], [width, height, depth], material, true);
    addBox('platibanda de fábrica industrial', [x, base + height + 0.35, z], [width + 0.8, 0.7, depth + 0.8], material, false);
    addBox('beiral de pedra de fábrica', [x + orientation * (width / 2 + 0.48), base + height + 0.18, z], [0.42, 0.26, depth + 0.55], weatheredStone, false);

    const faceX = x + orientation * (width / 2 + 0.105);
    const floors = Math.max(2, Math.floor(height / 4.2));
    const count = Math.max(4, Math.floor(depth / 4.0));
    for (let row = 0; row < floors; row++) {
      const y = base + 3.0 + row * ((height - 4.0) / floors);
      for (let col = 0; col < count; col++) {
        const zz = z - depth / 2 + 2.1 + col * ((depth - 4.2) / Math.max(1, count - 1));
        temp.position.set(faceX, y, zz);
        temp.updateMatrix();
        windowMatrices.push(temp.matrix.clone());
        if ((row + col + litWindowIndex) % 8 === 0) {
          // Uma parcela pequena de janelas acesas aquece a fachada sem virar grade luminosa.
          addBox('janela acesa de fábrica', [faceX + orientation * 0.1, y, zz], [0.08, 1.85, 1.25], warmWindow, false);
        }
      }
    }
    litWindowIndex++;

    if (fireEscape) {
      const escapeZ = z + depth * 0.23;
      for (let floor = 0; floor < Math.min(4, floors); floor++) {
        const y = base + 2.7 + floor * 3.8;
        addBox('patamar da escada de incêndio', [faceX + orientation * 0.9, y, escapeZ], [1.45, 0.18, 5.0], steel, true);
        for (const side of [-1, 1]) {
          addBeam('corrimão da escada de incêndio',
            [faceX + orientation * 0.9, y + 0.12, escapeZ + side * 2.45],
            [faceX + orientation * 0.9, y + 1.0, escapeZ + side * 2.45], 0.055, steel, 6);
        }
        addBeam('guarda-corpo horizontal da escada de incêndio',
          [faceX + orientation * 0.9, y + 1.0, escapeZ - 2.45],
          [faceX + orientation * 0.9, y + 1.0, escapeZ + 2.45], 0.055, steel, 6);
      }
      addBeam('escada vertical de incêndio',
        [faceX + orientation * 0.9, base + 0.8, escapeZ],
        [faceX + orientation * 0.9, base + height - 0.6, escapeZ], 0.06, steel, 6);
    }

    if (rooftop) {
      addBox('plataforma de equipamentos de cobertura', [x - width * 0.18, base + height + 0.85, z], [width * 0.36, 0.22, depth * 0.48], darkStone, false);
      const tx = x - width * 0.2, tz = z - depth * 0.2;
      addCylinder('tanque dágua elevado do Brooklyn', tx, base + height + 2.45, tz, 1.8, 1.8, 3.2, wood, 16);
      addCylinder('aro superior do tanque dágua', tx, base + height + 4.08, tz, 1.92, 1.92, 0.14, steel, 16);
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
        addBeam('perna do tanque dágua', [tx + sx * 1.1, base + height + 0.16, tz + sz * 1.1],
          [tx + sx * 1.1, base + height + 0.9, tz + sz * 1.1], 0.085, steel, 7);
      }
      if (height > 16) {
        const stackX = x + width * 0.26, stackZ = z + depth * 0.22;
        addCylinder('chaminé de tijolo no telhado', stackX, base + height + 2.4, stackZ, 0.85, 1.0, 4.6, brickMaterials[1], 12);
        addCylinder('coroamento da chaminé', stackX, base + height + 4.75, stackZ, 1.14, 0.92, 0.32, darkStone, 12);
      }
    }
  }

  // Brooklyn: galpões, antigas fábricas de tijolo e edifícios baixos de uso misto.
  const brooklynFactories = [
    { x: -64, z: -104, width: 40, depth: 44, height: 21, materialIndex: 1, fireEscape: true },
    { x: -58, z: 205, width: 34, depth: 42, height: 18, materialIndex: 0 },
    { x: -112, z: -42, width: 48, depth: 42, height: 29, materialIndex: 2, fireEscape: true },
    { x: -118, z: 198, width: 46, depth: 48, height: 25, materialIndex: 1 },
    { x: -190, z: -104, width: 54, depth: 56, height: 35, materialIndex: 0, fireEscape: true },
    { x: -194, z: 208, width: 58, depth: 48, height: 31, materialIndex: 2 },
    { x: -274, z: -72, width: 52, depth: 54, height: 37, materialIndex: 1, fireEscape: true },
    { x: -286, z: 218, width: 54, depth: 50, height: 28, materialIndex: 0 }
  ];
  brooklynFactories.forEach(factory => addFactory({ ...factory, orientation: 1 }));

  // Manhattan: depósitos de tijolo junto à água, depois quarteirões e torres em camadas.
  const manhattanFactories = [
    { x: 620, z: -108, width: 42, depth: 48, height: 21, materialIndex: 1, orientation: -1 },
    { x: 624, z: -40, width: 38, depth: 44, height: 18, materialIndex: 0, orientation: -1 },
    { x: 622, z: 210, width: 48, depth: 50, height: 25, materialIndex: 2, orientation: -1 },
    { x: 665, z: -128, width: 46, depth: 48, height: 39, materialIndex: 0, orientation: -1, fireEscape: true },
    { x: 668, z: -46, width: 48, depth: 46, height: 48, materialIndex: 2, orientation: -1 },
    { x: 670, z: 220, width: 50, depth: 52, height: 34, materialIndex: 1, orientation: -1 },
    { x: 716, z: -126, width: 52, depth: 48, height: 72, materialIndex: 0, orientation: -1, color: 0xb5a38e },
    { x: 720, z: 0, width: 48, depth: 44, height: 86, materialIndex: 1, orientation: -1, color: 0x8ba4ac },
    { x: 724, z: 235, width: 54, depth: 50, height: 70, materialIndex: 2, orientation: -1, color: 0xb8a58e },
    { x: 784, z: -114, width: 50, depth: 48, height: 96, materialIndex: 1, orientation: -1, color: 0x849da7 },
    { x: 794, z: 12, width: 58, depth: 52, height: 112, materialIndex: 0, orientation: -1, color: 0x9babb0 },
    { x: 796, z: 245, width: 56, depth: 50, height: 88, materialIndex: 2, orientation: -1, color: 0xb5a28d }
  ];
  manhattanFactories.forEach(factory => addFactory({ ...factory, rooftop: true }));

  // Pequenas oficinas, casas de tijolo e telhados irregulares atrás das fábricas.
  const rowHouseMat = brickMaterials[2];
  for (let row = 0; row < 7; row++) {
    const x = -330 + row * 28;
    for (const z of [-174, 258]) {
      const width = 22 + (row % 3) * 3;
      const height = 10 + (row % 2) * 3;
      addBox('sobrado de tijolo do Brooklyn', [x, height / 2, z], [width, height, 23], rowHouseMat, true);
      addBox('telhado plano de sobrado', [x, height + 0.12, z], [width + 0.5, 0.24, 23.5], weatheredStone, false);
    }
  }

  // Guindaste de carga antigo no cais industrial do Brooklyn, com roldana e gancho.
  function buildHarborCrane(x, z, reach = 22) {
    const y0 = 0.25, top = 17.5;
    for (const dx of [-2.1, 2.1]) {
      addBeam('perna inclinada do guindaste portuário', [x + dx, y0, z], [x + dx * 0.65, top, z], 0.3, paintedSteel, 10);
    }
    addBeam('travessa superior do guindaste', [x - 2, top, z], [x + 2, top, z], 0.34, paintedSteel, 10);
    addBeam('lança horizontal do guindaste', [x, top - 0.2, z], [x + reach, top - 0.2, z], 0.27, paintedSteel, 10);
    addBeam('tirante do guindaste', [x, top - 0.2, z], [x + reach * 0.65, top + 5, z], 0.095, steel, 8);
    addBeam('tirante secundário do guindaste', [x + reach * 0.65, top + 5, z], [x + reach, top - 0.2, z], 0.095, steel, 8);
    addTube('cabo de içamento do guindaste', [
      [x + reach * 0.75, top + 3.1, z], [x + reach * 0.75, top - 7.5, z]
    ], 0.045, steel, 18);
    addBeam('gancho de içamento', [x + reach * 0.75, top - 7.5, z], [x + reach * 0.75 + 0.22, top - 8.4, z], 0.09, darkStone, 10);
  }
  buildHarborCrane(-6, -100, 26);
  buildHarborCrane(584, 238, -26);

  // Depósitos de carga: portões, vigas de cobertura e ventiladores de telhado.
  for (const [x, z, width, depth, height] of [
    [-36, -160, 42, 28, 14], [-42, 205, 46, 30, 16],
    [610, -170, 40, 32, 16], [614, 208, 46, 34, 18]
  ]) {
    addBox('anexo de depósito portuário', [x, height / 2, z], [width, height, depth], brickMaterials[0], true);
    addBox('telhado de depósito portuário', [x, height + 0.4, z], [width + 1.2, 0.8, depth + 1.2], darkStone, false);
    for (const side of [-1, 1]) {
      addBox('portão de carga de depósito', [x + side * (width / 2 + 0.09), 4.1, z], [0.18, 7.0, 8.5], paintedSteel, false);
    }
  }

  // Janelas em lote para reduzir draw calls em desktop e, sobretudo, mobile.
  if (windowMatrices.length) {
    const windows = new THREE.InstancedMesh(windowGeometry, windowGlass, windowMatrices.length);
    windows.name = 'janelas repetidas das fachadas do waterfront';
    windowMatrices.forEach((matrix, index) => windows.setMatrixAt(index, matrix));
    windows.instanceMatrix.needsUpdate = true;
    windows.castShadow = false;
    windows.receiveShadow = false;
    env.add(windows);
  }

  // Torres art déco e modernas genéricas fazem a transição até o skyline real.
  // O horizonte antigo em torres isoladas foi substituído pelas três faixas urbanas abaixo.


  // Linha de horizonte urbana no eixo de visão inicial de Carter.
  // O cenário anterior concentrava os edifícios nas laterais; esta faixa
  // fecha o horizonte à frente sem esconder o East River nem a Brooklyn House.
  const horizonLand = new THREE.Mesh(
    new THREE.BoxGeometry(980, .72, 390),
    darkStone
  );
  horizonLand.name = 'aterro urbano e quadras ao fim do East River';
  horizonLand.position.set(205, -.32, -360);
  horizonLand.receiveShadow = true;
  env.add(horizonLand);

  addBox('avenida de contorno ao fim do East River', [205, .045, -168], [940, .16, 12], asphalt, false);
  addBox('calçada de pedra da avenida de contorno', [205, .13, -177], [940, .28, 5], weatheredStone, false);
  addBox('mureta da margem norte do rio', [205, .55, -172], [940, 1.1, .85], concrete, false);
  for (let x = -250; x <= 650; x += 90) {
    addBox('junta da mureta da margem norte', [x, .58, -171.48], [.09, .75, .08], darkStone, false);
  }
  for (let x = -220; x <= 620; x += 84) {
    addCylinder('poste de luz da avenida ao fundo', x, 4.0, -179.4, .075, .095, 8, steel, 8);
    addBeam('braço da luminária da avenida ao fundo', [x, 7.6, -179.4], [x + 1.7, 7.6, -179.4], .055, steel, 7);
    const lamp = new THREE.PointLight(0xffd5a0, .12, 13);
    lamp.position.set(x + 1.7, 7.25, -179.4);
    env.add(lamp);
  }

  const horizonCoolMatrices = [];
  const horizonWarmMatrices = [];
  const horizonWindowGeometry = new THREE.BoxGeometry(1.36, 1.72, .13);
  const horizonCoolGlass = new THREE.MeshStandardMaterial({
    color: 0x7895a0, metalness: .18, roughness: .34,
    emissive: 0x1a2a31, emissiveIntensity: .12
  });
  const horizonWarmGlass = new THREE.MeshStandardMaterial({
    color: 0xd1ae7d, roughness: .48,
    emissive: 0x8a5d33, emissiveIntensity: .28
  });
  const horizonFrame = new THREE.MeshStandardMaterial({ color: 0x343d3e, metalness: .42, roughness: .72 });
  const horizonBrickTrim = new THREE.MeshStandardMaterial({ color: 0x785c4c, roughness: .94 });
  const horizonRoofMat = new THREE.MeshStandardMaterial({ color: 0x45494a, roughness: .92 });
  const horizonDummy = new THREE.Object3D();
  let horizonSeed = 9137;
  const horizonRand = () => {
    horizonSeed = (horizonSeed * 1664525 + 1013904223) >>> 0;
    return horizonSeed / 4294967296;
  };

  function addHorizonBuilding({
    x, z, width, depth, height, materialIndex = 0,
    style = 'loft', floors = null, waterTower = false,
    chimney = false, fireEscape = false, setback = false
  }) {
    const bodyMat = style === 'modern'
      ? (materialIndex % 2 ? blueFacade : limestone)
      : brickMaterials[materialIndex % brickMaterials.length];
    const baseY = .02;
    const floorsCount = floors ?? Math.max(3, Math.floor((height - 3.2) / (style === 'modern' ? 3.65 : 3.45)));
    const frontZ = z + depth / 2 + .08;
    addBox('fachada urbana distante — corpo', [x, baseY + height / 2, z],
      [width, height, depth], bodyMat, false);
    addBox('embasamento de cantaria da fachada distante',
      [x, baseY + .9, frontZ], [width + .25, 1.8, .28], weatheredStone, false);
    addBox('cornija superior do edifício distante',
      [x, baseY + height + .12, z], [width + .8, .28, depth + .8], horizonRoofMat, false);
    addBox('platibanda frontal do edifício distante',
      [x, baseY + height + .55, frontZ], [width + .25, .85, .35], bodyMat, false);
    addBox('platibanda lateral do edifício distante',
      [x + width / 2, baseY + height + .45, z], [.32, .7, depth], horizonRoofMat, false);

    const windowRows = Math.max(2, floorsCount - 1);
    const columns = Math.max(3, Math.floor(width / (style === 'modern' ? 3.15 : 3.75)));
    const columnSpacing = (width - 5.2) / Math.max(1, columns - 1);
    const floorHeight = height / floorsCount;
    for (let floor = 0; floor < windowRows; floor++) {
      const y = baseY + 2.65 + floor * floorHeight;
      for (let col = 0; col < columns; col++) {
        const wx = x - ((columns - 1) * columnSpacing) / 2 + col * columnSpacing;
        horizonDummy.position.set(wx, y, frontZ + .17);
        horizonDummy.scale.set(1, 1, 1);
        horizonDummy.updateMatrix();
        const warm = (floor * 3 + col * 5 + Math.round(x + z)) % 13 === 0;
        (warm ? horizonWarmMatrices : horizonCoolMatrices).push(horizonDummy.matrix.clone());
      }
      if (floor > 0 && floor % 2 === 0) {
        addBox('friso horizontal de pavimento da fachada distante',
          [x, baseY + 2.0 + floor * floorHeight, frontZ + .08],
          [width + .2, .14, .22], style === 'modern' ? limestone : horizonBrickTrim, false);
      }
    }

    const pilasterCount = Math.max(2, Math.floor(width / 12));
    for (let i = 0; i <= pilasterCount; i++) {
      const px = x - width / 2 + (width / pilasterCount) * i;
      addBox('pilastra vertical da fachada distante',
        [px, baseY + height / 2, frontZ + .11],
        [style === 'modern' ? .14 : .28, height - .7, .22],
        style === 'modern' ? horizonFrame : horizonBrickTrim, false);
    }

    if (style === 'industrial') {
      const bays = Math.max(2, Math.floor(width / 14));
      const bayWidth = (width - 5) / bays;
      for (let bay = 0; bay < bays; bay++) {
        const bx = x - width / 2 + 2.5 + bayWidth * (bay + .5);
        addBox('porta metálica de depósito na cidade distante',
          [bx, 3.0, frontZ + .2], [bayWidth - .85, 5.5, .18], paintedSteel, false);
        for (let rail = 0; rail < 4; rail++) {
          addBox('friso de porta de depósito distante',
            [bx, 1.0 + rail * 1.15, frontZ + .32], [bayWidth - 1.0, .055, .045], horizonFrame, false);
        }
      }
    } else {
      const shopWidth = Math.min(6.2, width / 3);
      for (const side of [-1, 1]) {
        addBox('vitrine de comércio do bairro distante',
          [x + side * width * .24, 2.0, frontZ + .18],
          [shopWidth, 2.45, .15], windowGlass, false);
      }
      addBox('marquise discreta de comércio distante',
        [x, 3.42, frontZ + .48], [width * .9, .18, 1.0], horizonRoofMat, false);
    }

    if (fireEscape && height > 18) {
      const escapeX = x + width * .28;
      for (let floor = 1; floor < Math.min(floorsCount, 5); floor += 2) {
        const y = baseY + 2.5 + floor * floorHeight;
        addBox('patamar de escada de incêndio na cidade distante',
          [escapeX, y, frontZ + .9], [3.2, .16, 1.5], steel, false);
        for (const side of [-1, 1]) {
          addBeam('guarda-corpo de escada de incêndio distante',
            [escapeX, y + .08, frontZ + .9 + side * .68],
            [escapeX, y + .9, frontZ + .9 + side * .68], .045, steel, 6);
        }
      }
    }

    if (waterTower) {
      const tx = x + width * .24;
      const tz = z - depth * .16;
      const tankY = baseY + height + 2.0;
      for (const sx of [-1, 1]) {
        addBeam('perna do reservatório d’água urbano',
          [tx + sx * .95, baseY + height + .18, tz],
          [tx + sx * .95, tankY + .2, tz], .085, steel, 7);
      }
      addCylinder('reservatório d’água de cobertura urbana',
        tx, tankY + 1.25, tz, 1.5, 1.5, 2.5, wood, 16);
      addCylinder('aro metálico do reservatório urbano',
        tx, tankY + 2.54, tz, 1.58, 1.58, .12, steel, 16);
    }
    if (chimney) {
      const cx = x - width * .27;
      const cy = baseY + height + 2.1;
      addCylinder('chaminé de tijolo no horizonte urbano',
        cx, cy, z - depth * .2, .72, .9, 4.4, brickMaterials[(materialIndex + 1) % brickMaterials.length], 12);
      addCylinder('coroamento da chaminé distante',
        cx, cy + 2.26, z - depth * .2, 1.0, .78, .24, horizonRoofMat, 12);
    }
    if (setback && height > 70) {
      addBox('recuo superior do arranha-céu',
        [x, baseY + height + 1.1, z], [width * .72, 2.2, depth * .72], bodyMat, false);
      addBox('coroamento escalonado do arranha-céu',
        [x, baseY + height + 3.0, z - depth * .08], [width * .48, 1.6, depth * .5], horizonRoofMat, false);
      addCylinder('antena do arranha-céu distante',
        x, baseY + height + 7.3, z - depth * .08, .16, .08, 7.0, steel, 8);
    }
  }

  const horizonIndustrial = [
    { x: -132, z: -208, width: 48, depth: 32, height: 26, materialIndex: 1, style: 'industrial', chimney: true },
    { x: -78, z: -192, width: 46, depth: 34, height: 34, materialIndex: 0, style: 'industrial', waterTower: true },
    { x: -25, z: -214, width: 50, depth: 32, height: 28, materialIndex: 2, style: 'industrial', fireEscape: true },
    { x: 30, z: -195, width: 46, depth: 34, height: 42, materialIndex: 1, style: 'industrial', waterTower: true },
    { x: 84, z: -218, width: 52, depth: 34, height: 32, materialIndex: 0, style: 'industrial', fireEscape: true },
    { x: 142, z: -194, width: 48, depth: 32, height: 46, materialIndex: 2, style: 'industrial', chimney: true },
    { x: 202, z: -220, width: 52, depth: 34, height: 36, materialIndex: 1, style: 'industrial', waterTower: true },
    { x: 262, z: -196, width: 54, depth: 36, height: 50, materialIndex: 0, style: 'industrial', fireEscape: true },
    { x: 326, z: -222, width: 54, depth: 34, height: 39, materialIndex: 2, style: 'industrial', chimney: true },
    { x: 390, z: -198, width: 54, depth: 36, height: 46, materialIndex: 1, style: 'industrial', waterTower: true },
    { x: 452, z: -220, width: 54, depth: 34, height: 34, materialIndex: 0, style: 'industrial' },
    { x: 514, z: -196, width: 52, depth: 36, height: 42, materialIndex: 2, style: 'industrial', fireEscape: true },
    { x: 574, z: -218, width: 48, depth: 32, height: 30, materialIndex: 1, style: 'industrial' }
  ];
  horizonIndustrial.forEach(building => addHorizonBuilding(building));

  const horizonMixedUse = [
    { x: -178, z: -300, width: 48, depth: 42, height: 48, materialIndex: 1, style: 'brick', floors: 12, fireEscape: true },
    { x: -116, z: -282, width: 46, depth: 40, height: 60, materialIndex: 2, style: 'brick', floors: 15 },
    { x: -54, z: -308, width: 48, depth: 42, height: 55, materialIndex: 0, style: 'brick', floors: 14, waterTower: true },
    { x: 10, z: -284, width: 52, depth: 42, height: 68, materialIndex: 1, style: 'brick', floors: 17 },
    { x: 78, z: -310, width: 50, depth: 42, height: 58, materialIndex: 2, style: 'brick', floors: 14, fireEscape: true },
    { x: 146, z: -286, width: 54, depth: 44, height: 72, materialIndex: 0, style: 'modern', floors: 19 },
    { x: 218, z: -312, width: 48, depth: 42, height: 64, materialIndex: 1, style: 'brick', floors: 16 },
    { x: 286, z: -288, width: 56, depth: 44, height: 76, materialIndex: 2, style: 'modern', floors: 20 },
    { x: 360, z: -314, width: 54, depth: 42, height: 62, materialIndex: 0, style: 'brick', floors: 15 },
    { x: 432, z: -290, width: 56, depth: 46, height: 82, materialIndex: 1, style: 'modern', floors: 21 },
    { x: 506, z: -316, width: 52, depth: 44, height: 67, materialIndex: 2, style: 'brick', floors: 16 },
    { x: 578, z: -292, width: 52, depth: 44, height: 56, materialIndex: 0, style: 'brick', floors: 14 }
  ];
  horizonMixedUse.forEach(building => addHorizonBuilding(building));

  const horizonTowers = [
    { x: -238, z: -430, width: 50, depth: 46, height: 112, materialIndex: 0, style: 'modern', floors: 30, setback: true },
    { x: -164, z: -456, width: 46, depth: 42, height: 142, materialIndex: 2, style: 'modern', floors: 38, setback: true },
    { x: -92, z: -432, width: 52, depth: 48, height: 126, materialIndex: 1, style: 'modern', floors: 34, setback: true },
    { x: -16, z: -458, width: 46, depth: 42, height: 164, materialIndex: 0, style: 'modern', floors: 44, setback: true },
    { x: 62, z: -434, width: 58, depth: 48, height: 138, materialIndex: 2, style: 'modern', floors: 36, setback: true },
    { x: 146, z: -462, width: 50, depth: 44, height: 174, materialIndex: 1, style: 'modern', floors: 46, setback: true },
    { x: 230, z: -438, width: 54, depth: 48, height: 150, materialIndex: 0, style: 'modern', floors: 40, setback: true },
    { x: 314, z: -464, width: 56, depth: 46, height: 160, materialIndex: 2, style: 'modern', floors: 42, setback: true },
    { x: 400, z: -438, width: 52, depth: 44, height: 128, materialIndex: 1, style: 'modern', floors: 34, setback: true },
    { x: 482, z: -460, width: 58, depth: 48, height: 146, materialIndex: 0, style: 'modern', floors: 38, setback: true },
    { x: 564, z: -436, width: 50, depth: 44, height: 118, materialIndex: 2, style: 'modern', floors: 31, setback: true }
  ];
  horizonTowers.forEach(building => addHorizonBuilding(building));

  for (const [name, matrices, material] of [
    ['janelas frias do horizonte urbano', horizonCoolMatrices, horizonCoolGlass],
    ['janelas acesas do horizonte urbano', horizonWarmMatrices, horizonWarmGlass]
  ]) {
    if (!matrices.length) continue;
    const instances = new THREE.InstancedMesh(horizonWindowGeometry, material, matrices.length);
    instances.name = name;
    matrices.forEach((matrix, index) => instances.setMatrixAt(index, matrix));
    instances.instanceMatrix.needsUpdate = true;
    instances.castShadow = false;
    instances.receiveShadow = false;
    env.add(instances);
  }

  // Abóbada atmosférica em gradiente, para evitar o fundo uniforme quase branco.
  const skyGeometry = new THREE.SphereGeometry(880, 32, 18);
  const skyPositions = skyGeometry.attributes.position;
  const skyColors = [];
  const skyHorizon = new THREE.Color(0xc0b49b);
  const skyMiddle = new THREE.Color(0x88a7b3);
  const skyZenith = new THREE.Color(0x5e7d8c);
  for (let i = 0; i < skyPositions.count; i++) {
    const height = THREE.MathUtils.clamp(skyPositions.getY(i) / 880, -1, 1);
    const color = height < .22
      ? skyHorizon.clone().lerp(skyMiddle, THREE.MathUtils.smoothstep(height, -.12, .22))
      : skyMiddle.clone().lerp(skyZenith, THREE.MathUtils.smoothstep(height, .22, .92));
    skyColors.push(color.r, color.g, color.b);
  }
  skyGeometry.setAttribute('color', new THREE.Float32BufferAttribute(skyColors, 3));
  const skyDome = new THREE.Mesh(skyGeometry, new THREE.MeshBasicMaterial({
    vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false
  }));
  skyDome.name = 'abóbada atmosférica azul do East River';
  env.add(skyDome);

  // Nuvens altas e finas em painéis difusos para quebrar o vazio do céu.
  const cloudCanvas = document.createElement('canvas');
  cloudCanvas.width = 512; cloudCanvas.height = 192;
  const cloudContext = cloudCanvas.getContext('2d');
  for (const [cx, cy, radius] of [
    [86, 108, 68], [142, 82, 74], [212, 112, 86], [286, 82, 76], [360, 112, 84], [430, 94, 62]
  ]) {
    const gradient = cloudContext.createRadialGradient(cx, cy, 2, cx, cy, radius);
    gradient.addColorStop(0, 'rgba(255,249,235,.34)');
    gradient.addColorStop(.52, 'rgba(255,249,235,.18)');
    gradient.addColorStop(1, 'rgba(255,249,235,0)');
    cloudContext.fillStyle = gradient;
    cloudContext.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
  }
  const cloudTexture = new THREE.CanvasTexture(cloudCanvas);
  cloudTexture.colorSpace = THREE.SRGBColorSpace;
  const cloudMaterial = new THREE.MeshBasicMaterial({
    map: cloudTexture, transparent: true, opacity: .52, depthWrite: false,
    side: THREE.DoubleSide, fog: false
  });
  const cloudPlacements = [
    { x: -120, y: 112, z: -560, w: 260, h: 52, ry: 0 },
    { x: 170, y: 132, z: -590, w: 300, h: 58, ry: .05 },
    { x: 465, y: 108, z: -550, w: 250, h: 50, ry: -.06 },
    { x: -520, y: 118, z: -80, w: 260, h: 50, ry: Math.PI / 2 },
    { x: 880, y: 116, z: -80, w: 300, h: 56, ry: -Math.PI / 2 },
    { x: -100, y: 126, z: 610, w: 280, h: 52, ry: Math.PI },
    { x: 380, y: 112, z: 630, w: 260, h: 48, ry: Math.PI }
  ];
  for (const cloud of cloudPlacements) {
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(cloud.w, cloud.h), cloudMaterial);
    plane.name = 'nuvem alta difusa sobre o skyline';
    plane.position.set(cloud.x, cloud.y, cloud.z);
    plane.rotation.y = cloud.ry;
    env.add(plane);
  }
  cloudTexture.anisotropy = isTouchDevice ? 2 : 8;

  // Modelos CC0 do GitHub — marcos distantes do horizonte de Manhattan.
  // Fonte: alexwohlbruck/landmarks; modelos CC0-1.0, geometria Y-up em metros.
  // A posição e o tamanho são composição do jogo, não coordenadas geográficas.
  const loader = new GLTFLoader();
  const landmarks = [
    {
      name: 'Chrysler Building',
      url: new URL('../assets/models/manhattan-chrysler-building.glb', import.meta.url).href,
      position: [-72, 0, -490], scale: 0.36, offset: [8.7, 0, 6.0]
    },
    {
      name: 'Empire State Building',
      url: new URL('../assets/models/manhattan-empire-state-building.glb', import.meta.url).href,
      position: [218, 0, -505], scale: 0.27, offset: [-27.7, 0, 4.4]
    }
  ];
  for (const landmark of landmarks) {
    loader.load(landmark.url, gltf => {
      const placement = new THREE.Group();
      placement.name = landmark.name + ' — marco de skyline CC0';
      placement.position.set(...landmark.position);
      placement.rotation.y = -29 * Math.PI / 180;
      placement.scale.setScalar(landmark.scale);
      const model = gltf.scene;
      model.position.set(...landmark.offset);
      model.traverse(object => {
        if (object.isMesh) {
          object.castShadow = false;
          object.receiveShadow = false;
        }
      });
      placement.add(model);
      env.add(placement);
    }, undefined, error => {
      console.warn('[Brooklyn waterfront] Não foi possível carregar ' + landmark.name, error);
    });
  }

  return env;
}

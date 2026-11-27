import { buildPapyrusArrivalBoat } from './papyrus-boat.js?v=papyrus-arrival-20261126a';

/* Exterior cinematográfico da Brooklyn House.
   A escala do rio, da Williamsburg Bridge e do skyline é deliberada:
   a mansão permanece em Brooklyn; Manhattan é apenas a margem distante. */
export function buildExterior({ THREE, scene, world, interactables, isTouchDevice = false, onReveal = () => {} }) {
  const water = world.water;

  // Mapa procedural de altura, periódico e leve: cria micro-ondas no East River
  // sem uma simulação GPU separada ou custo de render targets.
  let waterHeightMap = null;
  if (water) {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const context = canvas.getContext('2d');
    const pixels = context.createImageData(size, size);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const u = x / size * Math.PI * 2;
        const v = y / size * Math.PI * 2;
        const wave =
          Math.sin(u * 3 + v * 2) * 0.24 +
          Math.sin(u * 7 - v * 3) * 0.16 +
          Math.cos(u * 2 - v * 5) * 0.19 +
          Math.sin(u * 11 + v * 8) * 0.08 +
          Math.cos(u * 5 + v * 9) * 0.11;
        const value = Math.max(0, Math.min(255, Math.round(128 + wave * 92)));
        const index = (y * size + x) * 4;
        pixels.data[index] = value;
        pixels.data[index + 1] = value;
        pixels.data[index + 2] = value;
        pixels.data[index + 3] = 255;
      }
    }
    context.putImageData(pixels, 0, 0);
    waterHeightMap = new THREE.CanvasTexture(canvas);
    waterHeightMap.wrapS = waterHeightMap.wrapT = THREE.RepeatWrapping;
    waterHeightMap.repeat.set(isTouchDevice ? 5 : 8, isTouchDevice ? 3 : 4);
    waterHeightMap.anisotropy = isTouchDevice ? 2 : 8;
  }

  if (water) {
    water.geometry.dispose();
    water.geometry = new THREE.BoxGeometry(560, 0.34, 420);
    water.position.set(310, -0.66, 60);
    water.material.color.setHex(0x36545d);
    water.material.metalness = 0.22;
    water.material.roughness = 0.25;
    water.material.bumpMap = waterHeightMap;
    water.material.bumpScale = isTouchDevice ? 0.018 : 0.032;
    water.material.opacity = 0.94;
    water.material.transparent = true;
    water.receiveShadow = true;
  }
  if (scene.fog) {
    scene.fog.color.setHex(0x87979a);
    scene.fog.density = 0.00135;
  }

  const steel = new THREE.MeshStandardMaterial({
    color: 0x45545a, metalness: 0.78, roughness: 0.48
  });
  const darkSteel = new THREE.MeshStandardMaterial({
    color: 0x273438, metalness: 0.68, roughness: 0.62
  });
  const wornConcrete = new THREE.MeshStandardMaterial({
    color: 0x777b77, roughness: 0.93
  });
  const skylineMaterials = [
    new THREE.MeshStandardMaterial({ color: 0x66757b, roughness: 0.94 }),
    new THREE.MeshStandardMaterial({ color: 0x515f65, roughness: 0.94 }),
    new THREE.MeshStandardMaterial({ color: 0x747a78, roughness: 0.96 }),
    new THREE.MeshStandardMaterial({ color: 0x5b5550, roughness: 0.95 })
  ];
  const windowMaterial = new THREE.MeshStandardMaterial({
    color: 0xd9bb82, emissive: 0x987548, emissiveIntensity: 0.38,
    roughness: 0.55, metalness: 0.12
  });

  const beamGeometry = new THREE.CylinderGeometry(1, 1, 1, 8, 1, false);
  const beamMatrix = new THREE.Matrix4();
  const beamPosition = new THREE.Vector3();
  const beamDirection = new THREE.Vector3();
  const beamQuaternion = new THREE.Quaternion();
  const beamScale = new THREE.Vector3();

  function addInstancedBeams(segments, material, name) {
    if (!segments.length) return null;
    const mesh = new THREE.InstancedMesh(beamGeometry, material, segments.length);
    mesh.name = name;
    segments.forEach((segment, index) => {
      const a = new THREE.Vector3(...segment.a);
      const b = new THREE.Vector3(...segment.b);
      beamDirection.subVectors(b, a);
      const length = beamDirection.length();
      beamPosition.copy(a).add(b).multiplyScalar(0.5);
      beamQuaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), beamDirection.normalize());
      beamScale.set(segment.r, length, segment.r);
      beamMatrix.compose(beamPosition, beamQuaternion, beamScale);
      mesh.setMatrixAt(index, beamMatrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    return mesh;
  }

  function addBox(name, position, size, material, castShadow = true) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
    mesh.name = name;
    mesh.position.set(...position);
    mesh.castShadow = castShadow;
    mesh.receiveShadow = true;
    scene.add(mesh);
    return mesh;
  }

  function addTube(name, points, material, radius, segments = 180) {
    const curve = new THREE.CatmullRomCurve3(
      points.map(point => new THREE.Vector3(...point))
    );
    const mesh = new THREE.Mesh(
      new THREE.TubeGeometry(curve, segments, radius, 8, false),
      material
    );
    mesh.name = name;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    return mesh;
  }

  // Água em escala de rio real: a outra margem não fica a poucas dezenas de metros.
  const waterline = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.12, 140),
    new THREE.MeshStandardMaterial({ color: 0x81989a, roughness: 0.3, metalness: 0.2, transparent: true, opacity: 0.17 })
  );
  waterline.name = 'reflexo difuso da margem distante';
  waterline.position.set(582, -0.39, 140);
  scene.add(waterline);

  // Ondulação larga e discreta, concentrada perto do cais para preservar desempenho.
  const rippleGeometry = new THREE.BoxGeometry(5.5, 0.018, 0.035);
  const rippleMaterial = new THREE.MeshBasicMaterial({
    color: 0xb0c2bf, transparent: true, opacity: 0.16
  });
  const rippleCount = isTouchDevice ? 96 : 180;
  const rippleColumns = isTouchDevice ? 12 : 18;
  const rippleRows = Math.ceil(rippleCount / rippleColumns);
  const ripples = new THREE.InstancedMesh(rippleGeometry, rippleMaterial, rippleCount);
  ripples.name = 'ondulações distribuídas pelo East River';
  for (let i = 0; i < rippleCount; i++) {
    const column = i % rippleColumns;
    const row = Math.floor(i / rippleColumns);
    const x = 42 + column * (548 / (rippleColumns - 1));
    const z = -138 + row * (396 / Math.max(1, rippleRows - 1)) + Math.sin(i * 1.7) * 2.2;
    const p = new THREE.Vector3(x, -0.44 + (i % 3) * 0.006, z);
    const q = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0), (i % 7) * 0.13
    );
    beamMatrix.compose(p, q, new THREE.Vector3(1, 1, 1));
    ripples.setMatrixAt(i, beamMatrix);
  }
  ripples.instanceMatrix.needsUpdate = true;
  scene.add(ripples);

  // O tabuleiro cruza a faixa do rio; fica afastado da projeção do telhado.
  const bridgeBuildStart=scene.children.length;
  // Williamsburg Bridge: estrutura suspensa, quatro cabos e grandes treliças de aço.
  // Referência dimensional: vão principal de 1.600 ft, torres de 310 ft,
  // clearance central de 135 ft; a geometria é uma reconstrução de jogo.
  const bridgeGroup = new THREE.Group();
  bridgeGroup.name = 'Williamsburg Bridge — reconstrução em escala';
  scene.add(bridgeGroup);
  const towerXs = [86, 526];
  const deckY = 41.2;
  const deckZ = 28;
  addBox('tabuleiro contínuo da Williamsburg Bridge', [306, deckY - 0.65, deckZ], [570, 1.3, 25], darkSteel, false);
  const bridgePavement = new THREE.MeshStandardMaterial({ color: 0x303a3e, roughness: 0.95 });
  const railBed = new THREE.MeshStandardMaterial({ color: 0x454b4b, roughness: 0.96 });
  const sleepersMat = new THREE.MeshStandardMaterial({ color: 0x51483c, roughness: 0.98 });
  // O tabuleiro é compartilhado: quatro pistas rodoviárias ficam nas faixas laterais,
  // enquanto os dois trilhos do metrô ocupam a faixa central, entre elas.
  for (const z of [22.0, 34.0]) {
    addBox('pavimento das vias rodoviárias da Williamsburg Bridge', [306, deckY + 0.055, z], [562, 0.08, 7.2], bridgePavement, false);
    for (let x = 42; x < 570; x += 24) {
      addBox('faixa tracejada da via rodoviária', [x, deckY + 0.11, z], [9, 0.035, 0.16], wornConcrete, false);
    }
  }
  addBox('berço central das duas vias do metrô', [306, deckY + 0.09, deckZ], [562, 0.16, 5.8], railBed, false);
  addBox('passarela externa norte da ponte', [306, deckY + 0.10, 16.7], [562, 0.16, 1.9], darkSteel, false);
  addBox('passarela externa sul da ponte', [306, deckY + 0.10, 39.3], [562, 0.16, 1.9], darkSteel, false);
  for (const z of [25.25, 30.75]) {
    addBox('separador entre metrô e rodovia', [306, deckY + 0.28, z], [562, 0.40, 0.18], wornConcrete, false);
  }
  for (let x = 30; x < 584; x += 3.2) {
    addBox('dormente das duas vias centrais do metrô', [x, deckY + 0.205, deckZ], [0.9, 0.12, 5.35], sleepersMat, false);
  }
  // Dois pares de trilhos, posicionados no mesmo nível estrutural das pistas.
  for (const z of [26.2, 27.6, 28.4, 29.8]) {
    addTube('trilho do metrô no tabuleiro compartilhado', [
      [24, deckY + 0.34, z], [588, deckY + 0.34, z]
    ], darkSteel, 0.075, 280);
  }
  addBox('faixa de pavimento norte', [306, deckY + 0.03, 20.0], [565, 0.08, 0.16], steel, false);
  addBox('faixa de pavimento sul', [306, deckY + 0.03, 36.0], [565, 0.08, 0.16], steel, false);
  for (const z of [16.5, 39.5]) {
    addBox('longarina lateral da ponte', [306, 37.3, z], [570, 0.44, 0.48], steel, false);
    addBox('cordão superior da treliça', [306, 41.0, z], [570, 0.32, 0.38], steel, false);
  }
  // Travessas centrais que sugerem o conjunto rodoviário e ferroviário da ponte.
  for (const z of [24.0, 28.0, 32.0]) {
    addBox('longarina central da ponte', [306, 40.45, z], [566, 0.16, 0.2], steel, false);
  }

  const towerSegments = [];
  const trussSegments = [];
  const suspenderSegments = [];
  const cableOffsets = [16.5, 20.0, 36.0, 39.5];

  for (const towerX of towerXs) {
    // Quatro pernas principais formam a moldura portal da torre.
    for (const xOffset of [-1.8, 1.8]) {
      for (const z of [15.5, 40.5]) {
        towerSegments.push({
          a: [towerX + xOffset, 0.5, z],
          b: [towerX + xOffset, 94.5, z],
          r: 0.82
        });
      }
    }
    // Travessas horizontais e diagonais da torre.
    for (let y = 7; y < 94; y += 8.5) {
      towerSegments.push({ a: [towerX - 2.0, y, 15.5], b: [towerX + 2.0, y, 15.5], r: 0.24 });
      towerSegments.push({ a: [towerX - 2.0, y, 40.5], b: [towerX + 2.0, y, 40.5], r: 0.24 });
      towerSegments.push({ a: [towerX - 2.0, y, 15.5], b: [towerX + 2.0, y + 8.5, 40.5], r: 0.19 });
      towerSegments.push({ a: [towerX + 2.0, y, 15.5], b: [towerX - 2.0, y + 8.5, 40.5], r: 0.19 });
      towerSegments.push({ a: [towerX - 2.0, y, 40.5], b: [towerX + 2.0, y + 8.5, 15.5], r: 0.19 });
      towerSegments.push({ a: [towerX + 2.0, y, 40.5], b: [towerX - 2.0, y + 8.5, 15.5], r: 0.19 });
    }
    for (const xOffset of [-1.8, 1.8]) {
      towerSegments.push({ a: [towerX + xOffset, 94.5, 15.5], b: [towerX + xOffset, 94.5, 40.5], r: 0.32 });
      towerSegments.push({ a: [towerX + xOffset, 88, 15.5], b: [towerX + xOffset, 94.5, 40.5], r: 0.22 });
    }
    // Maciços de ancoragem na margem e ligação ao tabuleiro.
    addBox('base de ancoragem da torre', [towerX, 2.4, deckZ], [8.5, 4.8, 34], wornConcrete, false);
  }
  addInstancedBeams(towerSegments, steel, 'treliças estruturais das torres');
  for (const z of [16.5, 39.5]) {
    for (let x = 88; x < 526; x += 18) {
      trussSegments.push({ a: [x, 33.8, z], b: [x + 18, 41.0, z], r: 0.14 });
      trussSegments.push({ a: [x, 41.0, z], b: [x + 18, 33.8, z], r: 0.14 });
      trussSegments.push({ a: [x, 33.8, z], b: [x, 41.0, z], r: 0.16 });
    }
  }
  addInstancedBeams(trussSegments, steel, 'diagonais da treliça longitudinal');

  const cableHeight = x => 58.2 + 34.0 * Math.pow((x - 306) / 220, 2);
  for (const z of cableOffsets) {
    const cablePoints = [
      [18, 7.5, z], [48, 37, z], [86, 92, z],
      [180, cableHeight(180), z], [306, cableHeight(306), z],
      [432, cableHeight(432), z], [526, 92, z],
      [565, 37, z], [595, 7.5, z]
    ];
    addTube('cabo principal de suspensão', cablePoints, darkSteel, 0.33, 300);
    for (let x = 96; x <= 516; x += 14) {
      suspenderSegments.push({
        a: [x, deckY - 0.1, z],
        b: [x, cableHeight(x), z],
        r: 0.055
      });
    }
  }
  addInstancedBeams(suspenderSegments, steel, 'pendurais verticais da Williamsburg Bridge');

  // A via ferroviária fica no tabuleiro inferior; o superior permanece rodoviário.
  for (const z of [14.7, 41.3]) {
    addBox('guarda-corpo longitudinal da ponte', [306, 42.1, z], [565, 0.22, 0.22], steel, false);
  }
  // Os helpers criaram as peças na cena global. Reunimos todas para deslocar
  // tabuleiro, torres, cabos e pendurais como uma única estrutura coerente.
  for(const child of scene.children.slice(bridgeBuildStart)){
    if(child===bridgeGroup)continue;
    scene.remove(child);
    bridgeGroup.add(child);
  }
  // O vão permanece acima do East River e fora da projeção do galpão/mansão.
  bridgeGroup.position.set(0,0,112);

  // Margem de Manhattan: cais distante, armazéns baixos e skyline em camadas.
  addBox('muralha de cais de Manhattan', [584, 0.5, 58], [2.4, 2.4, 245], wornConcrete, false);
  for (let i = 0; i < 9; i++) {
    const z = -52 + i * 27;
    const warehouse = addBox(
      'armazém baixo da margem de Manhattan',
      [603 + (i % 2) * 3, 7.5, z],
      [28, 15, 21],
      skylineMaterials[i % skylineMaterials.length],
      false
    );
    warehouse.material = skylineMaterials[i % skylineMaterials.length];
    addBox('telhado industrial na margem distante', [603 + (i % 2) * 3, 15.2, z], [29, 0.6, 22], darkSteel, false);
  }

  const windowMatrices = [];
  const windowQuaternion = new THREE.Quaternion();
  const windowScale = new THREE.Vector3(1, 1, 1);
  const windowPosition = new THREE.Vector3();
  function addCityBuilding(x, z, width, depth, height, style = 0, stepped = false) {
    const baseY = 1.8;
    const material = skylineMaterials[style % skylineMaterials.length];
    addBox('torre distante de Manhattan', [x, baseY + height / 2, z], [width, height, depth], material, false);
    if (stepped) {
      addBox('recuo superior art déco', [x, baseY + height - 6, z], [width * 0.72, 12, depth * 0.76], material, false);
      addBox('coroamento escalonado', [x, baseY + height + 1.1, z], [width * 0.46, 3.2, depth * 0.5], darkSteel, false);
      const spire = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.48, 17, 8),
        steel
      );
      spire.name = 'agulha art déco no skyline distante';
      spire.position.set(x, baseY + height + 11, z);
      spire.castShadow = true;
      scene.add(spire);
    } else if (height > 55) {
      addBox('casa de máquinas no topo dos edifícios', [x, baseY + height + 1.2, z], [width * 0.42, 2.4, depth * 0.44], darkSteel, false);
    }
    const columns = Math.max(4, Math.floor(depth / 2.4));
    const rows = Math.max(5, Math.floor(height / 3.7));
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        if (((row * 7 + column * 5 + style * 3) % 11) === 0) continue;
        const xFace = x - width / 2 - 0.055;
        const y = baseY + 2.0 + row * ((height - 4) / rows);
        const zFace = z - depth / 2 + 1.1 + column * ((depth - 2.2) / Math.max(1, columns - 1));
        windowPosition.set(xFace, y, zFace);
        beamMatrix.compose(windowPosition, windowQuaternion, windowScale);
        windowMatrices.push(beamMatrix.clone());
      }
    }
  }

  const city = [
    [620, -92, 22, 19, 48, 0, false],
    [622, -58, 28, 21, 63, 1, false],
    [625, -22, 19, 17, 37, 2, false],
    [628, 18, 31, 23, 84, 0, true],
    [622, 58, 24, 22, 56, 3, false],
    [629, 96, 26, 22, 71, 1, false],
    [624, 135, 20, 19, 43, 2, false],
    [651, -104, 25, 20, 61, 2, false],
    [658, -66, 20, 18, 83, 0, true],
    [654, -28, 28, 21, 108, 1, true],
    [655, 17, 23, 19, 66, 3, false],
    [660, 56, 30, 22, 94, 0, true],
    [652, 99, 20, 19, 74, 2, false],
    [660, 139, 27, 21, 58, 1, false],
    [687, -82, 25, 23, 54, 1, false],
    [690, -38, 21, 17, 77, 2, false],
    [689, 12, 27, 19, 88, 3, true],
    [691, 58, 25, 20, 63, 0, false],
    [687, 103, 22, 18, 49, 2, false],
    [690, 144, 24, 20, 57, 1, false]
  ];
  city.forEach(building => addCityBuilding(...building));
  const windows = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.12, 1.05, 0.82),
    windowMaterial,
    windowMatrices.length
  );
  windows.name = 'janelas iluminadas no skyline de Manhattan';
  windowMatrices.forEach((matrix, index) => windows.setMatrixAt(index, matrix));
  windows.instanceMatrix.needsUpdate = true;
  scene.add(windows);

  // Silhuetas de prédios ainda mais distantes, quebrando a linha uniforme do horizonte.
  const distantMat = new THREE.MeshStandardMaterial({ color: 0x7e8c8d, roughness: 1 });
  for (let i = 0; i < 18; i++) {
    const x = 710 + (i % 5) * 15;
    const z = -112 + i * 14;
    const height = 18 + (i * 17 % 45);
    const width = 8 + (i * 7 % 13);
    addBox('massa urbana atmosférica ao fundo', [x, height / 2, z], [width, height, 13], distantMat, false);
  }

  // Barco atracado na pequena doca após a passagem sob a ponte.
  buildPapyrusArrivalBoat({ THREE, scene, interactables });

  // A mansão e a escada têm materiais invisíveis com escrita de profundidade.
  // E/INTERAGIR no cais dá a Carter o foco necessário para percebê-las.
  const mansion=world.mansionRevealGroup;
  const revelation={active:false,revealed:false,elapsed:0,duration:2.15,materials:[],lights:[]};
  function beginMansionRevelation(){
    if(!mansion||revelation.revealed)return false;
    revelation.revealed=true;
    revelation.active=true;
    revelation.elapsed=0;
    revelation.materials.length=0;
    revelation.lights.length=0;
    mansion.traverse(node=>{
      if(node.isMesh&&node.userData.mansionRevealOriginalMaterial){
        const original=node.userData.mansionRevealOriginalMaterial;
        const fadeMaterial=source=>{
          const material=source.clone();
          revelation.materials.push({
            material,
            opacity:Number.isFinite(source.opacity)?source.opacity:1,
            transparent:source.transparent,
            depthWrite:source.depthWrite
          });
          material.transparent=true;
          material.opacity=0;
          material.depthWrite=false;
          material.needsUpdate=true;
          return material;
        };
        node.material=Array.isArray(original)?original.map(fadeMaterial):fadeMaterial(original);
      }
      if(node.isMesh&&node.userData.mansionRevealOriginalCastShadow!==undefined){
        revelation.materials.push({
          object:node,castShadow:node.userData.mansionRevealOriginalCastShadow,shadowOnly:true
        });
      }
      if(node.isLight&&node.userData.mansionRevealOriginalIntensity!==undefined){
        revelation.lights.push({light:node,intensity:node.userData.mansionRevealOriginalIntensity});
      }
    });
    onReveal?.();
    return true;
  }
  interactables.push({
    label:'Olhar novamente para o telhado',
    position:new THREE.Vector3(0,0,31),
    radius:6.4,
    description:'O galpão parece comum, mas há algo estranho no recorte do telhado. Olhe novamente.',
    onInteract:()=>{
      if(revelation.revealed)return 'Você mantém o foco na Brooklyn House. A escada metálica acompanha a lateral do galpão.';
      beginMansionRevelation();
      return 'Amos aponta para o telhado. Ao concentrar o olhar, a mansão de cinco andares se torna perceptível sobre o galpão.';
    }
  });

    // Portal de entrada: a porta de madeira sobe sem maçaneta ou fechadura.
  const door = scene.getObjectByName('porta de madeira sem maçaneta');
  const portalDoorCollider = world.portalDoorCollider;
  let doorProgress = 0;
  let doorTarget = 0;
  const closedDoorY = door ? door.position.y : 15.9;
  interactables.push({
    label: 'Portal da Brooklyn House',
    position: new THREE.Vector3(0, 16.0, 13.6),
    radius: 4.6,
    description: 'Um bloco de madeira escura sem puxador, fechadura ou dobradiças aparentes.',
    onInteract: () => {
      doorTarget = doorTarget > 0.5 ? 0 : 1;
      return doorTarget > 0.5
        ? 'Carter ergue a mão. O bloco de madeira desliza silenciosamente para cima.'
        : 'A porta desce e volta a ocultar a entrada da mansão.';
    }
  });

  return {
    update(dt, time = 0) {
      if (door) {
        doorProgress += (doorTarget - doorProgress) * Math.min(1, dt * 2.0);
        door.position.y = closedDoorY + doorProgress * 5.9;
        // O volume de bloqueio sobe junto com a folha e libera o vão.
        if (portalDoorCollider) {
          portalDoorCollider.minY = door.position.y - 2.64;
          portalDoorCollider.maxY = door.position.y + 2.64;
        }
      }
      if(revelation.active){
        revelation.elapsed=Math.min(revelation.duration,revelation.elapsed+dt);
        const t=revelation.elapsed/revelation.duration;
        const eased=t*t*(3-2*t);
        for(const target of revelation.materials){
          if(target.shadowOnly){
            if(t>=1)target.object.castShadow=target.castShadow;
          }else{
            target.material.opacity=target.opacity*eased;
            target.material.needsUpdate=true;
            if(t>=1){
              target.material.opacity=target.opacity;
              target.material.transparent=target.transparent;
              target.material.depthWrite=target.depthWrite;
              target.material.needsUpdate=true;
            }
          }
        }
        for(const target of revelation.lights)target.light.intensity=target.intensity*eased;
        if(t>=1)revelation.active=false;
      }
      if (water) {
        water.material.opacity = 0.93 + Math.sin(time * 0.9) * 0.018;
        if (waterHeightMap) {
          waterHeightMap.offset.x = time * (isTouchDevice ? 0.0018 : 0.0028);
          waterHeightMap.offset.y = -time * (isTouchDevice ? 0.0011 : 0.0017);
        }
      }
    }
  };
}

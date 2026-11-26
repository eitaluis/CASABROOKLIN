// Brooklyn House — Sala de Treinamento
// Reconstrução 3D jogável: quadra de madeira, abóbada pintada, efígies de Rá/cestas,
// guerreiros shabti e prática de magia. Layout e vários acabamentos são interpretativos.
export function buildTrainingRoom({
  THREE, scene, zones, groundSurfaces, colliders, interactables, animated
}) {
  const floorY = 16.875;
  const centerX = -25.35;
  const centerZ = -0.5;
  const room = { minX: -35.55, maxX: -15.15, minZ: -16.65, maxZ: 15.65 };
  const roomWidth = room.maxX - room.minX;
  const roomLength = room.maxZ - room.minZ;
  const springY = floorY + 3.5;
  const vaultRadius = 9.75;
  const floorTop = floorY;
  const woodDark = new THREE.MeshStandardMaterial({ color: 0x432b1c, roughness: 0.72 });
  const bronze = new THREE.MeshStandardMaterial({ color: 0x9a713b, metalness: 0.78, roughness: 0.28 });
  const darkBronze = new THREE.MeshStandardMaterial({ color: 0x493622, metalness: 0.72, roughness: 0.38 });
  const limestone = new THREE.MeshStandardMaterial({ color: 0xf0e3c6, roughness: 0.9 });
  const limestoneShade = new THREE.MeshStandardMaterial({ color: 0xb49a70, roughness: 0.94 });
  const reliefStone = new THREE.MeshStandardMaterial({ color: 0x9a7953, roughness: 0.88 });
  const lapis = new THREE.MeshStandardMaterial({ color: 0x173f60, metalness: 0.18, roughness: 0.34 });
  const turquoise = new THREE.MeshStandardMaterial({ color: 0x347c7d, metalness: 0.08, roughness: 0.3, clearcoat: 0.28 });
  const faience = new THREE.MeshPhysicalMaterial({ color: 0x3d8582, metalness: 0.06, roughness: 0.26, clearcoat: 0.38, clearcoatRoughness: 0.2 });
  const faienceLight = new THREE.MeshPhysicalMaterial({ color: 0xb9a16f, metalness: 0.04, roughness: 0.3, clearcoat: 0.28 });
  const clay = new THREE.MeshPhysicalMaterial({ color: 0x9d6549, roughness: 0.34, clearcoat: 0.42, clearcoatRoughness: 0.24 });
  const clayLight = new THREE.MeshPhysicalMaterial({ color: 0xd1a47a, roughness: 0.4, clearcoat: 0.28 });
  const paintedLine = new THREE.MeshStandardMaterial({ color: 0xe6d8b6, roughness: 0.62 });
  const warmEmissive = new THREE.MeshStandardMaterial({
    color: 0xffc16a, emissive: 0xff8a29, emissiveIntensity: 1.6,
    metalness: 0.05, roughness: 0.28
  });
  const whiteGlow = new THREE.MeshBasicMaterial({ color: 0xffd69a });
  const collidable = (x, y, z, w, h, d) => {
    colliders.push({
      minX: x - w / 2, maxX: x + w / 2,
      minY: y - h / 2, maxY: y + h / 2,
      minZ: z - d / 2, maxZ: z + d / 2
    });
  };
  function addBox(name, pos, size, material, collide = false, cast = true) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(size[0], size[1], size[2]), material);
    mesh.name = name;
    mesh.position.set(pos[0], pos[1], pos[2]);
    mesh.castShadow = cast;
    mesh.receiveShadow = true;
    scene.add(mesh);
    if (collide) collidable(pos[0], pos[1], pos[2], size[0], size[1], size[2]);
    return mesh;
  }
  function addTube(name, points, radius, material, parent = scene, segments = 64) {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(p[0], p[1], p[2])));
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(segments, points.length * 4), radius, 8, false), material);
    mesh.name = name;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function addInteractable(item) {
    interactables.push(item);
  }

  // O ponto exato de encaixe com o salão é uma interpretação da planta.
  // As paredes originais são recortadas no vão da porta do segundo pavimento.
  scene.traverse((obj) => {
    if (obj.name === 'lateral oeste da mansão') obj.visible = false;
    if (obj.name === 'parede lateral do salão' && obj.position.x < 0) obj.visible = false;
  });
  // Retira a colisão da parede original antes de recriar os segmentos em torno do portal.
  for (let i = colliders.length - 1; i >= 0; i--) {
    const item = colliders[i];
    if (Math.abs(item.minX + 16.025) < 0.06 && Math.abs(item.maxX + 15.175) < 0.06
      && Math.abs(item.minY - 12.65) < 0.06 && Math.abs(item.maxY - 30.25) < 0.06
      && Math.abs(item.minZ + 12) < 0.06 && Math.abs(item.maxZ - 11) < 0.06) {
      colliders.splice(i, 1);
    }
  }
  function rebuildSideWall(name, x, thickness, zMin, zMax, yMin, yMax, holeCenter, holeWidth, openingBottom, openingTop, material) {
    const half = holeWidth / 2;
    const openingStart = holeCenter - half;
    const openingEnd = holeCenter + half;
    const leftLength = Math.max(0, openingStart - zMin);
    const rightLength = Math.max(0, zMax - openingEnd);
    if (leftLength > 0.1) addBox(name + ' trecho norte', [x, (yMin + yMax) / 2, zMin + leftLength / 2], [thickness, yMax - yMin, leftLength], material, true, false);
    if (rightLength > 0.1) addBox(name + ' trecho sul', [x, (yMin + yMax) / 2, openingEnd + rightLength / 2], [thickness, yMax - yMin, rightLength], material, true, false);
    if (openingBottom > yMin) addBox(name + ' peitoril', [x, (yMin + openingBottom) / 2, holeCenter], [thickness, openingBottom - yMin, holeWidth], material, true, false);
    if (openingTop < yMax) addBox(name + ' verga', [x, (openingTop + yMax) / 2, holeCenter], [thickness, yMax - openingTop, holeWidth], material, true, false);
  }
  rebuildSideWall('parede do salão com portal de treinamento', -14.2, 0.55, -10.5, 9.5, 12.85, 28.35, centerZ, 4.5, floorY, floorY + 3.75, limestone);
  rebuildSideWall('fachada oeste recortada', -15.6, 0.85, -12.0, 11.0, 12.65, 30.25, centerZ, 4.5, floorY, floorY + 3.75, limestone);

  // Piso elevado e passarela: ambos entram no mesmo sistema de superfícies do personagem.
  const floor = addBox('piso de madeira da sala de treinamento', [centerX, floorY - 0.225, centerZ], [roomWidth, 0.45, roomLength],
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.38, metalness: 0.02 }), false, false);
  groundSurfaces.push(floor);
  const bridge = addBox('passarela de calcário para a sala de treinamento', [-13.95, floorY - 0.225, centerZ], [3.5, 0.45, 4.5], limestone, false, false);
  groundSurfaces.push(bridge);
  const walkablePlatforms = [
    { minX: room.minX, maxX: room.maxX, minZ: room.minZ, maxZ: room.maxZ, height: floorTop },
    { minX: -15.75, maxX: -12.15, minZ: centerZ - 2.25, maxZ: centerZ + 2.25, height: floorTop }
  ];
  zones.hall.bounds[0] = Math.min(zones.hall.bounds[0], -15.9);
  zones.training = {
    label: 'SALA DE TREINAMENTO',
    pos: [centerX + 1.6, floorY, centerZ + 5.7],
    yaw: 0,
    bounds: [room.minX - 0.1, -13.0, room.minZ - 0.1, room.maxZ + 0.1],
    base: floorY
  };
  const zonePortals = [
    { from: 'hall', to: 'training', axis: 'x', direction: 'lt', threshold: -15.45, rangeMin: -2.8, rangeMax: 1.8 },
    { from: 'training', to: 'hall', axis: 'x', direction: 'gt', threshold: -14.05, rangeMin: -2.8, rangeMax: 1.8 }
  ];

  // Textura procedural determinística de tábuas de carvalho/ nogueira, com relevo de veio.
  // O material final usa canais de cor e bump próprios; Wood Floor 001 (ambientCG, CC0)
  // fica registado como referência aberta para uma futura troca por mapas fotográficos locais.
  function makeWoodMaps() {
    let seed = 43817;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const w = 1024, h = 1024;
    const colorCanvas = document.createElement('canvas');
    const bumpCanvas = document.createElement('canvas');
    colorCanvas.width = bumpCanvas.width = w;
    colorCanvas.height = bumpCanvas.height = h;
    const c = colorCanvas.getContext('2d');
    const b = bumpCanvas.getContext('2d');
    c.fillStyle = '#bd925e'; c.fillRect(0, 0, w, h);
    b.fillStyle = '#888888'; b.fillRect(0, 0, w, h);
    const plankH = 42;
    for (let row = 0; row < 24; row++) {
      const offset = row % 2 ? 122 : 0;
      for (let col = -1; col < 7; col++) {
        const x = col * 250 + offset;
        const variation = random();
        const rr = Math.round(164 + variation * 48);
        const gg = Math.round(112 + variation * 43);
        const bb = Math.round(62 + variation * 34);
        c.fillStyle = 'rgb(' + rr + ',' + gg + ',' + bb + ')';
        c.fillRect(x + 2, row * plankH + 2, 246, plankH - 4);
        c.strokeStyle = 'rgba(29,18,12,.72)'; c.lineWidth = 2;
        c.strokeRect(x + 1, row * plankH + 1, 248, plankH - 2);
        b.fillStyle = '#555555'; b.fillRect(x + 1, row * plankH + 1, 248, plankH - 2);
        for (let k = 0; k < 20; k++) {
          const yy = row * plankH + 7 + random() * (plankH - 14);
          const start = x + 8 + random() * 35;
          const end = x + 160 + random() * 78;
          c.beginPath(); c.moveTo(start, yy);
          c.bezierCurveTo(start + 55, yy - 4 + random() * 8, end - 60, yy + 3, end, yy - 1);
          c.strokeStyle = 'rgba(34,19,11,' + (0.07 + random() * 0.12) + ')';
          c.lineWidth = 0.55 + random() * 1.2; c.stroke();
          b.beginPath(); b.moveTo(start, yy); b.lineTo(end, yy);
          b.strokeStyle = 'rgba(188,188,188,' + (0.16 + random() * 0.16) + ')';
          b.lineWidth = 1; b.stroke();
        }
        // Pequenos nós e variação de acabamento, sem exagerar no padrão.
        for (let n = 0; n < 2; n++) {
          const nx = x + 35 + random() * 175;
          const ny = row * plankH + 14 + random() * 56;
          c.beginPath(); c.ellipse(nx, ny, 7 + random() * 5, 2 + random() * 2, 0, 0, Math.PI * 2);
          c.strokeStyle = 'rgba(30,17,10,.24)'; c.lineWidth = 1.2; c.stroke();
          b.beginPath(); b.ellipse(nx, ny, 7, 3, 0, 0, Math.PI * 2);
          b.strokeStyle = 'rgba(205,205,205,.22)'; b.lineWidth = 1; b.stroke();
        }
      }
    }
    const map = new THREE.CanvasTexture(colorCanvas);
    const bump = new THREE.CanvasTexture(bumpCanvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.wrapS = map.wrapT = bump.wrapS = bump.wrapT = THREE.RepeatWrapping;
    map.repeat.set(1.7, 2.6);
    bump.repeat.copy(map.repeat);
    map.anisotropy = bump.anisotropy = 8;
    return { map, bump };
  }
  const floorMaps = makeWoodMaps();
  floor.material = new THREE.MeshPhysicalMaterial({
    map: floorMaps.map, bumpMap: floorMaps.bump, bumpScale: 0.032,
    roughness: 0.38, metalness: 0.015, clearcoat: 0.36, clearcoatRoughness: 0.28
  });
  // Complementa o desenho das tábuas com mapas PBR locais CC0 de nogueira (normal/roughness).
  const roomTextureLoader = new THREE.TextureLoader();
  const loadRoomPbr = (path, color = false, repeat = [2, 4]) => {
    const texture = roomTextureLoader.load(path);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeat[0], repeat[1]); texture.anisotropy = 8;
    if (color) texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  };
  floor.material.normalMap = loadRoomPbr('./assets/textures/wood-walnut/normal.webp', false, [2.2, 5.5]);
  floor.material.roughnessMap = loadRoomPbr('./assets/textures/wood-walnut/roughness.webp', false, [2.2, 5.5]);
  floor.material.normalScale.set(0.38, 0.38);
  // Moldura perimetral escura e filetes metálicos embutidos.
  const floorBorderMat = new THREE.MeshStandardMaterial({ color: 0x49301f, roughness: 0.38 });
  for (const [x,z,w,d] of [
    [centerX, room.minZ + 0.35, roomWidth - 0.7, 0.24],
    [centerX, room.maxZ - 0.35, roomWidth - 0.7, 0.24],
    [room.minX + 0.35, centerZ, 0.24, roomLength - 0.7],
    [room.maxX - 0.35, centerZ, 0.24, roomLength - 0.7]
  ]) addBox('moldura perimetral de nogueira do piso', [x, floorY + 0.025, z], [w, 0.045, d], floorBorderMat);
  const floorInlay = new THREE.MeshStandardMaterial({ color: 0xb78a4e, metalness: 0.42, roughness: 0.42 });
  for (const x of [room.minX + 0.52, room.maxX - 0.52]) addBox('filete de bronze embutido no piso', [x, floorY + 0.051, centerZ], [0.035, 0.018, roomLength - 1.2], floorInlay, false, false);

  // Linhas de quadra embutidas na madeira, com dimensões aproximadas de uma quadra real.
  const courtHalfWidth = 7.5; // Quadra regulamentar: 15 m de largura (FIBA 2026).
  const courtHalfLength = 14.0; // Quadra regulamentar: 28 m de comprimento (FIBA 2026).
  const courtZ0 = centerZ;
  const courtX0 = centerX;
  function courtLine(points, name = 'marcação de quadra') {
    return addTube(name, points, 0.025, paintedLine, scene, 72);
  }
  const leftX = courtX0 - courtHalfWidth, rightX = courtX0 + courtHalfWidth;
  const nearZ = courtZ0 - courtHalfLength, farZ = courtZ0 + courtHalfLength;
  courtLine([[leftX, floorY + 0.018, nearZ], [rightX, floorY + 0.018, nearZ], [rightX, floorY + 0.018, farZ], [leftX, floorY + 0.018, farZ], [leftX, floorY + 0.018, nearZ]], 'linhas perimetrais da quadra');
  courtLine([[courtX0, floorY + 0.019, nearZ], [courtX0, floorY + 0.019, farZ]], 'linha central da quadra');
  const circlePoints = [];
  for (let i = 0; i <= 72; i++) {
    const a = i / 72 * Math.PI * 2;
    circlePoints.push([courtX0 + Math.cos(a) * 1.8, floorY + 0.02, courtZ0 + Math.sin(a) * 1.8]);
  }
  courtLine(circlePoints, 'círculo central da quadra');
  function courtArc(zCenter, start, end, radius) {
    const points = [];
    for (let i = 0; i <= 40; i++) {
      const a = start + (end - start) * i / 40;
      points.push([courtX0 + Math.cos(a) * radius, floorY + 0.02, zCenter + Math.sin(a) * radius]);
    }
    courtLine(points, 'arco de lance livre');
  }
  courtArc(nearZ + 5.8, Math.PI, Math.PI * 2, 1.8);
  courtArc(farZ - 5.8, 0, Math.PI, 1.8);
  for (const z of [nearZ + 5.8, farZ - 5.8]) {
    courtLine([[courtX0 - 2.45, floorY + 0.02, z], [courtX0 + 2.45, floorY + 0.02, z]], 'linha do garrafão');
    courtLine([[courtX0 - 2.45, floorY + 0.02, z], [courtX0 - 2.45, floorY + 0.02, z + (z < courtZ0 ? 5.8 : -5.8)]], 'lateral do garrafão');
    courtLine([[courtX0 + 2.45, floorY + 0.02, z], [courtX0 + 2.45, floorY + 0.02, z + (z < courtZ0 ? 5.8 : -5.8)]], 'lateral do garrafão');
  }

  // Paredes, pilares e portal de entrada na ala.
  // Paredes de calcário creme: mapa próprio de alvenaria talhada, pátina e pigmentos.
  function makeLimestoneWallMaps() {
    let seed = 92831;
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const w = 1536, h = 768;
    const colorCanvas = document.createElement('canvas'), bumpCanvas = document.createElement('canvas');
    colorCanvas.width = bumpCanvas.width = w; colorCanvas.height = bumpCanvas.height = h;
    const c = colorCanvas.getContext('2d'), b = bumpCanvas.getContext('2d');
    const wash = c.createLinearGradient(0, 0, 0, h);
    wash.addColorStop(0, '#cbb792'); wash.addColorStop(0.46, '#e0cfaa'); wash.addColorStop(1, '#c4ad82');
    c.fillStyle = wash; c.fillRect(0, 0, w, h); b.fillStyle = '#888888'; b.fillRect(0, 0, w, h);
    const blockH = 96, blockW = 256;
    for (let row = 0; row < Math.ceil(h / blockH); row++) {
      const offset = row % 2 ? -128 : 0;
      for (let col = -1; col < 8; col++) {
        const x = col * blockW + offset, y = row * blockH;
        const palette = [[211,193,157],[201,181,143],[221,205,174],[192,171,133],[216,199,163]][Math.floor(random()*5)];
        c.fillStyle = 'rgb(' + palette.join(',') + ')'; c.fillRect(x+2,y+2,blockW-4,blockH-4);
        c.strokeStyle = 'rgba(103,80,52,.32)'; c.lineWidth = 3; c.strokeRect(x+1,y+1,blockW-2,blockH-2);
        c.strokeStyle = 'rgba(255,244,215,.23)'; c.lineWidth = 1; c.beginPath(); c.moveTo(x+5,y+5); c.lineTo(x+blockW-8,y+5); c.stroke();
        b.fillStyle = '#777777'; b.fillRect(x+2,y+2,blockW-4,blockH-4); b.strokeStyle = 'rgba(42,42,42,.55)'; b.lineWidth = 4; b.strokeRect(x+1,y+1,blockW-2,blockH-2);
        for (let n=0;n<70;n++) {
          const px=x+8+random()*(blockW-16), py=y+8+random()*(blockH-16), r=.4+random()*2.1;
          c.fillStyle=random()>.5?'rgba(105,78,48,.10)':'rgba(255,247,224,.18)'; c.beginPath(); c.arc(px,py,r,0,Math.PI*2); c.fill();
          b.fillStyle=random()>.5?'rgba(45,45,45,.18)':'rgba(210,210,210,.18)'; b.fillRect(px,py,1.4,1.4);
        }
      }
    }
    for (const y of [24,h-28]) { c.fillStyle='rgba(36,83,94,.65)'; c.fillRect(0,y,w,5); c.fillStyle='rgba(170,121,55,.76)'; c.fillRect(0,y+6,w,4); b.fillStyle='#777777'; b.fillRect(0,y,w,10); }
    const map=new THREE.CanvasTexture(colorCanvas), bump=new THREE.CanvasTexture(bumpCanvas);
    map.colorSpace=THREE.SRGBColorSpace; map.wrapS=map.wrapT=bump.wrapS=bump.wrapT=THREE.RepeatWrapping;
    map.anisotropy=bump.anisotropy=8; return {map,bump};
  }
  const wallMaps=makeLimestoneWallMaps();
  const wallMat=new THREE.MeshStandardMaterial({map:wallMaps.map,bumpMap:wallMaps.bump,bumpScale:.035,color:0xfff4df,roughness:.88,metalness:0});
  // Reboco mineral PBR local CC0; alvenaria procedural permanece como fallback offline.
  const wallPbrColor=roomTextureLoader.load('./assets/textures/plaster-smooth-beige/color.webp',
    tex=>{tex.colorSpace=THREE.SRGBColorSpace;},undefined,
    ()=>{wallMat.map=wallMaps.map;wallMat.normalMap=null;wallMat.roughnessMap=null;wallMat.bumpMap=wallMaps.bump;wallMat.needsUpdate=true;}
  );
  wallPbrColor.wrapS=wallPbrColor.wrapT=THREE.RepeatWrapping;wallPbrColor.repeat.set(5,2);wallPbrColor.anisotropy=8;wallPbrColor.colorSpace=THREE.SRGBColorSpace;
  wallMat.map=wallPbrColor;
  wallMat.normalMap=loadRoomPbr('./assets/textures/plaster-smooth-beige/normal.webp',false,[5,2]);
  wallMat.roughnessMap=loadRoomPbr('./assets/textures/plaster-smooth-beige/roughness.webp',false,[5,2]);
  wallMat.bumpMap=null;wallMat.normalScale.set(.32,.32);
  const westWallX = room.minX + 0.25;
  const eastWallX = room.maxX - 0.18;
  const wallBottom = floorY;
  const wallTop = springY + 0.08;
  const wallHeight = wallTop - wallBottom;
  addBox('parede oeste da sala de treinamento', [westWallX, wallBottom + wallHeight / 2, centerZ], [0.5, wallHeight, roomLength], wallMat, true, false);
  addBox('parede norte da sala de treinamento', [centerX, wallBottom + wallHeight / 2, room.minZ + 0.22], [roomWidth, wallHeight, 0.5], wallMat, true, false);
  addBox('parede sul da sala de treinamento', [centerX, wallBottom + wallHeight / 2, room.maxZ - 0.22], [roomWidth, wallHeight, 0.5], wallMat, true, false);
  // A parede leste é seccionada para deixar o portal aberto.
  const openingWidth = 4.5;
  const openingHalf = openingWidth / 2;
  const openingStart = centerZ - openingHalf;
  const openingEnd = centerZ + openingHalf;
  const northWallLength = openingStart - room.minZ;
  const southWallLength = room.maxZ - openingEnd;
  addBox('parede leste antes do portal', [eastWallX, wallBottom + wallHeight / 2, room.minZ + northWallLength / 2], [0.5, wallHeight, northWallLength], wallMat, true, false);
  addBox('parede leste depois do portal', [eastWallX, wallBottom + wallHeight / 2, openingEnd + southWallLength / 2], [0.5, wallHeight, southWallLength], wallMat, true, false);
  addBox('verga interna do portal', [eastWallX, floorY + 3.98, centerZ], [0.5, wallTop - (floorY + 3.75), openingWidth], wallMat, true, false);
  addBox('base do portal', [eastWallX, floorY + 0.08, centerZ], [0.5, 0.16, openingWidth], limestone, false, false);
  // Batentes e lintel entalhados.
  for (const z of [centerZ - openingHalf, centerZ + openingHalf]) {
    addBox('ombreira de calcário do portal', [eastWallX - 0.03, floorY + 1.85, z], [0.68, 3.7, 0.28], limestone, true);
    addBox('capitel de bronze do portal', [eastWallX - 0.03, floorY + 3.72, z], [0.82, 0.22, 0.42], bronze);
  }
  addBox('lintel de calcário entalhado', [eastWallX - 0.03, floorY + 3.83, centerZ], [0.72, 0.36, openingWidth + 0.35], limestone);
  // Ponte com balaustrada atravessando a espessura entre o salão e a sala.
  for (const z of [centerZ - 2.2, centerZ + 2.2]) {
    addBox('corrimão da passarela', [-13.95, floorY + 0.55, z], [3.35, 0.13, 0.13], bronze, false);
    for (let x = -15.2; x <= -12.6; x += 0.65) addBox('balaústre da passarela', [x, floorY + 0.28, z], [0.09, 0.52, 0.09], limestone, false);
  }

  // Pintura da abóbada: barcos solares, papiros, discos solares e hieróglifos.
  function makeFrescoTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1536; canvas.height = 768;
    const g = canvas.getContext('2d');
    const grad = g.createLinearGradient(0, 0, 0, 768);
    grad.addColorStop(0, '#243d55'); grad.addColorStop(0.48, '#d5c49c'); grad.addColorStop(1, '#a58b61');
    g.fillStyle = grad; g.fillRect(0, 0, 1536, 768);
    g.strokeStyle = 'rgba(62,46,31,.7)'; g.lineWidth = 16; g.strokeRect(22, 22, 1492, 724);
    g.strokeStyle = 'rgba(190,151,82,.8)'; g.lineWidth = 5; g.strokeRect(42, 42, 1452, 684);
    for (let i = 0; i < 17; i++) {
      const x = 70 + i * 86;
      g.fillStyle = i % 2 ? '#315c68' : '#b18b4e';
      g.font = 'bold 52px serif'; g.textAlign = 'center';
      g.fillText(['𓂀', '𓇳', '𓋹', '𓆣', '𓅓', '𓊹'][i % 6], x, 104);
    }
    // Registro central: barca solar sob um disco alado.
    g.save(); g.translate(768, 385);
    g.fillStyle = '#bd914a'; g.strokeStyle = '#493a2a'; g.lineWidth = 10;
    g.beginPath(); g.arc(0, -150, 86, 0, Math.PI * 2); g.fill(); g.stroke();
    g.beginPath(); g.moveTo(-330, -110); g.quadraticCurveTo(-170, -210, 0, -100); g.quadraticCurveTo(170, -210, 330, -110); g.lineTo(270, -45); g.lineTo(-270, -45); g.closePath(); g.fill(); g.stroke();
    g.beginPath(); g.moveTo(-300, -90); g.quadraticCurveTo(-120, -5, 0, -10); g.quadraticCurveTo(120, -5, 300, -90); g.stroke();
    g.strokeStyle = '#315c68'; g.lineWidth = 12;
    for (let i = -5; i <= 5; i++) {
      g.beginPath(); g.moveTo(i * 36, -15); g.lineTo(i * 36, 82); g.stroke();
    }
    // Colunas de papiro, lótus e figuras em silhueta ao longo das laterais.
    for (let side of [-1, 1]) {
      for (let i = 0; i < 5; i++) {
        const px = side * (430 + i * 45);
        g.fillStyle = i % 2 ? '#315c68' : '#8d5438';
        g.fillRect(px - 9, 100, 18, 190);
        g.beginPath(); g.ellipse(px, 104, 38, 20, 0, 0, Math.PI * 2); g.fill();
        g.beginPath(); g.arc(px, 72, 28, Math.PI, Math.PI * 2); g.stroke();
      }
    }
    g.restore();
    for (let i = 0; i < 44; i++) {
      const x = 90 + (i * 157) % 1350;
      const y = 185 + (i * 67) % 420;
      g.fillStyle = i % 3 ? 'rgba(50,75,87,.68)' : 'rgba(154,103,51,.72)';
      g.beginPath(); g.arc(x, y, 3 + (i % 4), 0, Math.PI * 2); g.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }
  const fresco = makeFrescoTexture();
  fresco.colorSpace = THREE.SRGBColorSpace;
  fresco.wrapS = THREE.RepeatWrapping; fresco.wrapT = THREE.ClampToEdgeWrapping;
  const vertices = [], uvs = [], indices = [];
  const segmentsAcross = 56, segmentsLong = 48;
  for (let iz = 0; iz <= segmentsLong; iz++) {
    const z = room.minZ + 0.22 + (roomLength - 0.44) * iz / segmentsLong;
    for (let ix = 0; ix <= segmentsAcross; ix++) {
      const a = Math.PI * ix / segmentsAcross;
      vertices.push(centerX + Math.cos(a) * vaultRadius, springY + Math.sin(a) * vaultRadius, z);
      uvs.push(ix / segmentsAcross, iz / segmentsLong);
    }
  }
  for (let iz = 0; iz < segmentsLong; iz++) {
    for (let ix = 0; ix < segmentsAcross; ix++) {
      const a = iz * (segmentsAcross + 1) + ix;
      const b = a + segmentsAcross + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const vaultGeometry = new THREE.BufferGeometry();
  vaultGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  vaultGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  vaultGeometry.setIndex(indices);
  vaultGeometry.computeVertexNormals();
  const vault = new THREE.Mesh(vaultGeometry, new THREE.MeshStandardMaterial({
    map: fresco, roughness: 0.88, side: THREE.DoubleSide,
    emissive: new THREE.Color(0x172638), emissiveIntensity: 0.12
  }));
  vault.name = 'abóbada afrescada com cenas do Egito Antigo';
  vault.receiveShadow = true;
  scene.add(vault);
  for (let z = room.minZ + 1.0; z < room.maxZ; z += 4.0) {
    const arch = [];
    for (let i = 0; i <= 48; i++) {
      const a = Math.PI * i / 48;
      arch.push([centerX + Math.cos(a) * (vaultRadius - 0.08), springY + Math.sin(a) * (vaultRadius - 0.08), z]);
    }
    addTube('nervura de bronze da abóbada', arch, 0.075, darkBronze, scene, 96);
  }

  // Frisos, molduras e relevos das paredes laterais.
  for (const sideX of [westWallX + 0.28, eastWallX - 0.28]) {
    addBox('friso de calcário gravado', [sideX, floorY + 3.08, centerZ], [0.12, 0.2, roomLength - 0.8], bronze);
    addBox('rodapé de madeira escura', [sideX, floorY + 0.18, centerZ], [0.16, 0.32, roomLength - 0.8], woodDark);
    for (const z of [-12.1, -6.1, 5.1, 11.1]) {
      addBox('pilastra vertical esculpida', [sideX, floorY + 1.76, z], [0.28, 3.1, 0.46], limestoneShade);
      addBox('capitel de lótus lateral', [sideX, floorY + 3.38, z], [0.48, 0.24, 0.8], bronze);
    }
  }
  for (const z of [room.minZ + 0.28, room.maxZ - 0.28]) {
    addBox('friso de bronze na parede de fundo', [centerX, floorY + 3.1, z], [roomWidth - 0.5, 0.18, 0.12], bronze);
    addBox('cornija moldurada no topo da parede', [centerX, floorY + 3.38, z], [roomWidth - 0.42, 0.24, 0.24], limestoneShade);
    addBox('rodapé monumental de calcário', [centerX, floorY + 0.32, z], [roomWidth - 0.5, 0.56, 0.28], limestoneShade);
  }
  for (const x of [westWallX + 0.25, eastWallX - 0.25]) {
    addBox('cornija lateral de calcário', [x, floorY + 3.4, centerZ], [0.32, 0.24, roomLength - 0.5], limestoneShade);
    addBox('rodapé lateral de calcário', [x, floorY + 0.32, centerZ], [0.3, 0.56, roomLength - 0.5], limestoneShade);
  }

  // Arandelas e iluminação quente controlada; sem centenas de luzes dinâmicas.
  function addSconce(x, z, rotationY = Math.PI / 2) {
    const group = new THREE.Group(); group.position.set(x,floorY+2.42,z); group.rotation.y=rotationY;
    const plate=new THREE.Mesh(new THREE.BoxGeometry(.28,.86,.12),darkBronze); plate.position.set(0,-.02,-.12); group.add(plate);
    const plateEdge=new THREE.Mesh(new THREE.BoxGeometry(.34,.08,.15),bronze); plateEdge.position.set(0,.42,-.1); group.add(plateEdge);
    const lotus=new THREE.Group(); lotus.position.set(0,.12,-.025);
    for(let petal=-2;petal<=2;petal++){const p=new THREE.Mesh(new THREE.SphereGeometry(.075,12,10),petal%2?lapis:bronze);p.scale.set(.55,1.8,.55);p.position.set(petal*.07,Math.abs(petal)*.025,0);p.rotation.z=petal*.16;lotus.add(p);} group.add(lotus);
    addTube('braço curvo de bronze da arandela',[[0,-.08,-.08],[0,-.12,.12],[0,-.02,.28],[0,.16,.38]],.045,bronze,group,18);
    const cup=new THREE.Mesh(new THREE.CylinderGeometry(.15,.22,.17,20),bronze); cup.position.set(0,-.02,.38); group.add(cup);
    const oil=new THREE.Mesh(new THREE.CylinderGeometry(.105,.13,.045,20),darkBronze); oil.position.set(0,.075,.38); group.add(oil);
    const wick=new THREE.Mesh(new THREE.CylinderGeometry(.018,.026,.09,8),woodDark); wick.position.set(0,.13,.38); group.add(wick);
    const flame=new THREE.Mesh(new THREE.SphereGeometry(.09,18,14),warmEmissive); flame.scale.set(.68,1.7,.68); flame.position.set(0,.29,.38); group.add(flame);
    scene.add(group);
    const light=new THREE.PointLight(0xffbe78,.95,9.5,1.8); light.position.set(x,floorY+2.75,z+(x<centerX?.38:-.38)); scene.add(light);
    animated.push({obj:flame,fire:true,phase:(x+z)*.4,baseY:flame.position.y,baseScaleY:flame.scale.y,baseRotationZ:0});
  }
  for (const x of [westWallX + 0.75, eastWallX - 0.75]) {
    for (const z of [-11, -5.5, 5, 11]) addSconce(x, z, x < centerX ? 0 : Math.PI);
  }
  const ceilingFill = new THREE.PointLight(0xffdfae, 1.15, 30, 1.5);
  ceilingFill.position.set(centerX, springY + 4.0, centerZ);
  scene.add(ceilingFill);
  const coolFill = new THREE.PointLight(0x87b5c3, 0.42, 24, 1.7);
  coolFill.position.set(centerX - 4.0, floorY + 5.2, centerZ - 1.0);
  scene.add(coolFill);

  // Bustos de divindades nas laterais: a seleção e o desenho são interpretação artística.
  function addWallDeity(x,z,name,facing){
    const group=new THREE.Group(); group.position.set(x,floorY+1.36,z); group.rotation.y=facing;
    const backing=new THREE.Mesh(new THREE.BoxGeometry(1.22,2.72,.18),reliefStone); backing.position.set(0,0,-.18); group.add(backing);
    for(const side of [-1,1]){const border=new THREE.Mesh(new THREE.BoxGeometry(.075,2.76,.14),bronze);border.position.set(side*.61,0,-.055);group.add(border);const cap=new THREE.Mesh(new THREE.SphereGeometry(.12,14,10),limestoneShade);cap.scale.set(1.5,.55,.7);cap.position.set(side*.61,1.34,-.02);group.add(cap);}
    const foot=new THREE.Mesh(new THREE.BoxGeometry(.92,.18,.46),limestoneShade);foot.position.set(0,-1.28,.02);group.add(foot);
    const kilt=new THREE.Mesh(new THREE.CylinderGeometry(.22,.38,.66,4,1),faienceLight);kilt.position.set(0,-.82,.04);kilt.rotation.y=Math.PI/4;group.add(kilt);
    const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.27,.56,8,18),limestone);torso.position.set(0,-.02,.02);torso.scale.set(1.18,1,.8);group.add(torso);
    const shoulders=new THREE.Mesh(new THREE.SphereGeometry(.34,20,16),limestone);shoulders.position.set(0,.24,.02);shoulders.scale.set(1.32,.56,.82);group.add(shoulders);
    const collar=new THREE.Mesh(new THREE.TorusGeometry(.32,.075,10,32),bronze);collar.position.set(0,.28,.19);collar.rotation.x=Math.PI/2;group.add(collar);
    for(const side of [-1,1]){const arm=new THREE.Mesh(new THREE.CapsuleGeometry(.09,.54,6,12),limestone);arm.position.set(side*.39,-.12,.08);arm.rotation.z=side*.12;group.add(arm);const hand=new THREE.Mesh(new THREE.SphereGeometry(.10,12,10),faienceLight);hand.position.set(side*.43,-.48,.13);group.add(hand);const leg=new THREE.Mesh(new THREE.CapsuleGeometry(.105,.48,6,12),reliefStone);leg.position.set(side*.15,-1.08,.03);group.add(leg);}
    const headMat=name==='Anúbis'?darkBronze:limestoneShade;
    const head=new THREE.Mesh(new THREE.SphereGeometry(.25,24,18),headMat);head.position.set(0,.67,.06);head.scale.set(.88,1.18,.78);group.add(head);
    if(name==='Anúbis'){const muzzle=new THREE.Mesh(new THREE.ConeGeometry(.11,.42,4),darkBronze);muzzle.rotation.x=Math.PI/2;muzzle.position.set(0,.56,.31);group.add(muzzle);for(const side of [-1,1]){const ear=new THREE.Mesh(new THREE.ConeGeometry(.09,.43,4),darkBronze);ear.position.set(side*.16,1.02,.02);ear.rotation.z=side*-.18;group.add(ear);}}
    else if(name==='Hórus'){const beak=new THREE.Mesh(new THREE.ConeGeometry(.10,.34,4),bronze);beak.rotation.x=Math.PI/2;beak.position.set(0,.57,.34);group.add(beak);for(const side of [-1,1]){const brow=new THREE.Mesh(new THREE.TorusGeometry(.065,.018,6,18),darkBronze);brow.position.set(side*.16,.72,.25);group.add(brow);}}
    else if(name==='Sekhmet'||name==='Bastet'){const muzzle=new THREE.Mesh(new THREE.SphereGeometry(.14,16,12),limestoneShade);muzzle.position.set(0,.52,.24);muzzle.scale.set(1,.68,.8);group.add(muzzle);for(const side of [-1,1]){const ear=new THREE.Mesh(new THREE.ConeGeometry(.105,.32,4),limestoneShade);ear.position.set(side*.16,.96,.02);ear.rotation.z=side*-.12;group.add(ear);}if(name==='Sekhmet'){const mane=new THREE.Mesh(new THREE.SphereGeometry(.31,18,14),bronze);mane.position.set(0,.65,-.02);mane.scale.set(1.15,1.2,.8);group.add(mane);}}
    else{const crown=new THREE.Mesh(new THREE.CylinderGeometry(.12,.21,.42,8),lapis);crown.position.set(0,1.01,0);group.add(crown);const disk=new THREE.Mesh(new THREE.TorusGeometry(.16,.03,8,24),bronze);disk.position.set(0,1.28,0);disk.rotation.x=Math.PI/2;group.add(disk);}
    const wig=new THREE.Mesh(new THREE.SphereGeometry(.29,20,14),lapis);wig.position.set(0,.71,-.09);wig.scale.set(1.22,1.16,.82);group.add(wig);
    for(const side of [-1,1]){const flap=new THREE.Mesh(new THREE.BoxGeometry(.17,.58,.18),lapis);flap.position.set(side*.27,.28,.02);flap.rotation.z=side*.09;group.add(flap);const eye=new THREE.Mesh(new THREE.SphereGeometry(.035,12,10),darkBronze);eye.position.set(side*.12,.7,.275);group.add(eye);}
    const namePlate=new THREE.Mesh(new THREE.BoxGeometry(.74,.16,.08),bronze);namePlate.position.set(0,-1.18,.18);group.add(namePlate);
    group.traverse(obj=>{if(obj.isMesh){obj.castShadow=true;obj.receiveShadow=true;}});scene.add(group);
    addInteractable({name:'Relevo de '+name,label:name+' — relevo de calcário',description:'Figura em alto-relevo de '+name+', esculpida em calcário e pigmentada com azul, ocre e bronze. A seleção das divindades é uma composição artística da reconstrução.',prompt:'E · examinar o relevo de '+name,position:group.position,radius:2.0});
  }
  addWallDeity(westWallX + 0.72, -9.4, 'Anúbis', Math.PI / 2);
  addWallDeity(westWallX + 0.72, -1.0, 'Sekhmet', Math.PI / 2);
  addWallDeity(westWallX + 0.72, 7.8, 'Hórus', Math.PI / 2);
  addWallDeity(eastWallX - 0.72, -9.4, 'Ísis', -Math.PI / 2);
  addWallDeity(eastWallX - 0.72, 7.8, 'Bastet', -Math.PI / 2);

  // Efígies de Rá: cabeças de falcão, discos solares vazados e redes de aro.
  const hoops = [];
  function addRaHoop(baselineZ, facing, name) {
    const group = new THREE.Group(); group.position.set(centerX,floorY,baselineZ); group.rotation.y=facing;
    const steleShape=new THREE.Shape();
    steleShape.moveTo(-.72,0);steleShape.lineTo(.72,0);steleShape.lineTo(.72,2.25);
    steleShape.quadraticCurveTo(.72,2.92,0,2.92);steleShape.quadraticCurveTo(-.72,2.92,-.72,2.25);steleShape.closePath();
    const stoneBack=new THREE.Mesh(new THREE.ExtrudeGeometry(steleShape,{depth:.18,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.045,bevelThickness:.045}),reliefStone);
    stoneBack.name='estela arqueada de calcário atrás da estátua de Rá';stoneBack.position.set(0,.12,-2.05);group.add(stoneBack);
    const steleInset=new THREE.Mesh(new THREE.ShapeGeometry(steleShape),new THREE.MeshStandardMaterial({color:0x6f5540,roughness:.93}));
    steleInset.position.set(0,.12,-1.862);group.add(steleInset);
    const solarPanel=new THREE.Mesh(new THREE.TorusGeometry(.52,.035,8,56),bronze);
    solarPanel.position.set(0,2.68,-1.84);group.add(solarPanel);
    const throne=new THREE.Mesh(new THREE.BoxGeometry(1.04,.64,.88),limestoneShade); throne.position.set(0,.36,-.16); group.add(throne);
    const throneBack=new THREE.Mesh(new THREE.BoxGeometry(.98,1.7,.22),limestoneShade); throneBack.position.set(0,1.1,-.46); group.add(throneBack);
    const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.36,.72,8,24),limestone); torso.position.set(0,1.48,.05); torso.scale.set(1.2,1,.82); group.add(torso);
    const shoulders=new THREE.Mesh(new THREE.SphereGeometry(.48,24,18),limestone); shoulders.position.set(0,1.9,.07); shoulders.scale.set(1.2,.56,.8); group.add(shoulders);
    const kilt=new THREE.Mesh(new THREE.CylinderGeometry(.36,.54,.72,4,1),faienceLight); kilt.position.set(0,.95,.28); kilt.rotation.y=Math.PI/4; group.add(kilt);
    for(let pleat=-3;pleat<=3;pleat++){const fold=new THREE.Mesh(new THREE.BoxGeometry(.018,.56,.018),bronze);fold.position.set(pleat*.095,.95,.57-Math.abs(pleat)*.025);group.add(fold);}
    for(const side of [-1,1]){
      const thigh=new THREE.Mesh(new THREE.CapsuleGeometry(.15,.52,6,16),limestone);thigh.position.set(side*.22,.58,.32);thigh.rotation.x=Math.PI/2.2;group.add(thigh);
      const shin=new THREE.Mesh(new THREE.CapsuleGeometry(.12,.38,6,14),limestoneShade);shin.position.set(side*.22,.3,.62);group.add(shin);
      const arm=new THREE.Mesh(new THREE.CapsuleGeometry(.11,.5,6,16),limestone);arm.position.set(side*.46,1.5,.18);arm.rotation.z=side*.18;group.add(arm);
      const hand=new THREE.Mesh(new THREE.SphereGeometry(.11,14,12),limestoneShade);hand.position.set(side*.36,.88,.58);group.add(hand);
    }
    const collar=new THREE.Mesh(new THREE.TorusGeometry(.43,.095,12,48),bronze);collar.position.set(0,1.82,.23);collar.rotation.x=Math.PI/2;group.add(collar);
    const pectoral=new THREE.Mesh(new THREE.TorusGeometry(.29,.045,8,36),lapis);pectoral.position.set(0,1.65,.31);pectoral.rotation.x=Math.PI/2;group.add(pectoral);
    // Cabeça de falcão reconhecível: crânio alongado, bico, olhos laterais e nemes listrado.
    const head=new THREE.Mesh(new THREE.SphereGeometry(.31,28,20),limestoneShade);head.position.set(0,2.34,.12);head.scale.set(.92,1.08,1.16);group.add(head);
    const brow=new THREE.Mesh(new THREE.SphereGeometry(.34,24,16),lapis);brow.position.set(0,2.48,-.08);brow.scale.set(1.28,.85,.92);group.add(brow);
    const beakUpper=new THREE.Mesh(new THREE.ConeGeometry(.105,.44,4),bronze);beakUpper.position.set(0,2.25,.48);beakUpper.rotation.x=Math.PI/2;group.add(beakUpper);
    const beakTip=new THREE.Mesh(new THREE.ConeGeometry(.055,.2,4),darkBronze);beakTip.position.set(0,2.12,.62);beakTip.rotation.x=Math.PI/2;group.add(beakTip);
    for(const side of [-1,1]){
      const eye=new THREE.Mesh(new THREE.SphereGeometry(.075,18,14),turquoise);eye.position.set(side*.255,2.37,.32);group.add(eye);
      const eyeRing=new THREE.Mesh(new THREE.TorusGeometry(.09,.023,8,28),darkBronze);eyeRing.position.set(side*.255,2.37,.325);group.add(eyeRing);
      const headdressSide=new THREE.Mesh(new THREE.BoxGeometry(.18,.72,.23),lapis);headdressSide.position.set(side*.34,1.98,.01);headdressSide.rotation.z=side*-.08;group.add(headdressSide);
      for(let stripe=0;stripe<4;stripe++){const band=new THREE.Mesh(new THREE.BoxGeometry(.19,.025,.245),bronze);band.position.set(side*.34,1.72+stripe*.17,.025);group.add(band);}
    }
    const uraeus=new THREE.Mesh(new THREE.TorusGeometry(.09,.028,8,24),bronze);uraeus.position.set(0,2.55,.23);uraeus.rotation.x=Math.PI/2;group.add(uraeus);
    // Disco solar vazado: abertura interna de 45 cm; a borda superior do aro fica a 3,05 m.
    const sunCenter=new THREE.Vector3(0,2.761,.2);
    const sunOuter=new THREE.Mesh(new THREE.TorusGeometry(.47,.055,12,64),bronze);sunOuter.position.copy(sunCenter);group.add(sunOuter);
    const rim=new THREE.Mesh(new THREE.TorusGeometry(.257,.032,12,64),darkBronze);rim.position.copy(sunCenter);group.add(rim);
    const innerHighlight=new THREE.Mesh(new THREE.TorusGeometry(.247,.012,8,64),bronze);innerHighlight.position.copy(sunCenter);innerHighlight.position.y-=.035;group.add(innerHighlight);
    for(let i=0;i<16;i++){const a=i/16*Math.PI*2;const ray=new THREE.Mesh(new THREE.ConeGeometry(.052,.2,8),faienceLight);ray.position.set(Math.cos(a)*.43,2.761+Math.sin(a)*.43,.2);ray.rotation.z=a-Math.PI/2;group.add(ray);}
    const netRing=new THREE.Mesh(new THREE.TorusGeometry(.15,.018,8,40),bronze);netRing.position.set(0,2.40,.2);group.add(netRing);
    for(let i=0;i<12;i++){const a=i/12*Math.PI*2;addTube('corda da rede do disco solar',[[Math.cos(a)*.257,2.761+Math.sin(a)*.257,.2],[Math.cos(a+.08)*.19,2.56+Math.sin(a+.08)*.19,.2],[Math.cos(a+.16)*.15,2.40+Math.sin(a+.16)*.15,.2]],.009,limestoneShade,group,10);}
    const cartouche=new THREE.Mesh(new THREE.BoxGeometry(.72,.34,.06),darkBronze);cartouche.position.set(0,.5,.54);group.add(cartouche);
    const glyphCanvas=document.createElement('canvas');glyphCanvas.width=256;glyphCanvas.height=128;const gg=glyphCanvas.getContext('2d');gg.fillStyle='#193b49';gg.fillRect(0,0,256,128);gg.strokeStyle='#c99b51';gg.lineWidth=6;gg.strokeRect(5,5,246,118);gg.fillStyle='#f0d49a';gg.font='bold 46px Georgia';gg.textAlign='center';gg.fillText('RA',128,83);
    const glyphTex=new THREE.CanvasTexture(glyphCanvas);glyphTex.colorSpace=THREE.SRGBColorSpace;
    const glyphPlate=new THREE.Mesh(new THREE.PlaneGeometry(.62,.28),new THREE.MeshBasicMaterial({map:glyphTex}));glyphPlate.position.set(0,.5,.575);group.add(glyphPlate);
    group.traverse(obj=>{if(obj.isMesh){obj.castShadow=true;obj.receiveShadow=true;}});scene.add(group);
    const hoopPosition=new THREE.Vector3(centerX,floorY+2.761,baselineZ+(facing===0?.2:-.2));
    hoops.push({position:hoopPosition,label:name,approachDirection:facing===0?-1:1});
    addInteractable({name,label:'Rá — disco solar / cesta',description:'Figura humana de cabeça de falcão representa Rá. O disco solar vazado acima da cabeça funciona como cesta de basquete; a abertura interna tem 45 cm, com a borda superior a 3,05 m do piso.',prompt:'CESTA DE RÁ · E para examinar · arremesse a bola pelo disco solar',position:group.position,radius:2.6});
  }
  addRaHoop(nearZ + 0.55, 0, 'Rá — cesta norte');
  addRaHoop(farZ - 0.55, Math.PI, 'Rá — cesta sul');

  // Painel de pontuação em papiro, atualizado quando a bola ou os projéteis acertam.
  const scoreCanvas = document.createElement('canvas');
  scoreCanvas.width = 640; scoreCanvas.height = 180;
  const scoreCtx = scoreCanvas.getContext('2d');
  function drawScoreboard(baskets, targetHits, active) {
    scoreCtx.clearRect(0, 0, 640, 180);
    scoreCtx.fillStyle = '#182d37'; scoreCtx.fillRect(0, 0, 640, 180);
    scoreCtx.strokeStyle = '#c59b58'; scoreCtx.lineWidth = 9; scoreCtx.strokeRect(8, 8, 624, 164);
    scoreCtx.fillStyle = '#ead6aa'; scoreCtx.textAlign = 'center';
    scoreCtx.font = 'bold 25px Georgia'; scoreCtx.fillText('BROOKLYN HOUSE  ·  AULA DE TREINAMENTO', 320, 48);
    scoreCtx.font = 'bold 58px Georgia'; scoreCtx.fillText('CESTAS  ' + String(baskets).padStart(2, '0'), 195, 125);
    scoreCtx.font = 'bold 42px Georgia'; scoreCtx.fillText('ALVOS  ' + String(targetHits).padStart(2, '0'), 480, 125);
    if (active) { scoreCtx.font = 'bold 18px Georgia'; scoreCtx.fillStyle = '#f4b765'; scoreCtx.fillText('PRÁTICA DE ALVOS ATIVA', 320, 157); }
    scoreboardTexture.needsUpdate = true;
  }
  const scoreboardTexture = new THREE.CanvasTexture(scoreCanvas);
  scoreboardTexture.colorSpace = THREE.SRGBColorSpace;
  const scoreboard = new THREE.Mesh(
    new THREE.PlaneGeometry(4.4, 1.24),
    new THREE.MeshBasicMaterial({ map: scoreboardTexture, transparent: false })
  );
  scoreboard.name = 'placar da sala de treinamento';
  scoreboard.position.set(centerX, floorY + 3.5, room.minZ + 0.42);
  scoreboard.rotation.y = 0;
  scene.add(scoreboard);
  let baskets = 0, targetHits = 0;
  drawScoreboard(baskets, targetHits, false);

  // Bola de basquete própria, com costuras curvas e textura de couro granulada.
  const ballCanvas = document.createElement('canvas');
  ballCanvas.width = 512; ballCanvas.height = 256;
  const ballCtx = ballCanvas.getContext('2d');
  const ballGrad = ballCtx.createLinearGradient(0, 0, 512, 256);
  ballGrad.addColorStop(0, '#c97832'); ballGrad.addColorStop(0.5, '#a94f22'); ballGrad.addColorStop(1, '#d98a3c');
  ballCtx.fillStyle = ballGrad; ballCtx.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 3200; i++) {
    const x = (i * 73) % 512, y = (i * 131) % 256;
    ballCtx.fillStyle = i % 2 ? 'rgba(55,29,14,.12)' : 'rgba(255,215,149,.08)';
    ballCtx.fillRect(x, y, 1.2, 1.2);
  }
  const ballMap = new THREE.CanvasTexture(ballCanvas);
  ballMap.colorSpace = THREE.SRGBColorSpace;
  const ballMaterial = new THREE.MeshStandardMaterial({ map: ballMap, roughness: 0.84, metalness: 0.01 });
  const ballRadius = 0.12; // Bola oficial com aproximadamente 24 cm de diâmetro.
  const ball = new THREE.Mesh(new THREE.SphereGeometry(ballRadius, 40, 32), ballMaterial);
  ball.name = 'bola de basquete interativa';
  ball.position.set(centerX, floorY + ballRadius, centerZ - 2.2);
  ball.castShadow = true; ball.receiveShadow = true; scene.add(ball);
  const seamMaterial = new THREE.MeshStandardMaterial({ color: 0x211812, roughness: 0.9 });
  const seamA = new THREE.Mesh(new THREE.TorusGeometry(0.121, 0.0045, 6, 80), seamMaterial);
  seamA.name = 'costura da bola'; seamA.rotation.x = Math.PI / 2; ball.add(seamA);
  const seamB = new THREE.Mesh(new THREE.TorusGeometry(0.121, 0.0045, 6, 80), seamMaterial);
  seamB.name = 'costura da bola'; seamB.rotation.y = Math.PI / 2; ball.add(seamB);
  const seamC = new THREE.Mesh(new THREE.TorusGeometry(0.121, 0.0045, 6, 80), seamMaterial);
  seamC.name = 'costura da bola'; seamC.rotation.z = Math.PI / 2; ball.add(seamC);
  const ballVelocity = new THREE.Vector3();
  let ballHeld = false, ballAge = 0;
  const latestPlayerPosition = new THREE.Vector3(centerX, floorY, centerZ);
  const latestForward = new THREE.Vector3(0, 0, -1);
  addInteractable({
    name: 'Bola de basquete', label: 'Bola de basquete',
    description: 'Bola oficial de couro com cerca de 24 cm de diâmetro. E/INTERAGIR pega e arremessa; mire em uma cesta de Rá ou em um shabti despertado.',
    prompt: 'E / INTERAGIR · pegar ou arremessar a bola',
    position: ball.position, radius: 2.1,
    onInteract: () => {
      if (!ballHeld) {
        ballHeld = true; ballVelocity.set(0, 0, 0);
        return 'Bola recolhida. Pressione E/INTERAGIR novamente para arremessar na direção da câmera.';
      }
      ballHeld = false; ballAge = 0;
      const aim = latestForward.clone().setY(0).normalize();
      const shabtiCandidates = shabtiWarriors.filter(state => state.active && state.spawnProgress >= 0.92)
        .map(state => {
          const head = state.group.position.clone().add(new THREE.Vector3(0, 1.92 * state.fullScale, 0));
          const direction = head.clone().sub(ball.position).setY(0);
          const distance = direction.length(); direction.normalize();
          return { state, head, direction, distance, alignment: direction.dot(aim) };
        })
        .filter(item => item.distance < 10.5 && item.alignment > 0.76)
        .sort((a,b)=>a.distance-b.distance);
      const candidates = hoops.map(hoop => {
        const direction = new THREE.Vector3(hoop.position.x - ball.position.x, 0, hoop.position.z - ball.position.z);
        const distance = direction.length(); direction.normalize();
        return { hoop, direction, distance, alignment: direction.dot(aim) };
      }).filter(item => item.alignment > 0.58).sort((a, b) => a.distance - b.distance);
      if (shabtiCandidates.length) {
        const target=shabtiCandidates[0];
        const speed=9.5, flightTime=Math.max(.3,target.distance/speed);
        ballVelocity.copy(target.direction).multiplyScalar(speed);
        ballVelocity.y=(target.head.y-ball.position.y+.5*9.81*flightTime*flightTime)/flightTime;
        return 'Arremesso no shabti! Mire na cabeça do guerreiro — como na aula de Carter.';
      }
      if (candidates.length) {
        const target = candidates[0];
        const flightTime = Math.max(0.35, target.distance / 11.5);
        ballVelocity.copy(target.direction).multiplyScalar(11.5);
        ballVelocity.y = (target.hoop.position.y - ball.position.y + 0.5 * 9.81 * flightTime * flightTime) / flightTime;
      } else {
        ballVelocity.copy(aim);
        if (ballVelocity.lengthSq() < 0.1) ballVelocity.set(0, 0, -1);
        ballVelocity.multiplyScalar(11.5);
        ballVelocity.y = 6.25;
      }
      return 'Arremesso! Mira na cesta solar para receber assistência de arco.';
    }
  });

  // Alvos de prática: interpretação lúdica para a atividade de mira mencionada no Manual.
  const targets = [];
  function addTarget(z, index) {
    const group = new THREE.Group();
    group.position.set(westWallX + 0.4, floorY + 2.35, z);
    group.rotation.y = Math.PI / 2;
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.13, 2.2, 20), darkBronze);
    post.position.set(0, -0.95, 0); group.add(post);
    const outer = new THREE.Mesh(new THREE.TorusGeometry(0.74, 0.105, 14, 56), bronze);
    outer.position.z = 0.08; group.add(outer);
    const middle = new THREE.Mesh(new THREE.TorusGeometry(0.49, 0.07, 12, 48), turquoise);
    middle.position.z = 0.1; group.add(middle);
    const inner = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.055, 10, 40), clayLight);
    inner.position.z = 0.12; group.add(inner);
    const center = new THREE.Mesh(new THREE.CircleGeometry(0.12, 32), warmEmissive);
    center.position.z = 0.14; group.add(center);
    group.traverse(obj => { if (obj.isMesh) { obj.castShadow = true; obj.receiveShadow = true; } });
    scene.add(group);
    targets.push({ group, position: group.position.clone(), glow: center, hitUntil: 0, index });
  }
  addTarget(-10.0, 1); addTarget(-0.5, 2); addTarget(9.0, 3);
  const noticeBoard = new THREE.Group();
  noticeBoard.name = 'quadro de aviso para prática de alvos';
  noticeBoard.position.set(eastWallX - 0.42, floorY + 2.15, 8.2);
  noticeBoard.rotation.y = -Math.PI / 2;
  const boardBacking = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.7, 0.18), woodDark);
  noticeBoard.add(boardBacking);
  const noticeCanvas = document.createElement('canvas');
  noticeCanvas.width = 512; noticeCanvas.height = 384;
  const ng = noticeCanvas.getContext('2d');
  ng.fillStyle = '#e5d2a6'; ng.fillRect(0, 0, 512, 384);
  ng.strokeStyle = '#674a2b'; ng.lineWidth = 12; ng.strokeRect(9, 9, 494, 366);
  ng.fillStyle = '#352d24'; ng.textAlign = 'center'; ng.font = 'bold 38px Georgia';
  ng.fillText('TREINO DE PRECISÃO', 256, 72);
  ng.font = '26px Georgia'; ng.fillText('CAJADO / MAGIA', 256, 132);
  ng.fillText('E / INTERAGIR PARA COMEÇAR', 256, 208);
  ng.font = '22px Georgia'; ng.fillText('Três alvos marcados', 256, 286);
  const noticeTexture = new THREE.CanvasTexture(noticeCanvas);
  noticeTexture.colorSpace = THREE.SRGBColorSpace;
  const noticeFace = new THREE.Mesh(new THREE.PlaneGeometry(1.88, 1.42), new THREE.MeshBasicMaterial({ map: noticeTexture }));
  noticeFace.position.z = 0.101; noticeBoard.add(noticeFace);
  scene.add(noticeBoard);
  let targetPracticeActive = false;
  const projectiles = [];
  function firePracticeOrb(position, forward) {
    const direction = forward.clone().setY(0).normalize();
    if (direction.lengthSq() < 0.1) direction.set(0, 0, -1);
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 20, 16),
      new THREE.MeshStandardMaterial({ color: 0x8ce5e6, emissive: 0x38b9c7, emissiveIntensity: 2.2, roughness: 0.28 })
    );
    mesh.name = 'projétil mágico de treino';
    mesh.position.set(position.x, position.y + 1.15, position.z).addScaledVector(direction, 0.9);
    mesh.castShadow = true; scene.add(mesh);
    const trail = new THREE.PointLight(0x83e5ea, 0.8, 2.8);
    trail.position.copy(mesh.position); scene.add(trail);
    projectiles.push({ mesh, trail, velocity: direction.multiplyScalar(21), life: 0 });
  }
  addInteractable({
    name: 'Quadro de prática de alvos', label: 'Inscrição para prática de alvos',
    description: 'O quadro anuncia uma sessão de mira. A atividade e os alvos são representados aqui como uma reconstrução jogável.',
    position: noticeBoard.position, radius: 2.3,
    onInteract: () => {
      targetPracticeActive = !targetPracticeActive;
      drawScoreboard(baskets, targetHits, targetPracticeActive);
      return targetPracticeActive
        ? 'Prática de alvos iniciada. Equipe o cajado no inventário e pressione F/USAR para lançar orbes mágicos.'
        : 'Prática de alvos encerrada.';
    }
  });

  // Quatro estatuetas shabti de barro que crescem para guerreiros de treino.
  // O arranjo adapta a aula Magic Problem-Solving 101 / Whatever Works.
  // Um shabti começa como estatueta vitrificada de cerca de 18 cm e cresce até a escala humana.
  const shabtiMiniScale = 0.085;
  const shabtiFullScale = 0.82;
  const shabtiTemplate = new THREE.Group();
  shabtiTemplate.name = 'modelo de guerreiro shabti de faiança';
  function shabtiMesh(parent, name, geometry, material, pos, scale = null) {
    const mesh = new THREE.Mesh(geometry, material); mesh.name = name;
    mesh.position.set(pos[0],pos[1],pos[2]); if(scale) mesh.scale.set(scale[0],scale[1],scale[2]);
    mesh.castShadow=true; mesh.receiveShadow=true; parent.add(mesh); return mesh;
  }
  const body = shabtiMesh(shabtiTemplate,'corpo vitrificado mumiforme',new THREE.CapsuleGeometry(.31,.62,8,20),faience,[0,1.07,0],[.96,1,.84]);
  const chest = shabtiMesh(shabtiTemplate,'peitoral de faiança',new THREE.CylinderGeometry(.27,.31,.48,16,2),faienceLight,[0,1.22,.17],[1,1,.72]);
  const kilt = shabtiMesh(shabtiTemplate,'saiote cerimonial',new THREE.CylinderGeometry(.27,.40,.56,6,1),lapis,[0,.67,.02]); kilt.rotation.y=Math.PI/6;
  for(let fold=-2;fold<=2;fold++) shabtiMesh(shabtiTemplate,'pregas do saiote',new THREE.BoxGeometry(.018,.44,.018),bronze,[fold*.11,.66,.36-Math.abs(fold)*.035]);
  const legs=[];
  for(const side of [-1,1]){
    const leg=new THREE.Group(); leg.name=side<0?'shabti-perna-esquerda':'shabti-perna-direita'; leg.position.set(side*.17,.44,.02); shabtiTemplate.add(leg);
    shabtiMesh(leg,'perna de faiança',new THREE.CapsuleGeometry(.105,.42,6,14),faience,[0,-.16,0]);
    shabtiMesh(leg,'sandália de bronze',new THREE.BoxGeometry(.22,.09,.34),bronze,[0,-.42,.09]); legs.push(leg);
  }
  const neck=shabtiMesh(shabtiTemplate,'pescoço',new THREE.CylinderGeometry(.13,.15,.22,16),faienceLight,[0,1.72,.02]);
  const head=shabtiMesh(shabtiTemplate,'rosto de guerreiro',new THREE.SphereGeometry(.235,24,18),faienceLight,[0,1.94,.045],[.88,1.08,.82]);
  shabtiMesh(shabtiTemplate,'sobrancelha esquerda',new THREE.BoxGeometry(.12,.028,.025),darkBronze,[-.105,2.0,.225]);
  shabtiMesh(shabtiTemplate,'sobrancelha direita',new THREE.BoxGeometry(.12,.028,.025),darkBronze,[.105,2.0,.225]);
  for(const side of [-1,1]) shabtiMesh(shabtiTemplate,'olho escuro',new THREE.SphereGeometry(.032,12,10),darkBronze,[side*.09,1.96,.235]);
  shabtiMesh(shabtiTemplate,'nariz',new THREE.ConeGeometry(.045,.12,5),faience,[0,1.89,.24]);
  const nemes=shabtiMesh(shabtiTemplate,'nemes listrado',new THREE.SphereGeometry(.29,24,18),lapis,[0,2.03,-.055],[1.12,.78,.92]);
  for(const side of [-1,1]){
    const flap=shabtiMesh(shabtiTemplate,'aba lateral do nemes',new THREE.BoxGeometry(.16,.52,.18),lapis,[side*.245,1.69,.015]); flap.rotation.z=side*-.08;
    for(let stripe=0;stripe<3;stripe++) shabtiMesh(shabtiTemplate,'friso dourado do nemes',new THREE.BoxGeometry(.17,.025,.19),bronze,[side*.245,1.53+stripe*.14,.03]);
  }
  const uraeus=shabtiMesh(shabtiTemplate,'uraeus frontal',new THREE.TorusGeometry(.07,.018,8,20),bronze,[0,2.19,.15]); uraeus.rotation.x=Math.PI/2;
  const collar=shabtiMesh(shabtiTemplate,'colar largo usekh',new THREE.TorusGeometry(.29,.075,10,36),bronze,[0,1.57,.10]); collar.rotation.x=Math.PI/2;
  for(let row=0;row<3;row++){
    const line=shabtiMesh(shabtiTemplate,'filete de esmalte do colar',new THREE.TorusGeometry(.29-row*.035,.018,6,36),row%2?lapis:faienceLight,[0,1.57-row*.045,.11]); line.rotation.x=Math.PI/2;
  }
  // Braços articulados: um sustenta a espada, o outro o escudo.
  const swordArm=new THREE.Group(); swordArm.name='shabti-sword-arm'; swordArm.position.set(.37,1.45,.02); shabtiTemplate.add(swordArm);
  shabtiMesh(swordArm,'braço superior armado',new THREE.CapsuleGeometry(.105,.40,6,14),faience,[0,-.22,0]);
  const swordForearm=new THREE.Group(); swordForearm.name='cotovelo armado'; swordForearm.position.set(0,-.43,.02); swordArm.add(swordForearm);
  shabtiMesh(swordForearm,'antebraço armado',new THREE.CapsuleGeometry(.085,.32,6,12),faienceLight,[0,-.16,.015]);
  shabtiMesh(swordForearm,'mão direita',new THREE.SphereGeometry(.095,12,10),faience,[0,-.36,.04]);
  const swordGrip=shabtiMesh(swordForearm,'punho de madeira da espada',new THREE.CylinderGeometry(.035,.04,.32,10),woodDark,[0,-.48,.08]); swordGrip.rotation.z=-.12;
  shabtiMesh(swordForearm,'guarda de bronze da espada',new THREE.BoxGeometry(.32,.07,.11),bronze,[0,-.64,.08]);
  const bladeShape=new THREE.Shape(); bladeShape.moveTo(-.045,0); bladeShape.lineTo(.045,0); bladeShape.lineTo(.06,.48); bladeShape.quadraticCurveTo(.08,.72,.24,.94); bladeShape.quadraticCurveTo(.30,1.04,.25,1.10); bladeShape.lineTo(.13,1.02); bladeShape.quadraticCurveTo(-.015,.86,-.06,.62); bladeShape.closePath();
  const blade=new THREE.Mesh(new THREE.ExtrudeGeometry(bladeShape,{depth:.035,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.012,bevelThickness:.012}),new THREE.MeshStandardMaterial({color:0x8f9897,metalness:.82,roughness:.24})); blade.name='lâmina curva de bronze e ferro'; blade.position.set(-.02,-.62,.12); blade.castShadow=true; swordForearm.add(blade);
  shabtiMesh(swordForearm,'nervura dourada da lâmina',new THREE.BoxGeometry(.018,.58,.02),bronze,[.035,-.27,.16]);
  const shieldArm=new THREE.Group(); shieldArm.name='shabti-shield-arm'; shieldArm.position.set(-.38,1.4,.02); shabtiTemplate.add(shieldArm);
  shabtiMesh(shieldArm,'braço do escudo',new THREE.CapsuleGeometry(.105,.46,6,14),faience,[-.02,-.23,0]);
  const shield=new THREE.Group(); shield.name='escudo oval de faiança'; shield.position.set(-.13,-.48,.16); shieldArm.add(shield);
  const shieldDisk=shabtiMesh(shield,'escudo esmaltado',new THREE.SphereGeometry(.32,18,12),faienceLight,[0,0,.0],[.82,1.12,.22]);
  const shieldRim=shabtiMesh(shield,'aro de bronze do escudo',new THREE.TorusGeometry(.27,.028,8,32),bronze,[0,0,.05]); shieldRim.scale.set(.82,1.12,1);
  shabtiMesh(shield,'umbigo do escudo',new THREE.SphereGeometry(.09,14,12),bronze,[0,0,.08]);
  for(let rib=0;rib<6;rib++){const a=rib/6*Math.PI*2; const r=new THREE.Mesh(new THREE.BoxGeometry(.018,.43,.018),bronze);r.position.set(Math.cos(a)*.09,Math.sin(a)*.17,.055);r.rotation.z=a;shield.add(r);}
  // Inscrição vertical e pequenos sinais pintados, como na cerâmica vitrificada.
  const glyphCanvas=document.createElement('canvas'); glyphCanvas.width=256; glyphCanvas.height=512;
  const gx=glyphCanvas.getContext('2d'); gx.clearRect(0,0,256,512); gx.fillStyle='#d8c08b'; gx.globalAlpha=.92; gx.font='42px serif'; gx.textAlign='center';
  ['𓋹','𓂀','𓊹','𓆣','𓇳'].forEach((symbol,i)=>gx.fillText(symbol,128,56+i*92));
  const glyphTexture=new THREE.CanvasTexture(glyphCanvas); glyphTexture.colorSpace=THREE.SRGBColorSpace;
  const chestGlyph=new THREE.Mesh(new THREE.PlaneGeometry(.22,.54),new THREE.MeshBasicMaterial({map:glyphTexture,transparent:true,side:THREE.DoubleSide})); chestGlyph.name='hieróglifos pintados no peitoral'; chestGlyph.position.set(0,1.18,.405); shabtiTemplate.add(chestGlyph);
  const miniaturePedestal=new THREE.Mesh(new THREE.CylinderGeometry(.43,.48,.12,24),limestoneShade); miniaturePedestal.name='base exclusiva da miniatura shabti'; miniaturePedestal.position.y=.055; miniaturePedestal.userData.miniatureOnly=true; shabtiTemplate.add(miniaturePedestal);
  const miniatureSeal=new THREE.Mesh(new THREE.TorusGeometry(.52,.022,8,36),warmEmissive); miniatureSeal.name='selo luminoso da miniatura shabti'; miniatureSeal.rotation.x=Math.PI/2; miniatureSeal.position.y=.025; miniatureSeal.userData.miniatureOnly=true; shabtiTemplate.add(miniatureSeal);
  const shabtiOffsets=[[-6.2,-10.2],[6.2,-10.2],[-6.2,10.2],[6.2,10.2]];
  const shabtiWarriors = shabtiOffsets.map((offset,index)=>{
    const group=index===0?shabtiTemplate:shabtiTemplate.clone(true);
    group.name='guerreiro shabti '+(index+1);
    group.position.set(centerX+offset[0],floorY,centerZ+offset[1]);
    group.scale.setScalar(shabtiMiniScale);
    group.traverse(obj=>{if(obj.isMesh){obj.castShadow=true;obj.receiveShadow=true;}}); scene.add(group);
    const aura=new THREE.Group(); aura.name='aura de invocação shabti'; aura.position.copy(group.position);
    const beamMat=new THREE.MeshBasicMaterial({color:0x66d8d0,transparent:true,opacity:.16,side:THREE.DoubleSide,depthWrite:false});
    const beam=new THREE.Mesh(new THREE.CylinderGeometry(.22,.46,2.65,18,1,true),beamMat); beam.name='coluna de magia'; beam.position.y=1.3; aura.add(beam);
    const auraRing=new THREE.Mesh(new THREE.TorusGeometry(.68,.025,8,48),warmEmissive); auraRing.name='círculo de invocação'; auraRing.rotation.x=Math.PI/2; auraRing.position.y=.04; aura.add(auraRing);
    scene.add(aura); aura.visible=false;
    const state={
      group,index,health:2,spawnProgress:1,hitAt:0,defeatTime:0,active:false,defeated:false,collider:null,
      aiState:'idle',windup:0,strike:0,strikeResolved:false,attackCooldown:0,moveSpeed:1.32,
      origin:group.position.clone(),miniScale:shabtiMiniScale,fullScale:shabtiFullScale,
      aura,beamMat,swordArm:group.getObjectByName('shabti-sword-arm'),shieldArm:group.getObjectByName('shabti-shield-arm'),
      leftLeg:group.getObjectByName('shabti-perna-esquerda'),rightLeg:group.getObjectByName('shabti-perna-direita'),
      stumbleTimer:0,stumbleDirection:new THREE.Vector3(),marked:false
    };
    addInteractable({
      name:'Guerreiro shabti '+(index+1),label:'Estatueta shabti '+String(index+1).padStart(2,'0'),
      description:'Pequena figura de faiança vitrificada, com espada e escudo. Aproxime-se do quadro Whatever Works e inicie a aula para despertá-la.',
      prompt:()=>state.active?'E / INTERAGIR · aplicar SA-PER (errar) · F / USAR · atacar':'E · examinar estatueta · inicie a aula no quadro para despertá-la',
      position:group.position,radius:1.55,
      onInteract:()=>{
        if(!state.active) return state.defeated?'O guerreiro voltou à forma de estatueta. A prova pode ser reiniciada no quadro.':'Estatueta shabti de faiança. Para despertá-la, vá até o quadro de aula e pressione E / INTERAGIR.';
        state.marked=true; state.aiState='stumble';
        const away=group.position.clone().sub(latestPlayerPosition).setY(0);
        if(away.lengthSq()<.01) away.set(1,0,0); away.normalize();
        const walls=[
          {dir:new THREE.Vector3(1,0,0),dist:room.maxX-1.0-group.position.x,target:new THREE.Vector3(room.maxX-1.0,floorY,group.position.z)},
          {dir:new THREE.Vector3(-1,0,0),dist:group.position.x-(room.minX+1.0),target:new THREE.Vector3(room.minX+1.0,floorY,group.position.z)},
          {dir:new THREE.Vector3(0,0,1),dist:room.maxZ-1.0-group.position.z,target:new THREE.Vector3(group.position.x,floorY,room.maxZ-1.0)},
          {dir:new THREE.Vector3(0,0,-1),dist:group.position.z-(room.minZ+1.0),target:new THREE.Vector3(group.position.x,floorY,room.minZ+1.0)}
        ].filter(w=>w.dist>0.5).sort((a,b)=>b.dir.dot(away)-a.dir.dot(away));
        const wall=walls[0]||{target:group.position.clone().addScaledVector(away,4.5),dist:4.5,dir:away};
        state.stumbleTarget=wall.target; state.stumbleDirection.copy(wall.target).sub(group.position).setY(0).normalize();
        state.stumbleSpeed=2.8; state.stumbleTimer=wall.dist/state.stumbleSpeed+0.5;
        return 'SA-PER — “errar”. Você marcou o shabti com o hieróglifo. Ele vai cambalear e bater contra a parede.';
      }
    });
    return state;
  });
  let shabtiActive=false,shabtiRemaining=0;
  const maxPlayerHealth=5;
  let playerHealth=maxPlayerHealth,playerInvulnerability=0;
  function addShabtiCollider(state) {
    const p = state.group.position;
    const collider = {
      minX: p.x - 0.54, maxX: p.x + 0.54,
      minY: floorY, maxY: floorY + 2.15,
      minZ: p.z - 0.48, maxZ: p.z + 0.48
    };
    colliders.push(collider);
    state.collider = collider;
  }
  function removeShabtiCollider(state) {
    if (!state.collider) return;
    const index = colliders.indexOf(state.collider);
    if (index >= 0) colliders.splice(index, 1);
    state.collider = null;
  }
  function startShabtiChallenge() {
    shabtiActive=true; shabtiRemaining=shabtiWarriors.length;
    playerHealth=maxPlayerHealth; playerInvulnerability=0;
    for(const state of shabtiWarriors){
      removeShabtiCollider(state); state.health=2; state.spawnProgress=0; state.aiState='approach';
      state.windup=0;state.strike=0;state.strikeResolved=false;state.attackCooldown=.7+state.index*.22;state.moveSpeed=1.18+(state.index%2)*.15;
      state.hitAt=0;state.defeatTime=0;state.active=true;state.defeated=false;state.marked=false;
      state.group.visible=true;state.group.position.copy(state.origin);state.group.rotation.set(0,0,0);state.group.scale.setScalar(state.miniScale);
      state.swordArm.rotation.set(0,0,0);state.shieldArm.rotation.set(0,0,0);state.leftLeg.rotation.set(0,0,0);state.rightLeg.rotation.set(0,0,0);
      state.group.traverse(obj=>{if(obj.userData?.miniatureOnly)obj.visible=true;});
      state.aura.visible=true;state.aura.position.copy(state.origin);state.aura.scale.setScalar(1);state.beamMat.opacity=.16;
      addShabtiCollider(state);
    }
  }
  function completeShabti(state,reason){
    if(!state?.active)return null;
    state.active=false;state.defeated=true;state.defeatTime=2.4;removeShabtiCollider(state);shabtiRemaining=Math.max(0,shabtiRemaining-1);
    if(shabtiRemaining===0){shabtiActive=false;return reason+' A prova terminou: todos os quatro shabtis foram neutralizados.';}
    return reason+' Restam '+shabtiRemaining+' guerreiros.';
  }

  const problemBoard = new THREE.Group();
  problemBoard.name = 'quadro da aula Whatever Works';
  problemBoard.position.set(westWallX + 0.48, floorY + 2.0, 11.2);
  problemBoard.rotation.y = Math.PI / 2;
  const problemBack = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.4, 3.1), darkBronze);
  problemBoard.add(problemBack);
  const paperCanvas=document.createElement('canvas'); paperCanvas.width=768;paperCanvas.height=512;
  const pg=paperCanvas.getContext('2d'); pg.fillStyle='#ead9b5';pg.fillRect(0,0,768,512);pg.strokeStyle='#765431';pg.lineWidth=16;pg.strokeRect(10,10,748,492);
  pg.fillStyle='#24424a';pg.fillRect(24,24,720,76);pg.fillStyle='#f1d7a0';pg.textAlign='center';pg.font='bold 36px Georgia';pg.fillText('MAGIC PROBLEM-SOLVING 101',384,76);
  pg.fillStyle='#332a20';pg.font='bold 66px Georgia';pg.fillText('WHATEVER WORKS',384,190);
  pg.font='bold 30px Georgia';pg.fillText('E / INTERAGIR  ·  DESPERTAR OS QUATRO SHABTIS',384,270);
  pg.font='26px Georgia';pg.fillText('Aproxime-se e use E para marcar SA-PER (errar)',384,330);
  pg.fillText('Use F / USAR com cajado ou khopesh para golpear',384,380);
  pg.fillText('Ou pegue a bola e acerte a cabeça do guerreiro',384,430);
  const paperTexture = new THREE.CanvasTexture(paperCanvas);
  paperTexture.colorSpace = THREE.SRGBColorSpace;
  const problemFace = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 1.92), new THREE.MeshBasicMaterial({ map: paperTexture }));
  problemFace.position.z = 0.085; problemBoard.add(problemFace);
  scene.add(problemBoard);
  addInteractable({
    name: 'Quadro da aula Magic Problem-Solving 101', label: 'Whatever Works — prova prática',
    description: 'Aula de resolução de problemas mágicos. Pressione E para despertar quatro guerreiros shabti. Neutralize-os com o cajado/khopesh, marque SA-PER numa estatueta ativa ou use a bola de basquete.',
    prompt: 'E / INTERAGIR · começar a aula WHATEVER WORKS',
    position: problemBoard.position, radius: 2.8,
    onInteract: () => {
      if (shabtiActive) return 'A prova já está em andamento. Use F/USAR com o cajado ou khopesh, E numa estatueta para aplicar SA-PER, ou arremesse a bola na cabeça de um guerreiro.';
      startShabtiChallenge();
      return 'Aula iniciada! As quatro estatuetas estão despertando. Prepare-se: elas vão avançar. Neutralize-as com arma, SA-PER ou basquete.';
    }
  });

  function hitShabti(state, weaponName) {
    if(!shabtiActive||!state?.active)return null;
    state.health-=1;state.hitAt=.48;state.aiState='stunned';state.attackCooldown=.55;
    if(state.health<=0) return completeShabti(state,'Guerreiro shabti '+(state.index+1)+' se quebrou em fragmentos de faiança.');
    return (weaponName==='staff'?'O cajado atingiu o peitoral vitrificado. ':'O khopesh atingiu o guerreiro. ')+'Falta um golpe para neutralizá-lo.';
  }

  // Portal duplo de madeira e bronze, inicialmente aberto para permitir circulação.
  const doorLeaves = [];
  for (const side of [-1, 1]) {
    const hinge = new THREE.Group();
    hinge.position.set(eastWallX - 0.16, floorY, centerZ + side * openingHalf);
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.15, 3.65, openingHalf), woodDark);
    leaf.position.set(0, 1.825, -side * openingHalf / 2);
    leaf.castShadow = true; leaf.receiveShadow = true; hinge.add(leaf);
    for (let y = 0.35; y < 3.4; y += 0.62) {
      const band = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.055, openingHalf - 0.15), bronze);
      band.position.set(0.08, y, -side * openingHalf / 2); hinge.add(band);
    }
    hinge.rotation.y = side < 0 ? -Math.PI / 2 : Math.PI / 2;
    scene.add(hinge);
    doorLeaves.push({ hinge, side });
  }
  let doorOpen = true;
  const closedDoorColliders = [];
  addInteractable({
    name: 'Portas duplas da sala de treinamento', label: 'Portas de nogueira e bronze',
    description: 'Portas duplas entalhadas no portal entre o Grande Salão e a sala de treinamento.',
    position: new THREE.Vector3(eastWallX, floorY + 1.6, centerZ), radius: 2.5,
    onInteract: () => {
      doorOpen = !doorOpen;
      doorLeaves.forEach(({ hinge, side }) => {
        hinge.rotation.y = doorOpen ? (side < 0 ? -Math.PI / 2 : Math.PI / 2) : 0;
      });
      if (doorOpen) {
        for (const item of closedDoorColliders) {
          const index = colliders.indexOf(item);
          if (index >= 0) colliders.splice(index, 1);
        }
        closedDoorColliders.length = 0;
      } else {
        for (const side of [-1, 1]) {
          const item = {
            minX: eastWallX - 0.12, maxX: eastWallX + 0.12,
            minY: floorY, maxY: floorY + 3.65,
            minZ: side < 0 ? centerZ - openingHalf : centerZ,
            maxZ: side < 0 ? centerZ : centerZ + openingHalf
          };
          colliders.push(item); closedDoorColliders.push(item);
        }
      }
      return doorOpen ? 'As portas se abriram.' : 'As portas se fecharam.';
    }
  });

  function onWeaponUse({ weapon: weaponName, position, forward, zone }) {
    if (zone !== 'training') return null;
    if (shabtiActive) {
      const nearest = shabtiWarriors
        .filter(state => state.active)
        .map(state => ({ state, distance: position.distanceTo(state.group.position) }))
        .sort((a, b) => a.distance - b.distance)[0];
      if (nearest && nearest.distance < 3.9) {
        const direction = nearest.state.group.position.clone().sub(position).setY(0).normalize();
        const aim = forward.clone().setY(0).normalize();
        if (direction.dot(aim) > -0.18) return hitShabti(nearest.state, weaponName);
        return 'Vire-se na direção do guerreiro para acertá-lo.';
      }
    }
    if (targetPracticeActive && weaponName === 'staff') {
      firePracticeOrb(position, forward);
      return 'Orbe lançado. Acerte um dos três alvos na parede oposta.';
    }
    if (weaponName === 'staff') return 'O cajado vibra com energia. Leia o quadro de alvos para iniciar a prática de mira.';
    return 'O khopesh está pronto. Aproxime-se do alvo ou do guerreiro shabti.';
  }

  function update(time, dt, playerPosition, forward) {
    let message = null;
    latestPlayerPosition.copy(playerPosition);
    latestForward.copy(forward).setY(0).normalize();
    playerInvulnerability = Math.max(0, playerInvulnerability - dt);
    if (ballHeld) {
      const dir = forward.clone().setY(0).normalize();
      ball.position.copy(playerPosition).add(new THREE.Vector3(0, 1.12, 0)).addScaledVector(dir, 0.72);
      ball.rotation.x += dt * 1.2;
      ball.rotation.z += dt * 0.8;
    } else if (ballVelocity.lengthSq() > 0.02) {
      const previousZ = ball.position.z;
      ballVelocity.y -= 9.81 * dt;
      ball.position.addScaledVector(ballVelocity, dt);
      ballAge += dt;
      // Rebote no piso e nos limites interiores da quadra.
      if (ball.position.y < floorY + ballRadius) {
        ball.position.y = floorY + ballRadius;
        if (Math.abs(ballVelocity.y) > 0.75) ballVelocity.y *= -0.62;
        else ballVelocity.y = 0;
        ballVelocity.x *= 0.82; ballVelocity.z *= 0.82;
      }
      if (ball.position.x < room.minX + 0.7 || ball.position.x > room.maxX - 0.7) ballVelocity.x *= -0.76;
      if (ball.position.z < room.minZ + 0.7 || ball.position.z > room.maxZ - 0.7) ballVelocity.z *= -0.76;
      ball.position.x = THREE.MathUtils.clamp(ball.position.x, room.minX + 0.7, room.maxX - 0.7);
      ball.position.z = THREE.MathUtils.clamp(ball.position.z, room.minZ + 0.7, room.maxZ - 0.7);
      ballVelocity.multiplyScalar(Math.max(0, 1 - dt * 0.13));
      // O arremesso de basquete também pode derrubar um shabti, como no exercício do livro.
      let ballHitShabti=false;
      for(const state of shabtiWarriors){
        if(!state.active||state.spawnProgress<.92)continue;
        const head=state.group.position.clone().add(new THREE.Vector3(0,1.92*state.fullScale,0));
        if(ball.position.distanceTo(head)<.31){
          message=completeShabti(state,'A bola acertou a cabeça do shabti. Ele perdeu o equilíbrio e se quebrou em faiança.');
          ballHitShabti=true;ballVelocity.multiplyScalar(-.18);ballVelocity.y=Math.max(1.4,Math.abs(ballVelocity.y)*.35);break;
        }
      }
      // O disco solar fica vertical, voltado para a quadra. A bola precisa cruzar seu plano em Z,
      // com o centro dentro da abertura circular no plano X/Y (45 cm livres menos o raio da bola).
      for (const hoop of hoops) {
        const crossedPlane=hoop.approachDirection<0
          ? previousZ>hoop.position.z&&ball.position.z<=hoop.position.z&&ballVelocity.z<0
          : previousZ<hoop.position.z&&ball.position.z>=hoop.position.z&&ballVelocity.z>0;
        const radialDistance=Math.hypot(ball.position.x-hoop.position.x,ball.position.y-hoop.position.y);
        if(!ballHitShabti&&crossedPlane&&radialDistance<0.105){
          baskets += 1; drawScoreboard(baskets, targetHits, targetPracticeActive);
          message = 'Cesta! A bola atravessou o disco solar de Rá. Total: ' + baskets + '.';
          ballVelocity.multiplyScalar(0.28);
          break;
        }
      }
      if (ballAge > 28 || ball.position.y < floorY + ballRadius + 0.01 && ballVelocity.length() < 0.35) {
        ballVelocity.set(0, 0, 0);
      }
    }
    for (const projectile of projectiles) {
      projectile.mesh.position.addScaledVector(projectile.velocity, dt);
      projectile.trail.position.copy(projectile.mesh.position);
      projectile.life += dt;
      let hit = false;
      for (const target of targets) {
        if (projectile.mesh.position.distanceTo(target.position) < 0.82) {
          targetHits += 1; target.hitUntil = time + 0.6; hit = true;
          drawScoreboard(baskets, targetHits, targetPracticeActive);
          message = 'Alvo atingido! Pontuação de mira: ' + targetHits + '.';
          break;
        }
      }
      if (hit || projectile.life > 2.0) {
        scene.remove(projectile.mesh); scene.remove(projectile.trail);
        projectile.mesh.geometry.dispose();
        projectile.mesh.material.dispose();
        projectiles.splice(projectiles.indexOf(projectile), 1);
        break;
      }
    }
    for (const state of shabtiWarriors) {
      if (state.active) {
        // Invocação visível: a miniatura cresce dentro de uma coluna de luz.
        if (state.spawnProgress < 1) {
          state.spawnProgress = Math.min(1, state.spawnProgress + dt * 0.72);
          const t=state.spawnProgress, eased=t*t*(3-2*t);
          state.group.scale.setScalar(THREE.MathUtils.lerp(state.miniScale,state.fullScale,eased));
          state.aura.position.copy(state.group.position);
          state.aura.visible=t<1; state.aura.rotation.y=time*0.7+state.index;
          state.aura.scale.setScalar(0.82+Math.sin(time*5+state.index)*0.08);
          state.beamMat.opacity=0.20*(1-t);
          if(t>=1){state.group.traverse(obj=>{if(obj.userData?.miniatureOnly)obj.visible=false;});state.aura.visible=false;}
        }
        const enemyPosition=state.group.position;
        const dx=playerPosition.x-enemyPosition.x, dz=playerPosition.z-enemyPosition.z;
        const distance=Math.hypot(dx,dz), faceYaw=Math.atan2(dx,dz);
        state.group.rotation.y=faceYaw;
        state.swordArm.rotation.set(0,0,0); state.shieldArm.rotation.set(0,0,0);
        state.leftLeg.rotation.set(0,0,0); state.rightLeg.rotation.set(0,0,0); state.group.rotation.x=0;
        if(state.hitAt>0){
          state.hitAt=Math.max(0,state.hitAt-dt);
          const recoil=Math.sin((state.hitAt/.48)*Math.PI);
          state.group.rotation.z=recoil*.16; state.swordArm.rotation.x=-.75*recoil;
          if(state.hitAt<=0){state.group.rotation.z=0;state.aiState='approach';state.attackCooldown=Math.max(state.attackCooldown,.4);}
        } else if(state.aiState==='stumble'){
          state.stumbleTimer=Math.max(0,state.stumbleTimer-dt);
          const toTarget=state.stumbleTarget.clone().sub(enemyPosition).setY(0);
          const remaining=toTarget.length();
          if(remaining>.18){
            toTarget.normalize(); const step=Math.min(remaining,state.stumbleSpeed*dt); enemyPosition.addScaledVector(toTarget,step);
            state.group.rotation.y=Math.atan2(toTarget.x,toTarget.z); state.group.rotation.z=Math.sin(time*22+state.index)*.12;
            const stride=Math.sin(time*15+state.index)*.68;
            state.leftLeg.rotation.z=stride; state.rightLeg.rotation.z=-stride;
            state.swordArm.rotation.x=-.45+Math.sin(time*18)*.26; state.shieldArm.rotation.x=.3+Math.cos(time*17)*.18;
          } else {
            state.group.rotation.x=-.24;state.group.rotation.z=Math.sin(time*24)*.1;
            state.swordArm.rotation.x=-1.1;state.shieldArm.rotation.x=.45;
            message=completeShabti(state,'O shabti errou o golpe, bateu de cabeça na parede e se desfez em fragmentos de faiança.');
          }
          if(state.stumbleTimer<=0&&state.active)message=completeShabti(state,'O shabti perdeu o equilíbrio e se despedaçou ao atingir a parede.');
        } else if(state.aiState==='approach'){
          if(distance>2.25&&state.spawnProgress>=1){
            const step=Math.min(distance-1.95,state.moveSpeed*dt);
            if(distance>.001){
              const nextX=enemyPosition.x+(dx/distance)*step,nextZ=enemyPosition.z+(dz/distance)*step;
              let blocked=false;
              for(const other of shabtiWarriors){if(other===state||!other.active)continue;if(Math.hypot(nextX-other.group.position.x,nextZ-other.group.position.z)<1.0){blocked=true;break;}}
              if(!blocked){enemyPosition.x=THREE.MathUtils.clamp(nextX,room.minX+1.05,room.maxX-1.05);enemyPosition.z=THREE.MathUtils.clamp(nextZ,room.minZ+1.05,room.maxZ-1.05);}
            }
            const stride=Math.sin(time*9+state.index)*.34;state.leftLeg.rotation.z=stride;state.rightLeg.rotation.z=-stride;
            state.swordArm.rotation.x=-.12+Math.sin(time*9+state.index)*.11;state.shieldArm.rotation.x=.12;
            state.group.position.y=floorY+Math.abs(Math.sin(time*9+state.index))*.035;
          } else if(distance<=2.25&&state.attackCooldown<=0&&state.spawnProgress>=1){state.aiState='windup';state.windup=.72;state.strikeResolved=false;}
          else state.attackCooldown=Math.max(0,state.attackCooldown-dt);
        } else if(state.aiState==='windup'){
          state.windup=Math.max(0,state.windup-dt);state.group.rotation.x=-.08;
          state.swordArm.rotation.x=-1.02-Math.sin(time*18)*.07;state.shieldArm.rotation.x=.58;state.group.rotation.z=-.08;
          if(state.windup<=0){state.aiState='strike';state.strike=.42;state.strikeResolved=false;}
        } else if(state.aiState==='strike'){
          state.strike=Math.max(0,state.strike-dt);const phase=1-state.strike/.42;
          state.swordArm.rotation.x=-1.05+1.8*Math.sin(Math.min(1,phase)*Math.PI/2);state.shieldArm.rotation.x=.62;
          state.group.rotation.x=-.12+.08*Math.sin(phase*Math.PI);
          if(!state.strikeResolved&&state.strike<.25){
            state.strikeResolved=true;
            if(distance<2.8&&playerInvulnerability<=0){
              playerHealth=Math.max(0,playerHealth-1);playerInvulnerability=1.35;
              message='O guerreiro shabti acertou Carter. Vitalidade: '+playerHealth+'/'+maxPlayerHealth+'.';
              if(playerHealth<=0){
                shabtiActive=false;shabtiRemaining=0;
                for(const warrior of shabtiWarriors){if(warrior.active){warrior.active=false;warrior.defeated=true;warrior.defeatTime=2.4;removeShabtiCollider(warrior);}}
                playerHealth=maxPlayerHealth;message='A prova foi interrompida. Os shabtis encolheram; aproxime-se do quadro para tentar novamente.';
              }
            }
          }
          if(state.strike<=0){state.aiState='recover';state.attackCooldown=1.15;state.group.rotation.x=0;state.group.rotation.z=0;}
        } else if(state.aiState==='recover'){
          state.attackCooldown=Math.max(0,state.attackCooldown-dt);state.swordArm.rotation.x=-.18;state.shieldArm.rotation.x=.2;
          if(state.attackCooldown<=0)state.aiState='approach';
        }
        if(state.collider){
          state.collider.minX=enemyPosition.x-.48*state.fullScale;state.collider.maxX=enemyPosition.x+.48*state.fullScale;
          state.collider.minY=floorY;state.collider.maxY=floorY+2.35*state.fullScale;
          state.collider.minZ=enemyPosition.z-.46*state.fullScale;state.collider.maxZ=enemyPosition.z+.46*state.fullScale;
        }
      } else {state.group.rotation.x*=.82;state.group.rotation.z*=.82;}
      if(state.defeatTime>0){
        state.defeatTime=Math.max(0,state.defeatTime-dt);const collapse=1-state.defeatTime/2.4,reverse=collapse*collapse*(3-2*collapse);
        state.group.scale.setScalar(THREE.MathUtils.lerp(state.fullScale,state.miniScale,reverse));
        if(state.defeatTime<=0){
          state.group.visible=true;state.group.position.copy(state.origin);state.group.rotation.set(0,0,0);state.group.scale.setScalar(state.miniScale);
          state.spawnProgress=1;state.aura.visible=false;state.swordArm.rotation.set(0,0,0);state.shieldArm.rotation.set(0,0,0);
          state.leftLeg.rotation.set(0,0,0);state.rightLeg.rotation.set(0,0,0);
          state.group.traverse(obj=>{if(obj.userData?.miniatureOnly)obj.visible=true;});
        }
      }
    }
    for (const target of targets) {
      const glowing = target.hitUntil > time;
      target.glow.material = glowing ? whiteGlow : warmEmissive;
      target.group.scale.y = 1 + (glowing ? Math.sin(time * 32) * 0.04 : 0);
    }
    return message;
  }

  // Placas de identificação discretas nas entradas, sem transformar a quadra em museu.
  function addWallLabel(text, x, y, z, rotationY = 0) {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 128;
    const g = canvas.getContext('2d');
    g.fillStyle = '#182a31'; g.fillRect(0, 0, 512, 128);
    g.strokeStyle = '#bd9656'; g.lineWidth = 6; g.strokeRect(5, 5, 502, 118);
    g.fillStyle = '#ead8b2'; g.font = 'bold 34px Georgia'; g.textAlign = 'center';
    g.fillText(text, 256, 78);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const plaque = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 0.72), new THREE.MeshBasicMaterial({ map: texture }));
    plaque.position.set(x, y, z); plaque.rotation.y = rotationY; scene.add(plaque);
  }
  addWallLabel('SALA DE TREINAMENTO', centerX, floorY + 3.0, room.maxZ - 0.02, Math.PI);
  addWallLabel('MAGIC PROBLEM-SOLVING 101', centerX, floorY + 3.0, room.minZ + 0.02, 0);

  // Interações de inspeção do próprio ambiente.
  addInteractable({
    name: 'Abóbada pintada', label: 'Afrescos da abóbada',
    description: 'A abóbada reúne um programa visual egípcio: barca solar, discos, papiros, símbolos e faixas ornamentais.',
    position: new THREE.Vector3(centerX, springY + 3.2, centerZ), radius: 4.5
  });

  return {
    walkablePlatforms,
    zonePortals,
    onWeaponUse,
    update,
    getStatus() {
      return {
        challengeActive: shabtiActive,
        targetPracticeActive,
        playerHealth,
        maxPlayerHealth,
        shabtiRemaining,
        totalShabti: shabtiWarriors.length,
        baskets,
        targetHits
      };
    }
  };
}

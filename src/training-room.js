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
  const limestone = new THREE.MeshStandardMaterial({ color: 0xc6b692, roughness: 0.86 });
  const limestoneShade = new THREE.MeshStandardMaterial({ color: 0x8f8065, roughness: 0.92 });
  const lapis = new THREE.MeshStandardMaterial({ color: 0x244d67, metalness: 0.34, roughness: 0.3 });
  const turquoise = new THREE.MeshStandardMaterial({ color: 0x397d7c, metalness: 0.28, roughness: 0.34 });
  const clay = new THREE.MeshStandardMaterial({ color: 0x9b6245, roughness: 0.92 });
  const clayLight = new THREE.MeshStandardMaterial({ color: 0xc1845d, roughness: 0.86 });
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
    c.fillStyle = '#62452d'; c.fillRect(0, 0, w, h);
    b.fillStyle = '#888888'; b.fillRect(0, 0, w, h);
    const plankH = 84;
    for (let row = 0; row < 12; row++) {
      const offset = row % 2 ? 122 : 0;
      for (let col = -1; col < 7; col++) {
        const x = col * 250 + offset;
        const variation = random();
        const rr = Math.round(91 + variation * 35);
        const gg = Math.round(59 + variation * 25);
        const bb = Math.round(35 + variation * 18);
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
    map.repeat.set(1.05, 1.25);
    bump.repeat.copy(map.repeat);
    map.anisotropy = bump.anisotropy = 8;
    return { map, bump };
  }
  const floorMaps = makeWoodMaps();
  floor.material = new THREE.MeshStandardMaterial({
    map: floorMaps.map, bumpMap: floorMaps.bump, bumpScale: 0.055,
    roughness: 0.4, metalness: 0.025
  });

  // Linhas de quadra embutidas na madeira, com dimensões aproximadas de uma quadra real.
  const courtHalfWidth = 7.5; // Quadra regulamentar: 15 m de largura (FIBA 2026).
  const courtHalfLength = 14.0; // Quadra regulamentar: 28 m de comprimento (FIBA 2026).
  const courtZ0 = centerZ;
  const courtX0 = centerX;
  function courtLine(points, name = 'marcação de quadra') {
    return addTube(name, points, 0.035, paintedLine, scene, 72);
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
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xb9a986, roughness: 0.9 });
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
  }

  // Arandelas e iluminação quente controlada; sem centenas de luzes dinâmicas.
  function addSconce(x, z, rotationY = Math.PI / 2) {
    const group = new THREE.Group();
    group.position.set(x, floorY + 2.45, z);
    group.rotation.y = rotationY;
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.72, 0.48), darkBronze);
    plate.position.z = -0.1; group.add(plate);
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.22, 0.16, 24), bronze);
    cup.position.set(0, -0.08, 0.22); group.add(cup);
    const flame = new THREE.Mesh(new THREE.SphereGeometry(0.11, 18, 14), warmEmissive);
    flame.scale.set(0.72, 1.55, 0.72); flame.position.set(0, 0.18, 0.22); group.add(flame);
    scene.add(group);
    const light = new THREE.PointLight(0xffbe78, 0.82, 8.5, 1.8);
    light.position.set(x, floorY + 2.62, z);
    scene.add(light);
    animated.push({ obj: flame, fire: true, phase: (x + z) * 0.4, baseY: flame.position.y, baseScaleY: flame.scale.y, baseRotationZ: 0 });
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
  function addWallDeity(x, z, name, facing) {
    const group = new THREE.Group();
    group.position.set(x, floorY + 1.45, z);
    group.rotation.y = facing;
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.22, 0.52), limestoneShade);
    plinth.position.y = -1.18; group.add(plinth);
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.48, 0.95, 32, 1), limestone);
    torso.position.y = -0.58; group.add(torso);
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.1, 12, 36), bronze);
    collar.position.y = -0.2; collar.rotation.x = Math.PI / 2; group.add(collar);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.36, 32, 24), limestone);
    head.position.y = 0.22; head.scale.set(0.88, 1.1, 0.85); group.add(head);
    const headdress = new THREE.Mesh(new THREE.SphereGeometry(0.43, 32, 18), lapis);
    headdress.position.set(0, 0.28, -0.06); headdress.scale.set(1.2, 1.1, 0.86); group.add(headdress);
    for (const eyeX of [-0.13, 0.13]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 10), darkBronze);
      eye.position.set(eyeX, 0.25, 0.29); group.add(eye);
    }
    const namePlate = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.34), bronze);
    namePlate.position.set(0, -1.15, 0.28); group.add(namePlate);
    group.traverse(obj => { if (obj.isMesh) { obj.castShadow = true; obj.receiveShadow = true; } });
    scene.add(group);
    addInteractable({
      name: 'Busto de ' + name, label: name + ' — efígie da sala',
      description: 'Busto decorativo de ' + name + ', criado como interpretação da galeria de divindades da sala.',
      position: group.position, radius: 2.1
    });
  }
  addWallDeity(westWallX + 0.72, -9.4, 'Anúbis', Math.PI / 2);
  addWallDeity(westWallX + 0.72, -1.0, 'Sekhmet', Math.PI / 2);
  addWallDeity(westWallX + 0.72, 7.8, 'Hórus', Math.PI / 2);
  addWallDeity(eastWallX - 0.72, -9.4, 'Ísis', -Math.PI / 2);
  addWallDeity(eastWallX - 0.72, 7.8, 'Bastet', -Math.PI / 2);

  // Efígies de Rá: cabeças de falcão, discos solares vazados e redes de aro.
  const hoops = [];
  function addRaHoop(baselineZ, facing, name) {
    const group = new THREE.Group();
    group.position.set(centerX, floorY + 1.95, baselineZ);
    group.rotation.y = facing;
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.42, 0.9), limestoneShade);
    plinth.position.set(0, -1.28, -0.08); group.add(plinth);
    const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.72, 1.1, 32, 1), limestone);
    chest.position.set(0, -0.72, -0.08); group.add(chest);
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.115, 12, 40), bronze);
    collar.position.set(0, -0.35, 0.25); collar.rotation.x = Math.PI / 2; group.add(collar);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.39, 32, 24), limestone);
    head.position.set(0, 0.16, 0.13); head.scale.set(0.88, 1.12, 1.0); group.add(head);
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.62, 24), bronze);
    beak.rotation.x = -Math.PI / 2; beak.position.set(0, 0.02, 0.58); group.add(beak);
    const nemes = new THREE.Mesh(new THREE.SphereGeometry(0.48, 32, 20), lapis);
    nemes.scale.set(1.2, 1.28, 0.82); nemes.position.set(0, 0.27, -0.1); group.add(nemes);
    for (const side of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 12), turquoise);
      eye.position.set(side * 0.25, 0.2, 0.43); group.add(eye);
      const eyeLine = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.022, 8, 24), darkBronze);
      eyeLine.position.set(side * 0.25, 0.2, 0.43); group.add(eyeLine);
    }
    // Disco solar: el aro central se deja hueco para funcionar como cesta.
    const rimY = 1.1;
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.075, 14, 64), bronze);
    rim.position.set(0, rimY, 0.82); rim.rotation.x = Math.PI / 2; group.add(rim);
    const sunRays = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.035, 8, 64), darkBronze);
    sunRays.position.set(0, rimY, 0.82); sunRays.rotation.x = Math.PI / 2; group.add(sunRays);
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI * 2;
      const ray = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.28, 12), bronze);
      ray.position.set(Math.cos(a) * 0.69, rimY, 0.82 + Math.sin(a) * 0.69);
      ray.rotation.z = Math.PI / 2 - a;
      group.add(ray);
    }
    const lowerNetRing = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.027, 8, 40), darkBronze);
    lowerNetRing.position.set(0, rimY - 0.62, 0.82); lowerNetRing.rotation.x = Math.PI / 2; group.add(lowerNetRing);
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI * 2;
      addTube('corda da rede da cesta solar', [
        [Math.cos(a) * 0.55, rimY - 0.02, 0.82 + Math.sin(a) * 0.55],
        [Math.cos(a + 0.1) * 0.42, rimY - 0.33, 0.82 + Math.sin(a + 0.1) * 0.42],
        [Math.cos(a + 0.16) * 0.31, rimY - 0.62, 0.82 + Math.sin(a + 0.16) * 0.31]
      ], 0.018, limestoneShade, group, 12);
    }
    group.traverse(obj => { if (obj.isMesh) { obj.castShadow = true; obj.receiveShadow = true; } });
    scene.add(group);
    const hoopPosition = new THREE.Vector3(centerX, floorY + 1.95 + rimY, baselineZ + (facing === 0 ? 0.82 : -0.82));
    hoops.push({ position: hoopPosition, label: name });
    addInteractable({
      name, label: 'Cesta solar de Rá',
      description: 'Efígie de Rá com cabeça de falcão. O disco solar vazado foi adaptado como cesta de basquete.',
      position: group.position, radius: 2.4
    });
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
    scoreCtx.font = 'bold 25px Georgia'; scoreCtx.fillText('BROOKLYN HOUSE  ·  TRAINING', 320, 48);
    scoreCtx.font = 'bold 58px Georgia'; scoreCtx.fillText('CESTAS  ' + String(baskets).padStart(2, '0'), 195, 125);
    scoreCtx.font = 'bold 42px Georgia'; scoreCtx.fillText('ALVOS  ' + String(targetHits).padStart(2, '0'), 480, 125);
    if (active) { scoreCtx.font = 'bold 18px Georgia'; scoreCtx.fillStyle = '#f4b765'; scoreCtx.fillText('PRÁTICA ATIVA', 320, 157); }
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
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.23, 40, 32), ballMaterial);
  ball.name = 'bola de basquete interativa';
  ball.position.set(centerX - 1.5, floorY + 0.24, centerZ - 2.2);
  ball.castShadow = true; ball.receiveShadow = true; scene.add(ball);
  const seamMaterial = new THREE.MeshStandardMaterial({ color: 0x211812, roughness: 0.9 });
  const seamA = new THREE.Mesh(new THREE.TorusGeometry(0.231, 0.009, 6, 80), seamMaterial);
  seamA.name = 'costura da bola'; seamA.rotation.x = Math.PI / 2; ball.add(seamA);
  const seamB = new THREE.Mesh(new THREE.TorusGeometry(0.231, 0.009, 6, 80), seamMaterial);
  seamB.name = 'costura da bola'; seamB.rotation.y = Math.PI / 2; ball.add(seamB);
  const seamC = new THREE.Mesh(new THREE.TorusGeometry(0.231, 0.009, 6, 80), seamMaterial);
  seamC.name = 'costura da bola'; seamC.rotation.z = Math.PI / 2; ball.add(seamC);
  const ballVelocity = new THREE.Vector3();
  let ballHeld = false, lastBallZ = ball.position.z, ballAge = 0;
  const latestPlayerPosition = new THREE.Vector3(centerX, floorY, centerZ);
  const latestForward = new THREE.Vector3(0, 0, -1);
  addInteractable({
    name: 'Bola de basquete', label: 'Bola de basquete',
    description: 'Uma bola de couro está no piso. Aproxime-se e pressione E/INTERAGIR para pegá-la; pressione novamente para arremessar.',
    position: ball.position, radius: 2.1,
    onInteract: () => {
      if (!ballHeld) {
        ballHeld = true; ballVelocity.set(0, 0, 0);
        return 'Bola recolhida. Pressione E/INTERAGIR novamente para arremessar na direção da câmera.';
      }
      ballHeld = false; ballAge = 0; lastBallZ = ball.position.z;
      ballVelocity.copy(latestForward).setY(0).normalize();
      if (ballVelocity.lengthSq() < 0.1) ballVelocity.set(0, 0, -1);
      ballVelocity.multiplyScalar(11.5);
      ballVelocity.y = 6.1;
      return 'Arremesso! Tente acertar o disco solar de Rá.';
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
  ng.fillText('TARGET PRACTICE', 256, 72);
  ng.font = '26px Georgia'; ng.fillText('STAFF / MAGIC', 256, 132);
  ng.fillText('Press E to begin', 256, 208);
  ng.font = '22px Georgia'; ng.fillText('Three marked targets', 256, 286);
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

  // Guerreiros shabti de barro: prova de Magic Problem-Solving 101 / Whatever Works.
  const shabti = new THREE.Group();
  shabti.name = 'guerreiro shabti de barro';
  shabti.position.set(centerX, floorY, centerZ - 2.3);
  const shabtiParts = [];
  function addShabtiMesh(geometry, material, position, scale) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position[0], position[1], position[2]);
    if (scale) mesh.scale.set(scale[0], scale[1], scale[2]);
    mesh.castShadow = true; mesh.receiveShadow = true;
    shabti.add(mesh); shabtiParts.push(mesh);
    return mesh;
  }
  addShabtiMesh(new THREE.CylinderGeometry(0.42, 0.55, 1.1, 32, 2), clay, [0, 1.05, 0], [1, 1, 0.82]);
  addShabtiMesh(new THREE.SphereGeometry(0.39, 32, 24), clayLight, [0, 1.83, 0.04], [0.9, 1.12, 0.86]);
  addShabtiMesh(new THREE.SphereGeometry(0.48, 28, 20), lapis, [0, 1.91, -0.13], [1.12, 0.87, 0.88]);
  addShabtiMesh(new THREE.BoxGeometry(0.76, 0.15, 0.12), bronze, [0, 1.42, 0.34]);
  const eyeLeft = addShabtiMesh(new THREE.SphereGeometry(0.055, 14, 10), darkBronze, [-0.14, 1.86, 0.37]);
  const eyeRight = addShabtiMesh(new THREE.SphereGeometry(0.055, 14, 10), darkBronze, [0.14, 1.86, 0.37]);
  addShabtiMesh(new THREE.ConeGeometry(0.12, 0.48, 20), bronze, [0, 1.67, 0.51], [1, 1, 0.75]);
  for (const side of [-1, 1]) {
    const arm = addShabtiMesh(new THREE.CapsuleGeometry(0.13, 0.56, 8, 16), clayLight, [side * 0.48, 1.05, 0.03]);
    arm.rotation.z = side * 0.42;
    const hand = addShabtiMesh(new THREE.SphereGeometry(0.15, 16, 12), clay, [side * 0.69, 0.72, 0.12]);
  }
  addShabtiMesh(new THREE.CylinderGeometry(0.22, 0.27, 0.7, 24), lapis, [0, 0.42, 0], [1.8, 1, 0.95]);
  addShabtiMesh(new THREE.TorusGeometry(0.42, 0.075, 10, 36), bronze, [0, 1.48, 0.02]);
  const weapon = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 1.6, 14), darkBronze);
  weapon.name = 'lança do guerreiro shabti';
  weapon.position.set(0.82, 1.15, 0.08); weapon.rotation.z = -0.35;
  weapon.castShadow = true; shabti.add(weapon); shabtiParts.push(weapon);
  const shabtiPedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.92, 0.28, 48), limestoneShade);
  shabtiPedestal.position.y = 0.14; shabtiPedestal.castShadow = true; shabti.add(shabtiPedestal);
  const seal = new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.035, 8, 64), warmEmissive);
  seal.rotation.x = Math.PI / 2; seal.position.y = 0.04; shabti.add(seal);
  scene.add(shabti);
  collidable(centerX, floorY + 1.0, centerZ - 2.3, 1.15, 2.0, 1.0);
  let shabtiActive = false, shabtiHealth = 4, shabtiHitAt = 0, shabtiDefeatAt = 0;
  shabti.visible = true;
  const problemBoard = new THREE.Group();
  problemBoard.name = 'quadro da aula Whatever Works';
  problemBoard.position.set(westWallX + 0.48, floorY + 2.0, 11.2);
  problemBoard.rotation.y = Math.PI / 2;
  const problemBack = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.4, 3.1), darkBronze);
  problemBoard.add(problemBack);
  const paperCanvas = document.createElement('canvas');
  paperCanvas.width = 768; paperCanvas.height = 512;
  const pg = paperCanvas.getContext('2d');
  pg.fillStyle = '#e4d1a6'; pg.fillRect(0, 0, 768, 512);
  pg.strokeStyle = '#765431'; pg.lineWidth = 16; pg.strokeRect(10, 10, 748, 492);
  pg.fillStyle = '#332a20'; pg.textAlign = 'center'; pg.font = 'bold 52px Georgia';
  pg.fillText('MAGIC PROBLEM-SOLVING 101', 384, 108);
  pg.font = 'bold 66px Georgia'; pg.fillText('WHATEVER WORKS', 384, 222);
  pg.font = '34px Georgia'; pg.fillText('Defeat the clay shabti warrior', 384, 322);
  pg.font = '28px Georgia'; pg.fillText('The lesson ends when you solve it', 384, 397);
  const paperTexture = new THREE.CanvasTexture(paperCanvas);
  paperTexture.colorSpace = THREE.SRGBColorSpace;
  const problemFace = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 1.92), new THREE.MeshBasicMaterial({ map: paperTexture }));
  problemFace.position.z = 0.085; problemBoard.add(problemFace);
  scene.add(problemBoard);
  addInteractable({
    name: 'Quadro da aula Magic Problem-Solving 101', label: 'Whatever Works — prova prática',
    description: 'O quadro apresenta uma prova: resolver o problema proposto pelo instrutor, aqui representado por um guerreiro shabti de barro.',
    position: problemBoard.position, radius: 2.5,
    onInteract: () => {
      if (shabtiActive) return 'A prova já está em andamento. Use o cajado ou o khopesh e pressione F/USAR perto do guerreiro.';
      shabtiActive = true; shabtiHealth = 4; shabti.visible = true; shabtiDefeatAt = 0;
      shabti.scale.setScalar(1);
      return 'Prova iniciada! O guerreiro shabti despertou. Derrote-o com o cajado ou o khopesh.';
    }
  });
  addInteractable({
    name: 'Guerreiro shabti de barro', label: 'Guerreiro shabti',
    description: 'Uma figura mumiforme de barro, com faixa azul, colar de bronze e arma cerimonial. Parece inerte.',
    position: shabti.position, radius: 2.3,
    onInteract: () => {
      if (!shabtiActive) return 'O shabti está inerte. Leia o quadro da aula para iniciar a prova.';
      return 'Guerreiro shabti ativo. Energia restante: ' + shabtiHealth + '. Use uma arma de perto.';
    }
  });

  let shabtiFlash = 0;
  function hitShabti(weaponName) {
    if (!shabtiActive) return null;
    shabtiHealth -= 1;
    shabtiHitAt = 0.42;
    shabtiFlash = 0.3;
    if (shabtiHealth <= 0) {
      shabtiActive = false;
      shabtiDefeatAt = 5.5;
      return 'Prova concluída! O guerreiro shabti desmoronou. Você resolveu o desafio.';
    }
    return (weaponName === 'staff' ? 'O cajado atingiu o shabti. ' : 'O khopesh atingiu o shabti. ')
      + 'Restam ' + shabtiHealth + ' golpes para concluir a prova.';
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
            minZ: centerZ + side * (openingHalf / 2), maxZ: centerZ + side * (openingHalf / 2) + (side < 0 ? openingHalf : -openingHalf)
          };
          if (item.minZ > item.maxZ) [item.minZ, item.maxZ] = [item.maxZ, item.minZ];
          colliders.push(item); closedDoorColliders.push(item);
        }
      }
      return doorOpen ? 'As portas se abriram.' : 'As portas se fecharam.';
    }
  });

  function onWeaponUse({ weapon: weaponName, position, forward, zone }) {
    if (zone !== 'training') return null;
    if (targetPracticeActive && weaponName === 'staff') {
      firePracticeOrb(position, forward);
      return 'Orbe lançado. Acerte um dos três alvos na parede oposta.';
    }
    if (shabtiActive && position.distanceTo(shabti.position) < 3.9) {
      const direction = shabti.position.clone().sub(position).setY(0).normalize();
      const aim = forward.clone().setY(0).normalize();
      if (direction.dot(aim) > -0.18) return hitShabti(weaponName);
      return 'Vire-se na direção do guerreiro para acertá-lo.';
    }
    if (weaponName === 'staff') return 'O cajado vibra com energia. Leia o quadro de alvos para iniciar a prática de mira.';
    return 'O khopesh está pronto. Aproxime-se do alvo ou do guerreiro shabti.';
  }

  function update(time, dt, playerPosition, forward) {
    let message = null;
    latestPlayerPosition.copy(playerPosition);
    latestForward.copy(forward).setY(0).normalize();
    if (ballHeld) {
      const dir = forward.clone().setY(0).normalize();
      ball.position.copy(playerPosition).add(new THREE.Vector3(0, 1.35, 0)).addScaledVector(dir, 0.9);
      ball.rotation.x += dt * 1.2;
      ball.rotation.z += dt * 0.8;
    } else if (ballVelocity.lengthSq() > 0.02) {
      const previousZ = ball.position.z;
      ballVelocity.y -= 9.81 * dt;
      ball.position.addScaledVector(ballVelocity, dt);
      ballAge += dt;
      // Rebote no piso e nos limites interiores da quadra.
      if (ball.position.y < floorY + 0.23) {
        ball.position.y = floorY + 0.23;
        if (Math.abs(ballVelocity.y) > 0.75) ballVelocity.y *= -0.62;
        else ballVelocity.y = 0;
        ballVelocity.x *= 0.82; ballVelocity.z *= 0.82;
      }
      if (ball.position.x < room.minX + 0.7 || ball.position.x > room.maxX - 0.7) ballVelocity.x *= -0.76;
      if (ball.position.z < room.minZ + 0.7 || ball.position.z > room.maxZ - 0.7) ballVelocity.z *= -0.76;
      ball.position.x = THREE.MathUtils.clamp(ball.position.x, room.minX + 0.7, room.maxX - 0.7);
      ball.position.z = THREE.MathUtils.clamp(ball.position.z, room.minZ + 0.7, room.maxZ - 0.7);
      ballVelocity.multiplyScalar(Math.max(0, 1 - dt * 0.13));
      // Passagem da bola pelo plano do aro solar.
      for (const hoop of hoops) {
        const crossed = (previousZ - hoop.position.z) * (ball.position.z - hoop.position.z) <= 0;
        if (crossed && Math.abs(ball.position.x - hoop.position.x) < 0.34 && Math.abs(ball.position.y - hoop.position.y) < 0.34) {
          baskets += 1; drawScoreboard(baskets, targetHits, targetPracticeActive);
          message = 'Cesta! A bola atravessou o disco solar de Rá. Total: ' + baskets + '.';
          ballVelocity.multiplyScalar(0.28);
          break;
        }
      }
      lastBallZ = ball.position.z;
      if (ballAge > 28 || ball.position.y < floorY + 0.24 && ballVelocity.length() < 0.35) {
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
    if (shabtiHitAt > 0) {
      shabtiHitAt = Math.max(0, shabtiHitAt - dt);
      shabti.rotation.z = Math.sin(time * 38) * shabtiHitAt * 0.55;
    } else if (shabtiActive) {
      shabti.rotation.z = Math.sin(time * 2.2) * 0.035;
      shabti.position.y = floorY + Math.sin(time * 3.2) * 0.045;
    } else {
      shabti.rotation.z *= 0.86;
      shabti.position.y = floorY;
    }
    if (shabtiFlash > 0) shabtiFlash = Math.max(0, shabtiFlash - dt);
    if (shabtiDefeatAt > 0) {
      shabtiDefeatAt = Math.max(0, shabtiDefeatAt - dt);
      if (shabtiDefeatAt === 0) {
        shabti.visible = true;
        shabti.scale.setScalar(1);
        shabtiHealth = 4;
      } else if (shabtiDefeatAt < 4.7) {
        shabti.scale.setScalar(Math.max(0.02, shabtiDefeatAt / 4.7));
        shabti.visible = shabtiDefeatAt > 0.25;
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
    update
  };
}

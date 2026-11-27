import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
// Brooklyn House — Sala de Treinamento
// Reconstrução 3D jogável: quadra de madeira, abóbada pintada, efígies de Rá/cestas,
// guerreiros shabti e prática de magia. Layout e vários acabamentos são interpretativos.
export function buildTrainingRoom({
  THREE, scene, zones, groundSurfaces, colliders, interactables, animated,
  onPlayerHit = () => {}
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
  const faienceCanvas=document.createElement('canvas');faienceCanvas.width=faienceCanvas.height=512;
  const faienceCtx=faienceCanvas.getContext('2d');
  const faienceGrad=faienceCtx.createLinearGradient(0,0,512,512);
  faienceGrad.addColorStop(0,'#287a79');faienceGrad.addColorStop(.48,'#5b9b91');faienceGrad.addColorStop(1,'#2c666e');
  faienceCtx.fillStyle=faienceGrad;faienceCtx.fillRect(0,0,512,512);
  let faienceSeed=76123;const faienceRand=()=>{faienceSeed=(faienceSeed*1664525+1013904223)>>>0;return faienceSeed/4294967296;};
  for(let i=0;i<6200;i++){
    const x=faienceRand()*512,y=faienceRand()*512,r=.35+faienceRand()*2.2;
    faienceCtx.fillStyle=faienceRand()>.5?'rgba(218,231,185,.12)':'rgba(8,49,57,.13)';
    faienceCtx.beginPath();faienceCtx.arc(x,y,r,0,Math.PI*2);faienceCtx.fill();
  }
  const faienceMap=new THREE.CanvasTexture(faienceCanvas);faienceMap.colorSpace=THREE.SRGBColorSpace;
  faienceMap.wrapS=faienceMap.wrapT=THREE.RepeatWrapping;faienceMap.repeat.set(1.4,1.0);faienceMap.anisotropy=8;
  faience.map=faienceMap;faience.needsUpdate=true;

  const faienceLight = new THREE.MeshPhysicalMaterial({ color: 0xb9a16f, metalness: 0.04, roughness: 0.3, clearcoat: 0.28 });
  const clay = new THREE.MeshPhysicalMaterial({ color: 0x9d6549, roughness: 0.34, clearcoat: 0.42, clearcoatRoughness: 0.24 });
  const clayLight = new THREE.MeshPhysicalMaterial({ color: 0xd1a47a, roughness: 0.4, clearcoat: 0.28 });
  const raBasalt = new THREE.MeshPhysicalMaterial({ color: 0x20282a, metalness: 0.12, roughness: 0.28, clearcoat: 0.48, clearcoatRoughness: 0.22 });
  const raBasaltLight = new THREE.MeshPhysicalMaterial({ color: 0x343d3d, metalness: 0.1, roughness: 0.3, clearcoat: 0.38 });
  const raGold = new THREE.MeshStandardMaterial({ color: 0xc69a4e, metalness: 0.78, roughness: 0.25 });
  const raGoldLight = new THREE.MeshStandardMaterial({ color: 0xe0bb70, metalness: 0.68, roughness: 0.22 });
  const raLapis = new THREE.MeshPhysicalMaterial({ color: 0x183c59, metalness: 0.12, roughness: 0.3, clearcoat: 0.28 });
  const nicheShadow = new THREE.MeshStandardMaterial({ color: 0x625746, roughness: 0.96, metalness: 0 });
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
    // A fachada exterior recortava a sala ao nível do piso e competia com as paredes internas.
    if (obj.name === 'fachada posterior da mansão'
      || obj.name === 'fachada frontal da mansão esquerda'
      || obj.name === 'fachada frontal da mansão direita') obj.visible = false;
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
    { minX: -16.45, maxX: -12.15, minZ: centerZ - 2.25, maxZ: centerZ + 2.25, height: floorTop }
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
  const endWallMat=new THREE.MeshStandardMaterial({map:wallMaps.map,bumpMap:wallMaps.bump,bumpScale:.048,color:0xffe4b7,roughness:.92,metalness:0,side:THREE.DoubleSide,transparent:false,opacity:1,depthWrite:true,depthTest:true});
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
  const eastWallX = -15.6; // Reutiliza a parede oeste original da mansão, reconstruída uma única vez no portal.
  const wallBottom = floorY;
  const wallTop = springY + 0.08;
  const wallHeight = wallTop - wallBottom;
  addBox('parede oeste da sala de treinamento', [westWallX, wallBottom + wallHeight / 2, centerZ], [0.5, wallHeight, roomLength], wallMat, true, false);
  addBox('parede de fundo norte em calcário quente', [centerX, wallBottom + wallHeight / 2, room.minZ + 0.22], [roomWidth, wallHeight, 0.5], endWallMat, true, false);
  addBox('parede de fundo sul em calcário quente', [centerX, wallBottom + wallHeight / 2, room.maxZ - 0.22], [roomWidth, wallHeight, 0.5], endWallMat, true, false);

  // Face interna maciça e explicitamente opaca nas duas paredes atrás das efígies.
  // A placa independente evita que superfícies de ocultação da mansão ou faces invertidas
  // deixem o calcário com aparência transparente/cinza quando a câmera olha de dentro.
  const endWallFaceMap = wallMaps.map.clone();
  endWallFaceMap.wrapS = endWallFaceMap.wrapT = THREE.RepeatWrapping;
  endWallFaceMap.repeat.set(2.8, 1.5);
  endWallFaceMap.needsUpdate = true;
  // Faces de contenção usam MeshBasicMaterial: a parede não depende da luz, tone mapping
  // ou shader PBR para ocultar o exterior. A textura apenas colore a pedra; não tem alpha.
  const endWallFaceMat = new THREE.MeshBasicMaterial({
    map: endWallFaceMap,
    color: 0xffffff,
    side: THREE.DoubleSide,
    transparent: false,
    opacity: 1,
    alphaTest: 0,
    depthWrite: true,
    depthTest: true,
    toneMapped: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1
  });
  const endWallFaces = [
    { name: 'face interna opaca da parede norte — calcário', z: room.minZ + 0.22 + 0.26, rotationY: 0 },
    { name: 'face interna opaca da parede sul — calcário', z: room.maxZ - 0.22 - 0.26, rotationY: Math.PI }
  ];
  for (const wallFace of endWallFaces) {
    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(roomWidth - 0.08, wallHeight - 0.06),
      endWallFaceMat
    );
    face.name = wallFace.name;
    face.position.set(centerX, wallBottom + wallHeight / 2, wallFace.z);
    face.rotation.y = wallFace.rotationY;
    face.castShadow = false;
    face.receiveShadow = true;
    face.renderOrder = 2;
    scene.add(face);
  }

  // Frontões maciços fecham o espaço entre a linha das paredes e a abóbada.
  // Sem eles, o teto arqueado termina na linha de mola e deixa o skyline exterior visível
  // por trás das efígies de Rá. O contorno acompanha exatamente o raio da abóbada.
  const endGableShape = new THREE.Shape();
  endGableShape.moveTo(-vaultRadius, 0);
  endGableShape.lineTo(vaultRadius, 0);
  for (let i = 1; i <= 72; i++) {
    const angle = Math.PI * i / 72;
    endGableShape.lineTo(Math.cos(angle) * vaultRadius, Math.sin(angle) * vaultRadius);
  }
  endGableShape.closePath();
  const endGableGeometry = new THREE.ExtrudeGeometry(endGableShape, {
    depth: 0.5, bevelEnabled: false, steps: 1, curveSegments: 72
  });
  const endGableMaterial = new THREE.MeshBasicMaterial({
    map: endWallFaceMap,
    color: 0xffffff,
    side: THREE.DoubleSide,
    transparent: false,
    opacity: 1,
    depthWrite: true,
    depthTest: true,
    toneMapped: false
  });
  const endGables = [
    { name: 'frontão opaco norte em calcário — fechamento da abóbada', z: room.minZ - 0.03, sealZ: room.minZ + 0.22 + 0.25 + 0.02, rotationY: 0 },
    { name: 'frontão opaco sul em calcário — fechamento da abóbada', z: room.maxZ - 0.47, sealZ: room.maxZ - 0.22 - 0.25 - 0.02, rotationY: Math.PI }
  ];
  for (const endGable of endGables) {
    const gable = new THREE.Mesh(endGableGeometry, endGableMaterial);
    gable.name = endGable.name;
    gable.position.set(centerX, springY, endGable.z);
    gable.castShadow = true;
    gable.receiveShadow = true;
    gable.renderOrder = 2;
    scene.add(gable);

    // Face interna contínua e opaca do frontão, independente do volume extrudado.
    // É ligeiramente deslocada para dentro da sala para evitar face coplanar/z-fighting.
    const seal = new THREE.Mesh(new THREE.ShapeGeometry(endGableShape), endWallFaceMat);
    seal.name = endGable.name + ' — face interna selada';
    seal.position.set(centerX, springY, endGable.sealZ);
    seal.rotation.y = endGable.rotationY;
    seal.renderOrder = 4;
    seal.castShadow = false;
    seal.receiveShadow = true;
    scene.add(seal);
  }
  // A parede leste é seccionada para deixar o portal aberto.
  const openingWidth = 4.5;
  const openingHalf = openingWidth / 2;
  const openingStart = centerZ - openingHalf;
  const openingEnd = centerZ + openingHalf;
  // A parede leste já foi reconstruída por rebuildSideWall() sobre a parede original.
  // Não criar uma segunda camada de caixas coplanares: isso provocava z-fighting e cintilação.
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
  for (const sideX of [westWallX + 0.48, eastWallX - 0.75]) {
    addBox('friso de calcário gravado', [sideX, floorY + 3.08, centerZ], [0.12, 0.2, roomLength - 0.8], bronze);
    addBox('rodapé de madeira escura', [sideX, floorY + 0.18, centerZ], [0.16, 0.32, roomLength - 0.8], woodDark);
    for (const z of [-12.1, -6.1, 5.1, 11.1]) {
      addBox('pilastra vertical esculpida', [sideX, floorY + 1.76, z], [0.28, 3.1, 0.46], limestoneShade);
      addBox('capitel de lótus lateral', [sideX, floorY + 3.38, z], [0.48, 0.24, 0.8], bronze);
    }
  }
  // Relevos, cornijas e rodapés montados na face interior dos muros de fundo (nunca no plano da parede).
  for (const z of [room.minZ + 0.7, room.maxZ - 0.7]) {
    addBox('friso de bronze na parede de fundo', [centerX, floorY + 3.1, z], [roomWidth - 0.5, 0.18, 0.12], bronze);
    addBox('cornija moldurada no topo da parede', [centerX, floorY + 3.38, z], [roomWidth - 0.42, 0.24, 0.18], limestoneShade);
    addBox('rodapé monumental de calcário', [centerX, floorY + 0.32, z], [roomWidth - 0.5, 0.56, 0.18], limestoneShade);
  }
  for (const x of [westWallX + 0.48, eastWallX - 0.75]) {
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

  // As figuras laterais deixam de ser bustos procedurais e passam a ser shabtis
  // mumiformes em nichos de calcário, conforme a referência arqueológica escolhida.
  // A descrição do romance fala em estátuas de deuses nas paredes, não em shabtis.
  // Os expositores abaixo recebem scans de peças arqueológicas reais (ver OPEN-SOURCES.md).
  const wallGodStatuePlacements = [
    { side: 'west', z: -9.2, asset: 'jackalStatuette', title: 'Estatueta de chacal' },
    { side: 'west', z: 0.0, asset: 'bronzeHorus', title: 'Hórus — bronze' },
    { side: 'west', z: 9.2, asset: 'thothBaboon', title: 'Thoth — babuíno' },
    { side: 'east', z: -9.2, asset: 'horusFalconBritish', title: 'Hórus — falcão de pedra' },
    { side: 'east', z: 4.2, asset: 'falconSphinx', title: 'Esfinge com cabeça de falcão' }
  ];

  // Efígies de Rá nas paredes de fundo, elevadas dez pés acima do piso.
  const hoops = [];
  function addRaHoop(baselineZ, facing, name) {
    const group=new THREE.Group();group.name='efígie mural de Rá em diorito polido';
    const statueScale=.78;
    const mountHeight=3.05; // A implantação mural fica aproximadamente dez pés acima do piso, conforme o livro.
    group.position.set(centerX,floorY+mountHeight,baselineZ);
    group.rotation.y=facing;
    group.scale.setScalar(statueScale);
    const seat=new THREE.Mesh(new THREE.BoxGeometry(1.18,.48,.94),raBasaltLight);seat.position.set(0,.72,-.08);group.add(seat);
    const seatCushion=new THREE.Mesh(new THREE.BoxGeometry(1.15,.12,.9),raGold);seatCushion.position.set(0,1.02,-.08);group.add(seatCushion);

    // Trono e pilar dorsal esculpidos como uma peça arquitetônica contínua.
    const backShape=new THREE.Shape();backShape.moveTo(-.67,.0);backShape.lineTo(.67,.0);backShape.lineTo(.67,1.46);
    backShape.quadraticCurveTo(.65,1.92,0,2.08);backShape.quadraticCurveTo(-.65,1.92,-.67,1.46);backShape.closePath();
    const backPanel=new THREE.Mesh(new THREE.ExtrudeGeometry(backShape,{depth:.22,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.035,bevelThickness:.035}),raBasalt);
    backPanel.name='pilar dorsal esculpido do trono de Rá';backPanel.position.set(0,.86,-.57);group.add(backPanel);
    const backInset=new THREE.Mesh(new THREE.ShapeGeometry(backShape),raBasaltLight);backInset.position.set(0,.86,-.345);group.add(backInset);
    // Braços cantilever e fixações de bronze ancoram o trono na faixa alta da parede.
    // A carga visual fica apoiada no calcário; não há pedestal nem peça solta no piso.
    for(const side of [-1,1]){
      addTube('braço de sustentação mural de Rá',[
        [side*.49,.56,-.24],[side*.51,.46,-.43],[side*.53,.38,-.60]
      ],.055,raGold,group,20);
      const wallSocket=new THREE.Mesh(new THREE.CylinderGeometry(.075,.09,.10,20),raGold);
      wallSocket.name='fixação de bronze da efígie mural';
      wallSocket.rotation.x=Math.PI/2;
      wallSocket.position.set(side*.53,.38,-.43);
      group.add(wallSocket);
      const wallBolt=new THREE.Mesh(new THREE.SphereGeometry(.035,14,10),raGoldLight);
      wallBolt.position.set(side*.53,.38,-.49);
      group.add(wallBolt);
    }
    for(const side of [-1,1]){
      const upright=new THREE.Mesh(new THREE.BoxGeometry(.13,1.72,.13),raGold);upright.position.set(side*.61,1.63,-.36);group.add(upright);
      for(let y=1.02;y<2.45;y+=.28){const stud=new THREE.Mesh(new THREE.SphereGeometry(.032,10,8),raGoldLight);stud.position.set(side*.61,y,-.27);group.add(stud);}
    }

    // Corpo humano sentado, modelado por perfis contínuos em vez de esferas empilhadas.
    const torsoProfile=[
      new THREE.Vector2(.31,0),new THREE.Vector2(.37,.1),new THREE.Vector2(.43,.28),
      new THREE.Vector2(.48,.55),new THREE.Vector2(.54,.83),new THREE.Vector2(.62,1.08),
      new THREE.Vector2(.66,1.25),new THREE.Vector2(.56,1.39),new THREE.Vector2(.34,1.5)
    ];
    const torso=new THREE.Mesh(new THREE.LatheGeometry(torsoProfile,64),raBasalt);
    torso.name='tronco humano monolítico de Rá';torso.position.y=1.0;torso.castShadow=true;group.add(torso);
    const waistBand=new THREE.Mesh(new THREE.TorusGeometry(.44,.065,10,64),raGold);waistBand.rotation.x=Math.PI/2;waistBand.position.set(0,1.18,.02);group.add(waistBand);

    // Kilt cerimonial de pregas largas, com borda metálica.
    const kiltShape=new THREE.Shape();kiltShape.moveTo(-.52,0);kiltShape.lineTo(.52,0);kiltShape.lineTo(.43,.76);kiltShape.quadraticCurveTo(0,.92,-.43,.76);kiltShape.closePath();
    const kilt=new THREE.Mesh(new THREE.ExtrudeGeometry(kiltShape,{depth:.13,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.018,bevelThickness:.018}),raLapis);
    kilt.name='kilt shendyt azul de Rá';kilt.position.set(0,.78,.42);group.add(kilt);
    for(let i=-4;i<=4;i++){
      const x=i*.095;addTube('prega esculpida do kilt de Rá',[[x,.84,.57],[x*1.05,1.02,.575],[x*1.12,1.31,.55]],.012,raGold,group,18);
    }
    const kiltHem=new THREE.Mesh(new THREE.BoxGeometry(1.0,.045,.045),raGold);kiltHem.position.set(0,.8,.57);group.add(kiltHem);

    // Coxas dobradas sobre o assento, canelas verticais e pés apoiados no estrado.
    for(const side of [-1,1]){
      const thigh=new THREE.Mesh(new THREE.LatheGeometry([
        new THREE.Vector2(.11,0),new THREE.Vector2(.15,.12),new THREE.Vector2(.17,.36),
        new THREE.Vector2(.145,.62),new THREE.Vector2(.11,.76)
      ],32),raBasalt);
      thigh.name='coxa esculpida de Rá';thigh.rotation.x=Math.PI/2;thigh.position.set(side*.27,.66,.2);group.add(thigh);
      const shin=new THREE.Mesh(new THREE.LatheGeometry([
        new THREE.Vector2(.09,0),new THREE.Vector2(.12,.12),new THREE.Vector2(.13,.34),
        new THREE.Vector2(.11,.56),new THREE.Vector2(.1,.68)
      ],32),raBasalt);
      shin.name='canela esculpida de Rá';shin.position.set(side*.27,.34,.78);group.add(shin);
      const foot=new THREE.Mesh(new THREE.BoxGeometry(.2,.13,.42),raBasaltLight);foot.position.set(side*.27,.12,.91);group.add(foot);
      for(let toe=0;toe<3;toe++){const line=new THREE.Mesh(new THREE.BoxGeometry(.016,.018,.12),raGold);line.position.set(side*.27+(toe-1)*.048,.18,1.03);group.add(line);}
    }

    // Braços em repouso sobre os joelhos; volumes longos, afilados e sem articulações esféricas aparentes.
    for(const side of [-1,1]){
      addTube('braço esculpido de Rá',[
        [side*.48,2.05,.06],[side*.62,1.86,.18],[side*.61,1.56,.4],[side*.48,1.26,.66]
      ],.125,raBasalt,group,36);
      addTube('antebraço esculpido de Rá',[
        [side*.61,1.56,.4],[side*.52,1.37,.56],[side*.35,1.22,.72]
      ],.105,raBasaltLight,group,28);
      const hand=new THREE.Mesh(new THREE.BoxGeometry(.2,.14,.22),raBasalt);hand.position.set(side*.34,1.18,.75);group.add(hand);
      const cuff=new THREE.Mesh(new THREE.TorusGeometry(.13,.035,8,32),raGold);cuff.rotation.x=Math.PI/2;cuff.position.set(side*.6,1.56,.43);group.add(cuff);
    }

    // Broad usekh collar and pectoral inlaid with lapis lazuli and gold.
    for(let row=0;row<4;row++){
      const collar=new THREE.Mesh(new THREE.TorusGeometry(.43-row*.045,.045,10,56),row%2?raLapis:raGold);
      collar.rotation.x=Math.PI/2;collar.position.set(0,2.24-row*.035,.18+row*.018);collar.scale.set(1.18,1,.72);group.add(collar);
    }
    const chestPlate=new THREE.Mesh(new THREE.ShapeGeometry((()=>{const sh=new THREE.Shape();sh.moveTo(-.34,0);sh.lineTo(0,-.28);sh.lineTo(.34,0);sh.lineTo(.25,.24);sh.lineTo(-.25,.24);sh.closePath();return sh;})()),raGold);
    chestPlate.position.set(0,2.0,.42);group.add(chestPlate);
    const chestGem=new THREE.Mesh(new THREE.OctahedronGeometry(.105,1),raLapis);chestGem.position.set(0,2.04,.45);group.add(chestGem);

    const neck=new THREE.Mesh(new THREE.LatheGeometry([
      new THREE.Vector2(.16,0),new THREE.Vector2(.19,.08),new THREE.Vector2(.18,.35),new THREE.Vector2(.2,.47)
    ],40),raBasalt);neck.position.set(0,2.24,.02);group.add(neck);

    // Cabeça de falcão refeita como volume escuro alongado, com olhos amendoados,
    // bico curvo de pedra e linhas de plumagem. O disco solar não atravessa mais a cabeça.
    const falconHeadProfile=[
      new THREE.Vector2(.16,0),new THREE.Vector2(.25,.08),new THREE.Vector2(.31,.23),
      new THREE.Vector2(.34,.42),new THREE.Vector2(.32,.57),new THREE.Vector2(.25,.70),
      new THREE.Vector2(.14,.82)
    ];
    const falconHead=new THREE.Mesh(new THREE.LatheGeometry(falconHeadProfile,56),raBasalt);
    falconHead.name='crânio alongado de falcão esculpido em diorito';
    falconHead.position.set(0,2.27,.035);
    group.add(falconHead);

    const beakShape=new THREE.Shape();
    beakShape.moveTo(-.115,.17);
    beakShape.quadraticCurveTo(0,.22,.115,.17);
    beakShape.quadraticCurveTo(.105,.01,.055,-.075);
    beakShape.quadraticCurveTo(.035,-.18,-.025,-.27);
    beakShape.quadraticCurveTo(-.075,-.18,-.07,-.105);
    beakShape.quadraticCurveTo(-.15,.015,-.115,.17);
    const beak=new THREE.Mesh(
      new THREE.ExtrudeGeometry(beakShape,{depth:.2,bevelEnabled:true,bevelSegments:4,steps:1,bevelSize:.025,bevelThickness:.025}),
      raBasaltLight
    );
    beak.name='bico curvo de falcão em diorito';
    beak.position.set(0,2.52,.39);
    group.add(beak);
    addTube('crista central do bico de Rá',[[0,2.68,.57],[0,2.58,.61],[0,2.48,.62]],.014,raGold,group,18);
    for(const side of [-1,1]){
      const cheek=new THREE.Mesh(new THREE.SphereGeometry(.15,32,24),raBasaltLight);
      cheek.name='placa malar do falcão de Rá';
      cheek.position.set(side*.225,2.49,.2);
      cheek.scale.set(.58,.82,.5);
      group.add(cheek);

      const socket=new THREE.Mesh(new THREE.SphereGeometry(.105,32,20),darkBronze);
      socket.name='órbita profunda do olho de Rá';
      socket.position.set(side*.245,2.77,.285);
      socket.scale.set(1.12,.72,.42);
      group.add(socket);
      const eye=new THREE.Mesh(new THREE.SphereGeometry(.061,28,20),raGoldLight);
      eye.name='incrustação ocular do falcão';
      eye.position.set(side*.245,2.775,.318);
      eye.scale.set(1.1,.7,.55);
      group.add(eye);
      const pupil=new THREE.Mesh(new THREE.SphereGeometry(.027,18,14),darkBronze);
      pupil.position.set(side*.245,2.775,.35);
      group.add(pupil);
      addTube('arco da sobrancelha de falcão',[
        [side*.34,2.82,.26],[side*.29,2.87,.31],[side*.22,2.86,.32],[side*.16,2.81,.29]
      ],.027,raBasaltLight,group,18);
      const nostril=new THREE.Mesh(new THREE.SphereGeometry(.018,12,10),darkBronze);
      nostril.position.set(side*.075,2.61,.59);
      nostril.scale.set(1,.7,.5);
      group.add(nostril);
    }

    // Nemes de pedra escura: a faixa é gravada na peça, não uma peruca azul brilhante.
    const nemesCap=new THREE.Mesh(new THREE.SphereGeometry(.53,48,32,0,Math.PI*2,0,Math.PI*.62),raLapis);
    nemesCap.name='coroa nemes de diorito de Rá';
    nemesCap.position.set(0,2.91,-.08);
    nemesCap.scale.set(1.03,.78,.9);
    group.add(nemesCap);
    for(const side of [-1,1]){
      const flapShape=new THREE.Shape();
      flapShape.moveTo(0,0);
      flapShape.lineTo(.25,.02);
      flapShape.lineTo(.32,-.75);
      flapShape.quadraticCurveTo(.27,-.99,.1,-1.09);
      flapShape.lineTo(-.035,-.96);
      flapShape.closePath();
      const flap=new THREE.Mesh(
        new THREE.ExtrudeGeometry(flapShape,{depth:.085,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.022,bevelThickness:.02}),
        raLapis
      );
      flap.name='aba de nemes esculpida de Rá';
      flap.position.set(side*.27,2.78,.05);
      if(side<0)flap.rotation.y=Math.PI;
      group.add(flap);
      for(let stripe=0;stripe<5;stripe++){
        const x=side*(.285+stripe*.042);
        addTube('estria talhada no nemes de Rá',[
          [x,2.73,.145],[x,2.48,.155],[x*1.05,2.2,.16],[x*1.06,2.02,.16]
        ],.009,raGold,group,20);
      }
    }

    // O disco solar é vazado: sua abertura central é a própria cesta descrita no romance.
    // O aro interno deixa 45 cm de vão livre depois da escala final; não há tabela nem rede.
    const solarCenter=new THREE.Vector3(0,3.78,.105);
    const solarFrame=new THREE.Mesh(new THREE.TorusGeometry(.50,.06,16,96),raGold);
    solarFrame.name='moldura externa do disco solar de Rá';
    solarFrame.position.copy(solarCenter);
    group.add(solarFrame);
    const solarInlay=new THREE.Mesh(new THREE.TorusGeometry(.455,.012,10,96),raGoldLight);
    solarInlay.name='filete de ouro do disco solar vazado';
    solarInlay.position.set(0,3.78,.145);
    group.add(solarInlay);
    const solarOpening=new THREE.Mesh(new THREE.TorusGeometry(.33,.041,16,96),darkBronze);
    solarOpening.name='aro de basquete integrado à abertura do disco solar';
    solarOpening.position.set(0,3.78,.16);
    group.add(solarOpening);
    const rimHighlight=new THREE.Mesh(new THREE.TorusGeometry(.33,.009,10,96),raGoldLight);
    rimHighlight.name='filete interno do aro solar';
    rimHighlight.position.set(0,3.78,.205);
    group.add(rimHighlight);
    // Os pinos decorativos ocupam somente a moldura externa, nunca atravessam a abertura.
    for(let i=0;i<16;i++){
      const a=i/16*Math.PI*2;
      const marker=new THREE.Mesh(new THREE.SphereGeometry(.018,12,10),raGoldLight);
      marker.name='marcador gravado na moldura solar';
      marker.position.set(Math.cos(a)*.50,3.78+Math.sin(a)*.50,.17);
      group.add(marker);
    }
    // A uraeus acompanha o topo da moldura sem obstruir o vão funcional.
    addTube('cobra uraeus sobre a moldura solar de Rá',[
      [-.045,4.20,.17],[-.025,4.27,.20],[0,4.32,.22],[.025,4.27,.20]
    ],.025,raGold,group,24);
    const uraeusHood=new THREE.Mesh(new THREE.SphereGeometry(.065,24,16),raGold);
    uraeusHood.name='capelo da cobra uraeus sobre o disco';
    uraeusHood.position.set(0,4.30,.22);
    uraeusHood.scale.set(1.1,1.05,.5);
    group.add(uraeusHood);

    group.traverse(obj=>{if(obj.isMesh){obj.castShadow=true;obj.receiveShadow=true;}});
    scene.add(group);
    const hoopPosition=new THREE.Vector3(
      centerX,
      group.position.y+solarCenter.y*statueScale,
      baselineZ+(facing===0?solarCenter.z:-solarCenter.z)*statueScale
    );
    hoops.push({position:hoopPosition,label:name,approachDirection:facing===0?-1:1,clearRadius:.105});
    addInteractable({
      name,label:'Rá — disco solar / cesta',
      description:'Efígie monumental de Rá em diorito, projetada da parede da linha de fundo. A abertura vazada do disco solar, no alto da coroa, funciona como cesta de basquete.',
      prompt:'DISCO SOLAR DE RÁ · E para examinar · arremesse a bola pela abertura da coroa',
      position:new THREE.Vector3(centerX,floorY+mountHeight+1.8,baselineZ),radius:5.2
    });
  }
  // Encoste a face posterior do trono e os braços de sustentação no lado interno do calcário.
  // A figura projeta-se para dentro da quadra, em vez de ficar embutida ou suspensa diante da parede.
  const raWallInset = 0.98;
  addRaHoop(room.minZ + raWallInset, 0, 'Rá — cesta norte');
  addRaHoop(room.maxZ - raWallInset, Math.PI, 'Rá — cesta sul');

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
  scoreboard.position.set(centerX, floorY + 3.5, room.minZ + 0.62);
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

  // Alvos de magia opcionais: painéis de madeira com círculos pintados.
  // A forma agora comunica claramente um alvo físico, não uma luminária circular.
  const targets = [];
  function addTarget(z, index) {
    const group = new THREE.Group();
    group.name = 'painel alvo de magia ' + index;
    group.position.set(westWallX + 0.36, floorY + 2.35, z);
    group.rotation.y = Math.PI / 2;
    const backing = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.9, 0.16), woodDark);
    backing.name = 'placa quadrada de madeira do alvo';
    group.add(backing);

    const targetCanvas = document.createElement('canvas');
    targetCanvas.width = 512; targetCanvas.height = 512;
    const tc = targetCanvas.getContext('2d');
    tc.fillStyle = '#c5a878'; tc.fillRect(0, 0, 512, 512);
    tc.fillStyle = '#2e2921'; tc.font = 'bold 27px Georgia'; tc.textAlign = 'center';
    tc.fillText('ALVO DE MAGIA', 256, 44);
    const cx = 256, cy = 278;
    const rings = [
      {r:174,color:'#ead9b7',w:13},
      {r:139,color:'#8b4c32',w:17},
      {r:103,color:'#e4c89a',w:15},
      {r:68,color:'#355f61',w:16},
      {r:34,color:'#8b3e2c',w:12}
    ];
    for(const ring of rings){
      tc.beginPath();tc.arc(cx,cy,ring.r,0,Math.PI*2);
      tc.strokeStyle=ring.color;tc.lineWidth=ring.w;tc.stroke();
    }
    tc.strokeStyle='rgba(53,42,29,.7)';tc.lineWidth=2;
    tc.beginPath();tc.moveTo(cx-188,cy);tc.lineTo(cx+188,cy);tc.moveTo(cx,cy-188);tc.lineTo(cx,cy+188);tc.stroke();
    const targetTexture = new THREE.CanvasTexture(targetCanvas);
    targetTexture.colorSpace = THREE.SRGBColorSpace;
    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(1.72, 1.72),
      new THREE.MeshBasicMaterial({ map: targetTexture, toneMapped: false })
    );
    face.name = 'superfície pintada do alvo';
    face.position.z = 0.086;
    group.add(face);
    const center = new THREE.Mesh(
      new THREE.CircleGeometry(0.105, 32),
      new THREE.MeshStandardMaterial({ color: 0x8b3e2c, roughness: 0.76 })
    );
    center.name = 'centro reativo do alvo';
    center.position.z = 0.091;
    group.add(center);
    group.traverse(obj => { if (obj.isMesh) { obj.castShadow = true; obj.receiveShadow = true; } });
    scene.add(group);
    targets.push({ group, position: group.position.clone(), glow: center, restMaterial: center.material, hitUntil: 0, index });
  }
  addTarget(-10.0, 1); addTarget(-0.5, 2); addTarget(9.0, 3);
  const noticeBoard = new THREE.Group();
  noticeBoard.name = 'quadro de aviso para prática de alvos';
  noticeBoard.position.set(eastWallX - 0.62, floorY + 2.15, 8.2);
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

  // As miniaturas seguem a forma histórica de um shabti mumiiforme; a animação desperta o guerreiro do romance.
  const shabtiMiniScale=.085;
  const shabtiFullScale=.82;
  // Faixas junto aos muros e às duas efígies de Rá ficam reservadas para decoração; IA permanece na quadra útil.
  const combatBounds={minX:room.minX+2.8,maxX:eastWallX-2.65,minZ:room.minZ+4.8,maxZ:room.maxZ-4.8};
  const shabtiTemplate=new THREE.Group();shabtiTemplate.name='shabti mumiiforme de faiança azul-esverdeada';
  function shabtiMesh(parent,name,geometry,material,pos,scale=null){
    const mesh=new THREE.Mesh(geometry,material);mesh.name=name;mesh.position.set(pos[0],pos[1],pos[2]);
    if(scale)mesh.scale.set(scale[0],scale[1],scale[2]);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
  }
  // Silhueta contínua de múmia, afilada nos pés e nos ombros.
  const mummyBody=shabtiMesh(shabtiTemplate,'corpo mumiforme contínuo',new THREE.LatheGeometry([
    new THREE.Vector2(.17,0),new THREE.Vector2(.2,.08),new THREE.Vector2(.23,.18),
    new THREE.Vector2(.26,.42),new THREE.Vector2(.3,.72),new THREE.Vector2(.32,1.02),
    new THREE.Vector2(.3,1.28),new THREE.Vector2(.25,1.48),new THREE.Vector2(.18,1.62),new THREE.Vector2(.13,1.68)
  ],64),faience,[0,.12,0]);
  const dorsalPillar=new THREE.Mesh(new THREE.ExtrudeGeometry((()=>{const sh=new THREE.Shape();sh.moveTo(-.19,.06);sh.lineTo(.19,.06);sh.lineTo(.16,1.52);sh.quadraticCurveTo(0,1.68,-.16,1.52);sh.closePath();return sh;})(),{depth:.09,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.015,bevelThickness:.015}),faienceLight);
  dorsalPillar.name='pilar dorsal do shabti';dorsalPillar.position.set(0,.13,-.22);dorsalPillar.userData.miniatureOnly=true;shabtiTemplate.add(dorsalPillar);
  // Face alongada, orelhas, olhos incisos e barba postiça trançada.
  const face=shabtiMesh(shabtiTemplate,'rosto do shabti',new THREE.LatheGeometry([
    new THREE.Vector2(.055,0),new THREE.Vector2(.115,.035),new THREE.Vector2(.16,.12),
    new THREE.Vector2(.17,.25),new THREE.Vector2(.145,.34),new THREE.Vector2(.09,.4)
  ],32),faienceLight,[0,1.72,.035]);
  for(const side of [-1,1]){
    shabtiMesh(shabtiTemplate,'orelha do shabti',new THREE.SphereGeometry(.042,14,10),faienceLight,[side*.15,1.88,.015],[.7,1.35,.6]);
    shabtiMesh(shabtiTemplate,'olho inciso',new THREE.SphereGeometry(.025,14,10),darkBronze,[side*.075,1.91,.172]);
    addTube('linha de sobrancelha incisa',[[side*.04,1.96,.17],[side*.09,1.97,.17],[side*.13,1.95,.15]],.012,darkBronze,shabtiTemplate,12);
  }
  shabtiMesh(shabtiTemplate,'nariz esculpido',new THREE.ConeGeometry(.035,.11,5),faienceLight,[0,1.83,.185]);
  const falseBeard=shabtiMesh(shabtiTemplate,'barba postiça trançada',new THREE.LatheGeometry([
    new THREE.Vector2(.07,0),new THREE.Vector2(.085,.07),new THREE.Vector2(.07,.17),new THREE.Vector2(.05,.3),new THREE.Vector2(.027,.43),new THREE.Vector2(.012,.48)
  ],24),faienceLight,[0,1.35,.16]);
  for(let braid=0;braid<3;braid++)addTube('trança da barba postiça',[[(-1+braid)*.025,1.32,.225],[(-1+braid)*.02,1.42,.23],[(-1+braid)*.013,1.53,.205]],.009,raGold,shabtiTemplate,14);
  // Nemes estriado com touca e abas laterais, não um capacete esférico.
  const nemesCap=shabtiMesh(shabtiTemplate,'touca do nemes',new THREE.SphereGeometry(.235,32,20,0,Math.PI*2,0,Math.PI*.64),lapis,[0,1.97,-.035],[1.13,.78,.96]);
  for(const side of [-1,1]){
    const flapShape=new THREE.Shape();flapShape.moveTo(0,0);flapShape.lineTo(.16,.02);flapShape.lineTo(.19,-.36);flapShape.quadraticCurveTo(.14,-.51,.06,-.55);flapShape.lineTo(-.02,-.45);flapShape.closePath();
    const flap=new THREE.Mesh(new THREE.ExtrudeGeometry(flapShape,{depth:.07,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.01,bevelThickness:.01}),lapis);
    flap.name='aba de nemes listrada';flap.position.set(side*.17,1.88,.03);if(side<0)flap.rotation.y=Math.PI;shabtiTemplate.add(flap);
    for(let stripe=0;stripe<4;stripe++)addTube('riscas douradas do nemes',[[side*(.19+stripe*.018),1.84,.105],[side*(.2+stripe*.018),1.67,.11],[side*(.21+stripe*.018),1.44,.12]],.008,raGoldLight,shabtiTemplate,14);
  }
  const uraeus=shabtiMesh(shabtiTemplate,'uraeus na testa',new THREE.TorusGeometry(.055,.015,8,24),raGold,[0,2.13,.14]);
  const collar=shabtiMesh(shabtiTemplate,'colar usekh de faiança e ouro',new THREE.TorusGeometry(.25,.055,10,48),raGold,[0,1.53,.12]);collar.rotation.x=Math.PI/2;collar.scale.set(1.18,.92,1);
  for(let row=0;row<4;row++){
    const band=shabtiMesh(shabtiTemplate,'filete colorido do colar',new THREE.TorusGeometry(.24-row*.026,.015,6,40),row%2?lapis:faienceLight,[0,1.52-row*.035,.13]);band.rotation.x=Math.PI/2;
  }
  // Inscrição vertical na frente e corda/bolsa de sementes no pilar dorsal.
  const shabtiGlyphCanvas=document.createElement('canvas');shabtiGlyphCanvas.width=256;shabtiGlyphCanvas.height=512;
  const shabtiGlyphCtx=shabtiGlyphCanvas.getContext('2d');shabtiGlyphCtx.clearRect(0,0,256,512);shabtiGlyphCtx.fillStyle='#162f32';shabtiGlyphCtx.font='42px serif';shabtiGlyphCtx.textAlign='center';
  ['𓋹','𓂀','𓊹','𓆣','𓇳','𓈖'].forEach((symbol,i)=>shabtiGlyphCtx.fillText(symbol,128,48+i*78));
  const shabtiGlyphMap=new THREE.CanvasTexture(shabtiGlyphCanvas);shabtiGlyphMap.colorSpace=THREE.SRGBColorSpace;
  const glyphColumn=new THREE.Mesh(new THREE.PlaneGeometry(.17,.53),new THREE.MeshBasicMaterial({map:shabtiGlyphMap,transparent:true,side:THREE.DoubleSide,depthWrite:false}));
  glyphColumn.name='inscrição vertical do shabti';glyphColumn.position.set(0,.84,.286);shabtiTemplate.add(glyphColumn);
  const seedBag=shabtiMesh(shabtiTemplate,'bolsa de sementes do shabti',new THREE.SphereGeometry(.09,16,12),faienceLight,[0,1.08,-.3],[.8,1.12,.65]);seedBag.userData.miniatureOnly=true;
  addTube('corda da bolsa dorsal',[[0,1.5,-.23],[.16,1.28,-.25],[0,1.02,-.27]],.012,raGold,shabtiTemplate,14).userData.miniatureOnly=true;

  // Braços cruzados sobre o peito enquanto miniatura; abrem-se quando o shabti desperta.
  const swordArm=new THREE.Group();swordArm.name='shabti-sword-arm';swordArm.position.set(.27,1.42,.02);swordArm.rotation.z=-.78;shabtiTemplate.add(swordArm);
  shabtiMesh(swordArm,'braço superior direito em faiança',new THREE.CapsuleGeometry(.075,.36,8,14),faience,[0,-.19,.02]);
  const swordForearm=new THREE.Group();swordForearm.name='cotovelo armado';swordForearm.position.set(0,-.36,.03);swordArm.add(swordForearm);
  shabtiMesh(swordForearm,'antebraço direito cruzado',new THREE.CapsuleGeometry(.07,.3,8,14),faienceLight,[0,-.14,.03]);
  shabtiMesh(swordForearm,'mão direita do shabti',new THREE.SphereGeometry(.07,14,10),faience,[0,-.3,.07]);
  const swordGrip=shabtiMesh(swordForearm,'punho da espada curva',new THREE.CylinderGeometry(.025,.03,.25,10),woodDark,[0,-.4,.1]);swordGrip.rotation.z=-.12;
  shabtiMesh(swordForearm,'guarda da espada curva',new THREE.BoxGeometry(.24,.045,.07),raGold,[0,-.51,.1]);
  const bladeShape=new THREE.Shape();bladeShape.moveTo(-.035,0);bladeShape.lineTo(.035,0);bladeShape.lineTo(.05,.28);bladeShape.quadraticCurveTo(.07,.48,.19,.65);bladeShape.quadraticCurveTo(.24,.72,.2,.77);bladeShape.lineTo(.1,.7);bladeShape.quadraticCurveTo(-.015,.58,-.05,.4);bladeShape.closePath();
  const blade=new THREE.Mesh(new THREE.ExtrudeGeometry(bladeShape,{depth:.028,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.008,bevelThickness:.008}),new THREE.MeshStandardMaterial({color:0x9da7a5,metalness:.82,roughness:.24}));
  blade.name='khopesh de treino do shabti';blade.position.set(-.018,-.5,.135);swordForearm.add(blade);

  const shieldArm=new THREE.Group();shieldArm.name='shabti-shield-arm';shieldArm.position.set(-.27,1.42,.02);shieldArm.rotation.z=.78;shabtiTemplate.add(shieldArm);
  shabtiMesh(shieldArm,'braço superior esquerdo em faiança',new THREE.CapsuleGeometry(.075,.36,8,14),faience,[0,-.19,.02]);
  const shieldForearm=new THREE.Group();shieldForearm.name='antebraço do escudo';shieldForearm.position.set(0,-.36,.03);shieldArm.add(shieldForearm);
  shabtiMesh(shieldForearm,'antebraço esquerdo cruzado',new THREE.CapsuleGeometry(.07,.3,8,14),faienceLight,[0,-.14,.03]);
  shabtiMesh(shieldForearm,'mão esquerda do shabti',new THREE.SphereGeometry(.07,14,10),faience,[0,-.3,.07]);
  const shield=new THREE.Group();shield.name='escudo oval do shabti';shield.position.set(-.08,-.34,.14);shieldForearm.add(shield);
  shabtiMesh(shield,'escudo de faiança esmaltada',new THREE.SphereGeometry(.24,24,18),faienceLight,[0,0,0],[.74,1.0,.18]);
  const shieldRim=shabtiMesh(shield,'aro dourado do escudo',new THREE.TorusGeometry(.205,.022,8,40),raGold,[0,0,.04]);shieldRim.scale.set(.74,1,1);
  shabtiMesh(shield,'umbigo de bronze do escudo',new THREE.SphereGeometry(.06,14,12),raGold,[0,0,.065]);

  // Membros inferiores curtos permanecem ocultos na miniatura e emergem na forma de guerreiro.
  const leftLeg=new THREE.Group();leftLeg.name='shabti-perna-esquerda';leftLeg.position.set(-.13,.25,0);leftLeg.visible=false;shabtiTemplate.add(leftLeg);
  shabtiMesh(leftLeg,'perna esquerda do guerreiro',new THREE.LatheGeometry([new THREE.Vector2(.08,0),new THREE.Vector2(.1,.08),new THREE.Vector2(.085,.24),new THREE.Vector2(.075,.42),new THREE.Vector2(.09,.5)],20),faience,[0,-.22,0]);
  shabtiMesh(leftLeg,'pé esquerdo do guerreiro',new THREE.BoxGeometry(.18,.1,.3),faienceLight,[0,-.48,.09]);
  const rightLeg=new THREE.Group();rightLeg.name='shabti-perna-direita';rightLeg.position.set(.13,.25,0);rightLeg.visible=false;shabtiTemplate.add(rightLeg);
  shabtiMesh(rightLeg,'perna direita do guerreiro',new THREE.LatheGeometry([new THREE.Vector2(.08,0),new THREE.Vector2(.1,.08),new THREE.Vector2(.085,.24),new THREE.Vector2(.075,.42),new THREE.Vector2(.09,.5)],20),faience,[0,-.22,0]);
  shabtiMesh(rightLeg,'pé direito do guerreiro',new THREE.BoxGeometry(.18,.1,.3),faienceLight,[0,-.48,.09]);
  const miniaturePedestal=new THREE.Mesh(new THREE.CylinderGeometry(.31,.36,.11,32),limestoneShade);miniaturePedestal.name='plinto pequeno do shabti';miniaturePedestal.position.y=.07;miniaturePedestal.userData.miniatureOnly=true;shabtiTemplate.add(miniaturePedestal);
  const miniatureSeal=new THREE.Mesh(new THREE.TorusGeometry(.39,.018,8,40),warmEmissive);miniatureSeal.name='selo de invocação da miniatura';miniatureSeal.rotation.x=Math.PI/2;miniatureSeal.position.y=.035;miniatureSeal.userData.miniatureOnly=true;shabtiTemplate.add(miniatureSeal);
  // Nichos funerários em calcário com shabtis de faiança mumiformes.
  // Os modelos são clones decorativos da mesma família visual dos quatro shabtis interativos,
  // sem armas, sem selo mágico aceso e sem colisão para preservar o espaço de combate.
  // Reagrupa o shabti procedural como forma de guerreiro animável e reserva
  // uma camada separada para a miniatura digitalizada de museu.
  const shabtiWarriorForm = new THREE.Group();
  shabtiWarriorForm.name = 'shabti-warrior-form';
  for (const child of [...shabtiTemplate.children]) shabtiWarriorForm.add(child);
  shabtiTemplate.add(shabtiWarriorForm);
  shabtiWarriorForm.visible = false;
  const shabtiMuseumScanRoot = new THREE.Group();
  shabtiMuseumScanRoot.name = 'shabti-museum-scan';
  shabtiTemplate.add(shabtiMuseumScanRoot);
  shabtiMuseumScanRoot.visible = true;

  // Scans glTF/GLB em repositório público, com versões otimizadas e licenças auditadas.
  // O commit fixo evita que um update externo altere silenciosamente os modelos usados no jogo.
  const museumAssetBase = 'https://cdn.jsdelivr.net/gh/storystage/backstage-assets@502f84adbc9a71d1434e7cc5ab61422bfd92c781/models/sketchfab-history/Prop/';
  const atriumAssetBase = 'https://cdn.jsdelivr.net/gh/never-nude/atrium.earth@28aefba9209eab48535ee7a193bea310fde10f47/public/models/previews/egyptian/';
  const museumAssetUrls = {
    shabtiRamose: museumAssetBase + 'shabti-of-ramose.glb',
    bronzeHorus: museumAssetBase + 'bronze-horus.glb',
    thothBaboon: museumAssetBase + 'thoth-baboon.glb',
    jackalStatuette: atriumAssetBase + 'jackal-statuette-art-institute-chicago/preview.glb',
    horusFalconBritish: atriumAssetBase + 'horus-falcon-british-museum/preview.glb',
    falconSphinx: atriumAssetBase + 'falcon-headed-sphinx-abu-simbel-british-museum/preview.glb'
  };
  const gltfLoader = new GLTFLoader();
  gltfLoader.setMeshoptDecoder(MeshoptDecoder);
  const museumModelPromises = new Map();
  function loadMuseumModel(key) {
    if (!museumModelPromises.has(key)) {
      const url = museumAssetUrls[key];
      museumModelPromises.set(key, gltfLoader.loadAsync(url)
        .then(result => result.scene)
        .catch(error => {
          console.warn('Não foi possível carregar o scan arqueológico ' + key, error);
          return null;
        }));
    }
    return museumModelPromises.get(key);
  }
  function fitMuseumModel(source, targetHeight) {
    const model = source.clone(true);
    model.updateMatrixWorld(true);
    let bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    if (size.y > 0.0001) model.scale.multiplyScalar(targetHeight / size.y);
    model.updateMatrixWorld(true);
    bounds = new THREE.Box3().setFromObject(model);
    model.position.x -= (bounds.min.x + bounds.max.x) * 0.5;
    model.position.z -= (bounds.min.z + bounds.max.z) * 0.5;
    model.position.y -= bounds.min.y;
    model.traverse(object => {
      if (!object.isMesh) return;
      object.castShadow = true;
      object.receiveShadow = true;
    });
    model.updateMatrixWorld(true);
    return model;
  }

  // Nichos profundos, como expositores embutidos na parede, agora contêm esculturas
  // divinas digitalizadas: Hórus e Thoth. Não são figuras genéricas nem miniaturas shabti.
  function addWallGodStatue(placement) {
    const west = placement.side === 'west';
    const group = new THREE.Group();
    group.name = 'nicho de parede com estátua de ' + placement.title;
    group.position.set(west ? westWallX + 0.34 : eastWallX - 0.34, floorY, placement.z);
    group.rotation.y = west ? Math.PI / 2 : -Math.PI / 2;

    const backing = new THREE.Mesh(new THREE.BoxGeometry(2.02, 2.52, 0.2), reliefStone);
    backing.name = 'fundo profundo de calcário do expositor';
    backing.position.set(0, 1.34, -0.34);
    group.add(backing);
    const recessedPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(1.72, 2.22),
      new THREE.MeshStandardMaterial({ color: 0x625746, roughness: 0.94, metalness: 0 })
    );
    recessedPanel.name = 'painel de sombra do nicho';
    recessedPanel.position.set(0, 1.36, -0.225);
    group.add(recessedPanel);

    const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.24, 0.88), limestoneShade);
    shelf.name = 'pedestal de calcário da estátua';
    shelf.position.set(0, 0.43, 0.12);
    group.add(shelf);
    const shelfInlay = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.035, 0.04), raGold);
    shelfInlay.position.set(0, 0.565, 0.54);
    group.add(shelfInlay);

    for (const side of [-1, 1]) {
      const jamb = new THREE.Mesh(new THREE.BoxGeometry(0.17, 2.28, 0.58), limestone);
      jamb.name = 'montante frontal do nicho';
      jamb.position.set(side * 0.91, 1.34, 0.04);
      group.add(jamb);
      const capital = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.18, 0.62), limestoneShade);
      capital.position.set(side * 0.91, 2.54, 0.04);
      group.add(capital);
      for (let groove = 0; groove < 3; groove++) {
        const gx = side * 0.91 + (groove - 1) * 0.038;
        addTube('sulco vertical no montante', [[gx, 0.48, 0.335], [gx, 1.3, 0.335], [gx, 2.22, 0.335]], 0.006, raGold, group, 18);
      }
    }
    addTube('arco de calcário do nicho', [
      [-1.02, 2.43, 0.06], [-0.94, 2.62, 0.06], [-0.69, 2.76, 0.06],
      [-0.36, 2.83, 0.06], [0, 2.86, 0.06], [0.36, 2.83, 0.06],
      [0.69, 2.76, 0.06], [0.94, 2.62, 0.06], [1.02, 2.43, 0.06]
    ], 0.075, limestoneShade, group, 56);

    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 512; labelCanvas.height = 128;
    const labelCtx = labelCanvas.getContext('2d');
    labelCtx.fillStyle = '#203239'; labelCtx.fillRect(0, 0, 512, 128);
    labelCtx.strokeStyle = '#c7a36a'; labelCtx.lineWidth = 7; labelCtx.strokeRect(5, 5, 502, 118);
    labelCtx.fillStyle = '#f0dfbd'; labelCtx.textAlign = 'center';
    labelCtx.font = 'bold 38px Georgia'; labelCtx.fillText(placement.title.toUpperCase(), 256, 80);
    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    labelTexture.colorSpace = THREE.SRGBColorSpace;
    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(1.18, 0.25),
      new THREE.MeshBasicMaterial({ map: labelTexture, toneMapped: false })
    );
    label.name = 'plaqueta identificadora da estátua';
    label.position.set(0, 0.32, 0.575);
    group.add(label);
    scene.add(group);

    loadMuseumModel(placement.asset).then(source => {
      if (!source) return;
      const targetHeightByAsset = {
        jackalStatuette: 0.72,
        bronzeHorus: 1.08,
        thothBaboon: 1.08,
        horusFalconBritish: 1.28,
        falconSphinx: 1.35
      };
      const model = fitMuseumModel(source, targetHeightByAsset[placement.asset] || 1.2);
      model.name = 'scan 3D de ' + placement.title;
      model.position.set(0, 0.57, 0.16);
      group.add(model);
    });
    return group;
  }
  const wallGodStatues = wallGodStatuePlacements.map(addWallGodStatue);

  // Cada miniatura dos quatro guerreiros usa o scan do Shabti de Ramose.
  // A forma procedural só aparece na transformação para o guerreiro armado.
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
      group,index,health:2,spawnProgress:1,hitAt:0,defeatTime:0,magicRespawnTimer:0,active:false,defeated:false,collider:null,
      aiState:'idle',windup:0,strike:0,strikeResolved:false,attackCooldown:0,moveSpeed:1.32,
      origin:group.position.clone(),miniScale:shabtiMiniScale,fullScale:shabtiFullScale,
      warriorForm:group.getObjectByName('shabti-warrior-form'),
      scanRoot:group.getObjectByName('shabti-museum-scan'),
      aura,beamMat,swordArm:group.getObjectByName('shabti-sword-arm'),shieldArm:group.getObjectByName('shabti-shield-arm'),
      swordForearm:group.getObjectByName('cotovelo armado'),shieldForearm:group.getObjectByName('antebraço do escudo'),
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
          {dir:new THREE.Vector3(1,0,0),dist:combatBounds.maxX-group.position.x,target:new THREE.Vector3(combatBounds.maxX,floorY,group.position.z)},
          {dir:new THREE.Vector3(-1,0,0),dist:group.position.x-combatBounds.minX,target:new THREE.Vector3(combatBounds.minX,floorY,group.position.z)},
          {dir:new THREE.Vector3(0,0,1),dist:combatBounds.maxZ-group.position.z,target:new THREE.Vector3(group.position.x,floorY,combatBounds.maxZ)},
          {dir:new THREE.Vector3(0,0,-1),dist:group.position.z-combatBounds.minZ,target:new THREE.Vector3(group.position.x,floorY,combatBounds.minZ)}
        ].filter(w=>w.dist>0.5).sort((a,b)=>b.dir.dot(away)-a.dir.dot(away));
        const wall=walls[0]||{target:group.position.clone().addScaledVector(away,4.5),dist:4.5,dir:away};
        state.stumbleTarget=wall.target; state.stumbleDirection.copy(wall.target).sub(group.position).setY(0).normalize();
        state.stumbleSpeed=2.8; state.stumbleTimer=wall.dist/state.stumbleSpeed+0.5;
        return 'SA-PER — “errar”. Você marcou o shabti com o hieróglifo. Ele vai cambalear e bater contra a parede.';
      }
    });
    return state;
  });
  loadMuseumModel('shabtiRamose').then(source => {
    if (!source) {
      for (const state of shabtiWarriors) {
        state.scanRoot.visible = false;
        state.warriorForm.visible = !state.active;
      }
      return;
    }
    for (const state of shabtiWarriors) {
      const scan = fitMuseumModel(source, 1.68);
      scan.name = 'scan original do Shabti de Ramose';
      state.scanRoot.add(scan);
      state.scanRoot.visible = !state.active;
      state.warriorForm.visible = state.active;
    }
  });
  let shabtiActive=false,shabtiRemaining=0;
  const shabtiDebris=[];
  const maxPlayerHealth=5;
  let playerHealth=maxPlayerHealth,playerInvulnerability=0;
  function addShabtiCollider(state) {
    const p = state.group.position, width=.46*state.fullScale, depth=.42*state.fullScale;
    const collider = {
      minX: p.x - width, maxX: p.x + width,
      minY: floorY, maxY: floorY + 2.25*state.fullScale,
      minZ: p.z - depth, maxZ: p.z + depth
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
  function createShabtiDebris(state) {
    const centre = state.group.position.clone().add(new THREE.Vector3(0, 1.02 * state.fullScale, 0));
    state.group.updateMatrixWorld(true);
    state.group.traverse(object => {
      if (!object.isMesh || !object.visible || object.userData?.miniatureOnly || object.name === 'corpo mumiforme contínuo') return;
      object.updateWorldMatrix(true, false);
      const position = new THREE.Vector3(), quaternion = new THREE.Quaternion(), scale = new THREE.Vector3();
      object.matrixWorld.decompose(position, quaternion, scale);
      const material = Array.isArray(object.material)
        ? object.material.map(item => item.clone())
        : object.material.clone();
      const piece = new THREE.Mesh(object.geometry, material);
      piece.name = 'fragmento de faiança destruído por HA-DI';
      piece.position.copy(position); piece.quaternion.copy(quaternion); piece.scale.copy(scale);
      piece.castShadow = true; piece.receiveShadow = true; scene.add(piece);
      if (!object.geometry.boundingSphere) object.geometry.computeBoundingSphere();
      const radius = Math.max(0.045, (object.geometry.boundingSphere?.radius || 0.12) * Math.max(scale.x, scale.y, scale.z));
      const direction = position.clone().sub(centre);
      if (direction.lengthSq() < 0.001) direction.set(Math.random() - 0.5, Math.random() * 0.7, Math.random() - 0.5);
      direction.normalize();
      const velocity = direction.multiplyScalar(1.8 + Math.random() * 3.8);
      velocity.y += 1.5 + Math.random() * 2.8;
      const pieceMaterials = Array.isArray(piece.material) ? piece.material : [piece.material];
      shabtiDebris.push({
        mesh: piece, velocity,
        spin: new THREE.Vector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 10),
        radius, life: 0, ownsGeometry: false,
        baseScale: piece.scale.clone(),
        fadeStart: 10 + Math.random() * 0.7,
        fadeDuration: 1.5 + Math.random() * 0.7,
        opacityStates: pieceMaterials.map(material => ({ material, opacity: material.opacity ?? 1 })),
        fading: false
      });
    });

    // O tronco contínuo se parte em lascas menores: evitamos que reste um único bloco de cerâmica.
    for (let i = 0; i < 28; i++) {
      const size = 0.045 + Math.random() * 0.065;
      const shard = new THREE.Mesh(
        new THREE.DodecahedronGeometry(size, 0),
        i % 2 ? faienceLight.clone() : faience.clone()
      );
      shard.name = 'lasca de tronco de faiança do HA-DI';
      shard.position.copy(centre).add(new THREE.Vector3(
        (Math.random() - 0.5) * 0.48,
        (Math.random() - 0.5) * 1.05,
        (Math.random() - 0.5) * 0.34
      ));
      shard.castShadow = true; shard.receiveShadow = true; scene.add(shard);
      const velocity = new THREE.Vector3(Math.random() - 0.5, 1.8 + Math.random() * 3.2, Math.random() - 0.5)
        .normalize().multiplyScalar(2.4 + Math.random() * 3.8);
      const shardMaterials = Array.isArray(shard.material) ? shard.material : [shard.material];
      shabtiDebris.push({
        mesh: shard, velocity,
        spin: new THREE.Vector3((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12),
        radius: size, life: 0, ownsGeometry: true,
        baseScale: shard.scale.clone(),
        fadeStart: 10 + Math.random() * 0.7,
        fadeDuration: 1.5 + Math.random() * 0.7,
        opacityStates: shardMaterials.map(material => ({ material, opacity: material.opacity ?? 1 })),
        fading: false
      });
    }
  }

  function updateShabtiDebris(dt) {
    for (let i = shabtiDebris.length - 1; i >= 0; i--) {
      const piece = shabtiDebris[i];
      piece.life += dt;

      // As peças descansam por pelo menos dez segundos. Depois, cada uma inicia
      // um fade próprio (com atraso e duração levemente variados), em vez de sumirem juntas.
      if (piece.life >= piece.fadeStart) {
        if (!piece.fading) {
          piece.fading = true;
          piece.velocity.set(0, 0, 0);
          piece.spin.set(0, 0, 0);
          for (const state of piece.opacityStates) {
            state.material.transparent = true;
            state.material.depthWrite = false;
            state.material.needsUpdate = true;
          }
        }
        const fade = THREE.MathUtils.clamp((piece.life - piece.fadeStart) / piece.fadeDuration, 0, 1);
        for (const state of piece.opacityStates) state.material.opacity = state.opacity * (1 - fade);
        piece.mesh.scale.copy(piece.baseScale).multiplyScalar(1 - fade * 0.18);
        if (fade >= 1) {
          scene.remove(piece.mesh);
          if (piece.ownsGeometry) piece.mesh.geometry.dispose();
          if (Array.isArray(piece.mesh.material)) piece.mesh.material.forEach(material => material.dispose());
          else piece.mesh.material.dispose();
          shabtiDebris.splice(i, 1);
        }
        continue;
      }

      piece.velocity.y -= 9.81 * dt;
      piece.mesh.position.addScaledVector(piece.velocity, dt);
      piece.mesh.rotation.x += piece.spin.x * dt;
      piece.mesh.rotation.y += piece.spin.y * dt;
      piece.mesh.rotation.z += piece.spin.z * dt;
      const floorContact = floorY + Math.min(piece.radius, 0.16);
      if (piece.mesh.position.y < floorContact) {
        piece.mesh.position.y = floorContact;
        if (Math.abs(piece.velocity.y) > 0.7) piece.velocity.y = Math.abs(piece.velocity.y) * 0.17;
        else piece.velocity.y = 0;
        piece.velocity.x *= 0.72;
        piece.velocity.z *= 0.72;
        piece.spin.multiplyScalar(0.72);
        if (piece.velocity.lengthSq() < 0.055) piece.velocity.set(0, 0, 0);
      }
    }
  }

  function respawnShabtiRandomly(state, playerPosition) {
    let spawn = state.origin.clone();
    for (let attempt = 0; attempt < 36; attempt++) {
      const candidate = new THREE.Vector3(
        combatBounds.minX + 1.1 + Math.random() * (combatBounds.maxX - combatBounds.minX - 2.2),
        floorY,
        combatBounds.minZ + 1.1 + Math.random() * (combatBounds.maxZ - combatBounds.minZ - 2.2)
      );
      const farFromPlayer = candidate.distanceTo(playerPosition) > 5.2;
      const farFromOthers = shabtiWarriors.every(other =>
        other === state || !other.active || candidate.distanceTo(other.group.position) > 2.8
      );
      if (farFromPlayer && farFromOthers) { spawn = candidate; break; }
    }
    state.origin.copy(spawn);
    state.group.position.copy(spawn);
    state.group.rotation.set(0, 0, 0);
    state.group.scale.setScalar(state.miniScale);
    state.group.visible = true;
    state.warriorForm.visible = true;
    state.scanRoot.visible = false;
    state.group.traverse(object => { if (object.userData?.miniatureOnly) object.visible = true; });
    state.health = 2;
    state.spawnProgress = 0;
    state.hitAt = 0;
    state.defeatTime = 0;
    state.magicRespawnTimer = 0;
    state.active = true;
    state.defeated = false;
    state.aiState = 'approach';
    state.windup = 0; state.strike = 0; state.strikeResolved = false;
    state.attackCooldown = 0.85 + Math.random() * 0.55;
    state.swordArm.rotation.set(0, 0, -0.78);
    state.shieldArm.rotation.set(0, 0, 0.78);
    state.leftLeg.visible = false; state.rightLeg.visible = false;
    state.leftLeg.rotation.set(0, 0, 0); state.rightLeg.rotation.set(0, 0, 0);
    state.aura.position.copy(spawn);
    state.aura.visible = true;
    state.aura.scale.setScalar(1);
    state.beamMat.opacity = 0.16;
  }

  function findHaDiTarget({ position, forward, zone }) {
    if (zone !== 'training' || !shabtiActive) return null;
    const aim = forward.clone().setY(0).normalize();
    return shabtiWarriors
      .filter(state => state.active && state.spawnProgress >= 0.92)
      .map(state => {
        const targetPosition = state.group.position.clone().add(new THREE.Vector3(0, 1.05 * state.fullScale, 0));
        const distance = targetPosition.distanceTo(position);
        const direction = targetPosition.clone().sub(position).setY(0);
        const alignment = direction.lengthSq() > 0.001 ? direction.normalize().dot(aim) : -1;
        return { state, position: targetPosition, distance, alignment };
      })
      .filter(target => target.distance >= 3.5 && target.distance <= 12.5 && target.alignment >= 0.78)
      .sort((a, b) => a.distance - b.distance)[0] || null;
  }

  function applyHaDi(target) {
    const state = target?.state || target;
    if (!shabtiActive || !state?.active || state.spawnProgress < 0.92) return false;
    removeShabtiCollider(state);
    createShabtiDebris(state);
    state.active = false;
    state.defeated = true;
    state.defeatTime = 0;
    state.magicRespawnTimer = 13.1; // aguarda o fade completo das lascas antes do retorno
    state.aiState = 'magic-destroyed';
    state.aura.visible = false;
    state.group.visible = false;
    // O interactable acompanha o grupo; escondê-lo também evita prompt sobre uma estatueta invisível.
    state.group.position.y = floorY - 100;
    return true;
  }

  function startShabtiChallenge() {
    shabtiActive=true; shabtiRemaining=shabtiWarriors.length;
    playerHealth=maxPlayerHealth; playerInvulnerability=0;
    for(const state of shabtiWarriors){
      removeShabtiCollider(state); state.health=2; state.spawnProgress=0; state.magicRespawnTimer=0; state.aiState='approach';
      state.windup=0;state.strike=0;state.strikeResolved=false;state.attackCooldown=.7+state.index*.22;state.moveSpeed=1.18+(state.index%2)*.15;
      state.hitAt=0;state.defeatTime=0;state.active=true;state.defeated=false;state.marked=false;
      state.group.visible=true;state.group.position.copy(state.origin);state.group.rotation.set(0,0,0);state.group.scale.setScalar(state.miniScale);
      state.warriorForm.visible=true;state.scanRoot.visible=false;
      state.swordArm.rotation.set(0,0,-.78);state.shieldArm.rotation.set(0,0,.78);state.leftLeg.visible=false;state.rightLeg.visible=false;
      state.leftLeg.rotation.set(0,0,0);state.rightLeg.rotation.set(0,0,0);
      state.group.traverse(obj=>{if(obj.userData?.miniatureOnly)obj.visible=true;});
      state.aura.visible=true;state.aura.position.copy(state.origin);state.aura.scale.setScalar(1);state.beamMat.opacity=.16;
    }
  }
  function completeShabti(state,reason){
    if(!state?.active)return null;
    state.active=false;state.defeated=true;state.defeatTime=2.4;removeShabtiCollider(state);shabtiRemaining=Math.max(0,shabtiRemaining-1);
    if(shabtiRemaining===0){shabtiActive=false;return reason+' A prova terminou: todos os quatro shabtis foram neutralizados.';}
    return reason+' Restam '+shabtiRemaining+' guerreiros.';
  }

  // Quadro-negro físico para a aula. A existência de um quadro é adaptação visual:
  // o romance descreve a atividade Magic Problem-Solving 101 / Whatever Works, não o objeto.
  const problemBoard = new THREE.Group();
  problemBoard.name = 'quadro-negro físico da aula Whatever Works';
  problemBoard.position.set(westWallX + 0.34, floorY + 2.03, 12.45);
  problemBoard.rotation.y = Math.PI / 2;
  const problemBoardBacking = new THREE.Mesh(new THREE.BoxGeometry(2.58, 2.0, 0.18), woodDark);
  problemBoardBacking.name = 'corpo espesso de madeira do quadro';
  problemBoard.add(problemBoardBacking);
  const chalkCanvas = document.createElement('canvas');
  chalkCanvas.width = 1024; chalkCanvas.height = 768;
  const chalkCtx = chalkCanvas.getContext('2d');
  chalkCtx.fillStyle = '#253c35'; chalkCtx.fillRect(0, 0, 1024, 768);
  let chalkSeed = 43129;
  const chalkRandom = () => { chalkSeed = (chalkSeed * 1664525 + 1013904223) >>> 0; return chalkSeed / 4294967296; };
  for(let i=0;i<4200;i++){
    const x=chalkRandom()*1024, y=chalkRandom()*768, r=.5+chalkRandom()*1.8;
    chalkCtx.fillStyle=chalkRandom()>.5?'rgba(244,239,220,.075)':'rgba(9,19,17,.10)';
    chalkCtx.beginPath();chalkCtx.arc(x,y,r,0,Math.PI*2);chalkCtx.fill();
  }
  chalkCtx.strokeStyle='rgba(235,228,206,.72)';chalkCtx.lineWidth=5;chalkCtx.strokeRect(24,24,976,720);
  chalkCtx.fillStyle='#f2e8ce';chalkCtx.textAlign='center';
  chalkCtx.font='bold 49px Georgia';chalkCtx.fillText('MAGIC PROBLEM-SOLVING 101',512,135);
  chalkCtx.strokeStyle='rgba(218,199,158,.8)';chalkCtx.lineWidth=3;
  chalkCtx.beginPath();chalkCtx.moveTo(120,177);chalkCtx.lineTo(904,177);chalkCtx.stroke();
  chalkCtx.font='bold 75px Georgia';chalkCtx.fillText('WHATEVER WORKS',512,292);
  chalkCtx.font='italic 35px Georgia';chalkCtx.fillText('A aula de combate de Carter',512,359);
  chalkCtx.font='bold 34px Georgia';chalkCtx.fillText('DESPERTE OS QUATRO SHABTIS',512,466);
  chalkCtx.font='30px Georgia';chalkCtx.fillText('Use o que funcionar para neutralizá-los.',512,528);
  chalkCtx.font='27px Georgia';chalkCtx.fillText('SA-PER  ·  HA-DI  ·  KHOPESH  ·  BASQUETE',512,603);
  chalkCtx.strokeStyle='rgba(234,224,195,.55)';chalkCtx.lineWidth=4;
  chalkCtx.beginPath();chalkCtx.moveTo(270,653);chalkCtx.lineTo(754,653);chalkCtx.stroke();
  const chalkTexture = new THREE.CanvasTexture(chalkCanvas);
  chalkTexture.colorSpace = THREE.SRGBColorSpace;
  const chalkFace = new THREE.Mesh(
    new THREE.PlaneGeometry(2.38, 1.78),
    new THREE.MeshBasicMaterial({ map: chalkTexture, toneMapped: false })
  );
  chalkFace.name = 'superfície verde de giz do quadro';
  chalkFace.position.z = 0.096;
  problemBoard.add(chalkFace);

  // Moldura em madeira, friso metálico e bandeja inferior com pedaços de giz.
  for (const [x,y,w,h] of [
    [0,0.97,2.62,0.11],[0,-0.97,2.62,0.11],[-1.255,0,0.11,1.96],[1.255,0,0.11,1.96]
  ]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(w,h,0.24), darkBronze);
    rail.name = 'moldura de madeira do quadro';
    rail.position.set(x,y,0.04);
    problemBoard.add(rail);
  }
  const chalkTray = new THREE.Mesh(new THREE.BoxGeometry(2.42,0.09,0.34), woodDark);
  chalkTray.name = 'bandeja inferior do quadro';
  chalkTray.position.set(0,-1.08,0.18);
  problemBoard.add(chalkTray);
  const chalkPieceMat = new THREE.MeshStandardMaterial({ color: 0xe8dfc8, roughness: 0.9 });
  for(let i=0;i<4;i++){
    const chalk = new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,.14,8),chalkPieceMat);
    chalk.rotation.z=Math.PI/2;
    chalk.position.set(-.72+i*.13,-1.015,.28);
    problemBoard.add(chalk);
  }
  const eraser = new THREE.Mesh(new THREE.BoxGeometry(.19,.055,.12),new THREE.MeshStandardMaterial({color:0x9c7655,roughness:.88}));
  eraser.position.set(.68,-1.015,.27);
  problemBoard.add(eraser);
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
    hinge.position.set(eastWallX - 0.55, floorY, centerZ + side * openingHalf);
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
    position: new THREE.Vector3(eastWallX - 0.55, floorY + 1.6, centerZ), radius: 2.5,
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
            minX: eastWallX - 0.67, maxX: eastWallX - 0.43,
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
      // O disco solar vazado fica vertical e voltado para a quadra. A bola deve atravessar
      // o plano do aro e passar pelo círculo livre de 45 cm, descontando seu próprio raio.
      for (const hoop of hoops) {
        const crossedPlane=hoop.approachDirection<0
          ? previousZ>hoop.position.z&&ball.position.z<=hoop.position.z&&ballVelocity.z<0
          : previousZ<hoop.position.z&&ball.position.z>=hoop.position.z&&ballVelocity.z>0;
        const radialDistance=Math.hypot(ball.position.x-hoop.position.x,ball.position.y-hoop.position.y);
        if(!ballHitShabti&&crossedPlane&&radialDistance<(hoop.clearRadius||0.105)){
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
    updateShabtiDebris(dt);
    for (const state of shabtiWarriors) {
      if (state.magicRespawnTimer > 0) {
        if (shabtiActive) {
          state.magicRespawnTimer = Math.max(0, state.magicRespawnTimer - dt);
          if (state.magicRespawnTimer <= 0) respawnShabtiRandomly(state, playerPosition);
        } else {
          state.magicRespawnTimer = 0;
          state.group.visible = true;
          state.group.position.copy(state.origin);
          state.group.rotation.set(0, 0, 0);
          state.group.scale.setScalar(state.miniScale);
          state.warriorForm.visible=false;state.scanRoot.visible=true;
          state.group.traverse(object => { if (object.userData?.miniatureOnly) object.visible = true; });
          state.defeated = false;
          state.spawnProgress = 1;
          state.aura.visible = false;
        }
      }
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
        const warriorPose=THREE.MathUtils.smoothstep(state.spawnProgress,.22,.9);
        state.swordArm.rotation.set(0,0,THREE.MathUtils.lerp(-.78,-.18,warriorPose));
        state.shieldArm.rotation.set(0,0,THREE.MathUtils.lerp(.78,.18,warriorPose));
        state.leftLeg.visible=warriorPose>.76;state.rightLeg.visible=warriorPose>.76;
        state.leftLeg.rotation.set(0,0,0);state.rightLeg.rotation.set(0,0,0);state.group.rotation.x=0;
        if(state.spawnProgress>.88&&!state.collider)addShabtiCollider(state);
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
              if(!blocked){enemyPosition.x=THREE.MathUtils.clamp(nextX,combatBounds.minX,combatBounds.maxX);enemyPosition.z=THREE.MathUtils.clamp(nextZ,combatBounds.minZ,combatBounds.maxZ);}
            }
            const gaitPhase=time*9+state.index*1.7;
            const stride=Math.sin(gaitPhase)*.42;
            state.leftLeg.rotation.set(stride,0,Math.sin(gaitPhase)*.035);
            state.rightLeg.rotation.set(-stride,0,-Math.sin(gaitPhase)*.035);
            state.swordArm.rotation.set(-.12+Math.sin(gaitPhase+Math.PI)*.18,Math.sin(gaitPhase)*.08,-.08+Math.sin(gaitPhase)*.07);
            state.swordForearm.rotation.set(-.34+Math.sin(gaitPhase+1)*.12,0,.04);
            state.shieldArm.rotation.set(.12+Math.sin(gaitPhase)*.08,0,.08);
            state.shieldForearm.rotation.set(.18+Math.cos(gaitPhase)*.08,0,0);
            state.group.rotation.x=Math.sin(gaitPhase*2)*.018;
            state.group.position.y=floorY+Math.abs(Math.sin(gaitPhase))*.035;
          } else if(distance<=2.25&&state.attackCooldown<=0&&state.spawnProgress>=1){state.aiState='windup';state.windup=.72;state.strikeResolved=false;}
          else state.attackCooldown=Math.max(0,state.attackCooldown-dt);
        } else if(state.aiState==='windup'){
          state.windup=Math.max(0,state.windup-dt);
          const charge=1-state.windup/.72;
          const pullback=charge*charge*(3-2*charge);
          state.group.rotation.x=-.035-.15*pullback;
          state.group.rotation.z=-.035-Math.sin(time*13+state.index)*.018;
          state.swordArm.rotation.set(-.38-1.02*pullback,.12*pullback,-.08-.22*pullback);
          state.swordForearm.rotation.set(-.25-.72*pullback,0,.06);
          state.shieldArm.rotation.set(.2+.55*pullback,0,.12);
          state.shieldForearm.rotation.set(.22+.24*pullback,0,0);
          if(state.windup<=0){state.aiState='strike';state.strike=.42;state.strikeResolved=false;}
        } else if(state.aiState==='strike'){
          state.strike=Math.max(0,state.strike-dt);
          const phase=1-state.strike/.42;
          const swing=THREE.MathUtils.smoothstep(phase,0.02,.76);
          const recoil=THREE.MathUtils.smoothstep(phase,.76,1);
          state.swordArm.rotation.set(-1.4+2.15*swing-.16*recoil,.18*Math.sin(phase*Math.PI),-.28+.42*Math.sin(phase*Math.PI));
          state.swordForearm.rotation.set(-.92+.52*swing+.18*recoil,0,.12*Math.sin(phase*Math.PI));
          state.shieldArm.rotation.set(.74-.3*swing,0,.14);
          state.shieldForearm.rotation.set(.42-.16*swing,0,0);
          state.group.rotation.x=-.16+.11*Math.sin(phase*Math.PI);
          state.group.rotation.y=faceYaw+Math.sin(phase*Math.PI)*.12;
          if(!state.strikeResolved&&state.strike<.25){
            state.strikeResolved=true;
            if(distance<2.8&&playerInvulnerability<=0){
              playerHealth=Math.max(0,playerHealth-1);playerInvulnerability=1.35;
              onPlayerHit({
                damage:1,
                health:playerHealth,
                maxHealth:maxPlayerHealth,
                warrior:state.index,
                attacker:enemyPosition.clone(),
                playerPosition:playerPosition.clone()
              });
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
          state.attackCooldown=Math.max(0,state.attackCooldown-dt);
          const recovery=THREE.MathUtils.clamp(state.attackCooldown/1.15,0,1);
          state.swordArm.rotation.set(-.18-.18*recovery,0,-.08*recovery);
          state.swordForearm.rotation.set(-.22*recovery,0,0);
          state.shieldArm.rotation.set(.2+.12*recovery,0,.05*recovery);
          state.shieldForearm.rotation.set(.16*recovery,0,0);
          state.group.rotation.x*=.82;
          if(state.attackCooldown<=0)state.aiState='approach';
        }
        if(state.collider){
          const halfX=.46*state.fullScale,halfZ=.42*state.fullScale;
          state.collider.minX=enemyPosition.x-halfX;state.collider.maxX=enemyPosition.x+halfX;
          state.collider.minY=floorY;state.collider.maxY=floorY+2.25*state.fullScale;
          state.collider.minZ=enemyPosition.z-halfZ;state.collider.maxZ=enemyPosition.z+halfZ;
        }
      } else {state.group.rotation.x*=.82;state.group.rotation.z*=.82;}
      if(state.defeatTime>0){
        state.defeatTime=Math.max(0,state.defeatTime-dt);const collapse=1-state.defeatTime/2.4,reverse=collapse*collapse*(3-2*collapse);
        state.group.scale.setScalar(THREE.MathUtils.lerp(state.fullScale,state.miniScale,reverse));
        if(state.defeatTime<=0){
          state.group.visible=true;state.group.position.copy(state.origin);state.group.rotation.set(0,0,0);state.group.scale.setScalar(state.miniScale);
          state.warriorForm.visible=false;state.scanRoot.visible=true;
          state.spawnProgress=1;state.aura.visible=false;state.swordArm.rotation.set(0,0,-.78);state.shieldArm.rotation.set(0,0,.78);
          state.leftLeg.visible=false;state.rightLeg.visible=false;state.leftLeg.rotation.set(0,0,0);state.rightLeg.rotation.set(0,0,0);
          state.group.traverse(obj=>{if(obj.userData?.miniatureOnly)obj.visible=true;});
        }
      }
    }
    for (const target of targets) {
      const glowing = target.hitUntil > time;
      target.glow.material = glowing ? whiteGlow : target.restMaterial;
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
  addWallLabel('SALA DE TREINAMENTO', centerX, floorY + 3.0, room.maxZ - 0.62, Math.PI);
  addWallLabel('MAGIC PROBLEM-SOLVING 101', centerX, floorY + 3.0, room.minZ + 0.62, 0);

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
    findHaDiTarget,
    applyHaDi,
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

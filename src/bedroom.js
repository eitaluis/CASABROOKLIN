import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

/*
 * Carter's bedroom — shared desktop/mobile scene.
 * Tevy models are pinned CC0 GLBs; the procedural fallbacks remain available
 * whenever an upstream model or texture cannot be fetched.
 */
export function buildBedroom({
  THREE, scene, renderer, colliders = [], groundSurfaces = [],
  interactables = [], isTouchDevice = false, floorY = 20.625
}) {
  const root = new THREE.Group();
  root.name = 'CartersBedroomAssetFirst';
  scene.add(root);

  const room = {
    minX: 18.4, maxX: 31.6,
    minZ: -6.7, maxZ: 5.7,
    centerX: 25, centerZ: -0.5,
    floorY,
    wallHeight: 4.2
  };
  const wallY = floorY + room.wallHeight / 2;
  const topY = floorY + room.wallHeight;

  const mat = {
    wall: new THREE.MeshStandardMaterial({ color: 0xd6cbbb, roughness: 0.93 }),
    warmWall: new THREE.MeshStandardMaterial({ color: 0xbcae96, roughness: 0.91 }),
    walnut: new THREE.MeshStandardMaterial({ color: 0x573b2b, roughness: 0.72 }),
    walnutLight: new THREE.MeshStandardMaterial({ color: 0x8a6242, roughness: 0.78 }),
    brass: new THREE.MeshStandardMaterial({ color: 0xb18b50, metalness: 0.72, roughness: 0.31 }),
    bronze: new THREE.MeshStandardMaterial({ color: 0x76542e, metalness: 0.66, roughness: 0.43 }),
    ivory: new THREE.MeshStandardMaterial({ color: 0xe4d8bc, roughness: 0.78 }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0xb9d0d3, metalness: 0.04, roughness: 0.08,
      transmission: 0.82, thickness: 0.025, transparent: true,
      opacity: 0.42, side: THREE.DoubleSide
    }),
    frosted: new THREE.MeshPhysicalMaterial({
      color: 0xd5dfdc, metalness: 0.02, roughness: 0.36,
      transmission: 0.35, thickness: 0.035, transparent: true,
      opacity: 0.72, side: THREE.DoubleSide
    }),
    darkGlass: new THREE.MeshStandardMaterial({
      color: 0x080d11, metalness: 0.42, roughness: 0.2,
      emissive: 0x07111a, emissiveIntensity: 0.18
    }),
    tile: new THREE.MeshStandardMaterial({ color: 0xd2cfc4, roughness: 0.32, metalness: 0.03 }),
    linen: new THREE.MeshStandardMaterial({ color: 0xeee9dd, roughness: 0.98 }),
    duvet: new THREE.MeshStandardMaterial({ color: 0xd9d5ca, roughness: 0.98 }),
    leather: new THREE.MeshStandardMaterial({ color: 0x79543d, roughness: 0.74 }),
    black: new THREE.MeshStandardMaterial({ color: 0x171a1a, roughness: 0.53, metalness: 0.38 })
  };

  function addBox(name, position, size, material, parent = root, cast = true) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(size[0], size[1], size[2]),
      material
    );
    mesh.name = name;
    mesh.position.set(position[0], position[1], position[2]);
    mesh.castShadow = cast;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function addSphere(name, position, scale, material, parent = root, segments = 16) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, segments, Math.max(8, Math.floor(segments * 0.7))),
      material
    );
    mesh.name = name;
    mesh.position.set(position[0], position[1], position[2]);
    mesh.scale.set(scale[0], scale[1], scale[2]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function addCylinder(name, position, radiusTop, radiusBottom, height, material, parent = root, segments = 20) {
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments, 1),
      material
    );
    mesh.name = name;
    mesh.position.set(position[0], position[1], position[2]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function addBeam(name, a, b, radius, material, parent = root) {
    const va = new THREE.Vector3(a[0], a[1], a[2]);
    const vb = new THREE.Vector3(b[0], b[1], b[2]);
    const delta = new THREE.Vector3().subVectors(vb, va);
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, delta.length(), 10),
      material
    );
    mesh.name = name;
    mesh.position.copy(va).add(vb).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function addCollider(x, y, z, width, height, depth) {
    const collider = {
      minX: x - width / 2, maxX: x + width / 2,
      minY: y - height / 2, maxY: y + height / 2,
      minZ: z - depth / 2, maxZ: z + depth / 2
    };
    colliders.push(collider);
    return collider;
  }

  function addWall(name, x, y, z, sx, sy, sz, material = mat.wall) {
    const wall = addBox(name, [x, y, z], [sx, sy, sz], material);
    addCollider(x, y, z, sx, sy, sz);
    return wall;
  }

  // Continuous floor and open-plan bedroom shell.
  const floor = addBox('piso de nogueira do quarto de Carter',
    [25, floorY - 0.16, -0.5], [13.2, 0.32, 12.4], mat.walnutLight);
  groundSurfaces.push(floor);

  addWall('parede norte em reboco mineral', 25, wallY, -6.7, 13.2, 4.2, 0.34);
  // The south wall includes the locked connecting door to Sadie's adjoining room.
  addWall('parede sul com painel egípcio — trecho oeste', 19.4875, wallY, 5.7, 2.175, 4.2, 0.34);
  addWall('parede sul com painel egípcio — trecho leste', 26.7625, wallY, 5.7, 9.675, 4.2, 0.34);
  addBox('ombreira oeste da porta de Sadie', [20.575, floorY + 1.42, 5.7],
    [0.13, 2.84, 0.38], mat.brass);
  addBox('ombreira leste da porta de Sadie', [21.925, floorY + 1.42, 5.7],
    [0.13, 2.84, 0.38], mat.brass);
  addBox('verga de calcário da porta de Sadie', [21.25, floorY + 3.36, 5.7],
    [1.55, 0.92, 0.38], mat.warmWall);
  const sadieDoor = addBox('porta de madeira para o quarto adjacente de Sadie',
    [21.25, floorY + 1.18, 5.7], [1.28, 2.34, 0.12], mat.walnut);
  addBox('filete vertical de bronze na porta de Sadie', [21.25, floorY + 1.18, 5.625],
    [0.055, 2.08, 0.025], mat.brass);
  addBox('maçaneta de bronze da porta de Sadie', [21.72, floorY + 1.18, 5.59],
    [0.055, 0.14, 0.055], mat.brass);
  const sadieDoorCollider = addCollider(21.25, floorY + 1.18, 5.7, 1.28, 2.34, 0.18);

  // The west side remains an open passage to the residential corridor.
  addWall('parede oeste antes da passagem', 18.4, wallY, -4.35, 0.34, 4.2, 4.7);
  addWall('parede oeste depois da passagem', 18.4, wallY, 3.7, 0.34, 4.2, 4.0);
  addBox('verga de calcário da entrada', [18.4, floorY + 3.55, -0.5],
    [0.42, 1.3, 3.5], mat.warmWall);

  for (const z of [-2.25, 1.25]) {
    addBox('ombreira de calcário da entrada', [18.58, floorY + 1.45, z],
      [0.38, 2.9, 0.22], mat.brass);
  }

  // Open sightline across the room: no central partition.
  // East side uses a full-height glazed opening towards the East River.
  const frameY = floorY + 1.38;
  addBox('caixilho superior da fachada envidraçada', [31.6, topY - 0.12, -0.5],
    [0.18, 0.22, 12.4], mat.brass);
  addBox('trilho inferior das portas de vidro', [31.6, floorY + 0.055, -0.5],
    [0.2, 0.11, 12.4], mat.bronze);
  for (const z of [-6.55, -3.0, 2.0, 5.55]) {
    addBox('montante vertical da fachada envidraçada', [31.6, frameY, z],
      [0.16, 2.75, 0.12], mat.brass);
  }

  for (const z of [-4.6, 3.65]) {
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.62), mat.glass);
    pane.name = 'vidro fixo panorâmico do quarto';
    pane.rotation.y = Math.PI / 2;
    pane.position.set(31.59, floorY + 1.4, z);
    pane.castShadow = false;
    root.add(pane);
  }

  const doorPanelA = addBox('folha móvel esquerda da porta de vidro',
    [31.58, floorY + 1.38, -1.55], [0.075, 2.64, 2.2], mat.glass);
  const doorPanelB = addBox('folha móvel direita da porta de vidro',
    [31.58, floorY + 1.38, 0.55], [0.075, 2.64, 2.2], mat.glass);
  addBox('puxador de bronze da porta panorâmica', [31.48, floorY + 1.4, -0.48],
    [0.06, 0.78, 0.07], mat.brass);
  let doorUnlocked = false;
  let doorOpen = false;
  let doorProgress = 0;
  const deckDoorCollider = addCollider(31.6, floorY + 1.35, -0.5, 0.24, 2.7, 4.4);

  // Private deck extension; it is part of the same walkable zone and scene.
  const deckFloor = addBox('deck privativo de madeira sobre o East River',
    [35.0, floorY - 0.16, -0.5], [6.8, 0.32, 11.2], mat.walnut);
  groundSurfaces.push(deckFloor);
  addBox('soleira de bronze entre quarto e deck', [31.82, floorY + 0.02, -0.5],
    [0.24, 0.08, 4.6], mat.brass);
  for (const z of [-5.75, 4.75]) {
    addBox('mureta baixa lateral do deck', [34.85, floorY + 0.38, z],
      [6.0, 0.76, 0.16], mat.walnut);
    addBox('corrimão de bronze do deck', [34.85, floorY + 0.82, z],
      [6.0, 0.09, 0.09], mat.brass);
  }
  for (let i = 0; i < 5; i++) {
    const x = 32.3 + i * 1.25;
    addBox('ripa de piso do deck', [x, floorY + 0.012, -0.5],
      [0.045, 0.018, 10.9], mat.bronze, root, false);
  }
  const deckRailGlass = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 1.02, 10.35), mat.glass
  );
  deckRailGlass.name = 'guarda-corpo de vidro do deck';
  deckRailGlass.position.set(38.15, floorY + 0.55, -0.5);
  root.add(deckRailGlass);
  addBox('corrimão contínuo de bronze do deck',
    [38.15, floorY + 1.08, -0.5], [0.12, 0.10, 10.5], mat.brass);
  addCollider(38.15, floorY + 0.55, -0.5, 0.16, 1.1, 10.5);

  // Small ensuite in the far corner; glass keeps it visually subordinate,
  // rather than cutting the bedroom into two halves.
  const bathFloor = addBox('piso de limestone do banheiro privativo',
    [21.0, floorY + 0.015, -4.35], [4.9, 0.04, 4.65], mat.tile);
  for (let x = 18.75; x < 23.25; x += 0.42) {
    addBox('junta de pedra do banheiro', [x, floorY + 0.038, -4.35],
      [0.012, 0.008, 4.55], mat.brass, root, false);
  }
  addWall('divisória de vidro do banheiro', 23.38, floorY + 1.5, -4.35,
    0.09, 3.0, 4.65, mat.frosted);
  // The lower ensuite partition is split around a 1.05 m doorway.
  const bathWallLeft = addBox('painel de vidro esquerdo do banheiro',
    [19.72, floorY + 1.5, -2.02], [2.28, 3.0, 0.09], mat.frosted);
  const bathWallRight = addBox('painel de vidro direito do banheiro',
    [22.62, floorY + 1.5, -2.02], [1.37, 3.0, 0.09], mat.frosted);
  addCollider(19.72, floorY + 1.5, -2.02, 2.28, 3.0, 0.09);
  addCollider(22.62, floorY + 1.5, -2.02, 1.37, 3.0, 0.09);
  const bathDoor = addBox('porta de correr de vidro fosco do banheiro',
    [21.4, floorY + 1.25, -2.02], [1.0, 2.5, 0.07], mat.frosted);
  const bathDoorCollider = addCollider(21.4, floorY + 1.25, -2.02, 1.0, 2.5, 0.12);
  let bathDoorOpen = false;

  // Continuous ceiling panel closes the room shell; beams remain visible below it.
  addBox('forro contínuo de nogueira do quarto', [25, topY + 0.11, -0.5],
    [13.2, 0.22, 12.4], mat.walnut);

  // Architectural finish: wood ceiling beams, recessed light and Egyptian detailing.
  for (let x = 19.2; x <= 31.0; x += 3.0) {
    addBox('viga de cedro do teto residencial', [x, topY - 0.04, -0.5],
      [0.12, 0.16, 12.1], mat.walnut);
  }
  for (let z = -5.0; z <= 4.0; z += 3.0) {
    const lamp = new THREE.PointLight(0xffd5a2, 0.48, 8.5);
    lamp.position.set(27.0, topY - 0.45, z);
    root.add(lamp);
    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 12, 8),
      new THREE.MeshStandardMaterial({
        color: 0xffe5bd, emissive: 0xffc67c, emissiveIntensity: 1.05
      })
    );
    bulb.position.copy(lamp.position);
    root.add(bulb);
  }

  const plaqueCanvas = document.createElement('canvas');
  plaqueCanvas.width = 512; plaqueCanvas.height = 128;
  const plaqueCtx = plaqueCanvas.getContext('2d');
  plaqueCtx.fillStyle = '#211b17'; plaqueCtx.fillRect(0, 0, 512, 128);
  plaqueCtx.strokeStyle = '#b18b50'; plaqueCtx.lineWidth = 5;
  plaqueCtx.strokeRect(8, 8, 496, 112);
  plaqueCtx.fillStyle = '#e1c99a'; plaqueCtx.textAlign = 'center';
  plaqueCtx.font = 'bold 34px Georgia,serif';
  plaqueCtx.fillText('CARTER KANE  ·  QUARTO', 256, 78);
  const plaqueTexture = new THREE.CanvasTexture(plaqueCanvas);
  plaqueTexture.colorSpace = THREE.SRGBColorSpace;
  const plaque = new THREE.Mesh(
    new THREE.PlaneGeometry(2.8, 0.7),
    new THREE.MeshBasicMaterial({ map: plaqueTexture, transparent: true, side: THREE.DoubleSide })
  );
  plaque.name = 'placa discreta do quarto de Carter';
  plaque.position.set(25, floorY + 3.08, -6.48);
  root.add(plaque);

  // Egyptian ivory headrest, sculpted as its own small object; based on the
  // historical lion-headrest type (GEM object 270), not a conventional pillow.
  function createHeadrest() {
    const headrest = new THREE.Group();
    headrest.name = 'apoio de cabeça egípcio de marfim com leões';
    const ivory = new THREE.MeshStandardMaterial({ color: 0xe1d4b6, roughness: 0.76 });
    const ivoryLight = new THREE.MeshStandardMaterial({ color: 0xf0e6cf, roughness: 0.7 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x4d3928, roughness: 0.88 });
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.027, 0.13), ivory);
    base.position.y = 0.016;
    base.castShadow = true; headrest.add(base);

    function ellipsoid(name, p, s, material) {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12), material);
      mesh.name = name; mesh.position.set(p[0], p[1], p[2]);
      mesh.scale.set(s[0], s[1], s[2]); mesh.castShadow = true;
      mesh.receiveShadow = true; headrest.add(mesh); return mesh;
    }
    function tail(points) {
      const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(p[0], p[1], p[2])));
      const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 20, 0.008, 7, false), ivory);
      headrest.add(mesh);
    }

    for (const side of [-1, 1]) {
      ellipsoid('corpo reclinado do leão', [side * 0.112, 0.066, 0], [0.085, 0.033, 0.047], ivoryLight);
      ellipsoid('cabeça do leão', [side * 0.151, 0.075, 0], [0.035, 0.034, 0.035], ivory);
      ellipsoid('juba esculpida do leão', [side * 0.147, 0.072, 0], [0.039, 0.039, 0.041], ivory);
      ellipsoid('focinho do leão', [side * 0.169, 0.061, 0.004], [0.02, 0.016, 0.024], ivoryLight);
      for (const z of [-0.026, 0.026]) {
        ellipsoid('pata dianteira do leão', [side * 0.066, 0.039, z], [0.046, 0.014, 0.014], ivory);
        ellipsoid('pata traseira do leão', [side * 0.15, 0.04, z], [0.028, 0.014, 0.014], ivory);
      }
      ellipsoid('olho gravado do leão', [side * 0.172, 0.083, 0.031], [0.006, 0.006, 0.004], dark);
      tail([
        [side * 0.055, 0.07, -0.027],
        [side * 0.02, 0.10, -0.03],
        [side * -0.008, 0.08, -0.015]
      ]);
    }

    // Shu kneels at the centre, raising his arms to the curved head support.
    ellipsoid('tronco ajoelhado de Shu', [0, 0.075, 0], [0.026, 0.041, 0.026], ivory);
    ellipsoid('cabeça de Shu', [0, 0.125, 0], [0.022, 0.022, 0.021], ivoryLight);
    ellipsoid('perna esquerda de Shu', [-0.023, 0.043, 0.006], [0.03, 0.014, 0.021], ivory);
    ellipsoid('perna direita de Shu', [0.023, 0.043, 0.006], [0.03, 0.014, 0.021], ivory);
    addBeam('braço esquerdo elevado de Shu', [-0.017, 0.093, 0], [-0.044, 0.157, 0], 0.009, ivory, headrest);
    addBeam('braço direito elevado de Shu', [0.017, 0.093, 0], [0.044, 0.157, 0], 0.009, ivory, headrest);
    addSphere('mão esquerda de Shu', [-0.044, 0.157, 0], [0.012, 0.009, 0.012], ivory, headrest, 12);
    addSphere('mão direita de Shu', [0.044, 0.157, 0], [0.012, 0.009, 0.012], ivory, headrest, 12);

    const supportCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.115, 0.158, 0),
      new THREE.Vector3(-0.086, 0.181, 0),
      new THREE.Vector3(-0.04, 0.19, 0),
      new THREE.Vector3(0, 0.192, 0),
      new THREE.Vector3(0.04, 0.19, 0),
      new THREE.Vector3(0.086, 0.181, 0),
      new THREE.Vector3(0.115, 0.158, 0)
    ]);
    const support = new THREE.Mesh(new THREE.TubeGeometry(supportCurve, 40, 0.014, 10, false), ivoryLight);
    support.name = 'apoio curvo superior de marfim'; support.castShadow = true; headrest.add(support);

    // Incised hieroglyphic register on the front edge.
    for (let i = 0; i < 7; i++) {
      const sign = addBox('entalhe hieroglífico no marfim',
        [0.12 - i * 0.04, 0.032, 0.066], [0.006, 0.012, 0.003], dark, headrest, false);
      sign.rotation.z = (i % 2 ? 0.2 : -0.2);
    }
    headrest.scale.setScalar(0.92);
    return headrest;
  }

  const headrest = createHeadrest();
  // The headrest sits on the mattress surface; it is not a floating wall ornament.
  headrest.position.set(25.12, floorY + 0.77, 0.0);
  headrest.rotation.y = Math.PI / 2;
  root.add(headrest);

  // Local fallback furniture is shown immediately; CC0 GLBs replace it when ready.
  const fallback = {};
  fallback.bed = new THREE.Group(); fallback.bed.name = 'fallback cama king-size';
  addBox('estrutura estofada da cama', [26.2, floorY + 0.28, 0.0],
    [2.28, 0.52, 2.02], mat.leather, fallback.bed);
  addBox('colchão king-size', [26.2, floorY + 0.62, 0.0],
    [2.2, 0.25, 1.96], mat.linen, fallback.bed);
  addBox('edredom de linho', [26.55, floorY + 0.77, 0.02],
    [1.43, 0.06, 1.88], mat.duvet, fallback.bed);
  addBox('manta dobrada aos pés', [27.0, floorY + 0.82, 0.02],
    [0.53, 0.045, 1.9], mat.walnutLight, fallback.bed);
  addBox('cabeceira estofada baixa', [25.02, floorY + 0.98, 0.0],
    [0.22, 1.25, 2.1], mat.walnut, fallback.bed);
  root.add(fallback.bed);

  fallback.nightstand = new THREE.Group();
  addBox('criado-mudo de nogueira', [25.05, floorY + 0.28, -1.4],
    [0.48, 0.56, 0.42], mat.walnut, fallback.nightstand);
  addBox('frente da gaveta do criado-mudo', [24.80, floorY + 0.36, -1.4],
    [0.025, 0.24, 0.34], mat.walnutLight, fallback.nightstand);
  addBox('puxador de latão do criado-mudo', [24.77, floorY + 0.36, -1.4],
    [0.025, 0.035, 0.09], mat.brass, fallback.nightstand);
  root.add(fallback.nightstand);

  fallback.tv = new THREE.Group();
  addBox('console de nogueira da televisão', [27.1, floorY + 0.3, 5.05],
    [1.8, 0.5, 0.42], mat.walnut, fallback.tv);
  addBox('televisão de plasma', [27.1, floorY + 1.2, 5.03],
    [1.48, 0.86, 0.09], mat.black, fallback.tv);
  root.add(fallback.tv);

  fallback.desk = new THREE.Group();
  addBox('tampo da mesa de computador', [29.45, floorY + 0.76, 1.85],
    [1.45, 0.09, 0.72], mat.walnut, fallback.desk);
  for (const x of [28.85, 30.05]) for (const z of [1.58, 2.12]) {
    addBox('perna metálica da mesa', [x, floorY + 0.37, z],
      [0.045, 0.75, 0.045], mat.black, fallback.desk);
  }
  addBox('monitor do computador', [29.45, floorY + 1.32, 1.56],
    [0.92, 0.57, 0.07], mat.black, fallback.desk);
  root.add(fallback.desk);

  fallback.kitchenSink = new THREE.Group();
  addBox('módulo de pia da kitchenette', [26.1, floorY + 0.47, -6.15],
    [1.22, 0.94, 0.62], mat.walnut, fallback.kitchenSink);
  addBox('bancada clara da kitchenette', [26.1, floorY + 0.98, -6.15],
    [1.26, 0.06, 0.68], mat.ivory, fallback.kitchenSink);
  root.add(fallback.kitchenSink);

  fallback.kitchenDrawers = new THREE.Group();
  addBox('módulo de gavetas da kitchenette', [27.45, floorY + 0.47, -6.15],
    [0.62, 0.94, 0.62], mat.walnutLight, fallback.kitchenDrawers);
  root.add(fallback.kitchenDrawers);

  fallback.fridge = new THREE.Group();
  addBox('minigeladeira compacta', [29.55, floorY + 0.43, -6.15],
    [0.62, 0.86, 0.62], mat.black, fallback.fridge);
  addBox('porta de vidro da minigeladeira', [29.55, floorY + 0.43, -5.83],
    [0.53, 0.76, 0.035], mat.darkGlass, fallback.fridge);
  root.add(fallback.fridge);

  fallback.bathVanity = new THREE.Group();
  addBox('gabinete da pia do banheiro', [19.25, floorY + 0.45, -5.55],
    [0.82, 0.9, 0.5], mat.walnut, fallback.bathVanity);
  addBox('bancada de cerâmica do banheiro', [19.25, floorY + 0.93, -5.55],
    [0.88, 0.07, 0.54], mat.ivory, fallback.bathVanity);
  root.add(fallback.bathVanity);

  fallback.bathtub = new THREE.Group();
  addBox('banheira de porcelana', [21.2, floorY + 0.34, -3.2],
    [1.75, 0.64, 0.78], mat.linen, fallback.bathtub);
  root.add(fallback.bathtub);

  fallback.toilet = new THREE.Group();
  addBox('vaso sanitário cerâmico', [22.35, floorY + 0.38, -5.45],
    [0.42, 0.72, 0.66], mat.linen, fallback.toilet);
  root.add(fallback.toilet);

  // A small audio system is deliberately separate from the TV.
  const speakerFallback = new THREE.Group();
  for (const x of [25.75, 28.4]) {
    addBox('caixa acústica de nogueira', [x, floorY + 0.62, 4.55],
      [0.24, 0.66, 0.28], mat.walnut, speakerFallback);
    addCylinder('woofer da caixa acústica', [x, floorY + 0.64, 4.395],
      0.082, 0.082, 0.018, mat.black, speakerFallback, 20).rotation.x = Math.PI / 2;
    addCylinder('tweeter da caixa acústica', [x, floorY + 0.85, 4.395],
      0.035, 0.035, 0.018, mat.brass, speakerFallback, 16).rotation.x = Math.PI / 2;
  }
  root.add(speakerFallback);

  // Countertop snacks: ginger ale, a chocolate bar and fruit candy.
  function labelTexture(title, background, foreground) {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = background; ctx.fillRect(0, 0, 256, 128);
    ctx.fillStyle = foreground; ctx.textAlign = 'center';
    ctx.font = 'bold 28px Arial'; ctx.fillText(title, 128, 72);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }
  const gingerLabel = labelTexture('GINGER ALE', '#9b4a23', '#f6e5c4');
  const chocolateLabel = labelTexture('TWIX', '#a52c25', '#f4d88c');
  const candyLabel = labelTexture('SKITTLES', '#f1dfbf', '#d72d28');
  const can = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.055, 0.17, 20),
    new THREE.MeshStandardMaterial({ map: gingerLabel, metalness: 0.45, roughness: 0.34 })
  );
  can.name = 'lata de ginger ale de Carter';
  can.position.set(27.95, floorY + 1.12, -5.82);
  root.add(can);
  const twix = addBox('embalagem de chocolate Twix', [28.22, floorY + 1.08, -5.82],
    [0.22, 0.055, 0.07], new THREE.MeshStandardMaterial({ map: chocolateLabel, roughness: 0.55 }));
  twix.rotation.y = -0.12;
  const skittles = addBox('pacote de Skittles', [28.55, floorY + 1.1, -5.82],
    [0.16, 0.19, 0.07], new THREE.MeshStandardMaterial({ map: candyLabel, roughness: 0.63 }));
  skittles.rotation.z = -0.08;

  // Warm practical lights and a soft cool fill from the water.
  const bedsideLampBase = addCylinder('base da luminária de cabeceira',
    [24.98, floorY + 0.63, -1.4], 0.10, 0.10, 0.035, mat.brass);
  const bedsideStem = addCylinder('haste da luminária de cabeceira',
    [24.98, floorY + 0.82, -1.4], 0.018, 0.018, 0.36, mat.brass);
  const shade = new THREE.Mesh(
    new THREE.ConeGeometry(0.13, 0.18, 18, 1, true),
    new THREE.MeshStandardMaterial({ color: 0xe6d6b8, roughness: 0.83, side: THREE.DoubleSide })
  );
  shade.name = 'cúpula de tecido da luminária';
  shade.position.set(24.98, floorY + 1.05, -1.4);
  root.add(shade);
  const lampLight = new THREE.PointLight(0xffc887, 0.52, 5.5);
  lampLight.position.set(24.98, floorY + 1.0, -1.4);
  root.add(lampLight);

  const screenCanvas = document.createElement('canvas');
  screenCanvas.width = 512; screenCanvas.height = 288;
  const screenCtx = screenCanvas.getContext('2d');
  const screenTexture = new THREE.CanvasTexture(screenCanvas);
  screenTexture.colorSpace = THREE.SRGBColorSpace;
  const tvScreenMaterial = new THREE.MeshBasicMaterial({ map: screenTexture, toneMapped: false });
  const tvScreen = new THREE.Mesh(new THREE.PlaneGeometry(1.28, 0.72), tvScreenMaterial);
  tvScreen.name = 'tela ativa da televisão de plasma';
  tvScreen.position.set(27.1, floorY + 1.2, 4.995);
  tvScreen.rotation.y = Math.PI;
  root.add(tvScreen);
  let tvOn = true;
  function drawTvScreen() {
    screenCtx.fillStyle = tvOn ? '#13222b' : '#050708';
    screenCtx.fillRect(0, 0, 512, 288);
    if (tvOn) {
      const gradient = screenCtx.createLinearGradient(0, 0, 512, 288);
      gradient.addColorStop(0, '#d4a76e');
      gradient.addColorStop(0.5, '#47616a');
      gradient.addColorStop(1, '#17232d');
      screenCtx.fillStyle = gradient; screenCtx.fillRect(0, 0, 512, 288);
      screenCtx.fillStyle = 'rgba(255,235,198,.78)';
      screenCtx.font = 'bold 22px Georgia'; screenCtx.fillText('BROOKLYN  ·  EAST RIVER', 28, 252);
    }
    screenTexture.needsUpdate = true;
  }
  drawTvScreen();

  function loadDirectModel(label, url, position, rotationY, scale, fallbackGroup) {
    if (!loader) return;
    loader.load(url, gltf => {
      const model = gltf.scene;
      model.name = label;
      model.traverse(node => {
        if (!node.isMesh) return;
        node.castShadow = true;
        node.receiveShadow = true;
      });
      model.scale.setScalar(scale);
      const bounds = new THREE.Box3().setFromObject(model);
      const center = bounds.getCenter(new THREE.Vector3());
      model.position.x -= center.x;
      model.position.z -= center.z;
      model.position.y -= bounds.min.y;
      const placement = new THREE.Group();
      placement.name = label + ' — posicionamento';
      placement.position.set(position[0], position[1], position[2]);
      placement.rotation.y = rotationY;
      placement.add(model);
      root.add(placement);
      if (fallbackGroup) fallbackGroup.visible = false;
    }, undefined, error => {
      console.warn('CASABROOKLIN bedroom: ' + label + ' indisponível; fallback preservado.', error);
    });
  }

  // CC0 Tevy models — pinned versions, with a smaller LOD on touch devices.
  let loader = null;
  if (renderer) {
    try {
      const ktx2 = new KTX2Loader()
        .setTranscoderPath('https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/libs/basis/')
        .detectSupport(renderer);
      loader = new GLTFLoader().setKTX2Loader(ktx2).setMeshoptDecoder(MeshoptDecoder);
      loader.setCrossOrigin('anonymous');
    } catch (error) {
      console.warn('CASABROOKLIN bedroom: KTX2/GLTF loader unavailable; keeping local fallbacks.', error);
    }
  }

  function loadModel(label, slug, version, position, rotationY, scale, fallbackGroup, hidePattern = null) {
    if (!loader) return;
    const lod = isTouchDevice ? 'lod2' : 'lod1';
    const url = 'https://tevy.dev/models/' + slug + '/' + version + '/' + lod + '.glb';
    loader.load(url, gltf => {
      const model = gltf.scene;
      model.name = label + ' — ' + slug;
      model.traverse(node => {
        if (!node.isMesh) return;
        node.castShadow = true;
        node.receiveShadow = true;
        if (hidePattern && hidePattern.test(node.name || '')) node.visible = false;
      });
      model.scale.setScalar(scale);
      const bounds = new THREE.Box3().setFromObject(model);
      const center = bounds.getCenter(new THREE.Vector3());
      model.position.x -= center.x;
      model.position.z -= center.z;
      model.position.y -= bounds.min.y;
      const placement = new THREE.Group();
      placement.name = label + ' — posicionamento';
      placement.position.set(position[0], position[1], position[2]);
      placement.rotation.y = rotationY;
      placement.add(model);
      root.add(placement);
      if (fallbackGroup) fallbackGroup.visible = false;
    }, undefined, error => {
      console.warn('CASABROOKLIN bedroom: asset ' + slug + ' indisponível; fallback preservado.', error);
    });
  }

  loadModel('Cama king-size', 'double-bed', 'v1',
    [26.2, floorY, 0.0], Math.PI / 2, 1.08, fallback.bed, /pillow/i);
  loadModel('Criado-mudo', 'nightstand', 'v2',
    [25.05, floorY, -1.4], 0, 1.0, fallback.nightstand);
  loadModel('Televisão e console', 'tv-stand', 'v2',
    [27.1, floorY, 5.02], Math.PI, 1.0, fallback.tv);
  loadModel('Mesa e computador', 'office-desk', 'v2',
    [29.45, floorY, 1.85], -Math.PI / 2, 1.0, fallback.desk);
  loadModel('Armário de pia da kitchenette', 'kitchen-base-unit-sink', 'v1',
    [26.1, floorY, -6.15], 0, 1.0, fallback.kitchenSink);
  loadDirectModel('Geladeira compacta da kitchenette',
    'https://files.innerscene.com/library/undercounter-fridge-bef8ea56/b0630c86bd61b5170a0c/undercounter-fridge.glb',
    [29.55, floorY, -6.15], 0, 1.0, fallback.fridge);
  loadModel('Gaveteiro da kitchenette', 'kitchen-base-unit-drawers', 'v1',
    [27.45, floorY, -6.15], 0, 1.0, fallback.kitchenDrawers);
  loadModel('Pia de banheiro', 'bathroom-vanity', 'v1',
    [19.25, floorY, -5.55], 0, 1.0, fallback.bathVanity);
  loadModel('Banheira privativa', 'bathtub', 'v1',
    [21.2, floorY, -3.2], 0, 1.0, fallback.bathtub);
  loadModel('Vaso sanitário', 'toilet', 'v1',
    [22.35, floorY, -5.45], Math.PI, 1.0, fallback.toilet);
  loadModel('Caixa acústica esquerda', 'bookshelf-speaker', 'v1',
    [25.75, floorY + 0.28, 4.55], 0, 1.0, speakerFallback);
  loadModel('Caixa acústica direita', 'bookshelf-speaker', 'v1',
    [28.4, floorY + 0.28, 4.55], 0, 1.0, null);

  // Colliders for solid furniture, leaving the passage and deck opening clear.
  addCollider(26.2, floorY + 0.65, 0.0, 2.45, 1.3, 2.15);
  addCollider(27.1, floorY + 0.45, 5.05, 1.9, 1.0, 0.55);
  addCollider(29.45, floorY + 0.82, 1.85, 1.5, 1.65, 0.82);
  addCollider(26.65, floorY + 0.5, -6.15, 2.7, 1.1, 0.82);
  addCollider(29.55, floorY + 0.5, -6.15, 0.72, 1.0, 0.72);

  // Interaction points use the same shared E / INTERAGIR flow on desktop/mobile.
  interactables.push({
    name: 'Porta do quarto de Sadie',
    label: 'Porta para o quarto de Sadie',
    prompt: 'E / INTERAGIR · Tentar abrir a porta do quarto de Sadie',
    position: new THREE.Vector3(21.25, floorY + 1.08, 5.25),
    radius: 1.9,
    onInteract: () => 'A porta dá para o quarto contíguo de Sadie. Está trancada.'
  });
  interactables.push({
    name: 'Portas panorâmicas do deck',
    label: 'Portas do deck',
    prompt: 'E / INTERAGIR · Destrancar ou abrir as portas do deck',
    position: new THREE.Vector3(31.15, floorY + 1.1, -0.5),
    radius: 2.3,
    onInteract() {
      if (!doorUnlocked) {
        doorUnlocked = true;
        return 'Carter destranca as portas de vidro que dão para o deck.';
      }
      doorOpen = !doorOpen;
      return doorOpen ? 'As portas de vidro deslizam e liberam a passagem para o deck.' : 'As portas de vidro se fecham.';
    }
  });
  interactables.push({
    name: 'Apoio de cabeça egípcio',
    label: 'Apoio de cabeça de marfim',
    prompt: 'E / INTERAGIR · Examinar o apoio de cabeça egípcio',
    position: new THREE.Vector3(25.12, floorY + 1.02, 0.0),
    radius: 1.9,
    onInteract: () => 'O apoio de cabeça de marfim tem dois leões guardiões, Shu sustentando o arco e uma faixa de hieróglifos gravados.'
  });
  interactables.push({
    name: 'Televisão de plasma',
    label: 'Televisão',
    prompt: 'E / INTERAGIR · Ligar ou desligar a televisão',
    position: new THREE.Vector3(27.1, floorY + 1.25, 4.55),
    radius: 2.0,
    onInteract() {
      tvOn = !tvOn;
      drawTvScreen();
      return tvOn ? 'A televisão de plasma liga.' : 'A televisão de plasma desliga.';
    }
  });
  interactables.push({
    name: 'Computador de Carter',
    label: 'Computador',
    prompt: 'E / INTERAGIR · Examinar o computador',
    position: new THREE.Vector3(29.45, floorY + 1.05, 1.85),
    radius: 1.9,
    onInteract: () => 'A estação de trabalho de Carter tem monitor, teclado, mouse e luminária. O monitor está pronto para uso.'
  });
  interactables.push({
    name: 'Kitchenette de Carter',
    label: 'Kitchenette',
    prompt: 'E / INTERAGIR · Examinar a kitchenette e os lanches',
    position: new THREE.Vector3(28.2, floorY + 1.0, -5.65),
    radius: 2.0,
    onInteract: () => 'A pequena kitchenette está abastecida com ginger ale, Twix e Skittles — os lanches favoritos de Carter.'
  });
  interactables.push({
    name: 'Banheiro privativo de Carter',
    label: 'Banheiro privativo',
    prompt: 'E / INTERAGIR · Abrir ou fechar a porta do banheiro',
    position: new THREE.Vector3(21.85, floorY + 1.0, -2.35),
    radius: 1.7,
    onInteract() {
      bathDoorOpen = !bathDoorOpen;
      bathDoor.visible = !bathDoorOpen;
      const colliderIndex = colliders.indexOf(bathDoorCollider);
      if (bathDoorOpen && colliderIndex >= 0) colliders.splice(colliderIndex, 1);
      if (!bathDoorOpen && colliderIndex < 0) colliders.push(bathDoorCollider);
      return bathDoorOpen ? 'A porta de vidro fosco do banheiro desliza para abrir.' : 'A porta do banheiro se fecha.';
    }
  });
  interactables.push({
    name: 'Sistema de som',
    label: 'Sistema de som',
    prompt: 'E / INTERAGIR · Examinar o sistema de som',
    position: new THREE.Vector3(28.4, floorY + 0.6, 4.42),
    radius: 2.0,
    onInteract: () => 'O sistema de som estéreo está montado em duas caixas acústicas de madeira, uma de cada lado da televisão.'
  });

  // Brass and limestone detailing helps the room read as an Egyptian-modern suite.
  for (const x of [23.5, 25.5, 27.5, 29.5, 30.8]) {
    addBox('filete vertical de latão no painel sul', [x, floorY + 2.1, 5.49],
      [0.025, 2.7, 0.035], mat.brass, root, false);
  }
  for (const x of [19.1, 30.9]) {
    addBox('arandela de bronze da ala residencial', [x, floorY + 2.75, 5.38],
      [0.18, 0.32, 0.12], mat.brass);
    const glow = new THREE.PointLight(0xffc98b, 0.34, 5.0);
    glow.position.set(x, floorY + 2.7, 5.0);
    root.add(glow);
  }

  function update(_time, dt) {
    const target = doorOpen ? 1 : 0;
    doorProgress = THREE.MathUtils.damp(doorProgress, target, 5.5, dt);
    doorPanelA.position.z = THREE.MathUtils.lerp(-1.55, -3.25, doorProgress);
    doorPanelB.position.z = THREE.MathUtils.lerp(0.55, 2.25, doorProgress);
    if (doorOpen) {
      const index = colliders.indexOf(deckDoorCollider);
      if (index >= 0) colliders.splice(index, 1);
    } else if (!colliders.includes(deckDoorCollider)) {
      colliders.push(deckDoorCollider);
    }
  }

  return {
    root,
    update,
    getStatus: () => ({ doorUnlocked, doorOpen, bathDoorOpen, tvOn })
  };
}

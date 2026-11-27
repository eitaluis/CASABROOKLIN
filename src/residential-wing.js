import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const FLOOR_Y = 24.375;
const ZONE = 'bedroom';

export function buildResidentialWing({
  THREE, scene, colliders, groundSurfaces, interactables,
  materials = {}, isTouchDevice = false, onRest = () => {}
}) {
  const textureLoader = new THREE.TextureLoader();
  const makeLocalPbr = (folder, tint, repeatX, repeatY, roughness) => {
    const loadMap = (file, colorSpace = THREE.NoColorSpace) => {
      const map = textureLoader.load(new URL('../assets/textures/' + folder + '/' + file, import.meta.url).href);
      map.wrapS = THREE.RepeatWrapping;
      map.wrapT = THREE.RepeatWrapping;
      map.repeat.set(repeatX, repeatY);
      map.anisotropy = isTouchDevice ? 4 : 8;
      map.colorSpace = colorSpace;
      return map;
    };
    const material = new THREE.MeshStandardMaterial({
      color:tint,
      map:loadMap('color.webp',THREE.SRGBColorSpace),
      normalMap:loadMap('normal.webp'),
      roughnessMap:loadMap('roughness.webp'),
      roughness
    });
    material.normalScale.set(0.62,0.62);
    return material;
  };
  const wallMat = makeLocalPbr('plaster-smooth-beige',0xe0d4bc,2.1,1.45,0.9);
  const stoneMat = makeLocalPbr('tile-limestone-beige',0xd0c19f,2.7,1.8,0.88);
  const woodMat = makeLocalPbr('wood-walnut',0x9a744f,2.2,1.35,0.82);

  const darkWood = new THREE.MeshStandardMaterial({ color: 0x3d2a20, roughness: 0.68 });
  const bronze = new THREE.MeshStandardMaterial({ color: 0x88613b, metalness: 0.72, roughness: 0.34 });
  const bronzeLight = new THREE.MeshStandardMaterial({ color: 0xb28a52, metalness: 0.68, roughness: 0.3 });
  const ivory = new THREE.MeshStandardMaterial({ color: 0xe7d9b7, roughness: 0.72 });
  const ivoryShade = new THREE.MeshStandardMaterial({ color: 0xbda982, roughness: 0.88 });
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x9fb9bd, metalness: 0.08, roughness: 0.13,
    transmission: 0.42, transparent: true, opacity: 0.42,
    thickness: 0.035, side: THREE.DoubleSide
  });
  const screenOff = new THREE.MeshStandardMaterial({ color: 0x080d10, metalness: 0.24, roughness: 0.2 });
  const screenOn = new THREE.MeshStandardMaterial({
    color: 0x9dbdc4, emissive: 0x376a7b, emissiveIntensity: 0.9,
    metalness: 0.04, roughness: 0.16
  });
  const floorMat = woodMat.clone();
  floorMat.color?.set(0xb58e64);

  const roomGroup = new THREE.Group();
  roomGroup.name = 'Ala residencial — reconstrução interpretativa do terceiro andar';
  scene.add(roomGroup);

  const addCollider = (x, y, z, w, h, d) => {
    const c = {
      minX: x - w / 2, maxX: x + w / 2,
      minY: y - h / 2, maxY: y + h / 2,
      minZ: z - d / 2, maxZ: z + d / 2
    };
    colliders.push(c);
    return c;
  };

  const box = (name, x, y, z, w, h, d, material, collider = false, parent = roomGroup) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.name = name;
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    if (collider) addCollider(x, y, z, w, h, d);
    return mesh;
  };

  const addFloor = (name, x, z, w, d, material = floorMat) => {
    const mesh = box(name, x, FLOOR_Y - 0.11, z, w, 0.22, d, material, false);
    groundSurfaces.push(mesh);
    return mesh;
  };

  const wallX = (x, z0, z1, gaps, material = wallMat) => {
    const sorted = gaps.slice().sort((a, b) => a[0] - b[0]);
    let cursor = z0;
    for (const [a, b] of sorted) {
      if (a > cursor) box('Parede de calcário — ala residencial', x, FLOOR_Y + 1.65, (cursor + a) / 2, 0.24, 3.3, a - cursor, material, true);
      cursor = Math.max(cursor, b);
    }
    if (cursor < z1) box('Parede de calcário — ala residencial', x, FLOOR_Y + 1.65, (cursor + z1) / 2, 0.24, 3.3, z1 - cursor, material, true);
  };

  const wallZ = (z, x0, x1, gaps, material = wallMat) => {
    const sorted = gaps.slice().sort((a, b) => a[0] - b[0]);
    let cursor = x0;
    for (const [a, b] of sorted) {
      if (a > cursor) box('Parede de calcário — ala residencial', (cursor + a) / 2, FLOOR_Y + 1.65, z, a - cursor, 3.3, 0.24, material, true);
      cursor = Math.max(cursor, b);
    }
    if (cursor < x1) box('Parede de calcário — ala residencial', (cursor + x1) / 2, FLOOR_Y + 1.65, z, x1 - cursor, 3.3, 0.24, material, true);
  };

  // Corredor físico: o eixo oeste continua diretamente a partir da sala lateral
  // da galeria superior. A geometria exata do corredor é interpretação espacial.
  addFloor('Piso do corredor residencial', 20.25, 0, 4.7, 18.0, stoneMat);
  box('Rodapé de calcário do corredor norte', 20.25, FLOOR_Y + 0.09, -8.98, 4.7, 0.18, 0.22, stoneMat, true);
  box('Rodapé de calcário do corredor sul', 20.25, FLOOR_Y + 0.09, 8.98, 4.7, 0.18, 0.22, stoneMat, true);
  box('Parede lateral norte do corredor', 20.25, FLOOR_Y + 1.75, -9.05, 4.7, 3.5, 0.24, wallMat, true);
  box('Parede lateral sul do corredor', 20.25, FLOOR_Y + 1.75, 9.05, 4.7, 3.5, 0.24, wallMat, true);

  for (const z of [-7.4, -3.7, 0, 3.7, 7.4]) {
    box('Painel vertical de nogueira do corredor', 20.25, FLOOR_Y + 1.65, z, 0.055, 2.55, 0.12, darkWood, false);
    const light = new THREE.PointLight(0xffd09a, 0.34, 5.5, 1.8);
    light.position.set(20.2, FLOOR_Y + 2.72, z);
    roomGroup.add(light);
    box('Arandela de bronze do corredor', 20.12, FLOOR_Y + 2.72, z, 0.12, 0.32, 0.18, bronze, false);
  }

  // Duas suítes adjacentes; a separação exata, a planta e o vestíbulo são
  // decisões interpretativas para materializar os quartos contíguos do texto.
  addFloor('Piso de calcário do quarto de Carter', 28.55, -4.7, 12.3, 8.6);
  addFloor('Piso de calcário do quarto adjacente', 28.55, 4.7, 12.3, 8.6);

  // Parede oeste voltada para o corredor, com vãos para os dois quartos.
  wallX(22.55, -9.0, 9.0, [[-6.0, -4.0], [3.3, 5.3]]);
  // Fechamentos perimetrais dos dois quartos.
  wallX(34.65, -9.0, 9.0, [[-4.8, -1.35]]);
  wallZ(-9.0, 22.55, 34.65, []);
  addFloor('Faixa de piso entre os quartos', 28.6, 0, 12.3, 0.8);
  wallZ(0, 22.55, 34.65, [[28.2, 30.15]]);
  wallZ(9.0, 22.55, 34.65, []);

  // Porta interna contígua entre os quartos.
  const makeDoorOnZ = ({ name, x, z, width, height = 2.55, zone = ZONE, prompt, openedText, closedText }) => {
    const hinge = new THREE.Group();
    hinge.position.set(x - width / 2, FLOOR_Y, z);
    roomGroup.add(hinge);
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.12), woodMat);
    leaf.name = name;
    leaf.position.set(width / 2, height / 2, 0);
    leaf.castShadow = true;
    leaf.receiveShadow = true;
    hinge.add(leaf);
    for (const yy of [0.25, height - 0.25]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(width - 0.12, 0.055, 0.04), bronzeLight);
      rail.position.set(width / 2, yy, 0.085);
      hinge.add(rail);
    }
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 12), bronzeLight);
    knob.position.set(width - 0.14, height * 0.52, 0.12);
    hinge.add(knob);
    const collider = addCollider(x, FLOOR_Y + height / 2, z, width, height, 0.18);
    let opened = false;
    interactables.push({
      name, kind: 'door', zone, label: 'Porta de nogueira',
      prompt,
      position: new THREE.Vector3(x, FLOOR_Y + 1.1, z),
      radius: 2.55,
      onInteract() {
        opened = !opened;
        hinge.rotation.y = opened ? -Math.PI * 0.43 : 0;
        const index = colliders.indexOf(collider);
        if (opened && index >= 0) colliders.splice(index, 1);
        if (!opened && index < 0) colliders.push(collider);
        return opened ? openedText : closedText;
      }
    });
  };

  const makeDoorOnX = ({ name, x, z, width, height = 2.55, zone = ZONE, prompt, openedText, closedText }) => {
    const hinge = new THREE.Group();
    hinge.position.set(x, FLOOR_Y, z - width / 2);
    roomGroup.add(hinge);
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.12, height, width), woodMat);
    leaf.name = name;
    leaf.position.set(0, height / 2, width / 2);
    leaf.castShadow = true;
    leaf.receiveShadow = true;
    hinge.add(leaf);
    for (const yy of [0.25, height - 0.25]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.055, width - 0.12), bronzeLight);
      rail.position.set(0.085, yy, width / 2);
      hinge.add(rail);
    }
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 12), bronzeLight);
    knob.position.set(0.14, height * 0.52, width - 0.14);
    hinge.add(knob);
    const collider = addCollider(x, FLOOR_Y + height / 2, z, 0.18, height, width);
    let opened = false;
    interactables.push({
      name, kind: 'door', zone, label: 'Porta de nogueira',
      prompt,
      position: new THREE.Vector3(x, FLOOR_Y + 1.1, z),
      radius: 2.6,
      onInteract() {
        opened = !opened;
        hinge.rotation.y = opened ? Math.PI * 0.43 : 0;
        const index = colliders.indexOf(collider);
        if (opened && index >= 0) colliders.splice(index, 1);
        if (!opened && index < 0) colliders.push(collider);
        return opened ? openedText : closedText;
      }
    });
  };

  makeDoorOnX({
    name: 'Porta do quarto de Carter', x: 22.55, z: -5.0, width: 2.0,
    prompt: 'E / INTERAGIR · abrir porta do quarto de Carter',
    openedText: 'A porta do quarto de Carter está aberta.',
    closedText: 'A porta do quarto de Carter está fechada.'
  });
  makeDoorOnX({
    name: 'Porta do quarto adjacente', x: 22.55, z: 4.3, width: 2.0,
    prompt: 'E / INTERAGIR · abrir porta do quarto adjacente',
    openedText: 'A porta do quarto adjacente está aberta.',
    closedText: 'A porta do quarto adjacente está fechada.'
  });
  makeDoorOnZ({
    name: 'Porta interna entre os quartos', x: 29.2, z: 0, width: 1.95,
    prompt: 'E / INTERAGIR · comunicar os dois quartos',
    openedText: 'A passagem entre os quartos está aberta.',
    closedText: 'A passagem entre os quartos está fechada.'
  });

  // Banheiro privativo no trecho posterior da suíte. O layout é interpretativo.
  wallZ(-5.05, 28.65, 34.65, [[30.0, 31.75]]);
  makeDoorOnZ({
    name: 'Porta do banheiro de Carter', x: 30.875, z: -5.05, width: 1.65,
    prompt: 'E / INTERAGIR · abrir o banheiro',
    openedText: 'A porta do banheiro está aberta.',
    closedText: 'A porta do banheiro está fechada.'
  });
  box('Divisória de calcário do banheiro', 28.6, FLOOR_Y + 1.65, -7.02, 0.22, 3.3, 3.95, wallMat, true);
  box('Piso de travertino do banheiro', 31.65, FLOOR_Y - 0.055, -7.03, 5.85, 0.12, 3.85, stoneMat, false);
  box('Parede do box', 34.45, FLOOR_Y + 1.58, -7.0, 0.09, 3.05, 3.5, glass, false);
  box('Parede de fundo do box', 32.6, FLOOR_Y + 1.58, -8.75, 3.8, 3.05, 0.08, glass, false);
  box('Borda de pedra do box', 33.35, FLOOR_Y + 0.1, -7.25, 2.15, 0.2, 2.65, stoneMat, false);

  // Nicho e molduras no corredor residencial.
  for (const z of [-7.2, 7.2]) {
    box('Moldura de bronze do corredor', 21.95, FLOOR_Y + 1.8, z, 0.12, 2.85, 1.1, bronze, false);
  }

  // Deck exterior e portas de vidro: no primeiro livro a passagem está selada
  // por força invisível. O collider continua ativo, mesmo que a folha pareça móvel.
  addFloor('Deck privativo voltado para o porto', 37.15, -3.05, 5.0, 5.25, woodMat);
  box('Guarda-corpo de vidro do deck', 39.55, FLOOR_Y + 0.72, -3.05, 0.12, 1.35, 5.2, glass, true);
  box('Guarda-corpo lateral norte do deck', 37.0, FLOOR_Y + 0.72, -5.62, 5.0, 1.35, 0.12, glass, true);
  box('Guarda-corpo lateral sul do deck', 37.0, FLOOR_Y + 0.72, -0.48, 5.0, 1.35, 0.12, glass, true);

  const sliderFrame = new THREE.Group();
  sliderFrame.position.set(34.65, FLOOR_Y, -3.075);
  roomGroup.add(sliderFrame);
  for (const z of [-1.72, 1.72]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.85, 0.12), bronze);
    post.position.set(0, 1.425, z);
    sliderFrame.add(post);
  }
  const topRail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 3.56), bronze);
  topRail.position.set(0, 2.82, 0);
  sliderFrame.add(topRail);
  for (const z of [-0.88, 0.88]) {
    const pane = new THREE.Mesh(new THREE.BoxGeometry(0.045, 2.68, 1.72), glass);
    pane.position.set(0, 1.36, z);
    sliderFrame.add(pane);
  }
  addCollider(34.65, FLOOR_Y + 1.32, -3.075, 0.28, 2.65, 3.5);
  interactables.push({
    name: 'Portas de vidro da varanda', kind: 'inspect', zone: ZONE,
    label: 'Portas deslizantes de vidro',
    description: 'As portas dão para o deck sobre o porto. Uma barreira invisível impede a passagem, como no primeiro encontro de Carter com o quarto.',
    position: new THREE.Vector3(34.1, FLOOR_Y + 1.25, -3.075), radius: 2.8
  });

  // Bacia baixa de bronze sobre pedestal de pedra: referência ao objeto de
  // vidência de Walt em O Trono de Fogo; sua implementação é geometria autoral.
  const bowlBase = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.12, 48), stoneMat);
  bowlBase.position.set(37.2, FLOOR_Y + 0.06, -3.05);
  roomGroup.add(bowlBase);
  const bowlStem = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.16, 0.34, 32), stoneMat);
  bowlStem.position.set(37.2, FLOOR_Y + 0.29, -3.05);
  roomGroup.add(bowlStem);
  const bowlPedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.36, 0.12, 48), stoneMat);
  bowlPedestal.position.set(37.2, FLOOR_Y + 0.52, -3.05);
  roomGroup.add(bowlPedestal);
  const bowlProfile = [
    new THREE.Vector2(0.24, 0.01), new THREE.Vector2(0.34, 0.04),
    new THREE.Vector2(0.41, 0.11), new THREE.Vector2(0.43, 0.15),
    new THREE.Vector2(0.39, 0.16), new THREE.Vector2(0.34, 0.12),
    new THREE.Vector2(0.28, 0.065), new THREE.Vector2(0.04, 0.06)
  ];
  const bowl = new THREE.Mesh(new THREE.LatheGeometry(bowlProfile, 64), bronze);
  bowl.position.set(37.2, FLOOR_Y + 0.58, -3.05);
  roomGroup.add(bowl);
  const oil = new THREE.Mesh(new THREE.CircleGeometry(0.28, 48), new THREE.MeshPhysicalMaterial({
    color: 0x172324, metalness: 0.28, roughness: 0.12, clearcoat: 0.9,
    transparent: true, opacity: 0.88
  }));
  oil.rotation.x = -Math.PI / 2;
  oil.position.set(37.2, FLOOR_Y + 0.72, -3.05);
  roomGroup.add(oil);
  const ripple = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.008, 8, 48), bronzeLight);
  ripple.rotation.x = Math.PI / 2;
  ripple.position.set(37.2, FLOOR_Y + 0.735, -3.05);
  roomGroup.add(ripple);
  interactables.push({
    name: 'Bacia de vidência de bronze', kind: 'inspect', zone: ZONE,
    label: 'Bacia de vidência',
    description: 'Bacia baixa de bronze sobre pedestal de pedra. A superfície escura lembra o óleo usado para vidência por Walt.',
    position: new THREE.Vector3(37.2, FLOOR_Y + 0.72, -3.05), radius: 4.4
  });

  // O apoio de cabeça é modelado sob medida a partir da peça histórica GEM 270:
  // base alongada, leões nas extremidades e Shu sustentando a curva central.
  const headrest = new THREE.Group();
  headrest.name = 'Apoio de cabeça de marfim com leões — referência GEM 270';
  // No romance, o ivory headrest é um apoio de cabeça usado como travesseiro,
  // não uma cabeceira nem um objeto sobre a mesa lateral. A escala segue a peça
  // histórica GEM 270 (aprox. 29,5 cm de comprimento).
  headrest.position.set(28.9, FLOOR_Y + 0.89, -3.45);
  headrest.scale.setScalar(0.15);
  roomGroup.add(headrest);
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.18, 0.5), darkWood);
  plinth.position.y = -0.13;
  headrest.add(plinth);
  const ivoryBase = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.1, 0.36), ivory);
  ivoryBase.position.y = 0.02;
  headrest.add(ivoryBase);
  const smooth = (geo, mat, parent, p, scale) => {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...p);
    mesh.scale.set(...scale);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };
  const lionMat = new THREE.MeshStandardMaterial({ color: 0xc5b18a, roughness: 0.8 });
  for (const side of [-1, 1]) {
    smooth(new THREE.SphereGeometry(0.22, 28, 20), ivoryShade, headrest, [side * 0.67, 0.22, 0], [1.7, 0.68, 0.72]);
    smooth(new THREE.SphereGeometry(0.15, 24, 18), lionMat, headrest, [side * 0.79, 0.32, 0.015], [0.9, 0.95, 0.9]);
    smooth(new THREE.SphereGeometry(0.1, 20, 16), ivoryShade, headrest, [side * 0.81, 0.42, -0.04], [1, 0.95, 0.88]);
    for (const pawZ of [-0.12, 0.12]) {
      smooth(new THREE.SphereGeometry(0.09, 16, 12), ivory, headrest, [side * 0.52, 0.12, pawZ], [1.3, 0.55, 0.8]);
    }
    const tailCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.82, 0.22, -0.03),
      new THREE.Vector3(side * 0.94, 0.16, -0.04),
      new THREE.Vector3(side * 0.92, 0.3, -0.04),
      new THREE.Vector3(side * 0.82, 0.34, -0.04)
    ]);
    headrest.add(new THREE.Mesh(new THREE.TubeGeometry(tailCurve, 20, 0.025, 8, false), ivoryShade));
  }
  // Shu: corpo vertical, braços elevados e cabeça sob o apoio curvo.
  smooth(new THREE.SphereGeometry(0.16, 24, 18), ivoryShade, headrest, [0, 0.43, 0], [0.7, 1.55, 0.65]);
  smooth(new THREE.SphereGeometry(0.12, 24, 18), ivory, headrest, [0, 0.68, 0], [0.85, 0.9, 0.82]);
  for (const side of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.34, 6, 12), ivory);
    arm.position.set(side * 0.21, 0.77, 0);
    arm.rotation.z = side * -0.52;
    headrest.add(arm);
  }
  const supportCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.73, 0.7, 0),
    new THREE.Vector3(-0.55, 0.83, 0),
    new THREE.Vector3(-0.3, 0.94, 0),
    new THREE.Vector3(0, 0.99, 0),
    new THREE.Vector3(0.3, 0.94, 0),
    new THREE.Vector3(0.55, 0.83, 0),
    new THREE.Vector3(0.73, 0.7, 0)
  ]);
  headrest.add(new THREE.Mesh(new THREE.TubeGeometry(supportCurve, 80, 0.075, 16, false), ivory));
  for (let i = 0; i < 7; i++) {
    const inlay = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.012, 0.012), bronzeLight);
    inlay.position.set(-0.28 + i * 0.095, 0.12, 0.19);
    headrest.add(inlay);
  }
  interactables.push({
    name: 'Apoio de cabeça de marfim com leões', kind: 'inspect', zone: ZONE,
    label: 'Apoio de cabeça de marfim',
    description: 'Peça reconstruída a partir da referência histórica GEM 270: dois leões guardiões, Shu sustentando a curva e acabamento de marfim pigmentado. O arranjo é uma adaptação visual ao objeto mencionado no romance.',
    position: new THREE.Vector3(28.9, FLOOR_Y + 0.98, -3.45), radius: 1.8
  });

  const loader = new GLTFLoader();
  const remoteMixers = [];
  let lastMixerUpdate = 0;
  const fridgeDoorMeshes = [];
  const assetRoot = '../assets/models/residential/';
  const loadModel = (file, position, scale = [1, 1, 1], rotation = 0, name = file) => {
    const url = new URL(assetRoot + file, import.meta.url).href;
    loader.load(url, gltf => {
      const model = gltf.scene;
      model.name = name;
      model.position.set(position[0], position[1], position[2]);
      model.scale.set(scale[0], scale[1], scale[2]);
      model.rotation.y = rotation;
      model.traverse(obj => {
        if (!obj.isMesh) return;
        obj.castShadow = true;
        obj.receiveShadow = true;
        obj.frustumCulled = true;
        if(file === 'fridge.glb' && /Brushed stainless door/i.test(obj.name)) fridgeDoorMeshes.push(obj);
      });
      roomGroup.add(model);
    }, undefined, error => console.warn('Asset residencial não carregou:', file, error));
  };

  // GLBs CC0 remotos são usados somente quando a página do modelo confirma
  // CORS, licença e compatibilidade GLTFLoader. O modelo também recebe collider
  // próprio neste módulo; GLB não fornece navegação ou colisão automaticamente.
  const loadRemoteModel = (url, position, scale = [1, 1, 1], rotation = 0, name = 'Modelo CC0', onLoaded = null) => {
    loader.load(url, gltf => {
      const model = gltf.scene;
      model.name = name;
      model.position.set(position[0], position[1], position[2]);
      model.scale.set(scale[0], scale[1], scale[2]);
      model.rotation.y = rotation;
      model.traverse(obj => {
        if (!obj.isMesh) return;
        obj.castShadow = true;
        obj.receiveShadow = true;
        obj.frustumCulled = true;
      });
      roomGroup.add(model);
      const mixer = gltf.animations?.length ? new THREE.AnimationMixer(model) : null;
      if (mixer) remoteMixers.push(mixer);
      onLoaded?.({ model, mixer, animations: gltf.animations || [] });
    }, undefined, error => {
      console.warn('Asset CC0 remoto não carregou:', name, url, error);
      onLoaded?.(null);
    });
  };

  // Cama king-size original do projeto. A malha GLB da fonte MIT não pôde ser
  // transferida pelo conector binário; esta peça é geometria própria, com volumes
  // arredondados, roupa de cama em linho e proporções reais (1,95 x 2,10 m).
  const bedRoot = new THREE.Group();
  bedRoot.name = 'Cama king-size original de Carter';
  bedRoot.position.set(28.9, FLOOR_Y, -2.75);
  roomGroup.add(bedRoot);

  const linenCanvas = document.createElement('canvas');
  linenCanvas.width = 512; linenCanvas.height = 512;
  const linenCtx = linenCanvas.getContext('2d');
  linenCtx.fillStyle = '#e7dfce'; linenCtx.fillRect(0,0,512,512);
  for(let y=0;y<512;y+=5){
    linenCtx.strokeStyle = y%10===0 ? 'rgba(118,103,80,.055)' : 'rgba(255,255,255,.18)';
    linenCtx.lineWidth=1;
    linenCtx.beginPath(); linenCtx.moveTo(0,y); linenCtx.lineTo(512,y); linenCtx.stroke();
  }
  for(let x=0;x<512;x+=5){
    linenCtx.strokeStyle = x%10===0 ? 'rgba(118,103,80,.05)' : 'rgba(255,255,255,.14)';
    linenCtx.lineWidth=1;
    linenCtx.beginPath(); linenCtx.moveTo(x,0); linenCtx.lineTo(x,512); linenCtx.stroke();
  }
  for(let i=0;i<1100;i++){
    linenCtx.fillStyle = i%2 ? 'rgba(115,97,72,.035)' : 'rgba(255,255,255,.10)';
    linenCtx.fillRect(Math.random()*512,Math.random()*512,1.2,1.2);
  }
  const linenTexture = new THREE.CanvasTexture(linenCanvas);
  linenTexture.colorSpace = THREE.SRGBColorSpace;
  linenTexture.wrapS = linenTexture.wrapT = THREE.RepeatWrapping;
  linenTexture.repeat.set(2.2,2.4);
  linenTexture.anisotropy = isTouchDevice ? 4 : 8;
  const linenMaterial = new THREE.MeshStandardMaterial({
    color:0xf0e9d9, map:linenTexture, roughness:0.96
  });
  const pillowMaterial = linenMaterial.clone();
  pillowMaterial.color.set(0xf5efe3);
  const sageMaterial = new THREE.MeshStandardMaterial({color:0x818874,roughness:0.98});
  const bedFrameMaterial = woodMat.clone();
  const bedDark = new THREE.MeshStandardMaterial({color:0x493326,roughness:0.76});

  const addRounded = (parent,name,w,h,d,x,y,z,material,radius=0.06,segments=5) => {
    const mesh = new THREE.Mesh(new RoundedBoxGeometry(w,h,d,segments,radius),material);
    mesh.name=name; mesh.position.set(x,y,z); mesh.castShadow=true; mesh.receiveShadow=true;
    parent.add(mesh); return mesh;
  };
  const legPositions=[[-0.82,-0.92],[0.82,-0.92],[-0.82,0.92],[0.82,0.92]];
  for(const [x,z] of legPositions){
    const leg=new THREE.Mesh(new THREE.CylinderGeometry(0.045,0.075,0.31,20),bedDark);
    leg.name='Pé torneado da cama'; leg.position.set(x,0.155,z);
    leg.castShadow=true; leg.receiveShadow=true; bedRoot.add(leg);
    const ferrule=new THREE.Mesh(new THREE.CylinderGeometry(0.052,0.06,0.035,20),bronze);
    ferrule.position.set(x,0.035,z); bedRoot.add(ferrule);
  }
  addRounded(bedRoot,'Estrutura de nogueira da cama king',2.03,0.25,2.18,0,0.34,0,bedFrameMaterial,0.085,7);
  addRounded(bedRoot,'Painel recuado da base da cama',1.88,0.075,2.03,0,0.48,0,bedDark,0.035,5);
  // Filete contínuo de bronze escovado no perímetro inferior.
  for(const z of [-1.045,1.045]){
    addRounded(bedRoot,'Filete de bronze da cama',1.9,0.025,0.025,0,0.225,z,bronzeLight,0.012,4);
  }
  addRounded(bedRoot,'Colchão de linho',1.91,0.29,2.08,0,0.59,0,linenMaterial,0.13,9);
  addRounded(bedRoot,'Lençol superior com caimento',1.88,0.045,1.96,0,0.755,-0.015,pillowMaterial,0.12,9);
  // Dobra de edredom ao pé da cama, com pequenas costuras em baixo relevo.
  addRounded(bedRoot,'Edredom marfim dobrado',1.88,0.12,0.65,0,0.79,0.56,linenMaterial,0.085,8);
  for(const x of [-0.89,0.89]){
    const seam = new THREE.Mesh(new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(x,0.85,0.28),
        new THREE.Vector3(x,0.85,0.52),
        new THREE.Vector3(x,0.85,0.82)
      ]),20,0.006,6,false),new THREE.MeshStandardMaterial({color:0xb8ad98,roughness:1}));
    bedRoot.add(seam);
  }
  // Dois travesseiros volumosos na extremidade da cabeça da cama.
  for(const x of [-0.49,0.49]){
    const pillow=addRounded(bedRoot,'Travesseiro de linho',0.76,0.18,0.43,x,0.86,-0.68,pillowMaterial,0.12,9);
    pillow.rotation.y=x<0?0.035:-0.035;
  }
  addRounded(bedRoot,'Manta verde-sálvia dobrada',1.82,0.065,0.42,0,0.855,0.20,sageMaterial,0.06,7);
  for(let i=0;i<13;i++){
    const fringe=addRounded(bedRoot,'Franja da manta',0.012,0.022,0.095,-0.84+i*0.14,0.82,0.42,sageMaterial,0.008,3);
    fringe.rotation.x=-0.1;
  }
  addRounded(bedRoot,'Saia têxtil da cama',1.98,0.16,2.11,0,0.25,0,linenMaterial,0.055,6);
  // Uma linha de costura discreta acompanha o contorno visível do edredom.
  const duvetSeamPoints=[
    new THREE.Vector3(-0.9,0.84,-0.9),new THREE.Vector3(-0.9,0.84,0.83),
    new THREE.Vector3(0,0.84,0.86),new THREE.Vector3(0.9,0.84,0.83),
    new THREE.Vector3(0.9,0.84,-0.9)
  ];
  bedRoot.add(new THREE.Mesh(new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(duvetSeamPoints),56,0.0045,6,false),
    new THREE.MeshStandardMaterial({color:0xc5bba8,roughness:1})
  ));
  addCollider(28.9,FLOOR_Y+0.52,-2.75,2.05,1.05,2.15);

  // O quarto de Sadie recebe uma cama irmã com a mesma escala e acabamento de
  // Carter, para manter unidade visual sem inventar um segundo estilo de mobiliário.
  const sadieBed = bedRoot.clone(true);
  sadieBed.name = 'Cama ampla de Sadie Kane';
  sadieBed.position.set(28.15, FLOOR_Y, 2.55);
  roomGroup.add(sadieBed);
  addCollider(28.15, FLOOR_Y + 0.52, 2.55, 2.05, 1.05, 2.15);
  const sadieHeadrest = headrest.clone(true);
  sadieHeadrest.name = 'Apoio de cabeça de marfim do quarto de Sadie';
  sadieHeadrest.position.set(28.15, FLOOR_Y + 0.89, 1.85);
  roomGroup.add(sadieHeadrest);

  // Mobiliário PBR local, com origem e dimensões reais do catálogo de origem.
  loadModel('nightstand.glb', [27.55, FLOOR_Y, -2.75], [1, 1, 1], Math.PI, 'Mesa de cabeceira oeste');
  loadModel('nightstand.glb', [30.25, FLOOR_Y, -2.75], [1, 1, 1], Math.PI, 'Mesa de cabeceira leste');
  loadModel('table-lamp.glb', [27.55, FLOOR_Y + 0.55, -2.75], [1, 1, 1], 0, 'Luminária da mesa de cabeceira oeste');
  loadModel('table-lamp.glb', [30.25, FLOOR_Y + 0.55, -2.75], [1, 1, 1], 0, 'Luminária da mesa de cabeceira leste');
  loadModel('desk.glb', [24.8, FLOOR_Y, -3.0], [1.12, 1, 1], Math.PI / 2, 'Escrivaninha do computador');
  loadModel('desk-chair.glb', [25.75, FLOOR_Y, -3.0], [1, 1, 1], -Math.PI / 2, 'Cadeira do computador');
  loadModel('wardrobe.glb', [24.0, FLOOR_Y, -1.2], [1, 1, 1], Math.PI / 2, 'Armário embutido');
  loadModel('tv-console.glb', [29.15, FLOOR_Y, -0.64], [1, 1, 1], Math.PI, 'Console da televisão');
  loadModel('tv.glb', [29.15, FLOOR_Y + 1.15, -0.59], [1.16, 1.16, 1], Math.PI, 'Televisão de Carter');
  loadModel('counter.glb', [24.0, FLOOR_Y, -7.25], [1, 1, 1], Math.PI / 2, 'Bancada da kitchenette');
  loadModel('fridge.glb', [26.3, FLOOR_Y, -7.25], [1, 1, 1], -Math.PI / 2, 'Refrigerador da kitchenette');
  loadModel('shower.glb', [33.35, FLOOR_Y, -7.0], [1, 1, 1], Math.PI, 'Box do banheiro');
  loadModel('sink.glb', [31.4, FLOOR_Y, -5.9], [1, 1, 1], Math.PI, 'Lavatório do banheiro');
  loadModel('toilet.glb', [29.85, FLOOR_Y, -7.45], [1, 1, 1], Math.PI / 2, 'Vaso sanitário');
  loadModel('mirror.glb', [31.4, FLOOR_Y + 1.42, -5.16], [1.25, 1.25, 1], 0, 'Espelho do banheiro');
  loadModel('towel-rail.glb', [33.65, FLOOR_Y + 1.15, -5.17], [1.1, 1, 1], 0, 'Toalheiro do banheiro');
  loadModel('floor-lamp.glb', [32.9, FLOOR_Y, -1.25], [1, 1, 1], -Math.PI / 2, 'Luminária de piso do quarto');

  // A mobília de apoio do quarto de Sadie reutiliza os mesmos GLBs MIT locais,
  // mantendo materiais, escala e linguagem visual consistentes nos dois quartos.
  loadModel('nightstand.glb', [26.8, FLOOR_Y, 2.55], [1, 1, 1], Math.PI, 'Mesa de cabeceira de Sadie');
  loadModel('table-lamp.glb', [26.8, FLOOR_Y + 0.55, 2.55], [1, 1, 1], 0, 'Luminária de cabeceira de Sadie');
  loadModel('wardrobe.glb', [23.9, FLOOR_Y, 8.35], [0.96, 1, 1], Math.PI, 'Armário do closet de Sadie');

  // O minibar tem GLB CC0 próprio e dois clips (open/close). A origem e a licença
  // foram verificadas na ficha pública do asset; não depende de um modelo embutido
  // no pacote inteiro de hotel.
  let sadieMinibar = null;
  let sadieMinibarOpen = false;
  const sadieMinibarLight = new THREE.PointLight(0xa7d8df, 0, 2.1);
  sadieMinibarLight.position.set(33.18, FLOOR_Y + 0.62, 4.65);
  roomGroup.add(sadieMinibarLight);
  const playMinibarClip = (open) => {
    if (!sadieMinibar?.mixer) return;
    const expression = open ? /open/i : /close/i;
    const clip = sadieMinibar.animations.find(item => expression.test(item.name));
    if (!clip) return;
    const action = sadieMinibar.mixer.clipAction(clip);
    action.reset();
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    action.play();
  };
  loadRemoteModel(
    'https://cdn.3dassets.dev/assets/25760/v1/model.glb',
    [33.42, FLOOR_Y, 4.65], [1, 1, 1], -Math.PI / 2,
    'Minibar CC0 do quarto de Sadie',
    loaded => {
      sadieMinibar = loaded;
      if (loaded && sadieMinibarOpen) playMinibarClip(true);
    }
  );
  addCollider(33.42, FLOOR_Y + 0.45, 4.65, 0.68, 0.9, 0.64);

  // Poltrona de leitura CC0 da suíte; a malha é leve (2,3k triângulos) e o
  // posicionamento mantém uma passagem livre entre cama, minibar e banheiro.
  loadRemoteModel(
    'https://cdn.3dassets.dev/assets/25752/v1/model.glb',
    [31.45, FLOOR_Y, 2.2], [1, 1, 1], -Math.PI / 2,
    'Poltrona CC0 do quarto de Sadie'
  );
  addCollider(31.45, FLOOR_Y + 0.4, 2.2, 0.82, 0.9, 0.82);

  // Computador e aparelho de som: peças autorais interativas, sem depender de GLBs
  // de terceiros com licença ou estilo duvidosos.
  const computer = new THREE.Group();
  computer.position.set(24.8, FLOOR_Y + 0.78, -3.0);
  roomGroup.add(computer);
  box('Monitor de computador', 0, 0.35, 0, 0.78, 0.48, 0.055, darkWood, false, computer);
  const computerScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.69, 0.39), screenOff);
  computerScreen.position.set(0, 0.36, 0.031);
  computer.add(computerScreen);
  const tvScreenMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.12, 0.64), screenOff);
  tvScreenMesh.position.set(29.15, FLOOR_Y + 1.77, -0.505);
  tvScreenMesh.rotation.y = Math.PI;
  roomGroup.add(tvScreenMesh);
  box('Base do monitor', 0, 0.08, 0, 0.18, 0.16, 0.16, bronze, false, computer);
  box('Teclado do computador', 0, -0.08, 0.26, 0.58, 0.045, 0.2, darkWood, false, computer);
  const computerLight = new THREE.PointLight(0x74b8d0, 0, 2.8);
  computerLight.position.set(0, 0.55, 0.15);
  computer.add(computerLight);

  const stereo = new THREE.Group();
  stereo.position.set(30.85, FLOOR_Y + 0.86, -0.64);
  roomGroup.add(stereo);
  box('Corpo do aparelho de som', 0, 0, 0, 1.0, 0.42, 0.24, darkWood, false, stereo);
  for (const side of [-1, 1]) {
    const speaker = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.035, 32), screenOff);
    speaker.rotation.z = Math.PI / 2;
    speaker.position.set(side * 0.32, 0, 0.145);
    stereo.add(speaker);
  }
  const stereoLight = new THREE.PointLight(0xd6a45c, 0, 1.8);
  stereoLight.position.set(0, 0.28, 0.1);
  stereo.add(stereoLight);

  // Dock do iPod e gravador cassete de Sadie. São pequenos objetos autorais,
  // não reproduzem áudio protegido; as interações mudam telas, indicadores e luz.
  const sadieDock = new THREE.Group();
  sadieDock.position.set(30.65, FLOOR_Y + 0.78, 4.55);
  roomGroup.add(sadieDock);
  box('Base de nogueira do dock de Sadie', 0, 0.02, 0, 0.52, 0.08, 0.28, darkWood, false, sadieDock);
  box('Corpo metálico do dock de Sadie', 0, 0.19, -0.035, 0.34, 0.25, 0.16, bronze, false, sadieDock);
  const dockScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.23, 0.13), screenOff);
  dockScreen.position.set(0, 0.2, 0.051);
  sadieDock.add(dockScreen);
  const dockStand = box('Suporte do iPod de Sadie', 0, 0.32, -0.035, 0.07, 0.14, 0.06, bronzeLight, false, sadieDock);
  const dockLight = new THREE.PointLight(0xa3cedb, 0, 1.7);
  dockLight.position.set(0, 0.42, 0.08);
  sadieDock.add(dockLight);

  const headphones = new THREE.Group();
  headphones.position.set(0.34, 0.11, 0.02);
  sadieDock.add(headphones);
  const headphoneArc = new THREE.Mesh(
    new THREE.TorusGeometry(0.105, 0.018, 10, 32, Math.PI),
    darkWood
  );
  headphoneArc.rotation.z = Math.PI;
  headphones.add(headphoneArc);
  for (const side of [-1, 1]) {
    const cup = new THREE.Mesh(new THREE.CapsuleGeometry(0.035, 0.07, 4, 8), darkWood);
    cup.position.set(side * 0.103, -0.02, 0);
    headphones.add(cup);
  }

  const cassetteRecorder = new THREE.Group();
  cassetteRecorder.position.set(31.15, FLOOR_Y + 0.86, 4.05);
  roomGroup.add(cassetteRecorder);
  box('Corpo do gravador cassete antigo', 0, 0, 0, 0.28, 0.11, 0.19, darkWood, false, cassetteRecorder);
  box('Janela do cassete', 0, 0.01, 0.101, 0.12, 0.055, 0.008, screenOff, false, cassetteRecorder);
  for (const x of [-0.075, 0.075]) {
    const reel = new THREE.Mesh(new THREE.CircleGeometry(0.022, 16), bronzeLight);
    reel.position.set(x, 0.012, 0.107);
    cassetteRecorder.add(reel);
  }
  const cassetteLed = new THREE.PointLight(0xe3b269, 0, 0.9);
  cassetteLed.position.set(0, 0.14, 0.08);
  cassetteRecorder.add(cassetteLed);

  // A divisória entre as suítes recebe um filete rúnico quase invisível.
  // A luz só aparece quando Sadie ativa o isolamento acústico mágico.
  const soundproofRunes = new THREE.Group();
  soundproofRunes.name = 'Runas de isolamento acústico de Sadie';
  roomGroup.add(soundproofRunes);
  const runeMaterial = new THREE.MeshStandardMaterial({
    color: 0x79aeb5, emissive: 0x2b8e9d, emissiveIntensity: 0,
    metalness: 0.35, roughness: 0.42
  });
  for (let i = 0; i < 7; i++) {
    const rune = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.009, 6, 18), runeMaterial);
    rune.position.set(26.25 + i * 0.85, FLOOR_Y + 1.8 + (i % 2) * 0.12, 0.13);
    soundproofRunes.add(rune);
  }
  const soundproofHalo = new THREE.PointLight(0x4ba8b5, 0, 4.5);
  soundproofHalo.position.set(28.8, FLOOR_Y + 1.65, 0.38);
  roomGroup.add(soundproofHalo);

  // Snacks e garrafas: modelos autorais pequenos, reconhecíveis e inspecionáveis.
  const snacks = new THREE.Group();
  snacks.position.set(24.5, FLOOR_Y + 0.94, -7.25);
  roomGroup.add(snacks);
  const sodaBody = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.075, 0.34, 20), new THREE.MeshStandardMaterial({ color: 0x5b9b72, roughness: 0.35 }));
  sodaBody.position.set(0.35, 0.2, 0);
  snacks.add(sodaBody);
  const sodaCap = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.045, 16), bronzeLight);
  sodaCap.position.set(0.35, 0.39, 0);
  snacks.add(sodaCap);
  box('Embalagem de chocolate', -0.12, 0.12, 0.08, 0.42, 0.1, 0.18, new THREE.MeshStandardMaterial({ color: 0x7c3a2a, roughness: 0.64 }), false, snacks);
  box('Embalagem de balas', -0.12, 0.25, -0.16, 0.36, 0.09, 0.16, new THREE.MeshStandardMaterial({ color: 0x8c304d, roughness: 0.58 }), false, snacks);

  const waterMaterial = new THREE.MeshStandardMaterial({
    color:0x76b5c1, emissive:0x123844, emissiveIntensity:0.28,
    transparent:true, opacity:0.55, roughness:0.18
  });
  const sinkWaterStream = new THREE.Mesh(new THREE.CylinderGeometry(0.014,0.028,0.22,12), waterMaterial);
  sinkWaterStream.position.set(31.4, FLOOR_Y + 0.73, -5.76);
  sinkWaterStream.visible = false;
  roomGroup.add(sinkWaterStream);

  const showerWater = new THREE.Group();
  showerWater.position.set(33.35, FLOOR_Y, -7.0);
  showerWater.visible = false;
  for(let i=0;i<7;i++) {
    const drop = new THREE.Mesh(new THREE.CylinderGeometry(0.009,0.015,0.78,7), waterMaterial);
    drop.position.set(-0.25 + i*0.08,1.05,(i%3-1)*0.07);
    showerWater.add(drop);
  }
  roomGroup.add(showerWater);

  const fridgeGlow = new THREE.PointLight(0xa7d8df,0,1.8);
  fridgeGlow.position.set(26.0,FLOOR_Y+1.0,-7.2);
  roomGroup.add(fridgeGlow);

  const sadieSnacks = new THREE.Group();
  sadieSnacks.position.set(33.42, FLOOR_Y + 0.94, 4.65);
  roomGroup.add(sadieSnacks);
  const ribenaBottle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.062, 0.24, 20),
    new THREE.MeshStandardMaterial({ color: 0x6d2d59, roughness: 0.32 })
  );
  ribenaBottle.position.set(0.15, 0.16, 0.02);
  sadieSnacks.add(ribenaBottle);
  const ribenaCap = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.035, 16), bronzeLight);
  ribenaCap.position.set(0.15, 0.3, 0.02);
  sadieSnacks.add(ribenaCap);
  const chocolate = new THREE.Mesh(new RoundedBoxGeometry(0.19, 0.055, 0.11, 4, 0.02), new THREE.MeshStandardMaterial({ color: 0x5b3024, roughness: 0.55 }));
  chocolate.position.set(-0.13, 0.07, 0.04);
  sadieSnacks.add(chocolate);

  // O closet e o banheiro privativo de Sadie são recintos próprios; a planta
  // exata é interpretação, pois o romance não fornece medidas ou posição cotada.
  wallZ(6.05, 22.55, 25.45, [[23.62, 24.82]]);
  wallX(25.45, 6.05, 9.0, []);
  box('Piso em nogueira do closet de Sadie', 23.98, FLOOR_Y + 0.015, 7.5, 2.84, 0.025, 2.9, woodMat, false);
  makeDoorOnZ({
    name: 'Porta do closet de Sadie', x: 24.22, z: 6.05, width: 1.2,
    prompt: 'E / INTERAGIR · abrir o closet de Sadie',
    openedText: 'O closet de Sadie está aberto.',
    closedText: 'O closet de Sadie está fechado.'
  });
  // Arara discreta, cabides e peças de roupa que surgem por magia.
  const outfitRail = new THREE.Group();
  outfitRail.position.set(24.7, FLOOR_Y + 1.55, 8.45);
  roomGroup.add(outfitRail);
  const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.3, 16), bronze);
  rail.rotation.z = Math.PI / 2;
  outfitRail.add(rail);
  const outfitMaterials = [
    new THREE.MeshStandardMaterial({ color: 0x6a6d82, roughness: 0.92 }),
    new THREE.MeshStandardMaterial({ color: 0x7a4058, roughness: 0.92 }),
    new THREE.MeshStandardMaterial({ color: 0x9a8b65, roughness: 0.92 })
  ];
  for (let i = 0; i < 3; i++) {
    const hanger = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.008, 6, 16, Math.PI), bronzeLight);
    hanger.position.set(-0.4 + i * 0.4, -0.12, 0);
    outfitRail.add(hanger);
    const garment = new THREE.Mesh(new RoundedBoxGeometry(0.24, 0.72, 0.055, 5, 0.025), outfitMaterials[i]);
    garment.position.set(-0.4 + i * 0.4, -0.55, 0);
    outfitRail.add(garment);
  }

  wallZ(6.05, 29.25, 34.65, [[30.05, 31.55]]);
  wallX(29.25, 6.05, 9.0, []);
  box('Piso de travertino do banheiro de Sadie', 31.95, FLOOR_Y + 0.015, 7.5, 5.3, 0.025, 2.9, stoneMat, false);
  loadModel('shower.glb', [33.65, FLOOR_Y, 8.08], [0.95, 0.95, 0.95], Math.PI, 'Box do banheiro de Sadie');
  loadModel('sink.glb', [32.15, FLOOR_Y, 8.45], [0.88, 0.88, 0.88], Math.PI, 'Lavatório do banheiro de Sadie');
  loadModel('toilet.glb', [30.65, FLOOR_Y, 8.15], [0.92, 0.92, 0.92], Math.PI / 2, 'Vaso sanitário do banheiro de Sadie');
  loadModel('mirror.glb', [32.15, FLOOR_Y + 1.35, 8.78], [1, 1, 1], Math.PI, 'Espelho do banheiro de Sadie');
  makeDoorOnZ({
    name: 'Porta do banheiro de Sadie', x: 30.8, z: 6.05, width: 1.5,
    prompt: 'E / INTERAGIR · abrir o banheiro de Sadie',
    openedText: 'O banheiro de Sadie está aberto.',
    closedText: 'O banheiro de Sadie está fechado.'
  });
  addCollider(33.65, FLOOR_Y + 0.95, 8.08, 0.95, 1.95, 0.95);
  addCollider(32.15, FLOOR_Y + 0.4, 8.45, 0.82, 0.82, 0.55);
  addCollider(30.65, FLOOR_Y + 0.38, 8.15, 0.45, 0.78, 0.7);

  // Pequenos colliders físicos dos móveis: não cobrem corredores nem portas.
  addCollider(27.55, FLOOR_Y + 0.34, -2.75, 0.52, 0.7, 0.46);
  addCollider(30.25, FLOOR_Y + 0.34, -2.75, 0.52, 0.7, 0.46);
  addCollider(24.8, FLOOR_Y + 0.38, -3.0, 1.35, 0.8, 0.72);
  addCollider(24.0, FLOOR_Y + 1.0, -1.2, 1.22, 2.15, 0.62);
  addCollider(29.15, FLOOR_Y + 0.28, -0.64, 1.82, 0.55, 0.48);
  addCollider(24.0, FLOOR_Y + 0.48, -7.25, 0.62, 0.95, 0.64);
  addCollider(26.3, FLOOR_Y + 0.92, -7.25, 0.72, 1.85, 0.72);
  addCollider(33.35, FLOOR_Y + 1.0, -7.0, 0.9, 2.0, 0.9);
  addCollider(31.4, FLOOR_Y + 0.43, -5.9, 0.8, 0.9, 0.5);
  addCollider(29.85, FLOOR_Y + 0.39, -7.45, 0.42, 0.8, 0.7);
  addCollider(37.2, FLOOR_Y + 0.42, -3.05, 0.74, 0.84, 0.74);

  // Objetos e ações: a busca de proximidade é compartilhada com biblioteca e treinamento.
  const addInspect = (name, label, description, x, z, radius = 2.2, onInteract = null, prompt = null) => {
    interactables.push({
      name, kind: 'inspect', zone: ZONE, label, description,
      prompt: prompt || 'E / INTERAGIR · ' + label,
      position: new THREE.Vector3(x, FLOOR_Y + 0.9, z),
      radius, onInteract
    });
  };
  addInspect('Cama king-size de Carter', 'Cama king-size',
    'Cama ampla com estrutura de nogueira, linho e enxoval claro. Carter pode descansar aqui para recuperar energia.',
    28.9, -2.75, 2.5, () => {
      onRest();
      return 'Carter descansou na cama. A energia foi recuperada.';
    }, 'E / INTERAGIR · descansar e recuperar energia');
  addInspect('Luminárias das mesas de cabeceira', 'Luminária de cabeceira',
    'Ligue ou desligue a iluminação de leitura junto à cama.', 27.55, -2.75, 1.5, () => {
      bedsideLights.forEach(light => { light.visible = !light.visible; light.intensity = light.visible ? 0.68 : 0; });
      return bedsideLights[0]?.visible ? 'As luminárias de cabeceira foram acesas.' : 'As luminárias de cabeceira foram apagadas.';
    });
  const bedsideLights = [-1, 1].map(side => {
    const light = new THREE.PointLight(0xffc88a, 0.68, 5, 1.8);
    light.position.set(28.9 + side * 1.35, FLOOR_Y + 1.65, -2.75);
    roomGroup.add(light);
    return light;
  });

  let tvOn = false;
  const tvControl = () => {
    tvOn = !tvOn;
    tvScreenMesh.material = tvOn ? screenOn : screenOff;
    return tvOn ? 'A tela da televisão acendeu.' : 'A televisão foi desligada.';
  };
  addInspect('Televisão de Carter', 'Televisão moderna',
    'Televisão de tela plana na parede entre os quartos.', 29.15, -0.64, 2.6, tvControl);

  let computerOn = false;
  addInspect('Computador de Carter', 'Computador',
    'Estação de trabalho moderna com monitor e teclado.', 24.8, -3.0, 2.1, () => {
      computerOn = !computerOn;
      computerScreen.material = computerOn ? screenOn : screenOff;
      computerLight.intensity = computerOn ? 0.42 : 0;
      return computerOn ? 'O computador foi ligado.' : 'O computador foi desligado.';
    });

  let stereoOn = false;
  addInspect('Aparelho de som', 'Aparelho de som',
    'Sistema de áudio moderno com duas caixas acústicas.', 30.85, -0.64, 2.0, () => {
      stereoOn = !stereoOn;
      stereoLight.intensity = stereoOn ? 0.4 : 0;
      return stereoOn ? 'O aparelho de som foi ligado.' : 'O aparelho de som foi desligado.';
    });

  let fridgeOpen = false;
  addInspect('Refrigerador da kitchenette', 'Refrigerador',
    'A kitchenette tem bebidas e doces. Entre os itens descritos no livro estão ginger ale, Twix e Skittles.',
    26.3, -7.25, 2.0, () => {
      fridgeOpen = !fridgeOpen;
      fridgeGlow.intensity = fridgeOpen ? 0.55 : 0;
      fridgeDoorMeshes.forEach((door,index) => { door.rotation.y = fridgeOpen ? (index === 0 ? -0.82 : 0.82) : 0; });
      return fridgeOpen ? 'Você abriu o refrigerador: ginger ale gelada e alguns doces.' : 'Você fechou o refrigerador.';
    });
  let snacksCollected = false;
  addInspect('Bancada com snacks', 'Ginger ale, Twix e Skittles',
    'Pequenos itens de lanche descritos no quarto de Carter.', 24.5, -7.25, 1.7, () => {
      if(snacksCollected) return 'Você já guardou os lanches na bolsa.';
      snacksCollected = true;
      snacks.visible = false;
      return 'Você guardou ginger ale, Twix e Skittles para levar.';
    });

  let sinkRunning = false;
  let showerRunning = false;
  addInspect('Lavatório do banheiro', 'Lavatório',
    'Bancada e lavatório de porcelana com metais de acabamento escovado.', 31.4, -5.9, 1.8, () => {
      sinkRunning = !sinkRunning;
      sinkWaterStream.visible = sinkRunning;
      return sinkRunning ? 'A água da pia começou a correr.' : 'A água da pia foi fechada.';
    });
  addInspect('Box do banheiro', 'Chuveiro',
    'Box envidraçado e área molhada revestida em pedra clara.', 33.35, -7.0, 1.8, () => {
      showerRunning = !showerRunning;
      showerWater.visible = showerRunning;
      return showerRunning ? 'O chuveiro foi aberto.' : 'O chuveiro foi fechado.';
    });
  addInspect('Espelho do banheiro', 'Espelho',
    'Espelho acima do lavatório.', 31.4, -5.2, 1.4);
  addInspect('Apoio de cabeça de marfim com leões', 'Apoio de cabeça egípcio',
    'Apoio de cabeça usado como travesseiro, não como cabeceira. Reconstrução autoral baseada na peça histórica GEM 270, com dois leões guardiões e Shu sustentando a curva.',
    28.9, -3.45, 1.8);

  // Quarto de Sadie: objetos, rotinas e efeitos próprios, sem duplicar o quarto de Carter.
  addInspect('Cama de Sadie Kane', 'Cama de Sadie',
    'Cama ampla e confortável da suíte contígua. A roupa de cama e o apoio de cabeça seguem a mesma família visual do quarto de Carter.',
    28.15, 2.55, 2.5, () => {
      onRest();
      return 'Sadie deixou a cama preparada. Carter recuperou energia ao descansar.';
    }, 'E / INTERAGIR · descansar');
  addInspect('Minibar de Sadie', 'Frigobar embutido',
    'Cômoda com refrigerador embutido, como descrita no quarto de Sadie em O Trono de Fogo.',
    33.42, 4.65, 1.7, () => {
      sadieMinibarOpen = !sadieMinibarOpen;
      sadieMinibarLight.intensity = sadieMinibarOpen ? 0.62 : 0;
      playMinibarClip(sadieMinibarOpen);
      return sadieMinibarOpen
        ? 'O frigobar abriu: Ribena gelada e chocolates estão disponíveis.'
        : 'O frigobar de Sadie foi fechado.';
    }, 'E / INTERAGIR · abrir o frigobar');
  let sadieSnacksTaken = false;
  addInspect('Ribena e chocolates', 'Bebidas e chocolates',
    'As bebidas Ribena e os chocolates ficam no refrigerador embutido da cômoda de Sadie.',
    33.42, 4.65, 1.25, () => {
      if (!sadieMinibarOpen) return 'Abra primeiro o frigobar para alcançar os lanches.';
      if (sadieSnacksTaken) return 'Você já guardou os lanches de Sadie na bolsa.';
      sadieSnacksTaken = true;
      sadieSnacks.visible = false;
      return 'Você guardou uma Ribena e alguns chocolates.';
    }, 'E / INTERAGIR · pegar os lanches');
  let sadieDockOn = false;
  addInspect('Dock do iPod de Sadie', 'Dock de música',
    'Dock moderno para iPod com fones de ouvido. A interação acende o visor e os indicadores, sem reproduzir áudio comercial.',
    30.65, 4.55, 1.8, () => {
      sadieDockOn = !sadieDockOn;
      dockScreen.material = sadieDockOn ? screenOn : screenOff;
      dockLight.intensity = sadieDockOn ? 0.48 : 0;
      return sadieDockOn ? 'O dock de Sadie foi ligado.' : 'O dock de Sadie foi desligado.';
    }, 'E / INTERAGIR · ligar o dock');
  let cassetteRunning = false;
  addInspect('Gravador cassete de Sadie', 'Gravador antigo',
    'Gravador que Sadie trouxe de Londres, lembrança das gravações que fez com Carter. O botão apenas anima o indicador visual.',
    31.15, 4.05, 1.6, () => {
      cassetteRunning = !cassetteRunning;
      cassetteLed.intensity = cassetteRunning ? 0.42 : 0;
      return cassetteRunning ? 'O gravador cassete acendeu.' : 'O gravador cassete foi desligado.';
    }, 'E / INTERAGIR · examinar o gravador');
  let soundproofOn = false;
  addInspect('Paredes mágicas de Sadie', 'Isolamento acústico mágico',
    'As paredes encantadas de Sadie isolam o som do quarto vizinho. As runas ficam visíveis quando o feitiço é ativado.',
    28.7, 0.8, 2.1, () => {
      soundproofOn = !soundproofOn;
      runeMaterial.emissiveIntensity = soundproofOn ? 1.25 : 0;
      soundproofHalo.intensity = soundproofOn ? 0.58 : 0;
      return soundproofOn
        ? 'O isolamento mágico foi ativado. As runas absorvem o som do quarto.'
        : 'O isolamento mágico foi desativado.';
    }, 'E / INTERAGIR · ativar isolamento mágico');
  addInspect('Closet de Sadie', 'Closet mágico',
    'O closet de Sadie guarda roupas que aparecem limpas e prontas por magia. A arara mostra algumas peças da seleção.',
    24.7, 7.5, 1.8, () => {
      outfitRail.visible = !outfitRail.visible;
      return outfitRail.visible ? 'As roupas de Sadie apareceram na arara.' : 'As roupas foram recolhidas pelo encanto do closet.';
    }, 'E / INTERAGIR · revelar roupas');
  addInspect('Poltrona de Sadie', 'Poltrona de leitura',
    'Poltrona compacta junto à cama, para ouvir música ou descansar.',
    31.45, 2.2, 1.6);
  addInspect('Banheiro de Sadie', 'Banheiro privativo',
    'Suíte com banheiro próprio, box de vidro, lavatório, espelho e metais contemporâneos.',
    32.1, 7.3, 1.9);
  
  // A bacia está no deck fechado pela barreira invisível; pode ser inspecionada
  // do interior, mas não atravessada até que o selo seja removido numa etapa narrativa.
  return {
    walkablePlatforms: [
      { minX: 17.85, maxX: 22.55, minZ: -8.85, maxZ: 8.85, height: FLOOR_Y },
      { minX: 22.55, maxX: 34.65, minZ: -8.85, maxZ: -0.52, height: FLOOR_Y },
      { minX: 22.55, maxX: 34.65, minZ: 0.52, maxZ: 8.85, height: FLOOR_Y },
      { minX: 34.65, maxX: 39.45, minZ: -5.55, maxZ: -0.55, height: FLOOR_Y }
    ],
    update(time) {
      const dt = lastMixerUpdate > 0 ? Math.min(0.05, Math.max(0, time - lastMixerUpdate)) : 0;
      lastMixerUpdate = time;
      remoteMixers.forEach(mixer => mixer.update(dt));
      ripple.scale.setScalar(0.86 + 0.12 * Math.sin(time * 1.45));
      oil.material.roughness = 0.12 + 0.025 * (0.5 + 0.5 * Math.sin(time * 0.7));
    }
  };
}

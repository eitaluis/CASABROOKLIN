import * as THREE from 'three';

const materials = {
  skin: new THREE.MeshStandardMaterial({ color: 0x704637, roughness: 0.82 }),
  skinLight: new THREE.MeshStandardMaterial({ color: 0x8b5b45, roughness: 0.8 }),
  shirt: new THREE.MeshStandardMaterial({ color: 0x315f91, roughness: 0.86 }),
  shirtDark: new THREE.MeshStandardMaterial({ color: 0x23486f, roughness: 0.9 }),
  shirtSeam: new THREE.MeshStandardMaterial({ color: 0x6689ad, roughness: 0.9 }),
  trousers: new THREE.MeshStandardMaterial({ color: 0xb9a078, roughness: 0.92 }),
  trousersDark: new THREE.MeshStandardMaterial({ color: 0x927c5c, roughness: 0.94 }),
  shoes: new THREE.MeshStandardMaterial({ color: 0x342b28, roughness: 0.78 }),
  sole: new THREE.MeshStandardMaterial({ color: 0xd4c8b0, roughness: 0.88 }),
  leather: new THREE.MeshStandardMaterial({ color: 0x67472f, roughness: 0.84 }),
  leatherLight: new THREE.MeshStandardMaterial({ color: 0x98704a, roughness: 0.78 }),
  hair: new THREE.MeshStandardMaterial({ color: 0x171514, roughness: 0.94 }),
  hairLight: new THREE.MeshStandardMaterial({ color: 0x28201d, roughness: 0.94 }),
  eye: new THREE.MeshStandardMaterial({ color: 0xf1e7d7, roughness: 0.48 }),
  iris: new THREE.MeshStandardMaterial({ color: 0x38251c, roughness: 0.42 }),
  pupil: new THREE.MeshStandardMaterial({ color: 0x100d0b, roughness: 0.35 }),
  metal: new THREE.MeshStandardMaterial({ color: 0xb28b51, metalness: 0.52, roughness: 0.42 })
};

function mesh(parent, geometry, material, name, position = [0, 0, 0]) {
  const object = new THREE.Mesh(geometry, material);
  object.name = name;
  object.position.set(...position);
  object.castShadow = true;
  object.receiveShadow = true;
  parent.add(object);
  return object;
}

function ellipsoid(parent, name, size, position, material, segments = 24) {
  const object = mesh(parent, new THREE.SphereGeometry(1, segments, Math.max(12, Math.floor(segments * 0.7))), material, name, position);
  object.scale.set(...size);
  return object;
}

// Superfície contínua por anéis elípticos: silhueta orgânica, sem blocos ou peças cúbicas.
function loftGeometry(rings, segments = 28) {
  const vertices = [];
  const indices = [];
  for (const ring of rings) {
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      vertices.push(
        (ring.cx || 0) + Math.cos(a) * ring.rx,
        ring.y,
        (ring.cz || 0) + Math.sin(a) * ring.rz
      );
    }
  }
  const stride = segments + 1;
  for (let r = 0; r < rings.length - 1; r++) {
    for (let i = 0; i < segments; i++) {
      const a = r * stride + i;
      const b = a + stride;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function loft(parent, name, rings, material, segments = 28) {
  return mesh(parent, loftGeometry(rings, segments), material, name);
}

function tube(parent, name, points, radius, material, tubularSegments = 32) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
  return mesh(parent, new THREE.TubeGeometry(curve, tubularSegments, radius, 8, false), material, name);
}

function makeLimb(parent, name, profile, material) {
  const points = profile.map(([radius, y]) => new THREE.Vector2(radius, y));
  const geometry = new THREE.LatheGeometry(points, 20);
  geometry.computeVertexNormals();
  return mesh(parent, geometry, material, name);
}

function makeCarter(scene) {
  const root = new THREE.Group();
  root.name = 'CarterKane_StylizedTeen';
  scene.add(root);

  const torsoPivot = new THREE.Group();
  torsoPivot.position.y = 0.91;
  root.add(torsoPivot);

  // Camisa: tronco com cintura, tórax e ombros em uma única malha suave.
  loft(torsoPivot, 'blue shirt | tailored torso', [
    { y: -0.13, rx: 0.178, rz: 0.112 },
    { y: -0.07, rx: 0.205, rz: 0.126 },
    { y: 0.05, rx: 0.218, rz: 0.137 },
    { y: 0.20, rx: 0.235, rz: 0.145 },
    { y: 0.34, rx: 0.268, rz: 0.139 },
    { y: 0.40, rx: 0.247, rz: 0.125 }
  ], materials.shirt, 32);
  // Gola e pequena abertura da camisa.
  ellipsoid(torsoPivot, 'shirt collar', [0.095, 0.055, 0.105], [0, 0.405, -0.012], materials.shirtDark);
  tube(torsoPivot, 'shirt placket', [[0, 0.36, -0.137], [0, 0.22, -0.145], [0, 0.08, -0.137]], 0.008, materials.shirtSeam, 18);
  for (const y of [0.28, 0.17, 0.06]) {
    ellipsoid(torsoPivot, 'shirt button', [0.009, 0.009, 0.006], [0, y, -0.149], materials.metal, 10);
  }
  tube(torsoPivot, 'left collar edge', [[-0.09, 0.40, -0.10], [-0.04, 0.35, -0.14], [0, 0.37, -0.145]], 0.012, materials.shirtSeam, 14);
  tube(torsoPivot, 'right collar edge', [[0.09, 0.40, -0.10], [0.04, 0.35, -0.14], [0, 0.37, -0.145]], 0.012, materials.shirtSeam, 14);

  // Quadril e calça com volume contínuo.
  ellipsoid(root, 'khaki waistband', [0.205, 0.145, 0.125], [0, 0.86, 0], materials.trousers);
  const belt = ellipsoid(root, 'belt', [0.207, 0.035, 0.128], [0, 0.91, 0], materials.trousersDark);
  belt.scale.y = 0.23;
  const buckle = mesh(root, new THREE.BoxGeometry(0.052, 0.045, 0.018), materials.metal, 'belt buckle', [0, 0.91, -0.13]);

  const joints = {};
  for (const side of [-1, 1]) {
    const key = side < 0 ? 'L' : 'R';

    const hip = new THREE.Group();
    hip.position.set(side * 0.112, 0.84, 0);
    root.add(hip);
    makeLimb(hip, 'khaki trouser thigh', [
      [0.105, 0.025], [0.115, -0.07], [0.108, -0.20],
      [0.092, -0.34], [0.084, -0.415], [0.076, -0.445]
    ], materials.trousers);
    // Costura lateral e bolso cargo discreto.
    tube(hip, 'trouser outer seam', [[side * 0.095, -0.08, -0.012], [side * 0.09, -0.22, -0.014], [side * 0.075, -0.39, -0.01]], 0.004, materials.trousersDark, 16);
    const pocket = ellipsoid(hip, 'cargo pocket', [0.055, 0.085, 0.018], [side * 0.09, -0.23, -0.088], materials.trousersDark, 16);
    pocket.rotation.z = side * -0.08;

    const knee = new THREE.Group();
    knee.position.y = -0.425;
    hip.add(knee);
    makeLimb(knee, 'khaki trouser calf', [
      [0.078, 0.035], [0.084, -0.07], [0.078, -0.19],
      [0.068, -0.30], [0.064, -0.385]
    ], materials.trousers);

    const ankle = new THREE.Group();
    ankle.position.y = -0.375;
    knee.add(ankle);
    ellipsoid(ankle, 'dark leather sneaker', [0.082, 0.062, 0.145], [0, -0.025, -0.055], materials.shoes);
    ellipsoid(ankle, 'sneaker sole', [0.084, 0.018, 0.148], [0, -0.068, -0.055], materials.sole);
    ellipsoid(ankle, 'sneaker toe highlight', [0.061, 0.025, 0.048], [0, -0.012, -0.16], materials.leatherLight, 16);
    joints['hip' + key] = hip;
    joints['knee' + key] = knee;
    joints['ankle' + key] = ankle;

    const shoulder = new THREE.Group();
    shoulder.position.set(side * 0.255, 1.27, 0);
    root.add(shoulder);
    ellipsoid(shoulder, 'shirt shoulder', [0.115, 0.105, 0.13], [0, 0.015, 0], materials.shirt);
    makeLimb(shoulder, 'blue shirt sleeve', [
      [0.105, -0.025], [0.102, -0.11], [0.084, -0.23], [0.077, -0.29]
    ], materials.shirt);
    const cuff = ellipsoid(shoulder, 'sleeve cuff', [0.079, 0.025, 0.083], [0, -0.275, 0], materials.shirtDark, 16);
    const elbow = new THREE.Group();
    elbow.position.y = -0.29;
    shoulder.add(elbow);
    makeLimb(elbow, 'forearm', [
      [0.069, 0.015], [0.073, -0.09], [0.062, -0.20], [0.055, -0.275]
    ], materials.skin);
    const hand = new THREE.Group();
    hand.position.y = -0.27;
    elbow.add(hand);
    ellipsoid(hand, 'hand palm', [0.058, 0.078, 0.039], [0, -0.035, -0.004], materials.skin, 18);
    for (let f = 0; f < 4; f++) {
      const finger = ellipsoid(hand, 'finger', [0.012, 0.038, 0.014], [-0.034 + f * 0.022, -0.095, -0.008], materials.skin, 12);
      finger.rotation.z = (f - 1.5) * -0.08;
    }
    ellipsoid(hand, 'thumb', [0.017, 0.038, 0.016], [side * 0.062, -0.045, -0.002], materials.skin, 12).rotation.z = side * -0.55;
    joints['shoulder' + key] = shoulder;
    joints['elbow' + key] = elbow;
    joints['hand' + key] = hand;
  }

  // Pescoço, cabeça e rosto com mandíbula, maçãs do rosto e feições legíveis.
  const neck = ellipsoid(root, 'neck', [0.073, 0.105, 0.071], [0, 1.36, 0.005], materials.skin);
  const headPivot = new THREE.Group();
  headPivot.position.set(0, 1.52, -0.005);
  root.add(headPivot);
  loft(headPivot, 'teen face and jaw', [
    { y: -0.18, rx: 0.082, rz: 0.095 },
    { y: -0.14, rx: 0.118, rz: 0.119 },
    { y: -0.06, rx: 0.145, rz: 0.135 },
    { y: 0.04, rx: 0.151, rz: 0.139 },
    { y: 0.15, rx: 0.142, rz: 0.13 },
    { y: 0.205, rx: 0.105, rz: 0.105 }
  ], materials.skin, 32);
  for (const side of [-1, 1]) {
    ellipsoid(headPivot, 'cheek', [0.058, 0.062, 0.025], [side * 0.092, -0.045, -0.104], materials.skinLight, 18);
    ellipsoid(headPivot, 'ear', [0.032, 0.062, 0.028], [side * 0.151, -0.005, 0], materials.skin, 16);
    ellipsoid(headPivot, 'ear inner', [0.013, 0.032, 0.009], [side * 0.169, -0.005, -0.018], materials.skinLight, 12);
    ellipsoid(headPivot, 'eye socket', [0.045, 0.032, 0.014], [side * 0.057, 0.035, -0.129], materials.skinLight, 16);
    ellipsoid(headPivot, 'eye white', [0.033, 0.018, 0.012], [side * 0.057, 0.034, -0.14], materials.eye, 16);
    ellipsoid(headPivot, 'iris', [0.012, 0.013, 0.006], [side * 0.057, 0.034, -0.151], materials.iris, 12);
    ellipsoid(headPivot, 'pupil', [0.005, 0.008, 0.003], [side * 0.057, 0.034, -0.156], materials.pupil, 10);
    tube(headPivot, 'eyebrow', [[side * 0.095, 0.078, -0.135], [side * 0.06, 0.09, -0.15], [side * 0.025, 0.078, -0.145]], 0.009, materials.hair, 12);
  }
  // Nariz com ponte e ponta arredondada; boca discreta.
  ellipsoid(headPivot, 'nose bridge', [0.022, 0.052, 0.026], [0, -0.005, -0.142], materials.skinLight, 16);
  ellipsoid(headPivot, 'nose tip', [0.027, 0.022, 0.025], [0, -0.044, -0.157], materials.skin, 16);
  tube(headPivot, 'upper lip', [[-0.034, -0.095, -0.132], [0, -0.103, -0.143], [0.034, -0.095, -0.132]], 0.007, materials.hairLight, 12);
  ellipsoid(headPivot, 'lower lip', [0.026, 0.009, 0.008], [0, -0.115, -0.137], materials.skinLight, 12);

  // Cabelo crespo: massa superior arredondada e mechas em cachos, sem capacete rígido.
  ellipsoid(headPivot, 'curly hair crown', [0.163, 0.115, 0.148], [0, 0.174, 0.012], materials.hair, 24);
  for (let row = 0; row < 3; row++) {
    const count = row === 0 ? 13 : row === 1 ? 11 : 8;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + row * 0.19;
      const radius = row === 0 ? 0.125 : row === 1 ? 0.105 : 0.075;
      const curl = ellipsoid(headPivot, 'individual tight curl', [0.031, 0.034, 0.03],
        [Math.cos(a) * radius, 0.205 + (row === 2 ? 0.035 : 0), Math.sin(a) * radius + 0.008],
        (i + row) % 3 === 0 ? materials.hairLight : materials.hair, 12);
      curl.rotation.z = Math.cos(a) * 0.2;
    }
  }
  ellipsoid(headPivot, 'left sideburn', [0.027, 0.07, 0.045], [-0.135, 0.06, 0.005], materials.hair, 14);
  ellipsoid(headPivot, 'right sideburn', [0.027, 0.07, 0.045], [0.135, 0.06, 0.005], materials.hair, 14);

  // Bolsa de mensageiro em couro e alça curva atravessando o peito.
  const bag = new THREE.Group();
  bag.name = 'leather messenger bag';
  bag.position.set(0.225, 0.92, 0.135);
  root.add(bag);
  ellipsoid(bag, 'satchel body', [0.145, 0.19, 0.075], [0, 0, 0], materials.leather, 22);
  ellipsoid(bag, 'satchel flap', [0.146, 0.065, 0.022], [0, 0.105, -0.058], materials.leatherLight, 18);
  ellipsoid(bag, 'satchel clasp', [0.018, 0.018, 0.01], [0, 0.07, -0.082], materials.metal, 12);
  tube(root, 'crossbody leather strap', [
    [-0.19, 1.38, -0.11], [-0.15, 1.25, -0.135], [-0.08, 1.09, -0.14],
    [0.04, 0.99, -0.12], [0.18, 0.99, -0.07], [0.25, 1.08, 0.025]
  ], 0.018, materials.leather, 32);
  tube(root, 'strap highlight', [
    [-0.19, 1.38, -0.128], [-0.15, 1.25, -0.153], [-0.08, 1.09, -0.158],
    [0.04, 0.99, -0.138], [0.18, 0.99, -0.088]
  ], 0.003, materials.leatherLight, 28);

  return {
    root, joints, torsoPivot, headPivot, bag,
    phase: 0,
    update(dt, speed) {
      const moving = speed > 0.12;
      const runBlend = THREE.MathUtils.smoothstep(speed, 4.1, 7.4);
      const gait = THREE.MathUtils.lerp(7.8, 12.6, runBlend);
      this.phase += dt * gait * THREE.MathUtils.clamp(speed / 3.8, 0, 1.65);
      const p = this.phase;
      const amount = THREE.MathUtils.clamp(speed / 3.8, 0, 1.5);
      const stride = THREE.MathUtils.lerp(0.43, 0.68, runBlend) * amount;
      const bounce = moving ? Math.abs(Math.sin(p * 2)) * (0.018 + 0.018 * runBlend) : 0;
      root.position.y = bounce;
      torsoPivot.rotation.x = THREE.MathUtils.damp(torsoPivot.rotation.x, -0.025 - 0.105 * runBlend * amount, 9, dt);
      torsoPivot.rotation.z = Math.sin(p) * 0.018 * amount;
      headPivot.rotation.x = -0.025 - 0.025 * runBlend * amount;
      headPivot.rotation.z = Math.sin(p * 0.5) * 0.018 * amount;
      joints.hipL.rotation.x = Math.sin(p) * stride;
      joints.hipR.rotation.x = Math.sin(p + Math.PI) * stride;
      joints.kneeL.rotation.x = Math.max(0, Math.cos(p)) * (0.48 + 0.42 * runBlend) * amount;
      joints.kneeR.rotation.x = Math.max(0, Math.cos(p + Math.PI)) * (0.48 + 0.42 * runBlend) * amount;
      joints.ankleL.rotation.x = -Math.max(0, Math.cos(p)) * 0.24 * amount;
      joints.ankleR.rotation.x = -Math.max(0, Math.cos(p + Math.PI)) * 0.24 * amount;
      joints.shoulderL.rotation.x = -Math.sin(p + 0.2) * (0.34 + 0.14 * runBlend) * amount;
      joints.shoulderR.rotation.x = -Math.sin(p + Math.PI + 0.2) * (0.34 + 0.14 * runBlend) * amount;
      joints.shoulderL.rotation.z = 0.035;
      joints.shoulderR.rotation.z = -0.035;
      joints.elbowL.rotation.x = -0.24 - 0.3 * runBlend * amount;
      joints.elbowR.rotation.x = -0.24 - 0.3 * runBlend * amount;
      joints.handL.rotation.x = Math.sin(p + 0.4) * 0.08 * amount;
      joints.handR.rotation.x = Math.sin(p + Math.PI + 0.4) * 0.08 * amount;
      bag.rotation.x = Math.sin(p + 0.7) * 0.035 * amount;
      bag.rotation.z = Math.sin(p * 0.5) * 0.025 * amount;
    },
    reset() {
      root.position.y = 0;
      root.rotation.set(0, 0, 0);
      torsoPivot.rotation.set(0, 0, 0);
      headPivot.rotation.set(0, 0, 0);
      bag.rotation.set(0, 0, 0);
      this.phase = 0;
      for (const joint of Object.values(joints)) joint.rotation.set(0, 0, 0);
    }
  };
}

export function createCharacter({ scene, onModeChange = () => {} }) {
  const rig = makeCarter(scene);
  const state = {
    model: rig.root,
    human: null,
    rig,
    locomotionName: 'Carter Kane · stylized rig',
    updateFallback(dt, speed) { rig.update(dt, speed); },
    resetFallback() { rig.reset(); }
  };
  onModeChange(state.locomotionName);
  return state;
}

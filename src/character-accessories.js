import * as THREE from 'three';

function roundedRect(width, height, radius) {
  const halfW = width * 0.5;
  const halfH = height * 0.5;
  const r = Math.min(radius, halfW, halfH);
  const shape = new THREE.Shape();
  shape.moveTo(-halfW + r, -halfH);
  shape.lineTo(halfW - r, -halfH);
  shape.quadraticCurveTo(halfW, -halfH, halfW, -halfH + r);
  shape.lineTo(halfW, halfH - r);
  shape.quadraticCurveTo(halfW, halfH, halfW - r, halfH);
  shape.lineTo(-halfW + r, halfH);
  shape.quadraticCurveTo(-halfW, halfH, -halfW, halfH - r);
  shape.lineTo(-halfW, -halfH + r);
  shape.quadraticCurveTo(-halfW, -halfH, -halfW + r, -halfH);
  return shape;
}

function extrudedPanel(width, height, depth, radius, bevel) {
  const geometry = new THREE.ExtrudeGeometry(
    roundedRect(width, height, radius),
    {
      depth,
      bevelEnabled: bevel > 0,
      bevelSegments: 3,
      steps: 1,
      bevelSize: bevel,
      bevelThickness: bevel,
      curveSegments: 8
    }
  );
  geometry.computeVertexNormals();
  return geometry;
}

function findBone(root, candidates) {
  const wanted = new Set(candidates);
  const found = new Map();
  root.traverse((node) => {
    if (!node.isBone) return;
    const name = String(node.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (wanted.has(name) && !found.has(name)) found.set(name, node);
  });
  // Candidate order takes precedence, so Spine2 is chosen over a lower Spine bone.
  for (const candidate of candidates) {
    if (found.has(candidate)) return found.get(candidate);
  }
  return null;
}

function createRibbonGeometry(curve, width, segments = 40) {
  const points = curve.getPoints(segments);
  const positions = [];
  const indices = [];

  for (let i = 0; i < points.length; i++) {
    const previous = points[Math.max(0, i - 1)];
    const next = points[Math.min(points.length - 1, i + 1)];
    const tangent = next.clone().sub(previous).normalize();
    const side = new THREE.Vector3(-tangent.y, tangent.x, 0).normalize();
    if (side.lengthSq() < 0.0001) side.set(1, 0, 0);
    side.multiplyScalar(width * 0.5);

    positions.push(
      points[i].x - side.x, points[i].y - side.y, points[i].z,
      points[i].x + side.x, points[i].y + side.y, points[i].z
    );

    if (i < points.length - 1) {
      const a = i * 2;
      const b = a + 1;
      const c = a + 2;
      const d = a + 3;
      indices.push(a, b, c, b, d, c);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function offsetRibbonEdge(curve, width, sideSign, segments = 40) {
  const points = curve.getPoints(segments);
  const edgePoints = points.map((point, i) => {
    const previous = points[Math.max(0, i - 1)];
    const next = points[Math.min(points.length - 1, i + 1)];
    const tangent = next.clone().sub(previous).normalize();
    const side = new THREE.Vector3(-tangent.y, tangent.x, 0).normalize();
    if (side.lengthSq() < 0.0001) side.set(1, 0, 0);
    return point.clone().addScaledVector(side, width * 0.34 * sideSign).add(new THREE.Vector3(0, 0, 0.002));
  });
  return new THREE.CatmullRomCurve3(edgePoints);
}

export function createCarterAccessories({ characterRoot, height = 1.75 }) {
  const unit = height / 1.75;
  const bagWidth = 0.36 * unit;
  const bagHeight = 0.285 * unit;
  const bagDepth = 0.105 * unit;
  const geometries = new Set();
  const materials = new Set();

  const leather = new THREE.MeshStandardMaterial({
    color: 0x80502f,
    roughness: 0.84,
    metalness: 0.02
  });
  const leatherDark = new THREE.MeshStandardMaterial({
    color: 0x593820,
    roughness: 0.88,
    metalness: 0.01
  });
  const leatherLight = new THREE.MeshStandardMaterial({
    color: 0x98643c,
    roughness: 0.82,
    metalness: 0.02
  });
  const stitching = new THREE.MeshStandardMaterial({
    color: 0xc9a477,
    roughness: 0.72
  });
  const brass = new THREE.MeshStandardMaterial({
    color: 0xb68a42,
    roughness: 0.32,
    metalness: 0.72
  });
  const brassHighlight = new THREE.MeshStandardMaterial({
    color: 0xd7b56e,
    roughness: 0.28,
    metalness: 0.78
  });

  [leather, leatherDark, leatherLight, stitching, brass, brassHighlight].forEach((material) => materials.add(material));

  const bagRoot = new THREE.Group();
  bagRoot.name = 'CarterBagRigAnchor';
  const necklaceRoot = new THREE.Group();
  necklaceRoot.name = 'CarterNecklaceRigAnchor';
  characterRoot.add(bagRoot, necklaceRoot);
  characterRoot.updateMatrixWorld(true);

  const hipsBone = findBone(characterRoot, ['hips', 'mixamorighips', 'hip']);
  const chestBone = findBone(characterRoot, ['spine2', 'mixamorigspine2', 'spine1', 'mixamorigspine1', 'chest', 'spine']);
  if (hipsBone) {
    // Preserve model-space placement at rest while following pelvic movement.
    hipsBone.attach(bagRoot);
  }
  if (chestBone) {
    // The necklace follows the upper torso, not the pelvis.
    chestBone.attach(necklaceRoot);
  }

  function addMesh(geometry, material, parent, name) {
    geometries.add(geometry);
    if (Array.isArray(material)) material.forEach((item) => materials.add(item));
    else materials.add(material);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function addTube(curve, radius, material, parent, name, tubularSegments = 36) {
    const geometry = new THREE.TubeGeometry(curve, tubularSegments, radius, 7, false);
    return addMesh(geometry, material, parent, name);
  }

  // Cross-body strap: left shoulder to the right hip, as in the illustration.
  const strapCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.155 * unit, 0.835 * height, 0.125 * unit),
    new THREE.Vector3(0.145 * unit, 0.765 * height, 0.155 * unit),
    new THREE.Vector3(0.075 * unit, 0.645 * height, 0.17 * unit),
    new THREE.Vector3(-0.075 * unit, 0.515 * height, 0.16 * unit),
    new THREE.Vector3(-0.235 * unit, 0.405 * height, 0.145 * unit)
  ]);
  const strapGeometry = createRibbonGeometry(strapCurve, 0.047 * unit, 44);
  addMesh(
    strapGeometry,
    new THREE.MeshStandardMaterial({
      color: 0x70472a,
      roughness: 0.86,
      side: THREE.DoubleSide
    }),
    bagRoot,
    'CarterBagStrap'
  );

  const edgeLeft = offsetRibbonEdge(strapCurve, 0.047 * unit, -1, 44);
  const edgeRight = offsetRibbonEdge(strapCurve, 0.047 * unit, 1, 44);
  addTube(edgeLeft, 0.0018 * unit, stitching, bagRoot, 'CarterBagStrapStitchLeft', 44);
  addTube(edgeRight, 0.0018 * unit, stitching, bagRoot, 'CarterBagStrapStitchRight', 44);

  const adjuster = addMesh(
    new THREE.BoxGeometry(0.055 * unit, 0.025 * unit, 0.009 * unit),
    brass,
    bagRoot,
    'CarterBagStrapAdjuster'
  );
  adjuster.position.set(0.132 * unit, 0.748 * height, 0.173 * unit);

  // The satchel is its own pivot so it can lag subtly behind the torso during movement.
  const bagPivot = new THREE.Group();
  bagPivot.name = 'CarterRightHipSatchelPivot';
  bagPivot.position.set(-0.255 * unit, 0.375 * height, 0.105 * unit);
  bagRoot.add(bagPivot);

  addMesh(
    extrudedPanel(bagWidth, bagHeight, bagDepth, 0.036 * unit, 0.009 * unit),
    leather,
    bagPivot,
    'CarterSatchelBody'
  );

  const sideGusset = addMesh(
    new THREE.BoxGeometry(0.018 * unit, 0.205 * unit, 0.082 * unit),
    leatherDark,
    bagPivot,
    'CarterSatchelSideGusset'
  );
  sideGusset.position.set(-bagWidth * 0.47, -0.005 * unit, bagDepth * 0.48);

  const flap = addMesh(
    extrudedPanel(bagWidth * 0.94, bagHeight * 0.40, 0.018 * unit, 0.025 * unit, 0.005 * unit),
    leatherDark,
    bagPivot,
    'CarterSatchelFlap'
  );
  flap.position.set(0, bagHeight * 0.285, bagDepth * 0.92);

  const frontPocket = addMesh(
    extrudedPanel(bagWidth * 0.62, bagHeight * 0.30, 0.012 * unit, 0.018 * unit, 0.003 * unit),
    leatherLight,
    bagPivot,
    'CarterSatchelFrontPocket'
  );
  frontPocket.position.set(0, -bagHeight * 0.205, bagDepth * 0.96);

  const pocketSeam = addMesh(
    new THREE.BoxGeometry(bagWidth * 0.52, 0.0025 * unit, 0.002 * unit),
    stitching,
    bagPivot,
    'CarterSatchelPocketSeam'
  );
  pocketSeam.position.set(0, -bagHeight * 0.205, bagDepth * 1.105);

  const clasp = addMesh(
    new THREE.TorusGeometry(0.013 * unit, 0.0026 * unit, 7, 18),
    brassHighlight,
    bagPivot,
    'CarterSatchelBrassClasp'
  );
  clasp.position.set(0, bagHeight * 0.205, bagDepth * 1.115);

  const claspBar = addMesh(
    new THREE.BoxGeometry(0.004 * unit, 0.019 * unit, 0.003 * unit),
    brassHighlight,
    bagPivot,
    'CarterSatchelClaspBar'
  );
  claspBar.position.set(0, bagHeight * 0.205, bagDepth * 1.12);

  // Small brass rings mark the two leather strap attachment points.
  for (const [index, x] of [[0, 0.17], [1, -0.245]]) {
    const ring = addMesh(
      new THREE.TorusGeometry(0.018 * unit, 0.003 * unit, 7, 18),
      brass,
      bagRoot,
      'CarterSatchelAttachmentRing' + index
    );
    ring.position.set(x * unit, (index === 0 ? 0.805 : 0.405) * height, 0.16 * unit);
  }

  // Fine necklace and round gold medallion remain separate from the shirt mesh.
  const necklaceCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.105 * unit, 0.86 * height, 0.125 * unit),
    new THREE.Vector3(-0.092 * unit, 0.795 * height, 0.155 * unit),
    new THREE.Vector3(-0.045 * unit, 0.735 * height, 0.17 * unit),
    new THREE.Vector3(0, 0.695 * height, 0.175 * unit),
    new THREE.Vector3(0.045 * unit, 0.735 * height, 0.17 * unit),
    new THREE.Vector3(0.092 * unit, 0.795 * height, 0.155 * unit),
    new THREE.Vector3(0.105 * unit, 0.86 * height, 0.125 * unit)
  ]);
  addTube(necklaceCurve, 0.0032 * unit, brassHighlight, necklaceRoot, 'CarterMedallionChain', 40);

  const pendantPivot = new THREE.Group();
  pendantPivot.name = 'CarterGoldMedallionPivot';
  pendantPivot.position.set(0, 0.695 * height, 0.182 * unit);
  necklaceRoot.add(pendantPivot);

  const medallion = addMesh(
    new THREE.CylinderGeometry(0.032 * unit, 0.032 * unit, 0.008 * unit, 32),
    brass,
    pendantPivot,
    'CarterGoldMedallion'
  );
  medallion.rotation.x = -Math.PI / 2;

  const medallionOuter = addMesh(
    new THREE.TorusGeometry(0.030 * unit, 0.0025 * unit, 8, 32),
    brassHighlight,
    pendantPivot,
    'CarterGoldMedallionRim'
  );
  medallionOuter.position.z = 0.005 * unit;

  const medallionInner = addMesh(
    new THREE.TorusGeometry(0.020 * unit, 0.0012 * unit, 6, 28),
    brassHighlight,
    pendantPivot,
    'CarterGoldMedallionInnerRim'
  );
  medallionInner.position.z = 0.006 * unit;

  const ankhLoop = addMesh(
    new THREE.TorusGeometry(0.006 * unit, 0.0015 * unit, 6, 14),
    brassHighlight,
    pendantPivot,
    'CarterMedallionAnkhLoop'
  );
  ankhLoop.position.set(0, 0.006 * unit, 0.009 * unit);

  const ankhStem = addMesh(
    new THREE.BoxGeometry(0.003 * unit, 0.014 * unit, 0.002 * unit),
    brassHighlight,
    pendantPivot,
    'CarterMedallionAnkhStem'
  );
  ankhStem.position.set(0, -0.003 * unit, 0.009 * unit);

  const ankhBar = addMesh(
    new THREE.BoxGeometry(0.010 * unit, 0.003 * unit, 0.002 * unit),
    brassHighlight,
    pendantPivot,
    'CarterMedallionAnkhBar'
  );
  ankhBar.position.set(0, 0.001 * unit, 0.009 * unit);

  let elapsed = 0;
  function update(delta, speed = 0) {
    elapsed += delta;
    const gait = THREE.MathUtils.clamp(speed / 4.2, 0, 1);
    bagPivot.rotation.z = Math.sin(elapsed * (3.8 + gait * 3.5)) * (0.004 + gait * 0.035);
    bagPivot.rotation.x = Math.cos(elapsed * (4.2 + gait * 4.2)) * gait * 0.018;
    pendantPivot.rotation.x = Math.sin(elapsed * 2.9) * (0.012 + gait * 0.048);
    pendantPivot.rotation.z = Math.cos(elapsed * 3.6) * gait * 0.014;
  }

  function dispose() {
    bagRoot.removeFromParent();
    necklaceRoot.removeFromParent();
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    geometries.clear();
    materials.clear();
  }

  return {
    root: bagRoot,
    update,
    dispose,
    attachment: (hipsBone ? 'hips-bone' : 'model-root') + ' + ' + (chestBone ? 'chest-bone' : 'model-root')
  };
}

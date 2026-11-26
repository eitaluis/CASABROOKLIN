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

function softSatchelShape(width, height) {
  const w = width * 0.5;
  const h = height * 0.5;
  const shape = new THREE.Shape();
  // A soft, slightly tapered leather body; broader at the bottom than at the opening.
  shape.moveTo(-w * 0.37, -h);
  shape.lineTo(w * 0.37, -h);
  shape.quadraticCurveTo(w * 0.51, -h, w * 0.50, -h * 0.70);
  shape.lineTo(w * 0.45, h * 0.68);
  shape.quadraticCurveTo(w * 0.44, h, w * 0.26, h);
  shape.lineTo(-w * 0.28, h);
  shape.quadraticCurveTo(-w * 0.47, h, -w * 0.48, h * 0.68);
  shape.lineTo(-w * 0.50, -h * 0.70);
  shape.quadraticCurveTo(-w * 0.51, -h, -w * 0.37, -h);
  return shape;
}

function extrudeShape(shape, depth, bevel) {
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: bevel > 0,
    bevelSegments: 4,
    steps: 1,
    bevelSize: bevel,
    bevelThickness: bevel,
    curveSegments: 12
  });
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
  for (const candidate of candidates) {
    if (found.has(candidate)) return found.get(candidate);
  }
  return null;
}

function createRibbonGeometry(curve, width, segments = 48) {
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

function offsetRibbonEdge(curve, width, sideSign, segments = 48) {
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

  // The satchel is about 15% smaller than the first pass and sits on the
  // posterior/right side of the pelvis. Its broad panel faces sideways.
  const bagWidth = 0.305 * unit;
  const bagHeight = 0.245 * unit;
  const bagDepth = 0.092 * unit;
  const geometries = new Set();
  const materials = new Set();

  const leather = new THREE.MeshStandardMaterial({
    color: 0x80502f,
    roughness: 0.91,
    metalness: 0.01
  });
  const leatherDark = new THREE.MeshStandardMaterial({
    color: 0x593820,
    roughness: 0.92,
    metalness: 0.01
  });
  const leatherLight = new THREE.MeshStandardMaterial({
    color: 0x98643c,
    roughness: 0.88,
    metalness: 0.01
  });
  const stitching = new THREE.MeshStandardMaterial({
    color: 0xc9a477,
    roughness: 0.8
  });
  const brass = new THREE.MeshStandardMaterial({
    color: 0xb68a42,
    roughness: 0.38,
    metalness: 0.62
  });
  const brassHighlight = new THREE.MeshStandardMaterial({
    color: 0xd7b56e,
    roughness: 0.34,
    metalness: 0.68
  });

  [leather, leatherDark, leatherLight, stitching, brass, brassHighlight].forEach((material) => materials.add(material));

  const bagRoot = new THREE.Group();
  bagRoot.name = 'CarterBagRigAnchor';
  const strapRoot = new THREE.Group();
  strapRoot.name = 'CarterStrapRigAnchor';
  const necklaceRoot = new THREE.Group();
  necklaceRoot.name = 'CarterNecklaceRigAnchor';
  characterRoot.add(bagRoot, strapRoot, necklaceRoot);
  characterRoot.updateMatrixWorld(true);

  const hipsBone = findBone(characterRoot, ['hips', 'mixamorighips', 'hip']);
  const chestBone = findBone(characterRoot, ['spine2', 'mixamorigspine2', 'spine1', 'mixamorigspine1', 'chest', 'spine']);
  if (hipsBone) hipsBone.attach(bagRoot);
  if (chestBone) {
    chestBone.attach(strapRoot);
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

  function addTube(curve, radius, material, parent, name, tubularSegments = 40) {
    return addMesh(
      new THREE.TubeGeometry(curve, tubularSegments, radius, 8, false),
      material,
      parent,
      name
    );
  }

  // The strap crosses the chest, rounds the character's right flank and
  // returns to the satchel at the back of the right hip.
  const strapCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.145 * unit, 0.835 * height, 0.115 * unit),
    new THREE.Vector3(0.125 * unit, 0.765 * height, 0.135 * unit),
    new THREE.Vector3(0.045 * unit, 0.665 * height, 0.135 * unit),
    new THREE.Vector3(-0.095 * unit, 0.555 * height, 0.125 * unit),
    new THREE.Vector3(-0.205 * unit, 0.475 * height, 0.105 * unit),
    new THREE.Vector3(-0.255 * unit, 0.425 * height, 0.045 * unit),
    new THREE.Vector3(-0.265 * unit, 0.405 * height, -0.035 * unit),
    new THREE.Vector3(-0.265 * unit, 0.405 * height, -0.105 * unit),
    new THREE.Vector3(-0.255 * unit, 0.415 * height, -0.155 * unit)
  ]);
  const strapWidth = 0.038 * unit;
  const strapMaterial = new THREE.MeshStandardMaterial({
    color: 0x70472a,
    roughness: 0.9,
    metalness: 0.01,
    side: THREE.DoubleSide
  });
  addMesh(createRibbonGeometry(strapCurve, strapWidth), strapMaterial, strapRoot, 'CarterBagStrap');

  addTube(offsetRibbonEdge(strapCurve, strapWidth, -1), 0.0015 * unit, stitching, strapRoot, 'CarterBagStrapStitchLeft', 48);
  addTube(offsetRibbonEdge(strapCurve, strapWidth, 1), 0.0015 * unit, stitching, strapRoot, 'CarterBagStrapStitchRight', 48);

  const adjuster = addMesh(
    new THREE.BoxGeometry(0.043 * unit, 0.021 * unit, 0.008 * unit),
    brass,
    strapRoot,
    'CarterBagStrapAdjuster'
  );
  adjuster.position.set(0.102 * unit, 0.73 * height, 0.151 * unit);

  // Anatomical right / posterior placement: local -X and local -Z.
  const bagPivot = new THREE.Group();
  bagPivot.name = 'CarterRightHipSatchelPivot';
  bagPivot.position.set(-0.245 * unit, 0.375 * height, -0.135 * unit);
  bagPivot.rotation.y = -Math.PI / 2;
  bagPivot.rotation.z = -0.055;
  bagRoot.add(bagPivot);

  const bodyGeometry = extrudeShape(softSatchelShape(bagWidth, bagHeight), bagDepth, 0.014 * unit);
  addMesh(bodyGeometry, leather, bagPivot, 'CarterSoftSatchelBody');

  // A dark leather gusset creates a visible, padded side seam rather than a hard box edge.
  const gusset = addMesh(
    new THREE.BoxGeometry(0.016 * unit, bagHeight * 0.78, bagDepth * 0.88),
    leatherDark,
    bagPivot,
    'CarterSatchelGusset'
  );
  gusset.position.set(-bagWidth * 0.475, 0, bagDepth * 0.49);

  const flapWidth = bagWidth * 0.94;
  const flapHeight = bagHeight * 0.39;
  const flap = addMesh(
    extrudeShape(roundedRect(flapWidth, flapHeight, 0.035 * unit), bagDepth * 0.15, 0.006 * unit),
    leatherDark,
    bagPivot,
    'CarterSatchelSoftFlap'
  );
  flap.position.set(0, bagHeight * 0.285, bagDepth * 0.92);

  const pocketWidth = bagWidth * 0.56;
  const pocketHeight = bagHeight * 0.27;
  const frontPocket = addMesh(
    extrudeShape(roundedRect(pocketWidth, pocketHeight, 0.026 * unit), 0.009 * unit, 0.004 * unit),
    leatherLight,
    bagPivot,
    'CarterSatchelRoundedPocket'
  );
  frontPocket.position.set(0, -bagHeight * 0.235, bagDepth * 0.94);

  // Hand-finished seam lines and two restrained brass snaps make it read as leather goods.
  const pocketSeam = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-pocketWidth * 0.39, -bagHeight * 0.235, bagDepth * 1.105),
    new THREE.Vector3(0, -bagHeight * 0.235, bagDepth * 1.105),
    new THREE.Vector3(pocketWidth * 0.39, -bagHeight * 0.235, bagDepth * 1.105)
  ]);
  addTube(pocketSeam, 0.0013 * unit, stitching, bagPivot, 'CarterSatchelPocketStitch', 28);

  for (const [index, x] of [-0.065, 0.065].entries()) {
    const snap = addMesh(
      new THREE.SphereGeometry(0.0065 * unit, 12, 8),
      brassHighlight,
      bagPivot,
      'CarterSatchelBrassSnap' + index
    );
    snap.scale.set(1, 1, 0.45);
    snap.position.set(x * unit, bagHeight * 0.105, bagDepth * 1.09);
  }

  // A discreet attachment ring sits on the rear/top corner where the strap meets the bag.
  const attachmentRing = addMesh(
    new THREE.TorusGeometry(0.012 * unit, 0.0022 * unit, 7, 18),
    brass,
    bagPivot,
    'CarterSatchelRearAttachmentRing'
  );
  attachmentRing.position.set(-0.018 * unit, bagHeight * 0.43, bagDepth * 0.12);
  attachmentRing.rotation.y = Math.PI / 2;

  // The top half of the strap stays on the shoulder/chest; the bag itself follows the pelvis.
  const topRing = addMesh(
    new THREE.TorusGeometry(0.014 * unit, 0.0022 * unit, 7, 18),
    brass,
    strapRoot,
    'CarterSatchelShoulderRing'
  );
  topRing.position.set(0.145 * unit, 0.835 * height, 0.115 * unit);
  topRing.rotation.x = Math.PI / 2;

  // Keep the pendant design intact, but pull the chain and medallion closer to the chest surface.
  const necklaceInset = 0.045 * unit;
  const necklaceCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.105 * unit, 0.86 * height, 0.125 * unit - necklaceInset),
    new THREE.Vector3(-0.092 * unit, 0.795 * height, 0.155 * unit - necklaceInset),
    new THREE.Vector3(-0.045 * unit, 0.735 * height, 0.17 * unit - necklaceInset),
    new THREE.Vector3(0, 0.695 * height, 0.175 * unit - necklaceInset),
    new THREE.Vector3(0.045 * unit, 0.735 * height, 0.17 * unit - necklaceInset),
    new THREE.Vector3(0.092 * unit, 0.795 * height, 0.155 * unit - necklaceInset),
    new THREE.Vector3(0.105 * unit, 0.86 * height, 0.125 * unit - necklaceInset)
  ]);
  addTube(necklaceCurve, 0.0032 * unit, brassHighlight, necklaceRoot, 'CarterMedallionChain', 44);

  const pendantPivot = new THREE.Group();
  pendantPivot.name = 'CarterGoldMedallionPivot';
  pendantPivot.position.set(0, 0.695 * height, 0.182 * unit - necklaceInset);
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
    bagPivot.rotation.x = Math.sin(elapsed * (3.4 + gait * 3.0)) * gait * 0.014;
    bagPivot.rotation.z = -0.055 + Math.cos(elapsed * (3.8 + gait * 3.3)) * (0.003 + gait * 0.024);
    pendantPivot.rotation.x = Math.sin(elapsed * 2.9) * (0.008 + gait * 0.035);
    pendantPivot.rotation.z = Math.cos(elapsed * 3.6) * gait * 0.01;
  }

  function dispose() {
    bagRoot.removeFromParent();
    strapRoot.removeFromParent();
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
    attachment: (hipsBone ? 'hips-bone' : 'model-root')
      + ' + strap-' + (chestBone ? 'chest-bone' : 'model-root')
      + ' + necklace-' + (chestBone ? 'chest-bone' : 'model-root')
  };
}

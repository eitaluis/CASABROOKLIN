import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

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
    curveSegments: 16
  });
  geometry.computeVertexNormals();
  return geometry;
}

function findBone(root, candidates) {
  const wanted = candidates.map(name => String(name).toLowerCase().replace(/[^a-z0-9]/g, ''));
  const found = new Map();
  root.traverse((node) => {
    if (!node.isBone) return;
    const name = String(node.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (wanted.includes(name) && !found.has(name)) found.set(name, node);
  });
  for (const candidate of wanted) {
    if (found.has(candidate)) return found.get(candidate);
  }
  return null;
}

function createSurfaceProjector(characterRoot) {
  const surfaces = [];
  characterRoot.traverse((node) => {
    if (node.isSkinnedMesh && node.geometry?.attributes?.position) surfaces.push(node);
  });

  const raycaster = new THREE.Raycaster();
  const normalMatrix = new THREE.Matrix3();
  const inverseRoot = new THREE.Matrix4();

  function project(point, outward, offset = 0.006) {
    const fallbackNormal = outward.clone().normalize();
    if (!surfaces.length) {
      return {
        point: point.clone().addScaledVector(fallbackNormal, offset),
        normal: fallbackNormal,
        hit: false
      };
    }

    characterRoot.updateMatrixWorld(true);
    for (const surface of surfaces) surface.skeleton?.update();

    const originLocal = point.clone().addScaledVector(fallbackNormal, 0.45);
    const originWorld = characterRoot.localToWorld(originLocal.clone());
    const directionWorld = fallbackNormal.clone()
      .transformDirection(characterRoot.matrixWorld)
      .negate()
      .normalize();

    raycaster.set(originWorld, directionWorld);
    raycaster.near = 0;
    raycaster.far = 0.95;
    const intersections = raycaster.intersectObjects(surfaces, false);
    const hit = intersections.find(item => item.face && item.distance <= 0.95);

    if (!hit) {
      return {
        point: point.clone().addScaledVector(fallbackNormal, offset),
        normal: fallbackNormal,
        hit: false
      };
    }

    let worldNormal;
    if (typeof hit.object.getVertexPosition === 'function') {
      const a = hit.object.getVertexPosition(hit.face.a, new THREE.Vector3()).applyMatrix4(hit.object.matrixWorld);
      const b = hit.object.getVertexPosition(hit.face.b, new THREE.Vector3()).applyMatrix4(hit.object.matrixWorld);
      const c = hit.object.getVertexPosition(hit.face.c, new THREE.Vector3()).applyMatrix4(hit.object.matrixWorld);
      worldNormal = b.sub(a).cross(c.sub(a)).normalize();
    } else {
      worldNormal = hit.face.normal.clone()
        .applyMatrix3(normalMatrix.getNormalMatrix(hit.object.matrixWorld))
        .normalize();
    }

    inverseRoot.copy(characterRoot.matrixWorld).invert();
    const localNormal = worldNormal.clone().transformDirection(inverseRoot).normalize();
    if (localNormal.dot(fallbackNormal) < 0) localNormal.negate();

    const localPoint = characterRoot.worldToLocal(hit.point.clone());
    localPoint.addScaledVector(localNormal, offset);

    return { point: localPoint, normal: localNormal, hit: true };
  }

  return { project, surfaceCount: surfaces.length };
}

function interpolateNormal(normals, t) {
  if (!normals?.length) return new THREE.Vector3(0, 0, 1);
  if (normals.length === 1) return normals[0].clone();

  const position = THREE.MathUtils.clamp(t, 0, 1) * (normals.length - 1);
  const index = Math.min(normals.length - 2, Math.floor(position));
  const fraction = position - index;
  return normals[index].clone().lerp(normals[index + 1], fraction).normalize();
}

function ribbonSide(tangent, normal, previousSide = null) {
  const side = tangent.clone().cross(normal).normalize();
  if (side.lengthSq() < 0.0001) {
    side.copy(previousSide || new THREE.Vector3(1, 0, 0));
  }
  if (previousSide && side.dot(previousSide) < 0) side.negate();
  return side;
}

function createRibbonGeometry(curve, width, segments = 48, normals = null) {
  const points = curve.getPoints(segments);
  const positions = [];
  const indices = [];
  let previousSide = null;

  for (let i = 0; i < points.length; i++) {
    const t = i / segments;
    const previous = points[Math.max(0, i - 1)];
    const next = points[Math.min(points.length - 1, i + 1)];
    const tangent = next.clone().sub(previous).normalize();
    const normal = interpolateNormal(normals, t);
    const side = ribbonSide(tangent, normal, previousSide).multiplyScalar(width * 0.5);
    previousSide = side.clone().normalize();

    positions.push(
      points[i].x - side.x, points[i].y - side.y, points[i].z - side.z,
      points[i].x + side.x, points[i].y + side.y, points[i].z + side.z
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

function offsetRibbonEdge(curve, width, sideSign, segments = 48, normals = null) {
  const points = curve.getPoints(segments);
  const edgePoints = [];
  let previousSide = null;

  for (let i = 0; i < points.length; i++) {
    const t = i / segments;
    const previous = points[Math.max(0, i - 1)];
    const next = points[Math.min(points.length - 1, i + 1)];
    const tangent = next.clone().sub(previous).normalize();
    const normal = interpolateNormal(normals, t);
    const side = ribbonSide(tangent, normal, previousSide);
    previousSide = side.clone();
    edgePoints.push(
      points[i].clone()
        .addScaledVector(side, width * 0.34 * sideSign)
        .addScaledVector(normal, 0.0012)
    );
  }
  return new THREE.CatmullRomCurve3(edgePoints);
}

export function createCarterAccessories({ characterRoot, height = 1.75 }) {
  const unit = height / 1.75;

  // Innerscene's approved body dimensions at the agreed 0.88 scale:
  // 230 x 86 x 180 mm -> approximately 202 x 76 x 158 mm.
  const bagWidth = 0.202 * unit;
  const bagHeight = 0.158 * unit;
  const bagDepth = 0.076 * unit;
  const strapWidth = 0.022 * unit;

  const geometries = new Set();
  const materials = new Set();

  const leather = new THREE.MeshStandardMaterial({
    color: 0x80502f,
    roughness: 0.88,
    metalness: 0.01
  });
  const leatherDark = new THREE.MeshStandardMaterial({
    color: 0x593820,
    roughness: 0.9,
    metalness: 0.01
  });
  const leatherLight = new THREE.MeshStandardMaterial({
    color: 0x98643c,
    roughness: 0.86,
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
  const strapMaterial = new THREE.MeshStandardMaterial({
    color: 0x70472a,
    roughness: 0.88,
    metalness: 0.01,
    side: THREE.DoubleSide
  });

  [leather, leatherDark, leatherLight, stitching, brass, brassHighlight, strapMaterial]
    .forEach(material => materials.add(material));

  const bagRoot = new THREE.Group();
  bagRoot.name = 'CarterBagRigAnchor';
  const strapChestRoot = new THREE.Group();
  strapChestRoot.name = 'CarterStrapChestAnchor';
  const strapHipRoot = new THREE.Group();
  strapHipRoot.name = 'CarterStrapHipAnchor';
  const necklaceRoot = new THREE.Group();
  necklaceRoot.name = 'CarterNecklaceRigAnchor';

  // Build every accessory in Carter's model-local coordinate system first.
  // Reparenting to bones happens only after the geometry is complete, so
  // Object3D.attach() preserves the designed rest-pose position.
  characterRoot.add(bagRoot, strapChestRoot, strapHipRoot, necklaceRoot);
  characterRoot.updateMatrixWorld(true);

  const hipsBone = findBone(characterRoot, ['Hips', 'mixamorigHips', 'Hip']);
  const chestBone = findBone(characterRoot, ['Spine2', 'mixamorigSpine2', 'Spine1', 'mixamorigSpine1', 'Chest', 'Spine']);
  const surface = createSurfaceProjector(characterRoot);

  function addMesh(geometry, material, parent, name) {
    geometries.add(geometry);
    if (Array.isArray(material)) material.forEach(item => materials.add(item));
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

  // The satchel is seated on the right posterior hip. The side-facing body
  // starts at the fitted body surface and extrudes outward, not into the pelvis.
  const bagAnchorFit = surface.project(
    new THREE.Vector3(-0.205 * unit, 0.375 * height, -0.085 * unit),
    new THREE.Vector3(-0.92, 0, -0.39),
    0.004 * unit
  );

  const bagPivot = new THREE.Group();
  bagPivot.name = 'CarterRightHipSatchelPivot';
  const bagProcedural = new THREE.Group();
  bagProcedural.name = 'CarterSatchelProceduralFallback';
  bagPivot.add(bagProcedural);
  bagPivot.position.copy(bagAnchorFit.point);
  const bagFacingYaw = Math.atan2(bagAnchorFit.normal.x, bagAnchorFit.normal.z);
  bagPivot.rotation.set(0, bagFacingYaw, -0.055);
  bagRoot.add(bagPivot);

  const bodyGeometry = extrudeShape(softSatchelShape(bagWidth, bagHeight), bagDepth, 0.011 * unit);
  addMesh(bodyGeometry, leather, bagProcedural, 'CarterSoftSatchelBody');

  const gusset = addMesh(
    new THREE.BoxGeometry(0.012 * unit, bagHeight * 0.78, bagDepth * 0.88),
    leatherDark,
    bagProcedural,
    'CarterSatchelSoftGusset'
  );
  gusset.position.set(-bagWidth * 0.475, 0, bagDepth * 0.49);

  const flapWidth = bagWidth * 0.96;
  const flapHeight = bagHeight * 0.43;
  const flap = addMesh(
    extrudeShape(roundedRect(flapWidth, flapHeight, 0.028 * unit), bagDepth * 0.17, 0.004 * unit),
    leatherDark,
    bagProcedural,
    'CarterSatchelSoftFlap'
  );
  flap.position.set(0, bagHeight * 0.275, bagDepth * 0.91);

  const pocketWidth = bagWidth * 0.52;
  const pocketHeight = bagHeight * 0.25;
  const frontPocket = addMesh(
    extrudeShape(roundedRect(pocketWidth, pocketHeight, 0.022 * unit), 0.007 * unit, 0.003 * unit),
    leatherLight,
    bagProcedural,
    'CarterSatchelRoundedPocket'
  );
  frontPocket.position.set(0, -bagHeight * 0.24, bagDepth * 0.94);

  const pocketSeam = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-pocketWidth * 0.38, -bagHeight * 0.24, bagDepth * 1.10),
    new THREE.Vector3(0, -bagHeight * 0.24, bagDepth * 1.10),
    new THREE.Vector3(pocketWidth * 0.38, -bagHeight * 0.24, bagDepth * 1.10)
  ]);
  addTube(pocketSeam, 0.0011 * unit, stitching, bagProcedural, 'CarterSatchelPocketStitch', 24);

  for (const [index, x] of [-0.052, 0.052].entries()) {
    const snap = addMesh(
      new THREE.SphereGeometry(0.0048 * unit, 12, 8),
      brassHighlight,
      bagProcedural,
      'CarterSatchelBrassSnap' + index
    );
    snap.scale.set(1, 1, 0.45);
    snap.position.set(x * unit, bagHeight * 0.105, bagDepth * 1.08);
  }

  const attachmentRing = addMesh(
    new THREE.TorusGeometry(0.010 * unit, 0.0018 * unit, 7, 18),
    brass,
    bagProcedural,
    'CarterSatchelRearAttachmentRing'
  );
  const attachmentOffset = new THREE.Vector3(-0.016 * unit, bagHeight * 0.27, bagDepth * 0.12);
  attachmentRing.position.copy(attachmentOffset);

  bagPivot.updateMatrix();
  const bagRingPoint = attachmentOffset.clone().applyMatrix4(bagPivot.matrix);

  // A bolsa aprovada da Innerscene entra como malha PBR real; sua alça original
  // é desligada porque a fita do Carter é refeita em duas partes, projetada no
  // tórax e na lateral do quadril, e presa aos ossos correspondentes.
  const approvedBagUrl = new URL('../assets/models/carter/innerscene-crossbody-bag.glb', import.meta.url).href;
  const bagLoader = new GLTFLoader();
  bagLoader.load(
    approvedBagUrl,
    (gltf) => {
      const sourceBag = gltf.scene;
      sourceBag.name = 'InnersceneCrossbodyBagBody';
      sourceBag.scale.setScalar(0.88 * unit);
      // O GLB original é Z-up e declara a frente no eixo -Y. A rotação converte
      // para Y-up do Three.js e deixa a face da bolsa apontada para +Z do pivô.
      sourceBag.rotation.x = -Math.PI / 2;
      let removedSourceStrap = false;
      sourceBag.traverse((node) => {
        const name = String(node.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        if (name === 'shoulderstrap' || name.includes('shoulderstrap')) {
          node.visible = false;
          removedSourceStrap = true;
        }
      });
      sourceBag.updateMatrixWorld(true);
      const sourceBounds = new THREE.Box3().setFromObject(sourceBag);
      const sourceSize = sourceBounds.getSize(new THREE.Vector3());
      const sourceCenter = sourceBounds.getCenter(new THREE.Vector3());
      // The body is centered laterally and vertically; its rear face starts at
      // the fitted skin anchor, so the leather volume sits outside the pelvis.
      sourceBag.position.sub(sourceCenter);
      sourceBag.position.z += sourceSize.z * 0.5;
      sourceBag.traverse((node) => {
        if (!node.isMesh) return;
        node.castShadow = true;
        node.receiveShadow = true;
        if (node.material) {
          const map = node.material.map;
          if (map) map.anisotropy = Math.max(map.anisotropy || 1, 8);
        }
      });
      bagPivot.add(sourceBag);
      bagProcedural.visible = false;
      bagPivot.userData.assetState = 'loaded';
      bagPivot.userData.assetSource = approvedBagUrl;
      bagPivot.userData.sourceStrapRemoved = removedSourceStrap;
    },
    undefined,
    (error) => {
      bagPivot.userData.assetState = 'fallback';
      console.warn('CASABROOKLIN: a bolsa CC0 da Innerscene não carregou; mantendo o modelo procedural com alça ajustada.', error);
    }
  );

  // The strap follows the actual skinned shirt surface. Its chest and hip
  // portions use separate bone anchors, meeting at the right flank.
  const rawStrapPoints = [
    new THREE.Vector3(0.145 * unit, 0.835 * height, 0.165 * unit),
    new THREE.Vector3(0.125 * unit, 0.765 * height, 0.185 * unit),
    new THREE.Vector3(0.045 * unit, 0.665 * height, 0.19 * unit),
    new THREE.Vector3(-0.095 * unit, 0.555 * height, 0.185 * unit),
    new THREE.Vector3(-0.17 * unit, 0.49 * height, 0.15 * unit),
    new THREE.Vector3(-0.22 * unit, 0.455 * height, 0.085 * unit),
    new THREE.Vector3(-0.245 * unit, 0.42 * height, 0.015 * unit),
    new THREE.Vector3(-0.255 * unit, 0.40 * height, -0.07 * unit),
    bagRingPoint
  ];
  const outwardDirections = [
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(-0.12, 0, 0.99).normalize(),
    new THREE.Vector3(-0.48, 0, 0.88).normalize(),
    new THREE.Vector3(-0.92, 0, 0.39).normalize(),
    new THREE.Vector3(-0.94, 0, -0.34).normalize(),
    new THREE.Vector3(-0.55, 0, -0.84).normalize(),
    new THREE.Vector3(-0.92, 0, -0.39).normalize()
  ];

  const strapFit = rawStrapPoints.map((point, index) => {
    if (index === rawStrapPoints.length - 1) {
      return { point: point.clone(), normal: outwardDirections[index].clone(), hit: false };
    }
    return surface.project(point, outwardDirections[index], 0.006 * unit);
  });

  function makeStrapSegment(segment, parent, name) {
    const points = segment.map(item => item.point);
    const normals = segment.map(item => item.normal);
    const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal');
    addMesh(createRibbonGeometry(curve, strapWidth, 56, normals), strapMaterial, parent, name);
    addTube(
      offsetRibbonEdge(curve, strapWidth, -1, 56, normals),
      0.00085 * unit,
      stitching,
      parent,
      name + 'StitchLeft',
      56
    );
    addTube(
      offsetRibbonEdge(curve, strapWidth, 1, 56, normals),
      0.00085 * unit,
      stitching,
      parent,
      name + 'StitchRight',
      56
    );
    return curve;
  }

  const splitIndex = 5;
  const chestStrapCurve = makeStrapSegment(strapFit.slice(0, splitIndex + 1), strapChestRoot, 'CarterBagStrapChest');
  makeStrapSegment(strapFit.slice(splitIndex), strapHipRoot, 'CarterBagStrapHip');

  const adjusterT = 0.22;
  const adjuster = addMesh(
    new THREE.BoxGeometry(0.032 * unit, 0.010 * unit, 0.003 * unit),
    brass,
    strapChestRoot,
    'CarterBagStrapAdjuster'
  );
  const adjusterNormal = interpolateNormal(strapFit.slice(0, splitIndex + 1).map(item => item.normal), adjusterT);
  const adjusterTangent = chestStrapCurve.getTangentAt(adjusterT).normalize();
  const adjusterSide = ribbonSide(adjusterTangent, adjusterNormal);
  const adjusterBasis = new THREE.Matrix4().makeBasis(adjusterSide, adjusterTangent, adjusterNormal);
  adjuster.quaternion.setFromRotationMatrix(adjusterBasis);
  adjuster.position.copy(chestStrapCurve.getPoint(adjusterT));
  adjuster.position.addScaledVector(adjusterNormal, 0.002 * unit);

  // The pendant design is preserved. The chain is projected onto the real
  // shirt surface, while its root follows the upper torso rather than a guessed offset.
  const rawNecklacePoints = [
    new THREE.Vector3(-0.105 * unit, 0.86 * height, 0.125 * unit),
    new THREE.Vector3(-0.092 * unit, 0.795 * height, 0.155 * unit),
    new THREE.Vector3(-0.045 * unit, 0.735 * height, 0.17 * unit),
    new THREE.Vector3(0, 0.695 * height, 0.175 * unit),
    new THREE.Vector3(0.045 * unit, 0.735 * height, 0.17 * unit),
    new THREE.Vector3(0.092 * unit, 0.795 * height, 0.155 * unit),
    new THREE.Vector3(0.105 * unit, 0.86 * height, 0.125 * unit)
  ];
  const necklaceOutwardDirections = [
    new THREE.Vector3(-0.45, 0.18, 0.88).normalize(),
    new THREE.Vector3(-0.34, 0.08, 0.94).normalize(),
    new THREE.Vector3(-0.16, 0.02, 0.99).normalize(),
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0.16, 0.02, 0.99).normalize(),
    new THREE.Vector3(0.34, 0.08, 0.94).normalize(),
    new THREE.Vector3(0.45, 0.18, 0.88).normalize()
  ];
  const necklaceFit = rawNecklacePoints.map((point, index) =>
    surface.project(point, necklaceOutwardDirections[index], 0.005 * unit)
  );
  const necklaceCurve = new THREE.CatmullRomCurve3(
    necklaceFit.map(item => item.point),
    false,
    'centripetal'
  );
  addTube(necklaceCurve, 0.0027 * unit, brassHighlight, necklaceRoot, 'CarterMedallionChain', 56);

  const pendantPivot = new THREE.Group();
  pendantPivot.name = 'CarterGoldMedallionPivot';
  pendantPivot.position.copy(necklaceFit[3].point);
  pendantPivot.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    necklaceFit[3].normal.clone().normalize()
  );
  necklaceRoot.add(pendantPivot);

  const medallion = addMesh(
    new THREE.CylinderGeometry(0.032 * unit, 0.032 * unit, 0.008 * unit, 32),
    brass,
    pendantPivot,
    'CarterGoldMedallion'
  );
  medallion.rotation.x = Math.PI / 2;

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

  // Reparent only after all geometry has been authored in model-local space.
  // attach() now preserves the rest-pose positions and keeps each piece on its
  // correct anatomical region during the shared desktop/mobile animation loop.
  characterRoot.updateMatrixWorld(true);
  if (hipsBone) {
    hipsBone.attach(bagRoot);
    hipsBone.attach(strapHipRoot);
  }
  if (chestBone) {
    chestBone.attach(strapChestRoot);
    chestBone.attach(necklaceRoot);
  }

  let elapsed = 0;
  function update(delta, speed = 0) {
    elapsed += delta;
    const gait = THREE.MathUtils.clamp(speed / 4.2, 0, 1);
    bagPivot.rotation.x = Math.sin(elapsed * (3.4 + gait * 3.0)) * gait * 0.012;
    bagPivot.rotation.z = -0.055 + Math.cos(elapsed * (3.8 + gait * 3.3)) * (0.002 + gait * 0.018);
  }

  function dispose() {
    bagRoot.removeFromParent();
    strapChestRoot.removeFromParent();
    strapHipRoot.removeFromParent();
    necklaceRoot.removeFromParent();
    geometries.forEach(geometry => geometry.dispose());
    materials.forEach(material => material.dispose());
    geometries.clear();
    materials.clear();
  }

  return {
    root: bagRoot,
    update,
    dispose,
    attachment: 'bag-' + (hipsBone ? 'hips:' + hipsBone.name : 'model-root')
      + '; strap-chest-' + (chestBone ? chestBone.name : 'model-root')
      + '; strap-hip-' + (hipsBone ? hipsBone.name : 'model-root')
      + '; necklace-' + (chestBone ? chestBone.name : 'model-root')
      + '; surface-fit-' + surface.surfaceCount + '-skinned-meshes'
  };
}

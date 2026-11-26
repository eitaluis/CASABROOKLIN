import * as THREE from 'three';
import { createCharacter as createAraCharacter } from 'ara3d';

/*
 * Carter Kane — retorno à base humana rigada do Ara 3D Gen.
 * A versão procedural anterior foi rejeitada visualmente: ela foi removida.
 * Esta versão usa uma malha humana contínua com skin weights e rig de jogo;
 * os ajustes de estilo ficam no figurino, no material e nos acessórios.
 */

const CARTER_INPUT = {
  kind: 'ara-character',
  version: 1,
  params: {
    name: 'Carter Kane',
    gender: 1,
    age: 0.2544642857142857,
    muscle: 0.4,
    weight: 0.4,
    proportions: 0.5,
    african: 1,
    asian: 0,
    caucasian: 0,
    skin: 'young_african_male',
    eyes: 'brown',
    hair: 'short01',
    hairColor: '#17120F',
    facialHair: 'none',
    outfit: 'none',
    top: 'uniform_shirt',
    bottom: 'cargo_pants',
    garmentStyles: {
      uniform_shirt: { pattern: 'solid', color: '#285A9C' },
      cargo_pants: { pattern: 'khaki', color: '#B49A68' }
    },
    shoes: 'sneakers',
    carry: 'none',
    rig: 'game',
    faceBones: true,
    restPose: 'A'
  }
};

function makeSatchel(THREE, scale) {
  const group = new THREE.Group();
  group.name = 'CarterCrossbodySatchel';
  const materials = [];
  const geometries = [];

  const material = (color, roughness = 0.82, metalness = 0) => {
    const value = new THREE.MeshStandardMaterial({ color, roughness, metalness });
    materials.push(value);
    return value;
  };

  const leather = material(0x75472c, 0.88);
  const leatherLight = material(0x96623d, 0.86);
  const leatherDark = material(0x4a2d1d, 0.9);
  const stitch = material(0xc6a276, 0.9);
  const brass = material(0xb68b4c, 0.42, 0.68);

  function roundedPanel(width, height, radius, depth, bevel = 0.006) {
    const x = width / 2;
    const y = height / 2;
    const r = Math.min(radius, x * 0.8, y * 0.8);
    const shape = new THREE.Shape();
    shape.moveTo(-x + r, -y);
    shape.lineTo(x - r, -y);
    shape.quadraticCurveTo(x, -y, x, -y + r);
    shape.lineTo(x, y - r);
    shape.quadraticCurveTo(x, y, x - r, y);
    shape.lineTo(-x + r, y);
    shape.quadraticCurveTo(-x, y, -x, y - r);
    shape.lineTo(-x, -y + r);
    shape.quadraticCurveTo(-x, -y, -x + r, -y);
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: bevel,
      bevelThickness: bevel,
      curveSegments: 10
    });
    geometry.translate(0, 0, -depth / 2);
    geometries.push(geometry);
    return geometry;
  }

  function addMesh(name, geometry, mat, position, rotation = [0, 0, 0]) {
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.name = name;
    mesh.position.set(position[0], position[1], position[2]);
    mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  }

  const w = 0.235 * scale;
  const h = 0.19 * scale;
  const d = 0.082 * scale;

  addMesh(
    'Bolsa · corpo de couro',
    roundedPanel(w, h, 0.024 * scale, d, 0.007 * scale),
    leather,
    [0, 0, 0]
  );

  // Fole lateral para que a bolsa tenha volume, não aparência de placa.
  const sideGeometry = new THREE.BoxGeometry(0.012 * scale, 0.145 * scale, 0.072 * scale);
  geometries.push(sideGeometry);
  addMesh('Bolsa · fole lateral', sideGeometry, leatherDark, [w * 0.47, -0.012 * scale, 0]);

  const flapGeometry = roundedPanel(w * 0.97, h * 0.48, 0.018 * scale, 0.014 * scale, 0.004 * scale);
  addMesh('Bolsa · aba frontal', flapGeometry, leatherLight, [0, h * 0.255, d * 0.53]);

  // Linha de costura aparente ao redor da aba.
  const flapPoints = [
    [-w * 0.43, h * 0.04, d * 0.66],
    [-w * 0.43, h * 0.43, d * 0.66],
    [-w * 0.28, h * 0.49, d * 0.66],
    [0, h * 0.49, d * 0.66],
    [w * 0.28, h * 0.49, d * 0.66],
    [w * 0.43, h * 0.43, d * 0.66],
    [w * 0.43, h * 0.04, d * 0.66]
  ].map(p => new THREE.Vector3(p[0], p[1], p[2]));
  const seam = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(flapPoints), 36, 0.0018 * scale, 6, false),
    stitch
  );
  seam.name = 'Bolsa · pesponto';
  seam.castShadow = true;
  group.add(seam);
  geometries.push(seam.geometry);

  const clasp = new THREE.Mesh(
    new THREE.BoxGeometry(0.038 * scale, 0.043 * scale, 0.009 * scale),
    brass
  );
  clasp.name = 'Bolsa · fecho de latão';
  clasp.position.set(0, h * 0.12, d * 0.72);
  clasp.castShadow = true;
  group.add(clasp);
  geometries.push(clasp.geometry);

  const tongue = new THREE.Mesh(
    new THREE.BoxGeometry(0.012 * scale, 0.026 * scale, 0.004 * scale),
    leatherDark
  );
  tongue.position.set(0, h * 0.12, d * 0.79);
  tongue.castShadow = true;
  group.add(tongue);
  geometries.push(tongue.geometry);

  // Argolas laterais em latão.
  for (const side of [-1, 1]) {
    const ringGeometry = new THREE.TorusGeometry(0.014 * scale, 0.003 * scale, 8, 20);
    geometries.push(ringGeometry);
    const ring = new THREE.Mesh(ringGeometry, brass);
    ring.position.set(side * w * 0.51, h * 0.32, 0);
    ring.rotation.y = Math.PI / 2;
    ring.castShadow = true;
    group.add(ring);
  }

  return { group, materials, geometries };
}

function makeStrap(THREE, parent, scale) {
  // Ara's generated character faces +Z in local space. The game wrapper turns
  // the actor 180 degrees, so local -X becomes the character's right hip.
  const points = [
    [0.165, 1.48, 0.095],
    [0.178, 1.39, 0.102],
    [0.135, 1.27, 0.109],
    [0.065, 1.13, 0.112],
    [-0.035, 0.98, 0.116],
    [-0.135, 0.82, 0.113],
    [-0.17, 0.74, 0.108]
  ].map(p => new THREE.Vector3(p[0] * scale, p[1] * scale, p[2] * scale));

  const curve = new THREE.CatmullRomCurve3(points);
  const segments = 52;
  const halfWidth = 0.021 * scale;
  const vertices = [];
  const uvs = [];
  const indices = [];
  const edgeA = [];
  const edgeB = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const center = curve.getPoint(t);
    const tangent = curve.getTangent(t).normalize();
    const across = new THREE.Vector3(-tangent.y, tangent.x, 0).normalize().multiplyScalar(halfWidth);
    const a = center.clone().add(across);
    const b = center.clone().sub(across);
    // Small lift from the shirt surface to prevent z-fighting.
    a.z += 0.004 * scale;
    b.z += 0.004 * scale;
    vertices.push(a.x, a.y, a.z, b.x, b.y, b.z);
    uvs.push(0, t, 1, t);
    edgeA.push(a);
    edgeB.push(b);
    if (i < segments) {
      const n = i * 2;
      indices.push(n, n + 2, n + 1, n + 1, n + 2, n + 3);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const strapMaterial = new THREE.MeshStandardMaterial({
    color: 0x4c2d1d,
    roughness: 0.88,
    side: THREE.DoubleSide
  });
  const strap = new THREE.Mesh(geometry, strapMaterial);
  strap.name = 'Bolsa · alça transversal';
  strap.castShadow = true;
  parent.add(strap);

  const edgeMaterial = new THREE.MeshStandardMaterial({ color: 0xb78b59, roughness: 0.9 });
  const edgeGeometryA = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(edgeA), segments, 0.0018 * scale, 5, false);
  const edgeGeometryB = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(edgeB), segments, 0.0018 * scale, 5, false);
  const edgeMeshA = new THREE.Mesh(edgeGeometryA, edgeMaterial);
  const edgeMeshB = new THREE.Mesh(edgeGeometryB, edgeMaterial);
  edgeMeshA.name = 'Alça · costura externa esquerda';
  edgeMeshB.name = 'Alça · costura externa direita';
  parent.add(edgeMeshA, edgeMeshB);

  // Regulador de alça em latão no peito.
  const buckle = new THREE.Group();
  buckle.name = 'Alça · regulador de latão';
  buckle.position.set(0.035 * scale, 1.095 * scale, 0.12 * scale);
  buckle.rotation.z = -0.38;
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(0.055 * scale, 0.048 * scale, 0.009 * scale),
    new THREE.MeshStandardMaterial({ color: 0xb68b4c, metalness: 0.68, roughness: 0.42 })
  );
  const bar = new THREE.Mesh(
    new THREE.BoxGeometry(0.007 * scale, 0.043 * scale, 0.012 * scale),
    new THREE.MeshStandardMaterial({ color: 0x4c2d1d, roughness: 0.88 })
  );
  buckle.add(frame, bar);
  parent.add(buckle);

  return {
    meshes: [strap, edgeMeshA, edgeMeshB, buckle],
    geometries: [geometry, edgeGeometryA, edgeGeometryB, frame.geometry, bar.geometry],
    materials: [strapMaterial, edgeMaterial, frame.material, bar.material]
  };
}

export async function createCharacter({ scene, onModeChange = () => {} }) {
  const loading = document.getElementById('loading');
  const hero = await createAraCharacter(CARTER_INPUT, {
    animations: ['idle', 'walk', 'run', 'jump_start', 'jump_air', 'jump_land'],
    detail: 'medium',
    colors: {
      top: '#285A9C',
      bottom: '#B49A68',
      shoes: '#223B67'
    },
    onProgress: (label, fraction) => {
      if (!loading || loading.classList.contains('done')) return;
      const percent = Number.isFinite(fraction) ? Math.round(fraction * 100) : null;
      loading.textContent = percent === null
        ? 'BROOKLYN HOUSE — CARREGANDO CARTER KANE'
        : `BROOKLYN HOUSE — CARREGANDO CARTER KANE · ${percent}%`;
    }
  });

  const mixer = new THREE.AnimationMixer(hero.scene);
  let locomotion = hero.locomotion(mixer);
  let jumping = false;
  let movementSpeed = 0;
  let elapsed = 0;

  const root = new THREE.Group();
  root.name = 'CarterMovementRoot';
  scene.add(root);
  root.add(hero.scene);
  hero.scene.rotation.y = Math.PI;

  const characterScale = (hero.height || 1.75) / 1.75;
  const satchel = makeSatchel(THREE, characterScale);
  const satchelPivot = new THREE.Group();
  satchelPivot.name = 'Bolsa transversal · quadril direito';
  satchelPivot.position.set(-0.172 * characterScale, 0.72 * characterScale, 0.095 * characterScale);
  satchelPivot.rotation.z = -0.035;
  satchelPivot.add(satchel.group);
  hero.scene.add(satchelPivot);

  const strap = makeStrap(THREE, hero.scene, characterScale);

  function jump() {
    if (jumping) return;
    const startClip = hero.clip('jump_start');
    const airClip = hero.clip('jump_air');
    const landClip = hero.clip('jump_land');
    if (!startClip || !airClip || !landClip) {
      console.warn('O conjunto de animações jump_start/jump_air/jump_land não está completo.');
      return;
    }
    jumping = true;
    locomotion.stop();
    const sequence = hero.playSequence(mixer, 'jump_start, jump_air 0.45s, jump_land', { repeat: false });
    const finishJump = (event) => {
      if (event.action.getClip() !== landClip) return;
      mixer.removeEventListener('finished', finishJump);
      sequence.stop();
      jumping = false;
      locomotion = hero.locomotion(mixer);
      locomotion.speed = movementSpeed;
      state.locomotion = locomotion;
    };
    mixer.addEventListener('finished', finishJump);
  }

  const state = {
    model: root,
    human: null,
    ara: hero,
    mixer,
    locomotion,
    jump,
    locomotionName: 'Carter Kane · malha humana rigada',
    updateFallback(dt, speed) {
      movementSpeed = speed;
      elapsed += dt;
      if (!jumping) locomotion.speed = speed;
      mixer.update(dt);
      hero.update(dt);

      // Balanço pequeno, secundário e amortecido da bolsa, sem alterar o clip do corpo.
      const movement = THREE.MathUtils.clamp(Math.abs(speed) / 4.2, 0, 1);
      const swing = Math.sin(elapsed * 8.2) * 0.045 * movement;
      satchelPivot.rotation.z = -0.035 + swing;
      satchelPivot.rotation.x = Math.sin(elapsed * 8.2 + 0.8) * 0.018 * movement;
    },
    resetFallback() {
      locomotion.speed = 0;
      root.rotation.set(0, 0, 0);
      satchelPivot.rotation.set(0, 0, -0.035);
    },
    dispose() {
      hero.dispose();
      for (const geometry of [...satchel.geometries, ...strap.geometries]) geometry.dispose();
      for (const mat of [...satchel.materials, ...strap.materials]) mat.dispose();
      root.removeFromParent();
    }
  };

  onModeChange(state.locomotionName);
  return state;
}

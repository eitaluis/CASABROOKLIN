// Inventário diegético do Carter: os objetos ficam no Duat até serem retirados.
// O fluxo de portal e os IDs dos itens são genéricos para reutilização por outros magos.
export function createInventory({
  THREE,
  character,
  onUse = () => {},
  setControlsLocked = () => {},
  handBoneCandidates = ['weaponr', 'righthand', 'mixamorigrighthand', 'handr', 'righthandindex1'],
  fallbackSocketPosition = [0.4, 0.94, 0.04]
}) {
  const brass = new THREE.MeshStandardMaterial({ color: 0xb98b4d, metalness: 0.78, roughness: 0.28 });
  const darkBrass = new THREE.MeshStandardMaterial({ color: 0x654322, metalness: 0.68, roughness: 0.38 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x3a251c, roughness: 0.74 });
  const lapis = new THREE.MeshStandardMaterial({ color: 0x245a78, metalness: 0.46, roughness: 0.24 });
  const bladeMat = new THREE.MeshStandardMaterial({ color: 0xb2b9b2, metalness: 0.88, roughness: 0.24 });
  const darkGrip = new THREE.MeshStandardMaterial({ color: 0x241b18, roughness: 0.9 });
  const wax = new THREE.MeshStandardMaterial({ color: 0xd7b979, roughness: 0.76, metalness: 0.01 });
  const waxShade = new THREE.MeshStandardMaterial({ color: 0x9f7a42, roughness: 0.84 });
  const linen = new THREE.MeshStandardMaterial({ color: 0xe2d3ad, roughness: 0.92 });
  const ink = new THREE.MeshStandardMaterial({ color: 0x342a25, roughness: 0.82 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xc69a4c, metalness: 0.72, roughness: 0.32 });

  let weaponBone = null;
  const bonePriority = new Map(handBoneCandidates.map((name, index) => [String(name).toLowerCase().replace(/[^a-z0-9]/g, ''), index]));
  let selectedPriority = Infinity;
  character.model.traverse((node) => {
    if (!node.isBone) return;
    const name = String(node.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const priority = bonePriority.get(name);
    if (priority !== undefined && priority < selectedPriority) {
      weaponBone = node;
      selectedPriority = priority;
    }
  });

  const socket = new THREE.Group();
  socket.name = 'DuatRightHandSocket';
  if (weaponBone) {
    weaponBone.add(socket);
  } else {
    character.model.add(socket);
    socket.position.set(...fallbackSocketPosition);
  }

  function metalBand(parent, y, radius = 0.075) {
    const band = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.018, 7, 18), brass);
    band.rotation.x = Math.PI / 2;
    band.position.y = y;
    parent.add(band);
  }

  const itemCapabilities = {
    staff: { actions: ['channel_magic', 'melee_impact'], reactions: ['focus_for_spell'] },
    khopesh: { actions: ['melee_slash', 'melee_impact'], reactions: ['weapon_enchantment'] },
    wax_shabti: { actions: ['summon_servant'], reactions: ['levitate', 'animate', 'break', 'repair', 'bind'] },
    magic_box: { actions: ['store_tools', 'open_container'], reactions: ['open', 'close', 'unlock', 'levitate'] },
    papyrus: { actions: ['write', 'draw_hieroglyph'], reactions: ['inscribe', 'burn', 'tear', 'levitate'] },
    reed_pen: { actions: ['write', 'draw_hieroglyph'], reactions: ['enchant', 'levitate'] },
    ink: { actions: ['write', 'draw_hieroglyph'], reactions: ['spill', 'freeze', 'levitate'] },
    protective_amulet: { actions: ['wear', 'ward'], reactions: ['activate_ward', 'enchant', 'levitate'] },
    wax_lump: { actions: ['mold', 'create_shabti'], reactions: ['heat', 'melt', 'levitate'] },
    scribe_palette: { actions: ['mix_pigment', 'hold_ink'], reactions: ['break', 'levitate'] },
    brown_twine: { actions: ['tie', 'bind'], reactions: ['cut', 'burn', 'levitate'] },
    ebony_cat: { actions: ['place_artifact'], reactions: ['animate', 'levitate', 'break', 'repair'] }
  };

  function registerItem(id, group, kind, description) {
    group.name = 'DuatItem_' + id;
    group.visible = false;
    group.userData.itemId = id;
    group.userData.kind = kind;
    group.userData.description = description;
    group.userData.capabilities = itemCapabilities[id] || { actions: [], reactions: [] };
    group.userData.restPosition = group.position.clone();
    group.userData.baseScale = group.scale.clone();
    items.set(id, group);
    socket.add(group);
    return group;
  }

  const items = new Map();

  function buildStaff() {
    const group = new THREE.Group();
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.058, 1.62, 12), wood);
    shaft.position.y = 0.82;
    shaft.castShadow = true;
    group.add(shaft);
    for (const y of [0.12, 0.2, 1.36, 1.48]) metalBand(group, y);
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.075, 0.16, 12), darkBrass);
    collar.position.y = 1.62;
    group.add(collar);
    const sunDisk = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.075, 20), brass);
    sunDisk.position.y = 1.79;
    group.add(sunDisk);
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.105, 1), lapis);
    gem.position.set(0, 1.91, 0);
    group.add(gem);
    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.025, 8, 24), brass);
    halo.position.y = 1.8;
    halo.rotation.x = Math.PI / 2;
    group.add(halo);
    const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 8), brass);
    pommel.position.y = 0.025;
    group.add(pommel);
    group.traverse(obj => { if (obj.isMesh) { obj.castShadow = true; obj.receiveShadow = true; } });
    return registerItem('staff', group, 'weapon', 'Cajado mágico egípcio');
  }

  function buildKhopesh() {
    const group = new THREE.Group();
    const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 8), brass);
    pommel.position.y = -0.28;
    group.add(pommel);
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.34, 10), darkGrip);
    grip.position.y = -0.08;
    group.add(grip);
    for (const y of [-0.2, 0.04]) metalBand(group, y, 0.06);
    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.075, 0.12), brass);
    guard.position.y = 0.13;
    group.add(guard);

    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(-0.055, 0.16);
    bladeShape.lineTo(0.055, 0.16);
    bladeShape.lineTo(0.12, 0.74);
    bladeShape.quadraticCurveTo(0.18, 1.08, 0.48, 1.26);
    bladeShape.quadraticCurveTo(0.72, 1.41, 0.79, 1.16);
    bladeShape.quadraticCurveTo(0.7, 0.94, 0.51, 0.91);
    bladeShape.quadraticCurveTo(0.32, 0.87, 0.27, 0.68);
    bladeShape.lineTo(0.15, 0.16);
    bladeShape.closePath();
    const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, {
      depth: 0.055, bevelEnabled: true, bevelSegments: 3,
      steps: 1, bevelSize: 0.018, bevelThickness: 0.018, curveSegments: 12
    });
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.name = 'KhopeshCurvedBlade';
    blade.position.z = -0.0275;
    blade.castShadow = true;
    group.add(blade);
    const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.78, 0.018), brass);
    ridge.position.set(0.14, 0.58, 0.035);
    group.add(ridge);
    group.traverse(obj => { if (obj.isMesh) { obj.castShadow = true; obj.receiveShadow = true; } });
    return registerItem('khopesh', group, 'weapon', 'Khopesh egípcio');
  }

  function addRod(parent, start, end, radius, material, name) {
    const direction = new THREE.Vector3().subVectors(end, start);
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.82, radius, direction.length(), 10, 1),
      material
    );
    mesh.name = name;
    mesh.position.copy(start).add(end).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function buildWaxShabti() {
    const group = new THREE.Group();
    group.name = 'WaxShabtiMiniature';
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.082, 0.29, 18, 3), wax);
    body.position.y = 0.16;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    const lowerBody = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.085, 0.105, 18, 1), waxShade);
    lowerBody.position.y = 0.055;
    lowerBody.castShadow = true;
    group.add(lowerBody);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.063, 20, 16), wax);
    head.position.set(0, 0.36, 0.005);
    head.castShadow = true;
    group.add(head);

    const nemes = new THREE.Mesh(new THREE.SphereGeometry(0.071, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.58), linen);
    nemes.position.set(0, 0.372, -0.006);
    nemes.castShadow = true;
    group.add(nemes);

    const backCloth = new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.145, 0.035), linen);
    backCloth.position.set(0, 0.295, -0.045);
    backCloth.rotation.x = -0.12;
    group.add(backCloth);

    const face = new THREE.Mesh(new THREE.SphereGeometry(0.043, 16, 12), waxShade);
    face.scale.set(0.78, 0.88, 0.42);
    face.position.set(0, 0.35, 0.052);
    group.add(face);

    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x3a3027, roughness: 0.6 });
    for (const x of [-0.018, 0.018]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.0055, 8, 6), eyeMat);
      eye.position.set(x, 0.36, 0.071);
      group.add(eye);
    }

    // Braços cruzados sobre o peito, como uma pequena figura mumiforme.
    addRod(group, new THREE.Vector3(-0.082, 0.235, 0.055), new THREE.Vector3(0.06, 0.17, 0.07), 0.018, waxShade, 'ShabtiCrossedArmLeft');
    addRod(group, new THREE.Vector3(0.082, 0.235, 0.055), new THREE.Vector3(-0.06, 0.17, 0.07), 0.018, wax, 'ShabtiCrossedArmRight');

    for (const y of [0.075, 0.115, 0.155, 0.195, 0.235]) {
      const wrap = new THREE.Mesh(new THREE.TorusGeometry(0.066 - Math.max(0, y - 0.15) * 0.055, 0.0048, 7, 24), linen);
      wrap.rotation.x = Math.PI / 2;
      wrap.position.y = y;
      group.add(wrap);
    }

    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.052, 0.007, 8, 24), gold);
    collar.position.set(0, 0.286, 0.01);
    collar.rotation.x = Math.PI / 2;
    group.add(collar);

    const scarab = new THREE.Mesh(new THREE.SphereGeometry(0.018, 12, 8), lapis);
    scarab.scale.set(0.8, 1.25, 0.55);
    scarab.position.set(0, 0.267, 0.073);
    group.add(scarab);

    const feet = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.032, 0.075), waxShade);
    feet.position.set(0, 0.012, 0.012);
    group.add(feet);

    group.position.set(0, -0.19, 0.055);
    group.scale.setScalar(0.92);
    group.traverse(obj => { if (obj.isMesh) { obj.castShadow = true; obj.receiveShadow = true; } });
    return registerItem('wax_shabti', group, 'artifact', 'Pequena estatueta mumiforme de cera');
  }


  function buildMagicBox() {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x493021, roughness: 0.82 });
    const lidMat = new THREE.MeshStandardMaterial({ color: 0x65422b, roughness: 0.76 });
    const inlayMat = new THREE.MeshStandardMaterial({ color: 0x99713e, metalness: 0.48, roughness: 0.46 });
    const boxBody = new THREE.Mesh(new THREE.BoxGeometry(0.235, 0.135, 0.17), bodyMat);
    boxBody.position.y = 0.07;
    group.add(boxBody);
    const lid = new THREE.Mesh(new THREE.BoxGeometry(0.245, 0.028, 0.18), lidMat);
    lid.position.set(0, 0.15, 0);
    group.add(lid);
    for (const x of [-0.09, 0.09]) {
      const band = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.16, 0.19), inlayMat);
      band.position.set(x, 0.078, 0);
      group.add(band);
    }
    const clasp = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.055, 0.012), gold);
    clasp.position.set(0, 0.12, 0.094);
    group.add(clasp);
    const eye = new THREE.Mesh(new THREE.TorusGeometry(0.025, 0.004, 7, 20), gold);
    eye.position.set(0, 0.154, 0.094);
    group.add(eye);
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.025, 0.004, 7, 18, Math.PI), inlayMat);
    handle.position.set(0, 0.19, -0.02);
    handle.rotation.x = Math.PI / 2;
    group.add(handle);
    group.traverse(obj => { if (obj.isMesh) { obj.castShadow = true; obj.receiveShadow = true; } });
    group.position.set(0, -0.075, 0.07);
    return registerItem('magic_box', group, 'container', 'Caixa portátil de instrumentos mágicos');
  }

  function buildPapyrus() {
    const group = new THREE.Group();
    const paperCanvas = document.createElement('canvas');
    paperCanvas.width = 256;
    paperCanvas.height = 160;
    const ctx = paperCanvas.getContext('2d');
    ctx.fillStyle = '#d9c18c';
    ctx.fillRect(0, 0, 256, 160);
    ctx.strokeStyle = '#9a7847';
    ctx.lineWidth = 3;
    for (let y = 12; y < 160; y += 11) {
      ctx.globalAlpha = 0.22;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(256, y + 2); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#49372a';
    for (let col = 0; col < 5; col++) {
      const x = 23 + col * 47;
      for (let row = 0; row < 4; row++) {
        const y = 28 + row * 31;
        ctx.strokeRect(x, y, 9, 8);
        ctx.beginPath(); ctx.moveTo(x + 14, y + 3); ctx.lineTo(x + 25, y + 3); ctx.stroke();
      }
    }
    const paperTexture = new THREE.CanvasTexture(paperCanvas);
    paperTexture.colorSpace = THREE.SRGBColorSpace;
    const sheet = new THREE.Mesh(
      new THREE.BoxGeometry(0.205, 0.125, 0.004),
      new THREE.MeshStandardMaterial({ map: paperTexture, roughness: 0.96, side: THREE.DoubleSide })
    );
    sheet.position.z = 0.004;
    group.add(sheet);
    const rollMaterial = new THREE.MeshStandardMaterial({ color: 0xc7a66c, roughness: 0.9 });
    for (const x of [-0.105, 0.105]) {
      const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.145, 14), rollMaterial);
      roll.rotation.z = Math.PI / 2;
      roll.position.set(x, 0, 0);
      group.add(roll);
      const end = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.008, 12), gold);
      end.rotation.z = Math.PI / 2;
      end.position.set(x + (x > 0 ? 0.076 : -0.076), 0, 0);
      group.add(end);
    }
    group.position.set(0, 0, 0.08);
    group.traverse(obj => { if (obj.isMesh) obj.castShadow = true; });
    return registerItem('papyrus', group, 'tool', 'Folha de papiro preparada para inscrições');
  }

  function buildReedPen() {
    const group = new THREE.Group();
    const reed = new THREE.MeshStandardMaterial({ color: 0x9a794a, roughness: 0.84 });
    const darkReed = new THREE.MeshStandardMaterial({ color: 0x44352a, roughness: 0.74 });
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.009, 0.22, 10), reed);
    shaft.position.y = 0.11;
    group.add(shaft);
    const nib = new THREE.Mesh(new THREE.ConeGeometry(0.009, 0.035, 8), darkReed);
    nib.position.y = -0.012;
    nib.rotation.x = Math.PI;
    group.add(nib);
    const grip = new THREE.Mesh(new THREE.TorusGeometry(0.009, 0.0025, 6, 12), gold);
    grip.position.y = 0.045;
    grip.rotation.x = Math.PI / 2;
    group.add(grip);
    group.position.set(0, -0.105, 0.08);
    return registerItem('reed_pen', group, 'tool', 'Cálamo de cana para desenhar hieróglifos');
  }

  function buildInk() {
    const group = new THREE.Group();
    const ceramic = new THREE.MeshStandardMaterial({ color: 0x625044, roughness: 0.48 });
    const darkInk = new THREE.MeshStandardMaterial({ color: 0x171b1d, roughness: 0.22, metalness: 0.08 });
    const vessel = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.045, 0.078, 18, 1), ceramic);
    vessel.position.y = 0.039;
    group.add(vessel);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.026, 0.027, 16), ceramic);
    neck.position.y = 0.09;
    group.add(neck);
    const lip = new THREE.Mesh(new THREE.TorusGeometry(0.024, 0.004, 7, 18), gold);
    lip.position.y = 0.105;
    lip.rotation.x = Math.PI / 2;
    group.add(lip);
    const inkSurface = new THREE.Mesh(new THREE.CircleGeometry(0.019, 20), darkInk);
    inkSurface.position.y = 0.105;
    inkSurface.rotation.x = -Math.PI / 2;
    group.add(inkSurface);
    group.position.set(0, -0.05, 0.08);
    group.traverse(obj => { if (obj.isMesh) obj.castShadow = true; });
    return registerItem('ink', group, 'tool', 'Pequeno recipiente de tinta para inscrições');
  }

  function buildProtectiveAmulet() {
    const group = new THREE.Group();
    const faience = new THREE.MeshStandardMaterial({ color: 0x287f8e, roughness: 0.34, metalness: 0.2 });
    const eyeShape = new THREE.Shape();
    eyeShape.moveTo(-0.058, 0.008);
    eyeShape.quadraticCurveTo(-0.01, 0.065, 0.058, 0.008);
    eyeShape.quadraticCurveTo(0.015, -0.045, -0.058, 0.008);
    const eyeGeo = new THREE.ExtrudeGeometry(eyeShape, {
      depth: 0.018, bevelEnabled: true, bevelSegments: 2,
      bevelSize: 0.004, bevelThickness: 0.003, curveSegments: 16
    });
    const eye = new THREE.Mesh(eyeGeo, gold);
    group.add(eye);
    const inset = new THREE.Mesh(new THREE.ShapeGeometry(eyeShape), faience);
    inset.position.z = 0.021;
    group.add(inset);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.012, 12, 8), gold);
    pupil.scale.set(0.7, 1.25, 0.45);
    pupil.position.set(0, 0.008, 0.028);
    group.add(pupil);
    const loop = new THREE.Mesh(new THREE.TorusGeometry(0.018, 0.004, 8, 20), gold);
    loop.position.set(0, 0.071, 0.004);
    group.add(loop);
    group.position.set(0, -0.045, 0.08);
    group.traverse(obj => { if (obj.isMesh) obj.castShadow = true; });
    return registerItem('protective_amulet', group, 'artifact', 'Amuleto de faiança azul inspirado no olho wedjat');
  }


  function buildWaxLump() {
    const group = new THREE.Group();
    const waxLumpMaterial = new THREE.MeshStandardMaterial({
      color: 0xe9dfc5, roughness: 0.93, metalness: 0.0
    });
    const geometry = new THREE.IcosahedronGeometry(0.075, 2);
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i);
      const ripple = 1 + 0.075 * Math.sin(x * 34 + z * 17) * Math.cos(y * 27 - x * 11);
      positions.setXYZ(i, x * ripple * 1.15, y * ripple * 0.82, z * ripple);
    }
    geometry.computeVertexNormals();
    const lump = new THREE.Mesh(geometry, waxLumpMaterial);
    lump.name = 'WhiteWaxLump';
    lump.position.y = 0.075;
    lump.rotation.set(0.18, 0.4, -0.12);
    lump.castShadow = true;
    lump.receiveShadow = true;
    group.add(lump);

    const thumbMark = new THREE.Mesh(
      new THREE.SphereGeometry(0.018, 12, 8),
      new THREE.MeshStandardMaterial({ color: 0xd9cba9, roughness: 0.98 })
    );
    thumbMark.scale.set(1.25, 0.28, 0.82);
    thumbMark.position.set(-0.018, 0.115, 0.045);
    group.add(thumbMark);
    group.position.set(0, -0.055, 0.08);
    return registerItem('wax_lump', group, 'material', 'Pequeno pedaço irregular de cera branca para modelar shabtis');
  }

  function buildScribePalette() {
    const group = new THREE.Group();
    const ebony = new THREE.MeshStandardMaterial({ color: 0x30251d, roughness: 0.78 });
    const edge = new THREE.MeshStandardMaterial({ color: 0x59412c, roughness: 0.88 });
    const pigmentBlack = new THREE.MeshStandardMaterial({ color: 0x161a1a, roughness: 0.38 });
    const pigmentRed = new THREE.MeshStandardMaterial({ color: 0x7c3025, roughness: 0.72 });

    const shape = new THREE.Shape();
    shape.moveTo(-0.092, -0.118);
    shape.lineTo(0.092, -0.118);
    shape.lineTo(0.075, 0.068);
    shape.quadraticCurveTo(0.07, 0.12, 0.028, 0.128);
    shape.lineTo(-0.028, 0.128);
    shape.quadraticCurveTo(-0.07, 0.12, -0.075, 0.068);
    shape.closePath();
    const plateGeo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.014, bevelEnabled: true, bevelSegments: 3,
      bevelSize: 0.004, bevelThickness: 0.003, curveSegments: 12
    });
    const plate = new THREE.Mesh(plateGeo, ebony);
    plate.name = 'ScribePaletteWood';
    plate.castShadow = true;
    group.add(plate);

    for (const [x, material] of [[-0.043, pigmentBlack], [0.043, pigmentRed]]) {
      const well = new THREE.Mesh(new THREE.CylinderGeometry(0.027, 0.027, 0.006, 24), material);
      well.rotation.x = Math.PI / 2;
      well.position.set(x, 0.065, 0.018);
      group.add(well);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.029, 0.0035, 7, 28), edge);
      rim.position.set(x, 0.065, 0.02);
      group.add(rim);
    }
    for (const y of [-0.075, -0.045, -0.015]) {
      const groove = new THREE.Mesh(new THREE.BoxGeometry(0.105, 0.0022, 0.0018), edge);
      groove.position.set(0, y, 0.015);
      group.add(groove);
    }
    const handleHole = new THREE.Mesh(new THREE.TorusGeometry(0.014, 0.003, 7, 20), edge);
    handleHole.position.set(0, 0.108, 0.021);
    group.add(handleHole);
    group.position.set(0, -0.085, 0.075);
    return registerItem('scribe_palette', group, 'tool', 'Paleta de escriba com dois poços de pigmento');
  }

  function buildBrownTwine() {
    const group = new THREE.Group();
    const fiber = new THREE.MeshStandardMaterial({ color: 0x987247, roughness: 0.98 });
    const cordPoints = [];
    for (let i = 0; i <= 120; i++) {
      const angle = (i / 120) * Math.PI * 6;
      const radius = 0.052 + 0.003 * Math.sin(angle * 2);
      const y = 0.05 + 0.0035 * Math.sin(angle * 1.4);
      cordPoints.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius));
    }
    const coil = new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cordPoints), 120, 0.006, 7, false),
      fiber
    );
    coil.name = 'BrownTwineCoil';
    group.add(coil);

    const looseEnd = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.048, 0.05, -0.01),
      new THREE.Vector3(0.078, 0.043, -0.02),
      new THREE.Vector3(0.092, 0.023, -0.045),
      new THREE.Vector3(0.12, 0.015, -0.055)
    ]);
    group.add(new THREE.Mesh(new THREE.TubeGeometry(looseEnd, 24, 0.0055, 7, false), fiber));
    group.position.set(0, -0.035, 0.085);
    return registerItem('brown_twine', group, 'tool', 'Pequeno rolo de cordão marrom');
  }

  function buildEbonyCat() {
    const group = new THREE.Group();
    const ebony = new THREE.MeshStandardMaterial({ color: 0x171719, roughness: 0.38, metalness: 0.12 });
    const ebonySoft = new THREE.MeshStandardMaterial({ color: 0x242326, roughness: 0.52, metalness: 0.08 });
    const bronze = new THREE.MeshStandardMaterial({ color: 0xb28b4e, roughness: 0.42, metalness: 0.7 });

    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.095, 0.024, 28), ebonySoft);
    base.position.y = 0.012;
    group.add(base);

    const haunch = new THREE.Mesh(new THREE.SphereGeometry(0.073, 20, 16), ebony);
    haunch.scale.set(0.9, 1.14, 0.88);
    haunch.position.set(0, 0.105, -0.018);
    group.add(haunch);

    const chest = new THREE.Mesh(new THREE.SphereGeometry(0.057, 18, 14), ebony);
    chest.scale.set(0.82, 1.52, 0.82);
    chest.position.set(0, 0.17, 0.035);
    group.add(chest);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.052, 20, 16), ebonySoft);
    head.scale.set(1.02, 0.96, 0.92);
    head.position.set(0, 0.285, 0.048);
    group.add(head);

    for (const x of [-0.032, 0.032]) {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.06, 4), ebony);
      ear.position.set(x, 0.33, 0.045);
      ear.rotation.z = x < 0 ? -0.12 : 0.12;
      group.add(ear);
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.006, 10, 8), bronze);
      eye.position.set(x * 0.62, 0.29, 0.094);
      group.add(eye);
    }

    for (const x of [-0.041, 0.041]) {
      const foreleg = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.017, 0.11, 12), ebony);
      foreleg.position.set(x, 0.075, 0.072);
      group.add(foreleg);
      const paw = new THREE.Mesh(new THREE.SphereGeometry(0.021, 12, 10), ebonySoft);
      paw.scale.set(1.3, 0.72, 1.5);
      paw.position.set(x, 0.028, 0.08);
      group.add(paw);
    }

    const tailCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.05, 0.09, -0.07),
      new THREE.Vector3(0.095, 0.045, -0.11),
      new THREE.Vector3(0.12, 0.09, -0.135),
      new THREE.Vector3(0.115, 0.15, -0.12),
      new THREE.Vector3(0.08, 0.16, -0.105)
    ]);
    group.add(new THREE.Mesh(new THREE.TubeGeometry(tailCurve, 36, 0.011, 9, false), ebony));
    group.scale.setScalar(0.92);
    group.position.set(0, -0.02, 0.08);
    group.traverse(obj => { if (obj.isMesh) { obj.castShadow = true; obj.receiveShadow = true; } });
    return registerItem('ebony_cat', group, 'artifact', 'Pequena estátua sentada de gato em ébano');
  }

  buildStaff();
  buildKhopesh();
  buildWaxShabti();
  buildMagicBox();
  buildPapyrus();
  buildReedPen();
  buildInk();
  buildProtectiveAmulet();
  buildWaxLump();
  buildScribePalette();
  buildBrownTwine();
  buildEbonyCat();

  // The portal stays in chest space while the right hand reaches through it.
  // Ara's use_press clip places the right-hand contact at (-0.20, -0.16, 0.46)
  // in chest-space coordinates for a 1.8 m reference character.
  const chestBoneCandidates = ['spine2', 'mixamorigspine2', 'spine1', 'mixamorigspine1', 'chest', 'spine'];
  const chestBones = new Map();
  const chestBoneNames = new Set(chestBoneCandidates);
  character.model.traverse((node) => {
    if (!node.isBone) return;
    const name = String(node.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (chestBoneNames.has(name) && !chestBones.has(name)) chestBones.set(name, node);
  });
  const chestBone = chestBoneCandidates.map(name => chestBones.get(name)).find(Boolean) || null;
  const duatUnit = (character.height || character.ara?.height || 1.75) / 1.8;
  const portalAnchor = new THREE.Group();
  portalAnchor.name = 'DuatChestSpaceAnchor';
  if (chestBone) {
    chestBone.add(portalAnchor);
    portalAnchor.position.set(-0.20 * duatUnit, -0.16 * duatUnit, 0.46 * duatUnit);
  } else {
    const characterVisualRoot = character.ara?.scene || character.model;
    characterVisualRoot.add(portalAnchor);
    portalAnchor.position.set(-0.20 * duatUnit, 0.78 * (character.height || 1.75), 0.46 * duatUnit);
  }

  const portal = new THREE.Group();
  portal.name = 'DuatHandPortal';
  portal.position.set(0, 0, 0);
  const portalGold = new THREE.MeshStandardMaterial({
    color: 0xd5ad62, emissive: 0x8b5a1d, emissiveIntensity: 1.15,
    metalness: 0.48, roughness: 0.38, transparent: true, opacity: 0
  });
  const portalBlue = new THREE.MeshStandardMaterial({
    color: 0x5ac6d1, emissive: 0x1b7e9a, emissiveIntensity: 1.5,
    metalness: 0.12, roughness: 0.3, transparent: true, opacity: 0
  });
  const portalCoreMaterial = new THREE.MeshBasicMaterial({
    color: 0x287c8b, transparent: true, opacity: 0,
    side: THREE.DoubleSide, depthWrite: false
  });
  const portalCore = new THREE.Mesh(new THREE.CircleGeometry(0.17, 48), portalCoreMaterial);
  portalCore.scale.set(0.72, 1.18, 1);
  portalCore.position.z = -0.012;
  portal.add(portalCore);

  const outerRing = new THREE.Mesh(new THREE.TorusGeometry(0.205, 0.013, 10, 48), portalGold);
  outerRing.scale.set(0.76, 1.2, 1);
  portal.add(outerRing);
  const innerRing = new THREE.Mesh(new THREE.TorusGeometry(0.156, 0.006, 8, 40), portalBlue);
  innerRing.scale.set(0.74, 1.16, 1);
  innerRing.position.z = 0.009;
  portal.add(innerRing);

  const portalArc = new THREE.Mesh(new THREE.TorusGeometry(0.235, 0.003, 6, 42, Math.PI * 1.12), portalGold);
  portalArc.scale.set(0.7, 1.16, 1);
  portalArc.position.z = 0.014;
  portal.add(portalArc);
  portal.visible = false;
  portalAnchor.add(portal);

  let activeItem = null;
  let transition = null;
  let queuedItem = null;
  let attackRemaining = 0;
  let attackDuration = 0.44;
  const restRotation = socket.rotation.clone();
  const panel = document.getElementById('inventoryPanel');
  const status = document.getElementById('inventoryStatus');

  const itemNames = {
    staff: 'CAJADO MÁGICO',
    khopesh: 'KHOPESH',
    wax_shabti: 'SHABTI DE CERA',
    magic_box: 'CAIXA DE MAGIA',
    papyrus: 'PAPIRO',
    reed_pen: 'CÁLAMO',
    ink: 'TINTA',
    protective_amulet: 'AMULETO DE PROTEÇÃO',
    wax_lump: 'CERA BRANCA',
    scribe_palette: 'PALETA DE ESCRIBA',
    brown_twine: 'CORDÃO MARROM',
    ebony_cat: 'ESTÁTUA DE GATO EM ÉBANO'
  };

  const toggle = (force) => {
    const open = typeof force === 'boolean' ? force : Boolean(panel?.hidden);
    if (panel) panel.hidden = !open;
  };

  const refresh = () => {
    document.querySelectorAll('[data-equip]').forEach((button) => {
      const id = button.dataset.equip;
      const selected = id === activeItem || (transition && transition.name === id);
      button.classList.toggle('selected', Boolean(selected));
      const state = button.querySelector('em');
      if (!state) return;
      if (transition?.name === id) {
        state.textContent = transition.mode === 'retrieve' ? 'RETIRANDO' : 'GUARDANDO';
      } else {
        state.textContent = activeItem === id ? 'EM MÃOS' : 'NO DUAT';
      }
    });

    if (status) {
      if (transition?.mode === 'retrieve') status.textContent = 'ABRINDO O DUAT · ' + itemNames[transition.name];
      else if (transition?.mode === 'store') status.textContent = 'RECOLHENDO AO DUAT · ' + itemNames[transition.name];
      else if (activeItem) status.textContent = 'EM MÃOS · ' + itemNames[activeItem];
      else status.textContent = 'MÃOS LIVRES · OBJETOS NO DUAT';
    }

    const usable = activeItem === 'staff' || activeItem === 'khopesh';
    [document.getElementById('inventoryUse'), document.getElementById('inventoryMobileUse')]
      .forEach((button) => { if (button) button.disabled = !usable || Boolean(transition); });
  };

  function beginDuatReach() {
    attackRemaining = 0;
    socket.rotation.copy(restRotation);
    // The interaction is locked for the full body clip on desktop and mobile.
    setControlsLocked(true);
    character.playAction?.('use_press', { fade: 0.18 });
    portal.visible = true;
    portal.scale.setScalar(0.2);
    portalGold.opacity = 0;
    portalBlue.opacity = 0;
    portalCoreMaterial.opacity = 0;
  }

  function beginRetrieve(name) {
    const group = items.get(name);
    if (!group || transition) return;
    beginDuatReach();
    group.visible = true;
    group.scale.setScalar(0.025);
    group.position.copy(group.userData.restPosition).add(new THREE.Vector3(0, 0, 0.19));
    transition = { name, mode: 'retrieve', elapsed: 0, duration: 1.65 };
    refresh();
  }

  function beginStore() {
    if (!activeItem || transition) return;
    beginDuatReach();
    transition = { name: activeItem, mode: 'store', elapsed: 0, duration: 1.65 };
    refresh();
  }

  const equip = (name) => {
    if (!items.has(name)) return;
    if (transition) {
      queuedItem = name;
      return;
    }
    if (activeItem === name) {
      beginStore();
      return;
    }
    if (activeItem) {
      queuedItem = name;
      beginStore();
      return;
    }
    beginRetrieve(name);
  };

  const unequip = () => {
    queuedItem = null;
    beginStore();
  };

  const use = () => {
    if (transition) return;
    if (activeItem !== 'staff' && activeItem !== 'khopesh') {
      if (status) status.textContent = 'RETIRE UM CAJADO OU KHOPESH PARA USAR';
      return;
    }
    attackDuration = activeItem === 'khopesh' ? 0.4 : 0.52;
    attackRemaining = attackDuration;
    onUse(activeItem);
  };

  document.getElementById('inventoryToggle')?.addEventListener('click', () => toggle());
  document.getElementById('inventoryMobileToggle')?.addEventListener('click', () => toggle());
  document.getElementById('inventoryClose')?.addEventListener('click', () => toggle(false));
  document.getElementById('inventoryUse')?.addEventListener('click', use);
  document.getElementById('inventoryMobileUse')?.addEventListener('click', use);
  document.querySelectorAll('[data-equip]').forEach(button => {
    button.addEventListener('click', () => equip(button.dataset.equip));
  });
  document.getElementById('inventoryUnequip')?.addEventListener('click', unequip);
  window.addEventListener('keydown', (event) => {
    if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.code === 'KeyI') { event.preventDefault(); toggle(); }
    if (event.code === 'KeyF') { event.preventDefault(); use(); }
  });

  refresh();

  return {
    toggle, equip, unequip, use,
    update(dt) {
      if (transition) {
        transition.elapsed = Math.min(transition.duration, transition.elapsed + dt);
        const progress = transition.elapsed / transition.duration;
        const smoothstep = (edge0, edge1, value) => {
          const t = THREE.MathUtils.clamp((value - edge0) / (edge1 - edge0), 0, 1);
          return t * t * (3 - 2 * t);
        };
        const opening = smoothstep(0.12, 0.42, progress);
        const closing = 1 - smoothstep(0.78, 1.0, progress);
        const portalStrength = opening * closing;
        const item = items.get(transition.name);

        portal.scale.set(0.62 + opening * 0.38, 0.76 + opening * 0.24, 1);
        portal.rotation.z += dt * (transition.mode === 'retrieve' ? 0.72 : -0.62);
        portalGold.opacity = portalStrength * 0.92;
        portalBlue.opacity = portalStrength * 0.78;
        portalCoreMaterial.opacity = portalStrength * 0.3;

        if (item) {
          const itemProgress = smoothstep(0.52, 0.94, progress);
          const from = transition.mode === 'retrieve' ? 0.025 : 1;
          const to = transition.mode === 'retrieve' ? 1 : 0.025;
          const itemEase = transition.mode === 'retrieve' ? itemProgress : itemProgress;
          item.scale.setScalar(THREE.MathUtils.lerp(from, to, itemEase));
          const rest = item.userData.restPosition;
          const offset = transition.mode === 'retrieve' ? (1 - itemProgress) * 0.19 : itemProgress * 0.19;
          item.position.copy(rest).add(new THREE.Vector3(0, 0, offset));
        }

        if (progress >= 1) {
          const finished = transition;
          const item = items.get(finished.name);
          if (finished.mode === 'store') {
            if (item) {
              item.visible = false;
              item.scale.copy(item.userData.baseScale);
              item.position.copy(item.userData.restPosition);
            }
            activeItem = null;
          } else {
            activeItem = finished.name;
            if (item) {
              item.scale.copy(item.userData.baseScale);
              item.position.copy(item.userData.restPosition);
            }
          }
          transition = null;
          portal.visible = false;
          portal.scale.setScalar(0);
          portalGold.opacity = 0;
          portalBlue.opacity = 0;
          portalCoreMaterial.opacity = 0;
          socket.rotation.copy(restRotation);
          if (finished.mode === 'retrieve' && queuedItem && queuedItem !== activeItem) {
            // Finish the current retrieval, then store that item before fetching the queued one.
            beginStore();
          } else if (finished.mode === 'store' && queuedItem) {
            const next = queuedItem;
            queuedItem = null;
            beginRetrieve(next);
          } else {
            queuedItem = null;
            setControlsLocked(false);
          }
          refresh();
        }
      }

      if (attackRemaining > 0 && !transition) {
        attackRemaining = Math.max(0, attackRemaining - dt);
        const progress = 1 - attackRemaining / attackDuration;
        const swing = Math.sin(progress * Math.PI);
        if (activeItem === 'khopesh') {
          socket.rotation.set(restRotation.x + 0.05 * swing, restRotation.y, restRotation.z + 1.08 * swing);
        } else if (activeItem === 'staff') {
          socket.rotation.set(restRotation.x + 0.48 * swing, restRotation.y, restRotation.z + 0.24 * swing);
        }
      } else if (socket.rotation.x !== restRotation.x || socket.rotation.y !== restRotation.y || socket.rotation.z !== restRotation.z) {
        socket.rotation.copy(restRotation);
      }
    },
    get equipped() {
      return activeItem === 'staff' || activeItem === 'khopesh' ? activeItem : null;
    },
    get activeItem() { return activeItem; },
    getItemInfo(id) {
      const group = items.get(id);
      if (!group) return null;
      return {
        id,
        kind: group.userData.kind,
        description: group.userData.description,
        capabilities: {
          actions: [...group.userData.capabilities.actions],
          reactions: [...group.userData.capabilities.reactions]
        }
      };
    },
    get activeItemInfo() {
      return activeItem ? this.getItemInfo(activeItem) : null;
    },
    get isTransitioning() { return Boolean(transition); },
    get transitionMode() { return transition?.mode || null; },
    get transitionItem() { return transition?.name || null; },
    get hasWeaponSocket() { return Boolean(weaponBone); },
    get itemIds() { return [...items.keys()]; }
  };
}

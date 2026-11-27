import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Inventário diegético do Carter: os objetos ficam no Duat até serem retirados.
// O fluxo de portal e os IDs dos itens são genéricos para reutilização por outros magos.
export function createInventory({
  THREE,
  character,
  onUse = () => {},
  setControlsLocked = () => {},
  canSpendEnergy = () => true,
  spendEnergy = () => true,
  onInsufficientEnergy = () => {},
  retrievalCost = 2,
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

    // Fallback: haste clara, reta e fina. A mão fica no centro do cajado de 2 m.
    const profile = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.0115, 0),
      new THREE.Vector2(0.012, 0.035),
      new THREE.Vector2(0.012, 1.965),
      new THREE.Vector2(0.0115, 2),
      new THREE.Vector2(0, 2)
    ];
    const geometry = new THREE.LatheGeometry(profile, 20);
    geometry.computeVertexNormals();
    const staffMaterial = new THREE.MeshStandardMaterial({
      color: 0xd8c49c, roughness: 0.88, metalness: 0.02
    });
    const staff = new THREE.Mesh(geometry, staffMaterial);
    staff.name = 'PaleBeigeStaffFallback';
    staff.castShadow = true;
    staff.receiveShadow = true;
    group.add(staff);

    return registerItem('staff', group, 'weapon', 'Cajado reto, fino e bege-claro, com empunhadura no meio; escala de arte de 2 m');
  }

  function buildKhopesh() {
    const group = new THREE.Group();
    // Fallback de 60 cm: lâmina estreita e perfil compacto. O GLB CC BY 4.0
    // é carregado logo depois e possui o pivô real no centro do punho.
    const grip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.011, 0.012, 0.112, 12),
      darkGrip
    );
    grip.position.y = -0.015;
    group.add(grip);

    const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.015, 12, 8), brass);
    pommel.position.y = -0.075;
    group.add(pommel);

    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.105, 0.012, 0.018), brass);
    guard.position.y = 0.045;
    group.add(guard);

    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(-0.012, 0.045);
    bladeShape.lineTo(0.012, 0.045);
    bladeShape.lineTo(0.025, 0.24);
    bladeShape.quadraticCurveTo(0.052, 0.39, 0.19, 0.49);
    bladeShape.quadraticCurveTo(0.29, 0.57, 0.32, 0.44);
    bladeShape.quadraticCurveTo(0.27, 0.34, 0.19, 0.35);
    bladeShape.quadraticCurveTo(0.10, 0.35, 0.085, 0.22);
    bladeShape.lineTo(0.04, 0.045);
    bladeShape.closePath();
    const blade = new THREE.Mesh(
      new THREE.ExtrudeGeometry(bladeShape, {
        depth: 0.012, bevelEnabled: true, bevelSegments: 2,
        steps: 1, bevelSize: 0.003, bevelThickness: 0.002, curveSegments: 14
      }),
      bladeMat
    );
    blade.position.z = -0.006;
    blade.name = 'KhopeshFallbackBlade';
    group.add(blade);

    group.traverse(node => {
      if (!node.isMesh) return;
      node.castShadow = true;
      node.receiveShadow = true;
    });
    return registerItem('khopesh', group, 'weapon', 'Khopesh curvo compacto, lâmina fina de aproximadamente 60 cm');
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

  // Assets 3D reais, carregados com GLTFLoader. As geometrias locais acima
  // continuam como fallback se a CDN estiver indisponível ou sem CORS.
  const weaponLoader = new GLTFLoader();
  function applyWeaponShadows(root) {
    root.traverse(node => {
      if (!node.isMesh) return;
      node.castShadow = true;
      node.receiveShadow = true;
      if (Array.isArray(node.material)) {
        node.material = node.material.map(material => material.clone());
      } else if (node.material) {
        node.material = node.material.clone();
      }
    });
  }
  function replaceFallback(itemId, modelRoot) {
    const item = items.get(itemId);
    if (!item || !modelRoot) return;
    item.children.forEach(child => { child.visible = false; });
    item.add(modelRoot);
  }
  weaponLoader.load(
    'https://polyfork.dev/cdn/monk-s-quarterstaff-cbdadd.glb',
    (gltf) => {
      const model = gltf.scene;
      model.name = 'PolyforkMonkQuarterstaff';
      model.scale.set(0.30, 1.11, 0.30);
      model.position.set(0, -0.999, 0); // centro geométrico = centro da empunhadura
      model.traverse(node => {
        if (!node.isMesh) return;
        node.castShadow = true;
        node.receiveShadow = true;
        const materials = Array.isArray(node.material) ? node.material : [node.material];
        materials.forEach(material => {
          if (!material) return;
          material.color?.setHex(0xd8c49c);
          material.vertexColors = false;
          material.roughness = 0.88;
          material.metalness = 0.02;
          material.needsUpdate = true;
        });
      });
      replaceFallback('staff', model);
    },
    undefined,
    error => console.warn('CASABROOKLIN: cajado GLB indisponível; usando fallback claro.', error)
  );
  weaponLoader.load(
    'https://vinish-models.pages.dev/swords/khopesh.glb',
    (gltf) => {
      const modelRoot = gltf.scene;
      let sword = modelRoot.getObjectByName('Sword') || modelRoot;
      if (sword !== modelRoot) sword.parent?.remove(sword);
      modelRoot.traverse(node => {
        if (node !== sword && /scabbard|sheath/i.test(node.name || '')) node.visible = false;
      });
      const model = new THREE.Group();
      model.name = 'VinishKhopeshHandModel';
      sword.name = 'VinishKhopeshSword';
      sword.rotation.z = Math.PI / 2; // lâmina em pé, no plano frontal do personagem
      sword.scale.set(0.95, 0.95, 0.42); // preserva 60 cm e reduz a espessura aparente
      applyWeaponShadows(sword);
      model.add(sword);
      replaceFallback('khopesh', model);
    },
    undefined,
    error => console.warn('CASABROOKLIN: khopesh GLB indisponível; usando fallback compacto.', error)
  );


  // Retirada do Duat: uma esfera volumétrica envolve a mão inteira.
  // As partículas originais Kenney (CC0) dão textura ao volume; não usamos um disco plano.
  function fallbackEnergyTexture(kind) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 128;
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(64, 64, 2, 64, 64, 62);
    if (kind === 'smoke') {
      gradient.addColorStop(0, 'rgba(208,245,235,0.42)');
      gradient.addColorStop(0.45, 'rgba(76,190,188,0.20)');
      gradient.addColorStop(1, 'rgba(40,110,122,0)');
    } else {
      gradient.addColorStop(0, 'rgba(255,255,245,1)');
      gradient.addColorStop(0.2, 'rgba(167,248,237,0.95)');
      gradient.addColorStop(0.55, 'rgba(68,202,198,0.42)');
      gradient.addColorStop(1, 'rgba(255,190,92,0)');
    }
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }
  const energyTextures = {
    magic: fallbackEnergyTexture('magic'),
    smoke: fallbackEnergyTexture('smoke'),
    spark: fallbackEnergyTexture('magic')
  };
  const energySpriteConsumers = { magic: [], smoke: [], spark: [] };
  function loadEnergySprite(key, filename) {
    fetch(new URL('../assets/vfx/' + filename + '.b64', import.meta.url))
      .then(response => {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.text();
      })
      .then(encoded => new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = 'data:image/png;base64,' + encoded.replace(/\\s/g, '');
        if (image.decode) image.decode().then(() => resolve(image)).catch(() => {});
      }))
      .then(image => {
        const texture = new THREE.Texture(image);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 2;
        texture.needsUpdate = true;
        const previous = energyTextures[key];
        energyTextures[key] = texture;
        energySpriteConsumers[key].forEach(material => {
          material.map = texture;
          material.needsUpdate = true;
        });
        previous?.dispose?.();
      })
      .catch(error => console.warn('CASABROOKLIN: partícula Kenney indisponível; usando textura de reserva.', error));
  }
  loadEnergySprite('magic', 'kenney-magic-01.png');
  loadEnergySprite('smoke', 'kenney-smoke-03.png');
  loadEnergySprite('spark', 'kenney-spark-07.png');

  function makeEnergySprite(key, color, size) {
    const material = new THREE.SpriteMaterial({
      map: energyTextures[key], color, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
    });
    energySpriteConsumers[key].push(material);
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(size, size, 1);
    return sprite;
  }

  const portal = new THREE.Group();
  portal.name = 'DuatHandEnergySphere';
  portal.position.set(0, 0.015, 0.025);
  portal.visible = false;
  socket.add(portal);

  const shellMaterial = new THREE.ShaderMaterial({
    uniforms: { uOpacity: { value: 0 } },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    vertexShader: `
      varying vec3 vNormalView;
      varying vec3 vViewDirection;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vNormalView = normalize(normalMatrix * normal);
        vViewDirection = normalize(-mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform float uOpacity;
      varying vec3 vNormalView;
      varying vec3 vViewDirection;
      void main() {
        float fresnel = pow(1.0 - max(dot(normalize(vNormalView), normalize(vViewDirection)), 0.0), 2.15);
        float latitude = 0.5 + 0.5 * sin(vNormalView.y * 12.0);
        vec3 teal = vec3(0.12, 0.82, 0.84);
        vec3 warm = vec3(1.0, 0.69, 0.28);
        vec3 energy = mix(teal, warm, smoothstep(0.58, 0.98, latitude));
        float alpha = (0.10 + fresnel * 0.72) * uOpacity;
        gl_FragColor = vec4(energy, alpha);
      }
    `
  });
  const energyShell = new THREE.Mesh(new THREE.SphereGeometry(0.285, 36, 28), shellMaterial);
  energyShell.scale.set(1, 1.12, 0.98);
  portal.add(energyShell);

  const innerGlowMaterial = new THREE.MeshBasicMaterial({
    color: 0x9eece5, transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
  });
  const innerGlow = new THREE.Mesh(
    new THREE.SphereGeometry(0.17, 24, 18),
    innerGlowMaterial
  );
  innerGlow.scale.set(1.0, 1.12, 0.86);
  portal.add(innerGlow);

  const arcMaterials = [
    new THREE.MeshBasicMaterial({ color: 0x7de7de, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
    new THREE.MeshBasicMaterial({ color: 0xf5c16d, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })
  ];
  function makeHelix(phase) {
    const points = [];
    for (let i = 0; i <= 96; i++) {
      const t = i / 96;
      const y = (t * 2 - 1) * 0.235;
      const ring = Math.sqrt(Math.max(0, 1 - (y / 0.25) ** 2));
      const angle = t * Math.PI * 3.5 + phase;
      points.push(new THREE.Vector3(
        Math.cos(angle) * ring * 0.235,
        y,
        Math.sin(angle) * ring * 0.235
      ));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.Mesh(new THREE.TubeGeometry(curve, 112, 0.0055, 7, false), arcMaterials[phase > 0 ? 1 : 0]);
  }
  portal.add(makeHelix(0));
  portal.add(makeHelix(Math.PI));

  const energyParticles = [];
  for (let i = 0; i < 22; i++) {
    const key = i % 5 === 0 ? 'smoke' : (i % 3 === 0 ? 'spark' : 'magic');
    const color = i % 4 === 0 ? 0xffd58a : 0x9df5e9;
    const sprite = makeEnergySprite(key, color, i % 4 === 0 ? 0.075 : 0.048);
    const y = 0.24 * (1 - 2 * ((i + 0.5) / 22));
    const radial = Math.sqrt(Math.max(0, 1 - (y / 0.25) ** 2));
    const angle = i * 2.399963229728653;
    sprite.position.set(
      Math.cos(angle) * radial * 0.245,
      y,
      Math.sin(angle) * radial * 0.245
    );
    sprite.userData.seed = i * 1.731;
    sprite.userData.basePosition = sprite.position.clone();
    portal.add(sprite);
    energyParticles.push(sprite);
  }
  const portalLight = new THREE.PointLight(0x85e9df, 0, 1.8, 2);
  portal.add(portalLight);

  let activeItem = null;
  let transition = null;
  let queuedItem = null;
  let attackRemaining = 0;
  let attackDuration = 0.44;
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
    // A action use_press desloca o braço; como a esfera está presa à mão,
    // o volume acompanha o gesto e envolve a palma durante a retirada.
    setControlsLocked(true);
    character.playAction?.('use_press', { fade: 0.18, interruptOnMovement: false });
    portal.visible = true;
    portal.scale.setScalar(0.72);
    shellMaterial.uniforms.uOpacity.value = 0;
    innerGlowMaterial.opacity = 0;
    arcMaterials.forEach(material => { material.opacity = 0; });
    energyParticles.forEach(sprite => { sprite.material.opacity = 0; });
    portalLight.intensity = 0;
  }

  function beginRetrieve(name) {
    const group = items.get(name);
    if (!group || transition) return false;
    if (!canSpendEnergy(retrievalCost) || !spendEnergy(retrievalCost)) {
      queuedItem = null;
      setControlsLocked(false);
      if (status) status.textContent = 'ENERGIA INSUFICIENTE PARA RETIRAR DO DUAT';
      onInsufficientEnergy(retrievalCost);
      refresh();
      return false;
    }
    beginDuatReach();
    group.visible = true;
    group.scale.setScalar(0.025);
    group.position.copy(group.userData.restPosition).add(new THREE.Vector3(0, 0, 0.19));
    transition = { name, mode: 'retrieve', elapsed: 0, duration: 1.65 };
    refresh();
    return true;
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
    if (transition || attackRemaining > 0) return;
    if (activeItem !== 'staff' && activeItem !== 'khopesh') {
      if (status) status.textContent = 'RETIRE UM CAJADO OU KHOPESH PARA USAR';
      return;
    }
    const accepted = onUse(activeItem);
    if (accepted === false) return;

    const action = activeItem === 'khopesh' ? 'sword_combo' : 'sword_thrust';
    const started = character.playAction?.(action, {
      fade: 0.14,
      interruptOnMovement: false
    });
    if (started === false) {
      if (status) status.textContent = 'ANIMAÇÃO DE COMBATE INDISPONÍVEL';
      return;
    }
    attackDuration = activeItem === 'khopesh' ? 2.1 : 1.1;
    attackRemaining = attackDuration;
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

        portal.scale.setScalar(0.72 + opening * 0.28);
        portal.rotation.y += dt * 0.42;
        portal.rotation.z += dt * 0.19;
        shellMaterial.uniforms.uOpacity.value = portalStrength * 0.96;
        innerGlowMaterial.opacity = portalStrength * 0.25;
        arcMaterials[0].opacity = portalStrength * 0.9;
        arcMaterials[1].opacity = portalStrength * 0.78;
        portalLight.intensity = portalStrength * 1.45;

        energyParticles.forEach(sprite => {
          const seed = sprite.userData.seed;
          const base = sprite.userData.basePosition;
          const drift = Math.sin(transition.elapsed * 4.2 + seed) * 0.014;
          sprite.position.set(
            base.x + Math.cos(transition.elapsed * 1.2 + seed) * drift,
            base.y + Math.sin(transition.elapsed * 2.1 + seed) * 0.018,
            base.z + Math.sin(transition.elapsed * 1.2 + seed) * drift
          );
          sprite.material.opacity = portalStrength * (0.48 + 0.34 * (0.5 + 0.5 * Math.sin(transition.elapsed * 7 + seed)));
          sprite.material.rotation += dt * (seed % 2 === 0 ? 1.2 : -1.4);
        });

        if (item) {
          const itemProgress = smoothstep(0.52, 0.94, progress);
          const from = transition.mode === 'retrieve' ? 0.025 : 1;
          const to = transition.mode === 'retrieve' ? 1 : 0.025;
          item.scale.setScalar(THREE.MathUtils.lerp(from, to, itemProgress));
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
          portal.scale.setScalar(1);
          portal.rotation.set(0, 0, 0);
          shellMaterial.uniforms.uOpacity.value = 0;
          innerGlowMaterial.opacity = 0;
          arcMaterials.forEach(material => { material.opacity = 0; });
          energyParticles.forEach(sprite => { sprite.material.opacity = 0; });
          portalLight.intensity = 0;

          if (finished.mode === 'retrieve' && queuedItem && queuedItem !== activeItem) {
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

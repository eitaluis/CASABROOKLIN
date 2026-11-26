// Inventário diegético do Carter: os objetos ficam no Duat até serem retirados.
// O fluxo de portal e os IDs dos itens são genéricos para reutilização por outros magos.
export function createInventory({
  THREE,
  character,
  onUse = () => {},
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

  function registerItem(id, group, kind, description) {
    group.name = 'DuatItem_' + id;
    group.visible = false;
    group.userData.itemId = id;
    group.userData.kind = kind;
    group.userData.description = description;
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

  buildStaff();
  buildKhopesh();
  buildWaxShabti();

  // Portal procedural do Duat, preso ao mesmo socket da mão que recebe os objetos.
  const portal = new THREE.Group();
  portal.name = 'DuatHandPortal';
  portal.position.set(0, 0.17, 0.19);
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
  socket.add(portal);

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
    wax_shabti: 'SHABTI DE CERA'
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

  function beginRetrieve(name) {
    attackRemaining = 0;
    socket.rotation.copy(restRotation);
    const group = items.get(name);
    if (!group) return;
    group.visible = true;
    group.scale.setScalar(0.025);
    group.position.copy(group.userData.restPosition).add(new THREE.Vector3(0, 0, 0.19));
    transition = { name, mode: 'retrieve', elapsed: 0, duration: 0.72 };
    portal.visible = true;
    portal.scale.setScalar(0.15);
    portalGold.opacity = 0;
    portalBlue.opacity = 0;
    portalCoreMaterial.opacity = 0;
    refresh();
  }

  function beginStore() {
    if (!activeItem || transition) return;
    attackRemaining = 0;
    socket.rotation.copy(restRotation);
    transition = { name: activeItem, mode: 'store', elapsed: 0, duration: 0.62 };
    portal.visible = true;
    portal.scale.setScalar(0.92);
    portalGold.opacity = 0.85;
    portalBlue.opacity = 0.72;
    portalCoreMaterial.opacity = 0.24;
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
        const eased = progress * progress * (3 - 2 * progress);
        const item = items.get(transition.name);

        portal.scale.set(0.58 + eased * 0.42, 0.72 + eased * 0.28, 1);
        portal.rotation.z += dt * (transition.mode === 'retrieve' ? 1.3 : -1.1);
        portalGold.opacity = Math.sin(progress * Math.PI) * 0.92;
        portalBlue.opacity = Math.sin(progress * Math.PI) * 0.76;
        portalCoreMaterial.opacity = Math.sin(progress * Math.PI) * 0.28;

        if (item) {
          const from = transition.mode === 'retrieve' ? 0.025 : 1;
          const to = transition.mode === 'retrieve' ? 1 : 0.025;
          item.scale.setScalar(THREE.MathUtils.lerp(from, to, eased));
          const rest = item.userData.restPosition;
          const offset = transition.mode === 'retrieve' ? (1 - eased) * 0.19 : eased * 0.19;
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
          if (queuedItem && queuedItem !== activeItem) {
            const next = queuedItem;
            queuedItem = null;
            beginRetrieve(next);
          } else {
            queuedItem = null;
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
    get hasWeaponSocket() { return Boolean(weaponBone); },
    get itemIds() { return [...items.keys()]; }
  };
}

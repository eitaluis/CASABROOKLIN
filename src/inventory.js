// Inventário inicial do Carter: cajado mágico e khopesh egípcio.
// Props procedurais originais, encaixados no osso WeaponR quando o rig o oferece.
export function createInventory({ THREE, character, onUse = () => {} }) {
  const brass = new THREE.MeshStandardMaterial({ color: 0xb98b4d, metalness: 0.78, roughness: 0.28 });
  const darkBrass = new THREE.MeshStandardMaterial({ color: 0x654322, metalness: 0.68, roughness: 0.38 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x3a251c, roughness: 0.74 });
  const lapis = new THREE.MeshStandardMaterial({ color: 0x245a78, metalness: 0.46, roughness: 0.24 });
  const bladeMat = new THREE.MeshStandardMaterial({ color: 0xb2b9b2, metalness: 0.88, roughness: 0.24 });
  const darkGrip = new THREE.MeshStandardMaterial({ color: 0x241b18, roughness: 0.9 });

  let weaponBone = null;
  character.model.traverse((node) => {
    if (node.isBone && node.name.toLowerCase().replace(/[^a-z]/g, '') === 'weaponr') weaponBone = node;
  });

  const socket = new THREE.Group();
  socket.name = 'CarterWeaponSocket';
  if (weaponBone) {
    weaponBone.add(socket);
  } else {
    character.model.add(socket);
    socket.position.set(0.4, 0.94, 0.04);
  }

  function metalBand(parent, y, radius = 0.075) {
    const band = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.018, 7, 18), brass);
    band.rotation.x = Math.PI / 2;
    band.position.y = y;
    parent.add(band);
  }

  function buildStaff() {
    const group = new THREE.Group();
    group.name = 'cajado mágico egípcio';
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
    group.visible = false;
    socket.add(group);
    return group;
  }

  function buildKhopesh() {
    const group = new THREE.Group();
    group.name = 'khopesh egípcio';
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
      depth: 0.055, bevelEnabled: true, bevelSegments: 2,
      steps: 1, bevelSize: 0.018, bevelThickness: 0.018
    });
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.name = 'lâmina curva de khopesh';
    blade.position.z = -0.0275;
    blade.castShadow = true;
    group.add(blade);
    const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.78, 0.018), brass);
    ridge.position.set(0.14, 0.58, 0.035);
    group.add(ridge);
    group.visible = false;
    socket.add(group);
    return group;
  }

  const staff = buildStaff();
  const khopesh = buildKhopesh();
  let equipped = null;
  let attackRemaining = 0;
  let attackDuration = 0.44;
  const restRotation = socket.rotation.clone();
  const panel = document.getElementById('inventoryPanel');
  const status = document.getElementById('inventoryStatus');

  const toggle = (force) => {
    const open = typeof force === 'boolean' ? force : Boolean(panel?.hidden);
    if (panel) panel.hidden = !open;
  };
  const refresh = () => {
    document.querySelectorAll('[data-equip]').forEach((button) => {
      button.classList.toggle('selected', button.dataset.equip === equipped);
    });
    if (status) status.textContent = equipped
      ? (equipped === 'staff' ? 'EQUIPADO · CAJADO' : 'EQUIPADO · KHOPESH')
      : 'MÃOS LIVRES';
    [document.getElementById('inventoryUse'), document.getElementById('inventoryMobileUse')]
      .forEach((button) => { if (button) button.disabled = !equipped; });
  };
  const equip = (name) => {
    if (name !== 'staff' && name !== 'khopesh') return;
    equipped = name;
    staff.visible = name === 'staff';
    khopesh.visible = name === 'khopesh';
    attackRemaining = 0;
    socket.rotation.copy(restRotation);
    refresh();
  };
  const unequip = () => {
    equipped = null;
    staff.visible = false;
    khopesh.visible = false;
    attackRemaining = 0;
    socket.rotation.copy(restRotation);
    refresh();
  };
  const use = () => {
    if (!equipped) {
      if (status) status.textContent = 'SELECIONE UMA ARMA NO INVENTÁRIO';
      return;
    }
    attackDuration = equipped === 'khopesh' ? 0.4 : 0.52;
    attackRemaining = attackDuration;
    onUse(equipped);
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
      if (attackRemaining > 0) {
        attackRemaining = Math.max(0, attackRemaining - dt);
        const progress = 1 - attackRemaining / attackDuration;
        const swing = Math.sin(progress * Math.PI);
        if (equipped === 'khopesh') {
          socket.rotation.set(restRotation.x + 0.05 * swing, restRotation.y, restRotation.z + 1.08 * swing);
        } else {
          socket.rotation.set(restRotation.x + 0.48 * swing, restRotation.y, restRotation.z + 0.24 * swing);
        }
      } else if (socket.rotation.x !== restRotation.x || socket.rotation.y !== restRotation.y || socket.rotation.z !== restRotation.z) {
        socket.rotation.copy(restRotation);
      }
    },
    get equipped() { return equipped; },
    get hasWeaponSocket() { return Boolean(weaponBone); }
  };
}

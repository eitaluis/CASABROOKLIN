// Detalhes de interiores construídos para a linguagem híbrida cinematográfica.
// Geometria procedural leve: nenhuma dependência externa de runtime.
export function buildInteriorDetails({ THREE, scene }) {
  const brass = new THREE.MeshStandardMaterial({ color: 0xb88b4d, metalness: 0.72, roughness: 0.3 });
  const darkBrass = new THREE.MeshStandardMaterial({ color: 0x604323, metalness: 0.68, roughness: 0.4 });
  const cedar = new THREE.MeshStandardMaterial({ color: 0x4b2d20, roughness: 0.72 });
  const darkCedar = new THREE.MeshStandardMaterial({ color: 0x2c1d17, roughness: 0.78 });
  const warmGlass = new THREE.MeshStandardMaterial({
    color: 0xffc778, emissive: 0xff9c38, emissiveIntensity: 1.55,
    roughness: 0.24, metalness: 0.05
  });
  const papyrus = new THREE.MeshStandardMaterial({ color: 0xd7bd83, roughness: 0.92 });
  const lapis = new THREE.MeshStandardMaterial({ color: 0x315c68, roughness: 0.48, metalness: 0.16 });
  const shabtiGold = new THREE.MeshStandardMaterial({ color: 0xb89658, roughness: 0.42, metalness: 0.62 });

  function addBox(parent, name, pos, size, material, cast = true) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
    mesh.name = name;
    mesh.position.set(...pos);
    mesh.castShadow = cast;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function addCylinder(parent, name, pos, radiusTop, radiusBottom, height, material, segments = 12) {
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments),
      material
    );
    mesh.name = name;
    mesh.position.set(...pos);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function addSconce(x, y, z, rotationY = 0) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.y = rotationY;
    addBox(group, 'placa de arandela em bronze', [0, 0, -0.08], [0.48, 0.7, 0.13], darkBrass);
    addCylinder(group, 'haste da arandela', [0, -0.02, 0.12], 0.055, 0.055, 0.48, brass, 10);
    const cup = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.045, 8, 18), brass);
    cup.name = 'aro da tocha';
    cup.position.set(0, 0.22, 0.25);
    cup.rotation.x = Math.PI / 2;
    group.add(cup);
    const flame = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), warmGlass);
    flame.name = 'chama da arandela';
    flame.scale.set(0.7, 1.45, 0.7);
    flame.position.set(0, 0.42, 0.25);
    group.add(flame);
    scene.add(group);
    const light = new THREE.PointLight(0xffb968, 1.25, 8, 1.8);
    light.position.set(x, y + 0.45, z + (rotationY === 0 ? 0.42 : 0.08));
    scene.add(light);
  }

  // GRANDE SALÃO — lustre de bronze em três anéis e luz quente controlada.
  const chandelier = new THREE.Group();
  chandelier.name = 'lustre cerimonial do Grande Salão';
  chandelier.position.set(0, 0, -0.5);
  scene.add(chandelier);
  addCylinder(chandelier, 'corrente central do lustre', [0, 26.65, 0], 0.045, 0.045, 3.35, darkBrass, 10);
  for (const spec of [
    { radius: 2.35, y: 24.85, tube: 0.085 },
    { radius: 1.62, y: 24.05, tube: 0.07 },
    { radius: 0.78, y: 23.45, tube: 0.06 }
  ]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(spec.radius, spec.tube, 10, 64), brass);
    ring.name = 'aro de bronze do lustre';
    ring.rotation.x = Math.PI / 2;
    ring.position.y = spec.y;
    ring.castShadow = true;
    chandelier.add(ring);
  }
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * Math.PI * 2;
    const x = Math.cos(a) * 2.35;
    const z = Math.sin(a) * 2.35;
    const stem = addCylinder(chandelier, 'haste radial do lustre', [x * 0.82, 24.42, z * 0.82], 0.025, 0.025, 0.95, darkBrass, 8);
    stem.rotation.z = Math.atan2(x, 0.9);
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), warmGlass);
    lamp.name = 'luz de âmbar do lustre';
    lamp.position.set(x, 24.88, z);
    chandelier.add(lamp);
    const drop = new THREE.Mesh(new THREE.OctahedronGeometry(0.14, 0), brass);
    drop.name = 'pingente de bronze do lustre';
    drop.position.set(x * 0.72, 23.82, z * 0.72);
    chandelier.add(drop);
  }
  for (const [x, y, z, intensity, distance] of [
    [0, 24.2, -0.5, 1.5, 18],
    [-5.5, 21.5, -0.5, 0.55, 10],
    [5.5, 21.5, -0.5, 0.55, 10]
  ]) {
    const light = new THREE.PointLight(0xffc783, intensity, distance, 1.65);
    light.position.set(x, y, z);
    scene.add(light);
  }

  // Estandartes verticais: tecido escuro, borda bordada e motivo solar alado.
  const bannerCanvas = document.createElement('canvas');
  bannerCanvas.width = 256;
  bannerCanvas.height = 512;
  const bg = bannerCanvas.getContext('2d');
  const bannerGradient = bg.createLinearGradient(0, 0, 256, 512);
  bannerGradient.addColorStop(0, '#182b35');
  bannerGradient.addColorStop(0.5, '#263b42');
  bannerGradient.addColorStop(1, '#101e25');
  bg.fillStyle = bannerGradient;
  bg.fillRect(0, 0, 256, 512);
  bg.strokeStyle = '#bd9656';
  bg.lineWidth = 7;
  bg.strokeRect(12, 12, 232, 488);
  bg.lineWidth = 2;
  bg.strokeRect(24, 24, 208, 464);
  bg.fillStyle = '#d5b16c';
  bg.textAlign = 'center';
  bg.font = '38px serif';
  for (let i = 0; i < 7; i++) bg.fillText(['𓋹', '𓂀', '𓇳', '𓆣', '𓊹', '𓅓', '𓁹'][i], 128, 78 + i * 62);
  bg.beginPath();
  bg.ellipse(128, 250, 43, 53, 0, 0, Math.PI * 2);
  bg.stroke();
  bg.beginPath();
  bg.moveTo(84, 250); bg.quadraticCurveTo(42, 215, 27, 176);
  bg.quadraticCurveTo(88, 192, 128, 238);
  bg.quadraticCurveTo(168, 192, 229, 176);
  bg.quadraticCurveTo(214, 215, 172, 250);
  bg.stroke();
  const bannerTexture = new THREE.CanvasTexture(bannerCanvas);
  bannerTexture.colorSpace = THREE.SRGBColorSpace;
  const bannerMaterial = new THREE.MeshStandardMaterial({
    map: bannerTexture, roughness: 0.94, side: THREE.DoubleSide
  });
  for (const side of [-1, 1]) {
    const banner = new THREE.Mesh(new THREE.PlaneGeometry(2.05, 4.25), bannerMaterial);
    banner.name = 'estandarte solar egípcio';
    banner.position.set(side * 13.82, 20.4, -0.5);
    banner.rotation.y = side === 1 ? -Math.PI / 2 : Math.PI / 2;
    banner.castShadow = true;
    scene.add(banner);
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 2.45, 10), brass);
    rod.name = 'haste de estandarte';
    rod.rotation.z = Math.PI / 2;
    rod.position.set(side * 13.82, 22.58, -0.5);
    scene.add(rod);
    for (const z of [-1.42, 0.42]) {
      const finial = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), shabtiGold);
      finial.position.set(side * 13.82, 22.58, z);
      scene.add(finial);
    }
  }

  for (const side of [-1, 1]) {
    for (const z of [-6.5, 0.5, 7.0]) addSconce(side * 13.75, 17.55 + (z === 0.5 ? 2.1 : 0), z, side === 1 ? -Math.PI / 2 : Math.PI / 2);
  }

  // Frisos dourados e pequenas placas de relevo ao redor do salão.
  for (const side of [-1, 1]) {
    for (const y of [16.9, 20.65, 24.4]) {
      const band = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 17.6), brass);
      band.name = 'friso de bronze da sacada';
      band.position.set(side * 13.83, y, -0.5);
      scene.add(band);
    }
  }
  for (const z of [-9.72, 9.02]) {
    for (const x of [-11.2, -5.6, 5.6, 11.2]) {
      const plaque = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.05, 0.1), darkCedar);
      plaque.name = 'placa de madeira entalhada';
      plaque.position.set(x, 18.3, z);
      scene.add(plaque);
      const inset = new THREE.Mesh(new THREE.PlaneGeometry(1.72, 0.78), bannerMaterial);
      inset.name = 'relevo dourado emoldurado';
      inset.position.set(x, 18.3, z + (z > 0 ? -0.061 : 0.061));
      if (z < 0) inset.rotation.y = Math.PI;
      scene.add(inset);
    }
  }

  // Detalhes de mobiliário: almofadas, pés de madeira e pequenas mesas laterais.
  const cushionMat = new THREE.MeshStandardMaterial({ color: 0x7a4b35, roughness: 0.95 });
  const pillowMat = new THREE.MeshStandardMaterial({ color: 0xb08a53, roughness: 0.94 });
  for (const sofaX of [-4, 4]) {
    for (const dx of [-1.65, 0, 1.65]) {
      const cushion = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.24, 1.1), cushionMat);
      cushion.name = 'almofada de assento do sofá';
      cushion.position.set(sofaX + dx, 14.05, 1.35);
      cushion.castShadow = true;
      scene.add(cushion);
      const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.62, 0.25), pillowMat);
      pillow.name = 'almofada decorativa bordada';
      pillow.position.set(sofaX + dx, 14.62, 0.92);
      pillow.rotation.z = dx === 0 ? 0 : (dx > 0 ? -0.13 : 0.13);
      pillow.castShadow = true;
      scene.add(pillow);
    }
    for (const dx of [-2.15, 2.15]) {
      for (const dz of [-0.58, 0.58]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.68, 0.22), cedar);
        leg.name = 'pé torneado do sofá';
        leg.position.set(sofaX + dx, 13.67, 1.5 + dz);
        scene.add(leg);
      }
    }
  }

  // BIBLIOTECA — substituir as estantes genéricas por nichos escavados na rocha.
  scene.traverse((object) => {
    if (object.name === 'estante curva' || object.name === 'livro antigo') object.visible = false;
    if (object.name === 'biblioteca teto plano provisório') object.visible = false;
  });

  // Cúpula de Nut: céu azul profundo, constelações e ornamentos celestes pintados.
  const domeCanvas = document.createElement('canvas');
  domeCanvas.width = 1024;
  domeCanvas.height = 512;
  const dg = domeCanvas.getContext('2d');
  const sky = dg.createLinearGradient(0, 0, 0, 512);
  sky.addColorStop(0, '#091a38');
  sky.addColorStop(0.5, '#143d55');
  sky.addColorStop(1, '#081b32');
  dg.fillStyle = sky;
  dg.fillRect(0, 0, 1024, 512);
  for (let i = 0; i < 18; i++) {
    const x = (i * 173) % 1024;
    const y = 30 + (i * 71) % 420;
    const glow = dg.createRadialGradient(x, y, 2, x, y, 95);
    glow.addColorStop(0, 'rgba(90,145,177,0.16)');
    glow.addColorStop(1, 'rgba(90,145,177,0)');
    dg.fillStyle = glow;
    dg.fillRect(x - 95, y - 95, 190, 190);
  }
  for (let i = 0; i < 320; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const r = Math.random() * 1.8 + 0.35;
    dg.fillStyle = i % 13 === 0 ? '#f7d99a' : 'rgba(210,231,236,0.8)';
    dg.beginPath(); dg.arc(x, y, r, 0, Math.PI * 2); dg.fill();
  }
  dg.save();
  dg.translate(512, 250);
  dg.strokeStyle = 'rgba(226,190,119,0.72)';
  dg.lineWidth = 3;
  for (let r = 62; r <= 178; r += 38) {
    dg.beginPath(); dg.ellipse(0, 0, r * 1.7, r * 0.68, 0, 0, Math.PI * 2); dg.stroke();
  }
  dg.beginPath();
  dg.arc(0, 0, 47, 0, Math.PI * 2);
  dg.stroke();
  for (let i = 0; i < 12; i++) {
    const a = i * Math.PI / 6;
    dg.beginPath();
    dg.moveTo(Math.cos(a) * 55, Math.sin(a) * 55);
    dg.lineTo(Math.cos(a) * 205, Math.sin(a) * 105);
    dg.stroke();
  }
  dg.fillStyle = '#e3c27f';
  dg.font = '46px serif';
  dg.textAlign = 'center';
  dg.fillText('𓇳', 0, 17);
  dg.restore();
  const domeTexture = new THREE.CanvasTexture(domeCanvas);
  domeTexture.colorSpace = THREE.SRGBColorSpace;
  domeTexture.anisotropy = 4;
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(12.32, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({
      map: domeTexture,
      emissiveMap: domeTexture,
      emissive: new THREE.Color(0x23456a),
      emissiveIntensity: 0.42,
      roughness: 1,
      side: THREE.BackSide
    })
  );
  dome.name = 'cúpula celeste de Nut';
  dome.position.set(0, -6.66, -0.5);
  dome.receiveShadow = true;
  scene.add(dome);

  // Geb no piso: cartografia verde-terra, círculos rituais e linhas topográficas.
  const earthCanvas = document.createElement('canvas');
  earthCanvas.width = 1024;
  earthCanvas.height = 1024;
  const eg = earthCanvas.getContext('2d');
  eg.fillStyle = '#263d36';
  eg.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 44; i++) {
    const x = 70 + Math.random() * 884;
    const y = 70 + Math.random() * 884;
    eg.fillStyle = i % 3 === 0 ? 'rgba(171,139,83,0.45)' : 'rgba(86,128,91,0.36)';
    eg.beginPath();
    eg.ellipse(x, y, 25 + Math.random() * 120, 18 + Math.random() * 72, Math.random() * Math.PI, 0, Math.PI * 2);
    eg.fill();
  }
  eg.strokeStyle = 'rgba(220,187,119,0.72)';
  for (let r = 80; r < 500; r += 42) {
    eg.lineWidth = r % 84 === 80 ? 5 : 2;
    eg.beginPath(); eg.arc(512, 512, r, 0, Math.PI * 2); eg.stroke();
  }
  eg.save();
  eg.translate(512, 512);
  eg.strokeStyle = '#d2b477';
  eg.lineWidth = 4;
  for (let i = 0; i < 16; i++) {
    eg.rotate(Math.PI / 8);
    eg.beginPath(); eg.moveTo(0, -110); eg.lineTo(0, -478); eg.stroke();
    eg.fillStyle = '#d8bd7e';
    eg.fillRect(-7, -478, 14, 26);
  }
  eg.font = '48px serif';
  eg.textAlign = 'center';
  eg.fillStyle = '#d8bd7e';
  eg.fillText('𓈖 𓇳 𓂀 𓋹', 0, 32);
  eg.restore();
  const earthTexture = new THREE.CanvasTexture(earthCanvas);
  earthTexture.colorSpace = THREE.SRGBColorSpace;
  const earthFloor = new THREE.Mesh(
    new THREE.CircleGeometry(8.25, 64),
    new THREE.MeshStandardMaterial({ map: earthTexture, roughness: 0.94, metalness: 0.08, side: THREE.DoubleSide })
  );
  earthFloor.name = 'mapa terrestre de Geb';
  earthFloor.rotation.x = -Math.PI / 2;
  earthFloor.position.set(0, -17.325, -0.5);
  earthFloor.receiveShadow = true;
  scene.add(earthFloor);
  for (const radius of [5.4, 7.95]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.035, 8, 96), brass);
    ring.name = 'anel cartográfico de Geb';
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, -17.29, -0.5);
    scene.add(ring);
  }

  // 48 nichos circulares em três faixas, com rolos de papiro guardados.
  const scrollWood = new THREE.MeshStandardMaterial({ color: 0x765137, roughness: 0.78 });
  const scrollCord = new THREE.MeshStandardMaterial({ color: 0x9d7339, roughness: 0.78 });
  const rows = [-15.05, -11.72, -8.39];
  const nicheCount = 16;
  for (let row = 0; row < rows.length; row++) {
    for (let i = 0; i < nicheCount; i++) {
      const angle = i / nicheCount * Math.PI * 2;
      const group = new THREE.Group();
      group.name = 'nicho de papiros da biblioteca';
      group.position.set(Math.cos(angle) * 11.62, rows[row], Math.sin(angle) * 11.62 - 0.5);
      group.rotation.y = -angle - Math.PI / 2;
      addBox(group, 'fundo escuro do nicho', [0, 0, -0.17], [1.48, 1.55, 0.2], darkCedar, false);
      addBox(group, 'ombreira esquerda do nicho', [-0.76, 0, 0], [0.12, 1.72, 0.36], stoneMaterial(), false);
      addBox(group, 'ombreira direita do nicho', [0.76, 0, 0], [0.12, 1.72, 0.36], stoneMaterial(), false);
      addBox(group, 'lintel do nicho', [0, 0.84, 0], [1.62, 0.14, 0.38], brass, false);
      addBox(group, 'soleira do nicho', [0, -0.84, 0], [1.62, 0.14, 0.38], brass, false);
      for (let n = 0; n < 2; n++) {
        const roll = addCylinder(group, 'rolo de papiro', [-0.22 + n * 0.44, -0.18 + n * 0.48, 0.1], 0.105, 0.105, 0.98, papyrus, 12);
        roll.rotation.z = Math.PI / 2;
        for (const end of [-0.5, 0.5]) {
          const cap = addCylinder(group, 'ponteira de madeira do papiro', [-0.22 + n * 0.44 + end * 0.97, -0.18 + n * 0.48, 0.1], 0.112, 0.112, 0.035, scrollWood, 10);
          cap.rotation.z = Math.PI / 2;
        }
        addBox(group, 'cordão do papiro', [-0.22 + n * 0.44, -0.18 + n * 0.48, 0.205], [0.06, 0.25, 0.025], scrollCord, false);
      }
      scene.add(group);
    }
  }

  function addShabti(angle, index) {
    const radius = 8.15;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius - 0.5;
    const group = new THREE.Group();
    group.name = 'shabti guardião da biblioteca';
    group.position.set(x, -17.38, z);
    group.rotation.y = -angle - Math.PI / 2;
    addBox(group, 'pedestal de shabti', [0, 0.28, 0], [1.1, 0.56, 1.1], darkCedar);
    addBox(group, 'filete de ouro do pedestal', [0, 0.59, 0], [1.14, 0.08, 1.14], brass, false);
    addCylinder(group, 'corpo mumiforme do shabti', [0, 1.22, 0], 0.34, 0.42, 1.2, index % 2 ? lapis : shabtiGold, 10);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.29, 12, 10), index % 2 ? lapis : shabtiGold);
    head.name = 'cabeça do shabti';
    head.position.set(0, 1.96, 0);
    head.scale.set(0.9, 1.1, 0.9);
    group.add(head);
    const nemes = new THREE.Mesh(new THREE.SphereGeometry(0.34, 12, 8), index % 2 ? lapis : shabtiGold);
    nemes.name = 'nemes do shabti';
    nemes.position.set(0, 2.0, -0.045);
    nemes.scale.set(1.25, 1.05, 1.0);
    group.add(nemes);
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.29, 0.07, 8, 16), brass);
    collar.name = 'colar do shabti';
    collar.position.set(0, 1.58, 0.02);
    collar.rotation.x = Math.PI / 2;
    group.add(collar);
    const armA = addBox(group, 'braço cruzado do shabti', [-0.12, 1.35, 0.29], [0.48, 0.14, 0.15], shabtiGold);
    armA.rotation.z = 0.18;
    const armB = addBox(group, 'braço cruzado do shabti', [0.12, 1.22, 0.29], [0.48, 0.14, 0.15], shabtiGold);
    armB.rotation.z = -0.18;
    addCylinder(group, 'enxada cerimonial do shabti', [0.34, 1.58, 0.3], 0.025, 0.025, 0.8, brass, 8);
    const glow = new THREE.PointLight(0x88b6c2, 0.22, 3, 2);
    glow.position.set(0, 2.2, 0.45);
    group.add(glow);
    scene.add(group);
  }
  for (let i = 0; i < 4; i++) addShabti(i * Math.PI / 2, i);

  // Mesa de leitura: lâmpadas de óleo e rolos abertos.
  const lectern = new THREE.Group();
  lectern.name = 'objetos de leitura da biblioteca';
  lectern.position.set(0, -16.95, -0.5);
  scene.add(lectern);
  addBox(lectern, 'papiro aberto sobre a mesa', [0, 0.91, 0.15], [2.55, 0.05, 0.9], papyrus);
  for (let i = 0; i < 11; i++) {
    const stroke = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.008, 0.62), darkBrass);
    stroke.name = 'linha manuscrita no papiro';
    stroke.position.set(-1.12 + i * 0.22, 0.945, 0.15);
    lectern.add(stroke);
  }
  for (const x of [-1.55, 1.55]) {
    const jar = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 10), brass);
    jar.name = 'frasco de óleo da biblioteca';
    jar.scale.y = 1.25;
    jar.position.set(x, 0.9, -0.18);
    lectern.add(jar);
    const flame = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), warmGlass);
    flame.position.set(x, 1.2, -0.18);
    lectern.add(flame);
    const light = new THREE.PointLight(0xffc77a, 0.35, 4);
    light.position.set(x, 1.27, -0.18);
    lectern.add(light);
  }

  // Molduras de parede com sinais hieroglíficos nas transições da câmara.
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * Math.PI * 2;
    const plaque = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.25, 0.12), brass);
    plaque.name = 'placa direcional de hieróglifos da biblioteca';
    plaque.position.set(Math.cos(a) * 12.12, -12.55, Math.sin(a) * 12.12 - 0.5);
    plaque.rotation.y = -a - Math.PI / 2;
    scene.add(plaque);
  }

  return { chandelier, dome };
}

// A pedra dos nichos recebe uma tonalidade própria para contraste com os papiros.
function stoneMaterial() {
  return new THREE.MeshStandardMaterial({ color: 0x85765c, roughness: 0.9, metalness: 0.02 });
}

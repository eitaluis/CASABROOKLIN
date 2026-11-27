// Biblioteca subterrânea da Brooklyn House.
// Arquitetura, objetos e interações em um único módulo compartilhado no desktop/mobile.
// Geb e Nut mantêm superfícies e UVs preparados para as pinturas finais aprovadas;
// as imagens finais ficam deliberadamente pendentes enquanto a geração estiver suspensa.

export function buildLibrary({ THREE, scene, interactables = [], colliders = [], limestone = null }) {
  const centerZ = -0.5;
  const floorY = -17.4;
  const radius = 15.5;
  const wallTop = -7.0;
  const wallHeight = wallTop - floorY;
  const columns = 160;
  const rows = 30;
  const nicheRadius = 0.17;
  const nicheCount = columns * rows;
  const rowCenters = Array.from({ length: rows }, (_, row) =>
    floorY + 0.58 + row * ((wallHeight - 1.16) / (rows - 1))
  );

  // Limpa somente os antigos módulos da biblioteca; preserva o Grande Salão.
  const legacyNames = new Set([
    'parede lisa antiga da biblioteca',
    'biblioteca teto plano provisório',
    'mosaico antigo da biblioteca',
    'placa direcional de hieróglifos da biblioteca',
    'estante curva',
    'livro antigo',
    'coluna da biblioteca',
    'nicho de papiros da biblioteca',
    'shabti guardião da biblioteca',
    'objetos de leitura da biblioteca',
    'mesa de leitura antiga da biblioteca',
    'pé da mesa antiga da biblioteca',
    'castiçal antigo da biblioteca',
    'luz do castiçal antigo da biblioteca',
    'degrau da escada em espiral',
    'corrimão da escada antiga da biblioteca'
  ]);
  scene.traverse((object) => {
    if (legacyNames.has(object.name || '')) object.visible = false;
  });
  for (let i = interactables.length - 1; i >= 0; i--) {
    const name = interactables[i].name || '';
    if (
      name.includes('papiro da galeria inferior') ||
      name.includes('shabti ') ||
      name.includes('estatueta ') ||
      name.includes('mesa de leitura da biblioteca')
    ) interactables.splice(i, 1);
  }

  const stone = new THREE.MeshStandardMaterial({
    color: 0xc5b28f,
    map: limestone || null,
    roughness: 0.96,
    metalness: 0.015
  });
  const darkStone = new THREE.MeshStandardMaterial({ color: 0x39352e, roughness: 0.98 });
  const nicheStone = new THREE.MeshStandardMaterial({ color: 0x655844, roughness: 0.95, side: THREE.DoubleSide });
  const brass = new THREE.MeshStandardMaterial({ color: 0x98764a, metalness: 0.52, roughness: 0.48 });
  const darkBrass = new THREE.MeshStandardMaterial({ color: 0x463624, metalness: 0.45, roughness: 0.58 });
  const polymer = new THREE.MeshStandardMaterial({
    color: 0xe8eee8,
    roughness: 0.2,
    metalness: 0.03,
    transparent: true,
    opacity: 0.42,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  const capMaterial = new THREE.MeshStandardMaterial({ color: 0xb8c4bd, roughness: 0.34, metalness: 0.12 });
  const parchment = new THREE.MeshStandardMaterial({ color: 0xe0c997, roughness: 0.96, side: THREE.DoubleSide });
  const ink = new THREE.MeshStandardMaterial({ color: 0x352a20, roughness: 0.9 });
  const leather = new THREE.MeshStandardMaterial({ color: 0x513629, roughness: 0.88 });
  const leatherEdge = new THREE.MeshStandardMaterial({ color: 0x261b16, roughness: 0.94 });
  const linen = new THREE.MeshStandardMaterial({ color: 0xd9cba9, roughness: 0.93 });
  const reed = new THREE.MeshStandardMaterial({ color: 0x9d7950, roughness: 0.88 });
  const blackPigment = new THREE.MeshStandardMaterial({ color: 0x202322, roughness: 0.92 });
  const redPigment = new THREE.MeshStandardMaterial({ color: 0x873f2b, roughness: 0.92 });
  const inkStone = new THREE.MeshStandardMaterial({ color: 0x373b36, roughness: 0.54 });

  const libraryRandom = (() => {
    let seed = 0x4b414e45;
    return () => {
      seed = (seed + 0x6D2B79F5) | 0;
      let value = seed;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  })();

  const hieroglyphs = [
    '𓀀','𓀁','𓀂','𓀃','𓀄','𓀅','𓀆','𓀇','𓀈','𓀉','𓀊','𓀋',
    '𓂀','𓋹','𓇳','𓊹','𓏏','𓊖','𓎛','𓉐','𓆣','𓈖','𓈙','𓈛',
    '𓅃','𓅄','𓅆','𓅇','𓅊','𓅓','𓅱','𓃀','𓃁','𓃂','𓃃','𓃄',
    '𓃅','𓃆','𓃇','𓃈','𓃉','𓃊','𓊪','𓊃','𓊤','𓊨','𓌳','𓍿'
  ];
  const pigment = ['#b99562', '#c7a875', '#af8d60', '#d0b987', '#9d8059', '#bea16c'];

  function drawProfileFigure(g, x, y, scale, skin, cloth, hairColor) {
    g.save();
    g.translate(x, y);
    g.scale(scale, scale);
    g.lineJoin = 'round';
    g.strokeStyle = '#4f3c28';
    g.lineWidth = 3;
    g.fillStyle = skin;
    g.beginPath();
    g.ellipse(0, -61, 10, 13, 0, 0, Math.PI * 2);
    g.fill();
    g.stroke();
    g.beginPath(); g.moveTo(7,-64); g.lineTo(15,-58); g.lineTo(7,-54); g.stroke();
    g.fillStyle = hairColor;
    g.beginPath();
    g.moveTo(-11,-70); g.lineTo(-9,-82); g.lineTo(7,-81); g.lineTo(12,-66);
    g.lineTo(5,-65); g.lineTo(-5,-67); g.closePath(); g.fill();
    g.fillStyle = skin;
    g.beginPath(); g.moveTo(-8,-46); g.lineTo(8,-46); g.lineTo(12,-12); g.lineTo(-10,-12); g.closePath(); g.fill(); g.stroke();
    g.beginPath();
    g.moveTo(6,-41); g.lineTo(22,-29); g.lineTo(35,-36);
    g.moveTo(-5,-41); g.lineTo(-19,-25); g.lineTo(-14,-10);
    g.stroke();
    g.fillStyle = cloth;
    g.beginPath(); g.moveTo(-12,-12); g.lineTo(14,-12); g.lineTo(17,12); g.lineTo(-17,12); g.closePath(); g.fill(); g.stroke();
    g.beginPath(); g.moveTo(-7,11); g.lineTo(-10,37); g.lineTo(-19,42);
    g.moveTo(9,11); g.lineTo(13,35); g.lineTo(28,39); g.stroke();
    g.restore();
  }

  // Atlas de parede único, com cenas e sequências hieroglíficas diferentes.
  // Os sinais são uma interpretação decorativa; o romance não fixa o conteúdo das inscrições.
  function makeWallFresco() {
    const canvas = document.createElement('canvas');
    canvas.width = 4096;
    canvas.height = 2048;
    const g = canvas.getContext('2d');
    g.fillStyle = '#bba071';
    g.fillRect(0, 0, canvas.width, canvas.height);
    const cols = 24, rows = 8;
    const cellW = canvas.width / cols, cellH = canvas.height / rows;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * cellW, y = row * cellH;
        const paletteIndex = Math.floor(libraryRandom() * pigment.length);
        const base = pigment[paletteIndex];
        g.save();
        g.translate(x, y);
        g.fillStyle = base;
        g.fillRect(0, 0, cellW, cellH);
        const fade = g.createLinearGradient(0, 0, cellW, cellH);
        fade.addColorStop(0, 'rgba(250,228,180,.15)');
        fade.addColorStop(1, 'rgba(55,38,22,.22)');
        g.fillStyle = fade;
        g.fillRect(0, 0, cellW, cellH);

        g.strokeStyle = '#6f5230';
        g.lineWidth = 5;
        g.strokeRect(7, 7, cellW - 14, cellH - 14);
        g.strokeStyle = '#e3c58c';
        g.lineWidth = 2;
        g.strokeRect(15, 15, cellW - 30, cellH - 30);

        const kind = (row * cols + col) % 7;
        const skin = ['#a85f3f','#bd8155','#995437','#b06d4a'][kind % 4];
        const cloth = ['#e5d5b0','#d4c08c','#d9c9a0','#eee0bd'][kind % 4];
        const hairColor = ['#1c211f','#30251d','#151b1d','#27221e'][kind % 4];
        if (kind === 0 || kind === 3 || kind === 5) {
          drawProfileFigure(g, cellW * 0.32, cellH * 0.68, 1.35, skin, cloth, hairColor);
          drawProfileFigure(g, cellW * 0.68, cellH * 0.75, 1.05, '#b87952', '#d8c99f', '#171a19');
        } else if (kind === 1) {
          drawProfileFigure(g, cellW * 0.42, cellH * 0.68, 1.42, skin, cloth, hairColor);
          g.strokeStyle = '#315c58';
          g.lineWidth = 11;
          g.beginPath();
          g.moveTo(cellW*.68,cellH*.45);
          g.bezierCurveTo(cellW*.9,cellH*.2,cellW*.55,cellH*.16,cellW*.82,cellH*.3);
          g.stroke();
        } else {
          g.fillStyle = '#31545c';
          g.beginPath();
          g.ellipse(cellW*.52,cellH*.5,cellW*.19,cellH*.12,0,0,Math.PI*2);
          g.fill();
          g.strokeStyle = '#e0bd75';
          g.lineWidth = 4;
          g.beginPath();
          g.moveTo(cellW*.34,cellH*.5);
          g.lineTo(cellW*.72,cellH*.5);
          g.stroke();
          g.fillStyle = '#d7bd7f';
          g.font = 'bold 62px serif';
          g.textAlign = 'center';
          g.fillText(kind % 2 ? '𓂀' : '𓇳', cellW*.52, cellH*.56);
        }

        // Cada trecho recebe uma sequência e alinhamento diferentes, sem blocos repetidos.
        const vertical = (row + col) % 3 === 0;
        g.fillStyle = '#24434a';
        g.textAlign = 'center';
        g.font = 'bold 46px "Noto Sans Egyptian Hieroglyphs", serif';
        if (vertical) {
          const count = 5 + Math.floor(libraryRandom() * 5);
          for (let n = 0; n < count; n++) {
            const glyph = hieroglyphs[Math.floor(libraryRandom() * hieroglyphs.length)];
            g.fillText(glyph, cellW * (0.82 + (n % 2) * 0.06), 54 + n * 30);
          }
        } else {
          let phrase = '';
          const count = 5 + Math.floor(libraryRandom() * 7);
          for (let n = 0; n < count; n++) phrase += hieroglyphs[Math.floor(libraryRandom() * hieroglyphs.length)];
          g.fillText(phrase, cellW * 0.5, cellH * 0.89, cellW * 0.78);
        }

        // Cartuchos variáveis, sem inventar uma tradução literal.
        if ((row + col) % 4 === 1) {
          const cx = cellW * (0.2 + libraryRandom() * 0.58);
          const cy = cellH * (0.18 + libraryRandom() * 0.24);
          g.strokeStyle = '#8b5b32';
          g.lineWidth = 4;
          g.beginPath();
          g.ellipse(cx, cy, 28, 58, Math.PI / 2, 0, Math.PI * 2);
          g.stroke();
          g.fillStyle = '#254a50';
          g.font = '38px "Noto Sans Egyptian Hieroglyphs", serif';
          g.fillText(hieroglyphs[Math.floor(libraryRandom() * hieroglyphs.length)], cx, cy + 12);
        }

        g.globalAlpha = 0.12;
        g.fillStyle = '#fff0cb';
        for (let speck = 0; speck < 34; speck++) {
          const px = (speck * 71 + col * 29 + row * 13) % cellW;
          const py = (speck * 47 + col * 11 + row * 31) % cellH;
          g.fillRect(px, py, 2 + (speck % 3), 1 + (speck % 2));
        }
        g.globalAlpha = 1;
        g.restore();
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return texture;
  }

  const wallFresco = makeWallFresco();
  // Alpha map perfura a superfície exatamente nas coordenadas UV de cada cavidade.
  // O túnel, o fundo recuado e a cápsula instanciada ficam visíveis através da abertura.
  const nicheAlphaCanvas = document.createElement('canvas');
  nicheAlphaCanvas.width = 4096;
  nicheAlphaCanvas.height = 2048;
  const alphaContext = nicheAlphaCanvas.getContext('2d');
  alphaContext.fillStyle = '#ffffff';
  alphaContext.fillRect(0, 0, nicheAlphaCanvas.width, nicheAlphaCanvas.height);
  const circumference = Math.PI * 2 * radius;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const angle = (col + (row % 2) * 0.5) * ((Math.PI * 2) / columns);
      const u = ((Math.PI - angle) / (Math.PI * 2) + 1) % 1;
      const v = (rowCenters[row] - floorY) / wallHeight;
      const cx = u * nicheAlphaCanvas.width;
      const cy = (1 - v) * nicheAlphaCanvas.height;
      const rx = nicheRadius / circumference * nicheAlphaCanvas.width;
      const ry = nicheRadius / wallHeight * nicheAlphaCanvas.height;
      alphaContext.fillStyle = '#000000';
      for (const seamOffset of [-nicheAlphaCanvas.width, 0, nicheAlphaCanvas.width]) {
        alphaContext.beginPath();
        alphaContext.ellipse(cx + seamOffset, cy, rx * 1.13, ry * 1.13, 0, 0, Math.PI * 2);
        alphaContext.fill();
      }
    }
  }
  const nicheAlphaMap = new THREE.CanvasTexture(nicheAlphaCanvas);
  nicheAlphaMap.needsUpdate = true;
  const wallMaterial = new THREE.MeshStandardMaterial({
    map: wallFresco,
    alphaMap: nicheAlphaMap,
    alphaTest: 0.5,
    transparent: false,
    depthWrite: true,
    color: 0xffffff,
    roughness: 0.98,
    metalness: 0,
    side: THREE.DoubleSide
  });
  const wall = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, wallHeight, 320, 24, true),
    wallMaterial
  );
  wall.name = 'parede circular pintada da biblioteca';
  wall.position.set(0, floorY + wallHeight * 0.5, centerZ);
  wall.receiveShadow = true;
  wall.castShadow = true;
  scene.add(wall);

  // Luzes discretas de leitura e lavagem mural para a câmara mais alta.
  for (let i = 0; i < 4; i++) {
    const angle = i * Math.PI / 2 + Math.PI / 4;
    const wash = new THREE.PointLight(0xffd39b, 0.72, 15, 1.7);
    wash.name = 'luz de leitura da biblioteca';
    wash.position.set(Math.sin(angle) * 10.8, -9.2, Math.cos(angle) * 10.8 + centerZ);
    scene.add(wash);
  }
  const floorFill = new THREE.PointLight(0x9bb9b5, 0.5, 20, 1.6);
  floorFill.name = 'luz suave do piso de Geb';
  floorFill.position.set(0, floorY + 2.4, centerZ);
  scene.add(floorFill);
  const upperFill = new THREE.PointLight(0x9cbac0, 0.42, 18, 1.7);
  upperFill.name = 'luz de preenchimento sob a cúpula de Nut';
  upperFill.position.set(0, wallTop - 1.2, centerZ);
  scene.add(upperFill);

  // Nichos e cápsulas instanciados: 4.800 unidades com poucas draw calls.
  const nicheRingGeometry = new THREE.TorusGeometry(nicheRadius * 1.02, 0.014, 7, 16);
  const nicheTunnelGeometry = new THREE.CylinderGeometry(nicheRadius, nicheRadius, 0.46, 12, 1, true);
  nicheTunnelGeometry.rotateX(Math.PI / 2);
  const nicheBackGeometry = new THREE.CircleGeometry(nicheRadius * 0.96, 14);
  const capsuleBodyGeometry = new THREE.CylinderGeometry(0.086, 0.086, 0.34, 12, 1, false);
  capsuleBodyGeometry.rotateZ(Math.PI / 2);
  const capsuleCapGeometry = new THREE.CylinderGeometry(0.095, 0.095, 0.035, 12, 1, false);
  capsuleCapGeometry.rotateZ(Math.PI / 2);
  const capsuleRingGeometry = new THREE.TorusGeometry(0.088, 0.008, 6, 14);
  capsuleRingGeometry.rotateY(Math.PI / 2);
  const scrollGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.25, 12, 1, false);
  scrollGeometry.rotateZ(Math.PI / 2);
  const capsuleLabelCanvas = document.createElement('canvas');
  capsuleLabelCanvas.width = 384;
  capsuleLabelCanvas.height = 128;
  const labelContext = capsuleLabelCanvas.getContext('2d');
  labelContext.fillStyle = '#d8d2c0';
  labelContext.fillRect(0, 0, 384, 128);
  labelContext.strokeStyle = '#5f5442';
  labelContext.lineWidth = 7;
  labelContext.strokeRect(7, 7, 370, 114);
  labelContext.fillStyle = '#282a25';
  labelContext.textAlign = 'center';
  labelContext.font = 'bold 42px Georgia, serif';
  labelContext.fillText('PAPYRUS', 192, 54);
  labelContext.font = '42px "Noto Sans Egyptian Hieroglyphs", serif';
  labelContext.fillText('𓂀 𓋹 𓇳', 192, 105);
  const capsuleLabelTexture = new THREE.CanvasTexture(capsuleLabelCanvas);
  capsuleLabelTexture.colorSpace = THREE.SRGBColorSpace;
  const capsuleLabelMaterial = new THREE.MeshBasicMaterial({
    map: capsuleLabelTexture,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false
  });

  function instanced(name, geometry, material, count, castShadow = false) {
    const mesh = new THREE.InstancedMesh(geometry, material, count);
    mesh.name = name;
    mesh.castShadow = castShadow;
    mesh.receiveShadow = true;
    scene.add(mesh);
    return mesh;
  }
  const nicheRings = instanced('aros das cavidades de papiro', nicheRingGeometry, stone, nicheCount, true);
  const nicheTunnels = instanced('túneis de pedra dos nichos', nicheTunnelGeometry, nicheStone, nicheCount);
  const nicheBacks = instanced('fundos recuados dos nichos', nicheBackGeometry, darkStone, nicheCount);
  const capsuleBodies = instanced('corpos das cápsulas pneumáticas', capsuleBodyGeometry, polymer, nicheCount);
  const capsuleLeftCaps = instanced('tampas esquerdas das cápsulas', capsuleCapGeometry, capMaterial, nicheCount);
  const capsuleRightCaps = instanced('tampas direitas das cápsulas', capsuleCapGeometry, capMaterial, nicheCount);
  const capsuleRings = instanced('anéis das cápsulas', capsuleRingGeometry, brass, nicheCount * 2);
  const capsuleScrolls = instanced('papiros dentro das cápsulas', scrollGeometry, parchment, nicheCount);
  const capsuleLabels = instanced('etiquetas dos tubos de papiro', new THREE.PlaneGeometry(0.21, 0.07), capsuleLabelMaterial, nicheCount);

  const forward = new THREE.Vector3(0, 0, 1);
  const tempMatrix = new THREE.Matrix4();
  const unitScale = new THREE.Vector3(1, 1, 1);
  const capsuleRecords = new Map();
  const rowAngleStep = (Math.PI * 2) / columns;

  function setMatrix(mesh, index, position, quaternion, scale = unitScale) {
    tempMatrix.compose(position, quaternion, scale);
    mesh.setMatrixAt(index, tempMatrix);
  }
  function surfaceFor(row, col) {
    const angle = (col + (row % 2) * 0.5) * rowAngleStep;
    const outward = new THREE.Vector3(Math.sin(angle), 0, -Math.cos(angle));
    const inward = outward.clone().negate();
    const position = new THREE.Vector3(outward.x * radius, rowCenters[row], outward.z * radius + centerZ);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(forward, inward);
    return { angle, position, inward, quaternion };
  }
  function capsuleMatrix(surface, localX = 0, localY = 0, localDepth = 0.25, extraRotation = null) {
    const pos = surface.position.clone()
      .add(surface.inward.clone().multiplyScalar(localDepth))
      .add(new THREE.Vector3(1, 0, 0).applyQuaternion(surface.quaternion).multiplyScalar(localX));
    pos.y += localY;
    const q = extraRotation ? surface.quaternion.clone().multiply(extraRotation) : surface.quaternion;
    return { pos, q };
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const index = row * columns + col;
      const surface = surfaceFor(row, col);
      const { position, inward, quaternion } = surface;
      setMatrix(nicheRings, index, position.clone().add(inward.clone().multiplyScalar(0.015)), quaternion);
      const tunnel = position.clone().add(inward.clone().multiplyScalar(0.225));
      setMatrix(nicheTunnels, index, tunnel, quaternion);
      setMatrix(nicheBacks, index, position.clone().add(inward.clone().multiplyScalar(0.455)), quaternion);

      const body = capsuleMatrix(surface, 0, 0, 0.255);
      setMatrix(capsuleBodies, index, body.pos, body.q);
      const leftCap = capsuleMatrix(surface, -0.18, 0, 0.255);
      const rightCap = capsuleMatrix(surface, 0.18, 0, 0.255);
      setMatrix(capsuleLeftCaps, index, leftCap.pos, leftCap.q);
      setMatrix(capsuleRightCaps, index, rightCap.pos, rightCap.q);

      const ringLeft = capsuleMatrix(surface, -0.145, 0, 0.255, surface.quaternion);
      const ringRight = capsuleMatrix(surface, 0.145, 0, 0.255, surface.quaternion);
      setMatrix(capsuleRings, index * 2, ringLeft.pos, ringLeft.q);
      setMatrix(capsuleRings, index * 2 + 1, ringRight.pos, ringRight.q);

      const scroll = capsuleMatrix(surface, 0, 0, 0.255, null);
      setMatrix(capsuleScrolls, index, scroll.pos, scroll.q);
      const label = capsuleMatrix(surface, 0, 0.075, 0.36, null);
      setMatrix(capsuleLabels, index, label.pos, label.q);

      // Somente um grupo de tubos da faixa inferior é inspecionável; os demais
      // permanecem visíveis como acervo contínuo, sem inflar a lista de interações.
      if (row === 0 && col % 8 === 0) {
        const sheet = new THREE.Group();
        sheet.name = 'papiro aberto da cápsula ' + String(col + 1).padStart(3, '0');
        const sheetPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.27, 0.18), parchment);
        sheetPlane.position.copy(position).add(inward.clone().multiplyScalar(0.49));
        sheetPlane.position.y -= 0.12;
        sheetPlane.quaternion.copy(quaternion);
        sheet.add(sheetPlane);
        for (let line = 0; line < 6; line++) {
          const stroke = new THREE.Mesh(
            new THREE.BoxGeometry(0.17 - (line % 2) * 0.025, 0.006, 0.003),
            ink
          );
          stroke.position.set(-0.005, -0.035 - line * 0.022, 0.006);
          sheetPlane.add(stroke);
        }
        sheet.visible = false;
        scene.add(sheet);
        const record = {
          index, row, col, surface, sheet,
          opened: false,
          worldPosition: position.clone().add(inward.clone().multiplyScalar(0.78))
        };
        capsuleRecords.set(index, record);
        interactables.push({
          name: 'cápsula de papiro ' + String(col + 1).padStart(3, '0'),
          label: 'Examinar cápsula de papiro',
          description: 'Um cilindro plástico de transporte pneumático guarda um rolo de papiro.',
          position: record.worldPosition.clone(),
          radius: 1.5,
          onInteract: () => {
            record.opened = !record.opened;
            record.sheet.visible = record.opened;
            const capPosition = capsuleMatrix(surface, record.opened ? 0.31 : 0.18, 0, 0.255);
            setMatrix(capsuleRightCaps, index, capPosition.pos, capPosition.q);
            capsuleRightCaps.instanceMatrix.needsUpdate = true;
            return record.opened
              ? 'A cápsula desliza e revela o papiro guardado no interior.'
              : 'O papiro volta para dentro da cápsula e a tampa é fechada.';
          }
        });
      }
    }
  }
  for (const mesh of [nicheRings, nicheTunnels, nicheBacks, capsuleBodies, capsuleLeftCaps, capsuleRightCaps, capsuleRings, capsuleScrolls, capsuleLabels]) {
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }
  nicheRings.castShadow = true;
  nicheBacks.castShadow = false;
  capsuleBodies.castShadow = false;
  capsuleLabels.castShadow = false;

  // Escadaria monumental: três lances curvos contínuos, três patamares e corrimãos.
  const stairRadius = 10.35;
  const stairWidth = 2.7;
  const stepsPerFlight = 30;
  const flights = 3;
  const totalSteps = stepsPerFlight * flights;
  const totalAngle = Math.PI * 2;
  const angleStep = totalAngle / totalSteps;
  const riser = wallHeight / totalSteps;
  const treadDepth = stairRadius * angleStep;
  const stairStone = new THREE.MeshStandardMaterial({
    color: 0xc1b18f,
    map: limestone || null,
    roughness: 0.94,
    metalness: 0.01
  });
  const stairEdge = new THREE.MeshStandardMaterial({ color: 0x75664e, roughness: 0.91 });
  const railMaterial = new THREE.MeshStandardMaterial({ color: 0x8f754d, metalness: 0.5, roughness: 0.56 });
  const stairPathPoints = [{ x: stairRadius, y: wallTop, z: centerZ }];
  const stepGeometry = new THREE.BoxGeometry(treadDepth + 0.08, 0.18, stairWidth);
  for (let i = 0; i < totalSteps; i++) {
    const angle = (i + 0.5) * angleStep;
    const x = Math.cos(angle) * stairRadius;
    const z = Math.sin(angle) * stairRadius + centerZ;
    const top = wallTop - (i + 1) * riser;
    const step = new THREE.Mesh(stepGeometry, stairStone);
    step.name = 'degrau curvo de calcário da biblioteca';
    step.position.set(x, top - 0.09, z);
    step.rotation.y = angle + Math.PI / 2;
    step.castShadow = true;
    step.receiveShadow = true;
    scene.add(step);
    stairPathPoints.push({ x, y: top, z });

    if ((i + 1) % stepsPerFlight === 0 && i + 1 < totalSteps) {
      const landingAngle = (i + 1) * angleStep;
      const lx = Math.cos(landingAngle) * stairRadius;
      const lz = Math.sin(landingAngle) * stairRadius + centerZ;
      const landingY = wallTop - (i + 1) * riser;
      const landing = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.2, 3.1), stairStone);
      landing.name = 'patamar de calcário da escadaria';
      landing.position.set(lx, landingY - 0.1, lz);
      landing.rotation.y = landingAngle + Math.PI / 2;
      landing.castShadow = true;
      landing.receiveShadow = true;
      scene.add(landing);
      stairPathPoints.push({ x: lx, y: landingY, z: lz });
    }
  }

  function makeRail(offset, height) {
    const points = stairPathPoints.map((p) => {
      const radialX = p.x / stairRadius;
      const radialZ = (p.z - centerZ) / stairRadius;
      return new THREE.Vector3(
        p.x + radialX * offset,
        p.y + height,
        p.z + radialZ * offset
      );
    });
    const curve = new THREE.CatmullRomCurve3(points);
    const rail = new THREE.Mesh(new THREE.TubeGeometry(curve, 420, 0.065, 8, false), railMaterial);
    rail.name = 'corrimão curvo de bronze da biblioteca';
    rail.castShadow = true;
    scene.add(rail);
    for (let i = 0; i < stairPathPoints.length; i += 5) {
      const p = stairPathPoints[i];
      const radialX = p.x / stairRadius;
      const radialZ = (p.z - centerZ) / stairRadius;
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.06, height, 8),
        stairEdge
      );
      post.name = 'balaústre de calcário da escadaria';
      post.position.set(p.x + radialX * offset, p.y + height * 0.5, p.z + radialZ * offset);
      post.castShadow = true;
      scene.add(post);
    }
  }
  makeRail(-stairWidth * 0.5 + 0.06, 0.94);
  makeRail(stairWidth * 0.5 - 0.06, 0.94);
  for (const [landingAngle, landingY] of [[0, wallTop], [totalAngle, floorY]]) {
    const pad = new THREE.Mesh(new THREE.BoxGeometry(3.35, 0.2, 3.1), stairStone);
    pad.name = 'patamar de entrada da escadaria da biblioteca';
    pad.position.set(Math.cos(landingAngle) * stairRadius, landingY - 0.1, Math.sin(landingAngle) * stairRadius + centerZ);
    pad.rotation.y = landingAngle + Math.PI / 2;
    pad.receiveShadow = true;
    scene.add(pad);
  }

  // Quatro estatuetas humanas de cerâmica. O pedestal permanece imóvel;
  // o corpo articulado pode descer, procurar um objeto e regressar.
  const ceramic = new THREE.MeshStandardMaterial({ color: 0xd9c6a1, metalness: 0.06, roughness: 0.27 });
  const faience = new THREE.MeshStandardMaterial({ color: 0x477d7e, metalness: 0.12, roughness: 0.25 });
  const hair = new THREE.MeshStandardMaterial({ color: 0x171a19, metalness: 0.04, roughness: 0.2 });
  const kohl = new THREE.MeshStandardMaterial({ color: 0x151514, roughness: 0.78 });
  const directions = ['norte', 'leste', 'sul', 'oeste'];
  const statueDescriptions = [
    'A estatueta segura um estilete de escrita e um pequeno rolo de papiro, além de usar kilt, sandálias e cabelo preto angular.',
    'Uma estatueta de cerâmica segura uma pequena caixa de trabalho.',
    'Uma estatueta humana segura um cajado curto terminado em gancho.',
    'Uma estatueta humana de mãos vazias. O pequeno servo pode procurar um papiro específico nos nichos.'
  ];

  function addLimb(parent, name, start, end, width, material) {
    const a = new THREE.Vector3(start[0], start[1], start[2]);
    const b = new THREE.Vector3(end[0], end[1], end[2]);
    const delta = new THREE.Vector3().subVectors(b, a);
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(width * 0.88, width, delta.length(), 12, 1), material);
    mesh.name = name;
    mesh.position.copy(a).add(b).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    const joint = new THREE.Mesh(new THREE.SphereGeometry(width * 1.02, 12, 10), material);
    joint.position.copy(b);
    parent.add(joint);
    return mesh;
  }

  function addStatueObject(group, index) {
    if (index === 0) {
      const stylus = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.023, 0.36, 8), brass);
      stylus.name = 'estilete da estatueta';
      stylus.position.set(0.25, 0.62, 0.2);
      stylus.rotation.z = -0.18;
      group.add(stylus);
      const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.23, 16), parchment);
      roll.name = 'rolo de papiro da estatueta';
      roll.rotation.z = Math.PI / 2;
      roll.position.set(-0.25, 0.62, 0.18);
      group.add(roll);
    } else if (index === 1) {
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.16, 0.15), leather);
      box.name = 'pequena caixa da estatueta';
      box.position.set(0.27, 0.62, 0.18);
      group.add(box);
      const lid = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.035, 0.16), brass);
      lid.position.set(0.27, 0.72, 0.18);
      group.add(lid);
    } else if (index === 2) {
      const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.023, 0.03, 0.62, 10), brass);
      staff.name = 'cajado curto da estatueta';
      staff.position.set(0.28, 0.77, 0.16);
      staff.rotation.z = -0.08;
      group.add(staff);
      const hookCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.28, 1.09, 0.16),
        new THREE.Vector3(0.28, 1.17, 0.16),
        new THREE.Vector3(0.38, 1.20, 0.16),
        new THREE.Vector3(0.43, 1.13, 0.16)
      ]);
      group.add(new THREE.Mesh(new THREE.TubeGeometry(hookCurve, 16, 0.025, 8, false), brass));
    }
  }

  const statueRoots = [];
  for (let index = 0; index < 4; index++) {
    const angle = index * Math.PI / 2;
    const statueRadius = 7.35;
    const x = Math.sin(angle) * statueRadius;
    const z = -Math.cos(angle) * statueRadius + centerZ;
    const statue = new THREE.Group();
    statue.name = 'estatueta de cerâmica ' + directions[index];
    statue.position.set(x, floorY, z);
    statue.rotation.y = -angle;

    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.54, 0.27, 20), stone);
    pedestal.name = 'pedestal de pedra da estatueta';
    pedestal.position.y = 0.135;
    pedestal.castShadow = true;
    pedestal.receiveShadow = true;
    statue.add(pedestal);
    const pedestalBand = new THREE.Mesh(new THREE.TorusGeometry(0.47, 0.025, 8, 32), brass);
    pedestalBand.rotation.x = Math.PI / 2;
    pedestalBand.position.y = 0.23;
    statue.add(pedestalBand);

    const figure = new THREE.Group();
    figure.name = 'corpo móvel da estatueta';
    statue.add(figure);

    for (const side of [-1, 1]) {
      const sandal = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.055, 0.28), leather);
      sandal.name = 'sandália da estatueta';
      sandal.position.set(side * 0.095, 0.31, 0.045);
      figure.add(sandal);
      addLimb(figure, 'perna da estatueta', [side * 0.095, 0.34, 0], [side * 0.11, 0.55, 0.015], 0.045, ceramic);
    }

    const kilt = new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.225, 0.25, 16, 1), linen);
    kilt.name = 'kilt de linho da estatueta';
    kilt.position.set(0, 0.62, 0);
    figure.add(kilt);
    const kiltBand = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.025, 8, 24), faience);
    kiltBand.rotation.x = Math.PI / 2;
    kiltBand.position.y = 0.75;
    figure.add(kiltBand);

    const torso = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 16), ceramic);
    torso.name = 'torso humano da estatueta';
    torso.scale.set(0.92, 1.38, 0.78);
    torso.position.set(0, 0.88, 0);
    figure.add(torso);
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.025, 8, 24), faience);
    collar.rotation.x = Math.PI / 2;
    collar.position.set(0, 0.99, 0.01);
    figure.add(collar);

    for (const side of [-1, 1]) {
      addLimb(figure, 'braço da estatueta', [side * 0.135, 0.96, 0], [side * 0.23, 0.78, 0.08], 0.043, ceramic);
      addLimb(figure, 'antebraço da estatueta', [side * 0.23, 0.78, 0.08], [side * 0.25, 0.63, 0.16], 0.036, ceramic);
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.048, 12, 10), ceramic);
      hand.position.set(side * 0.25, 0.62, 0.17);
      figure.add(hand);
    }

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.047, 0.055, 0.09, 12), ceramic);
    neck.position.set(0, 1.04, 0);
    figure.add(neck);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.115, 22, 18), ceramic);
    head.name = 'rosto humano da estatueta';
    head.scale.set(0.88, 1.08, 0.9);
    head.position.set(0, 1.15, 0.015);
    figure.add(head);
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.027, 0.075, 6), ceramic);
    nose.rotation.x = Math.PI / 2;
    nose.position.set(0, 1.145, 0.115);
    figure.add(nose);

    const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.122, 18, 12), hair);
    hairCap.name = 'cabelo preto da estatueta';
    hairCap.scale.set(1.08, 0.88, 1.05);
    hairCap.position.set(0, 1.205, 0);
    figure.add(hairCap);
    const fringeShape = new THREE.Shape();
    fringeShape.moveTo(-0.12, 0.06);
    fringeShape.lineTo(0.12, 0.06);
    fringeShape.lineTo(0.115, -0.015);
    fringeShape.lineTo(0.065, -0.03);
    fringeShape.lineTo(0.02, -0.015);
    fringeShape.lineTo(-0.04, -0.035);
    fringeShape.lineTo(-0.12, -0.01);
    fringeShape.closePath();
    const fringe = new THREE.Mesh(new THREE.ShapeGeometry(fringeShape), hair);
    fringe.name = 'franja angular da estatueta';
    fringe.position.set(0, 1.19, 0.098);
    figure.add(fringe);
    for (const side of [-1, 1]) {
      const lock = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 10), hair);
      lock.name = 'mecha lateral do cabelo da estatueta';
      lock.scale.set(0.78, 1.55, 0.85);
      lock.position.set(side * 0.103, 1.105, 0.005);
      figure.add(lock);
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), kohl);
      eye.position.set(side * 0.047, 1.155, 0.108);
      figure.add(eye);
      const liner = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.008, 0.008), kohl);
      liner.position.set(side * 0.047, 1.17, 0.108);
      liner.rotation.z = side * -0.08;
      figure.add(liner);
    }

    addStatueObject(figure, index);
    let carriedItem = null;
    if (index === 3) {
      carriedItem = new THREE.Group();
      carriedItem.name = 'papiro carregado pelo pequeno servo';
      const carriedRoll = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 0.28, 14),
        parchment
      );
      carriedRoll.rotation.z = Math.PI / 2;
      carriedRoll.position.set(0.29, 0.66, 0.22);
      carriedItem.add(carriedRoll);
      for (const end of [-1, 1]) {
        const endCap = new THREE.Mesh(
          new THREE.CylinderGeometry(0.048, 0.048, 0.025, 12),
          reed
        );
        endCap.rotation.z = Math.PI / 2;
        endCap.position.set(0.29 + end * 0.15, 0.66, 0.22);
        carriedItem.add(endCap);
      }
      carriedItem.visible = false;
      figure.add(carriedItem);
    } else if (index === 2) {
      carriedItem = new THREE.Group();
      carriedItem.name = 'miniatura da Paleta de Narmer carregada pelo servo';
      const paletteShape = new THREE.Shape();
      paletteShape.moveTo(-0.065, -0.09);
      paletteShape.lineTo(-0.065, 0.11);
      paletteShape.quadraticCurveTo(-0.06, 0.17, 0, 0.18);
      paletteShape.quadraticCurveTo(0.06, 0.17, 0.065, 0.11);
      paletteShape.lineTo(0.065, -0.09);
      paletteShape.quadraticCurveTo(0.04, -0.13, 0, -0.13);
      paletteShape.quadraticCurveTo(-0.04, -0.13, -0.065, -0.09);
      const handPalette = new THREE.Mesh(
        new THREE.ShapeGeometry(paletteShape),
        new THREE.MeshStandardMaterial({ color: 0x75806b, roughness: 0.9, side: THREE.DoubleSide })
      );
      handPalette.position.set(0.3, 0.69, 0.22);
      carriedItem.add(handPalette);
      const eyeRelief = new THREE.Mesh(new THREE.TorusGeometry(0.027, 0.005, 5, 12), darkStone);
      eyeRelief.position.set(0.3, 0.72, 0.226);
      carriedItem.add(eyeRelief);
      carriedItem.visible = false;
      figure.add(carriedItem);
    }
    statue.traverse((object) => {
      if (object.isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
    scene.add(statue);
    statueRoots.push({ statue, figure, carriedItem, index, x, z });

    if (colliders) {
      colliders.push({
        minX: x - 0.52, maxX: x + 0.52,
        minY: floorY, maxY: floorY + 1.35,
        minZ: z - 0.52, maxZ: z + 0.52
      });
    }
    if (interactables) {
      interactables.push({
        name: 'estatueta ' + directions[index],
        label: index === 3 ? 'Pedir para procurar papiro' : index === 2 ? 'Pedir para buscar um artefato' : 'Examinar estatueta',
        kind: 'shabti',
        description: statueDescriptions[index],
        position: new THREE.Vector3(x, floorY + 0.72, z),
        radius: 2.5,
        onInteract: () => startShabtiTask(index)
      });
    }
  }

  // Mesa de trabalho em calcário, com bolsa de Julius, papiros e kit de escriba.
  const table = new THREE.Group();
  table.name = 'mesa comprida de pedra da biblioteca';
  table.position.set(0, floorY, centerZ);
  scene.add(table);
  const tableTopY = 1.02;

  const tableTop = new THREE.Mesh(new THREE.BoxGeometry(6.3, 0.24, 2.35), stone);
  tableTop.name = 'tampo monolítico da mesa de Julius';
  tableTop.position.y = tableTopY;
  tableTop.castShadow = true;
  tableTop.receiveShadow = true;
  table.add(tableTop);
  for (const x of [-2.05, 2.05]) {
    const support = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.88, 1.8), stone);
    support.position.set(x, 0.45, 0);
    support.castShadow = true;
    support.receiveShadow = true;
    table.add(support);
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.12, 1.95), darkStone);
    foot.position.set(x, 0.06, 0);
    table.add(foot);
  }
  for (const side of [-1, 1]) {
    const border = new THREE.Mesh(new THREE.BoxGeometry(5.95, 0.025, 0.035), brass);
    border.position.set(0, tableTopY + 0.13, side * 1.05);
    table.add(border);
  }

  // Kit de escrita arqueologicamente inspirado: paleta, pigmentos, pincéis de junco,
  // folhas, rolos e fio de amarração. Não são livros modernos nem estantes.
  const scribePalette = new THREE.Group();
  scribePalette.name = 'paleta de escriba e pigmentos';
  scribePalette.position.set(-1.65, tableTopY + 0.14, -0.42);
  table.add(scribePalette);
  const paletteBoard = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.055, 0.27), leather);
  paletteBoard.name = 'paleta de madeira do escriba';
  scribePalette.add(paletteBoard);
  const inkCakeBlack = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.082, 0.035, 18), blackPigment);
  inkCakeBlack.name = 'bolo de tinta preta';
  inkCakeBlack.position.set(-0.2, 0.045, 0);
  scribePalette.add(inkCakeBlack);
  const inkCakeRed = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.082, 0.035, 18), redPigment);
  inkCakeRed.name = 'bolo de tinta vermelha';
  inkCakeRed.position.set(0.2, 0.045, 0);
  scribePalette.add(inkCakeRed);

  for (let i = 0; i < 3; i++) {
    const brush = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.012, 0.78, 7), reed);
    brush.name = 'pincel de junco do escriba';
    brush.position.set(-0.65 + i * 0.11, tableTopY + 0.19, 0.63 + (i % 2) * 0.08);
    brush.rotation.z = Math.PI / 2 + i * 0.035;
    table.add(brush);
    const darkTip = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.11, 7), darkBrass);
    darkTip.position.set(brush.position.x + 0.38, brush.position.y, brush.position.z);
    darkTip.rotation.z = 0;
    table.add(darkTip);
  }

  const inkBowl = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12), inkStone);
  inkBowl.name = 'pequeno recipiente de tinta';
  inkBowl.scale.set(1, 0.48, 1);
  inkBowl.position.set(-0.85, tableTopY + 0.22, -0.48);
  table.add(inkBowl);
  const inkWell = new THREE.Mesh(new THREE.CircleGeometry(0.09, 16), blackPigment);
  inkWell.rotation.x = -Math.PI / 2;
  inkWell.position.set(-0.85, tableTopY + 0.285, -0.48);
  table.add(inkWell);

  const loosePapyrus = new THREE.Group();
  loosePapyrus.name = 'papiro aberto de trabalho';
  loosePapyrus.position.set(-0.05, tableTopY + 0.15, 0.45);
  table.add(loosePapyrus);
  const paper = new THREE.Mesh(new THREE.PlaneGeometry(1.65, 0.78), parchment);
  paper.rotation.x = -Math.PI / 2;
  loosePapyrus.add(paper);
  for (let line = 0; line < 8; line++) {
    const width = 1.23 - (line % 3) * 0.11;
    const stroke = new THREE.Mesh(new THREE.BoxGeometry(width, 0.008, 0.012), ink);
    stroke.position.set(-0.04, 0.012, -0.26 + line * 0.07);
    loosePapyrus.add(stroke);
  }
  const rolledPapyrus = new THREE.Group();
  rolledPapyrus.name = 'rolos de papiro sobre a mesa';
  rolledPapyrus.position.set(1.15, tableTopY + 0.16, -0.58);
  table.add(rolledPapyrus);
  for (let i = 0; i < 2; i++) {
    const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.82, 16), parchment);
    roll.rotation.z = Math.PI / 2;
    roll.position.set(0, i * 0.2, i * 0.17);
    rolledPapyrus.add(roll);
    for (const end of [-1, 1]) {
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.035, 14), reed);
      cap.rotation.z = Math.PI / 2;
      cap.position.set(end * 0.42, i * 0.2, i * 0.17);
      rolledPapyrus.add(cap);
    }
  }
  const tyingCord = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.012, 6, 18), leatherEdge);
  tyingCord.rotation.x = Math.PI / 2;
  tyingCord.position.set(1.15, tableTopY + 0.34, -0.58);
  table.add(tyingCord);

  const foldedCloth = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.045, 0.46), linen);
  foldedCloth.name = 'pano de linho do kit de escriba';
  foldedCloth.position.set(2.05, tableTopY + 0.16, -0.55);
  foldedCloth.rotation.y = -0.18;
  table.add(foldedCloth);

  const bag = new THREE.Group();
  bag.name = 'bolsa de trabalho de Julius Kane';
  bag.position.set(2.1, tableTopY + 0.16, 0.42);
  table.add(bag);
  const bagBody = new THREE.Mesh(new THREE.SphereGeometry(0.34, 22, 16), leather);
  bagBody.name = 'corpo de couro da bolsa de Julius';
  bagBody.scale.set(0.78, 0.78, 0.58);
  bagBody.position.y = 0.12;
  bag.add(bagBody);
  const bagFlap = new THREE.Mesh(new THREE.SphereGeometry(0.28, 18, 12), leatherEdge);
  bagFlap.name = 'aba articulada da bolsa de Julius';
  bagFlap.scale.set(0.82, 0.24, 0.76);
  bagFlap.position.set(0, 0.34, 0.11);
  bag.add(bagFlap);
  const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.095, 0.025), brass);
  buckle.position.set(0, 0.2, 0.255);
  bag.add(buckle);
  const bagStrapCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.23, 0.2, -0.05),
    new THREE.Vector3(-0.3, 0.61, -0.04),
    new THREE.Vector3(0.16, 0.69, -0.04),
    new THREE.Vector3(0.24, 0.2, -0.05)
  ]);
  bag.add(new THREE.Mesh(new THREE.TubeGeometry(bagStrapCurve, 28, 0.025, 8, false), leatherEdge));

  // Recompensa devolvida pelo shabti de mãos vazias: uma cópia em inglês.
  const retrievedPapyrus = new THREE.Group();
  retrievedPapyrus.name = 'papiro em inglês devolvido pelo shabti';
  retrievedPapyrus.position.set(-0.65, tableTopY + 0.18, -0.08);
  retrievedPapyrus.visible = false;
  table.add(retrievedPapyrus);
  const translationSheet = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.58), parchment);
  translationSheet.rotation.x = -Math.PI / 2;
  retrievedPapyrus.add(translationSheet);
  for (let line = 0; line < 7; line++) {
    const mark = new THREE.Mesh(new THREE.BoxGeometry(0.63 - (line % 3) * 0.07, 0.008, 0.012), ink);
    mark.position.set(-0.01, 0.012, -0.2 + line * 0.065);
    retrievedPapyrus.add(mark);
  }

  // Paleta de Narmer: silhueta própria inspirada no artefato histórico; não é o scan NC.
  const narmerPalette = new THREE.Group();
  narmerPalette.name = 'paleta de Narmer trazida pelo shabti';
  narmerPalette.position.set(0.52, tableTopY + 0.18, -0.12);
  narmerPalette.rotation.y = 0.28;
  narmerPalette.visible = false;
  table.add(narmerPalette);
  const narmerShape = new THREE.Shape();
  narmerShape.moveTo(-0.18, 0);
  narmerShape.lineTo(-0.17, 0.72);
  narmerShape.quadraticCurveTo(-0.15, 0.92, 0, 0.96);
  narmerShape.quadraticCurveTo(0.15, 0.92, 0.17, 0.72);
  narmerShape.lineTo(0.18, 0);
  narmerShape.quadraticCurveTo(0.16, -0.12, 0, -0.15);
  narmerShape.quadraticCurveTo(-0.16, -0.12, -0.18, 0);
  const narmerGeometry = new THREE.ExtrudeGeometry(narmerShape, {
    depth: 0.045, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.018, bevelThickness: 0.018
  });
  const narmerStone = new THREE.MeshStandardMaterial({ color: 0x6b7662, roughness: 0.88 });
  const narmerMesh = new THREE.Mesh(narmerGeometry, narmerStone);
  narmerMesh.name = 'silhueta da Paleta de Narmer';
  narmerMesh.rotation.x = -Math.PI / 2;
  narmerMesh.scale.set(0.72, 0.72, 0.72);
  narmerPalette.add(narmerMesh);
  const centralRelief = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.012, 6, 18), darkStone);
  centralRelief.rotation.x = -Math.PI / 2;
  centralRelief.position.set(0, 0.04, 0.19);
  narmerPalette.add(centralRelief);

  // Tarefas dos pequenos servos: um busca o papiro em inglês; o do cajado
  // em gancho procura a Paleta de Narmer, conforme os acontecimentos do romance.
  let activeTask = null;
  const englishCapsule = capsuleRecords.get(120);
  function startShabtiTask(index) {
    if (index !== 3 && index !== 2) {
      return statueDescriptions[index];
    }
    if (activeTask) return 'O pequeno servo já está ocupado com outra tarefa.';
    const statueEntry = statueRoots.find((entry) => entry.index === index);
    if (!statueEntry) return 'A estatueta permanece imóvel.';
    const target = index === 3
      ? (englishCapsule?.worldPosition || new THREE.Vector3(-radius + 0.75, rowCenters[0], centerZ))
      : new THREE.Vector3(0.45, floorY + tableTopY, centerZ - 0.2);
    const delta = new THREE.Vector3(target.x - statueEntry.x, 0, target.z - statueEntry.z);
    delta.applyAxisAngle(new THREE.Vector3(0, 1, 0), -statueEntry.statue.rotation.y);
    activeTask = {
      index,
      figure: statueEntry.figure,
      carriedItem: statueEntry.carriedItem,
      targetLocal: delta,
      elapsed: 0,
      duration: 6.2,
      result: index === 3 ? retrievedPapyrus : narmerPalette,
      capsule: index === 3 ? englishCapsule : null
    };
    return index === 3
      ? 'A estatueta desperta e começa a procurar a versão em inglês do papiro entre os cilindros.'
      : 'A estatueta ergue o cajado em gancho e parte para buscar a Paleta de Narmer.';
  }

  if (colliders) {
    colliders.push({
      minX: -3.25, maxX: 3.25,
      minY: floorY + 0.05, maxY: floorY + tableTopY + 0.35,
      minZ: centerZ - 1.25, maxZ: centerZ + 1.25
    });
  }
  if (interactables) {
    interactables.push({
      name: 'mesa comprida de pedra de Julius Kane',
      label: 'Examinar a mesa de Julius',
      description: 'A mesa conserva a bolsa de Julius aberta, a paleta de escriba, os pigmentos, os pincéis e diversos papiros de trabalho.',
      position: new THREE.Vector3(0, floorY + tableTopY, centerZ),
      radius: 3.0,
      onInteract: (() => {
        let bagOpen = false;
        return () => {
          bagOpen = !bagOpen;
          bagFlap.rotation.x = bagOpen ? -0.72 : 0;
          return bagOpen
            ? 'A bolsa de Julius está aberta. Há papéis e materiais de trabalho guardados nela.'
            : 'A bolsa de Julius é fechada com cuidado.';
        };
      })()
    });
    interactables.push({
      name: 'papiro em inglês recuperado',
      label: 'Examinar papiro recuperado',
      description: 'O shabti trouxe um papiro com a versão em inglês do texto.',
      position: new THREE.Vector3(-0.65, floorY + tableTopY + 0.2, centerZ - 0.08),
      radius: 1.7,
      onInteract: () => retrievedPapyrus.visible
        ? 'O papiro contém uma tradução em inglês para consulta.'
        : 'O shabti ainda não trouxe esse papiro.'
    });
    interactables.push({
      name: 'Paleta de Narmer recuperada',
      label: 'Examinar a Paleta de Narmer',
      description: 'Uma paleta cerimonial de ardósia verde-acinzentada, com relevo nos dois lados.',
      position: new THREE.Vector3(0.52, floorY + tableTopY + 0.2, centerZ - 0.12),
      radius: 1.7,
      onInteract: () => narmerPalette.visible
        ? 'A Paleta de Narmer foi trazida pelo shabti de cajado em gancho.'
        : 'A paleta ainda não foi localizada.'
    });
  }

  function update(time, dt = 0) {
    if (!activeTask) return null;
    activeTask.elapsed += Math.max(0, dt);
    const progress = THREE.MathUtils.clamp(activeTask.elapsed / activeTask.duration, 0, 1);
    let travel = 0;
    if (progress < 0.43) {
      const t = progress / 0.43;
      travel = t * t * (3 - 2 * t);
    } else if (progress < 0.56) {
      travel = 1;
    } else {
      const t = (progress - 0.56) / 0.44;
      travel = 1 - t * t * (3 - 2 * t);
    }
    const bob = Math.abs(Math.sin(time * 10.5)) * (progress > 0.04 && progress < 0.96 ? 0.045 : 0.012);
    activeTask.figure.position.set(
      activeTask.targetLocal.x * travel,
      bob + (progress > 0.43 && progress < 0.56 ? 0.08 : 0),
      activeTask.targetLocal.z * travel
    );
    const outboundFacing = activeTask.index === 3 ? Math.PI : 0;
    const returnTurn = progress < 0.56 ? 0 : THREE.MathUtils.smoothstep((progress - 0.56) / 0.44, 0, 1);
    activeTask.figure.rotation.y = outboundFacing * (1 - returnTurn);
    if (activeTask.carriedItem) {
      activeTask.carriedItem.visible = progress >= 0.56 && progress < 1;
    }
    activeTask.figure.rotation.z = Math.sin(time * 9.5) * 0.035 * (progress > 0.04 && progress < 0.96 ? 1 : 0);
    activeTask.figure.rotation.x = Math.cos(time * 9.5) * 0.025 * (progress > 0.04 && progress < 0.96 ? 1 : 0);

    if (progress >= 1) {
      activeTask.figure.position.set(0, 0, 0);
      activeTask.figure.rotation.set(0, 0, 0);
      if (activeTask.carriedItem) activeTask.carriedItem.visible = false;
      activeTask.result.visible = true;
      if (activeTask.capsule) activeTask.capsule.sheet.visible = false;
      const message = activeTask.index === 3
        ? 'O shabti retorna e entrega o papiro com a versão em inglês.'
        : 'O shabti de cajado em gancho retorna trazendo a Paleta de Narmer.';
      activeTask = null;
      return message;
    }
    return null;
  }

  return {
    stairPaths: [{ points: stairPathPoints, width: stairWidth, maxSnapHeight: 1.25 }],
    update,
    dimensions: { radius, height: wallHeight, nicheCount, stairSteps: totalSteps }
  };
}

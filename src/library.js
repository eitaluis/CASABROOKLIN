// Biblioteca subterrânea — reconstrução asset-first compartilhada entre desktop e mobile.
// A geometria usa o texto do romance como fonte canônica; o mural é uma interpretação
// pictórica original baseada em referências de pintura e relevo do Egito Antigo.

export function buildLibrary({ THREE, scene, interactables = [], colliders = [], limestone = null }) {
  const centerZ = -0.5;
  const floorY = -17.4;
  const radius = 12.5;
  const wallTop = -6.65;
  const wallBottom = floorY;
  const wallHeight = wallTop - wallBottom;
  const rowCenters = [-15.56, -11.96, -8.36];
  const columns = 16;
  const nicheRadius = 0.57;
  const segmentWidth = (Math.PI * 2 * radius) / columns;

  // Desativa apenas as versões antigas da biblioteca. A escada helicoidal e a
  // cartografia de Nut/Geb ficam preservadas nesta etapa para não quebrar a rota.
  const legacyNames = new Set([
    'mosaico antigo da biblioteca',
    'mesa de leitura antiga da biblioteca',
    'pé da mesa antiga da biblioteca',
    'castiçal antigo da biblioteca',
    'luz do castiçal antigo da biblioteca'
  ]);
  scene.traverse((object) => {
    const name = object.name || '';
    if (name === 'parede lisa antiga da biblioteca') {
      object.scale.x = 1.02;
      object.scale.z = 1.02;
    }
    if (legacyNames.has(name)) object.visible = false;
    if (
      name === 'estante curva' ||
      name === 'livro antigo' ||
      name === 'coluna da biblioteca' ||
      name === 'nicho de papiros da biblioteca' ||
      name === 'shabti guardião da biblioteca' ||
      name === 'objetos de leitura da biblioteca' ||
      name === 'placa direcional de hieróglifos da biblioteca' ||
      name === 'biblioteca teto plano provisório'
    ) object.visible = false;
  });
  for (let i = interactables.length - 1; i >= 0; i--) {
    const name = interactables[i].name || '';
    if (
      name.includes('papiro da galeria inferior') ||
      name.includes('shabti ') ||
      name === 'mesa de leitura da biblioteca'
    ) interactables.splice(i, 1);
  }

  const stone = new THREE.MeshStandardMaterial({
    color: 0xc4ad82,
    map: limestone || null,
    roughness: 0.96,
    metalness: 0.01,
    side: THREE.DoubleSide
  });
  const darkStone = new THREE.MeshStandardMaterial({
    color: 0x39352e,
    roughness: 1,
    metalness: 0
  });
  const nicheInner = new THREE.MeshStandardMaterial({
    color: 0x514638,
    roughness: 0.94,
    side: THREE.DoubleSide
  });
  const brass = new THREE.MeshStandardMaterial({
    color: 0x927044,
    metalness: 0.58,
    roughness: 0.48
  });
  const polymer = new THREE.MeshStandardMaterial({
    color: 0xe2e8e2,
    metalness: 0.08,
    roughness: 0.2,
    transparent: true,
    opacity: 0.34,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  const parchment = new THREE.MeshStandardMaterial({
    color: 0xe0c997,
    roughness: 0.96,
    side: THREE.DoubleSide
  });
  const ink = new THREE.MeshStandardMaterial({
    color: 0x352a20,
    roughness: 0.9
  });
  const leather = new THREE.MeshStandardMaterial({
    color: 0x513629,
    roughness: 0.88
  });
  const leatherEdge = new THREE.MeshStandardMaterial({
    color: 0x261b16,
    roughness: 0.94
  });

  function drawMuralPerson(g, x, y, scale, palette, lean = 0) {
    g.save();
    g.translate(x, y);
    g.scale(scale, scale);
    g.rotate(lean);
    g.lineJoin = 'round';
    g.lineCap = 'round';
    g.strokeStyle = '#392b20';
    g.lineWidth = 3;

    // Cabeça de perfil, nariz e olho delineado.
    g.fillStyle = palette.skin;
    g.beginPath();
    g.ellipse(0, -74, 11, 15, 0, 0, Math.PI * 2);
    g.fill();
    g.stroke();
    g.beginPath();
    g.moveTo(8, -76);
    g.lineTo(17, -70);
    g.lineTo(8, -66);
    g.stroke();
    g.fillStyle = '#181a18';
    g.fillRect(2, -80, 5, 2.5);

    // Cabelo em corte angular, ombro e tronco em pose egípcia lateral.
    g.fillStyle = palette.hair;
    g.beginPath();
    g.moveTo(-12, -83);
    g.lineTo(-10, -93);
    g.lineTo(8, -91);
    g.lineTo(13, -78);
    g.lineTo(7, -77);
    g.lineTo(-6, -79);
    g.closePath();
    g.fill();
    g.fillStyle = palette.skin;
    g.beginPath();
    g.moveTo(-8, -57);
    g.lineTo(8, -58);
    g.lineTo(13, -16);
    g.lineTo(-9, -16);
    g.closePath();
    g.fill();
    g.stroke();

    // Braço dianteiro estendido e braço posterior dobrado.
    g.beginPath();
    g.moveTo(7, -50); g.lineTo(28, -36); g.lineTo(42, -43);
    g.moveTo(-6, -49); g.lineTo(-22, -30); g.lineTo(-15, -12);
    g.stroke();

    // Saia de linho e duas pernas em perfil.
    g.fillStyle = palette.cloth;
    g.beginPath();
    g.moveTo(-12, -17); g.lineTo(14, -17); g.lineTo(18, 12);
    g.lineTo(-18, 12); g.closePath();
    g.fill();
    g.stroke();
    g.beginPath();
    g.moveTo(-7, 11); g.lineTo(-11, 43); g.lineTo(-22, 48);
    g.moveTo(9, 11); g.lineTo(13, 40); g.lineTo(30, 45);
    g.stroke();

    // Colar, punho e detalhes de pigmento.
    g.strokeStyle = palette.accent;
    g.lineWidth = 4;
    g.beginPath(); g.arc(0, -51, 12, 0.2, Math.PI - 0.2); g.stroke();
    g.lineWidth = 2;
    g.beginPath(); g.moveTo(-19, 49); g.lineTo(-5, 49); g.moveTo(18, 46); g.lineTo(34, 46); g.stroke();
    g.restore();
  }

  function makeMuralAtlas() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1152;
    const g = canvas.getContext('2d');
    const palettes = [
      { skin: '#a95e3f', cloth: '#e5d2a3', hair: '#242321', accent: '#d2a44f' },
      { skin: '#b8754c', cloth: '#d4c08c', hair: '#151c1e', accent: '#527c82' },
      { skin: '#9d5538', cloth: '#e3d7b8', hair: '#30251d', accent: '#9b7741' },
      { skin: '#bd8155', cloth: '#d7c99f', hair: '#1b2020', accent: '#647e58' }
    ];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 16; col++) {
        const x = col * 128;
        const y = row * 384;
        g.save();
        g.translate(x, y);
        const base = ['#bda16f', '#c5aa76', '#b79a68', '#c8ad7b'][(col + row) % 4];
        g.fillStyle = base;
        g.fillRect(0, 0, 128, 384);
        const shade = g.createLinearGradient(0, 0, 128, 384);
        shade.addColorStop(0, 'rgba(255,239,189,.12)');
        shade.addColorStop(1, 'rgba(66,43,26,.18)');
        g.fillStyle = shade;
        g.fillRect(0, 0, 128, 384);

        // Moldura pictórica inspirada em registros e paredes de túmulos egípcios.
        g.strokeStyle = '#705332';
        g.lineWidth = 5;
        g.strokeRect(5, 5, 118, 374);
        g.strokeStyle = '#e5c888';
        g.lineWidth = 2;
        g.strokeRect(11, 11, 106, 362);
        g.fillStyle = '#274e65';
        g.fillRect(14, 18, 100, 18);
        g.fillStyle = '#d5b66f';
        g.fillRect(14, 345, 100, 24);
        g.strokeStyle = '#6b4e2d';
        g.lineWidth = 2;
        for (let q = 0; q < 8; q++) {
          g.beginPath();
          g.moveTo(18 + q * 13, 22);
          g.lineTo(23 + q * 13, 31);
          g.stroke();
        }

        const palette = palettes[(col + row) % palettes.length];
        drawMuralPerson(g, 34, 222, 0.88, palette, -0.02);
        if ((col + row) % 4 !== 0) {
          drawMuralPerson(g, 96, 254, 0.72, palettes[(col + row + 1) % palettes.length], 0.03);
        } else {
          // Serpente ou criatura híbrida em cenas alternadas.
          g.strokeStyle = '#315b58';
          g.lineWidth = 9;
          g.beginPath();
          g.moveTo(72, 145); g.bezierCurveTo(115, 113, 43, 94, 93, 66);
          g.stroke();
          g.fillStyle = '#315b58';
          g.beginPath(); g.ellipse(91, 64, 10, 6, -0.2, 0, Math.PI * 2); g.fill();
          g.strokeStyle = '#e0bd75';
          g.lineWidth = 2;
          g.beginPath(); g.moveTo(83, 59); g.lineTo(99, 69); g.stroke();
        }

        // Coluna de sinais e rosetas em pigmento mineral.
        g.fillStyle = '#274a57';
        g.font = 'bold 23px serif';
        g.textAlign = 'center';
        g.fillText(['☥', '𓂀', '𓆣', '𓇳'][col % 4], 65, 72);
        g.fillStyle = '#8d5638';
        g.fillRect(18, 300, 92, 4);
        g.fillStyle = '#315d60';
        for (let mark = 0; mark < 5; mark++) {
          g.fillRect(20 + mark * 19, 316, 8, 16);
          g.fillRect(24 + mark * 19, 320, 2, 8);
        }

        // Pátina pontual, sem ruído aleatório para manter desktop/mobile idênticos.
        g.globalAlpha = 0.13;
        g.fillStyle = '#fff0c6';
        for (let speck = 0; speck < 26; speck++) {
          const px = (speck * 37 + col * 19 + row * 11) % 120;
          const py = (speck * 53 + col * 7 + row * 29) % 380;
          g.fillRect(px, py, 1 + (speck % 3), 1 + (speck % 2));
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

  const muralAtlas = makeMuralAtlas();
  const wallStoneMaterial = new THREE.MeshStandardMaterial({
    color: 0xc0a77a,
    map: limestone || null,
    roughness: 0.98,
    metalness: 0
  });

  // Cada segmento tem uma abertura geométrica real. A cavidade não é uma caixa
  // sobreposta: o furo atravessa a espessura do painel e recebe um túnel profundo.
  for (let row = 0; row < rowCenters.length; row++) {
    for (let col = 0; col < columns; col++) {
      const angle = (col + 0.5) * (Math.PI * 2 / columns);
      const panel = new THREE.Shape();
      const halfWidth = segmentWidth * 0.5 - 0.055;
      const halfHeight = 1.75;
      panel.moveTo(-halfWidth, -halfHeight);
      panel.lineTo(halfWidth, -halfHeight);
      panel.lineTo(halfWidth, halfHeight);
      panel.lineTo(-halfWidth, halfHeight);
      panel.closePath();

      const opening = new THREE.Path();
      opening.absellipse(0, 0, nicheRadius, nicheRadius, 0, Math.PI * 2, true, 0);
      panel.holes.push(opening);

      const geometry = new THREE.ExtrudeGeometry(panel, {
        depth: 0.24,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.025,
        bevelThickness: 0.025,
        curveSegments: 24
      });
      const positions = geometry.attributes.position;
      const uvs = geometry.attributes.uv;
      for (let vertex = 0; vertex < positions.count; vertex++) {
        const localX = positions.getX(vertex);
        const localY = positions.getY(vertex);
        const localDepth = positions.getZ(vertex);
        const localRadius = radius - localDepth;
        const curvedAngle = angle + localX / radius;
        positions.setXYZ(
          vertex,
          Math.sin(curvedAngle) * localRadius,
          rowCenters[row] + localY,
          -Math.cos(curvedAngle) * localRadius + centerZ
        );
        uvs.setXY(
          vertex,
          THREE.MathUtils.clamp((localX + halfWidth) / (halfWidth * 2), 0, 1),
          THREE.MathUtils.clamp((localY + halfHeight) / (halfHeight * 2), 0, 1)
        );
      }
      positions.needsUpdate = true;
      uvs.needsUpdate = true;
      geometry.computeVertexNormals();
      geometry.computeBoundingSphere();

      const tileTexture = muralAtlas.clone();
      tileTexture.repeat.set(1 / columns, 1 / 3);
      tileTexture.offset.set(col / columns, (2 - row) / 3);
      tileTexture.needsUpdate = true;
      const fresco = new THREE.MeshStandardMaterial({
        map: tileTexture,
        color: 0xffffff,
        roughness: 0.98,
        metalness: 0,
        side: THREE.DoubleSide
      });
      const tile = new THREE.Mesh(geometry, [fresco, wallStoneMaterial]);
      tile.name = 'painel mural escavado da biblioteca';
      tile.castShadow = true;
      tile.receiveShadow = true;
      scene.add(tile);

      // Poço interno da cavidade, com parede curva de pedra e fundo escuro recuado.
      const niche = new THREE.Group();
      niche.name = 'cavidade circular de papiro';
      niche.position.set(
        Math.sin(angle) * radius,
        rowCenters[row],
        -Math.cos(angle) * radius + centerZ
      );
      const inward = new THREE.Vector3(-Math.sin(angle), 0, Math.cos(angle)).normalize();
      niche.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), inward);

      const throat = new THREE.Mesh(
        new THREE.CylinderGeometry(nicheRadius, nicheRadius, 0.62, 32, 1, true),
        nicheInner
      );
      throat.name = 'parede interna do nicho escavado';
      throat.rotation.x = Math.PI / 2;
      throat.position.z = 0.31;
      throat.receiveShadow = true;
      niche.add(throat);

      const back = new THREE.Mesh(
        new THREE.CircleGeometry(nicheRadius * 0.985, 32),
        darkStone
      );
      back.name = 'fundo recuado do nicho';
      back.position.z = 0.625;
      niche.add(back);

      const lip = new THREE.Mesh(
        new THREE.TorusGeometry(nicheRadius * 0.99, 0.035, 8, 32),
        brass
      );
      lip.name = 'aro de acabamento mineral do nicho';
      lip.position.z = 0.015;
      niche.add(lip);

      // Cápsula pneumática: corpo translúcido, tampas, anéis e etiqueta bilíngue.
      const capsule = new THREE.Group();
      capsule.name = 'cápsula plástica de papiro';
      capsule.position.set(0, 0, 0.23);
      niche.add(capsule);

      const capsuleBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 0.72, 32, 1, false),
        polymer
      );
      capsuleBody.name = 'tubo de polímero translúcido';
      capsuleBody.rotation.z = Math.PI / 2;
      capsule.add(capsuleBody);

      const capMaterial = new THREE.MeshStandardMaterial({
        color: 0xb6c2bc,
        metalness: 0.16,
        roughness: 0.3
      });
      const leftCap = new THREE.Mesh(new THREE.CylinderGeometry(0.165, 0.165, 0.075, 28), capMaterial);
      leftCap.name = 'tampa esquerda da cápsula';
      leftCap.rotation.z = Math.PI / 2;
      leftCap.position.x = -0.39;
      capsule.add(leftCap);
      const rightCap = new THREE.Mesh(new THREE.CylinderGeometry(0.165, 0.165, 0.075, 28), capMaterial);
      rightCap.name = 'tampa direita da cápsula';
      rightCap.rotation.z = Math.PI / 2;
      rightCap.position.x = 0.39;
      capsule.add(rightCap);

      for (const side of [-1, 1]) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(0.153, 0.014, 8, 28),
          brass
        );
        ring.name = 'anel metálico da cápsula';
        ring.rotation.y = Math.PI / 2;
        ring.position.x = side * 0.35;
        capsule.add(ring);
      }

      const innerScroll = new THREE.Mesh(
        new THREE.CylinderGeometry(0.095, 0.095, 0.58, 20, 1, false),
        parchment
      );
      innerScroll.name = 'papiro enrolado dentro da cápsula';
      innerScroll.rotation.z = Math.PI / 2;
      innerScroll.position.z = -0.005;
      capsule.add(innerScroll);

      const labelCanvas = document.createElement('canvas');
      labelCanvas.width = 256;
      labelCanvas.height = 96;
      const labelContext = labelCanvas.getContext('2d');
      labelContext.fillStyle = '#d9d4c2';
      labelContext.fillRect(0, 0, 256, 96);
      labelContext.strokeStyle = '#6b604c';
      labelContext.lineWidth = 5;
      labelContext.strokeRect(5, 5, 246, 86);
      labelContext.fillStyle = '#282a25';
      labelContext.textAlign = 'center';
      labelContext.font = 'bold 24px serif';
      labelContext.fillText('PAPYRUS · ' + String(col + 1).padStart(2, '0'), 128, 39);
      labelContext.font = '24px serif';
      labelContext.fillText('𓂀 𓋹 𓇳', 128, 73);
      const labelTexture = new THREE.CanvasTexture(labelCanvas);
      labelTexture.colorSpace = THREE.SRGBColorSpace;
      const label = new THREE.Mesh(
        new THREE.PlaneGeometry(0.35, 0.13),
        new THREE.MeshBasicMaterial({ map: labelTexture, transparent: true, side: THREE.DoubleSide })
      );
      label.name = 'etiqueta hieroglífica e inglesa da cápsula';
      label.position.set(0, 0, 0.154);
      capsule.add(label);

      const sheet = new THREE.Mesh(
        new THREE.PlaneGeometry(0.68, 0.38),
        parchment
      );
      sheet.name = 'papiro parcialmente desenrolado';
      sheet.position.set(0, -0.29, 0.73);
      sheet.visible = false;
      niche.add(sheet);
      for (let line = 0; line < 7; line++) {
        const stroke = new THREE.Mesh(
          new THREE.BoxGeometry(0.46 - (line % 3) * 0.045, 0.009, 0.006),
          ink
        );
        stroke.position.set(0, -0.17 - line * 0.035, 0.008);
        sheet.add(stroke);
      }

      if (row === 0 && interactables) {
        let opened = false;
        const worldX = niche.position.x + inward.x * 0.72;
        const worldZ = niche.position.z + inward.z * 0.72;
        interactables.push({
          name: 'cápsula de papiro ' + String(col + 1).padStart(2, '0'),
          label: 'Examinar cápsula de papiro',
          description: 'Um cilindro plástico de transporte pneumático guarda um papiro enrolado.',
          position: new THREE.Vector3(worldX, rowCenters[row], worldZ),
          radius: 2.25,
          onInteract: () => {
            opened = !opened;
            sheet.visible = opened;
            rightCap.position.x = opened ? 0.58 : 0.39;
            return opened
              ? 'A cápsula se abre e revela o papiro guardado em seu interior.'
              : 'O papiro volta para dentro da cápsula e a tampa é recolocada.';
          }
        });
      }
    }
  }

  // Frisos de pedra e pigmento amarram os três registros pictóricos à câmara.
  const upperFrieze = new THREE.Mesh(
    new THREE.TorusGeometry(radius - 0.11, 0.07, 10, 160),
    brass
  );
  upperFrieze.name = 'friso superior da câmara';
  upperFrieze.rotation.x = Math.PI / 2;
  upperFrieze.position.set(0, wallTop + 0.03, centerZ);
  scene.add(upperFrieze);
  const lowerFrieze = new THREE.Mesh(
    new THREE.TorusGeometry(radius - 0.11, 0.07, 10, 160),
    brass
  );
  lowerFrieze.name = 'friso inferior da câmara';
  lowerFrieze.rotation.x = Math.PI / 2;
  lowerFrieze.position.set(0, wallBottom + 0.04, centerZ);
  scene.add(lowerFrieze);

  // Quatro estatuetas cerâmicas de forma humana — não são ushabtis mumiformes.
  const ceramic = new THREE.MeshStandardMaterial({
    color: 0xd9c6a1,
    metalness: 0.06,
    roughness: 0.27
  });
  const faience = new THREE.MeshStandardMaterial({
    color: 0x477d7e,
    metalness: 0.12,
    roughness: 0.25
  });
  const hair = new THREE.MeshStandardMaterial({
    color: 0x171a19,
    metalness: 0.04,
    roughness: 0.2
  });
  const kohl = new THREE.MeshStandardMaterial({
    color: 0x151514,
    roughness: 0.78
  });
  const linen = new THREE.MeshStandardMaterial({
    color: 0xe1d5b6,
    roughness: 0.9
  });
  const directions = ['norte', 'leste', 'sul', 'oeste'];
  const statueDescriptions = [
    'A estatueta cerâmica segura um estilete fino e um pequeno rolo de papiro.',
    'A estatueta cerâmica segura uma pequena caixa de trabalho.',
    'A estatueta cerâmica segura um cajado curto terminado em gancho.',
    'A estatueta cerâmica está de mãos vazias, com cabelo preto em corte angular e olhos delineados.'
  ];

  function addLimb(parent, name, start, end, width, material) {
    const a = new THREE.Vector3(start[0], start[1], start[2]);
    const b = new THREE.Vector3(end[0], end[1], end[2]);
    const delta = new THREE.Vector3().subVectors(b, a);
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(width * 0.88, width, delta.length(), 12, 1),
      material
    );
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
      // Estilete de escrita na mão direita e rolo curto na mão esquerda.
      const stylus = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.023, 0.36, 8),
        brass
      );
      stylus.name = 'estilete da estatueta';
      stylus.position.set(0.25, 0.62, 0.2);
      stylus.rotation.z = -0.18;
      group.add(stylus);
      const roll = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.055, 0.23, 16),
        parchment
      );
      roll.name = 'rolo de papiro da estatueta';
      roll.rotation.z = Math.PI / 2;
      roll.position.set(-0.25, 0.62, 0.18);
      group.add(roll);
      return;
    }
    if (index === 1) {
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.16, 0.15),
        leather
      );
      box.name = 'pequena caixa da estatueta';
      box.position.set(0.27, 0.62, 0.18);
      group.add(box);
      const lid = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.035, 0.16), brass);
      lid.position.set(0.27, 0.72, 0.18);
      group.add(lid);
      return;
    }
    if (index === 2) {
      const staff = new THREE.Mesh(
        new THREE.CylinderGeometry(0.023, 0.03, 0.62, 10),
        brass
      );
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
      const hook = new THREE.Mesh(new THREE.TubeGeometry(hookCurve, 16, 0.025, 8, false), brass);
      hook.name = 'gancho do cajado curto';
      group.add(hook);
    }
  }

  for (let index = 0; index < 4; index++) {
    const angle = index * Math.PI / 2;
    const x = Math.sin(angle) * 8.15;
    const z = -Math.cos(angle) * 8.15 + centerZ;
    const statue = new THREE.Group();
    statue.name = 'estatueta humana de cerâmica ' + directions[index];
    statue.position.set(x, floorY, z);
    statue.rotation.y = -angle;

    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.48, 0.54, 0.27, 12),
      stone
    );
    pedestal.name = 'pedestal de pedra da estatueta';
    pedestal.position.y = 0.135;
    pedestal.castShadow = true;
    pedestal.receiveShadow = true;
    statue.add(pedestal);

    const pedestalBand = new THREE.Mesh(
      new THREE.TorusGeometry(0.47, 0.025, 8, 32),
      brass
    );
    pedestalBand.name = 'filete do pedestal';
    pedestalBand.rotation.x = Math.PI / 2;
    pedestalBand.position.y = 0.23;
    statue.add(pedestalBand);

    // Sandálias e pernas visíveis sob o kilt.
    for (const side of [-1, 1]) {
      const sandal = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.055, 0.28), leather);
      sandal.name = 'sandália da estatueta';
      sandal.position.set(side * 0.095, 0.31, 0.045);
      statue.add(sandal);
      addLimb(statue, 'perna da estatueta', [side * 0.095, 0.34, 0], [side * 0.11, 0.55, 0.015], 0.045, ceramic);
    }

    const kilt = new THREE.Mesh(
      new THREE.CylinderGeometry(0.145, 0.225, 0.25, 16, 1),
      linen
    );
    kilt.name = 'kilt de linho da estatueta';
    kilt.position.set(0, 0.62, 0);
    statue.add(kilt);
    const kiltBand = new THREE.Mesh(
      new THREE.TorusGeometry(0.16, 0.025, 8, 24),
      faience
    );
    kiltBand.name = 'cinto esmaltado da estatueta';
    kiltBand.rotation.x = Math.PI / 2;
    kiltBand.position.y = 0.75;
    statue.add(kiltBand);

    const torso = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 16), ceramic);
    torso.name = 'torso humano da estatueta';
    torso.scale.set(0.92, 1.38, 0.78);
    torso.position.set(0, 0.88, 0);
    statue.add(torso);
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.025, 8, 24), faience);
    collar.name = 'colar cerâmico da estatueta';
    collar.rotation.x = Math.PI / 2;
    collar.position.set(0, 0.99, 0.01);
    statue.add(collar);

    // Braços em pose humana relaxada, com mãos próximas dos objetos.
    for (const side of [-1, 1]) {
      addLimb(
        statue,
        'braço da estatueta',
        [side * 0.135, 0.96, 0],
        [side * 0.23, 0.78, 0.08],
        0.043,
        ceramic
      );
      addLimb(
        statue,
        'antebraço da estatueta',
        [side * 0.23, 0.78, 0.08],
        [side * 0.25, 0.63, 0.16],
        0.036,
        ceramic
      );
        const hand = new THREE.Mesh(new THREE.SphereGeometry(0.048, 12, 10), ceramic);
        hand.position.set(side * 0.25, 0.62, 0.17);
        statue.add(hand);
    }

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.047, 0.055, 0.09, 12), ceramic);
    neck.name = 'pescoço da estatueta';
    neck.position.set(0, 1.04, 0);
    statue.add(neck);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.115, 22, 18), ceramic);
    head.name = 'rosto humano da estatueta';
    head.scale.set(0.88, 1.08, 0.9);
    head.position.set(0, 1.15, 0.015);
    statue.add(head);
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.027, 0.075, 6), ceramic);
    nose.name = 'nariz de perfil da estatueta';
    nose.rotation.x = Math.PI / 2;
    nose.position.set(0, 1.145, 0.115);
    statue.add(nose);

    // Cabelo preto brilhante em corte angular, sem o nemes mumiforme.
    const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.122, 18, 12), hair);
    hairCap.name = 'cabelo preto da estatueta';
    hairCap.scale.set(1.08, 0.88, 1.05);
    hairCap.position.set(0, 1.205, 0.0);
    statue.add(hairCap);
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
    statue.add(fringe);
    for (const side of [-1, 1]) {
      const lock = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 10), hair);
      lock.name = 'mecha lateral do cabelo da estatueta';
      lock.scale.set(0.78, 1.55, 0.85);
      lock.position.set(side * 0.103, 1.105, 0.005);
      statue.add(lock);
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), kohl);
      eye.name = 'olho delineado da estatueta';
      eye.position.set(side * 0.047, 1.155, 0.108);
      statue.add(eye);
      const liner = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.008, 0.008), kohl);
      liner.name = 'kohl dos olhos da estatueta';
      liner.position.set(side * 0.047, 1.17, 0.108);
      liner.rotation.z = side * -0.08;
      statue.add(liner);
    }

    addStatueObject(statue, index);
    statue.traverse((object) => {
      if (object.isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
    scene.add(statue);

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
        label: 'Examinar estatueta',
        description: statueDescriptions[index],
        position: new THREE.Vector3(x, floorY + 0.72, z),
        radius: 2.3
      });
    }
  }

  // Mesa comprida de pedra com a bolsa de trabalho de Julius Kane.
  const table = new THREE.Group();
  table.name = 'mesa comprida de pedra da biblioteca';
  table.position.set(0, floorY, centerZ);
  scene.add(table);

  const tableTop = new THREE.Mesh(
    new THREE.BoxGeometry(5.35, 0.22, 1.9),
    stone
  );
  tableTop.name = 'tampo monolítico de calcário';
  tableTop.position.y = 0.86;
  tableTop.castShadow = true;
  tableTop.receiveShadow = true;
  table.add(tableTop);

  for (const x of [-1.72, 1.72]) {
    const support = new THREE.Mesh(
      new THREE.BoxGeometry(0.44, 0.77, 1.48),
      stone
    );
    support.name = 'apoio maciço da mesa de pedra';
    support.position.set(x, 0.385, 0);
    support.castShadow = true;
    support.receiveShadow = true;
    table.add(support);
    const foot = new THREE.Mesh(
      new THREE.BoxGeometry(0.58, 0.11, 1.62),
      darkStone
    );
    foot.name = 'base do apoio de pedra';
    foot.position.set(x, 0.055, 0);
    table.add(foot);
  }

  // Frisos discretos entalhados na borda do tampo.
  for (const side of [-1, 1]) {
    const line = new THREE.Mesh(
      new THREE.BoxGeometry(4.95, 0.018, 0.025),
      brass
    );
    line.name = 'filete entalhado da mesa';
    line.position.set(0, 0.975, side * 0.83);
    table.add(line);
  }

  const bag = new THREE.Group();
  bag.name = 'bolsa de trabalho de Julius Kane';
  bag.position.set(1.45, 0.99, 0.08);
  table.add(bag);
  const bagBody = new THREE.Mesh(new THREE.SphereGeometry(0.34, 22, 16), leather);
  bagBody.name = 'corpo de couro da bolsa de Julius';
  bagBody.scale.set(0.72, 0.78, 0.56);
  bagBody.position.y = 0.12;
  bag.add(bagBody);
  const flap = new THREE.Mesh(new THREE.SphereGeometry(0.27, 18, 12), leatherEdge);
  flap.name = 'aba de couro da bolsa';
  flap.scale.set(0.78, 0.24, 0.72);
  flap.position.set(0, 0.34, 0.04);
  bag.add(flap);
  const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.09, 0.025), brass);
  buckle.name = 'fivela da bolsa de Julius';
  buckle.position.set(0, 0.2, 0.205);
  bag.add(buckle);
  const strapCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.2, 0.23, -0.06),
    new THREE.Vector3(-0.28, 0.62, -0.03),
    new THREE.Vector3(0.13, 0.68, -0.03),
    new THREE.Vector3(0.23, 0.2, -0.06)
  ]);
  const strap = new THREE.Mesh(new THREE.TubeGeometry(strapCurve, 28, 0.025, 8, false), leatherEdge);
  strap.name = 'alça da bolsa de Julius';
  bag.add(strap);

  if (colliders) {
    colliders.push({
      minX: -2.8, maxX: 2.8,
      minY: floorY + 0.05, maxY: floorY + 1.0,
      minZ: centerZ - 1.08, maxZ: centerZ + 1.08
    });
  }
  if (interactables) {
    interactables.push({
      name: 'mesa de pedra e bolsa de Julius Kane',
      label: 'Examinar mesa central',
      description: 'A mesa comprida é feita de pedra. Sobre ela está a bolsa de trabalho de Julius Kane.',
      position: new THREE.Vector3(0, floorY + 0.95, centerZ),
      radius: 2.8
    });
  }

  return {
    wallPanels: rowCenters.length * columns,
    niches: rowCenters.length * columns,
    statues: 4,
    table
  };
}

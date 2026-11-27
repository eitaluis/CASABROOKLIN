import { mkdir, rm, writeFile, copyFile, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const buildDir = path.join(root, 'assets/animations/_carter-motion-build');
const generatedPack = path.join(root, 'assets/animations/carter-moves.ara-pack.json');
const finalPack = path.join(root, 'assets/animations/carter-movement.ara-pack.json');
const finalCredits = path.join(root, 'assets/animations/carter-movement-source-credits.json');
const bagAssetPath = path.join(root, 'assets/models/carter/innerscene-crossbody-bag.glb');
const bagDownloadUrl = 'https://files.innerscene.com/library/crossbody-bag-42a4ebf2/14c278501b0655fa74c6/crossbody-bag.glb';

const selectedClips = [
  {
    slug: 'sprint_shield_loop', id: 'sprint_shield_loop', name: 'Corrida com cajado',
    category: 'Locomotion', loop: true,
    sourcePage: 'https://kinemiq.app/animations/run-sprint-with-a-shield/',
    sourceLibrary: 'Universal Animation Library 2 by Quaternius'
  },
  {
    slug: 'sprint_loop', id: 'sprint_loop', name: 'Corrida sem objeto',
    category: 'Locomotion', loop: true,
    sourcePage: 'https://kinemiq.app/animations/run-sprint/',
    sourceLibrary: 'Universal Animation Library by Quaternius'
  },
  {
    slug: 'ninjajump_double', id: 'ninjajump_double', name: 'Salto ninja duplo',
    category: 'Actions', loop: false,
    sourcePage: 'https://kinemiq.app/animations/jump-ninja-double/',
    sourceLibrary: 'Universal Animation Library 2 by Quaternius'
  },
  {
    slug: 'jump_land', id: 'jump_land', name: 'Aterrissagem',
    category: 'Actions', loop: false,
    sourcePage: 'https://kinemiq.app/animations/jump-landing/',
    sourceLibrary: 'Universal Animation Library by Quaternius'
  },
  {
    slug: 'melee_combo', id: 'melee_combo', name: 'Combo desarmado',
    category: 'Combat', loop: false,
    sourcePage: 'https://kinemiq.app/animations/punch-combo-of-punches-and-kicks/',
    sourceLibrary: 'Universal Animation Library 2 by Quaternius'
  },
  {
    slug: 'sword_heavy_combo', id: 'sword_heavy_combo', name: 'Combo pesado com arma',
    category: 'Combat', loop: false,
    sourcePage: 'https://kinemiq.app/animations/sword-heavy-combo/',
    sourceLibrary: 'Universal Animation Library by Quaternius'
  }
];

function readGlbJson(buffer, name) {
  if (buffer.length < 20 || buffer.subarray(0, 4).toString('ascii') !== 'glTF') {
    throw new Error(name + ': resposta não é um arquivo GLB válido.');
  }
  if (buffer.readUInt32LE(4) !== 2) {
    throw new Error(name + ': versão GLB diferente de 2.');
  }
  const jsonLength = buffer.readUInt32LE(12);
  const jsonType = buffer.readUInt32LE(16);
  if (jsonType !== 0x4e4f534a || jsonLength < 2 || 20 + jsonLength > buffer.length) {
    throw new Error(name + ': chunk JSON do GLB inválido.');
  }
  return JSON.parse(buffer.subarray(20, 20 + jsonLength).toString('utf8').replace(/\0+$/u, '').trim());
}

async function prepare() {
  await rm(buildDir, { recursive: true, force: true });
  await mkdir(path.dirname(bagAssetPath), { recursive: true });
  const bagResponse = await fetch(bagDownloadUrl, { signal: AbortSignal.timeout(60000) });
  if (!bagResponse.ok) {
    throw new Error('Innerscene não entregou o GLB da bolsa (HTTP ' + bagResponse.status + ').');
  }
  const bagBuffer = Buffer.from(await bagResponse.arrayBuffer());
  const bagGltf = readGlbJson(bagBuffer, 'innerscene-crossbody-bag');
  if (!Array.isArray(bagGltf.meshes) || !bagGltf.meshes.length) {
    throw new Error('O GLB da Innerscene não contém malhas.');
  }
  await writeFile(bagAssetPath, bagBuffer);
  const sceneNodes = (bagGltf.nodes || []).map((node, index) => ({
    index, name: node.name || 'node-' + index, mesh: node.mesh ?? null,
    children: node.children || [], translation: node.translation || null,
    rotation: node.rotation || null, scale: node.scale || null
  }));
  const meshSummary = (bagGltf.meshes || []).map((mesh, index) => ({
    index, name: mesh.name || 'mesh-' + index,
    primitives: mesh.primitives?.length || 0,
    materials: [...new Set((mesh.primitives || []).map(p => p.material).filter(Number.isInteger))]
  }));
  console.log('Innerscene CC0 bag stored: ' + bagBuffer.byteLength + ' bytes.');
  console.log('Innerscene node hierarchy: ' + JSON.stringify(sceneNodes));
  console.log('Innerscene mesh summary: ' + JSON.stringify(meshSummary));
  console.log('Innerscene materials: ' + JSON.stringify((bagGltf.materials || []).map((m, i) => ({ index:i, name:m.name || 'material-'+i }))));

  await mkdir(buildDir, { recursive: true });
  const animations = [];
  const creditRecords = [];

  for (const clip of selectedClips) {
    const url = 'https://kinemiq.app/wp-content/kinemiq-app/library/clips/' + clip.slug + '.glb';
    const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
    if (!response.ok) {
      throw new Error('KinemIQ não entregou ' + clip.slug + '.glb (HTTP ' + response.status + ').');
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    const gltf = readGlbJson(buffer, clip.slug);
    const sourceClips = Array.isArray(gltf.animations) ? gltf.animations : [];
    if (!sourceClips.length) {
      throw new Error(clip.slug + ': GLB baixado sem animações.');
    }
    const filename = clip.slug + '.glb';
    await writeFile(path.join(buildDir, filename), buffer);

    const animation = {
      file: filename,
      id: clip.id,
      name: clip.name,
      category: clip.category,
      loop: clip.loop,
      fps: 30
    };
    if (sourceClips[0]?.name) animation.clip = sourceClips[0].name;
    animations.push(animation);
    creditRecords.push({
      id: clip.id,
      source: url,
      sourcePage: clip.sourcePage,
      sourceLibrary: clip.sourceLibrary,
      author: 'Quaternius',
      license: 'CC0-1.0',
      licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
      sourceClip: sourceClips[0]?.name || null,
      glbBytes: buffer.byteLength,
      assetExtras: gltf.asset?.extras || null
    });
    console.log('Baixado e validado: ' + filename + ' (' + buffer.byteLength + ' bytes; ' + sourceClips.length + ' clip(s)).');
  }

  const pack = {
    $schema: 'https://ara3dgen.com/schemas/pack-source.v1.json',
    id: 'carter-moves',
    name: 'Carter — corrida, salto e combate',
    author: 'Quaternius (Universal Animation Library / Universal Animation Library 2), distributed by KinemIQ',
    license: 'CC0-1.0',
    homepage: 'https://kinemiq.app/animations/',
    description: 'Seis clipes CC0 escolhidos para Carter Kane, baixados do catálogo KinemIQ e retargetados para o rig Ara por ara3d pack.',
    animations
  };
  await writeFile(path.join(buildDir, 'pack.json'), JSON.stringify(pack, null, 2) + '\n');
  await writeFile(path.join(buildDir, 'source-credits.json'), JSON.stringify({
    generatedAt: new Date().toISOString(),
    bagAsset: { source: 'Innerscene - original model', url: 'https://www.innerscene.com/tools/library/3d-parts/crossbody-bag-42a4ebf2', license: 'CC0-1.0', file: 'assets/models/carter/innerscene-crossbody-bag.glb', bytes: bagBuffer.byteLength },
    sourceLibrary: 'KinemIQ public animation library; all six selected clips are Quaternius Universal Animation Library / Universal Animation Library 2',
    sourceCreditsPage: 'https://kinemiq.app/sources/',
    licensingNote: 'Each of the six selected clip pages identifies the motion as CC0 1.0 and names the corresponding Quaternius Universal Animation Library or Universal Animation Library 2. The wider KinemIQ catalogue also contains CC BY 3.0 and CC BY 4.0 motions, but those licences do not apply to these six selected clips. Page-level source and licence are recorded on each clip below.',
    clips: creditRecords
  }, null, 2) + '\n');
  console.log('Pack source preparado com ' + animations.length + ' animações.');
}

async function publish() {
  const pack = JSON.parse(await readFile(generatedPack, 'utf8'));
  // The unarmed KinemIQ sprint GLB contains a forward/backward Hips translation
  // inside its cycle. The player controller already moves the character root,
  // so retain the lateral weight shift and vertical bounce but flatten this
  // clip's local forward axis to prevent a second, sawtooth root movement.
  const unarmedSprint = pack.animations?.find((animation) => animation.id === 'sprint_loop');
  if (!unarmedSprint?.motion?.hips || !Number.isInteger(unarmedSprint.motion.frames)) {
    throw new Error('O pack Ara não contém o Hips track esperado de sprint_loop.');
  }
  const hipsBuffer = Buffer.from(unarmedSprint.motion.hips, 'base64');
  if (hipsBuffer.byteLength !== unarmedSprint.motion.frames * 6) {
    throw new Error('O Hips track do sprint_loop tem tamanho inválido.');
  }
  for (let frame = 0; frame < unarmedSprint.motion.frames; frame++) {
    hipsBuffer.writeInt16LE(0, frame * 6 + 4);
  }
  unarmedSprint.motion.hips = hipsBuffer.toString('base64');
  await writeFile(finalPack, JSON.stringify(pack, null, 2) + '\n');
  await copyFile(path.join(buildDir, 'source-credits.json'), finalCredits);
  await rm(buildDir, { recursive: true, force: true });
  await rm(generatedPack, { force: true });
  console.log('Pack pronto em assets/animations/carter-movement.ara-pack.json');
}

const mode = process.argv[2];
if (mode === 'prepare') await prepare();
else if (mode === 'publish') await publish();
else throw new Error('Use: node scripts/build-carter-motion-pack.mjs prepare|publish');

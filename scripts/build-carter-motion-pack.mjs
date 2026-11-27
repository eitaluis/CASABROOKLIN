import { mkdir, rm, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const buildDir = path.join(root, 'assets/animations/_carter-motion-build');
const generatedPack = path.join(root, 'assets/animations/_carter-motion-build.ara-pack.json');
const finalPack = path.join(root, 'assets/animations/carter-movement.ara-pack.json');
const finalCredits = path.join(root, 'assets/animations/carter-movement-source-credits.json');

const selectedClips = [
  { slug: 'sprint_shield_loop', id: 'sprint_shield_loop', name: 'Corrida com cajado', category: 'Locomotion', loop: true },
  { slug: 'sprint_loop', id: 'sprint_loop', name: 'Corrida sem objeto', category: 'Locomotion', loop: true },
  { slug: 'ninjajump_double', id: 'ninjajump_double', name: 'Salto ninja duplo', category: 'Actions', loop: false },
  { slug: 'jump_land', id: 'jump_land', name: 'Aterrissagem', category: 'Actions', loop: false },
  { slug: 'melee_combo', id: 'melee_combo', name: 'Combo desarmado', category: 'Combat', loop: false },
  { slug: 'sword_heavy_combo', id: 'sword_heavy_combo', name: 'Combo pesado com arma', category: 'Combat', loop: false }
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
    author: 'Quaternius / ACCAD Open Motion Project / The 100STYLE Dataset, via KinemIQ',
    license: 'Mixed CC0-1.0 / CC-BY-3.0 / CC-BY-4.0',
    homepage: 'https://kinemiq.app/animations/',
    description: 'Seis animações escolhidas para Carter Kane. Os arquivos-fonte são baixados dos GLBs públicos do KinemIQ e retargetados para o rig Ara por ara3d pack.',
    animations
  };
  await writeFile(path.join(buildDir, 'pack.json'), JSON.stringify(pack, null, 2) + '\n');
  await writeFile(path.join(buildDir, 'source-credits.json'), JSON.stringify({
    generatedAt: new Date().toISOString(),
    sourceLibrary: 'KinemIQ public animation library',
    sourceCreditsPage: 'https://kinemiq.app/sources/',
    licensingNote: 'KinemIQ identifies Quaternius Universal Animation Library/UAL2 as CC0-1.0, Open Motion Project (ACCAD / The Ohio State University) as CC-BY-3.0, and The 100STYLE Dataset as CC-BY-4.0. The pack declares the mixed source set; retain the per-file metadata and attribution when redistributing.',
    clips: creditRecords
  }, null, 2) + '\n');
  console.log('Pack source preparado com ' + animations.length + ' animações.');
}

async function publish() {
  await copyFile(generatedPack, finalPack);
  await copyFile(path.join(buildDir, 'source-credits.json'), finalCredits);
  await rm(buildDir, { recursive: true, force: true });
  await rm(generatedPack, { force: true });
  console.log('Pack pronto em assets/animations/carter-movement.ara-pack.json');
}

const mode = process.argv[2];
if (mode === 'prepare') await prepare();
else if (mode === 'publish') await publish();
else throw new Error('Use: node scripts/build-carter-motion-pack.mjs prepare|publish');

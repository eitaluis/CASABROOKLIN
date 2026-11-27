import * as THREE from 'three';
import { buildWorld } from './world.js?v=library-monumental-20261127b';
import { buildExterior } from './exterior.js?v=urban-horizon-continuity-20261127a';
import { buildWaterfrontEnvironment } from './waterfront-environment.js?v=urban-horizon-continuity-20261127a';
import { buildInteriorDetails } from './interior-details.js?v=library-monumental-20261127a';
import { buildLibrary } from './library.js?v=library-monumental-20261127c';
import { buildGrandSalon } from './grand-salon.js?v=great-hall-opaque-doorwall-20261127a';
import { buildTrainingRoom } from './training-room.js?v=training-room-opaque-endwalls-20261127c';
import { buildBedroom } from './bedroom.js?v=carter-bedroom-asset-first-20261127a';
import { createInventory } from './inventory.js?v=carter-combat-inputs-20261127a';
import { createMagicSystem } from './magic-system.js?v=ha-di-organic-impact-20261127a';
import { createCharacter } from './character.js?v=carter-kinemiq-accessories-20261127c';
import { createThirdPersonController } from './third-person.js?v=carter-physical-jump-sync-20261127a';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';



const canvas=document.getElementById('scene');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 820;
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,isTouchDevice?1.15:1.45));
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.18;
const scene=new THREE.Scene();scene.background=new THREE.Color(0x83949a);scene.fog=new THREE.FogExp2(0x87979a,.0048);
const camera=new THREE.PerspectiveCamera(58,window.innerWidth/window.innerHeight,.1,1200);

camera.rotation.order='YXZ';

// Pós-processamento cinematográfico compartilhado. No mobile, o AO é omitido
// e o bloom trabalha com pixel ratio menor para proteger o desempenho.
const composer = new EffectComposer(renderer);
composer.setPixelRatio(isTouchDevice ? 0.72 : Math.min(window.devicePixelRatio || 1, 1.12));
composer.setSize(window.innerWidth, window.innerHeight);
composer.addPass(new RenderPass(scene, camera));
let ssaoPass = null;
if (!isTouchDevice) {
  ssaoPass = new SSAOPass(scene, camera, window.innerWidth, window.innerHeight);
  ssaoPass.kernelRadius = 8;
  ssaoPass.minDistance = 0.004;
  ssaoPass.maxDistance = 0.075;
  composer.addPass(ssaoPass);
}
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  isTouchDevice ? 0.13 : 0.24,
  0.28,
  isTouchDevice ? 0.9 : 0.84
);
composer.addPass(bloomPass);
composer.addPass(new OutputPass());
const hemi=new THREE.HemisphereLight(0xd2e0e1,0x4a382b,1.8);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffd7a0,2.35);sun.position.set(-42,58,35);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-90;sun.shadow.camera.right=90;sun.shadow.camera.top=90;sun.shadow.camera.bottom=-90;sun.shadow.bias=-.00025;scene.add(sun);
const fill=new THREE.DirectionalLight(0x9dbbc7,.78);fill.position.set(50,24,-40);scene.add(fill);
const clock=new THREE.Clock();
const colliders=[];const animated=[];const clickable=[];const interactables=[];
function texCanvas(draw,w=512,h=512,repeatX=1,repeatY=1){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');draw(g,w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(repeatX,repeatY);t.anisotropy=8;return t}
function noise(g,w,h,count,color,alpha){g.save();g.globalAlpha=alpha;for(let i=0;i<count;i++){g.fillStyle=color;const s=Math.random()*2+0.3;g.fillRect(Math.random()*w,Math.random()*h,s,s)}g.restore()}
const limestone=texCanvas((g,w,h)=>{g.fillStyle='#b8aa8d';g.fillRect(0,0,w,h);for(let y=0;y<h;y+=84){for(let x=0;x<w;x+=128){g.fillStyle=['#c8b99a','#b9aa8b','#a99a7d','#c0b293'][Math.floor(Math.random()*4)];g.fillRect(x+(Math.random()*12),y+2,125,80);g.strokeStyle='#8d806b';g.globalAlpha=.28;g.strokeRect(x,y,126,82);g.globalAlpha=1}}noise(g,w,h,6000,'#514a3d',.10)},512,512,2.2,2);
const brick=texCanvas((g,w,h)=>{g.fillStyle='#554740';g.fillRect(0,0,w,h);for(let y=0;y<h;y+=34){let offset=(Math.floor(y/34)%2)*42;for(let x=-42;x<w;x+=84){g.fillStyle=['#724b3c','#825744','#65463a','#91614a'][Math.floor(Math.random()*4)];g.fillRect(x+offset+1,y+1,81,31);g.fillStyle='#b18468';g.globalAlpha=.18;g.fillRect(x+offset+4,y+4,74,2);g.globalAlpha=1}}noise(g,w,h,4500,'#201c1a',.12)},512,512,3,2);
const concrete=texCanvas((g,w,h)=>{g.fillStyle='#696b65';g.fillRect(0,0,w,h);noise(g,w,h,9500,'#d0c6b3',.14);for(let i=0;i<30;i++){g.strokeStyle='#343936';g.globalAlpha=.18;g.beginPath();g.moveTo(Math.random()*w,Math.random()*h);g.lineTo(Math.random()*w,Math.random()*h);g.stroke()}g.globalAlpha=1},512,512,3,3);
const cedar=texCanvas((g,w,h)=>{g.fillStyle='#503322';g.fillRect(0,0,w,h);for(let y=0;y<h;y+=42){g.fillStyle=['#71462e','#805037','#5a3828'][Math.floor(Math.random()*3)];g.fillRect(0,y,w,39);g.strokeStyle='#2c211b';g.strokeRect(0,y,w,39);for(let x=0;x<w;x+=120){g.fillStyle='#291d17';g.fillRect(x+3,y+8,3,3)}}for(let i=0;i<65;i++){g.strokeStyle='#3a2418';g.globalAlpha=.24;g.beginPath();let x=Math.random()*w,y=Math.random()*h;g.moveTo(x,y);g.bezierCurveTo(x+50,y-5,x+90,y+7,x+150,y);g.stroke()}g.globalAlpha=1},512,512,2,2);
const rust=texCanvas((g,w,h)=>{g.fillStyle='#383d3d';g.fillRect(0,0,w,h);for(let i=0;i<250;i++){g.fillStyle=['#844b30','#a46d45','#4f514b','#b28a5c'][Math.floor(Math.random()*4)];g.globalAlpha=Math.random()*.38;g.beginPath();g.arc(Math.random()*w,Math.random()*h,Math.random()*22+2,0,Math.PI*2);g.fill()}g.globalAlpha=1;noise(g,w,h,6000,'#e0c4a0',.07)},512,512,2,2);
const wood=texCanvas((g,w,h)=>{g.fillStyle='#624631';g.fillRect(0,0,w,h);for(let x=0;x<w;x+=48){g.fillStyle=x%96?'#73543b':'#503927';g.fillRect(x,0,45,h);g.strokeStyle='#302219';g.globalAlpha=.45;g.strokeRect(x,0,45,h);for(let i=0;i<16;i++){g.strokeStyle='#b48a5b';g.globalAlpha=.12;g.beginPath();g.moveTo(x+Math.random()*44,0);g.lineTo(x+Math.random()*44,h);g.stroke()}}g.globalAlpha=1},512,512,2,2);
const rugTex=texCanvas((g,w,h)=>{g.fillStyle='#26231e';g.fillRect(0,0,w,h);for(let y=0;y<h;y+=28){for(let x=0;x<w;x+=28){g.fillStyle=((x+y)/28)%2?'#8e6e43':'#3d453b';g.fillRect(x+1,y+1,26,26);g.strokeStyle='#c0a170';g.lineWidth=2;g.strokeRect(x+5,y+5,18,18);g.fillStyle='#bea16a';g.beginPath();g.arc(x+14,y+14,3,0,Math.PI*2);g.fill()}}},512,512,2,1);
const metal=new THREE.MeshStandardMaterial({color:0x596264,metalness:.82,roughness:.38,map:rust});
const gold=new THREE.MeshStandardMaterial({color:0xb99656,metalness:.72,roughness:.3});
const stone=new THREE.MeshStandardMaterial({color:0xc3b293,map:limestone,roughness:.9});
const brickMat=new THREE.MeshStandardMaterial({color:0xa0836e,map:brick,roughness:.94});
const darkBrick=new THREE.MeshStandardMaterial({color:0x6a6259,map:concrete,roughness:1});
const woodMat=new THREE.MeshStandardMaterial({color:0xb28b61,map:wood,roughness:.84});
const cedarMat=new THREE.MeshStandardMaterial({color:0x9d6b43,map:cedar,roughness:.82});
const glass=new THREE.MeshPhysicalMaterial({color:0x9bb4bd,metalness:.15,roughness:.12,transmission:.28,transparent:true,opacity:.55,side:THREE.DoubleSide});
const darkGlass=new THREE.MeshStandardMaterial({color:0x19272d,metalness:.35,roughness:.22,emissive:0x101b20,emissiveIntensity:.6});
const wallPaint=new THREE.MeshStandardMaterial({color:0x25282a,roughness:.9});
const plaster=new THREE.MeshStandardMaterial({color:0x9e927c,roughness:.95});
function box(name,pos,size,mat,collide=false,cast=true){const m=new THREE.Mesh(new THREE.BoxGeometry(size[0],size[1],size[2]),mat);m.name=name;m.position.set(...pos);m.castShadow=cast;m.receiveShadow=true;scene.add(m);if(collide)colliders.push({minX:pos[0]-size[0]/2,maxX:pos[0]+size[0]/2,minZ:pos[2]-size[2]/2,maxZ:pos[2]+size[2]/2,minY:pos[1]-size[1]/2,maxY:pos[1]+size[1]/2});return m}
function cyl(name,pos,r1,r2,h,mat,segments=24,collide=false){const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,segments),mat);m.name=name;m.position.set(...pos);m.castShadow=true;m.receiveShadow=true;scene.add(m);if(collide)colliders.push({minX:pos[0]-r1,maxX:pos[0]+r1,minZ:pos[2]-r1,maxZ:pos[2]+r1,minY:pos[1]-h/2,maxY:pos[1]+h/2});return m}
function line(points,mat,r=.06){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,Math.max(24,points.length*5),r,6,false),mat);scene.add(mesh);return mesh}
function canvasSign(text,color='#d2b276'){const t=texCanvas((g,w,h)=>{g.clearRect(0,0,w,h);g.fillStyle='rgba(8,15,16,.86)';g.fillRect(0,0,w,h);g.strokeStyle=color;g.lineWidth=5;g.strokeRect(8,8,w-16,h-16);g.fillStyle=color;g.textAlign='center';g.font='bold 34px Cinzel,serif';g.fillText(text,w/2,h/2+12)},512,128);return new THREE.MeshBasicMaterial({map:t,transparent:true,side:THREE.DoubleSide})}
function glyphPanel(x,y,z,rotY=0,scale=1){const c=document.createElement('canvas');c.width=256;c.height=512;const g=c.getContext('2d');g.clearRect(0,0,256,512);g.fillStyle='#b08b4f';g.globalAlpha=.9;for(let i=0;i<11;i++){let yy=18+i*43;g.strokeStyle='#c9a568';g.lineWidth=3;g.beginPath();g.moveTo(16,yy+4);g.lineTo(240,yy+4);g.stroke();g.font='30px serif';g.fillText(['𓂀','𓇳','𓆣','𓅓','𓊹','𓈖','𓉐','𓃭'][i%8],24,yy+35);g.fillText(['𓋹','𓆑','𓏏','𓄿','𓊖','𓎛'][i%6],112,yy+35);g.fillText(['𓁹','𓅱','𓇋','𓂋','𓆓'][i%5],190,yy+35)}const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;const m=new THREE.Mesh(new THREE.PlaneGeometry(1.05*scale,2.1*scale),new THREE.MeshBasicMaterial({map:tex,transparent:true,side:THREE.DoubleSide,opacity:.92}));m.position.set(x,y,z);m.rotation.y=rotY;scene.add(m);return m}
function addWindow(x,y,z,w,h,face='front'){const group=new THREE.Group();group.position.set(x,y,z);const side=face==='side';const back=face==='back';if(!side){const depth=back?-.02:.02;box('steel window frame',[x,y,z],[w+.28,h+.28,.18],metal,false);const pane=new THREE.Mesh(new THREE.PlaneGeometry(w,h),darkGlass);pane.position.z=back?-.105:.105;if(back)pane.rotation.y=Math.PI;group.add(pane);for(let xx of [-w/2,0,w/2])box('mullion',[x+xx,y,z+depth],[.075,h,.16],gold,false);for(let yy of [-h/2,h/2])box('mullion',[x,y+yy,z+depth],[w,.07,.16],metal,false);if(back)group.rotation.y=Math.PI;}else{box('steel window frame',[x,y,z],[.18,h,w+.28],metal,false);const pane=new THREE.Mesh(new THREE.PlaneGeometry(w,h),darkGlass);pane.rotation.y=Math.PI/2;pane.position.x=.1;group.add(pane);for(let zz of [-w/2,0,w/2])box('mullion',[x+.02,y,z+zz],[.16,h,.07],gold,false);for(let yy of [-h/2,h/2])box('mullion',[x+.02,y+yy,z],[.16,.07,w],metal,false)}scene.add(group);return group}
function makeGraffiti(x,y,z,rot=0){const c=document.createElement('canvas');c.width=512;c.height=256;const g=c.getContext('2d');g.clearRect(0,0,512,256);g.save();g.translate(256,128);g.rotate(-.12);g.font='italic 900 100px sans-serif';g.lineWidth=14;g.strokeStyle='#182022';g.strokeText('EAST',-210,-4);g.fillStyle='#bf815e';g.fillText('EAST',-210,-4);g.font='bold 46px sans-serif';g.fillStyle='#d5b16b';g.fillText('RIVER',-115,62);g.restore();const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;const m=new THREE.Mesh(new THREE.PlaneGeometry(5.3,2.65),new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false}));m.position.set(x,y,z);m.rotation.y=rot;scene.add(m)}
function addStatue(x,y,z,variant=0){const body=cyl('estátua de cerâmica',[x,y+1,z],.42,.7,2.0,new THREE.MeshStandardMaterial({color:variant?0xb7a486:0x8e8878,roughness:.82}),12);const head=cyl('cabeça de estátua',[x,y+2.18,z],.38,.34,.55,stone,12);const face=box('face da estátua',[x,y+2.15,z+.28],[.38,.25,.12],gold);const plinth=box('pedestal de pedra',[x,y+.25,z],[1.25,.5,1.25],stone);cyl('coroa ritual',[x,y+2.57,z],.44,.28,.2,gold,12);return body}
function addColumn(x,z,y0,height,capital=true){cyl('coluna de calcário',[x,y0+height/2,z],.72,.78,height,stone,20,true);for(let y=y0+.3;y<y0+height-.2;y+=.42){const tor=cyl('anel esculpido',[x,y,z],.735,.735,.055,gold,20);tor.material=new THREE.MeshStandardMaterial({color:0xa88d62,metalness:.25,roughness:.68})}if(capital){cyl('capitel',[x,y0+height-.25,z],1.05,.75,.5,stone,16);const slab=box('ábaco',[x,y0+height,z],[2.05,.28,2.05],stone);for(let a=0;a<8;a++){const g=glyphPanel(x-1.15+(a%4)*.72,y0+height*.54,z+1.0,0,.48);}}}
function addRoomLabel(text,x,y,z){const mat=canvasSign(text);const p=new THREE.Mesh(new THREE.PlaneGeometry(3.4,.82),mat);p.position.set(x,y,z);scene.add(p)}

// Montagem modular do cenário.
const world = buildWorld({
  THREE, scene, colliders, animated, box, cyl, line, texCanvas,
  addWindow, glyphPanel, addStatue, addColumn, makeGraffiti, addRoomLabel,
  canvasSign, rugTex, limestone, concrete, metal, gold, stone, brickMat, darkBrick, woodMat,
  cedarMat, darkGlass, plaster
});
const { zones, groundSurfaces, water, mansionRevealGroup, magicalInteriorGroup } = world;
let revealCameraCue=()=>{};
let mansionPerceived=false;
const exterior = buildExterior({
  THREE, scene, world, interactables, isTouchDevice,
  onReveal:()=>{mansionPerceived=true;revealCameraCue();}
});
const waterfrontEnvironment = buildWaterfrontEnvironment({
  THREE, scene, isTouchDevice, brickTexture: brick
});

// Interior passes are shared by desktop and mobile.
buildInteriorDetails({ THREE, scene:magicalInteriorGroup, interactables });
const libraryScene = buildLibrary({ THREE, scene:magicalInteriorGroup, interactables, colliders, limestone });
const grandSalon = buildGrandSalon({
  THREE, scene:magicalInteriorGroup, animated, camera, isTouchDevice, colliders, interactables, groundSurfaces
});
const fireLight = grandSalon.fireLight;
const bedroomScene = buildBedroom({
  THREE, scene:magicalInteriorGroup, renderer, isTouchDevice,
  colliders, groundSurfaces, interactables, floorY:zones.bedroom.base
});

// Estado de jogo global: a vida persiste entre ambientes e a energia recarrega em tempo real.
const playerVitals = { health: 100, maxHealth: 100, energy: 100, maxEnergy: 100, energyRegen: 8 };
const damageOverlay = document.createElement('div');
damageOverlay.id = 'damageOverlay';
damageOverlay.style.cssText = [
  'position:fixed','inset:0','z-index:9','pointer-events:none','opacity:0',
  'background:radial-gradient(ellipse at center,rgba(80,0,0,0) 38%,rgba(155,5,5,.18) 65%,rgba(105,0,0,.78) 100%)',
  'transition:opacity .16s ease-out'
].join(';');
document.body.appendChild(damageOverlay);
let damageFlashTimer = null;
let damageFadeTimer = null;
function flashPlayerDamage() {
  clearTimeout(damageFlashTimer);
  clearTimeout(damageFadeTimer);
  damageOverlay.style.opacity = '0.92';
  damageFlashTimer = setTimeout(() => { damageOverlay.style.opacity = '0.28'; }, 100);
  damageFadeTimer = setTimeout(() => { damageOverlay.style.opacity = '0'; }, 520);
}
function handlePlayerHit(hit) {
  const damage = Math.round((playerVitals.maxHealth / (hit.maxHealth || 5)) * (hit.damage || 1));
  const previousHealth = playerVitals.health;
  playerVitals.health = Math.max(0, playerVitals.health - damage);
  character.setInjured?.(playerVitals.health <= 50);
  const toAttacker = hit.attacker && hit.playerPosition
    ? hit.attacker.clone().sub(hit.playerPosition).setY(0).normalize()
    : new THREE.Vector3(0, 0, 1);
  const facing = controller.getForward().setY(0).normalize();
  const right = new THREE.Vector3().crossVectors(facing, new THREE.Vector3(0, 1, 0)).normalize();
  const frontDot = toAttacker.dot(facing);
  const sideDot = toAttacker.dot(right);
  const hitDirection = Math.abs(frontDot) >= Math.abs(sideDot)
    ? (frontDot >= 0 ? 'front' : 'back')
    : (sideDot >= 0 ? 'right' : 'left');
  character.playReaction?.(hitDirection);
  controller.triggerHit?.();
  flashPlayerDamage();
  if (previousHealth > 50 && playerVitals.health <= 50) {
    toast('Carter está ferido. Os movimentos ficam mais pesados.');
  }
}

const trainingRoom = buildTrainingRoom({
  THREE, scene:magicalInteriorGroup, zones, groundSurfaces, colliders, interactables, animated,
  onPlayerHit: handlePlayerHit
});

const trainingHud = document.createElement('aside');
trainingHud.id = 'trainingHud';
trainingHud.hidden = true;
trainingHud.setAttribute('aria-live', 'polite');
trainingHud.style.cssText = [
  'position:fixed','top:158px','left:50%','transform:translateX(-50%)',
  'z-index:9','display:flex','align-items:center','gap:16px',
  'padding:9px 14px','border:1px solid rgba(208,173,105,.52)',
  'background:rgba(8,15,17,.84)','backdrop-filter:blur(12px)',
  'box-shadow:0 8px 28px rgba(0,0,0,.32)','color:#ead9b6',
  'font:600 10px DM Sans,sans-serif','letter-spacing:.12em',
  'white-space:nowrap','pointer-events:none'
].join(';');
const trainingHudTitle = document.createElement('span');
trainingHudTitle.textContent = 'PROVA DE TREINAMENTO';
trainingHudTitle.style.color = '#cda96b';
const trainingHudInfo = document.createElement('span');
trainingHudInfo.style.color = '#c5c7bd';
trainingHud.append(trainingHudTitle, trainingHudInfo);
document.body.appendChild(trainingHud);
const trainingHudStyle = document.createElement('style');
trainingHudStyle.textContent = [
  '#trainingHud[hidden]{display:none!important}',
  '@media(max-width:900px) and (pointer:coarse){#trainingHud{top:112px!important;padding:6px 9px!important;gap:8px!important;font-size:8px!important;letter-spacing:.06em!important}#trainingHud strong{font-size:12px!important}}',
  '@media(max-width:560px){#trainingHud{max-width:calc(100vw - 24px);white-space:normal!important;justify-content:center;flex-wrap:wrap}}'
].join('');
document.head.appendChild(trainingHudStyle);

// Barras persistentes de vitalidade e energia, usadas em todos os ambientes.
const vitalsHud = document.createElement('aside');
vitalsHud.id = 'playerVitalsHud';
vitalsHud.style.cssText = [
  'position:fixed','z-index:8','top:82px','left:50%','transform:translateX(-50%)',
  'width:min(350px,calc(100vw - 36px))','display:flex','flex-direction:column','gap:8px',
  'padding:10px 13px','border:1px solid rgba(208,173,105,.42)',
  'background:rgba(8,15,17,.78)','backdrop-filter:blur(12px)',
  'box-shadow:0 7px 24px rgba(0,0,0,.28)','pointer-events:none'
].join(';');
function makeVitalBar(label, id, color) {
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;align-items:center;gap:9px;min-width:0';
  const name = document.createElement('span');
  name.textContent = label;
  name.style.cssText = 'width:76px;flex:none;color:#d8c9a9;font:600 8px DM Sans,sans-serif;letter-spacing:.14em';
  const track = document.createElement('div');
  track.style.cssText = 'height:7px;flex:1;min-width:30px;overflow:hidden;border:1px solid rgba(235,220,190,.22);background:rgba(0,0,0,.48);border-radius:8px';
  const fill = document.createElement('div');
  fill.id = id;
  fill.style.cssText = 'width:100%;height:100%;border-radius:8px;background:' + color + ';transition:width .18s ease';
  track.appendChild(fill);
  const value = document.createElement('span');
  value.id = id + 'Value';
  value.style.cssText = 'width:31px;flex:none;text-align:right;color:#efe4cc;font:600 9px DM Sans,sans-serif;font-variant-numeric:tabular-nums';
  value.textContent = '100';
  row.append(name, track, value);
  vitalsHud.appendChild(row);
  return { fill, value };
}
const healthBar = makeVitalBar('VITALIDADE', 'healthFill', 'linear-gradient(90deg,#8e2023,#df5147)');
const energyBar = makeVitalBar('ENERGIA', 'energyFill', 'linear-gradient(90deg,#126b79,#6bd0d2)');
const vitalsHudStyle = document.createElement('style');
vitalsHudStyle.textContent = [
  '@media(max-width:900px) and (pointer:coarse){#playerVitalsHud{top:55px!important;width:min(300px,calc(100vw - 250px));padding:7px 9px;gap:6px}#playerVitalsHud span{font-size:7px!important}}',
  '@media(max-width:560px){#playerVitalsHud{top:8px!important;left:50%!important;width:min(260px,calc(100vw - 24px));padding:6px 8px}}'
].join('');
document.head.appendChild(vitalsHudStyle);
document.body.appendChild(vitalsHud);

function updateVitalsHud(dt) {
  playerVitals.energy = Math.min(playerVitals.maxEnergy, playerVitals.energy + playerVitals.energyRegen * dt);
  const healthPercent = Math.max(0, playerVitals.health / playerVitals.maxHealth * 100);
  const energyPercent = Math.max(0, playerVitals.energy / playerVitals.maxEnergy * 100);
  healthBar.fill.style.width = healthPercent + '%';
  energyBar.fill.style.width = energyPercent + '%';
  healthBar.value.textContent = String(Math.round(healthPercent));
  energyBar.value.textContent = String(Math.round(energyPercent));
  healthBar.fill.style.filter = playerVitals.health <= 25 ? 'brightness(.78) saturate(1.3)' : 'none';
}

const interactionPrompt=document.createElement('aside');
interactionPrompt.id='interactionPrompt'; interactionPrompt.hidden=true;
interactionPrompt.setAttribute('aria-live','polite');
interactionPrompt.style.cssText=[
  'position:fixed','left:50%','bottom:104px','transform:translateX(-50%)','z-index:10',
  'max-width:min(720px,calc(100vw - 32px))','padding:11px 17px',
  'border:1px solid rgba(208,173,105,.62)','background:rgba(8,15,17,.9)',
  'backdrop-filter:blur(14px)','box-shadow:0 10px 34px rgba(0,0,0,.42)',
  'color:#f0e4ca','font:600 11px/1.55 DM Sans,sans-serif',
  'letter-spacing:.055em','text-align:center','pointer-events:none'
].join(';');
document.body.appendChild(interactionPrompt);
const interactionPromptStyle=document.createElement('style');
interactionPromptStyle.textContent=[
  '#interactionPrompt[hidden]{display:none!important}',
  '@media(max-width:900px) and (pointer:coarse){#interactionPrompt{bottom:140px!important;max-width:calc(100vw - 32px);padding:8px 11px;font-size:9px;line-height:1.45}}',
  '@media(max-height:430px) and (pointer:coarse){#interactionPrompt{bottom:100px!important;max-width:calc(100vw - 180px);font-size:8px;padding:6px 8px}}'
].join('');
document.head.appendChild(interactionPromptStyle);

function toast(message) {
  const element = document.getElementById('toast');
  element.textContent = message;
  element.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => element.classList.remove('show'), 2600);
}

const character = await createCharacter({
  scene,
  ground: groundSurfaces,
  onModeChange: (mode) => {
    const status = document.getElementById('status');
    if (status) status.innerHTML = 'TERCEIRA PESSOA<br>' + mode.toUpperCase();
  }
});
character.model.position.set(...zones.dock.pos);
character.setInjured?.(playerVitals.health <= 50);
if (character.human) character.human.reset();

const controller = createThirdPersonController({
  THREE, camera, canvas, character, zones, colliders,
  stairRamps: grandSalon.stairRamps,
  walkableCurves: libraryScene.stairPaths,
  walkablePlatforms: [
    ...(grandSalon.walkablePlatforms || []),
    ...(trainingRoom.walkablePlatforms || []),
    { minX: 22.2, maxX: 27.8, minZ: 10.2, maxZ: 15.8, height: 13.05 },
    { minX: -0.2, maxX: 25.2, minZ: 10.7, maxZ: 13.5, height: 13.05 },
    { minX: -14.4, maxX: 14.4, minZ: -10.4, maxZ: 9.7, height: 13.175 }
  ],
  zonePortals: [
    ...(trainingRoom.zonePortals || []),
    { from:'dock', to:'hall', axis:'z', direction:'lt', threshold:11.8, rangeMin:-2.15, rangeMax:2.15 },
    { from:'hall', to:'dock', axis:'z', direction:'gt', threshold:12.15, rangeMin:-2.15, rangeMax:2.15 }
  ],
  spiralStair: world.spiralStair,
  onZoneChange: (name, zone) => {
    // A casca externa invisível escreve profundidade para ocultar a mansão do lado de fora.
    // Dentro dos cômodos, essa máscara deve ser desligada para não encobrir as paredes internas.
    mansionRevealGroup.visible = name === 'dock';
    magicalInteriorGroup.visible = name !== 'dock';
    document.getElementById('zoneName').textContent = zone.label;
    document.querySelectorAll('.nav button').forEach(button =>
      button.classList.toggle('active', button.dataset.zone === name)
    );
    const notices = {
      dock: 'Margem do Brooklyn — do lado de fora, o que se vê é apenas o antigo galpão industrial.',
      hall: 'Grande Salão — quatro alturas, três níveis de balcões e Tot ao centro.',
      library: 'Biblioteca subterrânea — câmara circular escavada na rocha.',
      bedroom: 'Quarto de Carter — suíte moderna com kitchenette, banheiro e deck panorâmico sobre o East River.',
      training: 'Sala de Treinamento — quadra, cestas solares de Rá e desafios mágicos.'
    };
    toast(notices[name] || zone.label);
  }
});
revealCameraCue=()=>controller.focusOnRoof();

const magicSystem = createMagicSystem({
  scene, camera, character, controller, trainingRoom,
  canSpendEnergy: (amount) => playerVitals.energy >= amount,
  spendEnergy: (amount) => {
    if (playerVitals.energy < amount) return false;
    playerVitals.energy = Math.max(0, playerVitals.energy - amount);
    return true;
  },
  spellCost: 30
});
const haDiButton = document.getElementById('haDiButton');
function castHaDi() {
  const result = magicSystem.castHaDi();
  if (result?.message) toast(result.message);
}
haDiButton?.addEventListener('click', event => {
  event.preventDefault();
  castHaDi();
});


const HORUS_AVATAR_COST = 40;
const horusAvatarButton = document.getElementById('horusAvatarButton');
function toggleHorusAvatar() {
  if (character.isHorusAvatarActive) {
    character.setHorusAvatarActive(false);
    toast('A manifestação dourada de Hórus se desfaz ao redor de Carter.');
    return;
  }
  if (playerVitals.energy < HORUS_AVATAR_COST) {
    toast('Energia insuficiente para invocar o Avatar de Hórus. São necessários 40 pontos.');
    return;
  }
  playerVitals.energy = Math.max(0, playerVitals.energy - HORUS_AVATAR_COST);
  character.setHorusAvatarActive(true);
  toast('O Avatar de Combate de Hórus envolve Carter. Seus movimentos são compartilhados.');
}
horusAvatarButton?.addEventListener('click', event => {
  event.preventDefault();
  toggleHorusAvatar();
});

const inventory = createInventory({
  THREE, character,
  setControlsLocked: controller.setLocked,
  onUse: (weapon) => {
    const practice = trainingRoom.getStatus();
    if (weapon === 'staff' && practice.targetPracticeActive && !practice.challengeActive) {
      const spellCost = 12;
      if (playerVitals.energy < spellCost) {
        toast('Energia insuficiente para lançar o orbe de treino.');
        return;
      }
      playerVitals.energy = Math.max(0, playerVitals.energy - spellCost);
    }
    const result = trainingRoom.onWeaponUse({
      weapon,
      position: controller.getPosition(),
      forward: controller.getForward(),
      zone: controller.zone
    });
    if (result) toast(result);
  }
});

let lookingAtInspectedObject = false;
let activeSeat = null;

function interactWithNearby() {
  // While seated, the same interaction command plays Stand up and returns Carter
  // to the clear floor outside the curved bench.
  if (activeSeat) {
    const seat = activeSeat;
    const started = character.standFromSeat?.(() => {
      controller.placeAt(seat.exitPosition, seat.exitFacing);
      controller.setLocked(false);
      activeSeat = null;
      toast('Carter se levanta do banco.');
    });
    if (!started) {
      controller.placeAt(seat.exitPosition, seat.exitFacing);
      controller.setLocked(false);
      activeSeat = null;
      toast('Carter voltou a ficar de pé.');
    } else {
      toast('Carter está se levantando. Aguarde a animação terminar.');
    }
    return;
  }

  const p = controller.getPosition();
  let nearest = null;
  let nearestDistance = Infinity;
  for (const item of interactables) {
    const distance = p.distanceTo(item.position);
    if (distance <= item.radius && distance < nearestDistance) {
      nearest = item;
      nearestDistance = distance;
    }
  }
  if (!nearest) {
    character.lookAt?.(null);
    lookingAtInspectedObject = false;
    toast('Não há nenhum objeto próximo para examinar.');
    return;
  }

  if (nearest.kind === 'seat') {
    const originalPosition = controller.getPosition().clone();
    const originalForward = controller.getForward();
    const placed = controller.placeAt(nearest.sitPosition, nearest.sitFacing);
    const started = placed && character.sitDown?.();
    if (!started) {
      controller.placeAt(originalPosition, originalPosition.clone().add(originalForward));
      toast('As animações de sentar não estão disponíveis neste carregamento do Carter.');
      return;
    }
    activeSeat = nearest;
    controller.setLocked(true);
    character.lookAt?.(nearest.sitFacing, { amount: 0.58, smoothing: 0.34 });
    lookingAtInspectedObject = false;
    toast('Carter se acomoda no banco. Pressione E ou INTERAGIR novamente para levantar.');
    return;
  }

  // The same Ara rig plays a short contextual gesture while looking at Thoth.
  character.lookAt?.(nearest.position, { amount: 0.82, smoothing: 0.42 });
  lookingAtInspectedObject = true;
  if (nearest.action) {
    character.playAction?.(nearest.action, { fade: 0.22, interruptOnMovement: true });
  }
  const result = typeof nearest.onInteract === 'function' ? nearest.onInteract() : null;
  toast(result || nearest.description || nearest.label || nearest.name);
}

window.addEventListener('keydown', event => {
  // Atalho 2: entra no Grande Salão a partir de qualquer ambiente e sempre
  // reposiciona Carter na zona livre em frente ao conjunto de assentos de Thoth.
  if ((event.code === 'Digit2' || event.code === 'Numpad2') && !event.repeat &&
      !document.activeElement?.matches('input,textarea,[contenteditable="true"]')) {
    controller.teleport('hall');
    document.getElementById('startscreen').classList.add('hidden');
  }
  if (event.code === 'KeyE' && !event.repeat && document.getElementById('startscreen').classList.contains('hidden')) {
    interactWithNearby();
  }
  if (event.code === 'KeyG' && !event.repeat && document.getElementById('startscreen').classList.contains('hidden')) {
    if (controller.zone === 'training') castHaDi();
  }
});

// Captura H antes do controlador e da câmera, inclusive com pointer lock ativo.
document.addEventListener('keydown', event => {
  const isHorusKey = event.code === 'KeyH' || String(event.key || '').toLowerCase() === 'h';
  if (!isHorusKey || event.repeat || event.ctrlKey || event.altKey || event.metaKey) return;
  if (!document.getElementById('startscreen').classList.contains('hidden')) return;
  if (document.activeElement?.matches('input,textarea,[contenteditable="true"]')) return;
  event.preventDefault();
  event.stopPropagation();
  toggleHorusAvatar();
}, true);
document.getElementById('interactButton')?.addEventListener('click', interactWithNearby);

document.querySelectorAll('.nav button').forEach(button => {
  button.addEventListener('click', () => {
    controller.teleport(button.dataset.zone);
    document.getElementById('startscreen').classList.add('hidden');
  });
});
document.getElementById('enter').addEventListener('click', () => {
  document.getElementById('startscreen').classList.add('hidden');
  controller.capturePointer();
});
canvas.addEventListener('click', () => {
  if (document.getElementById('startscreen').classList.contains('hidden')) controller.capturePointer();
});

const map = document.getElementById('map');
const mapContext = map.getContext('2d');
function drawMap() {
  const g = mapContext;
  g.clearRect(0, 0, 264, 216);
  g.fillStyle = '#172326'; g.fillRect(0, 0, 264, 216);
  g.strokeStyle = 'rgba(208,173,105,.24)'; g.lineWidth = 1;
  for (let x = 18; x < 264; x += 24) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 216); g.stroke(); }
  for (let y = 12; y < 216; y += 24) { g.beginPath(); g.moveTo(0, y); g.lineTo(264, y); g.stroke(); }
  g.fillStyle = '#34545a'; g.fillRect(184, 0, 80, 216);
  g.fillStyle = '#667477'; g.fillRect(252, 0, 12, 216);
  g.fillStyle = '#b89a68'; g.fillRect(183, 103, 72, 3);
  g.fillStyle = '#d7c18e'; g.fillRect(193, 96, 2, 17); g.fillRect(243, 96, 2, 17);
  g.fillStyle = '#d7c18e'; g.font = '7px DM Sans'; g.fillText('WILLIAMSBURG BR.', 185, 91);
  g.fillStyle = '#d4d8d4'; g.font = '7px DM Sans'; g.fillText('MANHATTAN', 214, 208);
  g.fillStyle = '#738178'; g.fillRect(72, 70, 112, 104);
  g.fillStyle = '#d7c18e'; g.font = '9px DM Sans';
  g.fillText('GALPÃO', 77, 65);
  if (mansionPerceived || magicalInteriorGroup.visible) {
    g.fillStyle = '#b29a72'; g.fillRect(93, 91, 67, 62);
    g.strokeStyle = '#dfc38c'; g.strokeRect(93, 91, 67, 62);
    g.fillStyle = '#d7c18e'; g.font = '8px DM Sans';
    g.fillText('MANSÃO', 111, 87);
  }
  if (magicalInteriorGroup.visible) {
    g.fillStyle = '#9a835e'; g.fillRect(111, 107, 31, 29);
  }
  g.fillStyle = '#9eb5b3'; g.fillRect(183, 0, 2, 216);
  g.fillStyle = '#9da8a1'; g.font = '8px DM Sans'; g.fillText('EAST RIVER', 190, 18);
  g.fillStyle = '#c5a66b'; g.beginPath(); g.arc(171, 140, 3, 0, Math.PI * 2); g.fill();
  g.fillText('PÍER', 158, 130);

  const p = controller.getPosition();
  const mx = THREE.MathUtils.clamp(129 + p.x * 1.25, 8, 256);
  const my = THREE.MathUtils.clamp(120 + (p.z - 4) * 1.55, 8, 208);
  g.fillStyle = '#f0d7a0'; g.beginPath(); g.arc(mx, my, 5.5, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#111719'; g.lineWidth = 2; g.stroke();
  g.fillStyle = '#e7dec9'; g.font = '8px DM Sans'; g.fillText('VOCÊ', mx + 8, my + 3);
}

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.04);
  const movementState = controller.update(dt);
  character.updateHorusAvatar?.(dt);
  if (lookingAtInspectedObject && movementState?.speed > 0.25) {
    character.lookAt?.(null);
    lookingAtInspectedObject = false;
  }
  const time = clock.elapsedTime;
  for (const item of animated) {
    if (item.spin) item.obj.rotation.z = time * 0.18;
    if (item.particle) {
      const rise = (time * 0.78 + item.phase) % 1;
      item.obj.position.y = (item.baseY ?? item.obj.position.y) + rise * 0.9;
      item.obj.position.x = (item.baseX ?? item.obj.position.x) + Math.sin(time * 2.3 + item.phase) * 0.075;
      item.obj.position.z = (item.baseZ ?? item.obj.position.z) + Math.cos(time * 1.9 + item.phase) * 0.045;
      item.obj.material.opacity = 0.78 * (1 - rise);
      item.obj.scale.setScalar(0.55 + (1 - rise) * 0.7);
    }
    if (item.fire) {
      const flicker = 0.5 + 0.5 * Math.sin(time * 8.5 + item.phase);
      item.obj.position.y = item.baseY + Math.sin(time * 5.7 + item.phase) * 0.045;
      item.obj.scale.y = (item.baseScaleY ?? 1) * (0.88 + 0.2 * flicker);
      item.obj.rotation.z = (item.baseRotationZ ?? 0) + Math.sin(time * 6.2 + item.phase) * 0.055;
    }
  }
  if (fireLight) fireLight.intensity = 4.25 + Math.sin(time * 8.7) * 0.72;
  grandSalon.update?.(time);
  bedroomScene.update?.(time, dt);
  const libraryMessage = libraryScene.update(time, dt);
  if (libraryMessage) toast(libraryMessage);
  const trainingMessage = trainingRoom.update(time, dt, controller.getPosition(), controller.getForward());
  if (trainingMessage) toast(trainingMessage);
  // Atualiza a magia depois da simulação da sala: os 10 s dos fragmentos começam no impacto real.
  magicSystem.update(dt);
  updateVitalsHud(dt);
  const trainingStatus = trainingRoom.getStatus();
  let nearbyTrainingItem=null, nearbyTrainingDistance=Infinity;
  if(controller.zone==='training' || controller.zone==='library' || controller.zone==='bedroom'){
    const player=controller.getPosition();
    for(const item of interactables){
      const distance=player.distanceTo(item.position);
      if(distance<=item.radius&&distance<nearbyTrainingDistance){
        nearbyTrainingItem=item;nearbyTrainingDistance=distance;
      }
    }
  }
  if(nearbyTrainingItem){
    let prompt=typeof nearbyTrainingItem.prompt==='function'?nearbyTrainingItem.prompt():nearbyTrainingItem.prompt;
    if(!prompt)prompt=nearbyTrainingItem.label||nearbyTrainingItem.name;
    if(isTouchDevice)prompt=String(prompt).replaceAll('E / INTERAGIR','TOQUE · INTERAGIR').replaceAll('E ·','TOQUE ·').replaceAll('F / USAR','BOTÃO USAR');
    interactionPrompt.textContent=prompt;
    interactionPrompt.hidden=false;
  }else{
    interactionPrompt.hidden=true;
  }
  if (haDiButton) {
    const showHaDi = controller.zone === 'training' && trainingStatus.challengeActive;
    haDiButton.hidden = !showHaDi;
    haDiButton.disabled = !showHaDi || !magicSystem.canCastHaDi();
    haDiButton.title = haDiButton.disabled
      ? (playerVitals.energy < 30 ? 'Energia insuficiente: HA-DI custa 30 pontos.' : 'Fique de frente para um Shabti desperto, entre 3,5 e 12,5 metros.')
      : 'Conjurar HA-DI · custo 30 de energia';
  }
  if (horusAvatarButton) {
    const avatarActive = character.isHorusAvatarActive;
    horusAvatarButton.textContent = avatarActive ? 'RETIRAR' : 'HÓRUS';
    horusAvatarButton.setAttribute('aria-pressed', avatarActive ? 'true' : 'false');
    horusAvatarButton.setAttribute('aria-label', avatarActive ? 'Desativar Avatar de Hórus' : 'Invocar Avatar de Hórus');
    horusAvatarButton.disabled = !avatarActive && playerVitals.energy < HORUS_AVATAR_COST;
    horusAvatarButton.title = avatarActive
      ? 'Desativar o Avatar de Hórus'
      : 'Invocar Avatar de Hórus · custo 40 de energia';
  }
  const showTrainingHud = controller.zone === 'training'
    && (trainingStatus.challengeActive || trainingStatus.targetPracticeActive);
  trainingHud.hidden = !showTrainingHud;
  if (showTrainingHud) {

    trainingHudInfo.textContent = trainingStatus.challengeActive
      ? 'SHABTI · ' + trainingStatus.shabtiRemaining + '/' + trainingStatus.totalShabti + ' · G / HA-DI'
      : 'ALVOS · ' + trainingStatus.targetHits + ' ACERTOS';
  }
  inventory.update(dt);
  exterior.update(dt, time);
  drawMap();
  composer.render();
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isTouchDevice ? 1.15 : 1.45));
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setPixelRatio(isTouchDevice ? 0.72 : Math.min(window.devicePixelRatio || 1, 1.12));
  composer.setSize(window.innerWidth, window.innerHeight);
});

try {
  await magicSystem.prepare(renderer);
  document.getElementById('zoneName').textContent = zones.dock.label;
  document.getElementById('status').innerHTML = 'TERCEIRA PESSOA<br>' + character.locomotionName.toUpperCase();
  document.documentElement.dataset.appReady = 'true';
  if (window.__brooklynWatchdog) clearTimeout(window.__brooklynWatchdog);
  document.getElementById('loading').classList.add('done');
  animate();
} catch (error) {
  document.getElementById('loading').textContent = 'ERRO AO INICIAR O AMBIENTE: ' + error.message;
  console.error(error);
}

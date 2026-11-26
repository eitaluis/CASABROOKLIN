import * as THREE from 'three';
import { buildWorld } from './world.js?v=grand-salon-circulation-20261126a';
import { buildExterior } from './exterior.js?v=brooklyn-waterfront-scale-20261126a';
import { buildInteriorDetails } from './interior-details.js?v=interiors-nut-geb-20261126c';
import { buildGrandSalon } from './grand-salon.js?v=grand-salon-circulation-20261126a';
import { createInventory } from './inventory.js?v=weapons-inventory-20261126a';
import { createCharacter } from './character.js?v=carter-ara-approved-restore-20261126d';
import { createThirdPersonController } from './third-person.js?v=grand-salon-stair-navigation-20261126c';
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
const { zones, groundSurfaces, water } = world;
const exterior = buildExterior({ THREE, scene, world, interactables, isTouchDevice });

// Interior passes are shared by desktop and mobile.
buildInteriorDetails({ THREE, scene });
const grandSalon = buildGrandSalon({
  THREE, scene, animated, camera, isTouchDevice, colliders, interactables, groundSurfaces
});
const fireLight = grandSalon.fireLight;

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
if (character.human) character.human.reset();

const inventory = createInventory({ THREE, character });

const controller = createThirdPersonController({
  THREE, camera, canvas, character, zones, colliders,
  stairRamps: grandSalon.stairRamps,
  walkablePlatforms: grandSalon.walkablePlatforms,
  onZoneChange: (name, zone) => {
    document.getElementById('zoneName').textContent = zone.label;
    document.querySelectorAll('.nav button').forEach(button =>
      button.classList.toggle('active', button.dataset.zone === name)
    );
    const notices = {
      dock: 'Margem do Brooklyn — o East River e Manhattan ficam além do cais; a mansão está oculta sobre o armazém.',
      hall: 'Grande Salão — quatro alturas, três níveis de balcões e Tot ao centro.',
      library: 'Biblioteca subterrânea — câmara circular escavada na rocha.',
      bedroom: 'Ala residencial — reconstrução interpretativa dos quartos.'
    };
    toast(notices[name] || zone.label);
  }
});

function interactWithNearby() {
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
  if (nearest) {
    const result = typeof nearest.onInteract === 'function' ? nearest.onInteract() : null;
    toast(result || nearest.description || nearest.label || nearest.name);
  } else {
    toast('Não há nenhum objeto próximo para examinar.');
  }
}
window.addEventListener('keydown', event => {
  if (event.code === 'KeyE' && !event.repeat && document.getElementById('startscreen').classList.contains('hidden')) {
    interactWithNearby();
  }
});
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
  g.fillStyle = '#b29a72'; g.fillRect(93, 91, 67, 62);
  g.strokeStyle = '#dfc38c'; g.strokeRect(93, 91, 67, 62);
  g.fillStyle = '#9a835e'; g.fillRect(111, 107, 31, 29);
  g.fillStyle = '#d7c18e'; g.font = '9px DM Sans';
  g.fillText('ARMAZÉM', 77, 65); g.fillText('CASA', 111, 87);
  g.fillStyle = '#9eb5b3'; g.fillRect(183, 0, 2, 216);
  g.fillStyle = '#9da8a1'; g.font = '8px DM Sans'; g.fillText('EAST RIVER', 190, 18);
  g.fillStyle = '#c5a66b'; g.beginPath(); g.arc(229, 42, 3, 0, Math.PI * 2); g.fill();
  g.fillText('PÍER', 218, 34);

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
  controller.update(dt);
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

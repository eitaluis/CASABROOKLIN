export function buildWorld(ctx){
 const {THREE,scene,colliders,animated,box,cyl,line,texCanvas,addWindow,glyphPanel,addStatue,addColumn,makeGraffiti,addRoomLabel,canvasSign,rugTex,limestone,concrete,metal,gold,stone,brickMat,darkBrick,woodMat,cedarMat,darkGlass,plaster} = ctx;
 const groundSurfaces=[];

 // Caixas invisíveis simplificadas para a primeira camada de colisão.
 const registerCollider = (x,y,z,width,height,depth) => {
   colliders.push({
     minX:x-width/2,maxX:x+width/2,
     minY:y-height/2,maxY:y+height/2,
     minZ:z-depth/2,maxZ:z+depth/2
   });
 };
// --- Mundo exterior: doca e armazém industrial ---
const ground=texCanvas((g,w,h)=>{g.fillStyle='#555650';g.fillRect(0,0,w,h);for(let i=0;i<1700;i++){g.fillStyle=['#74736a','#383d3b','#8b8577','#2d3433'][i%4];g.globalAlpha=Math.random()*.3;g.beginPath();g.arc(Math.random()*w,Math.random()*h,Math.random()*3,0,Math.PI*2);g.fill()}g.globalAlpha=1;for(let i=0;i<30;i++){g.strokeStyle='#252b2a';g.globalAlpha=.25;g.beginPath();g.moveTo(Math.random()*w,Math.random()*h);g.lineTo(Math.random()*w,Math.random()*h);g.stroke()}},512,512,4,4);
const asphalt=new THREE.MeshStandardMaterial({map:ground,color:0xc2c0b3,roughness:1});
const yardFloor=box('pátio industrial',[0,-.28,18],[100,.55,94],asphalt,false);groundSurfaces.push(yardFloor);
const waterMat=new THREE.MeshStandardMaterial({color:0x36545b,metalness:.28,roughness:.22,transparent:true,opacity:.94});
const water=box('East River',[70,-.65,16],[80,.28,190],waterMat,false,false);
for(let i=0;i<34;i++){const z=-70+i*5.5;const wav=line([[30,-.45,z],[49,-.48,z+.5],[68,-.46,z-.3],[90,-.5,z+.25],[112,-.46,z]],new THREE.MeshBasicMaterial({color:0x9bb4b1,transparent:true,opacity:.15}),.018);animated.push({obj:wav,phase:i*.4})}
const dock=new THREE.Mesh(new THREE.BoxGeometry(25,.8,57),woodMat);dock.position.set(18,.1,17);dock.receiveShadow=true;dock.castShadow=true;scene.add(dock);groundSurfaces.push(dock);
for(let z=-10;z<45;z+=3.1){for(let x=6;x<30;x+=2.5){const seam=box('junta do píer',[x,.52,z],[.035,.04,2.8],darkBrick,false,false)}}
for(let x of [7,29])for(let z=-10;z<45;z+=8){cyl('estaca do píer',[x,-.8,z],.35,.42,3.2,woodMat,12)}
// Armazém, paredes de tijolo, janelas quebradas e portões.
const WH={w:43,d:31,h:12,cx:0,cz:0};
box('massa do armazém',[0,6,0],[43,12,31],brickMat,true);
box('cobertura do armazém',[0,12.15,0],[44,.45,32],darkBrick,false);
for(let x=-18;x<=18;x+=6){
  addWindow(x,8.2,15.62,3.0,3.0,'front');
  box('tábua na janela',[x,8.1,15.83],[3.15,.14,.13],woodMat);
  box('tábua na janela',[x,9.25,15.83],[3.15,.14,.13],woodMat);
}
for(let x of [-14,-7,7,14]){box('viga vertical industrial',[x,6,15.9],[.32,12,.42],metal)}
for(let x of [-20,20]){box('parede lateral armazém',[x,6,0],[.4,12,31],brickMat)}
for(let z of [-12,0,12]){box('viga de reforço lateral',[-20.3,6,z],[.3,12,.4],metal);box('viga de reforço lateral',[20.3,6,z],[.3,12,.4],metal)}
box('portão de carga',[0,4.1,15.72],[9,7.6,.28],new THREE.MeshStandardMaterial({color:0x282f30,roughness:.8,metalness:.45}),false);
for(let y=.7;y<7.7;y+=.55)box('ripas do portão',[0,y,15.9],[8.8,.07,.08],metal,false,false);
makeGraffiti(-12,4.2,15.9);makeGraffiti(13,4.5,15.9);
for(let x of [-18,18]){box('tubo de drenagem',[x,6,15.95],[.2,11,.2],metal);cyl('lâmpada industrial',[x,10.8,16.4],.22,.22,.3,new THREE.MeshStandardMaterial({color:0xd8b77a,emissive:0xb07b36,emissiveIntensity:1.4}),12)}
// Equipamento abandonado e pilhas de sucata.
for(let i=0;i<15;i++){const x=-28+Math.random()*17,z=8+Math.random()*20,y=.55+Math.random()*1.4;const m=box('sucata metálica',[x,y,z],[1.5+Math.random()*2,.35+Math.random()*1.1,.7+Math.random()*1.8],i%2?metal:darkBrick);m.rotation.y=Math.random()*1.8;m.rotation.z=(Math.random()-.5)*.4}
const crane=box('estrutura de guindaste',[28,5,0],[.7,10,.7],metal);box('braço do guindaste',[28,10,0],[10,.5,.5],metal);line([[32,10,0],[32,5,0],[33,4,0]],metal,.06);
box('caixa de ferramentas',[24,1.05,22],[2.2,1.9,1.5],new THREE.MeshStandardMaterial({color:0x475c5a,metalness:.45,roughness:.65}));box('escavadeira abandonada',[31,1.5,10],[4,2.3,2.3],new THREE.MeshStandardMaterial({color:0x94713c,roughness:.8}));cyl('roda',[29,1.0,11.4],.8,.8,.6,metal,20);cyl('roda',[33,1.0,11.4],.8,.8,.6,metal,20);

/* Camada cinematográfica do exterior: detalhes originais e leves, inspirados
   em kits industriais CC0 e em materiais PBR da Poly Haven. */
const outdoorSteel=new THREE.MeshStandardMaterial({color:0x465254,metalness:.72,roughness:.62});
const fadedPaint=new THREE.MeshStandardMaterial({color:0x596b68,metalness:.28,roughness:.82});
const darkRubber=new THREE.MeshStandardMaterial({color:0x202627,roughness:.96});
const warmLamp=new THREE.MeshStandardMaterial({color:0xe3bd7a,emissive:0x9c642b,emissiveIntensity:1.25,roughness:.4});
function beamBetween(name,a,b,r,mat){
 const va=new THREE.Vector3(...a),vb=new THREE.Vector3(...b),delta=new THREE.Vector3().subVectors(vb,va);
 const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,delta.length(),8),mat);
 mesh.name=name;mesh.position.copy(va).add(vb).multiplyScalar(.5);
 mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());
 mesh.castShadow=true;mesh.receiveShadow=true;scene.add(mesh);return mesh;
}
function barrel(x,y,z,mat=fadedPaint){
 cyl('corpo de tambor industrial',[x,y+.62,z],.48,.48,1.24,mat,16);
 cyl('aro superior do tambor',[x,y+1.08,z],.495,.495,.09,outdoorSteel,16);
 cyl('aro inferior do tambor',[x,y+.18,z],.495,.495,.09,outdoorSteel,16);
}
function pallet(x,z,rot=0){
 const group=new THREE.Group();group.position.set(x,.18,z);group.rotation.y=rot;
 for(let i=0;i<5;i++){const plank=new THREE.Mesh(new THREE.BoxGeometry(2.1,.13,.34),woodMat);plank.position.set(0,0,(i-2)*.39);group.add(plank)}
 for(let i=-1;i<=1;i++){const runner=new THREE.Mesh(new THREE.BoxGeometry(1.9,.2,.24),cedarMat);runner.position.set(0,-.15,i*.62);group.add(runner)}
 group.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});scene.add(group);return group;
}
// Cobertura da doca de carga, com vigas e lâmpadas protegidas.
box('marquise industrial sobre portão',[0,8.45,17.25],[12.8,.32,3.6],outdoorSteel,false);
for(const x of [-6.0,6.0]){
 beamBetween('mão francesa da marquise',[x,8.2,15.9],[x,7.0,18.7],.09,outdoorSteel);
 box('pilar da marquise',[x,4.0,18.55],[.18,8,.18],outdoorSteel,false);
 const lamp=new THREE.PointLight(0xffc783,.7,10);lamp.position.set(x*.72,8.0,18.2);scene.add(lamp);
 const bulb=new THREE.Mesh(new THREE.SphereGeometry(.13,10,8),warmLamp);bulb.position.copy(lamp.position);scene.add(bulb);
}
for(let x=-5.5;x<=5.5;x+=1.1)box('nervura da marquise',[x,8.22,17.2],[.07,.16,3.3],metal,false,false);
// Tubulações, exaustores e reforços de cobertura do galpão.
for(const x of [-19.6,19.6]){
 line([[x,1,14.9],[x,10.8,14.9],[x,11.5,13.9]],outdoorSteel,.085);
 for(let y of [2.2,6.2,10.1])box('abraçadeira de tubulação',[x,y,14.9],[.34,.12,.3],gold,false,false);
}
for(const x of [-13,-4,5,14]){
 const vent=new THREE.Mesh(new THREE.CylinderGeometry(.42,.55,.7,12),outdoorSteel);
 vent.name='exaustor industrial';vent.position.set(x,12.75,-5.5);vent.castShadow=true;scene.add(vent);
 const cap=new THREE.Mesh(new THREE.CylinderGeometry(.58,.48,.12,12),metal);cap.position.set(x,13.15,-5.5);scene.add(cap);
}
for(const x of [-18,-9,0,9,18]){
 beamBetween('tesoura metálica do telhado',[x-4,12.05,-14.5],[x,14.0,0],.075,outdoorSteel);
 beamBetween('tesoura metálica do telhado',[x,14.0,0],[x+4,12.05,14.5],.075,outdoorSteel);
}
// Pallets, tambores, caixas e entulho em agrupamentos legíveis.
pallet(-26,11,.12);pallet(-23,15,-.18);pallet(-27,20,.32);
barrel(-25,.05,24);barrel(-22,.05,25);barrel(-19,.05,24,fadedPaint);
barrel(34,.05,24);barrel(36,.05,22,new THREE.MeshStandardMaterial({color:0x76513a,metalness:.35,roughness:.8}));
for(const [x,z,s] of [[-31,7,1.7],[-29,10,1.25],[-24,7,1.5],[35,8,1.4],[38,12,1.8]]){
 box('caixote industrial de madeira',[x,.55,z],[s,1.1,s*.85],woodMat,false);
 for(let y=.12;y<1.05;y+=.28)box('travessa do caixote',[x,y,z+s*.43],[s,.055,.07],cedarMat,false,false);
}
for(let i=0;i<9;i++){
 const x=-31+(i%3)*1.1,z=27+Math.floor(i/3)*1.0;
 const scrap=box('chapa de metal descartada',[x,.2+(i%2)*.12,z],[1.5,.12,.7],i%2?outdoorSteel:metal,false);
 scrap.rotation.y=(i%3)*.31;scrap.rotation.z=(i%2?.12:-.08);
}
// Cabeços de amarração, defensas de borracha e cabos no píer.
for(const z of [-7,5,17,29,41]){
 cyl('cabeço de amarração',[28.7,.75,z],.22,.22,.72,outdoorSteel,12);
 cyl('base do cabeço',[28.7,.43,z],.34,.34,.14,metal,12);
 const tire=new THREE.Mesh(new THREE.TorusGeometry(.47,.13,8,18),darkRubber);
 tire.name='defensa de borracha do píer';tire.position.set(30.15,.0,z);tire.rotation.y=Math.PI/2;scene.add(tire);
 if(z===5||z===29)line([[28.7,1.05,z],[30.8,.45,z+2.3],[32,-.2,z+3.2]],woodMat,.045);
}
// Reforço visual da margem: blocos de concreto e postes de atracação.
for(const z of [-12,0,12,24,36,48]){
 box('bloco de proteção da margem',[31.4,-.02,z],[1.0,1.15,2.0],concrete,false);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(.22,.055,8,16),outdoorSteel);
 ring.name='argola de amarração';ring.position.set(31.95,.55,z);ring.rotation.y=Math.PI/2;scene.add(ring);
}

// Mansão oculta no telhado: cinco pavimentos, blocos de calcário e caixilhos de aço.
const mansionBase=box('base elevada da mansão',[0,12.55,-.5],[32,.5,23],stone,false);
const houseY=21.45,houseH=17.6;
box('fachada frontal da mansão esquerda',[-9,houseY,11.0],[14,houseH,.85],stone,true);
box('fachada frontal da mansão direita',[9,houseY,11.0],[14,houseH,.85],stone,true);
box('lintel monumental do portal',[0,19.0,11.0],[4.2,.85,.85],stone,false);
box('fachada posterior da mansão',[0,houseY,-12.0],[32,houseH,.85],stone,true);
box('lateral oeste da mansão',[-15.6,houseY,-.5],[.85,houseH,23],stone,true);
for(const z of [-8.2,8.2])box('lateral leste da mansão',[15.6,houseY,z],[.85,houseH,6.6],stone,true);box('lintel da passagem para ala',[15.6,20.65,-.5],[.85,.55,6.0],stone,true);
box('telhado da mansão',[0,30.45,-.5],[33,.8,24],cedarMat,false);
for(let floor=0;floor<5;floor++){
 const yy=13.9+floor*3.35;
 for(let x=-11.7;x<=11.8;x+=5.85){
  if(floor<2&&Math.abs(x)<3)continue;
  addWindow(x,yy,11.49,2.55,1.85,'front');
  // friso acima de cada janela e marcação hieroglífica lateral
  box('lintel de janela',[x,yy+1.12,11.7],[3,.18,.28],gold,false);
  glyphPanel(x-1.65,yy,11.58,0,.38);glyphPanel(x+1.65,yy,11.58,0,.38);
 }
 for(let z of [-8,8]){addWindow(16.08,yy,z,2.3,1.8,'side')}
 box('friso de pavimento',[0,yy-1.7,11.54],[31.8,.16,.24],gold,false);
}
for(let x of [-15.6])for(let y=13.4;y<30;y+=3.3)box('pilastra de canto',[x,y,-.5],[1.05,3.1,1.05],stone);
for(let x=-14;x<15;x+=3.5){box('moldura superior',[x,30.0,11.5],[2.5,.22,.28],gold)}
// Portal canônico: bloco escuro de madeira, sem puxador nem fechadura visível.
// O vão fica livre atrás da folha para permitir a abertura vertical por interação.
box('ombreira esquerda do portal',[ -2.18,16.1,11.42],[.48,6.2,.8],stone,false);
box('ombreira direita do portal',[ 2.18,16.1,11.42],[.48,6.2,.8],stone,false);
box('lintel superior do portal',[0,19.16,11.42],[4.82,.48,.8],stone,false);
const door=box('porta de madeira sem maçaneta',[0,15.9,11.93],[4.08,5.28,.34],woodMat,false);door.material=cedarMat;
box('soleira monumental',[0,13.24,12.1],[4.4,.18,1.2],stone,false);
for(let side of [-1,1]){box('pilar do portal',[side*2.58,16.1,11.7],[.55,6.3,.75],stone);for(let y=13.5;y<19;y+=.85)box('detalhe dourado do portal',[side*2.58,y,12.12],[.62,.06,.06],gold)}
// Escada metálica externa em caracol: 66 degraus, cerca de duas voltas.
const stairCenter=new THREE.Vector2(19,18),stairRadius=2.05,stairCount=78,stairRise=12.8;
const exteriorSteps=[];
for(let i=0;i<stairCount;i++){
 const a=-Math.PI/2+i*.195,y=.08+i*(stairRise/(stairCount-1));
 const x=stairCenter.x+Math.cos(a)*stairRadius,z=stairCenter.y+Math.sin(a)*stairRadius;
 const step=box('degrau de aço da escada em caracol',[x,y,z],[1.5,.18,.72],metal,false);
 step.rotation.y=a+Math.PI/2;exteriorSteps.push([a,y,x,z]);groundSurfaces.push(step);
}
const railPoints=exteriorSteps.map(([a,y])=>[stairCenter.x+Math.cos(a)*(stairRadius+1.0),y+.78,stairCenter.y+Math.sin(a)*(stairRadius+1.0)]);
line(railPoints,metal,.075);
// Mastro central e corrimão interno da escada externa.
cyl('mastro central da escada espiral',[stairCenter.x,6.5,stairCenter.y],.16,.16,13.2,outdoorSteel,12);
const innerRail=exteriorSteps.map(([a,y])=>[stairCenter.x+Math.cos(a)*(stairRadius-.82),y+.72,stairCenter.y+Math.sin(a)*(stairRadius-.82)]);
line(innerRail,outdoorSteel,.052);
for(let i=0;i<stairCount;i+=6){
 const [a,y]=exteriorSteps[i];
 beamBetween('suporte interno do corrimão',[stairCenter.x+Math.cos(a)*(stairRadius-.82),y,stairCenter.y+Math.sin(a)*(stairRadius-.82)],[stairCenter.x+Math.cos(a)*(stairRadius-.82),y+.72,stairCenter.y+Math.sin(a)*(stairRadius-.82)],.028,outdoorSteel);
}

for(let i=0;i<stairCount;i+=4){const [a,y]=exteriorSteps[i];cyl('montante do corrimão',[stairCenter.x+Math.cos(a)*(stairRadius+1),y+.39,stairCenter.y+Math.sin(a)*(stairRadius+1)],.045,.045,.78,metal,8)}
box('patamar da entrada',[18.7,13.05,13.0],[4.4,.2,4.2],metal,false);
box('passarela entre a escada e a entrada',[9,13.05,11.0],[18,.2,2.2],stone,false);
line([[18,13.18,13],[9,13.18,11],[0,13.18,11]],gold,.035);
// Sinais discretos da camuflagem mágica.
const magicMat=new THREE.MeshBasicMaterial({color:0xdab96f,transparent:true,opacity:.42,wireframe:true});
const halo=new THREE.Mesh(new THREE.TorusGeometry(2.9,.025,8,96),magicMat);halo.position.set(0,16.1,12.35);scene.add(halo);animated.push({obj:halo,spin:true});
const sparkMat=new THREE.MeshBasicMaterial({color:0xe3bd73,transparent:true,opacity:.6});
for(let i=0;i<24;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(.035+Math.random()*.04,8,8),sparkMat);s.position.set((Math.random()-.5)*7,14+Math.random()*5,12.3+Math.random()*.5);scene.add(s);animated.push({obj:s,phase:Math.random()*6.28,particle:true})}
// Janelas com brilho quente ao entardecer.
for(let i=0;i<14;i++){const l=new THREE.PointLight(0xffc27d,.24,8);l.position.set(-12+(i%6)*4.8,14+Math.floor(i/6)*5,10.3);scene.add(l)}
// O rio em escala, a Williamsburg Bridge e o skyline de Manhattan são montados
// no módulo src/exterior.js para manter a área externa independente dos interiores.
// Grande Salão: salão de quatro alturas, pilares, sacadas e teto de cedro.
const hallFloorY=12.95;
const hallFloor=box('piso do Grande Salão',[0,hallFloorY,-.5],[29,.45,20],new THREE.MeshStandardMaterial({color:0x9d8c70,map:limestone,roughness:.85}),false);groundSurfaces.push(hallFloor);
for(let z of [-10.2,9.2])box('parede interna do salão',[0,20.6,z],[29,15.5,.55],stone,false);
for(let x of [-14.2,14.2])box('parede lateral do salão',[x,20.6,-.5],[.55,15.5,20],stone,false);
for(let i=0;i<4;i++)box('viga de cedro do teto',[0,28.25,-8.4+i*5.2],[28,.35,.36],cedarMat,false);
box('forro de cedro',[0,28.55,-.5],[28.5,.38,20],cedarMat,false);
for(let x of [-8.8,8.8])for(let z of [-6.7,6.3])addColumn(x,z,13.2,14.9,true);
for(let level=0;level<3;level++){const y=16.6+level*3.75;for(let side of [-1,1]){
 box('sacada de calcário',[side*10.5,y,-.5],[5.8,.55,18],stone,false);
 box('guarda-corpo da sacada',[side*10.5,y+.75,8.2],[5.8,.18,.18],gold,false);
 box('guarda-corpo da sacada',[side*10.5,y+.75,-9.2],[5.8,.18,.18],gold,false);
 for(let z=-8.5;z<8.4;z+=1.25)cyl('balaústre',[side*10.5,y+.38,z],.055,.055,.78,stone,8);
}}
for(let y of [16.6,20.35,24.1])for(let z of [-9.1,8.1])box('viga sacada',[0,y,z],[29,.36,.35],gold,false);
// Iconografia do portal e das armas é construída no passe de assets em grand-salon.js.
// Lareira monumental e TV de plasma acima do manto.
box('parede da lareira',[0,17.8,-9.58],[9.5,8,.8],new THREE.MeshStandardMaterial({color:0x655b4b,map:concrete,roughness:1}),false);
box('moldura da lareira',[0,15.25,-9.02],[5.5,3.5,.95],stone,false);
box('boca escura da lareira',[0,15.4,-8.48],[4.1,2.5,.08],new THREE.MeshStandardMaterial({color:0x090b0b,roughness:1}),false);
box('manto de pedra',[0,17.15,-8.85],[6.3,.42,1.15],stone,false);
box('TV de plasma',[0,19.0,-9.05],[4.6,2.55,.2],new THREE.MeshStandardMaterial({color:0x090f12,metalness:.35,roughness:.15,emissive:0x101e22,emissiveIntensity:.75}),false);
box('tela da TV',[0,19.0,-8.91],[4.35,2.3,.025],new THREE.MeshBasicMaterial({color:0x15242b}),false,false);
// Lareira, fogo volumétrico e estátua de Tot são finalizados em src/grand-salon.js.
let fireLight = null;

// Sofás de couro e tapete com padrão de escamas.
const leather=new THREE.MeshStandardMaterial({color:0x59402f,roughness:.58});
function sofa(x,z,rot=0){
 const group=new THREE.Group();group.name='sofá legado do Grande Salão';group.position.set(x,13.45,z);group.rotation.y=rot;
 const frame=new THREE.Mesh(new THREE.BoxGeometry(5.35,.42,1.9),cedarMat);frame.position.y=.28;group.add(frame);
 const base=new THREE.Mesh(new THREE.BoxGeometry(5.12,.72,1.72),leather);base.position.y=.78;group.add(base);
 const back=new THREE.Mesh(new THREE.BoxGeometry(5.12,1.38,.38),leather);back.position.set(0,1.46,-.73);group.add(back);
 for(const side of [-1,1]){
  const arm=new THREE.Mesh(new THREE.BoxGeometry(.58,1.05,1.92),leather);arm.position.set(side*2.34,1.0,.02);group.add(arm);
  const cap=new THREE.Mesh(new THREE.BoxGeometry(.64,.13,1.98),cedarMat);cap.position.set(side*2.34,1.56,.02);group.add(cap);
  for(const xx of [-2.18,2.18]){const leg=new THREE.Mesh(new THREE.BoxGeometry(.2,.58,.2),darkBrick);leg.position.set(side*2.18,.02,xx===-2.18?-.72:.72);group.add(leg)}
 }
 for(let xx of [-1.65,0,1.65]){
  const seat=new THREE.Mesh(new THREE.BoxGeometry(1.48,.22,1.18),new THREE.MeshStandardMaterial({color:0x79523b,roughness:.88}));seat.position.set(xx,1.18,.02);group.add(seat);
  const backCushion=new THREE.Mesh(new THREE.BoxGeometry(1.48,.76,.2),new THREE.MeshStandardMaterial({color:0x684632,roughness:.92}));backCushion.position.set(xx,1.58,-.48);group.add(backCushion);
 }
 const frontRail=new THREE.Mesh(new THREE.BoxGeometry(4.6,.16,.08),gold);frontRail.position.set(0,.62,.91);group.add(frontRail);
 for(let i=0;i<25;i++){const stud=new THREE.Mesh(new THREE.SphereGeometry(.035,6,5),gold);stud.position.set(-2.18+i*.18,.65,.97);group.add(stud)}
 scene.add(group);return group
}
sofa(-4,1.5,0);sofa(4,1.5,0);
const rug=new THREE.Mesh(new THREE.PlaneGeometry(10,6),new THREE.MeshStandardMaterial({map:rugTex,roughness:1,side:THREE.DoubleSide}));rug.name='tapete legado do Grande Salão';rug.rotation.x=-Math.PI/2;rug.position.set(0,13.2,-1.3);scene.add(rug);
box('mesa de centro legado',[0,13.65,-1.4],[3.2,.38,1.8],woodMat,false);cyl('pé mesa legado',[0,13.4,-1.4],.18,.3,.55,gold,12);
// Instrumentos musicais e armas antigas são substituídos por modelos detalhados em grand-salon.js.
// As pequenas estátuas geométricas foram removidas; a decoração escultórica é criada em grand-salon.js.
// Biblioteca circular subterrânea, escavada na rocha.
const libCenterY=-12.5,libFloor= -17.4,libRadius=12.5;
const rockMat=new THREE.MeshStandardMaterial({color:0x82735e,map:concrete,roughness:.94,side:THREE.DoubleSide});
const cylWall=new THREE.Mesh(new THREE.CylinderGeometry(libRadius,libRadius,11.4,64,1,true),rockMat);cylWall.position.set(0,libCenterY,-.5);cylWall.receiveShadow=true;scene.add(cylWall);
const libFloorMesh=new THREE.Mesh(new THREE.CircleGeometry(libRadius,64),new THREE.MeshStandardMaterial({color:0x33484b,roughness:.8}));libFloorMesh.rotation.x=-Math.PI/2;libFloorMesh.position.set(0,libFloor,-.5);libFloorMesh.receiveShadow=true;scene.add(libFloorMesh);groundSurfaces.push(libFloorMesh);
const mosaic=texCanvas((g,w,h)=>{g.fillStyle='#23383a';g.fillRect(0,0,w,h);for(let i=0;i<12;i++){g.strokeStyle=i%2?'#b28c52':'#71908a';g.lineWidth=7;g.beginPath();g.arc(w/2,h/2,30+i*17,0,Math.PI*2);g.stroke()}for(let i=0;i<12;i++){g.save();g.translate(w/2,h/2);g.rotate(i*Math.PI/6);g.fillStyle=i%2?'#bb9b64':'#71938a';g.fillRect(-7,-195,14,38);g.restore()}},512,512,1,1);
const mosaicMesh=new THREE.Mesh(new THREE.CircleGeometry(8.5,64),new THREE.MeshStandardMaterial({map:mosaic,roughness:.8,side:THREE.DoubleSide}));mosaicMesh.rotation.x=-Math.PI/2;mosaicMesh.position.set(0,libFloor+.035,-.5);scene.add(mosaicMesh);
const ceiling=new THREE.Mesh(new THREE.CircleGeometry(libRadius,64),new THREE.MeshStandardMaterial({color:0x192c39,roughness:.9,side:THREE.DoubleSide}));ceiling.name='biblioteca teto plano provisório';ceiling.rotation.x=Math.PI/2;ceiling.position.set(0,-6.65,-.5);scene.add(ceiling);
for(let i=0;i<0;i++){const star=new THREE.Mesh(new THREE.SphereGeometry(.025+Math.random()*.035,6,6),new THREE.MeshBasicMaterial({color:i%4?0xc6a66e:0x8fb2b4}));const a=Math.random()*Math.PI*2,r=Math.random()*11.5;star.position.set(Math.cos(a)*r,-6.55,Math.sin(a)*r-.5);scene.add(star)}
// Estantes circulares em três níveis.
for(let tier=0;tier<3;tier++){const y=-16.2+tier*3.3;for(let a=0;a<32;a++){const angle=a/32*Math.PI*2;const x=Math.cos(angle)*10.65,z=Math.sin(angle)*10.65-.5;const shelf=box('estante curva',[x,y+1.05,z],[1.15,2.2,.55],woodMat,false);shelf.rotation.y=-angle+Math.PI/2;for(let n=0;n<6;n++){const book=box('livro antigo',[x+Math.cos(angle)*.03,y+.22+(n%3)*.58,z+Math.sin(angle)*.03],[.24,.42,.34],new THREE.MeshStandardMaterial({color:[0x754c37,0x334d50,0x8e7447,0x523d59][n%4],roughness:.9}),false,false);book.rotation.y=-angle+Math.PI/2}}}
for(let a=0;a<8;a++){const angle=a*Math.PI/4;cyl('coluna da biblioteca',[Math.cos(angle)*7.4,-11.65,Math.sin(angle)*7.4-.5],.3,.4,10,stone,12)}
// Escada helicoidal representando a descida de três níveis.
for(let i=0;i<150;i++){const a=i*.13,r=5.1,y=-6.7-i*.071;const step=box('degrau da escada em espiral',[Math.cos(a)*r,y,Math.sin(a)*r-.5],[1.6,.18,.72],i%4===0?gold:woodMat,false);step.rotation.y=-a;groundSurfaces.push(step)}
line(Array.from({length:100},(_,i)=>{const a=i*.13;return [Math.cos(a)*4.1,-6.5-i*.107,Math.sin(a)*4.1-.5]}),gold,.045);
box('mesa de leitura',[0,-16.2,-.5],[4.2,.25,2.2],woodMat,false);for(let x of [-1.6,1.6])box('pé mesa biblioteca',[x,-16.9,-.5],[.18,1.3,.18],cedarMat,false);
for(let x of [-3.8,3.8]){cyl('castiçal',[x,-15.6,-.5],.12,.12,.65,gold,12);const flame=new THREE.PointLight(0xffc77a,.55,5);flame.position.set(x,-15.05,-.5);scene.add(flame)}
const libLight=new THREE.PointLight(0x9abdc0,1.8,28);libLight.position.set(0,-7.5,-.5);scene.add(libLight);
for(let a=0;a<6;a++){const ang=a*Math.PI/3;glyphPanel(Math.cos(ang)*12,-12.7,Math.sin(ang)*12-.5,-ang,1.1)}
// Ala dos quartos: composição interpretativa com conforto moderno e peças antigas.
const roomFloor=box('piso da ala dos quartos',[25.0,17.1,-.5],[13.3,.35,12.5],woodMat,false);groundSurfaces.push(roomFloor);
for(let z of [-6.7,5.7])box('parede do quarto',[25,19,-.5+z],[13.3,4.2,.35],plaster,false);
for(let z of [-4.35,4.35])box('parede lateral do quarto',[18.4,19,z],[.35,4.2,3.8],plaster,false);
box('lintel da passagem do quarto',[18.4,20.55,-.5],[.35,.5,5.0],plaster,false);
box('parede lateral externa do quarto',[31.6,19,-.5],[.35,4.2,12.5],plaster,false);
for(let z of [-2.6,2.6])box('ombreira de calcário da ala',[19.25,18.7,z],[.55,3.6,.5],stone,false);
box('parede divisória do quarto',[25,19,-.5],[.25,4.2,12.5],plaster,false);
box('cama de madeira',[21.8,17.85,-1.2],[4.3,.7,5.4],cedarMat,false);box('colchão',[21.8,18.35,-1.2],[4.1,.45,5.1],new THREE.MeshStandardMaterial({color:0xd1c5ae,roughness:1}),false);for(let x of [20.6,23.0])box('travesseiro',[x,18.65,-3.0],[1.0,.25,1.2],new THREE.MeshStandardMaterial({color:0xebe4d5}),false);
box('mesa de estudo',[28.2,18.0,-3.8],[3.2,.22,1.5],woodMat,false);for(let x of [27.0,29.4])box('pé da mesa',[x,17.3,-3.8],[.13,1.25,.13],cedarMat,false);
box('cômoda',[28.5,18.0,3.2],[2.5,1.6,1.0],cedarMat,false);for(let y of [17.7,18.2,18.7])box('gaveta',[28.5,y,3.73],[2.2,.35,.05],gold,false);
addWindow(25,19.1,-6.25,3.4,2.0,'back');
for(let i=0;i<5;i++){const book=box('pilha de livros',[27+i*.3,18.3,-4.1],[.42,.16,.75],new THREE.MeshStandardMaterial({color:[0x6f4537,0x334e50,0x987346,0x51405c][i%4]}),false);book.rotation.z=(i-2)*.03}
const bedside=new THREE.PointLight(0xffc98b,.5,6);bedside.position.set(21.3,19.3,1.2);scene.add(bedside);
box('cama secundária',[28,17.65,1.2],[3.2,.5,3.3],leather,false);
addRoomLabel('ALA DOS QUARTOS',25,20.8,-6.15);
// Ponto de referência: placa discreta no pátio.
const info=box('placa de identificação',[ -22,2.3,24],[.08,2.3,3.2],metal,false);const sign=new THREE.Mesh(new THREE.PlaneGeometry(2.8,1.65),canvasSign('BROOKLYN HOUSE'));sign.position.set(-21.94,2.4,24);sign.rotation.y=Math.PI/2;scene.add(sign);
// Luzes interiores quentes.
for(let x of [-8,0,8])for(let z of [-6,5]){const lamp=new THREE.PointLight(0xffd39a,.45,12);lamp.position.set(x,25.5,z);scene.add(lamp)}

 // Colisores do mobiliário e dos elementos centrais. São volumes invisíveis,
 // independentes das malhas visuais, para manter o mesmo comportamento em desktop e mobile.
 registerCollider(0,18.0,-.5,2.7,9.4,1.8);

 // Estantes inferiores da biblioteca, no nível em que o personagem caminha.
 for(let i=0;i<32;i++){
   const angle=i/32*Math.PI*2;
   registerCollider(Math.cos(angle)*10.65,-15.15,Math.sin(angle)*10.65-.5,1.2,2.2,1.1);
 }

 // Mobiliário principal da ala residencial.
 registerCollider(21.8,18.05,-1.2,4.3,1.6,5.4);
 registerCollider(28.2,18.15,-3.8,3.2,1.8,1.5);
 registerCollider(28.5,18.1,3.2,2.5,1.7,1.0);
 registerCollider(28,17.9,1.2,3.2,1.2,3.3);

 const zones={
 dock:{label:'DOCA · BROOKLYN',pos:[0,0,31],yaw:0,bounds:[-34,34,-14,58],base:0},
 hall:{label:'GRANDE SALÃO',pos:[0,13.175,2.2],yaw:0,bounds:[-18.35,18.35,-10,10],base:13.175},
 library:{label:'BIBLIOTECA SUBTERRÂNEA',pos:[0,-17.4,2.5],yaw:0,bounds:[-10.8,10.8,-10.8,10.8],base:-17.4},
 bedroom:{label:'ALA DOS QUARTOS',pos:[25,17.275,2.5],yaw:0,bounds:[19.3,32.2,-5.5,5.5],base:17.275}
};
return {zones,groundSurfaces,water,fireLight,spiralStair:{centerX:stairCenter.x,centerZ:stairCenter.y,radius:stairRadius,bottomY:.08,topY:13.0,startAngle:-Math.PI/2,totalAngle:(stairCount-1)*.195}};
}

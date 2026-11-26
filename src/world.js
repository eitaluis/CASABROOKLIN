export function buildWorld(ctx){
 const {THREE,scene,colliders,animated,box,cyl,line,texCanvas,addWindow,glyphPanel,addStatue,addColumn,makeGraffiti,addRoomLabel,canvasSign,rugTex,metal,gold,stone,brickMat,darkBrick,woodMat,cedarMat,darkGlass,plaster,leather} = ctx;
 const groundSurfaces=[];
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
// Porta sem maçaneta: um bloco maciço de madeira gravada.
box('portal de pedra',[0,16.1,11.42],[4.1,6.2,.8],darkBrick,false);
const door=box('porta de madeira sem maçaneta',[0,16.15,11.93],[2.45,4.9,.34],woodMat,false);door.material=cedarMat;
for(let i=0;i<5;i++){glyphPanel(-.75+(i%2)*1.5,14.9+Math.floor(i/2)*.9,12.13,0,.5)}
box('soleira monumental',[0,13.65,12.1],[4.3,.35,1.2],stone,false);
for(let side of [-1,1]){box('pilar do portal',[side*2.35,16.1,11.7],[.55,6.3,.75],stone);for(let y=13.5;y<19;y+=.85)box('detalhe dourado do portal',[side*2.35,y,12.12],[.62,.06,.06],gold)}
// Escadaria metálica externa até a entrada, com patamar.
for(let i=0;i<18;i++){const y=.55+i*.69,z=24-i*.68;box('degrau de aço da entrada',[0,y,z],[4,.18,1.0],metal,false)}
for(let side of [-2.0,2.0]){line([[side,.8,25],[side,7,18],[side,12.8,12]],metal,.11);for(let i=0;i<7;i++)cyl('poste do corrimão',[side,.9+i*1.8,24-i*1.05],.07,.07,1.2,metal,8)}
box('patamar da entrada',[0,12.5,11],[5,.3,4],metal,false);
line([[18,12.7,13],[18,13.5,12],[18,14.0,11]],gold,.04);
// Sinais discretos da camuflagem mágica.
const magicMat=new THREE.MeshBasicMaterial({color:0xdab96f,transparent:true,opacity:.42,wireframe:true});
const halo=new THREE.Mesh(new THREE.TorusGeometry(2.9,.025,8,96),magicMat);halo.position.set(0,16.1,12.35);scene.add(halo);animated.push({obj:halo,spin:true});
const sparkMat=new THREE.MeshBasicMaterial({color:0xe3bd73,transparent:true,opacity:.6});
for(let i=0;i<24;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(.035+Math.random()*.04,8,8),sparkMat);s.position.set((Math.random()-.5)*7,14+Math.random()*5,12.3+Math.random()*.5);scene.add(s);animated.push({obj:s,phase:Math.random()*6.28,particle:true})}
// Janelas com brilho quente ao entardecer.
for(let i=0;i<14;i++){const l=new THREE.PointLight(0xffc27d,.24,8);l.position.set(-12+(i%6)*4.8,14+Math.floor(i/6)*5,10.3);scene.add(l)}
// Contexto de Williamsburg: rio, docas, armazéns e ponte suspensa ao longe.
const skylineMat=new THREE.MeshStandardMaterial({color:0x59666a,roughness:.95});
for(let i=0;i<32;i++){const x=42+Math.random()*65,z=-72+Math.random()*120,h=8+Math.random()*30,w=3+Math.random()*6;const b=box('silhueta urbana distante',[x,h/2-1,z],[w,h,3+Math.random()*4],skylineMat,false,false);b.material=skylineMat}
const bridgeSteel=new THREE.MeshStandardMaterial({color:0x46575b,metalness:.72,roughness:.48});
for(let x of [48,88]){box('torre da Williamsburg Bridge',[x,22,-48],[1.2,44,1.2],bridgeSteel);box('travessa ponte',[x,34,-48],[8,1,1],bridgeSteel);for(let z of [-54,-48,-42])box('treliça torre',[x,22,z],[.3,44,.3],bridgeSteel)}
line([[48,43,-48],[55,37,-48],[68,34,-48],[80,37,-48],[88,43,-48]],bridgeSteel,.12);
line([[48,43,-48],[48,30,-48],[88,30,-48],[88,43,-48]],bridgeSteel,.09);
for(let x=50;x<88;x+=2.2){line([[x,31,-48],[x,36+Math.sin((x-50)/38*Math.PI)*6,-48]],bridgeSteel,.025)}
box('tabuleiro da ponte',[68,29,-48],[46,.45,5],bridgeSteel,false);
for(let x=52;x<88;x+=3)box('poste ponte',[x,30,-48],[.12,1.6,.12],bridgeSteel,false);
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
for(let x=-13;x<=13;x+=2.6){glyphPanel(x,20.2,9.55,0,.42)}
// Lareira monumental e TV de plasma acima do manto.
box('parede da lareira',[0,17.8,-9.58],[9.5,8,.8],new THREE.MeshStandardMaterial({color:0x655b4b,map:concrete,roughness:1}),false);
box('moldura da lareira',[0,15.25,-9.02],[5.5,3.5,.95],stone,false);
box('boca escura da lareira',[0,15.4,-8.48],[4.1,2.5,.08],new THREE.MeshStandardMaterial({color:0x090b0b,roughness:1}),false);
box('manto de pedra',[0,17.15,-8.85],[6.3,.42,1.15],stone,false);
box('TV de plasma',[0,19.0,-9.05],[4.6,2.55,.2],new THREE.MeshStandardMaterial({color:0x090f12,metalness:.35,roughness:.15,emissive:0x101e22,emissiveIntensity:.75}),false);
box('tela da TV',[0,19.0,-8.91],[4.35,2.3,.025],new THREE.MeshBasicMaterial({color:0x15242b}),false,false);
const fireLight=new THREE.PointLight(0xff7d30,2.3,12);fireLight.position.set(0,15.7,-7.7);scene.add(fireLight);
const fireMat=new THREE.MeshBasicMaterial({color:0xff8b3d,transparent:true,opacity:.85});
for(let i=0;i<14;i++){const f=new THREE.Mesh(new THREE.SphereGeometry(.14+Math.random()*.18,8,8),fireMat);f.position.set((Math.random()-.5)*2.8,14.4+Math.random()*1.8,-8.1);scene.add(f);animated.push({obj:f,fire:true,phase:Math.random()*6.28})}

// Estátua central de Tot: figura de mármore negro com aproximadamente nove metros.
const blackMarble=new THREE.MeshStandardMaterial({color:0x17191a,roughness:.32,metalness:.18,map:texCanvas((g,w,h)=>{g.fillStyle='#17191a';g.fillRect(0,0,w,h);for(let i=0;i<260;i++){g.strokeStyle=i%3?'#343638':'#786c5d';g.globalAlpha=.13;g.lineWidth=Math.random()*2+.3;g.beginPath();let x=Math.random()*w,y=Math.random()*h;g.moveTo(x,y);g.lineTo(x+Math.random()*80,y+Math.random()*16);g.stroke()}g.globalAlpha=1},256,256,1,1)});
box('pedestal da estátua de Tot',[0,13.65,-.5],[3.0,.8,3.0],stone,false);
const totBody=box('corpo de Tot em mármore negro',[0,16.45,-.5],[1.55,4.7,1.0],blackMarble,false);
const totShoulders=box('ombros de Tot',[0,18.2,-.5],[2.1,.55,1.0],blackMarble,false);
const totHead=new THREE.Mesh(new THREE.SphereGeometry(.78,20,16),blackMarble);totHead.position.set(0,19.15,-.5);totHead.scale.set(.78,1.1,.68);scene.add(totHead);
const ibisNeck=cyl('pescoço de íbis de Tot',[0,20.1,-.5],.32,.38,1.25,blackMarble,16); 
const ibisHead=new THREE.Mesh(new THREE.SphereGeometry(.43,16,12),blackMarble);ibisHead.position.set(0,20.8,-.48);ibisHead.scale.set(.78,.8,1.05);scene.add(ibisHead);
const beak=cyl('bico longo de íbis',[0,20.55,.25],.16,.035,1.05,blackMarble,12);beak.rotation.x=Math.PI/2;beak.position.set(0,20.55,.22);
const eyeMat=new THREE.MeshStandardMaterial({color:0xc6a45f,metalness:.55,roughness:.25,emissive:0x4b3412,emissiveIntensity:.3});
for(const side of [-1,1]){const eye=new THREE.Mesh(new THREE.SphereGeometry(.09,12,8),eyeMat);eye.position.set(side*.27,20.86,.05);scene.add(eye);const arm=box('braço ritual de Tot',[side*1.0,17.5,-.22],[.42,2.4,.42],blackMarble,false);arm.rotation.z=side*.28;}
box('pergaminho na mão de Tot',[.95,16.9,.12],[.35,1.1,.28],new THREE.MeshStandardMaterial({color:0xd4c397,roughness:.9}),false);
box('tábua de escrita na mão de Tot',[-1.0,17.0,.15],[.45,.85,.12],gold,false);
const crown=cyl('coroa de Tot',[0,21.75,-.5],.56,.3,.42,gold,12);
const totSpot=new THREE.SpotLight(0xe3c68e,32,24,Math.PI/5,.65,1.2);totSpot.position.set(-3,27,3);totSpot.target.position.set(0,17,-.5);scene.add(totSpot,totSpot.target);

// Sofás de couro e tapete com padrão de escamas.
const leather=new THREE.MeshStandardMaterial({color:0x59402f,roughness:.58});
function sofa(x,z,rot=0){const group=new THREE.Group();group.position.set(x,13.45,z);group.rotation.y=rot;const b=new THREE.Mesh(new THREE.BoxGeometry(5.2,1.0,1.8),leather);b.position.y=.55;group.add(b);const back=new THREE.Mesh(new THREE.BoxGeometry(5.2,1.2,.38),leather);back.position.set(0,1.3,-.72);group.add(back);for(let xx of [-1.65,0,1.65]){const c=new THREE.Mesh(new THREE.BoxGeometry(1.4,.2,1.2),new THREE.MeshStandardMaterial({color:0x80634a,roughness:.7}));c.position.set(xx,1.12,-.1);group.add(c)}scene.add(group);return group}
sofa(-4,1.5,0);sofa(4,1.5,0);
const rug=new THREE.Mesh(new THREE.PlaneGeometry(10,6),new THREE.MeshStandardMaterial({map:rugTex,roughness:1,side:THREE.DoubleSide}));rug.rotation.x=-Math.PI/2;rug.position.set(0,13.2,-1.3);scene.add(rug);
box('mesa de centro',[0,13.65,-1.4],[3.2,.38,1.8],woodMat,false);cyl('pé mesa',[0,13.4,-1.4],.18,.3,.55,gold,12);
// Instrumentos musicais e armas antigas como decoração.
function instrument(x,y,z,type){if(type==='harp'){const frame=box('harpa decorativa',[x,y,z],[.18,2.4,.42],cedarMat);frame.rotation.z=-.22;for(let i=0;i<9;i++)line([[x-.15+i*.035,y-1,z+.25],[x-.15+i*.035,y+1,z+.25]],gold,.012)}else if(type==='spear'){cyl('lança cerimonial',[x,y,z],.045,.045,2.9,woodMat,8);const p=new THREE.Mesh(new THREE.ConeGeometry(.13,.48,8),gold);p.position.set(x,y+1.62,z);scene.add(p)}else{cyl('tambor decorativo',[x,y,z],.42,.42,.65,woodMat,16);cyl('pele do tambor',[x,y+.34,z],.42,.42,.06,plaster,16)}}
for(let x of [-12,12]){instrument(x,19.5,-9.35,'harp');instrument(x,21.0,9.1,'spear');instrument(x,17.2,-9.35,'drum')}
for(let z of [-7,7]){addStatue(-12,13.1,z,0);addStatue(12,13.1,z,1)}
// Biblioteca circular subterrânea, escavada na rocha.
const libCenterY=-12.5,libFloor= -17.4,libRadius=12.5;
const rockMat=new THREE.MeshStandardMaterial({color:0x554b3d,map:concrete,roughness:1});
const cylWall=new THREE.Mesh(new THREE.CylinderGeometry(libRadius,libRadius,11.4,64,1,true),rockMat);cylWall.position.set(0,libCenterY,-.5);cylWall.receiveShadow=true;scene.add(cylWall);
const libFloorMesh=new THREE.Mesh(new THREE.CircleGeometry(libRadius,64),new THREE.MeshStandardMaterial({color:0x33484b,roughness:.8}));libFloorMesh.rotation.x=-Math.PI/2;libFloorMesh.position.set(0,libFloor,-.5);libFloorMesh.receiveShadow=true;scene.add(libFloorMesh);groundSurfaces.push(libFloorMesh);
const mosaic=texCanvas((g,w,h)=>{g.fillStyle='#23383a';g.fillRect(0,0,w,h);for(let i=0;i<12;i++){g.strokeStyle=i%2?'#b28c52':'#71908a';g.lineWidth=7;g.beginPath();g.arc(w/2,h/2,30+i*17,0,Math.PI*2);g.stroke()}for(let i=0;i<12;i++){g.save();g.translate(w/2,h/2);g.rotate(i*Math.PI/6);g.fillStyle=i%2?'#bb9b64':'#71938a';g.fillRect(-7,-195,14,38);g.restore()}},512,512,1,1);
const mosaicMesh=new THREE.Mesh(new THREE.CircleGeometry(8.5,64),new THREE.MeshStandardMaterial({map:mosaic,roughness:.8,side:THREE.DoubleSide}));mosaicMesh.rotation.x=-Math.PI/2;mosaicMesh.position.set(0,libFloor+.035,-.5);scene.add(mosaicMesh);
const ceiling=new THREE.Mesh(new THREE.CircleGeometry(libRadius,64),new THREE.MeshStandardMaterial({color:0x192c39,roughness:.9,side:THREE.DoubleSide}));ceiling.rotation.x=Math.PI/2;ceiling.position.set(0,-6.65,-.5);scene.add(ceiling);
for(let i=0;i<180;i++){const star=new THREE.Mesh(new THREE.SphereGeometry(.025+Math.random()*.035,6,6),new THREE.MeshBasicMaterial({color:i%4?0xc6a66e:0x8fb2b4}));const a=Math.random()*Math.PI*2,r=Math.random()*11.5;star.position.set(Math.cos(a)*r,-6.55,Math.sin(a)*r-.5);scene.add(star)}
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
const roomFloor=box('piso da ala dos quartos',[21.0,17.1,-.5],[13.3,.35,12.5],woodMat,false);groundSurfaces.push(roomFloor);
for(let z of [-6.7,5.7])box('parede do quarto',[21,19,-.5+z],[13.3,4.2,.35],plaster,false);
for(let z of [-4.35,4.35])box('parede lateral do quarto',[14.4,19,z],[.35,4.2,3.8],plaster,false);
box('lintel da passagem do quarto',[14.4,20.55,-.5],[.35,.5,5.0],plaster,false);
box('parede lateral externa do quarto',[27.6,19,-.5],[.35,4.2,12.5],plaster,false);
for(let z of [-2.6,2.6])box('ombreira de calcário da ala',[15.25,18.7,z],[.55,3.6,.5],stone,false);
box('parede divisória do quarto',[21,19,-.5],[.25,4.2,12.5],plaster,false);
box('cama de madeira',[17.8,17.85,-1.2],[4.3,.7,5.4],cedarMat,false);box('colchão',[17.8,18.35,-1.2],[4.1,.45,5.1],new THREE.MeshStandardMaterial({color:0xd1c5ae,roughness:1}),false);for(let x of [16.6,19.0])box('travesseiro',[x,18.65,-3.0],[1.0,.25,1.2],new THREE.MeshStandardMaterial({color:0xebe4d5}),false);
box('mesa de estudo',[24.2,18.0,-3.8],[3.2,.22,1.5],woodMat,false);for(let x of [23.0,25.4])box('pé da mesa',[x,17.3,-3.8],[.13,1.25,.13],cedarMat,false);
box('cômoda',[24.5,18.0,3.2],[2.5,1.6,1.0],cedarMat,false);for(let y of [17.7,18.2,18.7])box('gaveta',[24.5,y,3.73],[2.2,.35,.05],gold,false);
addWindow(21,19.1,-6.25,3.4,2.0,'back');
for(let i=0;i<5;i++){const book=box('pilha de livros',[23+i*.3,18.3,-4.1],[.42,.16,.75],new THREE.MeshStandardMaterial({color:[0x6f4537,0x334e50,0x987346,0x51405c][i%4]}),false);book.rotation.z=(i-2)*.03}
const bedside=new THREE.PointLight(0xffc98b,.5,6);bedside.position.set(17.3,19.3,1.2);scene.add(bedside);
box('cama secundária',[24,17.65,1.2],[3.2,.5,3.3],leather,false);
addRoomLabel('ALA DOS QUARTOS',21,20.8,-6.15);
// Ponto de referência: placa discreta no pátio.
const info=box('placa de identificação',[ -22,2.3,24],[.08,2.3,3.2],metal,false);const sign=new THREE.Mesh(new THREE.PlaneGeometry(2.8,1.65),canvasSign('BROOKLYN HOUSE'));sign.position.set(-21.94,2.4,24);sign.rotation.y=Math.PI/2;scene.add(sign);
// Luzes interiores quentes.
for(let x of [-8,0,8])for(let z of [-6,5]){const lamp=new THREE.PointLight(0xffd39a,.45,12);lamp.position.set(x,25.5,z);scene.add(lamp)}

 return {zones,groundSurfaces,water,fireLight};
}

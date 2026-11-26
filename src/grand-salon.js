import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

function seeded(seed) { let n=seed>>>0; return () => ((n=(n*1664525+1013904223)>>>0)/4294967296); }

function tex(draw, w=1024, h=1024, rx=1, ry=1) {
  const c=document.createElement('canvas'); c.width=w; c.height=h;
  draw(c.getContext('2d'),w,h);
  const t=new THREE.CanvasTexture(c); t.colorSpace=THREE.SRGBColorSpace;
  t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(rx,ry); t.anisotropy=8; return t;
}

function stoneMaterial() {
  const r=seeded(221);
  const map=tex((g,w,h)=>{
    g.fillStyle='#bba986'; g.fillRect(0,0,w,h);
    for(let y=0,row=0;y<h;y+=168,row++){
      const offset=row%2?-118:0;
      for(let x=offset;x<w;x+=238){
        const palette=['#c9ba98','#b8a47f','#d0c19d','#ad9b78'];
        g.fillStyle=palette[Math.floor(r()*palette.length)];
        g.fillRect(x+r()*4,y+r()*3,232,162);
        g.strokeStyle='rgba(65,49,31,0.2)';g.lineWidth=4;g.strokeRect(x,y,232,162);
        g.strokeStyle='rgba(248,229,191,0.25)';g.lineWidth=2;g.beginPath();g.moveTo(x+5,y+6);g.lineTo(x+226,y+6);g.stroke();
      }
    }
    for(let i=0;i<23000;i++){
      const a=0.025+r()*0.07;g.fillStyle=r()>0.5?'rgba(255,240,211,'+a+')':'rgba(65,48,31,'+a+')';
      const s=1+r()*2.5;g.fillRect(r()*w,r()*h,s,s);
    }
    for(let i=0;i<70;i++){
      const x=r()*w,y=r()*h;g.strokeStyle='rgba(88,68,42,'+(0.05+r()*0.08)+')';g.lineWidth=1+r()*2;
      g.beginPath();g.moveTo(x,y);g.bezierCurveTo(x+20,y-6,x+43,y+10,x+68,y+2);g.stroke();
    }
  },1024,1024,2,1.4);
  const bump=tex((g,w,h)=>{
    g.fillStyle='#888';g.fillRect(0,0,w,h);
    for(let i=0;i<34000;i++){const v=Math.floor(78+r()*96);g.fillStyle='rgb('+v+','+v+','+v+')';const s=1+r()*2.2;g.fillRect(r()*w,r()*h,s,s);}
    g.strokeStyle='#555';g.lineWidth=3;for(let y=0;y<h;y+=168){g.beginPath();g.moveTo(0,y);g.lineTo(w,y+(r()-.5)*6);g.stroke();}
  },1024,1024,2,1.4); bump.colorSpace=THREE.NoColorSpace;
  return new THREE.MeshStandardMaterial({map,bumpMap:bump,bumpScale:.045,roughness:.94});
}

function woodMaterial() {
  const r=seeded(831);
  const map=tex((g,w,h)=>{
    const grad=g.createLinearGradient(0,0,w,0);
    grad.addColorStop(0,'#342015');grad.addColorStop(.3,'#68442a');grad.addColorStop(.58,'#55351f');grad.addColorStop(1,'#2b1a12');
    g.fillStyle=grad;g.fillRect(0,0,w,h);
    for(let i=0;i<1400;i++){const x=r()*w,y=r()*h;g.strokeStyle=r()>.5?'rgba(211,162,108,0.1)':'rgba(15,8,5,0.19)';g.lineWidth=.5+r()*2;g.beginPath();g.moveTo(x,y);g.bezierCurveTo(x+50,y-3,x+90,y+5,x+160,y+(r()-.5)*7);g.stroke();}
    for(let i=0;i<8;i++){const x=r()*w,y=r()*h;g.strokeStyle='rgba(18,9,5,0.28)';g.beginPath();g.ellipse(x,y,12+r()*22,3+r()*5,r(),0,Math.PI*2);g.stroke();}
  },1024,512,2.2,1);
  const bump=tex((g,w,h)=>{
    g.fillStyle='#777';g.fillRect(0,0,w,h);
    for(let i=0;i<25000;i++){const v=Math.floor(95+r()*76);g.fillStyle='rgb('+v+','+v+','+v+')';g.fillRect(r()*w,r()*h,1+r()*2,1+r());}
  },1024,512,2.2,1);bump.colorSpace=THREE.NoColorSpace;
  return new THREE.MeshStandardMaterial({map,bumpMap:bump,bumpScale:.02,roughness:.78});
}

function marbleMaterial() {
  const r=seeded(511);
  const map=tex((g,w,h)=>{
    g.fillStyle='#171b1b';g.fillRect(0,0,w,h);
    for(let i=0;i<150;i++){const x=r()*w,y=r()*h;g.strokeStyle=r()>.6?'rgba(197,170,128,0.2)':'rgba(100,126,119,0.16)';g.lineWidth=1+r()*3;g.beginPath();g.moveTo(x,y);g.bezierCurveTo(x+55,y-75,x+126,y+42,x+230,y-18);g.stroke();}
    for(let i=0;i<16000;i++){g.fillStyle=r()>.5?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.09)';g.fillRect(r()*w,r()*h,1+r()*2,1+r()*2);}
  },1024,1024,1,1);
  return new THREE.MeshStandardMaterial({map,roughness:.29,metalness:.12});
}

function tube(points,radius,material,segments=48,radial=8) {
  const curve=new THREE.CatmullRomCurve3(points.map(p=>Array.isArray(p)?new THREE.Vector3(...p):p));
  const m=new THREE.Mesh(new THREE.TubeGeometry(curve,segments,radius,radial,false),material);
  m.castShadow=true;m.receiveShadow=true;return m;
}

function lotusColumn(scene,x,z,stone,pale,brass) {
  const shaft=scene.children.find(o=>o.name==='coluna de calcário'&&Math.abs(o.position.x-x)<.01&&Math.abs(o.position.z-z)<.01);
  if(shaft){shaft.geometry.dispose();shaft.geometry=new THREE.CylinderGeometry(.72,.78,14.9,48,1);shaft.material=stone;}
  const flutes=new THREE.CapsuleGeometry(.027,13.1,4,8);
  const fluteMat=new THREE.MeshStandardMaterial({color:0xd0bd9b,roughness:.88,bumpMap:stone.bumpMap,bumpScale:.014});
  for(let i=0;i<16;i++){const a=i/16*Math.PI*2;const m=new THREE.Mesh(flutes,fluteMat);m.name='canelura da coluna';m.position.set(x+Math.cos(a)*.69,20.65,z+Math.sin(a)*.69);m.castShadow=true;scene.add(m);}
  for(const spec of [[13.48,.83,brass],[13.72,.79,pale],[27.2,.82,brass],[27.42,.88,pale]]){
    const ring=new THREE.Mesh(new THREE.TorusGeometry(spec[1],.052,10,64),spec[2]);ring.rotation.x=Math.PI/2;ring.position.set(x,spec[0],z);scene.add(ring);
  }
  const cap=new THREE.Mesh(new THREE.LatheGeometry([
    new THREE.Vector2(.7,0),new THREE.Vector2(.78,.12),new THREE.Vector2(.85,.28),
    new THREE.Vector2(.98,.48),new THREE.Vector2(1.08,.63),new THREE.Vector2(1.03,.76),
    new THREE.Vector2(.87,.9),new THREE.Vector2(.76,1.03)
  ],48),stone);
  cap.name='capitel de lótus';cap.position.set(x,27.35,z);cap.castShadow=true;scene.add(cap);
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2;const petal=new THREE.Mesh(new THREE.SphereGeometry(.39,18,14),pale);petal.position.set(x+Math.cos(a)*.72,28.02,z+Math.sin(a)*.72);petal.scale.set(.57,.42,1);petal.rotation.y=a;petal.castShadow=true;scene.add(petal);}
  const necking=new THREE.Mesh(new THREE.CylinderGeometry(.76,.76,.2,48),brass);necking.position.set(x,28.26,z);scene.add(necking);
}

function stairFlight(scene,stone,treadMaterial,brass,wood,options) {
  const {
    centerX,baseY,topY,startZ,direction,width=1.8,depth=.59,count=14
  }=options;
  const rise=(topY-baseY)/count;
  const thick=.21;
  const left=[],right=[],lowL=[],lowR=[];
  const balusterGeo=new THREE.LatheGeometry([
    new THREE.Vector2(.035,0),new THREE.Vector2(.055,.1),new THREE.Vector2(.11,.24),
    new THREE.Vector2(.07,.42),new THREE.Vector2(.045,.58),new THREE.Vector2(.08,.76),
    new THREE.Vector2(.045,.88)
  ],16);

  for(let i=0;i<count;i++){
    const top=baseY+(i+1)*rise;
    const z=startZ+direction*(i+.5)*depth;
    const tread=new THREE.Mesh(new RoundedBoxGeometry(width,thick,depth+.025,5,.045),i%2?stone:treadMaterial);
    tread.name='degrau de pedra da escadaria do Grande Salão';
    tread.position.set(centerX,top-thick/2,z);
    tread.castShadow=true;tread.receiveShadow=true;scene.add(tread);

    const nosing=new THREE.Mesh(new RoundedBoxGeometry(width-.08,.035,.065,4,.014),brass);
    nosing.name='filete de bronze no degrau';
    nosing.position.set(centerX,top-.035,z-direction*depth*.46);
    scene.add(nosing);

    const xL=centerX-width*.49,xR=centerX+width*.49,railY=top+.94;
    left.push([xL,railY,z]);right.push([xR,railY,z]);
    lowL.push([xL,top+.15,z]);lowR.push([xR,top+.15,z]);

    if(i%2===0){
      for(const x of [xL,xR]){
        const baluster=new THREE.Mesh(balusterGeo,brass);
        baluster.position.set(x,top+.13,z);
        baluster.name='balaústre torneado da escadaria';
        baluster.castShadow=true;scene.add(baluster);
      }
    }
  }

  scene.add(
    tube(left,.065,wood,64,10),
    tube(right,.065,wood,64,10),
    tube(left.map(p=>[p[0],p[1]-.065,p[2]]),.018,brass,64,8),
    tube(right.map(p=>[p[0],p[1]-.065,p[2]]),.018,brass,64,8),
    tube(lowL,.035,brass,64,8),
    tube(lowR,.035,brass,64,8)
  );

  const endZ=startZ+direction*count*depth;
  const landing=new THREE.Mesh(new RoundedBoxGeometry(width+.3,.24,1.55,5,.055),stone);
  landing.name='patamar de mudança de nível da escadaria';
  landing.position.set(centerX,topY-.12,endZ+direction*.33);
  landing.castShadow=true;landing.receiveShadow=true;scene.add(landing);

  const postGeo=new THREE.LatheGeometry([
    new THREE.Vector2(.13,0),new THREE.Vector2(.17,.16),
    new THREE.Vector2(.12,.36),new THREE.Vector2(.21,.54),
    new THREE.Vector2(.22,.83),new THREE.Vector2(.1,1.1),
    new THREE.Vector2(.06,1.23)
  ],20);
  for(const [z,y] of [[startZ,baseY],[endZ+direction*.15,topY]]){
    for(const dx of [-1,1]){
      const post=new THREE.Mesh(postGeo,brass);
      post.position.set(centerX+dx*(width*.52),y+.08,z);
      post.name='poste de início ou fim da escadaria';
      post.castShadow=true;scene.add(post);
    }
  }

  return {centerX,width,startZ,endZ,bottomY:baseY,topY};
}

function addBalustrades(scene,stone,brass,wood) {
  scene.traverse(o=>{if(o.name==='guarda-corpo da sacada'||o.name==='balaústre'||o.name==='viga sacada')o.visible=false;});
  const geo=new THREE.LatheGeometry([
    new THREE.Vector2(.035,0),new THREE.Vector2(.07,.08),new THREE.Vector2(.065,.17),
    new THREE.Vector2(.105,.28),new THREE.Vector2(.09,.42),new THREE.Vector2(.055,.54),
    new THREE.Vector2(.045,.72),new THREE.Vector2(.075,.82)
  ],16);
  for(let level=0;level<3;level++){
    const y=16.6+level*3.75;
    for(const side of [-1,1]){
      const x=side*13.1,pts=[],low=[];
      for(let i=0;i<=20;i++){const z=-8.75+i*.875;pts.push([x,y+1.03,z]);low.push([x,y+.16,z]);}
      scene.add(tube(pts,.075,wood,72,10),tube(pts.map(p=>[p[0],p[1]-.07,p[2]]),.019,brass,72,8),tube(low,.045,brass,72,8));
      for(let i=0;i<=22;i++){const z=-8.55+i*.78;const b=new THREE.Mesh(geo,stone);b.name='balaústre torneado da galeria';b.position.set(x,y+.17,z);b.castShadow=true;scene.add(b);}
      for(const z of [-8.95,8.95]){const n=new THREE.Mesh(new THREE.LatheGeometry([new THREE.Vector2(.12,0),new THREE.Vector2(.16,.18),new THREE.Vector2(.11,.38),new THREE.Vector2(.2,.55),new THREE.Vector2(.23,.78),new THREE.Vector2(.13,1.02),new THREE.Vector2(.06,1.18)],20),brass);n.position.set(x,y,z);n.name='poste monumental da galeria';n.castShadow=true;scene.add(n);}
    }
  }
}

function reliefTexture() {
  return tex((g,w,h)=>{
    const grad=g.createLinearGradient(0,0,w,h);grad.addColorStop(0,'#213a40');grad.addColorStop(.55,'#31545a');grad.addColorStop(1,'#182e35');
    g.fillStyle=grad;g.fillRect(0,0,w,h);g.strokeStyle='#c19b5e';g.lineWidth=10;g.strokeRect(18,18,w-36,h-36);
    g.strokeStyle='rgba(230,197,132,.75)';g.lineWidth=3;g.strokeRect(38,38,w-76,h-76);
    g.fillStyle='#d9bd7e';g.beginPath();g.arc(w/2,h*.35,68,0,Math.PI*2);g.fill();
    g.strokeStyle='#d9bd7e';g.lineWidth=8;g.beginPath();g.moveTo(w/2-60,h*.38);g.bezierCurveTo(w*.32,h*.14,w*.16,h*.19,54,h*.25);g.bezierCurveTo(w*.18,h*.49,w*.35,h*.5,w/2-70,h*.42);g.moveTo(w/2+60,h*.38);g.bezierCurveTo(w*.68,h*.14,w*.84,h*.19,w-54,h*.25);g.bezierCurveTo(w*.82,h*.49,w*.65,h*.5,w/2+70,h*.42);g.stroke();
    g.strokeStyle='#c4a16b';g.lineWidth=4;for(let i=0;i<7;i++){const y=h*.58+i*34;g.beginPath();g.moveTo(75,y);g.lineTo(w-75,y);g.stroke();for(let x=90;x<w-70;x+=85){g.beginPath();g.arc(x,y+14,8,0,Math.PI*2);g.stroke();}}
  },512,768,1,1);
}

function addWallReliefs(scene,brass,wood,stone,texture) {
  const mat=new THREE.MeshStandardMaterial({map:texture,roughness:.76,metalness:.12});
  for(const side of [-1,1])for(const z of [-5.3,3.4]){
    const x=side*14.0;
    const frame=new THREE.Mesh(new RoundedBoxGeometry(.16,4.2,2.55,5,.08),wood);frame.position.set(x,20,z);frame.castShadow=true;scene.add(frame);
    const plane=new THREE.Mesh(new THREE.PlaneGeometry(2.22,3.82),mat);plane.position.set(x-side*.095,20,z);plane.rotation.y=side===1?-Math.PI/2:Math.PI/2;scene.add(plane);
    for(const zo of [-1.25,1.25]){const pin=new THREE.Mesh(new THREE.SphereGeometry(.08,12,10),brass);pin.position.set(x-side*.14,20,z+zo);scene.add(pin);}
  }
  for(const side of [-1,1]){
    const p=new THREE.Mesh(new THREE.LatheGeometry([
      new THREE.Vector2(.3,0),new THREE.Vector2(.38,.18),new THREE.Vector2(.32,.32),new THREE.Vector2(.27,2.7),new THREE.Vector2(.32,2.9),new THREE.Vector2(.42,3.12),new THREE.Vector2(.35,3.3)
    ],32),stone);p.position.set(side*3.25,14,-9);p.name='pilastra esculpida da lareira';p.castShadow=true;scene.add(p);
    for(const y of [14.25,17]){const ring=new THREE.Mesh(new THREE.TorusGeometry(.34,.03,8,32),brass);ring.rotation.x=Math.PI/2;ring.position.set(side*3.25,y,-9);scene.add(ring);}
  }
}

function ceilingOrnament(scene,brass,wood) {
  const med=new THREE.Mesh(new THREE.CylinderGeometry(3.35,3.55,.14,96),wood);med.name='medalhão de cedro do teto';med.position.set(0,28.28,-.5);med.castShadow=true;scene.add(med);
  for(const r of [2.85,3.05,3.28]){const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.035,10,96),brass);ring.rotation.x=Math.PI/2;ring.position.set(0,28.19,-.5);scene.add(ring);}
  const rosette=new THREE.Mesh(new THREE.OctahedronGeometry(.68,1),brass);rosette.position.set(0,28.08,-.5);rosette.scale.set(1,.17,1);scene.add(rosette);
  for(let i=0;i<24;i++){const a=i/24*Math.PI*2;const bead=new THREE.Mesh(new THREE.SphereGeometry(.055,12,8),brass);bead.position.set(Math.cos(a)*2.45,28.06,Math.sin(a)*2.45-.5);scene.add(bead);}
}

function createSofa(scene,x,z,rotation,upholstery,wood,brass) {
  const group=new THREE.Group();
  group.name='sofá estofado do Grande Salão';
  group.position.set(x,13.175,z);
  group.rotation.y=rotation;

  const base=new THREE.Mesh(new RoundedBoxGeometry(4.65,.34,1.95,8,.15),wood);
  base.position.y=.27;base.castShadow=true;base.receiveShadow=true;group.add(base);

  const seat=new THREE.Mesh(new RoundedBoxGeometry(4.44,.27,1.72,10,.12),upholstery);
  seat.position.set(0,.59,.04);seat.castShadow=true;seat.receiveShadow=true;group.add(seat);

  const back=new THREE.Mesh(new RoundedBoxGeometry(4.48,.98,.43,10,.15),upholstery);
  back.position.set(0,1.16,-.68);back.castShadow=true;group.add(back);

  for(const side of [-1,1]){
    const arm=new THREE.Mesh(new RoundedBoxGeometry(.66,.82,1.82,9,.2),upholstery);
    arm.position.set(side*2.0,.89,.02);arm.castShadow=true;group.add(arm);

    const cap=new THREE.Mesh(new RoundedBoxGeometry(.7,.1,1.72,7,.045),wood);
    cap.position.set(side*2.0,1.34,.02);group.add(cap);

    for(const z0 of [-.72,.72]){
      const foot=new THREE.Mesh(new THREE.CylinderGeometry(.085,.12,.24,18),brass);
      foot.position.set(side*1.96,.16,z0);group.add(foot);
    }
  }

  for(const offset of [-1.45,0,1.45]){
    const cushion=new THREE.Mesh(new RoundedBoxGeometry(1.4,.19,1.36,9,.085),upholstery);
    cushion.position.set(offset,.82,.03);cushion.castShadow=true;group.add(cushion);

    const rear=new THREE.Mesh(new RoundedBoxGeometry(1.4,.72,.3,9,.11),upholstery);
    rear.position.set(offset,1.33,-.53);rear.castShadow=true;group.add(rear);

    for(const dx of [-.22,0,.22]){
      const button=new THREE.Mesh(new THREE.SphereGeometry(.032,10,8),brass);
      button.position.set(offset+dx,1.33,-.34);group.add(button);
    }
    const seam=tube([[offset-.58,.91,.68],[offset,.92,.72],[offset+.58,.91,.68]],.008,brass,22,5);
    group.add(seam);
  }

  group.add(tube([[-2,.42,.98],[-1,.42,1],[0,.42,1],[1,.42,1],[2,.42,.98]],.032,brass,32,7));
  scene.add(group);
}
function createRug(scene) {
  const t=tex((g,w,h)=>{
    g.fillStyle='#182f35';g.fillRect(0,0,w,h);
    const grad=g.createRadialGradient(w/2,h/2,20,w/2,h/2,w*.55);grad.addColorStop(0,'#38565a');grad.addColorStop(.48,'#263f45');grad.addColorStop(1,'#14252c');g.fillStyle=grad;g.fillRect(0,0,w,h);
    g.strokeStyle='#c29a5d';for(const i of [18,36,58,82]){g.lineWidth=i===18?10:3;g.strokeRect(i,i,w-i*2,h-i*2);}
    g.save();g.translate(w/2,h/2);g.strokeStyle='#d0ad73';g.lineWidth=5;
    for(let i=0;i<16;i++){g.rotate(Math.PI/8);g.beginPath();g.moveTo(0,-80);g.quadraticCurveTo(36,-155,0,-245);g.quadraticCurveTo(-36,-155,0,-80);g.stroke();}
    g.beginPath();g.arc(0,0,78,0,Math.PI*2);g.stroke();g.fillStyle='#d6b578';g.font='70px serif';g.textAlign='center';g.fillText('𓇳',0,22);g.restore();
    for(let i=0;i<3500;i++){g.fillStyle=Math.random()>.5?'rgba(245,221,174,.045)':'rgba(2,12,16,.09)';g.fillRect(Math.random()*w,Math.random()*h,1+Math.random()*3,1+Math.random()*2);}
  },1024,1024,1,1);
  const rug=new THREE.Mesh(new THREE.CircleGeometry(1,112),new THREE.MeshStandardMaterial({map:t,roughness:.98}));
  rug.name='tapete oval de lã do Grande Salão';rug.rotation.x=-Math.PI/2;rug.scale.set(6,1,3);rug.position.set(0,13.205,3.45);rug.receiveShadow=true;scene.add(rug);
  for(const spec of [[2.7,.023],[4.7,.018]]){const ring=new THREE.Mesh(new THREE.TorusGeometry(spec[0],spec[1],7,100),new THREE.MeshStandardMaterial({color:0xb88b4d,metalness:.58,roughness:.55}));ring.rotation.x=Math.PI/2;ring.position.set(0,13.22,3.45);ring.scale.z=.57;scene.add(ring);}
}

function centerTable(scene,wood,brass) {
  const group=new THREE.Group();
  group.name='mesa redonda do Grande Salão';
  group.position.set(0,13.175,3.45);

  const base=new THREE.Mesh(new THREE.LatheGeometry([
    new THREE.Vector2(.22,0),new THREE.Vector2(.34,.12),new THREE.Vector2(.23,.32),
    new THREE.Vector2(.2,.63),new THREE.Vector2(.36,.84),new THREE.Vector2(.42,.96)
  ],36),wood);
  base.position.y=.02;base.scale.y=.58;base.castShadow=true;group.add(base);

  const top=new THREE.Mesh(new THREE.CylinderGeometry(1.48,1.4,.18,64,1),wood);
  top.position.y=.68;top.castShadow=true;top.receiveShadow=true;group.add(top);

  const edge=new THREE.Mesh(new THREE.TorusGeometry(1.43,.05,10,72),brass);
  edge.rotation.x=Math.PI/2;edge.position.y=.775;group.add(edge);

  const inset=new THREE.Mesh(new THREE.CircleGeometry(1.25,64),new THREE.MeshStandardMaterial({color:0x20383b,roughness:.7,metalness:.18}));
  inset.rotation.x=-Math.PI/2;inset.position.y=.773;group.add(inset);

  const sun=new THREE.Mesh(new THREE.TorusGeometry(.48,.032,8,48),brass);
  sun.rotation.x=Math.PI/2;sun.position.y=.784;group.add(sun);
  scene.add(group);
}
function flameGeometry(width,height,depth,phase) {
  const rows=22,radial=14,pos=[],col=[],idx=[];
  const c0=new THREE.Color(0xc91f08),c1=new THREE.Color(0xff5a0b),c2=new THREE.Color(0xffbd32),c3=new THREE.Color(0xfff0a2);
  for(let j=0;j<=rows;j++){
    const t=j/rows,profile=Math.pow(.28+.72*Math.sin(t*Math.PI*.5),.55)*Math.pow(1-t,.78);
    const radius=width*profile,centerX=Math.sin(t*5.4+phase)*width*.22*t,centerZ=Math.sin(t*6.8+phase*1.7)*depth*.15;
    let color=t<.22?c0.clone().lerp(c1,t/.22):t<.66?c1.clone().lerp(c2,(t-.22)/.44):c2.clone().lerp(c3,(t-.66)/.34);
    for(let k=0;k<=radial;k++){
      const a=k/radial*Math.PI*2,ripple=1+.11*Math.sin(a*3+phase+t*9)+.055*Math.sin(a*5-t*12);
      pos.push(centerX+Math.cos(a)*radius*ripple,t*height,centerZ+Math.sin(a)*radius*depth/Math.max(width,.001)*ripple);
      const f=.82+.18*Math.sin(a+phase);col.push(color.r*f,color.g*f,color.b*f);
      if(j<rows&&k<radial){const p=j*(radial+1)+k,n=p+radial+1;idx.push(p,n,p+1,p+1,n,n+1);}
    }
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.setIndex(idx);g.computeVertexNormals();return g;
}

function addFire(scene,animated) {
  const logMat=woodMaterial();
  for(let i=0;i<4;i++){const log=new THREE.Mesh(new THREE.CylinderGeometry(.075,.095,1.15,14),logMat);log.name='lenha da lareira';log.position.set(-.75+i*.48,14.35+(i%2)*.035,-8.23);log.rotation.z=Math.PI/2+(i%2?.12:-.08);log.rotation.x=i%2?.2:-.18;log.castShadow=true;scene.add(log);}
  const ember=new THREE.Mesh(new THREE.SphereGeometry(1,32,18),new THREE.MeshStandardMaterial({color:0x511b10,emissive:0x9d2c07,emissiveIntensity:.75,roughness:.9}));
  ember.name='brasa da lareira';ember.scale.set(1.62,.13,.32);ember.position.set(0,14.28,-8.31);scene.add(ember);
  const outerMat=new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide,transparent:true,opacity:.97,blending:THREE.AdditiveBlending,depthWrite:false});
  const coreMat=new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide,transparent:true,opacity:.98,blending:THREE.AdditiveBlending,depthWrite:false});
  const tongues=[[-1.53,1.05,.25,.25],[-1.15,1.45,.34,.12],[-.76,1.17,.27,.4],[-.34,1.62,.34,.2],[.05,1.38,.31,.07],[.43,1.55,.32,.34],[.84,1.18,.29,.18],[1.19,1.4,.34,.26],[1.52,.98,.24,.15]];
  for(let i=0;i<tongues.length;i++){
    const v=tongues[i],phase=i*1.73,group=new THREE.Group();group.name='língua orgânica de fogo';
    const outer=new THREE.Mesh(flameGeometry(v[2],v[1],v[3],phase),outerMat);outer.name='chama externa laranja';outer.position.set(v[0],0,-8.28+(i%3)*.025);group.add(outer);
    if(i%2===0||i===4){const inner=new THREE.Mesh(flameGeometry(v[2]*.42,v[1]*.67,v[3]*.62,phase+.9),coreMat);inner.name='núcleo amarelo da chama';inner.position.set(v[0]-.015,.025,-8.02+(i%2)*.03);group.add(inner);}
    group.position.set(0,14.3,0);scene.add(group);
    animated.push({obj:group,fire:true,phase,baseY:14.3,baseRotationZ:(i-tongues.length/2)*.012,baseScaleY:1});
  }
  for(let i=0;i<18;i++){
    const sparkMat=new THREE.MeshBasicMaterial({color:i%4===0?0xffdf8a:0xffa337,transparent:true,opacity:.82,blending:THREE.AdditiveBlending});
    const s=new THREE.Mesh(new THREE.SphereGeometry(.018+(i%3)*.009,8,6),sparkMat);
    s.name='faísca de fogo';s.position.set((Math.random()-.5)*2.7,14.55+Math.random()*.8,-8.12+Math.random()*.25);scene.add(s);
    animated.push({obj:s,phase:i*.82,particle:true,baseX:s.position.x,baseY:s.position.y,baseZ:s.position.z});
  }

  const glowMap=tex((g,w,h)=>{
    const gradient=g.createRadialGradient(w/2,h/2,8,w/2,h/2,w*.48);
    gradient.addColorStop(0,'rgba(255,220,128,0.42)');
    gradient.addColorStop(.22,'rgba(255,123,35,0.24)');
    gradient.addColorStop(.58,'rgba(238,65,12,0.08)');
    gradient.addColorStop(1,'rgba(238,65,12,0)');
    g.fillStyle=gradient;g.fillRect(0,0,w,h);
  },256,256,1,1);
  const glow=new THREE.Mesh(new THREE.PlaneGeometry(4.4,2.6),new THREE.MeshBasicMaterial({map:glowMap,transparent:true,opacity:.72,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));
  glow.name='halo quente da chama';glow.position.set(0,15.35,-8.57);scene.add(glow);
  const light=new THREE.PointLight(0xff7b25,4.8,17,1.55);light.name='luz dinâmica da lareira';light.position.set(0,15.05,-7.35);scene.add(light);
  const fill=new THREE.PointLight(0xffa54d,1.7,10,1.9);fill.position.set(0,14.55,-8);scene.add(fill);
  return light;
}

function addThoth(scene,marble,pale,brass,reliefTex) {
  const group=new THREE.Group();group.name='estátua monumental de Thoth em basalto';group.position.set(0,13.175,-.5);
  const plinth=new THREE.Mesh(new RoundedBoxGeometry(3,.48,3,6,.13),pale);plinth.position.y=.24;plinth.castShadow=true;plinth.receiveShadow=true;group.add(plinth);
  const step=new THREE.Mesh(new RoundedBoxGeometry(2.62,.28,2.62,6,.1),marble);step.position.y=.6;step.castShadow=true;group.add(step);
  const footRing=new THREE.Mesh(new THREE.TorusGeometry(.96,.055,10,56),brass);footRing.rotation.x=Math.PI/2;footRing.position.y=.78;group.add(footRing);
  const dais=new THREE.Mesh(new THREE.LatheGeometry([new THREE.Vector2(.68,0),new THREE.Vector2(.82,.14),new THREE.Vector2(.88,.31),new THREE.Vector2(.78,.52),new THREE.Vector2(.7,.65)],48),marble);dais.position.y=.72;dais.castShadow=true;group.add(dais);
  const robe=new THREE.Mesh(new THREE.LatheGeometry([
    new THREE.Vector2(.48,0),new THREE.Vector2(.57,.09),new THREE.Vector2(.65,.28),new THREE.Vector2(.61,.48),
    new THREE.Vector2(.53,.72),new THREE.Vector2(.46,1.16),new THREE.Vector2(.43,1.75),new THREE.Vector2(.5,2.28),
    new THREE.Vector2(.72,2.62),new THREE.Vector2(.77,2.82),new THREE.Vector2(.61,3.02),new THREE.Vector2(.34,3.2),new THREE.Vector2(.24,3.47)
  ],64),marble);robe.name='túnica esculpida de Thoth';robe.position.y=1.34;robe.castShadow=true;robe.receiveShadow=true;group.add(robe);
  for(let i=0;i<9;i++){const x=-.39+i*.0975;group.add(tube([[x*.78,1.54,.43],[x,1.9,.49],[x*1.1,2.55,.56],[x*1.18,3.05,.54],[x*.9,3.7,.42]],.012,pale,26,6));}
  const gold=new THREE.MeshStandardMaterial({color:0xb78c4c,metalness:.72,roughness:.29});
  const goldL=new THREE.MeshStandardMaterial({color:0xd4b16f,metalness:.68,roughness:.25});
  const waist=new THREE.Mesh(new THREE.TorusGeometry(.55,.075,10,56),gold);waist.rotation.x=Math.PI/2;waist.position.set(0,2.38,.02);group.add(waist);
  for(const y of [4.18,4.3,4.42]){const c=new THREE.Mesh(new THREE.TorusGeometry(.43+(y-4.18)*.55,.055,10,64),gold);c.rotation.x=Math.PI/2;c.position.set(0,y,.02);c.scale.set(1.22,1,.72);group.add(c);}
  const neck=new THREE.Mesh(new THREE.CylinderGeometry(.22,.29,.9,32),marble);neck.position.set(0,4.48,0);neck.castShadow=true;group.add(neck);
  const head=new THREE.Mesh(new THREE.SphereGeometry(.43,32,24),marble);head.name='cabeça de íbis de Thoth';head.position.set(0,5.05,.03);head.scale.set(.76,1.16,.87);head.castShadow=true;group.add(head);
  const beak=new THREE.Mesh(new THREE.LatheGeometry([new THREE.Vector2(.17,0),new THREE.Vector2(.155,.16),new THREE.Vector2(.12,.39),new THREE.Vector2(.075,.68),new THREE.Vector2(.035,.91),new THREE.Vector2(.008,1)],28),marble);beak.name='bico de íbis de Thoth';beak.rotation.x=Math.PI/2;beak.position.set(0,5.15,.29);beak.castShadow=true;group.add(beak);
  const eyeGold=new THREE.MeshStandardMaterial({color:0xc8a45f,metalness:.7,roughness:.22});
  const pupil=new THREE.MeshStandardMaterial({color:0x14100a,roughness:.35});
  for(const s of [-1,1]){const socket=new THREE.Mesh(new THREE.SphereGeometry(.092,16,12),gold);socket.position.set(s*.265,5.19,.235);socket.scale.set(1,.8,.48);group.add(socket);const eye=new THREE.Mesh(new THREE.SphereGeometry(.05,14,10),eyeGold);eye.position.set(s*.265,5.19,.278);group.add(eye);const dot=new THREE.Mesh(new THREE.SphereGeometry(.021,12,8),pupil);dot.position.set(s*.265,5.19,.302);group.add(dot);}
  for(const s of [-1,1]){
    group.add(tube([[s*.63,4,.02],[s*.88,3.72,.07],[s*.92,3.25,.13]],.17,marble,26,12));
    group.add(tube([[s*.92,3.25,.13],[s*.85,2.96,.17],[s*.78,2.78,.21]],.125,marble,20,12));
    const hand=new THREE.Mesh(new THREE.SphereGeometry(.14,16,12),marble);hand.position.set(s*.78,2.69,.22);hand.scale.set(.88,1.25,.78);group.add(hand);
    for(let i=0;i<4;i++){const x=s*(.69+i*.055);group.add(tube([[x,2.65,.29],[x+s*.018,2.5,.32],[x+s*.01,2.42,.31]],.035,marble,10,7));}
    const cuff=new THREE.Mesh(new THREE.TorusGeometry(.14,.032,8,24),gold);cuff.rotation.x=Math.PI/2;cuff.position.set(s*.78,2.86,.2);group.add(cuff);
  }
  const scroll=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.92,18),pale);scroll.position.set(-.79,3.14,.29);scroll.rotation.z=.18;group.add(scroll);
  const staff=new THREE.Mesh(new THREE.CylinderGeometry(.037,.05,3,16),gold);staff.position.set(.98,3.05,.14);staff.rotation.z=-.08;group.add(staff);
  const ankh=new THREE.Mesh(new THREE.TorusGeometry(.13,.028,8,24),goldL);ankh.position.set(.98,4.62,.14);ankh.rotation.y=Math.PI/2;group.add(ankh);
  for(const s of [-1,1]){const lappet=new THREE.Mesh(new RoundedBoxGeometry(.18,.94,.34,4,.075),marble);lappet.position.set(s*.3,4.72,-.19);lappet.rotation.z=s*.08;group.add(lappet);const feather=new THREE.Mesh(new THREE.SphereGeometry(.22,18,12),pale);feather.position.set(s*.37,5.35,-.08);feather.scale.set(.46,1.4,.25);feather.rotation.z=s*-.4;group.add(feather);}
  const disc=new THREE.Mesh(new THREE.SphereGeometry(.38,24,16),goldL);disc.position.set(0,5.86,-.18);disc.scale.set(1,1,.18);group.add(disc);
  group.add(tube([[-.58,5.78,-.18],[-.55,6.08,-.18],[-.3,6.23,-.18],[0,6.28,-.18],[.3,6.23,-.18],[.55,6.08,-.18],[.58,5.78,-.18]],.055,gold,36,8));
  const plaque=new THREE.Mesh(new RoundedBoxGeometry(1.15,.42,.09,4,.04),new THREE.MeshStandardMaterial({color:0x322116,roughness:.82}));plaque.position.set(0,.3,1.52);group.add(plaque);
  const panel=new THREE.Mesh(new THREE.PlaneGeometry(.97,.23),new THREE.MeshBasicMaterial({map:reliefTex}));panel.position.set(0,.3,1.571);group.add(panel);
  group.scale.setScalar(1.25);
  scene.add(group);
  const spot=new THREE.SpotLight(0xe9d2a0,46,27,Math.PI/7,.62,1.15);spot.position.set(-3.6,27.2,3);spot.target.position.set(0,18.2,-.5);scene.add(spot,spot.target);
  const fill=new THREE.PointLight(0x8ea4a5,1,14,1.8);fill.position.set(2.3,19.4,2.6);scene.add(fill);
}

export function buildGrandSalon({ THREE: T, scene, animated=[] }) {
  const stone=stoneMaterial(),walnut=woodMaterial(),marble=marbleMaterial();
  const brass=new T.MeshStandardMaterial({color:0xb78d4f,metalness:.7,roughness:.31});
  const pale=new T.MeshStandardMaterial({color:0xd3c09a,roughness:.9,bumpMap:stone.bumpMap,bumpScale:.03});
  const darkWood=new T.MeshStandardMaterial({color:0x4a2d1d,map:walnut.map,bumpMap:walnut.bumpMap,bumpScale:.018,roughness:.78});
  const relief=reliefTexture();

  scene.traverse(o=>{
    if(['sofá legado do Grande Salão','tapete legado do Grande Salão','mesa de centro legado','pé mesa legado','guarda-corpo da sacada','balaústre','viga sacada'].includes(o.name))o.visible=false;
    if(o.name==='parede interna do salão'||o.name==='parede lateral do salão'||o.name==='sacada de calcário'||o.name==='piso do Grande Salão'||o.name==='coluna de calcário'||o.name==='moldura da lareira'||o.name==='manto de pedra')o.material=stone;
  });

  for(const x of [-8.8,8.8])for(const z of [-6.7,6.3])lotusColumn(scene,x,z,stone,pale,brass);
  addBalustrades(scene,stone,brass,darkWood);
  const stairRamps=[];
  const walkablePlatforms=[];
  for(const side of [-1,1]){
    const flights=[
      {centerX:side*10.35,baseY:13.175,topY:16.875,startZ:7.35,direction:-1,width:2.38},
      {centerX:side*8.5,baseY:16.875,topY:20.625,startZ:-.91,direction:1,width:1.3},
      {centerX:side*12.25,baseY:20.625,topY:24.375,startZ:7.35,direction:-1,width:1.35}
    ];
    for(const flight of flights) stairRamps.push(stairFlight(scene,stone,pale,brass,darkWood,flight));
    walkablePlatforms.push(
      {minX:side<0?-13:7.6,maxX:side<0?-7.6:13,minZ:-8,maxZ:8,height:16.875},
      {minX:side<0?-13:7.6,maxX:side<0?-7.6:13,minZ:-8,maxZ:8,height:20.625},
      {minX:side<0?-13:7.6,maxX:side<0?-7.6:13,minZ:-8,maxZ:8,height:24.375}
    );
  }
  addWallReliefs(scene,brass,darkWood,stone,relief);
  ceilingOrnament(scene,brass,darkWood);

  const upholstery=new T.MeshStandardMaterial({color:0x65402f,map:walnut.map,bumpMap:walnut.bumpMap,bumpScale:.015,roughness:.84});
  createSofa(scene,-3.2,3.45,Math.PI/2,upholstery,darkWood,brass);
  createSofa(scene,3.2,3.45,-Math.PI/2,upholstery,darkWood,brass);
  createRug(scene);
  centerTable(scene,walnut,brass);
  const fireLight=addFire(scene,animated);
  addThoth(scene,marble,pale,brass,relief);

  const sideLight=new T.PointLight(0xffbe78,.9,12,1.8);sideLight.position.set(0,20.3,7.9);scene.add(sideLight);

  // Superfícies de circulação associadas às duas escadarias e às galerias laterais.
  return {fireLight,stairRamps,walkablePlatforms};
}

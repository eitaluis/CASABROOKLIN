import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { VolumetricFire } from './vendor/volumetric-fire.js?v=mit-volumetric-fire-webgl2-20261126a';

function assetUrl(path) {
  return new URL('../assets/' + path, import.meta.url).href;
}

function bindPbrMaps(material, setId, repeat=[1,1], includeColor=false) {
  const loader = new THREE.TextureLoader();
  const configure = (texture, colorSpace) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeat[0], repeat[1]);
    texture.anisotropy = 8;
    texture.colorSpace = colorSpace;
    texture.needsUpdate = true;
    return texture;
  };
  if (includeColor) {
    const color = configure(loader.load(assetUrl('textures/' + setId + '/color.webp')), THREE.SRGBColorSpace);
    material.map = color;
    material.color.set(0xffffff);
  }
  const normal = configure(loader.load(assetUrl('textures/' + setId + '/normal.webp')), THREE.NoColorSpace);
  const roughness = configure(loader.load(assetUrl('textures/' + setId + '/roughness.webp')), THREE.NoColorSpace);
  material.normalMap = normal;
  material.normalScale.set(0.72, 0.72);
  material.roughnessMap = roughness;
  material.needsUpdate = true;
}

function addBoxCollider(colliders, x, y, z, width, height, depth) {
  if (!colliders) return;
  colliders.push({
    minX: x - width / 2, maxX: x + width / 2,
    minY: y - height / 2, maxY: y + height / 2,
    minZ: z - depth / 2, maxZ: z + depth / 2
  });
}

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
    g.fillStyle='#101717';g.fillRect(0,0,w,h);
    for(let i=0;i<220;i++){
      const x=r()*w,y=r()*h;
      const pale=r()>.56;
      g.strokeStyle=pale?'rgba(179,166,139,'+(0.10+r()*.18)+')':'rgba(74,94,90,'+(0.08+r()*.18)+')';
      g.lineWidth=.65+r()*2.8;
      g.beginPath();g.moveTo(x,y);
      g.bezierCurveTo(x+42,y-88,x+105,y+56,x+192,y-20);
      g.bezierCurveTo(x+230,y-48,x+255,y+22,x+284,y+5);
      g.stroke();
    }
    for(let i=0;i<30000;i++){
      const n=0.025+r()*.08;
      g.fillStyle=r()>.5?'rgba(255,255,255,'+n+')':'rgba(0,0,0,'+n+')';
      g.fillRect(r()*w,r()*h,.6+r()*1.8,.6+r()*1.8);
    }
    for(let i=0;i<35;i++){
      const x=r()*w,y=r()*h;
      g.strokeStyle='rgba(197,174,133,0.18)';g.lineWidth=.6;
      g.beginPath();g.moveTo(x,y);g.lineTo(x+20+r()*55,y-8+r()*18);g.stroke();
    }
  },1024,1024,1,1);
  return new THREE.MeshPhysicalMaterial({
    map,roughness:.24,metalness:.14,clearcoat:.32,clearcoatRoughness:.2
  });
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
  group.name='sofá de reserva do Grande Salão';
  group.position.set(x,13.175,z);
  group.rotation.y=rotation;
  group.scale.set(.49,.64,.72);

  const base=new THREE.Mesh(new RoundedBoxGeometry(4.65,.34,1.95,8,.15),wood);
  base.position.y=.25;base.castShadow=true;base.receiveShadow=true;group.add(base);
  const seat=new THREE.Mesh(new RoundedBoxGeometry(4.44,.27,1.72,10,.12),upholstery);
  seat.position.set(0,.54,.04);seat.castShadow=true;seat.receiveShadow=true;group.add(seat);
  const back=new THREE.Mesh(new RoundedBoxGeometry(4.48,.98,.43,10,.15),upholstery);
  back.position.set(0,1.08,-.68);back.castShadow=true;group.add(back);
  for(const side of [-1,1]){
    const arm=new THREE.Mesh(new RoundedBoxGeometry(.66,.82,1.82,9,.2),upholstery);
    arm.position.set(side*2,.77,.02);arm.castShadow=true;group.add(arm);
    const cap=new THREE.Mesh(new RoundedBoxGeometry(.7,.1,1.72,7,.045),wood);
    cap.position.set(side*2,1.2,.02);group.add(cap);
    for(const z0 of [-.72,.72]){
      const foot=new THREE.Mesh(new THREE.CylinderGeometry(.085,.12,.24,18),brass);
      foot.position.set(side*1.96,.13,z0);group.add(foot);
    }
  }
  for(const offset of [-1.45,0,1.45]){
    const cushion=new THREE.Mesh(new RoundedBoxGeometry(1.4,.19,1.36,9,.085),upholstery);
    cushion.position.set(offset,.72,.03);cushion.castShadow=true;group.add(cushion);
    const rear=new THREE.Mesh(new RoundedBoxGeometry(1.4,.72,.3,9,.11),upholstery);
    rear.position.set(offset,1.22,-.53);rear.castShadow=true;group.add(rear);
    for(const dx of [-.22,0,.22]){
      const button=new THREE.Mesh(new THREE.SphereGeometry(.032,10,8),brass);
      button.position.set(offset+dx,1.22,-.34);group.add(button);
    }
  }
  scene.add(group);
  return group;
}

function loadSofaAssets(scene, fallbacks, colliders, interactables) {
  const loader=new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  const source=assetUrl('models/polyhaven-sofa-03.glb');
  const placements=[
    {x:-2.55,z:3.45,rotation:Math.PI/2,side:'oeste'},
    {x:2.55,z:3.45,rotation:-Math.PI/2,side:'leste'}
  ];
  loader.load(source,gltf=>{
    placements.forEach((place,index)=>{
      const model=gltf.scene.clone(true);
      model.name='sofá Poly Haven Sofa 03 · '+place.side;
      model.position.set(place.x,13.175,place.z);
      model.rotation.y=place.rotation;
      model.scale.setScalar(.78);
      model.traverse(object=>{
        if(object.isMesh){object.castShadow=true;object.receiveShadow=true;}
      });
      model.userData.assetId='polyhaven-sofa-03';
      model.userData.license='CC0-1.0';
      model.userData.nativeDimensions=[2.731,.925,1.118];
      model.userData.interaction={type:'inspect',label:'Sofá de couro',description:'Sofá de couro envelhecido com madeira entalhada e almofadas separadas.'};
      scene.add(model);
      if(fallbacks[index]) fallbacks[index].visible=false;
    });
  },undefined,error=>console.warn('Não foi possível carregar Sofa 03; mantendo o modelo de reserva.',error));

  placements.forEach(place=>{
    addBoxCollider(colliders,place.x,13.72,place.z,.98,1.1,2.42);
    interactables.push({
      name:'Sofá de couro '+place.side,
      kind:'inspect',
      label:'Sofá de couro do Grande Salão',
      description:'Modelo Poly Haven Sofa 03: couro envelhecido, estrutura de madeira entalhada e almofadas estofadas. O sofá ocupa a escala de um móvel de dois/três lugares.',
      position:new THREE.Vector3(place.x,13.7,place.z),
      radius:1.65
    });
  });
}

function createRug(scene) {
  const rand=seeded(20261126);
  const color=tex((g,w,h)=>{
    const base=g.createLinearGradient(0,0,w,h);
    base.addColorStop(0,'#0e2025');base.addColorStop(.48,'#233b3d');base.addColorStop(1,'#101e23');
    g.fillStyle=base;g.fillRect(0,0,w,h);

    const palettes=['#28474a','#375352','#52604d','#6a583f','#233c40','#40565a'];
    const sw=50,sh=40;
    for(let row=-1;row<Math.ceil(h/sh)+1;row++){
      const offset=(row%2)*sw*.5;
      for(let col=-1;col<Math.ceil(w/sw)+1;col++){
        const x=col*sw+offset,y=row*sh;
        const tone=palettes[Math.floor(rand()*palettes.length)];
        const gradient=g.createLinearGradient(x,y-sh*.35,x,y+sh*.55);
        gradient.addColorStop(0,'#6d7460');gradient.addColorStop(.26,tone);gradient.addColorStop(1,'#111f24');
        g.fillStyle=gradient;
        g.beginPath();
        g.moveTo(x-sw*.46,y);
        g.bezierCurveTo(x-sw*.43,y-sh*.44,x+sw*.43,y-sh*.44,x+sw*.46,y);
        g.bezierCurveTo(x+sw*.42,y+sh*.39,x+sw*.18,y+sh*.5,x,y+sh*.52);
        g.bezierCurveTo(x-sw*.2,y+sh*.5,x-sw*.42,y+sh*.39,x-sw*.46,y);
        g.closePath();g.fill();
        g.strokeStyle='rgba(8,17,20,.72)';g.lineWidth=2.2;g.stroke();
        g.strokeStyle='rgba(205,184,135,.3)';g.lineWidth=1.1;
        g.beginPath();g.moveTo(x-sw*.36,y-sh*.02);g.quadraticCurveTo(x,y-sh*.33,x+sw*.36,y-sh*.02);g.stroke();
        g.fillStyle='rgba(225,207,165,.12)';g.beginPath();g.ellipse(x,y+sh*.07,sw*.19,sh*.12,0,0,Math.PI*2);g.fill();
        for(let n=0;n<18;n++){
          g.fillStyle=rand()>.5?'rgba(220,205,166,.09)':'rgba(0,0,0,.12)';
          g.fillRect(x+(rand()-.5)*sw*.65,y+(rand()-.5)*sh*.55,1+rand()*2,1+rand()*2);
        }
      }
    }
    g.strokeStyle='#a27c4e';g.lineWidth=14;g.strokeRect(10,10,w-20,h-20);
    g.strokeStyle='rgba(226,197,143,.48)';g.lineWidth=3;g.strokeRect(27,27,w-54,h-54);
    for(let i=0;i<1200;i++){
      g.fillStyle=rand()>.5?'rgba(211,194,150,.06)':'rgba(0,0,0,.08)';
      g.fillRect(rand()*w,rand()*h,1+rand()*2,1+rand()*2);
    }
  },1024,1024,1,1);
  const bump=tex((g,w,h)=>{
    g.fillStyle='#727272';g.fillRect(0,0,w,h);
    const sw=50,sh=40;
    for(let row=-1;row<Math.ceil(h/sh)+1;row++){
      const offset=(row%2)*sw*.5;
      for(let col=-1;col<Math.ceil(w/sw)+1;col++){
        const x=col*sw+offset,y=row*sh;
        g.fillStyle='#aaaaaa';g.beginPath();g.moveTo(x-sw*.46,y);
        g.bezierCurveTo(x-sw*.43,y-sh*.44,x+sw*.43,y-sh*.44,x+sw*.46,y);
        g.bezierCurveTo(x+sw*.42,y+sh*.39,x+sw*.18,y+sh*.5,x,y+sh*.52);
        g.bezierCurveTo(x-sw*.2,y+sh*.5,x-sw*.42,y+sh*.39,x-sw*.46,y);g.closePath();g.fill();
        g.strokeStyle='#404040';g.lineWidth=2;g.stroke();
      }
    }
    for(let i=0;i<16000;i++){const v=Math.floor(90+rand()*75);g.fillStyle='rgb('+v+','+v+','+v+')';g.fillRect(rand()*w,rand()*h,1+rand()*2,1+rand()*2);}
  },1024,1024,1,1);
  bump.colorSpace=THREE.NoColorSpace;
  const rug=new THREE.Mesh(new THREE.CircleGeometry(1,144),new THREE.MeshStandardMaterial({map:color,bumpMap:bump,bumpScale:.065,roughness:.94}));
  rug.name='tapete oval de couro com padrão de escamas de serpente do Grande Salão';
  rug.rotation.x=-Math.PI/2;rug.scale.set(6.1,1,2.3);rug.position.set(0,13.205,3.45);rug.receiveShadow=true;scene.add(rug);
  for(const spec of [[5.42,.023],[5.86,.018]]){
    const ring=new THREE.Mesh(new THREE.TorusGeometry(spec[0],spec[1],7,112),new THREE.MeshStandardMaterial({color:0x957046,metalness:.52,roughness:.58}));
    ring.rotation.x=Math.PI/2;ring.position.set(0,13.22,3.45);ring.scale.z=2.3/6.1;scene.add(ring);
  }
}

function centerTable(scene,wood,brass) {
  const group=new THREE.Group();
  group.name='mesa baixa circular de nogueira e bronze do Grande Salão';
  group.position.set(0,13.175,3.45);

  const base=new THREE.Mesh(new THREE.LatheGeometry([
    new THREE.Vector2(.18,0),new THREE.Vector2(.27,.05),new THREE.Vector2(.34,.12),
    new THREE.Vector2(.26,.19),new THREE.Vector2(.21,.30),new THREE.Vector2(.27,.36),
    new THREE.Vector2(.35,.4)
  ],64),wood);
  base.position.y=.02;base.scale.y=.78;base.castShadow=true;base.receiveShadow=true;group.add(base);

  const lowerFoot=new THREE.Mesh(new THREE.CylinderGeometry(.49,.58,.09,64),wood);
  lowerFoot.position.y=.08;lowerFoot.castShadow=true;group.add(lowerFoot);
  const top=new THREE.Mesh(new THREE.CylinderGeometry(.74,.76,.12,96,2),wood);
  top.position.y=.47;top.castShadow=true;top.receiveShadow=true;group.add(top);

  for(const [radius,tubeRadius] of [[.75,.035],[.68,.012],[.48,.012]]){
    const rim=new THREE.Mesh(new THREE.TorusGeometry(radius,tubeRadius,10,96),brass);
    rim.rotation.x=Math.PI/2;rim.position.y=.535;group.add(rim);
  }

  const inset=new THREE.Mesh(new THREE.CircleGeometry(.62,96),new THREE.MeshStandardMaterial({
    color:0x263b3b,roughness:.48,metalness:.22,normalMap:wood.normalMap,roughnessMap:wood.roughnessMap
  }));
  inset.rotation.x=-Math.PI/2;inset.position.y=.535;group.add(inset);

  const medallion=new THREE.Mesh(new THREE.TorusGeometry(.25,.025,10,72),brass);
  medallion.rotation.x=Math.PI/2;medallion.position.y=.542;group.add(medallion);
  const sun=new THREE.Mesh(new THREE.SphereGeometry(.11,24,16),brass);
  sun.scale.set(1,.15,1);sun.position.y=.545;group.add(sun);

  const engraved=[];
  for(let i=0;i<12;i++){
    const a=i/12*Math.PI*2;
    const p1=[Math.cos(a)*.36,.543,Math.sin(a)*.36];
    const p2=[Math.cos(a)*.56,.543,Math.sin(a)*.56];
    engraved.push(tube([p1,[Math.cos(a+.06)*.46,.543,Math.sin(a+.06)*.46],p2],.006,brass,12,5));
  }
  engraved.forEach(line=>group.add(line));
  scene.add(group);
  return group;
}

function addFire(scene,animated,camera,isTouchDevice=false) {
  const logMat=woodMaterial();
  for(let i=0;i<5;i++){
    const log=new THREE.Mesh(new THREE.CylinderGeometry(.075,.105,1.16,20),logMat);
    log.name='lenha de nogueira carbonizada da lareira';
    log.position.set(-.78+i*.39,14.33+(i%2)*.075,-8.24);
    log.rotation.z=Math.PI/2+(i%2?.15:-.12);log.rotation.x=i%2?.23:-.18;
    log.castShadow=true;log.receiveShadow=true;scene.add(log);
  }
  const ember=new THREE.Mesh(new THREE.SphereGeometry(1,48,24),new THREE.MeshStandardMaterial({
    color:0x35150b,emissive:0xb23808,emissiveIntensity:1.2,roughness:.9
  }));
  ember.name='leito de brasas incandescentes';
  ember.scale.set(1.55,.13,.34);ember.position.set(0,14.27,-8.31);scene.add(ember);

  const textureLoader=new THREE.TextureLoader();
  const noise=textureLoader.load(assetUrl('fire/nzw.png'));
  noise.wrapS=noise.wrapT=THREE.RepeatWrapping;
  noise.colorSpace=THREE.NoColorSpace;
  noise.minFilter=THREE.LinearFilter;noise.magFilter=THREE.LinearFilter;
  const profile=textureLoader.load(assetUrl('fire/firetex.png'));
  profile.wrapS=profile.wrapT=THREE.ClampToEdgeWrapping;
  profile.colorSpace=THREE.NoColorSpace;
  profile.minFilter=THREE.LinearFilter;profile.magFilter=THREE.LinearFilter;

  const volume=new VolumetricFire({
    camera,textureNoise:noise,textureProfile:profile,
    width:3.5,height:2.25,depth:.66,
    sliceSpacing:isTouchDevice?.105:.065,
    segments:isTouchDevice?18:28,
    debug:false
  });
  volume.name='fogo volumétrico com ruído procedural da lareira';
  volume.position.set(0,15.35,-8.36);
  volume.material.uniforms.magnitude.value=1.42;
  volume.material.uniforms.lacunarity.value=2.05;
  volume.material.uniforms.gain.value=.54;
  volume.material.uniforms.noiseScale.value.set(1.35,2.45,1.0,.42);
  const identity=new THREE.Quaternion();
  volume.setControlPoints([
    {pos:new THREE.Vector3(-.02,-1.06,0),scale:new THREE.Vector3(3.55,1,.62),rot:identity.clone()},
    {pos:new THREE.Vector3(-.12,-.36,0),scale:new THREE.Vector3(3.25,1,.6),rot:new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,-.025))},
    {pos:new THREE.Vector3(.10,.38,0),scale:new THREE.Vector3(2.25,1,.43),rot:new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,.055))},
    {pos:new THREE.Vector3(-.04,1.1,0),scale:new THREE.Vector3(.12,1,.055),rot:new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,-.08))}
  ]);
  scene.add(volume);

  for(let i=0;i<22;i++){
    const mat=new THREE.MeshBasicMaterial({color:i%5===0?0xffe4a3:0xffa13b,transparent:true,opacity:.82,blending:THREE.AdditiveBlending});
    const spark=new THREE.Mesh(new THREE.SphereGeometry(.016+(i%3)*.009,10,8),mat);
    spark.name='faísca ascendente da lareira';
    spark.position.set((Math.random()-.5)*2.65,14.55+Math.random()*.85,-8.11+Math.random()*.24);
    scene.add(spark);
    animated.push({obj:spark,phase:i*.77,particle:true,baseX:spark.position.x,baseY:spark.position.y,baseZ:spark.position.z});
  }

  const halo=tex((g,w,h)=>{
    const gr=g.createRadialGradient(w/2,h/2,5,w/2,h/2,w*.49);
    gr.addColorStop(0,'rgba(255,229,155,.46)');gr.addColorStop(.25,'rgba(255,129,44,.23)');
    gr.addColorStop(.62,'rgba(203,53,9,.07)');gr.addColorStop(1,'rgba(203,53,9,0)');
    g.fillStyle=gr;g.fillRect(0,0,w,h);
  },256,256,1,1);
  const glow=new THREE.Mesh(new THREE.PlaneGeometry(4.5,2.7),new THREE.MeshBasicMaterial({
    map:halo,transparent:true,opacity:.7,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide
  }));
  glow.name='reflexo volumétrico quente da lareira';glow.position.set(0,15.3,-8.57);scene.add(glow);

  const light=new THREE.PointLight(0xff7b25,4.6,17,1.55);
  light.name='luz dinâmica do fogo da lareira';light.position.set(0,15.05,-7.35);scene.add(light);
  const fill=new THREE.PointLight(0xffa54d,1.8,10,1.9);fill.position.set(0,14.55,-8);scene.add(fill);

  return {
    fireLight:light,
    update(time){
      camera.updateMatrixWorld(true);
      scene.updateMatrixWorld(true);
      volume.update(time);
    }
  };
}

function papyrusMaterial() {
  const rand=seeded(6317);
  const color=tex((g,w,h)=>{
    const base=g.createLinearGradient(0,0,w,0);
    base.addColorStop(0,'#9f865b');base.addColorStop(.08,'#d7c49a');
    base.addColorStop(.5,'#e2d2aa');base.addColorStop(.92,'#c6ad7e');base.addColorStop(1,'#9e8258');
    g.fillStyle=base;g.fillRect(0,0,w,h);
    for(let i=0;i<4200;i++){
      const y=rand()*h,x=rand()*w;
      g.strokeStyle=rand()>.5?'rgba(255,245,212,.16)':'rgba(89,65,38,.12)';
      g.lineWidth=.4+rand()*1.4;
      g.beginPath();g.moveTo(x,y);g.lineTo(x+12+rand()*90,y+(rand()-.5)*2);g.stroke();
    }
    for(let i=0;i<800;i++){
      const x=rand()*w,y=rand()*h;
      const radius=2+rand()*13;
      g.fillStyle='rgba(105,79,47,'+(0.015+rand()*.035)+')';
      g.beginPath();g.ellipse(x,y,radius,radius*.32,rand()*.2,0,Math.PI*2);g.fill();
    }
    g.strokeStyle='rgba(112,77,43,.4)';g.lineWidth=5;g.strokeRect(12,12,w-24,h-24);
    g.strokeStyle='rgba(247,228,188,.48)';g.lineWidth=2;g.strokeRect(21,21,w-42,h-42);
  },512,512,1,1);
  const bump=tex((g,w,h)=>{
    g.fillStyle='#777';g.fillRect(0,0,w,h);
    for(let i=0;i<18000;i++){
      const v=Math.floor(90+rand()*82);
      g.fillStyle='rgb('+v+','+v+','+v+')';
      g.fillRect(rand()*w,rand()*h,.5+rand()*1.8,.5+rand()*1.6);
    }
    g.strokeStyle='#666';g.lineWidth=1;
    for(let y=0;y<h;y+=5){g.beginPath();g.moveTo(0,y);g.lineTo(w,y+(rand()-.5)*2);g.stroke();}
  },512,512,1,1);
  bump.colorSpace=THREE.NoColorSpace;
  return new THREE.MeshStandardMaterial({map:color,bumpMap:bump,bumpScale:.018,roughness:.96,side:THREE.DoubleSide});
}


const gameIconCache = new Map();

function gameIconMaterial(file) {
  if (gameIconCache.has(file)) return gameIconCache.get(file);
  const texture = new THREE.TextureLoader().load(assetUrl('decor/game-icons/' + file + '.svg'));
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    toneMapped: false
  });
  gameIconCache.set(file, material);
  return material;
}

function addIconPlaque(scene, file, position, rotationY, wood, brass, size = 0.58) {
  const group = new THREE.Group();
  group.name = 'placa iconográfica Game-icons · ' + file;
  group.position.set(position[0], position[1], position[2]);
  group.rotation.y = rotationY;

  const back = new THREE.Mesh(
    new RoundedBoxGeometry(size + 0.28, size + 0.28, 0.12, 7, 0.045),
    wood
  );
  back.position.z = 0.035;
  back.castShadow = true;
  back.receiveShadow = true;
  group.add(back);

  const border = new THREE.Mesh(
    new RoundedBoxGeometry(size + 0.1, size + 0.1, 0.035, 6, 0.025),
    brass
  );
  border.position.z = 0.106;
  group.add(border);

  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    gameIconMaterial(file)
  );
  panel.position.z = 0.128;
  group.add(panel);

  for (const x of [-1, 1]) {
    for (const y of [-1, 1]) {
      const pin = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), brass);
      pin.position.set(x * (size + 0.16) * 0.5, y * (size + 0.16) * 0.5, 0.13);
      group.add(pin);
    }
  }

  scene.add(group);
  return group;
}

function addGreatHallDoors(scene, stone, wood, brass, colliders, interactables) {
  const group = new THREE.Group();
  group.name = 'portas duplas do Grande Salão com Olho de Hórus';
  group.position.set(0, 13.175, 8.91);

  const frame = new THREE.Mesh(
    new RoundedBoxGeometry(4.86, 5.74, 0.72, 10, 0.13),
    stone
  );
  frame.position.set(0, 2.82, 0.06);
  frame.castShadow = true;
  frame.receiveShadow = true;
  group.add(frame);

  const header = new THREE.Mesh(
    new RoundedBoxGeometry(4.52, 0.34, 0.18, 8, 0.055),
    brass
  );
  header.position.set(0, 5.42, -0.36);
  group.add(header);

  const iron = new THREE.MeshStandardMaterial({
    color: 0x26292a,
    metalness: 0.86,
    roughness: 0.34
  });
  const gold = new THREE.MeshStandardMaterial({
    color: 0xb98e50,
    metalness: 0.78,
    roughness: 0.28
  });
  const goldLight = new THREE.MeshStandardMaterial({
    color: 0xd4b476,
    metalness: 0.72,
    roughness: 0.24
  });

  for (const side of [-1, 1]) {
    const leaf = new THREE.Mesh(
      new RoundedBoxGeometry(1.99, 5.08, 0.25, 10, 0.055),
      wood
    );
    leaf.name = side < 0 ? 'folha esquerda de carvalho das portas' : 'folha direita de carvalho das portas';
    leaf.position.set(side * 1.005, 2.55, -0.31);
    leaf.castShadow = true;
    leaf.receiveShadow = true;
    group.add(leaf);

    for (const xOffset of [-0.83, 0.83]) {
      const stile = new THREE.Mesh(
        new RoundedBoxGeometry(0.13, 4.82, 0.095, 6, 0.025),
        darkWoodFrom(wood, 0x51331f)
      );
      stile.position.set(side * 1.005 + xOffset, 2.55, -0.48);
      group.add(stile);
    }

    for (const y of [0.34, 1.52, 3.54, 4.72]) {
      const rail = new THREE.Mesh(
        new RoundedBoxGeometry(1.84, 0.13, 0.1, 6, 0.025),
        gold
      );
      rail.position.set(side * 1.005, y, -0.49);
      group.add(rail);
    }

    for (const spec of [
      { y: 0.92, h: 0.82, w: 1.44 },
      { y: 2.52, h: 1.55, w: 1.44 },
      { y: 4.14, h: 0.8, w: 1.44 }
    ]) {
      const bevel = new THREE.Mesh(
        new RoundedBoxGeometry(spec.w, spec.h, 0.075, 8, 0.035),
        darkWoodFrom(wood, 0x69452c)
      );
      bevel.position.set(side * 1.005, spec.y, -0.485);
      bevel.castShadow = true;
      group.add(bevel);

      const inset = new THREE.Mesh(
        new RoundedBoxGeometry(spec.w - 0.14, spec.h - 0.14, 0.035, 8, 0.03),
        wood
      );
      inset.position.set(side * 1.005, spec.y, -0.535);
      group.add(inset);
    }

    for (const y of [0.7, 2.56, 4.47]) {
      const hinge = new THREE.Mesh(
        new RoundedBoxGeometry(0.105, 0.42, 0.055, 5, 0.02),
        gold
      );
      hinge.position.set(side * 1.92, y, -0.48);
      group.add(hinge);
      for (const yy of [-0.12, 0.12]) {
        const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 6), goldLight);
        rivet.position.set(side * 1.92, y + yy, -0.52);
        group.add(rivet);
      }
    }

    const handleBase = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 16, 12),
      gold
    );
    handleBase.position.set(side * 0.22, 1.31, -0.53);
    group.add(handleBase);

    const handle = new THREE.Mesh(
      new THREE.TorusGeometry(0.11, 0.022, 8, 24),
      goldLight
    );
    handle.position.set(side * 0.22, 1.1, -0.56);
    group.add(handle);
  }

  const eyeFrame = new THREE.Mesh(
    new THREE.TorusGeometry(0.66, 0.055, 12, 64),
    gold
  );
  eyeFrame.position.set(0, 4.23, -0.52);
  group.add(eyeFrame);

  const eyeBacking = new THREE.Mesh(
    new THREE.CircleGeometry(0.58, 64),
    new THREE.MeshStandardMaterial({
      color: 0x223239,
      metalness: 0.62,
      roughness: 0.36
    })
  );
  eyeBacking.position.set(0, 4.23, -0.515);
  group.add(eyeBacking);

  const eye = new THREE.Mesh(
    new THREE.PlaneGeometry(1.04, 1.04),
    gameIconMaterial('eye-of-horus')
  );
  eye.name = 'Olho de Hórus em bronze nas portas';
  eye.position.set(0, 4.23, -0.55);
  group.add(eye);

  const chainLine = [];
  for (let i = 0; i < 34; i++) {
    const link = new THREE.Mesh(
      new THREE.TorusGeometry(0.073, 0.024, 8, 18),
      iron
    );
    link.name = 'elo de corrente de ferro das portas';
    link.position.set(-1.84 + i * 0.112, 2.12, -0.57);
    link.rotation.y = i % 2 ? Math.PI / 2 : 0;
    link.rotation.z = i % 2 ? 0.12 : -0.12;
    group.add(link);
    chainLine.push(link);
  }

  for (const x of [-1.45, -0.87, -0.29, 0.29, 0.87, 1.45]) {
    const shackle = new THREE.Mesh(
      new THREE.TorusGeometry(0.075, 0.024, 8, 20),
      iron
    );
    shackle.position.set(x, 2.0, -0.59);
    group.add(shackle);

    const body = new THREE.Mesh(
      new RoundedBoxGeometry(0.22, 0.31, 0.105, 6, 0.035),
      gold
    );
    body.name = 'cadeado de bronze nas portas';
    body.position.set(x, 1.82, -0.60);
    body.castShadow = true;
    group.add(body);

    const keyhole = new THREE.Mesh(
      new THREE.CircleGeometry(0.035, 16),
      new THREE.MeshBasicMaterial({ color: 0x24180e })
    );
    keyhole.position.set(x, 1.85, -0.658);
    group.add(keyhole);

    const lowerKeyhole = new THREE.Mesh(
      new THREE.CircleGeometry(0.014, 12),
      new THREE.MeshBasicMaterial({ color: 0x24180e })
    );
    lowerKeyhole.position.set(x, 1.77, -0.66);
    group.add(lowerKeyhole);
  }

  const chainMedallion = new THREE.Mesh(
    new THREE.PlaneGeometry(0.58, 0.58),
    gameIconMaterial('crossed-chains')
  );
  chainMedallion.position.set(0, 1.18, -0.59);
  group.add(chainMedallion);

  scene.add(group);
  group.userData.assetId = 'great-hall-double-eye-door';
  group.userData.interaction = {
    type: 'inspect',
    label: 'Portas duplas do Olho de Hórus',
    description: 'As portas duplas de madeira estão marcadas com o Olho de Hórus e presas por correntes e seis cadeados. Por enquanto, a passagem continua trancada.'
  };

  addBoxCollider(colliders, 0, 15.72, 8.75, 4.55, 5.35, 0.78);
  interactables.push({
    name: 'Portas duplas do Olho de Hórus',
    kind: 'locked-door',
    label: 'As portas estão acorrentadas',
    description: 'O Olho de Hórus foi gravado acima das correntes. Seis cadeados prendem as duas folhas; não há passagem aberta neste momento.',
    position: new THREE.Vector3(0, 15.35, 6.8),
    radius: 2.7
  });
  return group;
}

function ironMaterial() {
  return new THREE.MeshStandardMaterial({color:0x292a29,metalness:.86,roughness:.36});
}

function plasterMaterialFrom(base) {
  return new THREE.MeshStandardMaterial({color:0xd7c59a,roughness:.96,bumpMap:base.bumpMap,bumpScale:.016});
}

function darkWoodFrom(base, color) {
  return new THREE.MeshStandardMaterial({
    color,
    map: base.map || null,
    normalMap: base.normalMap || null,
    normalScale: new THREE.Vector2(0.7, 0.7),
    roughnessMap: base.roughnessMap || null,
    roughness: 0.78
  });
}

function createWallHarp(scene, side, wood, brass, colliders, interactables) {
  const group = new THREE.Group();
  group.name = 'harpa de madeira do Grande Salão';
  group.position.set(side * 13.48, 13.35, -7.3);
  group.rotation.y = side < 0 ? Math.PI / 2 : -Math.PI / 2;

  const soundbox = new THREE.Mesh(
    new RoundedBoxGeometry(0.54, 0.42, 0.3, 8, 0.11),
    wood
  );
  soundbox.position.set(-0.12, 0.37, 0.04);
  soundbox.castShadow = true;
  soundbox.receiveShadow = true;
  group.add(soundbox);

  const base = new THREE.Mesh(
    new RoundedBoxGeometry(0.88, 0.16, 0.32, 7, 0.05),
    wood
  );
  base.position.set(0.12, 0.13, 0.03);
  base.castShadow = true;
  group.add(base);

  group.add(tube([
    [-0.38, 0.22, 0.06],
    [-0.46, 0.75, 0.06],
    [-0.40, 1.38, 0.06],
    [-0.12, 1.95, 0.06],
    [0.28, 2.13, 0.06],
    [0.62, 2.02, 0.06]
  ], 0.075, wood, 64, 12));

  group.add(tube([
    [-0.35, 1.76, 0.07],
    [0.02, 1.97, 0.07],
    [0.42, 2.06, 0.07]
  ], 0.055, brass, 32, 8));

  const stringMaterial = new THREE.MeshStandardMaterial({
    color: 0xd9c89f,
    metalness: 0.42,
    roughness: 0.5
  });
  for (let i = 0; i < 16; i++) {
    const t = i / 15;
    const x1 = -0.31 + t * 0.34;
    const x2 = -0.1 + t * 0.68;
    group.add(tube([
      [x1, 0.56, 0.19],
      [x2, 1.27 + t * 0.06, 0.15],
      [x2 + 0.04, 1.91, 0.1]
    ], 0.0065, stringMaterial, 18, 5));

    const pin = new THREE.Mesh(new THREE.SphereGeometry(0.026, 8, 6), brass);
    pin.position.set(x2 + 0.04, 1.91, 0.1);
    group.add(pin);
  }

  const rosette = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.018, 8, 32), brass);
  rosette.position.set(-0.12, 0.37, 0.21);
  group.add(rosette);

  scene.add(group);
  addIconPlaque(scene, 'harp', [side * 13.92, 15.85, -7.3], side < 0 ? Math.PI / 2 : -Math.PI / 2, wood, brass, 0.42);
  addBoxCollider(colliders, side * 13.2, 14.45, -7.3, 0.75, 2.4, 0.75);
  interactables.push({
    name: 'Harpa de madeira ' + (side < 0 ? 'oeste' : 'leste'),
    kind: 'inspect',
    label: 'Instrumento de cordas',
    description: 'Harpa de madeira, com caixa de ressonância esculpida, cordas individuais e ferragens em bronze.',
    position: new THREE.Vector3(side * 12.35, 14.3, -7.3),
    radius: 1.8
  });
  return group;
}

function createWallDrum(scene, side, wood, brass, plaster, colliders, interactables) {
  const group = new THREE.Group();
  group.name = 'tambor de pele do Grande Salão';
  group.position.set(side * 11.3, 13.175, -5.15);

  const shell = new THREE.Mesh(
    new THREE.LatheGeometry([
      new THREE.Vector2(0.28, 0),
      new THREE.Vector2(0.34, 0.12),
      new THREE.Vector2(0.39, 0.28),
      new THREE.Vector2(0.37, 0.62),
      new THREE.Vector2(0.31, 0.86),
      new THREE.Vector2(0.28, 0.94)
    ], 48),
    wood
  );
  shell.name = 'corpo torneado de nogueira do tambor';
  shell.position.y = 0.1;
  shell.castShadow = true;
  shell.receiveShadow = true;
  group.add(shell);

  for (const y of [0.18, 0.37, 0.79, 0.98]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.025, 10, 48), brass);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    group.add(ring);
  }

  const drumHead = new THREE.Mesh(
    new THREE.CircleGeometry(0.3, 64),
    new THREE.MeshStandardMaterial({
      color: 0xd7c59a,
      roughness: 0.94,
      bumpMap: plaster.bumpMap,
      bumpScale: 0.018,
      side: THREE.DoubleSide
    })
  );
  drumHead.rotation.x = -Math.PI / 2;
  drumHead.position.y = 1.055;
  drumHead.receiveShadow = true;
  group.add(drumHead);

  const rope = new THREE.MeshStandardMaterial({ color: 0xb69a6b, roughness: 0.9 });
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * Math.PI * 2;
    const x = Math.cos(a) * 0.34;
    const z = Math.sin(a) * 0.34;
    group.add(tube([
      [x * 0.95, 0.22, z * 0.95],
      [x * 1.08, 0.56, z * 1.08],
      [x * 0.95, 0.92, z * 0.95]
    ], 0.014, rope, 14, 5));
  }

  for (let i = 0; i < 8; i++) {
    const a = i / 8 * Math.PI * 2;
    const lug = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), brass);
    lug.position.set(Math.cos(a) * 0.38, 0.57, Math.sin(a) * 0.38);
    group.add(lug);
  }

  scene.add(group);
  addIconPlaque(scene, 'drum', [side * 13.92, 15.4, -5.1], side < 0 ? Math.PI / 2 : -Math.PI / 2, wood, brass, 0.4);
  addBoxCollider(colliders, side * 11.3, 13.72, -5.15, 0.95, 1.2, 0.95);
  interactables.push({
    name: 'Tambor ' + (side < 0 ? 'oeste' : 'leste'),
    kind: 'inspect',
    label: 'Tambor de pele e nogueira',
    description: 'Tambor de pele esticada, aro de bronze e cordas de tensão. Uma interpretação de instrumento musical antigo para a decoração descrita no livro.',
    position: new THREE.Vector3(side * 11.3, 14.0, -4.45),
    radius: 1.8
  });
  return group;
}

function createSpearDisplay(scene, side, wood, brass, iron, colliders, interactables) {
  const group = new THREE.Group();
  group.name = 'suporte de armas egípcias do Grande Salão';
  group.position.set(side * 8.1, 13.175, 8.72);
  group.rotation.y = Math.PI;

  const backboard = new THREE.Mesh(
    new RoundedBoxGeometry(1.65, 3.35, 0.18, 8, 0.06),
    wood
  );
  backboard.position.set(0, 1.83, 0.18);
  backboard.castShadow = true;
  backboard.receiveShadow = true;
  group.add(backboard);

  for (const y of [0.64, 2.98]) {
    const rail = new THREE.Mesh(new RoundedBoxGeometry(1.58, 0.13, 0.16, 6, 0.03), brass);
    rail.position.set(0, y, 0.02);
    group.add(rail);
  }

  for (let i = 0; i < 3; i++) {
    const x = -0.48 + i * 0.48;
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.048, 2.64, 20, 1),
      wood
    );
    shaft.name = 'haste torneada de lança';
    shaft.position.set(x, 1.98, -0.02);
    shaft.castShadow = true;
    group.add(shaft);

    const tip = new THREE.Mesh(
      new THREE.LatheGeometry([
        new THREE.Vector2(0.075, 0),
        new THREE.Vector2(0.105, 0.1),
        new THREE.Vector2(0.075, 0.24),
        new THREE.Vector2(0.04, 0.42),
        new THREE.Vector2(0, 0.58)
      ], 20),
      iron
    );
    tip.position.set(x, 3.29, -0.02);
    tip.castShadow = true;
    group.add(tip);

    const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.12, 18), brass);
    ferrule.position.set(x, 0.66, -0.02);
    group.add(ferrule);

    for (const y of [1.0, 2.8]) {
      const wrap = new THREE.Mesh(new THREE.TorusGeometry(0.047, 0.012, 8, 18), brass);
      wrap.position.set(x, y, -0.02);
      group.add(wrap);
    }
  }

  scene.add(group);
  addIconPlaque(scene, 'spears', [side * 8.1, 17.2, 8.43], Math.PI, wood, brass, 0.48);
  addBoxCollider(colliders, side * 8.1, 15.1, 8.45, 1.95, 3.55, 0.55);
  interactables.push({
    name: 'Suporte de lanças ' + (side < 0 ? 'oeste' : 'leste'),
    kind: 'inspect',
    label: 'Armas egípcias antigas',
    description: 'Três lanças de madeira e bronze em um suporte de parede. As armas antigas são parte da decoração do Grande Salão descrita no livro.',
    position: new THREE.Vector3(side * 7.3, 14.5, 6.8),
    radius: 2.0
  });
  return group;
}

function addThoth(scene,marble,pale,brass,reliefTex,wood) {
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
  // Papiro aberto com o sinal composto Per Ankh (casa + vida), mantido legível à altura do jogador.
  const papyrus=papyrusMaterial();
  const scrollGeometry=new THREE.PlaneGeometry(1.02,.78,18,14);
  const scrollPositions=scrollGeometry.attributes.position;
  for(let i=0;i<scrollPositions.count;i++){
    const x=scrollPositions.getX(i),y=scrollPositions.getY(i);
    scrollPositions.setZ(i,.045*(x*x)+.012*Math.cos(y*8));
  }
  scrollGeometry.computeVertexNormals();
  const openScroll=new THREE.Mesh(scrollGeometry,papyrus);
  openScroll.name='papiro aberto de Thoth com Per Ankh';
  openScroll.position.set(-.52,3.13,.53);
  openScroll.castShadow=true;group.add(openScroll);

  const rollerMaterial=new THREE.MeshStandardMaterial({color:0x8d6339,map:wood.map,normalMap:wood.normalMap,roughness:.74});
  for(const y of [2.75,3.51]){
    const roller=new THREE.Mesh(new THREE.CylinderGeometry(.047,.047,1.12,20),rollerMaterial);
    roller.rotation.z=Math.PI/2;roller.position.set(-.52,y,.52);roller.castShadow=true;group.add(roller);
    for(const side of [-1,1]){
      const finial=new THREE.Mesh(new THREE.SphereGeometry(.065,12,10),gold);
      finial.position.set(-.52+side*.57,y,.52);group.add(finial);
    }
  }
  const perAnkhTexture=new THREE.TextureLoader().load(assetUrl('decor/per-ankh.svg'));
  perAnkhTexture.colorSpace=THREE.SRGBColorSpace;
  const perAnkh=new THREE.Mesh(new THREE.PlaneGeometry(.42,.52),new THREE.MeshBasicMaterial({
    map:perAnkhTexture,transparent:true,side:THREE.DoubleSide,depthWrite:false
  }));
  perAnkh.name='inscrição Per Ankh no papiro';
  perAnkh.position.set(-.52,3.13,.585);group.add(perAnkh);
  const stylus=tube([
    [.76,2.66,.3],[.84,2.94,.36],[.94,3.25,.4],[1.02,3.52,.42]
  ],.022,rollerMaterial,20,8);
  stylus.name='estilete de escriba na mão de Thoth';
  group.add(stylus);
  const nib=new THREE.Mesh(new THREE.ConeGeometry(.035,.15,10),goldL);
  nib.position.set(1.025,3.57,.42);nib.rotation.z=-.24;group.add(nib);
  const grip=new THREE.Mesh(new THREE.TorusGeometry(.032,.008,6,16),gold);
  grip.rotation.x=Math.PI/2;grip.position.set(.91,3.16,.405);group.add(grip);
  for(const s of [-1,1]){const lappet=new THREE.Mesh(new RoundedBoxGeometry(.18,.94,.34,4,.075),marble);lappet.position.set(s*.3,4.72,-.19);lappet.rotation.z=s*.08;group.add(lappet);const feather=new THREE.Mesh(new THREE.SphereGeometry(.22,18,12),pale);feather.position.set(s*.37,5.35,-.08);feather.scale.set(.46,1.4,.25);feather.rotation.z=s*-.4;group.add(feather);}
  const disc=new THREE.Mesh(new THREE.SphereGeometry(.38,24,16),goldL);disc.position.set(0,5.86,-.18);disc.scale.set(1,1,.18);group.add(disc);
  group.add(tube([[-.58,5.78,-.18],[-.55,6.08,-.18],[-.3,6.23,-.18],[0,6.28,-.18],[.3,6.23,-.18],[.55,6.08,-.18],[.58,5.78,-.18]],.055,gold,36,8));
  const plaque=new THREE.Mesh(new RoundedBoxGeometry(1.15,.42,.09,4,.04),new THREE.MeshStandardMaterial({color:0x322116,roughness:.82}));plaque.position.set(0,.3,1.52);group.add(plaque);
  const panel=new THREE.Mesh(new THREE.PlaneGeometry(.97,.23),new THREE.MeshBasicMaterial({map:reliefTex}));panel.position.set(0,.3,1.571);group.add(panel);
  group.scale.setScalar(1.45);
  scene.add(group);
  const spot=new THREE.SpotLight(0xe9d2a0,46,27,Math.PI/7,.62,1.15);spot.position.set(-3.6,27.2,3);spot.target.position.set(0,18.2,-.5);scene.add(spot,spot.target);
  const fill=new THREE.PointLight(0x8ea4a5,1,14,1.8);fill.position.set(2.3,19.4,2.6);scene.add(fill);
}

function addHarpDisplay(scene,x,baseY,z,wood,brass,colliders,interactables) {
  const group=new THREE.Group();
  group.name='harpa egípcia arqueada';
  group.position.set(x,baseY,z);

  const resonator=new THREE.Mesh(new RoundedBoxGeometry(.55,.44,.34,8,.09),wood);
  resonator.position.set(-.08,.22,0);
  resonator.castShadow=true;resonator.receiveShadow=true;group.add(resonator);

  const foot=new THREE.Mesh(new THREE.CylinderGeometry(.16,.22,.12,32),brass);
  foot.position.set(-.08,.06,0);group.add(foot);

  const frame=tube([
    [-.18,.35,0],[-.24,.92,0],[-.14,1.5,.01],
    [.08,2.04,.02],[.48,2.34,.02],[.88,2.25,.02]
  ],.07,wood,80,14);
  frame.name='arco curvo da harpa';group.add(frame);

  const spine=tube([
    [-.18,.24,.02],[-.02,.88,.02],[.18,1.48,.02],[.44,2.05,.02]
  ],.055,darkWoodForHarp(wood),48,12);
  spine.name='coluna estrutural da harpa';group.add(spine);

  const soundboard=new THREE.Mesh(new RoundedBoxGeometry(.27,.54,.15,6,.06),wood);
  soundboard.position.set(-.17,.48,.07);group.add(soundboard);

  for(let i=0;i<14;i++){
    const t=i/13;
    const x0=-.13+t*.34;
    const topX=.2+t*.55;
    const topY=2.23-.58*Math.pow((t-.5)*2,2);
    const string=tube([[x0,.56,.105],[x0+(topX-x0)*.42,1.33,.105],[topX,topY,.105]],.008,brass,24,5);
    string.name='corda individual de harpa';group.add(string);
    const pin=new THREE.Mesh(new THREE.SphereGeometry(.027,10,8),brass);
    pin.position.set(topX,topY,.11);group.add(pin);
  }

  const lowerBrace=tube([[-.22,.32,.14],[-.08,.25,.14],[.1,.3,.14]],.024,brass,20,7);
  group.add(lowerBrace);
  scene.add(group);

  addBoxCollider(colliders,x,baseY+1.15,z,.95,2.35,.5);
  interactables.push({
    name:'Harpa egípcia',
    kind:'inspect',
    label:'Harpa arqueada',
    description:'Harpa cerimonial com caixa de ressonância entalhada e cordas individuais tensionadas',
    position:new THREE.Vector3(x,baseY+1.15,z),
    radius:2.35
  });
  return group;
}

function darkWoodForHarp(material) {
  return new THREE.MeshStandardMaterial({
    color:0x6b472d,
    map:material.map,
    normalMap:material.normalMap,
    normalScale:new THREE.Vector2(.8,.8),
    roughnessMap:material.roughnessMap,
    roughness:.76
  });
}

function addCeremonialDrum(scene,x,baseY,z,wood,brass,colliders,interactables) {
  const group=new THREE.Group();
  group.name='tambor cerimonial de pele e madeira';
  group.position.set(x,baseY,z);

  const shell=new THREE.Mesh(new THREE.LatheGeometry([
    new THREE.Vector2(.29,0),new THREE.Vector2(.34,.07),new THREE.Vector2(.39,.18),
    new THREE.Vector2(.42,.46),new THREE.Vector2(.38,.67),new THREE.Vector2(.31,.76)
  ],48),wood);
  shell.name='corpo torneado do tambor';
  shell.castShadow=true;shell.receiveShadow=true;group.add(shell);

  const skinMat=new THREE.MeshStandardMaterial({color:0xd6c39d,roughness:.92,bumpMap:wood.normalMap,bumpScale:.014});
  const skin=new THREE.Mesh(new THREE.CircleGeometry(.315,48),skinMat);
  skin.name='pele tensionada do tambor';
  skin.rotation.x=-Math.PI/2;skin.position.y=.765;group.add(skin);

  for(const y of [.12,.68,.76]){
    const ring=new THREE.Mesh(new THREE.TorusGeometry(y===.76?.33:.4,.025,8,48),brass);
    ring.rotation.x=Math.PI/2;ring.position.y=y;group.add(ring);
  }

  for(let i=0;i<16;i++){
    const a=i/16*Math.PI*2;
    const cord=tube([
      [Math.cos(a)*.395,.16,Math.sin(a)*.395],
      [Math.cos(a+.035)*.42,.42,Math.sin(a+.035)*.42],
      [Math.cos(a)*.355,.69,Math.sin(a)*.355]
    ],.012,brass,18,5);
    cord.name='amarração de pele do tambor';group.add(cord);
    const rivet=new THREE.Mesh(new THREE.SphereGeometry(.028,10,8),brass);
    rivet.position.set(Math.cos(a)*.4,.64,Math.sin(a)*.4);group.add(rivet);
  }

  scene.add(group);
  addBoxCollider(colliders,x,baseY+.39,z,.94,.84,.94);
  interactables.push({
    name:'Tambor cerimonial',
    kind:'inspect',
    label:'Tambor de pele',
    description:'Tambor de madeira torneada, pele natural tensionada e amarrações de bronze',
    position:new THREE.Vector3(x,baseY+.4,z),
    radius:1.45
  });
  return group;
}

function addWallSpear(scene,x,baseY,z,rotation,wood,brass,colliders,interactables) {
  const group=new THREE.Group();
  group.name='lança cerimonial egípcia';
  group.position.set(x,baseY,z);
  group.rotation.y=rotation;

  const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.035,.058,2.65,32,1),wood);
  shaft.name='haste torneada da lança';shaft.position.y=1.28;shaft.castShadow=true;group.add(shaft);

  const shape=new THREE.Shape();
  shape.moveTo(0,0);shape.quadraticCurveTo(.16,.25,.115,.52);
  shape.quadraticCurveTo(.05,.78,0,.94);
  shape.quadraticCurveTo(-.05,.78,-.115,.52);
  shape.quadraticCurveTo(-.16,.25,0,0);
  const headGeo=new THREE.ExtrudeGeometry(shape,{depth:.045,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.018,bevelThickness:.018,curveSegments:18});
  const headMat=new THREE.MeshStandardMaterial({color:0xc0a16c,metalness:.82,roughness:.24});
  const head=new THREE.Mesh(headGeo,headMat);
  head.name='ponta foliácea de bronze da lança';
  head.position.set(0,2.47,.02);head.castShadow=true;group.add(head);

  const fuller=tube([[0,2.52,.085],[0,2.82,.085],[0,3.18,.085],[0,3.36,.065]],.009,brass,30,5);
  fuller.name='sulco central da ponta da lança';group.add(fuller);

  for(const [y,r] of [[.12,.052],[.34,.049],[2.42,.075],[2.5,.06]]){
    const collar=new THREE.Mesh(new THREE.TorusGeometry(r,.018,8,32),brass);
    collar.rotation.x=Math.PI/2;collar.position.y=y;group.add(collar);
  }

  const mount=new THREE.Mesh(new RoundedBoxGeometry(.62,.14,.12,5,.035),darkWoodForHarp(wood));
  mount.position.set(0,1.26,-.08);group.add(mount);
  scene.add(group);

  interactables.push({
    name:'Lança cerimonial',
    kind:'inspect',
    label:'Lança de bronze',
    description:'Lança egípcia exposta na parede, com haste de nogueira e ponta de bronze em forma de folha',
    position:new THREE.Vector3(x,baseY+1.5,z),
    radius:4.7
  });
  return group;
}

function addWallKhopesh(scene,x,baseY,z,rotation,wood,brass,interactables) {
  const group=new THREE.Group();
  group.name='khopesh cerimonial de bronze exposto';
  group.position.set(x,baseY,z);
  group.rotation.y=rotation;

  const grip=new THREE.Mesh(new THREE.CylinderGeometry(.045,.052,.48,24),wood);
  grip.name='cabo de madeira do khopesh';
  grip.position.y=.25;grip.castShadow=true;group.add(grip);

  const guard=new THREE.Mesh(new THREE.TorusGeometry(.095,.025,10,32),brass);
  guard.rotation.x=Math.PI/2;guard.position.y=.51;group.add(guard);

  const shape=new THREE.Shape();
  shape.moveTo(-.06,.48);
  shape.quadraticCurveTo(-.01,.75,.16,.91);
  shape.quadraticCurveTo(.39,1.08,.56,1.28);
  shape.quadraticCurveTo(.73,1.48,.63,1.70);
  shape.quadraticCurveTo(.55,1.87,.35,1.83);
  shape.quadraticCurveTo(.23,1.76,.27,1.62);
  shape.quadraticCurveTo(.39,1.59,.46,1.47);
  shape.quadraticCurveTo(.51,1.36,.38,1.24);
  shape.quadraticCurveTo(.22,1.08,.03,.98);
  shape.quadraticCurveTo(-.16,.83,-.17,.58);
  shape.lineTo(-.06,.48);

  const bladeGeo=new THREE.ExtrudeGeometry(shape,{
    depth:.055,bevelEnabled:true,bevelSegments:4,
    steps:1,bevelSize:.018,bevelThickness:.018,curveSegments:28
  });
  const bladeMat=new THREE.MeshPhysicalMaterial({
    color:0xb99153,metalness:.88,roughness:.24,
    clearcoat:.4,clearcoatRoughness:.18
  });
  const blade=new THREE.Mesh(bladeGeo,bladeMat);
  blade.name='lâmina curva do khopesh';
  blade.position.z=.035;blade.castShadow=true;group.add(blade);

  const fuller=tube([
    [-.015,.73,.105],[.11,.98,.105],[.35,1.2,.105],
    [.55,1.47,.105],[.49,1.68,.105],[.35,1.72,.105]
  ],.009,brass,36,6);
  fuller.name='sulco gravado da lâmina curva';group.add(fuller);

  for(const y of [.1,.4,.52]){
    const ferrule=new THREE.Mesh(new THREE.TorusGeometry(y===.52?.072:.052,.018,8,28),brass);
    ferrule.rotation.x=Math.PI/2;ferrule.position.y=y;group.add(ferrule);
  }

  scene.add(group);
  interactables.push({
    name:'Khopesh de bronze',
    kind:'inspect',
    label:'Khopesh cerimonial',
    description:'Lâmina curva egípcia em bronze polido, com cabo de nogueira e sulco gravado',
    position:new THREE.Vector3(x,baseY+.9,z),
    radius:4.8
  });
  return group;
}

function addModernTelevision(scene,brass,colliders,interactables) {
  const group=new THREE.Group();
  group.name='televisor moderno emoldurado no Grande Salão';
  group.position.set(0,19.0,-8.98);

  const shellMat=new THREE.MeshPhysicalMaterial({color:0x171b1c,metalness:.58,roughness:.32,clearcoat:.55,clearcoatRoughness:.22});
  const glassMat=new THREE.MeshPhysicalMaterial({color:0x080d10,metalness:.38,roughness:.12,clearcoat:1,clearcoatRoughness:.08,emissive:0x071014,emissiveIntensity:.28});
  const shell=new THREE.Mesh(new RoundedBoxGeometry(4.72,2.58,.2,8,.09),shellMat);
  shell.name='moldura metálica arredondada da TV';shell.castShadow=true;group.add(shell);

  const screen=new THREE.Mesh(new RoundedBoxGeometry(4.48,2.32,.035,8,.055),glassMat);
  screen.name='painel de vidro refletivo da TV';screen.position.z=.115;group.add(screen);

  const innerRim=new THREE.Mesh(new THREE.RingGeometry(2.08,2.14,96,1),brass);
  innerRim.name='filete de bronze sob a tela';innerRim.position.set(0,-1.205,.115);innerRim.scale.set(1,.065,1);group.add(innerRim);

  const sensor=new THREE.Mesh(new THREE.SphereGeometry(.035,12,10),new THREE.MeshBasicMaterial({color:0xd7ac67,emissive:0x8b642b,emissiveIntensity:.3}));
  sensor.position.set(2.24,-1.17,.16);group.add(sensor);

  scene.add(group);
  interactables.push({
    name:'Televisor do Grande Salão',
    kind:'inspect',
    label:'TV acima da lareira',
    description:'A tela moderna contrasta com o manto de pedra e a arquitetura egípcia da sala',
    position:new THREE.Vector3(0,19.0,-8.4),
    radius:6.5
  });
  return group;
}

export function buildGrandSalon({
  THREE: T,
  scene,
  animated=[],
  camera,
  isTouchDevice=false,
  colliders=[],
  interactables=[]
}) {
  const stone=stoneMaterial();
  const walnut=woodMaterial();
  const marble=marbleMaterial();
  const brass=new T.MeshStandardMaterial({color:0xb78d4f,metalness:.72,roughness:.29});
  const pale=new T.MeshStandardMaterial({color:0xd3c09a,roughness:.9});
  const floorMaterial=new T.MeshStandardMaterial({color:0xffffff,roughness:.72});

  // Real PBR maps from CC0 Poly Haven / ambientCG sets, kept local in the project.
  bindPbrMaps(stone,'plaster-smooth-beige',[2,1.4],false);
  bindPbrMaps(walnut,'wood-walnut',[2.2,1.2],true);
  bindPbrMaps(marble,'marble-white',[1,1],false);
  bindPbrMaps(floorMaterial,'tile-limestone-beige',[1.2,1],true);

  const darkWood=new T.MeshStandardMaterial({
    color:0x76543b,
    map:walnut.map,
    normalMap:walnut.normalMap,
    normalScale:new T.Vector2(.72,.72),
    roughnessMap:walnut.roughnessMap,
    roughness:.78
  });
  const relief=reliefTexture();

  scene.traverse(o=>{
    if([
      'sofá legado do Grande Salão','tapete legado do Grande Salão',
      'mesa de centro legado','pé mesa legado','guarda-corpo da sacada',
      'balaústre','viga sacada','harpa decorativa','lança cerimonial',
      'tambor decorativo','pele do tambor','estátua de cerâmica',
      'cabeça de estátua','face da estátua','pedestal de pedra',
      'coroa ritual','TV de plasma','tela da TV'
    ].includes(o.name)) o.visible=false;

    if(
      o.name==='parede interna do salão' ||
      o.name==='parede lateral do salão' ||
      o.name==='sacada de calcário' ||
      o.name==='coluna de calcário' ||
      o.name==='moldura da lareira' ||
      o.name==='manto de pedra'
    ) o.material=stone;

    if(o.name==='piso do Grande Salão') o.material=floorMaterial;
  });

  for(const x of [-8.8,8.8]) {
    for(const z of [-6.7,6.3]) {
      lotusColumn(scene,x,z,stone,pale,brass);
      addBoxCollider(colliders,x,20.65,z,1.5,14.9,1.5);
    }
  }

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

  // Musical instruments and ceremonial weapons: bespoke high-detail forms,
  // because no compatible licensed Egyptian instrument pack was verified.
  addHarpDisplay(scene,-11.65,13.32,-9.64,walnut,brass,colliders,interactables);
  addHarpDisplay(scene,11.65,13.32,-9.64,walnut,brass,colliders,interactables);
  addCeremonialDrum(scene,-12.6,13.18,1.2,walnut,brass,colliders,interactables);
  addCeremonialDrum(scene,12.6,13.18,1.2,walnut,brass,colliders,interactables);
  addWallSpear(scene,-11.8,15.65,8.82,Math.PI,walnut,brass,colliders,interactables);
  addWallSpear(scene,11.8,15.65,8.82,Math.PI,walnut,brass,colliders,interactables);
  addWallKhopesh(scene,-10.4,15.9,8.82,Math.PI,walnut,brass,interactables);
  addWallKhopesh(scene,10.4,15.9,8.82,Math.PI,walnut,brass,interactables);
  addModernTelevision(scene,brass,colliders,interactables);

  addWallReliefs(scene,brass,darkWood,stone,relief);
  ceilingOrnament(scene,brass,darkWood);

  // Replaced legacy block props with sourced SVG iconography and bespoke 3D models.
  addGreatHallDoors(scene,stone,darkWood,brass,colliders,interactables);
  for(const side of [-1,1]){
    createWallHarp(scene,side,darkWood,brass,colliders,interactables);
    createWallDrum(scene,side,darkWood,brass,plasterMaterialFrom(stone),colliders,interactables);
    createSpearDisplay(scene,side,darkWood,brass,ironMaterial(),colliders,interactables);
  }

  const upholstery=new T.MeshStandardMaterial({
    color:0x65402f,
    roughness:.86,
    bumpMap:walnut.normalMap,
    bumpScale:.012
  });

  // Fallback sofa proportions match the physical Poly Haven model. It disappears only
  // after the local GLB has loaded successfully.
  const sofaFallbacks=[
    createSofa(scene,-2.55,3.45,Math.PI/2,upholstery,darkWood,brass),
    createSofa(scene,2.55,3.45,-Math.PI/2,upholstery,darkWood,brass)
  ];
  loadSofaAssets(scene,sofaFallbacks,colliders,interactables);

  const rug=createRug(scene);
  const table=centerTable(scene,walnut,brass);
  addBoxCollider(colliders,0,13.47,3.45,1.58,.62,1.58);
  interactables.push({
    name:'Mesa de centro de nogueira',
    kind:'inspect',
    label:'Mesa de centro entalhada',
    description:'Mesa circular baixa de nogueira, com medalhão solar e filetes de bronze',
    position:new T.Vector3(0,13.62,3.45),
    radius:1.55
  });

  const fire=addFire(scene,animated,camera,isTouchDevice);
  const fireLight=fire.fireLight;
  addBoxCollider(colliders,0,15.25,-8.3,3.2,2.4,.9);
  interactables.push({
    name:'Lareira monumental',
    kind:'inspect',
    label:'Lareira do Grande Salão',
    description:'Lareira monumental com lenha, brasas e chamas volumétricas animadas',
    position:new T.Vector3(0,15.0,-7.9),
    radius:2.2
  });

  addThoth(scene,marble,pale,brass,relief,walnut);
  addBoxCollider(colliders,0,17.75,-.5,2.7,9.2,2.7);
  interactables.push({
    name:'Estátua de Thoth',
    kind:'inspect',
    label:'Thoth, deus da escrita',
    description:'Estátua monumental de Thoth em basalto negro, com cabeça de íbis, papiro e cetro. A superfície preserva reflexos profundos e veios minerais.',
    position:new T.Vector3(0,15.0,-.5),
    radius:2.6
  });

  const sideLight=new T.PointLight(0xffbe78,.9,12,1.8);
  sideLight.position.set(0,20.3,7.9);
  scene.add(sideLight);

  return {
    fireLight,
    update:fire.update,
    stairRamps,
    walkablePlatforms,
    interactables,
    rug,
    table
  };
}

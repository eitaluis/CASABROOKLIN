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
    centerX,baseY,topY,startZ,direction,width=1.9,depth=.53,count=18,
    landingWidth=2.45,landingDepth=1.75
  }=options;
  const rise=(topY-baseY)/count,thick=.19;
  const left=[],right=[],lowL=[],lowR=[];
  const balusterGeo=new THREE.LatheGeometry([
    new THREE.Vector2(.035,0),new THREE.Vector2(.055,.1),new THREE.Vector2(.105,.22),
    new THREE.Vector2(.075,.4),new THREE.Vector2(.045,.58),new THREE.Vector2(.078,.76),
    new THREE.Vector2(.045,.9)
  ],20);
  for(let i=0;i<count;i++) {
    const top=baseY+(i+1)*rise;
    const z=startZ+direction*(i+.5)*depth;
    const tread=new THREE.Mesh(new RoundedBoxGeometry(width,thick,depth+.04,7,.035),i%2?stone:treadMaterial);
    tread.name='degrau amplo de calcário da escadaria central';
    tread.position.set(centerX,top-thick/2,z);
    tread.castShadow=true;tread.receiveShadow=true;scene.add(tread);
    const nosing=new THREE.Mesh(new RoundedBoxGeometry(width-.08,.035,.075,5,.012),brass);
    nosing.name='filete de bronze no degrau central';
    nosing.position.set(centerX,top-.035,z-direction*depth*.45);scene.add(nosing);
    const xL=centerX-width*.49,xR=centerX+width*.49,railY=top+.94;
    left.push([xL,railY,z]);right.push([xR,railY,z]);
    lowL.push([xL,top+.14,z]);lowR.push([xR,top+.14,z]);
    if(i%2===0)for(const x of [xL,xR]) {
      const baluster=new THREE.Mesh(balusterGeo,brass);
      baluster.name='balaústre esculpido da escadaria central';
      baluster.position.set(x,top+.12,z);baluster.castShadow=true;scene.add(baluster);
    }
  }
  scene.add(
    tube(left,.07,wood,80,12),tube(right,.07,wood,80,12),
    tube(left.map(p=>[p[0],p[1]-.07,p[2]]),.018,brass,80,8),
    tube(right.map(p=>[p[0],p[1]-.07,p[2]]),.018,brass,80,8),
    tube(lowL,.03,brass,80,8),tube(lowR,.03,brass,80,8)
  );
  const endZ=startZ+direction*count*depth;
  const landingZ=endZ+direction*.34;
  const landing=new THREE.Mesh(new RoundedBoxGeometry(landingWidth,.25,landingDepth,10,.045),stone);
  landing.name='patamar de calcário da escadaria central';
  landing.position.set(centerX,topY-.125,landingZ);
  landing.castShadow=true;landing.receiveShadow=true;scene.add(landing);
  const postGeo=new THREE.LatheGeometry([
    new THREE.Vector2(.13,0),new THREE.Vector2(.17,.16),new THREE.Vector2(.12,.36),
    new THREE.Vector2(.21,.54),new THREE.Vector2(.22,.83),new THREE.Vector2(.1,1.1),
    new THREE.Vector2(.06,1.23)
  ],24);
  for(const [z,y] of [[startZ,baseY],[endZ+direction*.15,topY]])for(const dx of [-1,1]) {
    const post=new THREE.Mesh(postGeo,brass);
    post.position.set(centerX+dx*(width*.52),y+.08,z);
    post.name='poste de bronze da escadaria central';post.castShadow=true;scene.add(post);
  }
  return {
    centerX,width,startZ,endZ,bottomY:baseY,topY,
    landingPlatform:{
      minX:centerX-landingWidth/2+.02,maxX:centerX+landingWidth/2-.02,
      minZ:landingZ-landingDepth/2+.02,maxZ:landingZ+landingDepth/2-.02,
      height:topY
    }
  };
}

function addGreatHallWarmLighting(scene) {
  const ambient=new THREE.HemisphereLight(0xffdfbd,0x574131,.58);
  ambient.name='luz ambiente quente difusa do Grande Salão';scene.add(ambient);
  const sources=[
    [-10.5,19.5,-5.0,1.05,17],
    [10.5,19.5,-5.0,1.05,17],
    [-10.5,19.5,5.0,.92,16],
    [10.5,19.5,5.0,.92,16],
    [0,20.5,-.5,.7,13]
  ];
  for(const [x,y,z,intensity,distance] of sources) {
    const light=new THREE.PointLight(0xffc88b,intensity,distance,1.75);
    light.name='luz rebatida âmbar do Grande Salão';
    light.position.set(x,y,z);scene.add(light);
  }
}

function addBalconyDoorRows(scene,stone,wood,brass,colliders,interactables,groundSurfaces) {
  const platforms=[];
  const levels=[16.875,20.625,24.375];
  const positions=[-7,0,7];
  const wallX=14.2,baseY=13.175,topY=28.35;
  const roomWood=new THREE.MeshStandardMaterial({
    color:0x755638,map:wood.map,normalMap:wood.normalMap,
    normalScale:new THREE.Vector2(.72,.72),roughnessMap:wood.roughnessMap,roughness:.78
  });
  for(const side of [-1,1]) {
    const spans=[[-10.2,-7.98],[-6.02,-.98],[.98,6.02],[7.98,9.2]];
    for(const [a,b] of spans) {
      const h=topY-levels[0];
      const wall=new THREE.Mesh(new RoundedBoxGeometry(.55,h,b-a,8,.055),stone);
      wall.name='trecho de alvenaria entre portas das galerias';
      wall.position.set(side*wallX,(levels[0]+topY)/2,(a+b)/2);
      wall.castShadow=true;wall.receiveShadow=true;scene.add(wall);
      addBoxCollider(colliders,side*wallX,(levels[0]+topY)/2,(a+b)/2,.55,h,b-a);
    }
    for(const z of positions) {
      const bands=[[levels[0]+2.78,levels[1]],[levels[1]+2.78,levels[2]],[levels[2]+2.78,topY]];
      for(const [lo,hi] of bands) {
        const h=hi-lo;if(h<=.05)continue;
        const band=new THREE.Mesh(new RoundedBoxGeometry(.55,h,1.9,6,.035),stone);
        band.name='lintel e peitoril de calcário entre portas';
        band.position.set(side*wallX,(lo+hi)/2,z);
        band.castShadow=true;band.receiveShadow=true;scene.add(band);
        addBoxCollider(colliders,side*wallX,(lo+hi)/2,z,.55,h,1.9);
      }
      levels.forEach(floorY=>{
        const roomX=side*16.08,roomWidth=3.55,roomDepth=4.35,roomHeight=3.28;
        const floor=new THREE.Mesh(new RoundedBoxGeometry(roomWidth,.22,roomDepth,8,.045),stone);
        floor.name='piso de calcário da sala lateral da galeria';
        floor.position.set(roomX,floorY-.11,z);floor.receiveShadow=true;floor.castShadow=true;scene.add(floor);
        groundSurfaces?.push(floor);
        const back=new THREE.Mesh(new RoundedBoxGeometry(.22,roomHeight,roomDepth,8,.035),stone);
        back.name='parede de fundo da sala lateral';
        back.position.set(side*17.82,floorY+roomHeight/2,z);
        back.castShadow=true;back.receiveShadow=true;scene.add(back);
        addBoxCollider(colliders,side*17.82,floorY+roomHeight/2,z,.22,roomHeight,roomDepth);
        for(const end of [-1,1]) {
          const partition=new THREE.Mesh(new RoundedBoxGeometry(roomWidth,roomHeight,.18,8,.03),stone);
          partition.name='parede divisória da sala lateral';
          partition.position.set(roomX,floorY+roomHeight/2,z+end*(roomDepth/2));
          partition.castShadow=true;partition.receiveShadow=true;scene.add(partition);
          addBoxCollider(colliders,roomX,floorY+roomHeight/2,z+end*(roomDepth/2),roomWidth,roomHeight,.18);
        }
        const ceiling=new THREE.Mesh(new RoundedBoxGeometry(roomWidth,.16,roomDepth,6,.035),stone);
        ceiling.name='forro de calcário da sala lateral';
        ceiling.position.set(roomX,floorY+3.48,z);ceiling.receiveShadow=true;scene.add(ceiling);
        const consoleBase=new THREE.Mesh(new RoundedBoxGeometry(1.45,.58,.56,8,.06),roomWood);
        consoleBase.name='console de nogueira da sala lateral';
        consoleBase.position.set(side*16.95,floorY+.34,z);
        consoleBase.castShadow=true;consoleBase.receiveShadow=true;scene.add(consoleBase);
        const consoleTop=new THREE.Mesh(new RoundedBoxGeometry(1.62,.09,.66,8,.035),brass);
        consoleTop.position.set(side*16.95,floorY+.66,z);scene.add(consoleTop);
        addBoxCollider(colliders,side*16.95,floorY+.36,z,1.5,.72,.62);
        platforms.push({
          minX:side<0?-17.82:14.30,maxX:side<0?-14.30:17.82,
          minZ:z-roomDepth/2+.14,maxZ:z+roomDepth/2-.14,height:floorY
        });
        const portal=new THREE.Group();
        portal.name='portal funcional da sala lateral';
        portal.position.set(side*wallX,floorY,z);
        portal.rotation.y=side<0?Math.PI/2:-Math.PI/2;scene.add(portal);
        for(const x of [-.98,.98]) {
          const jamb=new THREE.Mesh(new RoundedBoxGeometry(.22,2.86,.48,8,.05),stone);
          jamb.position.set(x,1.43,0);jamb.castShadow=true;jamb.receiveShadow=true;portal.add(jamb);
        }
        const lintel=new THREE.Mesh(new RoundedBoxGeometry(2.16,.24,.48,8,.05),stone);
        lintel.position.set(0,2.86,0);lintel.castShadow=true;portal.add(lintel);
        const threshold=new THREE.Mesh(new RoundedBoxGeometry(1.9,.1,.56,8,.025),brass);
        threshold.position.set(0,.045,0);portal.add(threshold);
        const hinge=new THREE.Group();hinge.position.set(-.84,.11,.10);portal.add(hinge);
        const leaf=new THREE.Mesh(new RoundedBoxGeometry(1.68,2.58,.14,10,.06),roomWood);
        leaf.name='folha articulada de porta da galeria';leaf.position.set(.84,1.31,0);
        leaf.castShadow=true;leaf.receiveShadow=true;hinge.add(leaf);
        for(const x of [.22,.84,1.46]) {
          const stile=new THREE.Mesh(new RoundedBoxGeometry(.075,2.35,.045,5,.018),brass);
          stile.position.set(x,1.31,.095);hinge.add(stile);
        }
        for(const y of [.28,1.31,2.34]) {
          const rail=new THREE.Mesh(new RoundedBoxGeometry(1.55,.07,.05,5,.02),brass);
          rail.position.set(.84,y,.095);hinge.add(rail);
        }
        const medallion=new THREE.Mesh(new THREE.TorusGeometry(.23,.025,10,48),brass);
        medallion.position.set(.84,1.34,.105);hinge.add(medallion);
        const knob=new THREE.Mesh(new THREE.SphereGeometry(.075,20,14),brass);
        knob.position.set(1.48,1.23,.16);hinge.add(knob);
        const collider={
          minX:side*wallX-.18,maxX:side*wallX+.18,
          minY:floorY+.02,maxY:floorY+2.72,minZ:z-.9,maxZ:z+.9
        };
        colliders.push(collider);
        let opened=false;
        interactables.push({
          name:'Porta da galeria para sala lateral',kind:'door',
          label:'Porta de nogueira da galeria',
          description:'Porta de madeira com ferragens de bronze. Pressione E ou INTERAGIR para abrir e atravessar.',
          position:new THREE.Vector3(side*13.15,floorY+1.15,z),radius:2.65,
          onInteract(){
            opened=!opened;
            if(opened) {
              hinge.rotation.y=side<0?-Math.PI/2:Math.PI/2;
              const index=colliders.indexOf(collider);if(index>=0)colliders.splice(index,1);
              return 'A porta se abre para a sala lateral.';
            }
            hinge.rotation.y=0;if(!colliders.includes(collider))colliders.push(collider);
            return 'A porta de nogueira foi fechada.';
          }
        });
      });
    }
    for(const z of [-9.85,8.85]) {
      const pilaster=new THREE.Mesh(new RoundedBoxGeometry(.7,15.2,.7,8,.08),stone);
      pilaster.name='pilastra de calcário do corredor lateral';
      pilaster.position.set(side*14.2,20.75,z);pilaster.castShadow=true;pilaster.receiveShadow=true;scene.add(pilaster);
    }
  }
  return platforms;
}

function addGalleryWalkways(scene,stone,groundSurfaces) {
  const platforms=[];
  const levels=[16.875,20.625,24.375];
  for(const floorY of levels)for(const side of [-1,1]) {
    const pieces=[
      {x:side*8.3,z:-.5,w:1.4,d:19.0},
      {x:side*12.55,z:-.5,w:1.7,d:19.0},
      {x:side*10.35,z:-5.65,w:2.7,d:7.7},
      {x:side*10.35,z:8.55,w:2.7,d:1.3},
      {x:side*10.35,z:-.91,w:2.72,d:1.72},
      {x:side*10.35,z:7.35,w:2.72,d:1.72}
    ];
    for(const p of pieces) {
      const slab=new THREE.Mesh(new RoundedBoxGeometry(p.w,.55,p.d,8,.07),stone);
      slab.name='plataforma de calcário da galeria com vão de escada';
      slab.position.set(p.x,floorY-.275,p.z);
      slab.castShadow=true;slab.receiveShadow=true;scene.add(slab);
      groundSurfaces?.push(slab);
      platforms.push({
        minX:p.x-p.w/2+.05,maxX:p.x+p.w/2-.05,
        minZ:p.z-p.d/2+.05,maxZ:p.z+p.d/2-.05,height:floorY
      });
    }
  }
  return platforms;
}

function addBalustrades(scene,stone,brass,wood) {
  scene.traverse(o=>{if(o.name==='guarda-corpo da sacada'||o.name==='balaústre'||o.name==='viga sacada')o.visible=false;});
  const geo=new THREE.LatheGeometry([
    new THREE.Vector2(.035,0),new THREE.Vector2(.07,.08),new THREE.Vector2(.065,.17),
    new THREE.Vector2(.105,.28),new THREE.Vector2(.09,.42),new THREE.Vector2(.055,.54),
    new THREE.Vector2(.045,.72),new THREE.Vector2(.075,.82)
  ],24);
  const segments=[[-9.05,-8.18],[-5.82,-1.18],[1.18,5.82],[8.18,9.05]];
  for(let level=0;level<3;level++)for(const side of [-1,1]) {
    const y=16.875+level*3.75,x=side*13.08;
    for(const [z0,z1] of segments) {
      const pts=[],low=[],count=Math.max(2,Math.round((z1-z0)*3));
      for(let i=0;i<=count;i++) {
        const z=z0+(z1-z0)*i/count;pts.push([x,y+1.03,z]);low.push([x,y+.16,z]);
      }
      scene.add(tube(pts,.075,wood,72,12));
      scene.add(tube(pts.map(p=>[p[0],p[1]-.075,p[2]]),.018,brass,72,8));
      scene.add(tube(low,.042,brass,72,8));
      for(let z=z0+.12;z<z1-.05;z+=.52) {
        const baluster=new THREE.Mesh(geo,stone);
        baluster.name='balaústre torneado da galeria';baluster.position.set(x,y+.16,z);
        baluster.castShadow=true;scene.add(baluster);
      }
    }
    for(const z of [-8.15,-5.85,-1.15,1.15,5.85,8.15]) {
      const post=new THREE.Mesh(new THREE.LatheGeometry([
        new THREE.Vector2(.12,0),new THREE.Vector2(.16,.18),new THREE.Vector2(.11,.38),
        new THREE.Vector2(.2,.55),new THREE.Vector2(.23,.78),new THREE.Vector2(.13,1.02),
        new THREE.Vector2(.06,1.18)
      ],24),brass);
      post.name='poste de interrupção do guarda-corpo para acesso às portas';
      post.position.set(x,y,z);post.castShadow=true;scene.add(post);
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
  const med=new THREE.Mesh(new THREE.CylinderGeometry(3.35,3.55,.14,96),wood);
  med.name='medalhão de cedro do teto';med.position.set(0,28.28,-.5);med.castShadow=true;scene.add(med);
  for(const r of [2.85,3.05,3.28]) {
    const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.035,10,96),brass);
    ring.rotation.x=Math.PI/2;ring.position.set(0,28.19,-.5);scene.add(ring);
  }
  const petalMaterial=new THREE.MeshStandardMaterial({color:0xc3a36b,metalness:.62,roughness:.34});
  for(let i=0;i<12;i++) {
    const angle=i*Math.PI/6;
    const petal=new THREE.Mesh(new THREE.SphereGeometry(.48,24,16),petalMaterial);
    petal.name='pétala de lótus arredondada do medalhão do teto';
    petal.scale.set(.42,.12,.88);
    petal.position.set(Math.cos(angle)*.4,28.08,Math.sin(angle)*.4-.5);
    petal.rotation.y=-angle;scene.add(petal);
  }
  const core=new THREE.Mesh(new THREE.SphereGeometry(.34,32,20),petalMaterial);
  core.name='núcleo arredondado do medalhão de lótus';
  core.scale.set(1,.22,1);core.position.set(0,28.08,-.5);scene.add(core);
}
function createSofa(scene,x,z,rotation,upholstery,wood,brass) {
  const group=new THREE.Group();
  group.name='sofá de reserva do Grande Salão';
  group.position.set(x,13.175,z);
  group.rotation.y=rotation;
  group.scale.set(.9,.86,.86);

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
    {x:-4.85,z:-4.6,rotation:Math.PI/2,side:'oeste'},
    {x:4.85,z:-4.6,rotation:-Math.PI/2,side:'leste'}
  ];

  loader.load(source,gltf=>{
    try {
      const sourceRoot=gltf.scene;
      sourceRoot.updateMatrixWorld(true);
      const sourceBox=new THREE.Box3().setFromObject(sourceRoot);
      const sourceSize=sourceBox.getSize(new THREE.Vector3());
      if(sourceBox.isEmpty() || sourceSize.x<0.1 || sourceSize.y<0.1 || sourceSize.z<0.1){
        throw new Error('O GLB Sofa 03 não contém uma malha visível ou dimensões válidas.');
      }

      placements.forEach((place,index)=>{
        const model=sourceRoot.clone(true);
        model.name='sofá Poly Haven Sofa 03 · '+place.side;
        model.scale.setScalar(1.45);
        model.rotation.y=place.rotation;
        model.updateMatrixWorld(true);

        let box=new THREE.Box3().setFromObject(model);
        if(box.isEmpty()) throw new Error('O sofá '+place.side+' veio sem geometria renderizável.');
        const center=box.getCenter(new THREE.Vector3());

        // Corrige o pivot original do GLB e assenta a malha no piso real do salão.
        model.position.x += place.x-center.x;
        model.position.z += place.z-center.z;
        model.updateMatrixWorld(true);
        box=new THREE.Box3().setFromObject(model);
        model.position.y += 13.175-box.min.y;
        model.updateMatrixWorld(true);

        let meshCount=0;
        model.traverse(object=>{
          if(object.isMesh){
            meshCount++;
            object.visible=true;
            object.castShadow=true;
            object.receiveShadow=true;
            object.frustumCulled=false;
          }
        });
        if(!meshCount) throw new Error('O sofá '+place.side+' não possui meshes visíveis.');

        model.userData.assetId='polyhaven-sofa-03';
        model.userData.license='CC0-1.0';
        model.userData.nativeDimensions=[2.731,.925,1.118];
        model.userData.appliedScale=1.45;
        model.userData.interaction={
          type:'inspect',
          label:'Sofá de couro',
          description:'Sofá Poly Haven Sofa 03 em escala humana, com materiais PBR originais.'
        };
        scene.add(model);

        // Só remove o fallback depois de validar e adicionar a instância GLB.
        if(fallbacks[index]) fallbacks[index].visible=false;
        console.info('Sofá Poly Haven carregado:',place.side,box.getSize(new THREE.Vector3()).toArray());
      });
    } catch(error) {
      console.error('Falha ao preparar Sofa 03; os sofás de reserva continuam visíveis.',error);
      fallbacks.forEach(group=>{if(group)group.visible=true;});
    }
  },undefined,error=>{
    console.warn('Poly Haven Sofa 03 falhou; mantendo sofá de reserva visível.',error);
    fallbacks.forEach(group=>{if(group)group.visible=true;});
  });

  placements.forEach(place=>{
    addBoxCollider(colliders,place.x,13.68,place.z,2.05,1.2,4.25);
    interactables.push({
      name:'Sofá de couro '+place.side,
      kind:'inspect',
      label:'Sofá de couro do Grande Salão',
      description:'Sofá de couro Poly Haven Sofa 03, com escala de assento de uso humano e materiais PBR.',
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
    for(let row=-1;row<Math.ceil(h/sh)+1;row++) {
      const offset=(row%2)*sw*.5;
      for(let col=-1;col<Math.ceil(w/sw)+1;col++) {
        const x=col*sw+offset,y=row*sh,tone=palettes[Math.floor(rand()*palettes.length)];
        const gradient=g.createLinearGradient(x,y-sh*.35,x,y+sh*.55);
        gradient.addColorStop(0,'#6d7460');gradient.addColorStop(.26,tone);gradient.addColorStop(1,'#111f24');
        g.fillStyle=gradient;g.beginPath();g.moveTo(x-sw*.46,y);
        g.bezierCurveTo(x-sw*.43,y-sh*.44,x+sw*.43,y-sh*.44,x+sw*.46,y);
        g.bezierCurveTo(x+sw*.42,y+sh*.39,x+sw*.18,y+sh*.5,x,y+sh*.52);
        g.bezierCurveTo(x-sw*.2,y+sh*.5,x-sw*.42,y+sh*.39,x-sw*.46,y);
        g.closePath();g.fill();
        g.strokeStyle='rgba(8,17,20,.72)';g.lineWidth=2.2;g.stroke();
        g.strokeStyle='rgba(205,184,135,.3)';g.lineWidth=1.1;
        g.beginPath();g.moveTo(x-sw*.36,y-sh*.02);g.quadraticCurveTo(x,y-sh*.33,x+sw*.36,y-sh*.02);g.stroke();
        for(let n=0;n<18;n++){g.fillStyle=rand()>.5?'rgba(220,205,166,.09)':'rgba(0,0,0,.12)';g.fillRect(x+(rand()-.5)*sw*.65,y+(rand()-.5)*sh*.55,1+rand()*2,1+rand()*2);}
      }
    }
    g.strokeStyle='#a27c4e';g.lineWidth=14;g.strokeRect(10,10,w-20,h-20);
    g.strokeStyle='rgba(226,197,143,.48)';g.lineWidth=3;g.strokeRect(27,27,w-54,h-54);
    for(let i=0;i<1200;i++){g.fillStyle=rand()>.5?'rgba(211,194,150,.06)':'rgba(0,0,0,.08)';g.fillRect(rand()*w,rand()*h,1+rand()*2,1+rand()*2);}
  },1024,1024,1,1);
  const bump=tex((g,w,h)=>{
    g.fillStyle='#727272';g.fillRect(0,0,w,h);
    const sw=50,sh=40;
    for(let row=-1;row<Math.ceil(h/sh)+1;row++) {
      const offset=(row%2)*sw*.5;
      for(let col=-1;col<Math.ceil(w/sw)+1;col++) {
        const x=col*sw+offset,y=row*sh;g.fillStyle='#aaaaaa';g.beginPath();g.moveTo(x-sw*.46,y);
        g.bezierCurveTo(x-sw*.43,y-sh*.44,x+sw*.43,y-sh*.44,x+sw*.46,y);
        g.bezierCurveTo(x+sw*.42,y+sh*.39,x+sw*.18,y+sh*.5,x,y+sh*.52);
        g.bezierCurveTo(x-sw*.2,y+sh*.5,x-sw*.42,y+sh*.39,x-sw*.46,y);g.closePath();g.fill();
        g.strokeStyle='#404040';g.lineWidth=2;g.stroke();
      }
    }
    for(let i=0;i<16000;i++){const v=Math.floor(90+rand()*75);g.fillStyle='rgb('+v+','+v+','+v+')';g.fillRect(rand()*w,rand()*h,1+rand()*2,1+rand()*2);}
  },1024,1024,1,1);
  bump.colorSpace=THREE.NoColorSpace;
  const hide=new THREE.Shape();
  // Rotate the long 40-foot axis to follow the room; 15 feet remain across the hall.
  hide.moveTo(-.18,6.05);
  hide.bezierCurveTo(-1.05,6.12,-2.12,5.05,-2.23,3.45);
  hide.bezierCurveTo(-2.42,1.5,-2.18,-2.75,-1.83,-4.75);
  hide.bezierCurveTo(-1.62,-5.82,-.75,-6.24,.2,-6.12);
  hide.bezierCurveTo(1.28,-5.96,2.06,-4.42,2.2,-2.35);
  hide.bezierCurveTo(2.42,.15,2.2,3.92,1.16,5.35);
  hide.bezierCurveTo(.72,5.95,.26,6.22,-.18,6.05);
  const rug=new THREE.Mesh(new THREE.ShapeGeometry(hide,96),new THREE.MeshStandardMaterial({
    map:color,bumpMap:bump,bumpScale:.065,roughness:.96,side:THREE.DoubleSide
  }));
  rug.name='tapete de pele de serpente de quarenta pés por quinze pés do Grande Salão';
  rug.rotation.x=-Math.PI/2;rug.position.set(0,13.205,-.5);
  rug.receiveShadow=true;scene.add(rug);
  const edgePoints=hide.getPoints(120).map(p=>[p.x,13.22,-.5-p.y]);
  scene.add(tube(edgePoints,.022,new THREE.MeshStandardMaterial({color:0x957046,metalness:.52,roughness:.58}),120,7));
}

function centerTable(scene,wood,brass) {
  const group=new THREE.Group();
  group.name='mesa baixa circular de nogueira e bronze do Grande Salão';
  group.position.set(0,13.175,-4.6);
  group.scale.set(1.82,1,1.82);

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

function addGreatHallRearWall(scene,stone,brass) {
  const wallZ=-9.58,wallDepth=.78;
  const addBlock=(x,y,w,h,name='bloco de calcário aparelhado da parede posterior')=>{
    if(w<.08||h<.08)return;
    const mesh=new THREE.Mesh(new RoundedBoxGeometry(w,h,wallDepth,6,.035),stone);
    mesh.name=name;mesh.position.set(x,y,wallZ);
    mesh.castShadow=true;mesh.receiveShadow=true;scene.add(mesh);
  };
  // Lower wall wings contain two real openings; the middle bay is reserved for the fireplace.
  for(const side of [-1,1]) {
    const wingStart=side<0?-14.5:3.05,wingEnd=side<0?-3.05:14.5;
    const passageX=side*8.45,openWidth=2.85;
    const lowerBands=[[13.2,14.65],[14.72,16.18]];
    for(const [y0,y1] of lowerBands) {
      const openA=passageX-openWidth/2,openB=passageX+openWidth/2;
      const spans=[[wingStart,openA],[openB,wingEnd]];
      for(const [a,b] of spans) {
        const span=b-a;if(span<.15)continue;
        const count=Math.max(1,Math.ceil(span/2.15)),gap=.045;
        const each=(span-gap*(count-1))/count;
        for(let i=0;i<count;i++)addBlock(a+each/2+i*(each+gap),(y0+y1)/2,each,y1-y0-.06);
      }
    }
    const upperBottom=16.24,upperTop=28.35,upperH=upperTop-upperBottom,columns=5,rows=8;
    const blockW=(wingEnd-wingStart)/columns-.05,blockH=upperH/rows-.06;
    for(let row=0;row<rows;row++)for(let col=0;col<columns;col++) {
      const x=wingStart+(col+.5)*(wingEnd-wingStart)/columns+(row%2?.12:0);
      addBlock(THREE.MathUtils.clamp(x,wingStart+blockW/2,wingEnd-blockW/2),
        upperBottom+(row+.5)*upperH/rows,blockW,blockH);
    }
  }
  // Solid upper masonry and the lintel bridge above the monumental fireplace.
  const upperBottom=17.34,upperTop=28.35,columns=3,rows=8;
  const blockW=6.1/columns-.045,blockH=(upperTop-upperBottom)/rows-.06;
  for(let row=0;row<rows;row++)for(let col=0;col<columns;col++) {
    addBlock(-3.05+(col+.5)*6.1,upperBottom+(row+.5)*(upperTop-upperBottom)/rows,
      blockW,blockH,'bloco superior de calcário sobre a lareira');
  }
  const trim=new THREE.MeshStandardMaterial({
    color:0x9a8768,map:stone.map,normalMap:stone.normalMap,
    normalScale:new THREE.Vector2(.48,.48),roughnessMap:stone.roughnessMap,roughness:.9
  });
  // Recessed fireplace jambs and lintel are embedded in the wall plane.
  for(const side of [-1,1]) {
    const jamb=new THREE.Mesh(new RoundedBoxGeometry(.32,4.05,.92,8,.045),trim);
    jamb.name='ombreira integrada do nicho da lareira';
    jamb.position.set(side*2.88,15.18,-9.08);jamb.castShadow=true;jamb.receiveShadow=true;scene.add(jamb);
  }
  const header=new THREE.Mesh(new RoundedBoxGeometry(6.05,.25,.9,8,.045),trim);
  header.name='verga integrada do nicho da lareira';
  header.position.set(0,17.43,-9.1);header.castShadow=true;scene.add(header);
}

function addLowerPassages(scene,stone,brass,colliders,walkablePlatforms,groundSurfaces) {
  const trim=new THREE.MeshStandardMaterial({color:0x9a8058,metalness:.38,roughness:.58});
  for(const centre of [-8.45,8.45]) {
    const archZ=-9.08;
    const pierMat=stone;
    for(const x of [centre-1.48,centre+1.48]) {
      const pier=new THREE.Mesh(new RoundedBoxGeometry(.28,2.82,.82,8,.05),pierMat);
      pier.name='pilar do arco das passagens inferiores';
      pier.position.set(x,14.58,archZ);pier.castShadow=true;scene.add(pier);
      const base=new THREE.Mesh(new RoundedBoxGeometry(.48,.22,1.0,8,.04),trim);
      base.position.set(x,13.28,archZ+.02);scene.add(base);
      const capital=new THREE.Mesh(new RoundedBoxGeometry(.46,.2,.94,8,.04),trim);
      capital.position.set(x,15.96,archZ+.02);scene.add(capital);
    }
    const curvePoints=[
      [centre-1.48,16.02,archZ],[centre-1.35,16.38,archZ],
      [centre-.92,16.64,archZ],[centre,16.76,archZ],
      [centre+.92,16.64,archZ],[centre+1.35,16.38,archZ],
      [centre+1.48,16.02,archZ]
    ];
    scene.add(tube(curvePoints,.13,trim,72,14));
    const corridorFloor=new THREE.Mesh(new RoundedBoxGeometry(2.85,.22,2.85,8,.035),stone);
    corridorFloor.name='piso de calcário da passagem inferior';
    corridorFloor.position.set(centre,13.08,-11.25);corridorFloor.receiveShadow=true;scene.add(corridorFloor);
    groundSurfaces?.push(corridorFloor);
    walkablePlatforms.push({
      minX:centre-1.38,maxX:centre+1.38,minZ:-12.65,maxZ:-9.82,height:13.175
    });
    for(const side of [-1,1]) {
      const wall=new THREE.Mesh(new RoundedBoxGeometry(.16,2.82,2.85,6,.025),stone);
      wall.name='parede lateral da passagem inferior';
      wall.position.set(centre+side*1.4,14.48,-11.25);
      wall.castShadow=true;wall.receiveShadow=true;scene.add(wall);
      const collider={minX:centre+side*1.4-.08,maxX:centre+side*1.4+.08,
        minY:13.25,maxY:15.72,minZ:-12.68,maxZ:-9.82};
      colliders.push(collider);
    }
    const endHeader=new THREE.Mesh(new RoundedBoxGeometry(2.85,.2,.24,8,.035),trim);
    endHeader.name='verga do portal no fim da passagem';
    endHeader.position.set(centre,16.0,-12.72);scene.add(endHeader);
    for(const x of [centre-1.42,centre+1.42]) {
      const endPier=new THREE.Mesh(new RoundedBoxGeometry(.18,2.8,.24,6,.025),stone);
      endPier.position.set(x,14.55,-12.72);scene.add(endPier);
    }
    const glow=new THREE.PointLight(0xffc783,.42,5,1.8);
    glow.position.set(centre,15.0,-12.2);scene.add(glow);
  }
}

function addFireplaceHearth(scene,stone,brass) {
  const dark=new THREE.MeshStandardMaterial({color:0x26221d,roughness:.96});
  const refractory=new THREE.MeshStandardMaterial({color:0x514538,roughness:.96});
  const sill=new THREE.Mesh(new RoundedBoxGeometry(5.55,.25,.9,10,.07),stone);
  sill.name='soleira espessa embutida da lareira';
  sill.position.set(0,13.30,-9.02);sill.castShadow=true;sill.receiveShadow=true;scene.add(sill);
  const bed=new THREE.Mesh(new RoundedBoxGeometry(4.38,.13,.58,8,.03),dark);
  bed.name='câmara profunda embutida da lareira';
  bed.position.set(0,13.47,-9.28);bed.receiveShadow=true;scene.add(bed);
  const backing=new THREE.Mesh(new RoundedBoxGeometry(4.45,1.9,.13,8,.025),refractory);
  backing.name='fundo refratário dentro do nicho';
  backing.position.set(0,14.47,-9.69);backing.castShadow=true;scene.add(backing);
  for(const side of [-1,1]) {
    const cheek=new THREE.Mesh(new RoundedBoxGeometry(.26,1.92,.74,8,.045),stone);
    cheek.name='ombreira de pedra integrada da lareira';
    cheek.position.set(side*2.18,14.34,-9.05);cheek.castShadow=true;cheek.receiveShadow=true;scene.add(cheek);
    const inner=new THREE.Mesh(new RoundedBoxGeometry(.07,1.58,.54,6,.02),dark);
    inner.position.set(side*2.0,14.33,-9.17);scene.add(inner);
  }
  const lip=new THREE.Mesh(new RoundedBoxGeometry(4.34,.18,.16,8,.03),brass);
  lip.name='filete de bronze da soleira embutida';
  lip.position.set(0,13.49,-8.72);scene.add(lip);
}

function addFire(scene,animated,camera,isTouchDevice=false) {
  const logMat=woodMaterial();
  for(let i=0;i<5;i++){
    const log=new THREE.Mesh(new THREE.CylinderGeometry(.075,.105,1.16,20),logMat);
    log.name='lenha de nogueira carbonizada da lareira';
    log.position.set(-.78+i*.39,13.62+(i%2)*.075,-9.12);
    log.rotation.z=Math.PI/2+(i%2?.15:-.12);log.rotation.x=i%2?.23:-.18;
    log.castShadow=true;log.receiveShadow=true;scene.add(log);
  }
  const ember=new THREE.Mesh(new THREE.SphereGeometry(1,48,24),new THREE.MeshStandardMaterial({
    color:0x35150b,emissive:0xb23808,emissiveIntensity:1.2,roughness:.9
  }));
  ember.name='leito de brasas incandescentes';
  ember.scale.set(1.55,.13,.28);ember.position.set(0,13.53,-9.25);scene.add(ember);

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
    width:3.5,height:2.1,depth:.66,
    // Smaller slices and a denser control lattice reduce the faceted edges of the flame.
    sliceSpacing:isTouchDevice?.052:.024,
    segments:isTouchDevice?34:66,
    debug:false
  });
  volume.name='fogo volumétrico com ruído procedural da lareira';
  volume.position.set(0,14.58,-8.98);
  volume.material.uniforms.magnitude.value=1.42;
  volume.material.uniforms.lacunarity.value=2.05;
  volume.material.uniforms.gain.value=.54;
  volume.material.uniforms.noiseScale.value.set(1.35,2.45,1.0,.42);
  const identity=new THREE.Quaternion();
  volume.setControlPoints([
    {pos:new THREE.Vector3(-.02,-.98,0),scale:new THREE.Vector3(3.55,1,.62),rot:identity.clone()},
    {pos:new THREE.Vector3(-.12,-.36,0),scale:new THREE.Vector3(3.25,1,.6),rot:new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,-.025))},
    {pos:new THREE.Vector3(.10,.38,0),scale:new THREE.Vector3(2.25,1,.43),rot:new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,.055))},
    {pos:new THREE.Vector3(-.04,1.02,0),scale:new THREE.Vector3(.12,1,.055),rot:new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,-.08))}
  ]);
  scene.add(volume);

  for(let i=0;i<22;i++){
    const mat=new THREE.MeshBasicMaterial({color:i%5===0?0xffe4a3:0xffa13b,transparent:true,opacity:.82,blending:THREE.AdditiveBlending});
    const spark=new THREE.Mesh(new THREE.SphereGeometry(.016+(i%3)*.009,10,8),mat);
    spark.name='faísca ascendente da lareira';
    spark.position.set((Math.random()-.5)*2.65,13.78+Math.random()*.85,-8.78+Math.random()*.2);
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
  glow.name='reflexo volumétrico quente da lareira';glow.position.set(0,14.62,-9.24);scene.add(glow);

  const light=new THREE.PointLight(0xff7b25,4.6,17,1.55);
  light.name='luz dinâmica do fogo da lareira';light.position.set(0,14.45,-8.5);scene.add(light);
  const fill=new THREE.PointLight(0xffa54d,1.8,10,1.9);fill.position.set(0,13.95,-8.85);scene.add(fill);

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
  const padlockMark=new THREE.Mesh(
    new THREE.PlaneGeometry(0.42,0.42),
    gameIconMaterial('padlock')
  );
  padlockMark.position.set(0,0.88,-0.59);
  group.add(padlockMark);

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

function darkWoodFrom(base,color) {
  return new THREE.MeshStandardMaterial({
    color,
    map:base.map || null,
    normalMap:base.normalMap || null,
    normalScale:new THREE.Vector2(.78,.78),
    roughnessMap:base.roughnessMap || null,
    roughness:.78
  });
}

function ironMaterial() {
  return new THREE.MeshStandardMaterial({
    color:0x292b2b,
    metalness:.86,
    roughness:.36
  });
}

function createWallFluteRack(scene,side,wood,brass,iron,colliders,interactables) {
  const group=new THREE.Group();
  group.name='estojo de flautas de madeira do Grande Salão';
  group.position.set(side*13.48,13.9,5.65);
  group.rotation.y=side<0?Math.PI/2:-Math.PI/2;

  const backing=new THREE.Mesh(new RoundedBoxGeometry(1.48,.82,.16,7,.055),wood);
  backing.position.set(0,.62,0);
  backing.castShadow=true;backing.receiveShadow=true;group.add(backing);

  for(const y of [.27,1.02]){
    const rail=new THREE.Mesh(new RoundedBoxGeometry(1.36,.075,.22,6,.025),brass);
    rail.position.set(0,y,.055);group.add(rail);
  }

  const lengths=[.94,.82,.7,.58];
  for(let i=0;i<lengths.length;i++){
    const length=lengths[i],x=-.48+i*.32;
    const flute=new THREE.Mesh(new THREE.CylinderGeometry(.035,.043,length,24,1),i%2?wood:darkWoodFrom(wood,0x6b482d));
    flute.name='flauta de madeira do Grande Salão';
    flute.position.set(x,.65,.12);
    flute.castShadow=true;group.add(flute);

    for(let h=0;h<4;h++){
      const y=.65-length*.28+h*.135;
      const hole=new THREE.Mesh(new THREE.CircleGeometry(.017,12),iron);
      hole.position.set(x+.043,y,.155);
      group.add(hole);
    }
    const ring=new THREE.Mesh(new THREE.TorusGeometry(.045,.012,8,18),brass);
    ring.position.set(x,.65-length*.45,.12);group.add(ring);
  }

  scene.add(group);
  addIconPlaque(scene,'flute',[side*13.92,15.32,5.65],side<0?Math.PI/2:-Math.PI/2,wood,brass,.38);
  addBoxCollider(colliders,side*13.2,14.53,5.65,.85,1.1,.65);
  interactables.push({
    name:'Estojo de flautas '+(side<0?'oeste':'leste'),
    kind:'inspect',
    label:'Flautas de madeira',
    description:'Quatro flautas de madeira com orifícios de afinação e anéis de bronze. Uma interpretação de instrumentos antigos para completar a coleção musical do salão.',
    position:new THREE.Vector3(side*12.35,14.55,5.65),
    radius:1.7
  });
  return group;
}

function addSideTerraceGlassDoors(scene,brass,stone,colliders,interactables) {
  const glass=new THREE.MeshPhysicalMaterial({
    color:0xc7d8d5,metalness:.025,roughness:.1,transmission:.58,
    thickness:.1,transparent:true,opacity:.24,side:THREE.DoubleSide,depthWrite:false
  });
  const bronze=new THREE.MeshStandardMaterial({color:0x654b32,metalness:.68,roughness:.4});
  const wallX=14.2,baseY=13.175,wallTop=16.875,centreY=(baseY+wallTop)/2;
  for(const side of [-1,1]) {
    for(const segment of [{z:-5.7,length:8.85},{z:5.7,length:8.85}]) {
      const panel=new THREE.Mesh(new THREE.PlaneGeometry(segment.length,3.56),glass);
      panel.name='painel de vidro panorâmico da parede lateral';
      panel.position.set(side*wallX,centreY,segment.z);
      panel.rotation.y=side<0?Math.PI/2:-Math.PI/2;
      panel.renderOrder=2;panel.receiveShadow=true;scene.add(panel);
      addBoxCollider(colliders,side*wallX,centreY,segment.z,.14,3.56,segment.length);
    }
    const doorWidth=2.55,doorHeight=3.55;
    const doors=new THREE.Group();
    doors.name='porta dupla de vidro lateral para o terraço';
    doors.position.set(side*wallX,baseY,0);
    doors.rotation.y=side<0?Math.PI/2:-Math.PI/2;scene.add(doors);
    const leaves=[];
    for(const leafSide of [-1,1]) {
      const hinge=new THREE.Group();hinge.position.set(leafSide*doorWidth/2,0,0);doors.add(hinge);
      const leaf=new THREE.Mesh(new THREE.PlaneGeometry(doorWidth/2,doorHeight),glass);
      leaf.name='folha de vidro articulada da varanda lateral';
      leaf.position.set(-leafSide*doorWidth/4,doorHeight/2,0);
      leaf.renderOrder=3;hinge.add(leaf);
      const stile=new THREE.Mesh(new RoundedBoxGeometry(.07,doorHeight,.12,6,.02),bronze);
      stile.position.set(-leafSide*doorWidth/2,doorHeight/2,.035);hinge.add(stile);
      const rail=new THREE.Mesh(new RoundedBoxGeometry(doorWidth/2-.06,.075,.12,6,.02),bronze);
      rail.position.set(-leafSide*doorWidth/4,.08,.035);hinge.add(rail);
      leaves.push(hinge);
    }
    for(const z of [-10.12,-1.3,1.3,10.12]) {
      const post=new THREE.Mesh(new RoundedBoxGeometry(.18,3.68,.18,8,.035),stone);
      post.name='montante de calcário da vidraça lateral';
      post.position.set(side*wallX,centreY,z);post.castShadow=true;scene.add(post);
    }
    for(const y of [13.22,16.82]) {
      const rail=new THREE.Mesh(new RoundedBoxGeometry(.2,.12,20.4,8,.025),bronze);
      rail.position.set(side*wallX,y,0);scene.add(rail);
    }
    const sill=new THREE.Mesh(new RoundedBoxGeometry(.58,.1,doorWidth,8,.025),stone);
    sill.name='soleira de calcário da porta lateral do terraço';
    sill.position.set(side*wallX,13.21,0);scene.add(sill);
    const collider={minX:side*wallX-.12,maxX:side*wallX+.12,minY:13.2,maxY:16.75,minZ:-doorWidth/2,maxZ:doorWidth/2};
    colliders.push(collider);
    let opened=false;
    interactables.push({
      name:'Porta lateral de vidro para o terraço',kind:'door',
      label:'Porta lateral para o terraço',
      description:'Porta dupla de vidro na parede lateral panorâmica. Pressione E ou INTERAGIR para abrir e acessar o terraço.',
      position:new THREE.Vector3(side*13.0,14.7,0),radius:3.0,
      onInteract() {
        opened=!opened;
        leaves[0].rotation.y=opened?-Math.PI*.48:0;
        leaves[1].rotation.y=opened?Math.PI*.48:0;
        if(opened) {
          const i=colliders.indexOf(collider);if(i>=0)colliders.splice(i,1);
          return 'As portas laterais de vidro se abriram para o terraço.';
        }
        if(!colliders.includes(collider))colliders.push(collider);
        return 'As portas laterais de vidro foram fechadas.';
      }
    });
  }
}

function addTerraceExitFacade(scene,stone,colliders) {
  // The exterior front facade is opened in line with the operable glass doors.
  scene.traverse(o=>{
    if(o.name==='fachada frontal da mansão direita') o.visible=false;
  });
  for(let i=colliders.length-1;i>=0;i--) {
    const c=colliders[i];
    if(!c)continue;
    const cx=(c.minX+c.maxX)/2,cy=(c.minY+c.maxY)/2,cz=(c.minZ+c.maxZ)/2;
    const sx=c.maxX-c.minX,sy=c.maxY-c.minY,sz=c.maxZ-c.minZ;
    if(Math.abs(cx-9)<.08&&Math.abs(cy-21.45)<.08&&Math.abs(cz-11)<.08&&
       Math.abs(sx-14)<.12&&Math.abs(sy-17.6)<.12&&Math.abs(sz-.85)<.12) colliders.splice(i,1);
    if(Math.abs(Math.abs(cx)-15.6)<.08&&Math.abs(cy-21.45)<.08&&
       Math.abs(sx-.85)<.12&&Math.abs(sy-17.6)<.12&&sz>5&&cz>-10&&cz<10) colliders.splice(i,1);
  }
  const x0=2,xDoor=8.325,width=3.35,x1=xDoor-width/2,x2=xDoor+width/2,xMax=16;
  const y=21.45,h=17.6,z=11.0,d=.85;
  const pieces=[
    {x:(x0+x1)/2,w:x1-x0},
    {x:(x2+xMax)/2,w:xMax-x2}
  ];
  for(const p of pieces) {
    const wall=new THREE.Mesh(new RoundedBoxGeometry(p.w,h,d,8,.06),stone);
    wall.name='maciço de calcário da fachada do terraço';
    wall.position.set(p.x,y,z);wall.castShadow=true;wall.receiveShadow=true;scene.add(wall);
    addBoxCollider(colliders,p.x,y,z,p.w,h,d);
  }
  const lintelH=30.25-16.3;
  const lintel=new THREE.Mesh(new RoundedBoxGeometry(width,lintelH,d,8,.06),stone);
  lintel.name='lintel de calcário sobre a saída para o terraço';
  lintel.position.set(xDoor,(16.3+30.25)/2,z);lintel.castShadow=true;lintel.receiveShadow=true;scene.add(lintel);
  addBoxCollider(colliders,xDoor,(16.3+30.25)/2,z,width,lintelH,d);
  for(const side of [-1,1]) {
    const jamb=new THREE.Mesh(new RoundedBoxGeometry(.2,3.2,.98,8,.04),stone);
    jamb.name='ombreira da saída para o terraço';
    jamb.position.set(xDoor+side*width*.5,14.75,z);jamb.castShadow=true;scene.add(jamb);
  }
}

function addTerrace(scene,stone,wood,brass,colliders,interactables,groundSurfaces) {
  const platforms=[];
  const deckMat=new THREE.MeshStandardMaterial({
    color:0xc3b89e,roughness:.82,normalMap:stone.normalMap,roughnessMap:stone.roughnessMap,
    normalScale:new THREE.Vector2(.38,.38)
  });
  const sections=[
    // Main east/front terrace: pool, dining, fire pit and a clear route from the glass doors.
    {x:10.9,z:15.75,w:17.8,d:8.5},
    {x:7.0,z:24.0,w:10.0,d:8.0},
    {x:18.35,z:24.0,w:2.9,d:8.0},
    {x:10.9,z:29.75,w:17.8,d:3.5},
    // Narrow perimeter walks connect both sides and the rear of the mansion.
    {x:0,z:13.25,w:42,d:2.5},
    {x:16.65,z:0,w:5.3,d:24},
    {x:-16.65,z:0,w:5.3,d:24},
    {x:19.5,z:0,w:3,d:24},
    {x:-19.5,z:0,w:3,d:24},
    {x:0,z:-13.25,w:42,d:2.5}
  ];
  for(const p of sections) {
    const slab=new THREE.Mesh(new RoundedBoxGeometry(p.w,.35,p.d,8,.05),deckMat);
    slab.name='piso de calcário do terraço panorâmico';
    slab.position.set(p.x,13.0,p.z);slab.castShadow=true;slab.receiveShadow=true;scene.add(slab);
    groundSurfaces?.push(slab);
    platforms.push({minX:p.x-p.w/2+.08,maxX:p.x+p.w/2-.08,minZ:p.z-p.d/2+.08,maxZ:p.z+p.d/2-.08,height:13.175});
  }
  // Reflective pool sits lower than the paving; a hidden perimeter collider preserves the coping.
  const poolBed=new THREE.Mesh(new RoundedBoxGeometry(4.65,.32,7.65,8,.08),
    new THREE.MeshStandardMaterial({color:0x223b40,roughness:.28,metalness:.12}));
  poolBed.name='bacia de pedra escura da piscina do terraço';
  poolBed.position.set(14.0,12.78,24.0);poolBed.receiveShadow=true;scene.add(poolBed);
  const water=new THREE.Mesh(new RoundedBoxGeometry(4.45,.05,7.45,8,.04),
    new THREE.MeshPhysicalMaterial({color:0x668e94,roughness:.16,metalness:.2,transparent:true,opacity:.82,transmission:.2}));
  water.name='água da piscina do terraço';water.position.set(14.0,12.99,24.0);scene.add(water);
  for(const [x,z,w,d] of [
    [14.0,19.95,5.3,.42],[14.0,28.05,5.3,.42],[11.55,24.0,.42,8.1],[16.45,24.0,.42,8.1]
  ]) {
    const coping=new THREE.Mesh(new RoundedBoxGeometry(w,.36,d,8,.055),stone);
    coping.name='borda de calcário da piscina';coping.position.set(x,13.0,z);
    coping.castShadow=true;coping.receiveShadow=true;scene.add(coping);
  }
  addBoxCollider(colliders,14.0,13.25,24.0,4.5,.45,7.4);
  // Dining table and chairs.
  const table=new THREE.Mesh(new RoundedBoxGeometry(2.25,.16,1.18,8,.08),wood);
  table.name='mesa de jantar do terraço';table.position.set(5.1,13.96,17.25);
  table.castShadow=true;table.receiveShadow=true;scene.add(table);
  for(const x of [4.18,6.02])for(const z of [16.82,17.68]) {
    const leg=new THREE.Mesh(new RoundedBoxGeometry(.13,.78,.13,6,.025),wood);
    leg.position.set(x,13.53,z);leg.castShadow=true;scene.add(leg);
  }
  for(const x of [4.45,5.75]) {
    for(const z of [16.45,18.05]) {
      const chair=new THREE.Group();chair.position.set(x,13.175,z);scene.add(chair);
      const seat=new THREE.Mesh(new RoundedBoxGeometry(.62,.14,.62,6,.05),wood);
      seat.position.y=.48;seat.castShadow=true;chair.add(seat);
      for(const dx of [-.22,.22])for(const dz of [-.22,.22]) {
        const leg=new THREE.Mesh(new RoundedBoxGeometry(.075,.47,.075,5,.018),wood);
        leg.position.set(dx,.235,dz);leg.castShadow=true;chair.add(leg);
      }
      const back=new THREE.Mesh(new RoundedBoxGeometry(.62,.85,.12,6,.05),wood);
      back.position.set(0,.92,-.23);back.castShadow=true;chair.add(back);
    }
  }
  addBoxCollider(colliders,5.1,14.0,17.25,2.45,1.55,1.3);
  // A low circular fire bowl and an amber flame replace a placeholder lantern.
  const bowl=new THREE.Mesh(new THREE.CylinderGeometry(.78,.92,.42,48),stone);
  bowl.name='bacia circular de pedra da fogueira do terraço';
  bowl.position.set(6.2,13.38,26.0);bowl.castShadow=true;scene.add(bowl);
  const embers=new THREE.Mesh(new THREE.SphereGeometry(.68,32,20),
    new THREE.MeshStandardMaterial({color:0x35150b,emissive:0xc44a11,emissiveIntensity:1.25,roughness:.88}));
  embers.name='brasas da fogueira do terraço';embers.scale.y=.16;embers.position.set(6.2,13.63,26.0);scene.add(embers);
  const flame=new THREE.Mesh(new THREE.SphereGeometry(.35,32,24),
    new THREE.MeshStandardMaterial({color:0xffa04a,emissive:0xf05b16,emissiveIntensity:1.8,roughness:.45}));
  flame.name='chama da fogueira do terraço';flame.scale.set(.72,1.8,.72);flame.position.set(6.2,13.95,26.0);scene.add(flame);
  const fireLight=new THREE.PointLight(0xffa85c,.9,8,1.7);fireLight.position.set(6.2,14.2,26.0);scene.add(fireLight);
  for(const [x,z] of [[3.6,25.7],[8.8,25.7]]) {
    const bench=new THREE.Mesh(new RoundedBoxGeometry(2.6,.26,.65,8,.06),wood);
    bench.name='banco de nogueira junto à fogueira';bench.position.set(x,13.7,z);
    bench.castShadow=true;scene.add(bench);
    for(const dx of [-1.0,1.0])for(const dz of [-.2,.2]) {
      const leg=new THREE.Mesh(new RoundedBoxGeometry(.12,.62,.12,6,.025),wood);
      leg.position.set(x+dx,13.35,z+dz);leg.castShadow=true;scene.add(leg);
    }
  }
  const sideRails=[
    {x:-20.6,z0:-14.2,z1:14.2},
    {x:20.6,z0:-14.2,z1:31.0}
  ];
  for(const rail of sideRails) {
    for(let z=rail.z0;z<=rail.z1;z+=3.5) {
      const post=new THREE.Mesh(new RoundedBoxGeometry(.16,1.12,.16,8,.04),brass);
      post.position.set(rail.x,13.72,z);post.castShadow=true;scene.add(post);
    }
    scene.add(tube([[rail.x,14.28,rail.z0],[rail.x,14.28,rail.z1]],.045,wood,64,8));
    scene.add(tube([[rail.x,13.28,rail.z0],[rail.x,13.28,rail.z1]],.025,brass,64,8));
  }
  for(let x=-20.6;x<=20.6;x+=3.5) {
    const post=new THREE.Mesh(new RoundedBoxGeometry(.16,1.12,.16,8,.04),brass);
    post.position.set(x,13.72,-14.2);post.castShadow=true;scene.add(post);
  }
  scene.add(tube([[-20.6,14.28,-14.2],[20.6,14.28,-14.2]],.045,wood,72,8));
  scene.add(tube([[-20.6,13.28,-14.2],[20.6,13.28,-14.2]],.025,brass,72,8));
  for(let x=2.2;x<=20.6;x+=3.5) {
    const post=new THREE.Mesh(new RoundedBoxGeometry(.16,1.12,.16,8,.04),brass);
    post.position.set(x,13.72,31.0);post.castShadow=true;scene.add(post);
  }
  scene.add(tube([[2.2,14.28,31.0],[20.6,14.28,31.0]],.045,wood,48,8));
  interactables.push({
    name:'Piscina do terraço',kind:'inspect',label:'Piscina do terraço',
    description:'Piscina retangular em pedra escura, encaixada no piso externo do terraço.',
    position:new THREE.Vector3(14.0,13.35,24.0),radius:3.2
  });
  interactables.push({
    name:'Fogueira do terraço',kind:'inspect',label:'Fogueira do terraço',
    description:'Fogueira baixa em uma bacia circular de pedra, com bancos de nogueira ao redor.',
    position:new THREE.Vector3(6.2,13.7,26.0),radius:2.7
  });
  return platforms;
}

function addFireplaceSurround(scene,stone,brass,wood) {
  const z=-9.02;
  const darkBronze=new THREE.MeshStandardMaterial({color:0x59432b,metalness:.62,roughness:.38});

  for(const side of [-1,1]){
    const column=new THREE.Mesh(new THREE.LatheGeometry([
      new THREE.Vector2(.18,0),new THREE.Vector2(.25,.08),
      new THREE.Vector2(.28,.22),new THREE.Vector2(.22,.42),
      new THREE.Vector2(.21,2.3),new THREE.Vector2(.25,2.52),
      new THREE.Vector2(.34,2.68),new THREE.Vector2(.31,2.82),
      new THREE.Vector2(.22,2.94)
    ],40),stone);
    column.name='coluna esculpida da moldura da lareira';
    column.position.set(side*2.31,13.34,z);
    column.castShadow=true;column.receiveShadow=true;scene.add(column);

    for(const y of [13.55,13.78,15.78,16.02]){
      const ring=new THREE.Mesh(new THREE.TorusGeometry(y<14?.27:.23,.027,8,40),brass);
      ring.rotation.x=Math.PI/2;
      ring.position.set(side*2.31,y,z-.06);
      scene.add(ring);
    }

    const capital=new THREE.Mesh(new THREE.LatheGeometry([
      new THREE.Vector2(.2,0),new THREE.Vector2(.25,.08),
      new THREE.Vector2(.34,.18),new THREE.Vector2(.46,.3),
      new THREE.Vector2(.43,.4),new THREE.Vector2(.25,.48)
    ],40),stone);
    capital.name='capitel lotus da lareira';
    capital.position.set(side*2.31,16.1,z);
    capital.castShadow=true;scene.add(capital);

    const inset=new THREE.Mesh(new RoundedBoxGeometry(.58,.72,.06,8,.08),wood);
    inset.name='placa entalhada junto à lareira';
    inset.position.set(side*2.94,16.13,z-.075);
    inset.castShadow=true;scene.add(inset);
    const emblem=new THREE.Mesh(new THREE.PlaneGeometry(.42,.55),gameIconMaterial('eye-of-horus'));
    emblem.position.set(side*2.94,16.13,z-.115);
    scene.add(emblem);
  }

  const archPoints=[
    [-2.28,16.45,z],[-2.1,16.72,z],[-1.72,16.91,z],
    [-1.15,17.04,z],[-.58,17.11,z],[0,17.13,z],
    [.58,17.11,z],[1.15,17.04,z],[1.72,16.91,z],
    [2.1,16.72,z],[2.28,16.45,z]
  ];
  const arch=tube(archPoints,.18,stone,96,16);
  arch.name='arco de calcário esculpido da lareira';
  scene.add(arch);
  const archInlay=tube(archPoints.map(p=>[p[0],p[1]-.12,p[2]+.08]),.018,brass,96,8);
  archInlay.name='filete de bronze no arco da lareira';
  scene.add(archInlay);

  const mantle=new THREE.Mesh(new RoundedBoxGeometry(6.15,.42,1.18,10,.13),stone);
  mantle.name='manto moldurado de calcário da lareira';
  mantle.position.set(0,17.16,-9.02);
  mantle.castShadow=true;mantle.receiveShadow=true;scene.add(mantle);

  const mantleInlay=new THREE.Mesh(new RoundedBoxGeometry(5.72,.035,.08,8,.015),brass);
  mantleInlay.name='filete de bronze do manto da lareira';
  mantleInlay.position.set(0,17.3,-8.57);
  scene.add(mantleInlay);

  for(const side of [-1,1]){
    const corbel=new THREE.Mesh(new THREE.LatheGeometry([
      new THREE.Vector2(.12,0),new THREE.Vector2(.19,.08),
      new THREE.Vector2(.27,.18),new THREE.Vector2(.35,.28),
      new THREE.Vector2(.32,.38),new THREE.Vector2(.18,.48)
    ],32),darkBronze);
    corbel.name='mísula de bronze escuro da lareira';
    corbel.position.set(side*2.72,16.95,-8.78);
    corbel.castShadow=true;scene.add(corbel);
  }
}

function addThothBaseSeating(scene,stone,marble,wood,brass,colliders,interactables) {
  const leather=new THREE.MeshStandardMaterial({color:0x624235,roughness:.9});
  const edge=new THREE.MeshStandardMaterial({color:0x9e855f,metalness:.34,roughness:.62});
  const lower=new THREE.Mesh(new THREE.CylinderGeometry(3.42,3.58,.22,96),stone);
  lower.name='base circular de calcário do pedestal de Thoth';
  lower.position.set(0,13.285,-.5);lower.castShadow=true;lower.receiveShadow=true;scene.add(lower);
  const upper=new THREE.Mesh(new THREE.CylinderGeometry(3.12,3.2,.12,96),marble);
  upper.name='degrau circular de mármore negro do pedestal de Thoth';
  upper.position.set(0,13.44,-.5);upper.castShadow=true;upper.receiveShadow=true;scene.add(upper);
  const rim=new THREE.Mesh(new THREE.TorusGeometry(3.2,.055,12,96),brass);
  rim.rotation.x=Math.PI/2;rim.position.set(0,13.51,-.5);scene.add(rim);

  for(let i=0;i<8;i++) {
    const angle=i*Math.PI/4;
    const radius=4.08;
    const x=Math.sin(angle)*radius,z=-.5+Math.cos(angle)*radius;
    const bench=new THREE.Group();
    bench.name='banco curvo de madeira e couro ao redor da estátua de Thoth';
    bench.position.set(x,13.175,z);bench.rotation.y=angle;scene.add(bench);
    const stoneBase=new THREE.Mesh(new RoundedBoxGeometry(2.35,.42,.86,10,.12),stone);
    stoneBase.position.y=.22;stoneBase.castShadow=true;stoneBase.receiveShadow=true;bench.add(stoneBase);
    const seat=new THREE.Mesh(new RoundedBoxGeometry(2.23,.14,.82,10,.06),leather);
    seat.position.set(0,.49,.02);seat.castShadow=true;seat.receiveShadow=true;bench.add(seat);
    const back=new THREE.Mesh(new RoundedBoxGeometry(2.18,.72,.22,10,.07),leather);
    back.position.set(0,.91,-.29);back.castShadow=true;bench.add(back);
    for(const side of [-1,1]) {
      const arm=new THREE.Mesh(new RoundedBoxGeometry(.22,.62,.84,8,.08),wood);
      arm.position.set(side*1.05,.63,-.02);arm.castShadow=true;bench.add(arm);
      const finial=new THREE.Mesh(new THREE.SphereGeometry(.065,16,12),brass);
      finial.position.set(side*1.05,.99,.25);bench.add(finial);
    }
    const inlay=new THREE.Mesh(new RoundedBoxGeometry(1.85,.025,.045,4,.01),edge);
    inlay.position.set(0,.715,.42);bench.add(inlay);
    bench.updateMatrixWorld(true);
    const bounds=new THREE.Box3().setFromObject(bench);
    colliders.push({
      minX:bounds.min.x,maxX:bounds.max.x,minY:bounds.min.y,maxY:bounds.max.y,
      minZ:bounds.min.z,maxZ:bounds.max.z
    });
  }
  interactables.push({
    name:'Assentos circulares ao redor de Thoth',kind:'inspect',
    label:'Bancos ao redor de Thoth',
    description:'Assentos integrados ao pedestal circular de calcário e mármore negro, voltados para a estátua central.',
    position:new THREE.Vector3(0,13.8,-.5),radius:4.7
  });
}

function addThoth(scene,marble,pale,brass,reliefTex,wood) {
  const group=new THREE.Group();group.name='estátua monumental de Thoth em basalto';group.position.set(0,13.175,-.5);
  const plinth=new THREE.Mesh(new RoundedBoxGeometry(3,.48,3,6,.13),pale);plinth.position.y=.24;plinth.castShadow=true;plinth.receiveShadow=true;group.add(plinth);
  const step=new THREE.Mesh(new RoundedBoxGeometry(2.62,.28,2.62,6,.1),marble);step.position.y=.6;step.castShadow=true;group.add(step);
  const footRing=new THREE.Mesh(new THREE.TorusGeometry(.96,.055,10,56),brass);footRing.rotation.x=Math.PI/2;footRing.position.y=.78;group.add(footRing);
  const dais=new THREE.Mesh(new THREE.LatheGeometry([new THREE.Vector2(.68,0),new THREE.Vector2(.82,.14),new THREE.Vector2(.88,.31),new THREE.Vector2(.78,.52),new THREE.Vector2(.7,.65)],48),marble);dais.position.y=.72;dais.castShadow=true;group.add(dais);
  // Human body, visible shendyt kilt and legs rather than a single robe silhouette.
  const legsProfile=[
    new THREE.Vector2(.13,0),new THREE.Vector2(.16,.12),new THREE.Vector2(.145,.34),
    new THREE.Vector2(.12,.62),new THREE.Vector2(.15,.88),new THREE.Vector2(.16,1.02)
  ];
  for(const side of [-1,1]){
    const leg=new THREE.Mesh(new THREE.LatheGeometry(legsProfile,32),marble);
    leg.name='perna humana esculpida de Thoth';
    leg.position.set(side*.225,1.36,0);
    leg.castShadow=true;leg.receiveShadow=true;group.add(leg);
    const foot=new THREE.Mesh(new THREE.SphereGeometry(.2,20,14),marble);
    foot.name='pé de mármore de Thoth';
    foot.position.set(side*.225,1.42,.12);
    foot.scale.set(.86,.48,1.42);
    group.add(foot);
  }

  const kilt=new THREE.Mesh(new THREE.LatheGeometry([
    new THREE.Vector2(.4,0),new THREE.Vector2(.49,.1),new THREE.Vector2(.57,.28),
    new THREE.Vector2(.65,.48),new THREE.Vector2(.68,.68),new THREE.Vector2(.64,.85),
    new THREE.Vector2(.55,.98),new THREE.Vector2(.49,1.08)
  ],64),marble);
  kilt.name='kilt shendyt de mármore de Thoth';
  kilt.position.y=1.72;
  kilt.castShadow=true;kilt.receiveShadow=true;group.add(kilt);

  // Fine raised pleats catch the same grazing light as the statue's polished dark marble.
  for(let i=0;i<13;i++){
    const t=i/12,x=-.43+t*.86;
    const pleat=tube([
      [x*.78,1.82,.39],
      [x*.94,2.05,.49],
      [x,2.36,.59],
      [x*.92,2.62,.57],
      [x*.82,2.77,.48]
    ],.012,pale,24,6);
    pleat.name='prega vertical do kilt de Thoth';
    group.add(pleat);
  }

  const torso=new THREE.Mesh(new THREE.LatheGeometry([
    new THREE.Vector2(.36,0),new THREE.Vector2(.43,.12),new THREE.Vector2(.48,.28),
    new THREE.Vector2(.53,.56),new THREE.Vector2(.59,.92),new THREE.Vector2(.69,1.27),
    new THREE.Vector2(.73,1.43),new THREE.Vector2(.59,1.58),new THREE.Vector2(.34,1.72)
  ],64),marble);
  torso.name='tronco humano de mármore de Thoth';
  torso.position.y=2.72;
  torso.castShadow=true;torso.receiveShadow=true;group.add(torso);

  const sashMaterial=new THREE.MeshStandardMaterial({
    color:0x806345,roughness:.94,metalness:.01
  });
  const sash=tube([
    [-.53,4.16,.69],[-.42,3.78,.68],[-.18,3.4,.63],
    [.12,3.08,.55],[.48,2.72,.44]
  ],.058,sashMaterial,42,12);
  sash.name='faixa cerimonial diagonal de Thoth';
  group.add(sash);
  const sashEdge=tube([
    [-.53,4.16,.76],[-.42,3.78,.75],[-.18,3.4,.70],
    [.12,3.08,.62],[.48,2.72,.51]
  ],.012,goldEdgeMaterial(),42,6);
  sashEdge.name='filete dourado da faixa de Thoth';
  group.add(sashEdge);

  function goldEdgeMaterial(){
    return new THREE.MeshStandardMaterial({color:0xc3a36b,metalness:.72,roughness:.28});
  }
  const gold=new THREE.MeshStandardMaterial({color:0xb78c4c,metalness:.72,roughness:.29});
  const goldL=new THREE.MeshStandardMaterial({color:0xd4b16f,metalness:.68,roughness:.25});
  const waist=new THREE.Mesh(new THREE.TorusGeometry(.55,.075,10,56),gold);waist.rotation.x=Math.PI/2;waist.position.set(0,2.78,.02);group.add(waist);
  for(const y of [4.16,4.29,4.42]){const c=new THREE.Mesh(new THREE.TorusGeometry(.67+(y-4.16)*.18,.055,10,72),gold);c.rotation.x=Math.PI/2;c.position.set(0,y,.14);c.scale.set(1.18,1,.98);group.add(c);}
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

  const shellMat=new THREE.MeshPhysicalMaterial({
    color:0x171b1c,metalness:.58,roughness:.32,
    clearcoat:.55,clearcoatRoughness:.22
  });
  const glassMat=new THREE.MeshPhysicalMaterial({
    color:0x080d10,metalness:.38,roughness:.12,
    clearcoat:1,clearcoatRoughness:.08,
    emissive:0x02060a,emissiveIntensity:.025
  });
  const shell=new THREE.Mesh(new RoundedBoxGeometry(4.72,2.58,.2,8,.09),shellMat);
  shell.name='moldura metálica arredondada da TV';
  shell.castShadow=true;group.add(shell);

  const screen=new THREE.Mesh(new RoundedBoxGeometry(4.48,2.32,.06,8,.025),glassMat);
  screen.name='painel de vidro refletivo da TV';
  screen.position.z=.115;group.add(screen);

  const innerRim=new THREE.Mesh(new THREE.RingGeometry(2.08,2.14,96,1),brass);
  innerRim.name='filete de bronze sob a tela';
  innerRim.position.set(0,-1.205,.115);
  innerRim.scale.set(1,.065,1);group.add(innerRim);

  const sensorMat=new THREE.MeshBasicMaterial({color:0x3c3429});
  const sensor=new THREE.Mesh(new THREE.SphereGeometry(.035,12,10),sensorMat);
  sensor.position.set(2.24,-1.17,.16);group.add(sensor);

  let powered=false;
  const togglePower=()=>{
    powered=!powered;
    glassMat.emissive.setHex(powered?0x0c3448:0x02060a);
    glassMat.emissiveIntensity=powered?.72:.025;
    sensorMat.color.setHex(powered?0x8de0c1:0x3c3429);
    group.userData.powered=powered;
    return powered?'A tela de plasma acendeu com uma luz azul discreta.':'A televisão foi desligada; o vidro voltou a refletir a sala.';
  };

  scene.add(group);
  interactables.push({
    name:'Televisor do Grande Salão',
    kind:'toggle',
    label:'TV acima da lareira',
    description:'A tela moderna contrasta com o manto de pedra e a arquitetura egípcia da sala.',
    position:new THREE.Vector3(0,19.0,-8.4),
    radius:6.5,
    onInteract:togglePower
  });
  addBoxCollider(colliders,0,19.0,-8.98,4.65,2.5,.28);
  return group;
}

function addCentralCrossBridge(scene,stone,wood,brass,groundSurfaces,walkablePlatforms) {
  const deck=new THREE.Mesh(new RoundedBoxGeometry(16.4,.48,2.1,12,.055),stone);
  deck.name='passarela elevada central entre as duas alas';
  deck.position.set(0,16.635,-4.28);
  deck.castShadow=true;deck.receiveShadow=true;scene.add(deck);groundSurfaces?.push(deck);
  walkablePlatforms.push({
    minX:-8.16,maxX:8.16,minZ:-5.31,maxZ:-3.25,height:16.875
  });
  for(const side of [-1,1]) {
    const railZ=-4.28+side*.94;
    for(let x=-7.9;x<=7.91;x+=1.65) {
      const post=new THREE.Mesh(new THREE.LatheGeometry([
        new THREE.Vector2(.045,0),new THREE.Vector2(.065,.16),
        new THREE.Vector2(.04,.42),new THREE.Vector2(.08,.62),
        new THREE.Vector2(.045,.82)
      ],16),brass);
      post.name='poste torneado da passarela elevada';
      post.position.set(x,16.9,railZ);post.castShadow=true;scene.add(post);
    }
    scene.add(tube([[-8.1,17.78,railZ],[8.1,17.78,railZ]],.065,wood,80,12));
    scene.add(tube([[-8.1,17.71,railZ],[8.1,17.71,railZ]],.018,brass,80,8));
  }
  for(const side of [-1,1]) {
    const connector=new THREE.Mesh(new RoundedBoxGeometry(3.25,.34,1.75,8,.04),stone);
    connector.name='patamar de ligação da escadaria central à passarela';
    connector.position.set(side*5.72,16.705,-3.0);
    connector.castShadow=true;connector.receiveShadow=true;scene.add(connector);
    groundSurfaces?.push(connector);
    walkablePlatforms.push({
      minX:side<0?-7.36:4.1,maxX:side<0?-4.1:7.36,
      minZ:-3.88,maxZ:-2.12,height:16.875
    });
  }
}

export function buildGrandSalon({
  THREE: T,
  scene,
  animated=[],
  camera,
  isTouchDevice=false,
  colliders=[],
  interactables=[],
  groundSurfaces=[]
}) {
  const stone=stoneMaterial();
  const walnut=woodMaterial();
  const marble=marbleMaterial();
  const brass=new T.MeshStandardMaterial({color:0xb78d4f,metalness:.72,roughness:.29});
  const pale=new T.MeshStandardMaterial({color:0xd3c09a,roughness:.9});
  const floorMaterial=new T.MeshStandardMaterial({color:0xffffff,roughness:.72});

  // Real PBR maps from CC0 Poly Haven / ambientCG sets, kept local in the project.
  bindPbrMaps(stone,'tile-limestone-beige',[2.2,1.7],false);
  stone.normalScale.set(.46,.46);
  stone.roughness=.89;
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
      'coroa ritual','TV de plasma','tela da TV','moldura da lareira','manto de pedra'
    ].includes(o.name)) o.visible=false;

    if(o.name==='parede interna do salão' || o.name==='parede da lareira') o.visible=false;
    if(o.name==='parede lateral do salão' || o.name==='sacada de calcário' ||
       o.name==='lateral oeste da mansão' || o.name==='lateral leste da mansão' ||
       o.name==='lintel da passagem para ala' ||
       o.name==='fachada frontal da mansão direita' ||
       o.name==='moldura da lareira' || o.name==='manto de pedra' ||
       o.name==='boca escura da lareira') o.visible=false;
    if(o.type==='Group' && Math.abs(o.position.x-5.85)<.12 &&
       Math.abs(o.position.z-11.49)<.12 && o.position.y<16.3) o.visible=false;
    if(o.type==='Group' && Math.abs(Math.abs(o.position.x)-16.08)<.22 &&
       Math.abs(o.position.z)<9 && o.position.y>13) o.visible=false;
    if((o.name==='steel window frame' || o.name==='mullion') &&
       Math.abs(Math.abs(o.position.x)-16.08)<.28) o.visible=false;

    if(o.name==='parede interna do salão' || o.name==='coluna de calcário') o.material=stone;
    if(o.name==='piso do Grande Salão') o.material=floorMaterial;
    if(o.name==='viga de cedro do teto') {
      o.material=darkWood;
      o.geometry.dispose();
      o.geometry=new T.BoxGeometry(28,.68,.66);
      o.position.y=28.12;
    }
  });

  for(let i=colliders.length-1;i>=0;i--) {
    const c=colliders[i];if(!c)continue;
    const cx=(c.minX+c.maxX)/2,cy=(c.minY+c.maxY)/2,cz=(c.minZ+c.maxZ)/2;
    const sx=c.maxX-c.minX,sy=c.maxY-c.minY,sz=c.maxZ-c.minZ;
    const mansionSide=Math.abs(Math.abs(cx)-15.6)<.08&&Math.abs(cy-21.45)<.08&&
      Math.abs(sx-.85)<.12&&Math.abs(sy-17.6)<.12&&sz>5&&cz>-10&&cz<10;
    const oldWingLintel=Math.abs(cx-15.6)<.08&&Math.abs(cy-20.65)<.08&&
      Math.abs(cz+.5)<.08&&Math.abs(sx-.85)<.12&&Math.abs(sy-.55)<.12&&Math.abs(sz-6)<.12;
    if(mansionSide||oldWingLintel) colliders.splice(i,1);
  }

  for(const x of [-8.8,8.8]) {
    for(const z of [-6.7,6.3]) {
      lotusColumn(scene,x,z,stone,pale,brass);
      addBoxCollider(colliders,x,20.65,z,1.5,14.9,1.5);
    }
  }

  const railWood=new T.MeshStandardMaterial({
    color:0x92704b,map:walnut.map,normalMap:walnut.normalMap,
    normalScale:new T.Vector2(.68,.68),roughnessMap:walnut.roughnessMap,roughness:.78
  });
  // Remove all original transverse balcony beams that visually ran into Thoth.
  scene.traverse(object=>{
    if(['viga sacada','guarda-corpo da sacada','balaústre'].includes(object.name))object.visible=false;
  });
  addBalustrades(scene,stone,brass,railWood);
  addGreatHallWarmLighting(scene);

  const stairRamps=[];
  const walkablePlatforms=addGalleryWalkways(scene,stone,groundSurfaces);
  walkablePlatforms.push(...addBalconyDoorRows(
    scene,stone,darkWood,brass,colliders,interactables,groundSurfaces
  ));
  addGreatHallRearWall(scene,stone,brass);
  addLowerPassages(scene,stone,brass,colliders,walkablePlatforms,groundSurfaces);

  for(const side of [-1,1]) {
    // Ground floor to first gallery: broad central pair that flanks the statue.
    const central=stairFlight(scene,stone,pale,brass,railWood,{
      centerX:side*5.65,baseY:13.175,topY:16.875,startZ:7.95,
      direction:-1,width:1.9,depth:.53,count:18,landingWidth:2.45
    });
    stairRamps.push(central);walkablePlatforms.push(central.landingPlatform);

    // First to second gallery: a separate upper flight in the open bay, not above the first stair.
    const upper=stairFlight(scene,stone,pale,brass,railWood,{
      centerX:side*9.65,baseY:16.875,topY:20.625,startZ:-1.95,
      direction:1,width:1.72,depth:.53,count:18,landingWidth:2.35
    });
    stairRamps.push(upper);walkablePlatforms.push(upper.landingPlatform);
    const lowerConnector=new THREE.Mesh(new RoundedBoxGeometry(3.9,.34,1.55,8,.04),stone);
    lowerConnector.name='ligação de calcário entre galeria e escadaria superior';
    lowerConnector.position.set(side*8.78,16.705,-1.95);
    lowerConnector.castShadow=true;lowerConnector.receiveShadow=true;scene.add(lowerConnector);
    groundSurfaces?.push(lowerConnector);
    walkablePlatforms.push({
      minX:side<0?-10.75:6.82,maxX:side<0?-6.82:10.75,
      minZ:-2.73,maxZ:-1.17,height:16.875
    });

    // Second to third gallery: the outermost flight meets the side balcony walk.
    const topFlight=stairFlight(scene,stone,pale,brass,railWood,{
      centerX:side*12.0,baseY:20.625,topY:24.375,startZ:7.8,
      direction:-1,width:1.65,depth:.53,count:18,landingWidth:2.45
    });
    stairRamps.push(topFlight);walkablePlatforms.push(topFlight.landingPlatform);
    const topConnector=new THREE.Mesh(new RoundedBoxGeometry(2.95,.34,1.55,8,.04),stone);
    topConnector.name='patamar inferior de acesso à escadaria superior';
    topConnector.position.set(side*12.55,20.455,7.8);
    topConnector.castShadow=true;topConnector.receiveShadow=true;scene.add(topConnector);
    groundSurfaces?.push(topConnector);
    walkablePlatforms.push({
      minX:side<0?-14.0:11.1,maxX:side<0?-11.1:14.0,
      minZ:7.02,maxZ:8.58,height:20.625
    });
  }
  addCentralCrossBridge(scene,stone,railWood,brass,groundSurfaces,walkablePlatforms);

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
  addFireplaceSurround(scene,stone,brass,darkWood);

  // Sourced iconography enriches the existing physical props without duplicating them.
  addSideTerraceGlassDoors(scene,brass,stone,colliders,interactables);
  walkablePlatforms.push(...addTerrace(scene,stone,walnut,brass,colliders,interactables,groundSurfaces));
  addGreatHallDoors(scene,stone,darkWood,brass,colliders,interactables);
  addIconPlaque(scene,'harp',[-11.65,16.02,-9.84],0,darkWood,brass,.42);
  addIconPlaque(scene,'harp',[11.65,16.02,-9.84],0,darkWood,brass,.42);
  addIconPlaque(scene,'drum',[-13.92,15.25,1.2],Math.PI/2,darkWood,brass,.4);
  addIconPlaque(scene,'drum',[13.92,15.25,1.2],-Math.PI/2,darkWood,brass,.4);
  for(const side of [-1,1]){
    addIconPlaque(scene,'spears',[side*13.38,18.2,8.52],Math.PI,darkWood,brass,.42);
    createWallFluteRack(scene,side,darkWood,brass,ironMaterial(),colliders,interactables);
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
    createSofa(scene,-4.35,-4.6,Math.PI/2,upholstery,darkWood,brass),
    createSofa(scene,4.35,-4.6,-Math.PI/2,upholstery,darkWood,brass)
  ];
  loadSofaAssets(scene,sofaFallbacks,colliders,interactables);

  const rug=createRug(scene);
  const table=centerTable(scene,walnut,brass);
  addBoxCollider(colliders,0,13.47,-4.6,2.75,.72,2.75);
  interactables.push({
    name:'Mesa de centro de nogueira',
    kind:'inspect',
    label:'Mesa de centro entalhada',
    description:'Mesa circular baixa de nogueira, com medalhão solar e filetes de bronze',
    position:new T.Vector3(0,13.62,-4.6),
    radius:2.1
  });

  addFireplaceHearth(scene,stone,brass);
  const fire=addFire(scene,animated,camera,isTouchDevice);
  const fireLight=fire.fireLight;
  addBoxCollider(colliders,0,14.55,-8.3,3.2,2.4,.9);
  interactables.push({
    name:'Lareira monumental',
    kind:'inspect',
    label:'Lareira do Grande Salão',
    description:'Lareira monumental com lenha, brasas e chamas volumétricas animadas',
    position:new T.Vector3(0,15.0,-7.9),
    radius:2.2
  });

  addThoth(scene,marble,pale,brass,relief,walnut);
  addThothBaseSeating(scene,stone,marble,walnut,brass,colliders,interactables);
  addBoxCollider(colliders,0,17.75,-.5,2.7,9.2,2.7);
  interactables.push({
    name:'Estátua de Thoth',
    kind:'inspect',
    label:'Thoth, deus da escrita',
    description:'Estátua monumental de Thoth em mármore negro, com cabeça de íbis, kilt, faixa, colar, estilete de escriba e papiro aberto com o sinal Per Ankh. A superfície preserva reflexos profundos e veios minerais.',
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

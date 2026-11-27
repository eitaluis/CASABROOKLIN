export function createThirdPersonController({ THREE, camera, canvas, character, zones, colliders = [], stairRamps = [], walkablePlatforms = [], walkableCurves = [], zonePortals = [], spiralStair = null, onZoneChange }) {
  const keys = new Set();
  const touch = { moveX: 0, moveY: 0, sprint: false };
  const position = new THREE.Vector3();
  const lookTarget = new THREE.Vector3();
  const desiredCamera = new THREE.Vector3();
  const smoothVelocity = new THREE.Vector3();
  let zoneName = 'dock';
  let cameraYaw = 0;
  let cameraPitch = 0.20;
  let cameraDistance = window.innerHeight > window.innerWidth ? 4.0 : 3.2;
  window.addEventListener('resize', () => { cameraDistance = window.innerHeight > window.innerWidth ? 4.0 : 3.2; });
  let pointerLocked = false;
  let controlsLocked = false;
  let firstCameraFrame = true;
  let fallbackSpeed = 0;
  let cameraCue = null;
  let airborne = false;
  let verticalVelocity = 0;
  let jumpFloorHeight = 0;
  let cameraShakeRemaining = 0;

  // Colisão de primeira passagem: cápsula vertical simplificada contra caixas estáticas.
  // Mantém o teste leve para funcionar também no celular.
  const characterRadius = 0.34;
  // Usa a altura real informada pelo rig Ara, mantendo fallback para avatares sem metadados.
  const characterHeight = Math.max(1.5, character.height || character.ara?.height || 1.72);
  const cameraFocusHeight = characterHeight * 0.56;
  function blockedAt(x, z, baseY) {
    const actorBottom = baseY + 0.08;
    const actorTop = baseY + characterHeight;
    for (const obstacle of colliders) {
      if (actorTop <= obstacle.minY || actorBottom >= obstacle.maxY) continue;
      if (
        x + characterRadius > obstacle.minX &&
        x - characterRadius < obstacle.maxX &&
        z + characterRadius > obstacle.minZ &&
        z - characterRadius < obstacle.maxZ
      ) return true;
    }
    return false;
  }

  function getPosition() {
    return character.human ? character.human.position : character.model.position;
  }

  function getWalkingSurface(x, z, currentY = zones[zoneName].base ?? 0, travelDirection = null) {
    const ramps = stairRamps.filter(item =>
      Math.abs(x - item.centerX) <= item.width * 0.5 &&
      currentY >= item.bottomY - 0.35 && currentY <= item.topY + 0.35 &&
      z >= Math.min(item.startZ, item.endZ) &&
      z <= Math.max(item.startZ, item.endZ)
    );
    // Adjacent flights meet on the same landing. When two ramps overlap in X/Z,
    // use the player's travel direction to select the flight that is being entered.
    if(ramps.length && travelDirection && Math.abs(travelDirection.z)>.05) {
      ramps.sort((a,b)=>{
        const aAligned=Math.sign(a.endZ-a.startZ)===Math.sign(travelDirection.z)?0:1;
        const bAligned=Math.sign(b.endZ-b.startZ)===Math.sign(travelDirection.z)?0:1;
        if(aAligned!==bAligned)return aAligned-bAligned;
        const aDist=Math.min(Math.abs(z-a.startZ),Math.abs(z-a.endZ));
        const bDist=Math.min(Math.abs(z-b.startZ),Math.abs(z-b.endZ));
        return aDist-bDist;
      });
    } else if(ramps.length) {
      ramps.sort((a,b)=>{
        const aDist=Math.min(Math.abs(currentY-a.bottomY),Math.abs(currentY-a.topY));
        const bDist=Math.min(Math.abs(currentY-b.bottomY),Math.abs(currentY-b.topY));
        return aDist-bDist;
      });
    }
    const ramp=ramps[0];
    if(ramp) {
      const t=THREE.MathUtils.clamp((z-ramp.startZ)/(ramp.endZ-ramp.startZ),0,1);
      return {
        height:ramp.bottomY+(ramp.topY-ramp.bottomY)*t,
        raised:true
      };
    }

    // A escada exterior é helicoidal. Escolhemos a volta que melhor coincide
    // com a altura atual do Carter, evitando saltos entre voltas sobrepostas.
    if (spiralStair) {
      const dx = x - spiralStair.centerX;
      const dz = z - spiralStair.centerZ;
      const radius = Math.hypot(dx, dz);
      if (radius >= spiralStair.radius - 0.9 && radius <= spiralStair.radius + 0.9) {
        const rawAngle = Math.atan2(dz, dx);
        let closest = null;
        for (let turn = 0; turn <= 4; turn++) {
          const angle = rawAngle + turn * Math.PI * 2;
          const progress = angle - spiralStair.startAngle;
          if (progress < -0.2 || progress > spiralStair.totalAngle + 0.2) continue;
          const t = THREE.MathUtils.clamp(progress / spiralStair.totalAngle, 0, 1);
          const height = spiralStair.bottomY + (spiralStair.topY - spiralStair.bottomY) * t;
          const difference = Math.abs(height - currentY);
          if (!closest || difference < closest.difference) closest = { height, difference };
        }
        if (closest && closest.difference <= 1.35) {
          return { height: closest.height, raised: true };
        }
      }
    }

    // Curved stair paths: project Carter onto each 3D path segment in X/Z.
    // The same sampled path drives the visible treads and the physical walk surface.
    let closestCurve = null;
    for (const curve of walkableCurves) {
      const points = curve.points || [];
      for (let i = 0; i < points.length - 1; i++) {
        const a = points[i], b = points[i + 1];
        const dx = b.x - a.x, dz = b.z - a.z;
        const lengthSq = dx * dx + dz * dz;
        if (lengthSq < 0.0001) continue;
        const t = THREE.MathUtils.clamp(((x - a.x) * dx + (z - a.z) * dz) / lengthSq, 0, 1);
        const px = a.x + dx * t, pz = a.z + dz * t;
        const distance = Math.hypot(x - px, z - pz);
        if (distance > (curve.width || 2.4) * 0.5 + 0.38) continue;
        const height = a.y + (b.y - a.y) * t;
        const verticalDifference = Math.abs(height - currentY);
        if (verticalDifference > (curve.maxSnapHeight || 1.3)) continue;
        const score = verticalDifference * 1.8 + distance;
        if (!closestCurve || score < closestCurve.score) closestCurve = { height, distance, score };
      }
    }
    if (closestCurve) return { height: closestCurve.height, raised: true };

    const platforms = walkablePlatforms
      .filter(item =>
        x >= item.minX && x <= item.maxX &&
        z >= item.minZ && z <= item.maxZ &&
        item.height <= currentY + 0.24
      )
      .sort((a, b) => Math.abs(a.height - currentY) - Math.abs(b.height - currentY));
    if (platforms.length) return { height: platforms[0].height, raised: true };
    return { height: zones[zoneName].base ?? 0, raised: false };
  }

  function focusOnRoof(){
    const p=getPosition();
    cameraCue={
      elapsed:0,duration:1.65,hold:1.35,returnDuration:1.05,
      fromFocus:new THREE.Vector3(p.x,p.y+cameraFocusHeight,p.z),
      roofFocus:new THREE.Vector3(0,22.6,9.2),
      fromYaw:cameraYaw,fromPitch:cameraPitch,fromDistance:cameraDistance,
      roofYaw:0,roofPitch:0.18,roofDistance:9.2
    };
  }

  function teleport(name) {
    if (controlsLocked) return;
    const zone = zones[name];
    if (!zone) return;
    zoneName = name;
    cameraCue = null;
    airborne = false;
    verticalVelocity = 0;
    cameraShakeRemaining = 0;
    character.model.position.set(...zone.pos);
    if (character.human) character.human.reset();
    else character.resetFallback?.();
    smoothVelocity.set(0, 0, 0);
    fallbackSpeed = 0;
    cameraYaw = zone.yaw ?? 0;
    cameraPitch = 0.24;
    firstCameraFrame = true;
    onZoneChange?.(name, zone);
  }

  // Place Carter at a precise interaction anchor (for example, a bench) without
  // changing rooms or rebuilding the approved Ara rig.
  function placeAt(target, facingTarget = null) {
    if (!target || !Number.isFinite(target.x) || !Number.isFinite(target.y) || !Number.isFinite(target.z)) return false;
    character.model.position.set(target.x,target.y,target.z);
    character.model.rotation.x=0;
    character.model.rotation.z=0;
    if(facingTarget) {
      const direction=facingTarget.clone().sub(target).setY(0);
      if(direction.lengthSq()>.0001) {
        direction.normalize();
        cameraYaw=Math.atan2(-direction.x,-direction.z);
        character.faceTarget?.(facingTarget);
      }
    }
    airborne=false;verticalVelocity=0;jumpFloorHeight=target.y;
    smoothVelocity.set(0,0,0);fallbackSpeed=0;cameraCue=null;
    cameraShakeRemaining=0;firstCameraFrame=true;
    return true;
  }

  function capturePointer() {
    if (document.pointerLockElement !== canvas && canvas.requestPointerLock) {
      try { canvas.requestPointerLock(); } catch (error) { console.warn('Pointer lock indisponível:', error); }
    }
  }

  document.addEventListener('pointerlockchange', () => {
    pointerLocked = document.pointerLockElement === canvas;
    const status = document.getElementById('status');
    if (status) status.innerHTML = pointerLocked
      ? 'TERCEIRA PESSOA<br>MOUSE CAPTURADO · ESC PARA LIBERAR'
      : 'TERCEIRA PESSOA<br>CLIQUE NA CENA PARA GIRAR A CÂMERA';
  });

  document.addEventListener('mousemove', (event) => {
    if (!pointerLocked) return;
    cameraYaw -= event.movementX * 0.0027;
    cameraPitch = THREE.MathUtils.clamp(cameraPitch + event.movementY * 0.0018, -Math.PI / 2 + 0.01, Math.PI / 2 - 0.01);
  });

  // Em telas sensíveis ao toque, arrastar sobre a cena orbita a câmera sem Pointer Lock.
  let touchLook = null;
  canvas.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'touch') return;
    touchLook = { id: event.pointerId, x: event.clientX, y: event.clientY };
  });
  canvas.addEventListener('pointermove', (event) => {
    if (!touchLook || touchLook.id !== event.pointerId) return;
    const dx = event.clientX - touchLook.x;
    const dy = event.clientY - touchLook.y;
    cameraYaw -= dx * 0.006;
    cameraPitch = THREE.MathUtils.clamp(cameraPitch + dy * 0.004, -Math.PI / 2 + 0.01, Math.PI / 2 - 0.01);
    touchLook.x = event.clientX;
    touchLook.y = event.clientY;
  });
  const releaseTouchLook = (event) => {
    if (touchLook?.id === event.pointerId) touchLook = null;
  };
  canvas.addEventListener('pointerup', releaseTouchLook);
  canvas.addEventListener('pointercancel', releaseTouchLook);

  canvas.addEventListener('click', () => {
    if (document.getElementById('startscreen')?.classList.contains('hidden')) capturePointer();
  });

  window.addEventListener('wheel', (event) => {
    cameraDistance = THREE.MathUtils.clamp(cameraDistance + Math.sign(event.deltaY) * 0.25, 1.2, 6.5);
  }, { passive: true });

  function startJump() {
    if (controlsLocked || airborne) return false;
    const p = getPosition();
    const ground = getWalkingSurface(p.x, p.z, p.y).height;
    if (p.y < ground) p.y = ground;
    const started = character.jump?.();
    if (!started) return false;
    airborne = true;
    verticalVelocity = 4.6;
    jumpFloorHeight = ground;
    return true;
  }

  window.addEventListener('keydown', (event) => {
    if (controlsLocked) {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) event.preventDefault();
      return;
    }
    keys.add(event.code);
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) event.preventDefault();
    if (event.code === 'Digit1') teleport('dock');
    if (event.code === 'Digit2') teleport('hall');
    if (event.code === 'Digit3') teleport('library');
    if (event.code === 'Digit4') teleport('bedroom');
    if (event.code === 'Digit5') teleport('training');
    if (event.code === 'Space') startJump();
  });
  window.addEventListener('keyup', (event) => keys.delete(event.code));
  window.addEventListener('blur', () => keys.clear());

  // Joystick analógico: direção e intensidade controlam a marcha sem passos digitais.
  const joystick = document.getElementById('joystick');
  const joystickKnob = document.getElementById('joystickKnob');
  let joystickPointer = null;
  function setJoystick(event) {
    if (!joystick || !joystickKnob) return;
    const rect = joystick.getBoundingClientRect();
    const ring = joystick.querySelector('.joystick-ring');
    const ringRect = ring?.getBoundingClientRect() || rect;
    const knobRect = joystickKnob.getBoundingClientRect();
    const radius = Math.max(8, Math.min(ringRect.width, ringRect.height) / 2
      - Math.max(knobRect.width, knobRect.height) / 2 - 3);
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = event.clientX - cx;
    let dy = event.clientY - cy;
    const length = Math.hypot(dx, dy);
    if (length > radius) {
      dx = dx / length * radius;
      dy = dy / length * radius;
    }
    const rawX = dx / radius;
    const rawY = dy / radius;
    const magnitude = Math.hypot(rawX, rawY);
    const deadZone = 0.12;
    const scaled = magnitude <= deadZone ? 0 : (magnitude - deadZone) / (1 - deadZone);
    const factor = magnitude > 0 ? scaled / magnitude : 0;
    touch.moveX = rawX * factor;
    touch.moveY = rawY * factor;
    joystickKnob.style.transform = `translate(${dx}px,${dy}px)`;
  }
  function resetJoystick() {
    joystickPointer = null;
    touch.moveX = 0;
    touch.moveY = 0;
    if (joystickKnob) joystickKnob.style.transform = 'translate(0,0)';
  }
  if (joystick) {
    joystick.addEventListener('pointerdown', event => {
      event.preventDefault();
      joystickPointer = event.pointerId;
      joystick.setPointerCapture?.(event.pointerId);
      setJoystick(event);
    });
    joystick.addEventListener('pointermove', event => {
      if (joystickPointer === event.pointerId) setJoystick(event);
    });
    joystick.addEventListener('pointerup', resetJoystick);
    joystick.addEventListener('pointercancel', resetJoystick);
    joystick.addEventListener('lostpointercapture', resetJoystick);
  }

  document.querySelectorAll('#mobile [data-action]').forEach((button) => {
    const action = button.dataset.action;
    button.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      if (controlsLocked) return;
      if (action === 'run') touch.sprint = true;
      if (action === 'jump') startJump();
      button.setPointerCapture?.(event.pointerId);
    });
    const release = () => { if (action === 'run') touch.sprint = false; };
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('lostpointercapture', release);
  });

  function inputDirection() {
    if (controlsLocked) return { forward: 0, strafe: 0, magnitude: 0, moving: false };
    let forward = (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0)
      - (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0) - touch.moveY;
    let strafe = (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0)
      - (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0) + touch.moveX;
    const magnitude = Math.hypot(forward, strafe);
    if (magnitude > 1) { forward /= magnitude; strafe /= magnitude; }
    return { forward, strafe, magnitude: Math.min(1, magnitude), moving: magnitude > 0.12 };
  }

  function limitToZone(pos, direction, stepLength) {
    const bounds = zones[zoneName].bounds;
    const nextX = pos.x + direction.x * stepLength;
    const nextZ = pos.z + direction.z * stepLength;
    if (nextX < bounds[0] || nextX > bounds[1]) direction.x = 0;
    if (nextZ < bounds[2] || nextZ > bounds[3]) direction.z = 0;
    return direction;
  }

  function update(dt) {
    const input = inputDirection();
    // A câmera fica atrás do Carter; o eixo frontal do personagem aponta para -Z.
    const forward = new THREE.Vector3(-Math.sin(cameraYaw), 0, -Math.cos(cameraYaw));
    const right = new THREE.Vector3(Math.cos(cameraYaw), 0, -Math.sin(cameraYaw));
    const direction = forward.multiplyScalar(input.forward).add(right.multiplyScalar(input.strafe));
    if (direction.lengthSq() > 0.0001) direction.normalize();

    const injured = character.isInjured === true;
    const keyboardSprint = keys.has('ShiftLeft') || keys.has('ShiftRight');
    // No celular, empurrar o joystick progressivamente para frente aumenta a velocidade.
    // A corrida entra suavemente no trecho final do curso, sem botão separado.
    const forwardPush = Math.max(0, -touch.moveY);
    const analogSprintBlend = THREE.MathUtils.clamp((forwardPush - 0.48) / 0.48, 0, 1);
    const running = !controlsLocked && !injured && (keyboardSprint || touch.sprint || analogSprintBlend > 0.02);
    const injuryMultiplier = Number.isFinite(character.movementMultiplier) ? character.movementMultiplier : 1;
    const characterScale = (Number.isFinite(character.height) ? character.height : 1.75) / 1.78;
    // Keep normal walking below Ara's walk/run blend threshold, so the unarmed
    // sprint clip never bleeds into a regular walk cycle. The unarmed sprint uses
    // Ara's natural run pace; the approved staff sprint keeps its original speed.
    const walkSpeed = 1.5 * characterScale * 0.98;
    const runSpeed = character.isSprintArmed === true ? 4.2 : 3.7 * characterScale;
    const analogSpeed = walkSpeed + (runSpeed - walkSpeed) * analogSprintBlend;
    const speedTarget = input.moving
      ? (keyboardSprint || touch.sprint ? runSpeed : analogSpeed) * input.magnitude * injuryMultiplier
      : 0;
    const currentPosition = getPosition();
    limitToZone(currentPosition, direction, Math.max(speedTarget, 2.25) * dt * 1.35);

    if (character.human) {
      // Resolve X/Z independently so the player can slide alongside furniture and gallery walls.
      if(direction.lengthSq()>0.0001) {
        const dx=direction.x*speedTarget*dt;
        const dz=direction.z*speedTarget*dt;
        const blockedX=Math.abs(dx)>0.00001 && blockedAt(currentPosition.x+dx,currentPosition.z,currentPosition.y);
        const blockedZ=Math.abs(dz)>0.00001 && blockedAt(currentPosition.x,currentPosition.z+dz,currentPosition.y);
        if(blockedX) direction.x=0;
        if(blockedZ) direction.z=0;
        if(direction.lengthSq()>0.0001) direction.normalize();
        else direction.set(0,0,0);
      }
      character.human.targetSpeed=direction.lengthSq()>0.0001?speedTarget:0;
      if(direction.lengthSq()>0.0001) {
        const currentForward=character.human.locomotion.body.state.forward.clone().setY(0).normalize();
        const turn=Math.atan2(
          new THREE.Vector3().crossVectors(currentForward,direction).y,
          currentForward.dot(direction)
        );
        character.human.targetHeading=character.human.heading+turn;
      }
      character.human.update(dt);
      // The Ara rig previously skipped the stair solver used by the fallback avatar.
      // Keep its root aligned with the same ramps, landings and elevated room floors.
      const updated=getPosition();
      const walkingSurface = getWalkingSurface(updated.x, updated.z, airborne ? jumpFloorHeight : updated.y, direction);
      if (airborne) {
        verticalVelocity -= 9.3 * dt;
        updated.y += verticalVelocity * dt;
        if (updated.y <= walkingSurface.height) {
          updated.y = walkingSurface.height;
          airborne = false;
          verticalVelocity = 0;
          jumpFloorHeight = walkingSurface.height;
          character.land?.();
        }
      } else if (walkingSurface.raised) {
        updated.y = walkingSurface.height;
        jumpFloorHeight = walkingSurface.height;
      } else if (updated.y > walkingSurface.height) {
        updated.y = Math.max(walkingSurface.height, updated.y - 9.81 * dt);
      } else {
        updated.y = walkingSurface.height;
        jumpFloorHeight = walkingSurface.height;
      }
    } else {
      const targetVelocity = direction.clone().multiplyScalar(speedTarget);
      const response = input.moving ? 8.8 : 10.8;
      smoothVelocity.lerp(targetVelocity, 1 - Math.exp(-response * dt));
      const current = character.model.position;
      const nextX = current.x + smoothVelocity.x * dt;
      const nextZ = current.z + smoothVelocity.z * dt;
      const bounds = zones[zoneName].bounds;

      // Resolver cada eixo separadamente permite deslizar junto à parede em vez de travar diagonalmente.
      if (nextX >= bounds[0] && nextX <= bounds[1] && !blockedAt(nextX, current.z, current.y)) {
        current.x = nextX;
      } else {
        smoothVelocity.x = 0;
      }
      if (nextZ >= bounds[2] && nextZ <= bounds[3] && !blockedAt(current.x, nextZ, current.y)) {
        current.z = nextZ;
      } else {
        smoothVelocity.z = 0;
      }
      // As escadarias laterais elevam o Carter gradualmente até a galeria;
      // fora da plataforma, ele retorna ao piso principal sob gravidade.
      const walkingSurface = getWalkingSurface(current.x, current.z, airborne ? jumpFloorHeight : current.y, direction);
      if (airborne) {
        verticalVelocity -= 9.3 * dt;
        current.y += verticalVelocity * dt;
        if (current.y <= walkingSurface.height) {
          current.y = walkingSurface.height;
          airborne = false;
          verticalVelocity = 0;
          jumpFloorHeight = walkingSurface.height;
          character.land?.();
        }
      } else if (walkingSurface.raised) {
        current.y = walkingSurface.height;
        jumpFloorHeight = walkingSurface.height;
      } else if (current.y > walkingSurface.height) {
        current.y = Math.max(walkingSurface.height, current.y - 9.81 * dt);
      } else {
        current.y = walkingSurface.height;
        jumpFloorHeight = walkingSurface.height;
      }

      fallbackSpeed = smoothVelocity.length();
      if (direction.lengthSq() > 0.0001) {
        // O modelo Ara começa com rotação PI; o root externo só gira no eixo Y.
        // Não adicionar pitch ou roll ao mudar de direção ou ao correr.
        const targetHeading = Math.atan2(-direction.x, -direction.z);
        const yaw = THREE.MathUtils.damp(character.model.rotation.y, targetHeading, 9.5, dt);
        character.model.rotation.set(0, yaw, 0);
      } else {
        // Elimina qualquer inclinação residual depois de soltar as teclas.
        character.model.rotation.x = 0;
        character.model.rotation.z = 0;
      }
      character.updateFallback(dt, fallbackSpeed);
    }

    const p = getPosition();
    // Passagens entre ambientes contíguos preservam a posição do personagem.
    // Os limiares só são avaliados dentro da faixa aberta do portal correspondente.
    for (const portal of zonePortals) {
      if (zoneName !== portal.from) continue;
      const axisValue = p[portal.axis];
      const transverseValue = portal.axis === 'x' ? p.z : p.x;
      const inOpening = transverseValue >= portal.rangeMin && transverseValue <= portal.rangeMax;
      const crossed = portal.direction === 'lt'
        ? axisValue < portal.threshold
        : axisValue > portal.threshold;
      if (inOpening && crossed && zones[portal.to]) {
        zoneName = portal.to;
        onZoneChange?.(zoneName, zones[zoneName]);
        // Rebind the Ara locomotion after an automatic room transition. The old
        // controller is stopped by resumeLocomotion() before a new one is created.
        character.resumeLocomotion?.();
        break;
      }
    }
    lookTarget.set(p.x, p.y + cameraFocusHeight, p.z);
    let renderYaw=cameraYaw,renderPitch=cameraPitch,renderDistance=cameraDistance;
    if(cameraCue){
      cameraCue.elapsed+=dt;
      const total=cameraCue.duration+cameraCue.hold+cameraCue.returnDuration;
      if(cameraCue.elapsed<cameraCue.duration){
        const t=THREE.MathUtils.clamp(cameraCue.elapsed/cameraCue.duration,0,1),e=t*t*(3-2*t);
        lookTarget.copy(cameraCue.fromFocus).lerp(cameraCue.roofFocus,e);
        renderYaw=THREE.MathUtils.lerp(cameraCue.fromYaw,cameraCue.roofYaw,e);
        renderPitch=THREE.MathUtils.lerp(cameraCue.fromPitch,cameraCue.roofPitch,e);
        renderDistance=THREE.MathUtils.lerp(cameraCue.fromDistance,cameraCue.roofDistance,e);
      }else if(cameraCue.elapsed<cameraCue.duration+cameraCue.hold){
        lookTarget.copy(cameraCue.roofFocus);
        renderYaw=cameraCue.roofYaw;renderPitch=cameraCue.roofPitch;renderDistance=cameraCue.roofDistance;
      }else if(cameraCue.elapsed<total){
        const t=THREE.MathUtils.clamp((cameraCue.elapsed-cameraCue.duration-cameraCue.hold)/cameraCue.returnDuration,0,1),e=t*t*(3-2*t);
        const home=new THREE.Vector3(p.x,p.y+cameraFocusHeight,p.z);
        lookTarget.copy(cameraCue.roofFocus).lerp(home,e);
        renderYaw=THREE.MathUtils.lerp(cameraCue.roofYaw,cameraCue.fromYaw,e);
        renderPitch=THREE.MathUtils.lerp(cameraCue.roofPitch,cameraCue.fromPitch,e);
        renderDistance=THREE.MathUtils.lerp(cameraCue.roofDistance,cameraCue.fromDistance,e);
      }else{
        cameraCue=null;
      }
    }
    const horizontalDistance=renderDistance*Math.cos(renderPitch);
    desiredCamera.set(
      lookTarget.x+Math.sin(renderYaw)*horizontalDistance,
      lookTarget.y+Math.sin(renderPitch)*renderDistance+0.15,
      lookTarget.z+Math.cos(renderYaw)*horizontalDistance
    );
    const floorY = getWalkingSurface(p.x, p.z, airborne ? jumpFloorHeight : p.y).height;
    desiredCamera.y = Math.max(desiredCamera.y, floorY + 0.28);
    if (firstCameraFrame) {
      camera.position.copy(desiredCamera);
      firstCameraFrame = false;
    } else {
      camera.position.lerp(desiredCamera, 1 - Math.exp(-8.5 * dt));
    }
    // Impacto: micro-tremor curto, amortecido e independente da simulação física.
    if (cameraShakeRemaining > 0) {
      cameraShakeRemaining = Math.max(0, cameraShakeRemaining - dt);
      const strength = 0.15 * (cameraShakeRemaining / 0.42);
      const phase = (0.42 - cameraShakeRemaining) * 58;
      camera.position.x += Math.sin(phase * 1.7) * strength;
      camera.position.y += Math.cos(phase * 2.1) * strength * 0.62;
      camera.position.z += Math.sin(phase * 1.3) * strength * 0.35;
    }
    // O clamp final elimina qualquer passagem da câmera pelo piso durante o smoothing.
    camera.position.y = Math.max(camera.position.y, floorY + 0.28);
    camera.lookAt(lookTarget);
    return { position: p, speed: character.human ? character.human.speed : fallbackSpeed, zone: zoneName };
  }

  function setLocked(locked) {
    controlsLocked = Boolean(locked);
    if (controlsLocked) {
      keys.clear();
      touch.moveX = 0;
      touch.moveY = 0;
      touch.sprint = false;
      resetJoystick();
    }
  }

  return {
    update,
    teleport,
    placeAt,
    setLocked,
    capturePointer,
    getPosition,
    focusOnRoof,
    triggerHit() {
      cameraShakeRemaining = 0.42;
    },
    getForward() {
      return new THREE.Vector3(-Math.sin(cameraYaw), 0, -Math.cos(cameraYaw));
    },
    get zone() { return zoneName; },
    get isAirborne() { return airborne; },
    get pointerLocked() { return pointerLocked; }
  };
}

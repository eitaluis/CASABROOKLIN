export function createThirdPersonController({ THREE, camera, canvas, character, zones, colliders = [], onZoneChange }) {
  const keys = new Set();
  const touch = { moveX: 0, moveY: 0, sprint: false };
  const position = new THREE.Vector3();
  const lookTarget = new THREE.Vector3();
  const desiredCamera = new THREE.Vector3();
  const smoothVelocity = new THREE.Vector3();
  let zoneName = 'dock';
  let cameraYaw = 0;
  let cameraPitch = 0.20;
  let cameraDistance = 3.2;
  let pointerLocked = false;
  let firstCameraFrame = true;
  let fallbackSpeed = 0;

  // Colisão de primeira passagem: cápsula vertical simplificada contra caixas estáticas.
  // Mantém o teste leve para funcionar também no celular.
  const characterRadius = 0.34;
  const characterHeight = 1.72;
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

  function teleport(name) {
    const zone = zones[name];
    if (!zone) return;
    zoneName = name;
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

  window.addEventListener('keydown', (event) => {
    keys.add(event.code);
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) event.preventDefault();
    if (event.code === 'Digit1') teleport('dock');
    if (event.code === 'Digit2') teleport('hall');
    if (event.code === 'Digit3') teleport('library');
    if (event.code === 'Digit4') teleport('bedroom');
    if (event.code === 'Space') character.jump?.();
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
      if (action === 'run') touch.sprint = true;
      if (action === 'jump') character.jump?.();
      button.setPointerCapture?.(event.pointerId);
    });
    const release = () => { if (action === 'run') touch.sprint = false; };
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('lostpointercapture', release);
  });

  function inputDirection() {
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

    const running = keys.has('ShiftLeft') || keys.has('ShiftRight') || touch.sprint;
    const speedTarget = input.moving ? (running ? 4.2 : 1.5) * input.magnitude : 0;
    const currentPosition = getPosition();
    limitToZone(currentPosition, direction, Math.max(speedTarget, 2.25) * dt * 1.35);

    if (character.human) {
      character.human.targetSpeed = direction.lengthSq() > 0.0001 ? speedTarget : 0;
      if (direction.lengthSq() > 0.0001) {
        const currentForward = character.human.locomotion.body.state.forward.clone().setY(0).normalize();
        const turn = Math.atan2(
          new THREE.Vector3().crossVectors(currentForward, direction).y,
          currentForward.dot(direction)
        );
        character.human.targetHeading = character.human.heading + turn;
      }
      character.human.update(dt);
    } else {
      const targetVelocity = direction.clone().multiplyScalar(speedTarget);
      const response = input.moving ? 12.5 : 17.5;
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
      fallbackSpeed = smoothVelocity.length();
      if (direction.lengthSq() > 0.0001) {
        // O modelo Ara começa com rotação PI; manter esse offset evita que ele vire para a câmera ao andar.
        const targetHeading = Math.atan2(-direction.x, -direction.z);
        character.model.rotation.y = THREE.MathUtils.damp(character.model.rotation.y, targetHeading, 13.5, dt);
      }
      // Inclinação frontal sutil no sprint e compensação lateral ao mudar de direção.
      const leanTarget = running && fallbackSpeed > 2.4 ? 0.17 : input.moving ? 0.035 : 0;
      const bankTarget = input.moving ? THREE.MathUtils.clamp(-input.strafe * 0.045, -0.055, 0.055) : 0;
      character.model.rotation.x = THREE.MathUtils.damp(character.model.rotation.x, leanTarget, running ? 7.5 : 10.5, dt);
      character.model.rotation.z = THREE.MathUtils.damp(character.model.rotation.z, bankTarget, 8.5, dt);
      character.updateFallback(dt, fallbackSpeed);
    }

    const p = getPosition();
    lookTarget.set(p.x, p.y + 0.98, p.z);
    const horizontalDistance = cameraDistance * Math.cos(cameraPitch);
    desiredCamera.set(
      lookTarget.x + Math.sin(cameraYaw) * horizontalDistance,
      lookTarget.y + Math.sin(cameraPitch) * cameraDistance + 0.15,
      lookTarget.z + Math.cos(cameraYaw) * horizontalDistance
    );
    const floorY = zones[zoneName].base ?? 0;
    desiredCamera.y = Math.max(desiredCamera.y, floorY + 0.28);
    if (firstCameraFrame) {
      camera.position.copy(desiredCamera);
      firstCameraFrame = false;
    } else {
      camera.position.lerp(desiredCamera, 1 - Math.exp(-10.5 * dt));
    }
    // O clamp final elimina qualquer passagem do corpo da câmera pelo piso durante o smoothing.
    camera.position.y = Math.max(camera.position.y, floorY + 0.28);
    camera.lookAt(lookTarget);
    return { position: p, speed: character.human ? character.human.speed : fallbackSpeed, zone: zoneName };
  }

  return {
    update,
    teleport,
    capturePointer,
    getPosition,
    get zone() { return zoneName; },
    get pointerLocked() { return pointerLocked; }
  };
}

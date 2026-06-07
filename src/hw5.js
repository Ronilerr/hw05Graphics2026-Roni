import {OrbitControls} from './OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
scene.background = new THREE.Color(0x1a1a2e);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 20, 12);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 120;
directionalLight.shadow.camera.left = -15;
directionalLight.shadow.camera.right = 15;
directionalLight.shadow.camera.top = 15;
directionalLight.shadow.camera.bottom = -70;
scene.add(directionalLight);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

function degrees_to_radians(degrees) {
  return degrees * (Math.PI / 180);
}

function createWoodTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#DEB887';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 40; i++) {
    ctx.strokeStyle = `rgba(139, 90, 43, ${0.08 + Math.random() * 0.12})`;
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(0, i * 6 + Math.random() * 4);
    ctx.bezierCurveTo(
      canvas.width * 0.3, i * 6 + Math.random() * 8,
      canvas.width * 0.7, i * 6 - Math.random() * 8,
      canvas.width, i * 6 + Math.random() * 4
    );
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 12);
  return texture;
}

function createCarpetTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#C4A574';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 800; i++) {
    ctx.fillStyle = `rgba(${100 + Math.random() * 40}, ${80 + Math.random() * 30}, ${50 + Math.random() * 20}, 0.35)`;
    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 4);
  return texture;
}

function createMarking(width, height, depth, color, x, y, z) {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshBasicMaterial({ color });
  const marking = new THREE.Mesh(geometry, material);
  marking.position.set(x, y, z);
  marking.receiveShadow = true;
  scene.add(marking);
  return marking;
}

function createDot(x, z) {
  const geometry = new THREE.CylinderGeometry(0.08, 0.08, 0.02, 16);
  const material = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const dot = new THREE.Mesh(geometry, material);
  dot.position.set(x, 0.12, z);
  dot.receiveShadow = true;
  scene.add(dot);
  return dot;
}

function createBowlingLane() {
  const approachGeometry = new THREE.BoxGeometry(3.5, 0.18, 15);
  const approachMaterial = new THREE.MeshPhongMaterial({
    color: 0xC4A574,
    map: createCarpetTexture(),
    shininess: 40
  });
  const approach = new THREE.Mesh(approachGeometry, approachMaterial);
  approach.position.set(0, 0.01, 7.5);
  approach.receiveShadow = true;
  scene.add(approach);

  const laneGeometry = new THREE.BoxGeometry(3.5, 0.2, 60);
  const laneMaterial = new THREE.MeshPhongMaterial({
    color: 0xDEB887,
    map: createWoodTexture(),
    shininess: 80
  });
  const lane = new THREE.Mesh(laneGeometry, laneMaterial);
  lane.position.set(0, 0, -30);
  lane.receiveShadow = true;
  scene.add(lane);

  const pinDeckGeometry = new THREE.BoxGeometry(3.5, 0.2, 3);
  const pinDeckMaterial = new THREE.MeshPhongMaterial({
    color: 0xD2B48C,
    shininess: 60
  });
  const pinDeck = new THREE.Mesh(pinDeckGeometry, pinDeckMaterial);
  pinDeck.position.set(0, 0, -61.5);
  pinDeck.receiveShadow = true;
  scene.add(pinDeck);

  const gutterGeometry = new THREE.BoxGeometry(0.45, 0.12, 75);
  const gutterMaterial = new THREE.MeshPhongMaterial({
    color: 0x2a2a2a,
    shininess: 20
  });

  const leftGutter = new THREE.Mesh(gutterGeometry, gutterMaterial);
  leftGutter.position.set(-2.0, -0.06, -22.5);
  leftGutter.receiveShadow = true;
  scene.add(leftGutter);

  const rightGutter = new THREE.Mesh(gutterGeometry, gutterMaterial);
  rightGutter.position.set(2.0, -0.06, -22.5);
  rightGutter.receiveShadow = true;
  scene.add(rightGutter);

  createMarking(3.5, 0.03, 0.1, 0xCC0000, 0, 0.12, 0);

  const approachDotRows = [4, 7];
  const approachDotColumns = [-0.5, 0, 0.5];
  approachDotRows.forEach((rowZ) => {
    approachDotColumns.forEach((dotX) => {
      createDot(dotX, rowZ);
    });
  });

  const arrowPositions = [-1.0, -0.5, 0, 0.5, 1.0];
  arrowPositions.forEach((arrowX) => {
    const arrowGeometry = new THREE.ConeGeometry(0.12, 0.25, 3);
    const arrowMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });
    const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    arrow.rotation.x = degrees_to_radians(-90);
    arrow.position.set(arrowX, 0.13, -15);
    arrow.receiveShadow = true;
    scene.add(arrow);
  });
}

function createBowlingPin() {
  const pinProfile = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.22, 0.05),
    new THREE.Vector2(0.28, 0.35),
    new THREE.Vector2(0.16, 0.55),
    new THREE.Vector2(0.12, 0.75),
    new THREE.Vector2(0.18, 0.95),
    new THREE.Vector2(0.0, 1.25)
  ];

  const pinGeometry = new THREE.LatheGeometry(pinProfile, 24);
  const pinMaterial = new THREE.MeshPhongMaterial({
    color: 0xF5F5F5,
    shininess: 90
  });
  const pin = new THREE.Group();

  const pinBody = new THREE.Mesh(pinGeometry, pinMaterial);
  pinBody.castShadow = true;
  pinBody.receiveShadow = true;
  pin.add(pinBody);

  const stripeGeometry = new THREE.CylinderGeometry(0.14, 0.14, 0.08, 24);
  const stripeMaterial = new THREE.MeshPhongMaterial({ color: 0xCC0000, shininess: 60 });
  const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
  stripe.position.y = 0.72;
  stripe.castShadow = true;
  stripe.receiveShadow = true;
  pin.add(stripe);

  return pin;
}

function createBowlingPins() {
  const pinPositions = [
    { x: 0.0, z: -57.000 },
    { x: -0.5, z: -57.866 },
    { x: 0.5, z: -57.866 },
    { x: -1.0, z: -58.732 },
    { x: 0.0, z: -58.732 },
    { x: 1.0, z: -58.732 },
    { x: -1.5, z: -59.598 },
    { x: -0.5, z: -59.598 },
    { x: 0.5, z: -59.598 },
    { x: 1.5, z: -59.598 }
  ];

  pinPositions.forEach((position) => {
    const pin = createBowlingPin();
    pin.position.set(position.x, 0.1, position.z);
    scene.add(pin);
  });
}

function createFingerHole(radius, depth, x, y, z, rotationX, rotationZ) {
  const holeGeometry = new THREE.CylinderGeometry(radius, radius, depth, 16);
  const holeMaterial = new THREE.MeshPhongMaterial({
    color: 0x111111,
    shininess: 10
  });
  const hole = new THREE.Mesh(holeGeometry, holeMaterial);
  hole.position.set(x, y, z);
  hole.rotation.x = rotationX;
  hole.rotation.z = rotationZ;
  hole.castShadow = true;
  return hole;
}

function createBowlingBall() {
  const ballRadius = 0.45;
  const ballGroup = new THREE.Group();
  ballGroup.position.set(0, ballRadius + 0.1, 8);

  const ballGeometry = new THREE.SphereGeometry(ballRadius, 32, 32);
  const ballMaterial = new THREE.MeshPhongMaterial({
    color: 0x1a1a1a,
    shininess: 120,
    specular: 0x666666
  });
  const ball = new THREE.Mesh(ballGeometry, ballMaterial);
  ball.castShadow = true;
  ball.receiveShadow = true;
  ballGroup.add(ball);

  const holeDepth = 0.18;
  const embed = ballRadius - holeDepth / 2 + 0.02;

  ballGroup.add(createFingerHole(0.07, holeDepth, -0.12, embed, 0.08, degrees_to_radians(70), 0));
  ballGroup.add(createFingerHole(0.07, holeDepth, 0.04, embed, 0.08, degrees_to_radians(70), 0));
  ballGroup.add(createFingerHole(0.09, holeDepth, -0.04, embed, -0.1, degrees_to_radians(115), 0));

  scene.add(ballGroup);
}

function createLaneBumpers() {
  const bumperMaterial = new THREE.MeshPhongMaterial({
    color: 0xFFD700,
    shininess: 35
  });

  [-1.78, 1.78].forEach((x) => {
    const bumperGeometry = new THREE.BoxGeometry(0.18, 0.28, 75);
    const bumper = new THREE.Mesh(bumperGeometry, bumperMaterial);
    bumper.position.set(x, 0.1, -22.5);
    bumper.castShadow = true;
    bumper.receiveShadow = true;
    scene.add(bumper);
  });
}

function createBallReturn() {
  const metalMaterial = new THREE.MeshPhongMaterial({
    color: 0x777777,
    shininess: 70
  });
  const darkMaterial = new THREE.MeshPhongMaterial({
    color: 0x333333,
    shininess: 20
  });

  const troughGeometry = new THREE.BoxGeometry(0.55, 0.25, 72);
  const trough = new THREE.Mesh(troughGeometry, darkMaterial);
  trough.position.set(2.75, -0.08, -22.5);
  trough.receiveShadow = true;
  scene.add(trough);

  const railGeometry = new THREE.BoxGeometry(0.08, 0.35, 72);
  [-0.32, 0.32].forEach((offsetX) => {
    const rail = new THREE.Mesh(railGeometry, metalMaterial);
    rail.position.set(2.75 + offsetX, 0.02, -22.5);
    rail.castShadow = true;
    rail.receiveShadow = true;
    scene.add(rail);
  });

  const liftGeometry = new THREE.BoxGeometry(0.55, 1.2, 1.5);
  const lift = new THREE.Mesh(liftGeometry, metalMaterial);
  lift.position.set(2.75, 0.45, 12);
  lift.castShadow = true;
  lift.receiveShadow = true;
  scene.add(lift);

  const returnedBallGeometry = new THREE.SphereGeometry(0.35, 24, 24);
  const returnedBallMaterial = new THREE.MeshPhongMaterial({
    color: 0x8B0000,
    shininess: 100
  });
  const returnedBall = new THREE.Mesh(returnedBallGeometry, returnedBallMaterial);
  returnedBall.position.set(2.75, 0.05, 10);
  returnedBall.castShadow = true;
  scene.add(returnedBall);
}

function createSeatingArea() {
  const woodMaterial = new THREE.MeshPhongMaterial({
    color: 0x8B4513,
    shininess: 30
  });
  const cushionMaterial = new THREE.MeshPhongMaterial({
    color: 0x4A148C,
    shininess: 20
  });

  const seatGeometry = new THREE.BoxGeometry(5, 0.15, 0.9);
  const seat = new THREE.Mesh(seatGeometry, cushionMaterial);
  seat.position.set(0, 0.55, 16.5);
  seat.castShadow = true;
  seat.receiveShadow = true;
  scene.add(seat);

  const backGeometry = new THREE.BoxGeometry(5, 0.9, 0.15);
  const back = new THREE.Mesh(backGeometry, cushionMaterial);
  back.position.set(0, 1.05, 17.0);
  back.castShadow = true;
  back.receiveShadow = true;
  scene.add(back);

  [[-2.2, 16.2], [2.2, 16.2], [-2.2, 16.8], [2.2, 16.8]].forEach(([legX, legZ]) => {
    const legGeometry = new THREE.BoxGeometry(0.15, 0.55, 0.15);
    const leg = new THREE.Mesh(legGeometry, woodMaterial);
    leg.position.set(legX, 0.28, legZ);
    leg.castShadow = true;
    leg.receiveShadow = true;
    scene.add(leg);
  });
}

function createOverheadMonitor() {
  const poleMaterial = new THREE.MeshPhongMaterial({
    color: 0x444444,
    shininess: 50
  });
  const screenMaterial = new THREE.MeshPhongMaterial({
    color: 0x111133,
    emissive: 0x2244aa,
    shininess: 90
  });
  const frameMaterial = new THREE.MeshPhongMaterial({
    color: 0x222222,
    shininess: 40
  });

  [-1.4, 1.4].forEach((poleX) => {
    const poleGeometry = new THREE.CylinderGeometry(0.06, 0.06, 7.5, 12);
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.set(poleX, 3.75, -18);
    pole.castShadow = true;
    pole.receiveShadow = true;
    scene.add(pole);
  });

  const frameGeometry = new THREE.BoxGeometry(3.6, 2.0, 0.12);
  const frame = new THREE.Mesh(frameGeometry, frameMaterial);
  frame.position.set(0, 7.2, -18);
  frame.castShadow = true;
  frame.receiveShadow = true;
  scene.add(frame);

  const screenGeometry = new THREE.BoxGeometry(3.3, 1.7, 0.08);
  const screen = new THREE.Mesh(screenGeometry, screenMaterial);
  screen.position.set(0, 7.2, -17.92);
  screen.receiveShadow = true;
  scene.add(screen);

  const bracketGeometry = new THREE.BoxGeometry(3.0, 0.08, 0.08);
  const bracket = new THREE.Mesh(bracketGeometry, poleMaterial);
  bracket.position.set(0, 7.2, -18);
  bracket.castShadow = true;
  scene.add(bracket);
}

createBowlingLane();
createBowlingPins();
createBowlingBall();
createLaneBumpers();
createBallReturn();
createSeatingArea();
createOverheadMonitor();

const controls = new OrbitControls(camera, renderer.domElement);
let isOrbitEnabled = true;

const cameraPresets = {
  '1': { position: new THREE.Vector3(0, 5, 12), target: new THREE.Vector3(0, 0, -25) },
  '2': { position: new THREE.Vector3(0, 38, -25), target: new THREE.Vector3(0, 0, -25) },
  '3': { position: new THREE.Vector3(0, 4, -68), target: new THREE.Vector3(0, 0, -57) },
  '4': { position: new THREE.Vector3(14, 6, -25), target: new THREE.Vector3(0, 0, -25) }
};

function applyCameraPreset(key) {
  const preset = cameraPresets[key];
  if (!preset) {
    return;
  }
  camera.position.copy(preset.position);
  controls.target.copy(preset.target);
  controls.update();
}

applyCameraPreset('1');

function handleKeyDown(e) {
  if (e.key.toLowerCase() === 'o') {
    isOrbitEnabled = !isOrbitEnabled;
  }
  if (cameraPresets[e.key]) {
    applyCameraPreset(e.key);
  }
}

document.addEventListener('keydown', handleKeyDown);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);

function animate() {
  requestAnimationFrame(animate);
  controls.enabled = isOrbitEnabled;
  controls.update();
  renderer.render(scene, camera);
}

animate();

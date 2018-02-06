/**
 * 3D
 * Handles the THREE.js components
 * Units are in km
 */

import * as THREE from 'three';
import * as STLLoader from 'three/examples/js/loaders/STLLoader.js';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/throttleTime';

import {
  distanceToHorizon,
  latLongToCartesian,
  meanRadiusOfEarth,
  radiansToNorthPole,
} from 'utils/geodesy';

import destinyGeometry from 'models/destiny-zvezda-ATV.stl';
import JEMGeometry from 'models/JEM.stl';
import Node1RingGeometry from 'models/node1-ring.stl';
import Node2RingGeometry from 'models/node2-ring.stl';
import PVAGeometry from 'models/PVA.stl';
import PVA2Geometry from 'models/PVA2.stl';
import S0Geometry from 'models/S0.stl';
import SPMGeometry from 'models/SPM-radiator.stl';
import ZvezdaRingGeometry from 'models/zvezda-ring.stl';

import px from 'textures/px.jpg';
import nx from 'textures/nx.jpg';
import py from 'textures/py.jpg';
import ny from 'textures/ny.jpg';
import pz from 'textures/pz.jpg';
import nz from 'textures/nz.jpg';

/* Settings */

const ISSScale = 100;
const ballScale = 1;
const coneScale = 0.1;

const ghostMaterial = new THREE.MeshBasicMaterial({
  color: new THREE.Color('#fff'),
  opacity: 0.5,
  side: THREE.DoubleSide,
  transparent: true,
});

const ISSGeometries = [
  { part: 'destiny', geometry: destinyGeometry },
  { part: 'JEM', geometry: JEMGeometry },
  { part: 'node1Ring', geometry: Node1RingGeometry },
  { part: 'node2Ring', geometry: Node2RingGeometry },
  { part: 'PVA', geometry: PVAGeometry },
  { part: 'PVA2', geometry: PVA2Geometry },
  { part: 'S0', geometry: S0Geometry },
  { part: 'SPM', geometry: SPMGeometry },
  { part: 'zvezdaRing', geometry: ZvezdaRingGeometry },
];

const ISSMaterials = {
  DAY: {
    destiny: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#fff'),
      side: THREE.DoubleSide,
      roughness: 0.9,
    }),
    JEM: new THREE.MeshPhongMaterial({
      color: new THREE.Color('#bedee9'),
      reflectivity: 1,
      shininess: 200,
      side: THREE.DoubleSide,
    }),
    node1Ring: new THREE.MeshStandardMaterial({ color: new THREE.Color('#ff4e68'), side: THREE.DoubleSide }),
    node2Ring: new THREE.MeshStandardMaterial({ color: new THREE.Color('#fff'), side: THREE.DoubleSide }),
    PVA: new THREE.MeshStandardMaterial({ color: new THREE.Color('#69767a'), side: THREE.DoubleSide }),
    PVA2: new THREE.MeshPhongMaterial({
      color: new THREE.Color('#bc9739'),
      reflectivity: 1,
      shininess: 200,
      side: THREE.DoubleSide,
    }),
    S0: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#fff'),
      side: THREE.DoubleSide,
      roughness: 0.9,
    }),
    SPM: new THREE.MeshPhongMaterial({
      color: new THREE.Color('#3c86ff'),
      reflectivity: 1,
      shininess: 200,
      side: THREE.DoubleSide,
    }),
    zvezdaRing: new THREE.MeshStandardMaterial({ color: new THREE.Color('#3c86ff'), side: THREE.DoubleSide }),
  },
  NIGHT: {
    destiny: new THREE.MeshStandardMaterial({ color: new THREE.Color('#B0B0AF'), side: THREE.DoubleSide }),
    JEM: new THREE.MeshPhongMaterial({ color: new THREE.Color('#555'), side: THREE.DoubleSide }),
    S0: new THREE.MeshStandardMaterial({ color: new THREE.Color('#B0B0AF'), side: THREE.DoubleSide }),
    node1Ring: new THREE.MeshStandardMaterial({ color: new THREE.Color('#ff4e68'), side: THREE.DoubleSide }),
    node2Ring: new THREE.MeshStandardMaterial({ color: new THREE.Color('#222'), side: THREE.DoubleSide }),
    PVA: new THREE.MeshStandardMaterial({ color: new THREE.Color('#888'), side: THREE.DoubleSide }),
    PVA2: new THREE.MeshPhongMaterial({
      color: new THREE.Color('#bc9739'),
      reflectivity: 1,
      shininess: 200,
      side: THREE.DoubleSide,
      specular: new THREE.Color('#F4E572'),
    }),
    SPM: new THREE.MeshPhongMaterial({
      color: new THREE.Color('#0C2137'),
      reflectivity: 1,
      shininess: 200,
      side: THREE.DoubleSide,
      specular: new THREE.Color('#52C9D5'),
    }),
    zvezdaRing: new THREE.MeshBasicMaterial({ color: new THREE.Color('#0C2137'), side: THREE.DoubleSide }),
  },
  OBSCURED: {
    destiny: ghostMaterial,
    JEM: ghostMaterial,
    node1Ring: ghostMaterial,
    node2Ring: ghostMaterial,
    PVA: ghostMaterial,
    PVA2: ghostMaterial,
    S0: ghostMaterial,
    SPM: ghostMaterial,
    zvezdaRing: ghostMaterial,
  },
};

const getISSMaterial = (part, state = 'OBSCURED') => ISSMaterials[state][part];

const skybox = [px, nx, py, ny, pz, nz];

const lights = [
  {
    light: new THREE.AmbientLight({ color: 0xffffff, intensity: 0.5 }),
  },
  {
    light: new THREE.PointLight({ color: '#ffc28c', intensity: 0.5, distance: 40, decay: 2 }),
    position: { x: 0, y: 0, z: 50 },
  },
  {
    light: new THREE.PointLight({ color: '#ffc28c', intensity: 1, distance: 40, decay: 2 }),
    position: { x: 6, y: 18, z: -18 },
  },
  {
    light: new THREE.PointLight({ color: '#fff', intensity: 0, distance: 40, decay: 2 }),
    position: { x: -20, y: 8, z: 0 },
  },
  {
    light: new THREE.PointLight({ color: '#fff', intensity: 0.5, distance: 40, decay: 2 }),
    position: { x: 10, y: 8, z: 0 },
  },
  {
    light: new THREE.PointLight({ color: '#ffffff', intensity: 0.5, distance: 40, decay: 2 }),
    position: { x: 0, y: -13, z: 18 },
  },
];

/* Objects */

const bodies = { ISSParts: {} };

/* Camera */

const camera = new THREE.PerspectiveCamera(
  85,
  window.innerWidth / window.innerHeight,
  0.1,
  meanRadiusOfEarth * 2.5,
);
// const camera2 = new THREE.PerspectiveCamera(
//   85,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   meanRadiusOfEarth * 5,
// );

/* Scene */

const canvas = document.createElement('canvas');
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
});
const scene = new THREE.Scene();
// scene.add(camera2);
// camera2.position.z = -meanRadiusOfEarth * 2;
// camera2.lookAt(0, 0, 0);

/* Create Bodies */

const createBodies = () => {
  /* Create ISS Grouping */

  const ISS = new THREE.Group(); // Just the ISS (no lights)
  bodies.ISS = ISS;

  /* Add ISS Parts */

  ISSGeometries.forEach((part) => {
    new THREE.STLLoader().load(part.geometry, (geometry) => {
      const ISSPart = new THREE.Mesh(geometry, getISSMaterial(part.part));
      ISSPart.scale.set(ISSScale, ISSScale, ISSScale);
      bodies.ISS.add(ISSPart);
      bodies.ISSParts[part.part] = ISSPart;
    });
  });

  /* Add Env Map */

  new THREE.CubeTextureLoader().load(skybox, (texture) => {
    ISSGeometries.forEach((material) => { material.envMap = texture; });
  });

  /* Add Lights */

  const ISSWithLights = new THREE.Group(); // Allows lights to move with station
  ISSWithLights.add(ISS);
  scene.add(ISSWithLights);
  bodies.ISSWithLights = ISSWithLights;

  lights.forEach(({ light, position = null }) => {
    bodies.ISSWithLights.add(light);
    if (position && light.isPointLight) {
      light.position.set(position.x * ISSScale, position.y * ISSScale, position.z * ISSScale);
    }
  });

  /* Add earth sphere */
  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(meanRadiusOfEarth, 50, 50),
    new THREE.MeshStandardMaterial({ color: 0x000027, transparent: true, opacity: 0.25 })
  );
  scene.add(earth);
  bodies.earth = earth;

  /* Add User container */
  const user = new THREE.Group();
  const cameraRotationAxis = new THREE.Group();
  const cameraTiltAxis = new THREE.Group();
  user.add(cameraRotationAxis);
  cameraRotationAxis.add(cameraTiltAxis);
  cameraTiltAxis.add(camera);
  camera.rotation.x = 90 * Math.PI / 180.0;
  camera.rotation.z = 180 * Math.PI / 180.0;
  scene.add(user);
  bodies.user = user;
  bodies.cameraRotationAxis = cameraRotationAxis;
  bodies.cameraTiltAxis = cameraTiltAxis;

  /* Add Pointer */
  const conePosition = new THREE.Group();
  const coneGimball = new THREE.Group();
  const cone = new THREE.Mesh(
    new THREE.ConeBufferGeometry(0.25, 1, 16),
    new THREE.MeshStandardMaterial({ color: 0xffc927 }),
  );
  conePosition.scale.set(ballScale, ballScale, ballScale);
  cone.scale.set(coneScale, coneScale, coneScale);
  coneGimball.add(cone);
  cone.rotation.x = 90 * Math.PI / 180.0;
  camera.add(conePosition);
  conePosition.position.z = -1;
  scene.add(coneGimball);
  bodies.conePosition = conePosition;
  bodies.coneGimball = coneGimball;
};

/* Resize renderer */

const resizeHandler = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

/* Init */

const init = () => {
  const throttleMilliseconds = 1000 / 60; // 60FPS
  canvas.className = 'canvas';

  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  createBodies();

  scene.updateMatrixWorld();

  Observable.fromEvent(window, 'resize')
    .throttleTime(throttleMilliseconds)
    .subscribe(() => resizeHandler());

  /* Render */
  renderer.render(scene, camera);
};

/* Update */

var lastUpdate = {
  ISS: { latitude: 0, longitude: 0, altitude: 0, state: 'OBSCURED' },
  user: { latitude: 0, longitude: 0, altitude: 0, pitch: 0, yaw: 0 },
};
var worldPosition = new THREE.Vector3();
var worldDirection = new THREE.Vector3();
const update = (
  user = { latitude: 0, longitude: 0, altitude: 0, pitch: 0, yaw: 0 },
  ISS = { latitude: 0, longitude: 0, altitude: 0 },
) => {
  const userCoords = latLongToCartesian(user);
  const coords = latLongToCartesian(ISS);

  const ISSMoved = ISS.latitude !== lastUpdate.ISS.latitude || ISS.longitude !== lastUpdate.ISS.longitude;
  const userMoved = user.latitude !== lastUpdate.user.latitude || user.longitude !== lastUpdate.user.longitude;
  const userTurned = user.pitch !== lastUpdate.user.pitch || user.yaw !== lastUpdate.user.yaw;

  // Move ISS to its correct location in world coords, rotate so its facing is correct
  if (ISSMoved) {
    bodies.ISSWithLights.position.set(coords.x, coords.y, coords.z);
    bodies.ISSWithLights.lookAt(0, 0, 0);
  }

  // Move the user to his correct location in world coords
  if (userMoved) {
    bodies.user.position.set(userCoords.x, userCoords.y, userCoords.z);
    bodies.user.lookAt(0, 0, 0);
  }

  // Rotate the camera based on compass heading and device tilt
  if (userTurned) {
    bodies.cameraRotationAxis.rotation.z = user.yaw * Math.PI / 180.0;
    bodies.cameraTiltAxis.rotation.x = -user.pitch * Math.PI / 180.0;
  }

  // Rotate cone so it points at ISS
  scene.updateMatrixWorld();
  worldPosition.setFromMatrixPosition(bodies.conePosition.matrixWorld);
  if (ISSMoved || userMoved || userTurned) {
    bodies.coneGimball.position.set(worldPosition.x, worldPosition.y, worldPosition.z);
    bodies.coneGimball.lookAt(coords.x, coords.y, coords.z);
  }

  // Determine ISS visibility
  var state = 'OBSCURED';
  bodies.coneGimball.getWorldDirection(worldDirection);
  const ray = new THREE.Raycaster(worldPosition, worldDirection);
  if (ray.intersectObject(bodies.earth).length === 0) {
    state = ISS.visibility === 'daylight' ? 'DAY' : 'NIGHT';
  }
  if (state !== lastUpdate.ISS.state) {
    console.log(state);
    ISSGeometries.forEach((part) => {
      if (bodies.ISSParts[part.part]) {
        bodies.ISSParts[part.part].material = getISSMaterial(part.part, state);
      }
    });
  }

  renderer.render(scene, camera);

  lastUpdate.user.latitude = user.latitude;
  lastUpdate.user.longitude = user.longitude;
  lastUpdate.user.pitch = user.pitch;
  lastUpdate.user.yaw = user.yaw;
  lastUpdate.ISS.latitude = ISS.latitude;
  lastUpdate.ISS.longitude = ISS.longitude;
  lastUpdate.ISS.state = state;
};

export default { init, update };

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
  latToRadius,
  latLongToCartesian,
  meanRadiusOfEarth,
  radiansToNorthPole,
} from './utils/cartesianHelpers';

import destinyGeometry from '../models/destiny-zvezda-ATV.stl';
import JEMGeometry from '../models/JEM.stl';
import Node1RingGeometry from '../models/node1-ring.stl';
import Node2RingGeometry from '../models/node2-ring.stl';
import PVAGeometry from '../models/PVA.stl';
import PVA2Geometry from '../models/PVA2.stl';
import S0Geometry from '../models/S0.stl';
import SPMGeometry from '../models/SPM-radiator.stl';
import ZvezdaRingGeometry from '../models/zvezda-ring.stl';

import px from '../textures/px.jpg';
import nx from '../textures/nx.jpg';
import py from '../textures/py.jpg';
import ny from '../textures/ny.jpg';
import pz from '../textures/pz.jpg';
import nz from '../textures/nz.jpg';

/* Settings */

const ISSScale = 300;

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

/* Constants */

const radian = Math.PI / 180;

/* Objects */

const bodies = { ISSParts: {} };

/* Camera */

const camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 0.1, meanRadiusOfEarth * 2.5);
camera.position.set(0, 0.5, 0); // epsilon—shows axes helpers

/* Scene */

const canvas = document.createElement('canvas');
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
  canvas,
});
const scene = new THREE.Scene();
scene.add(camera); // necessary for sticky UI

/* Create Bodies */

const createBodies = () => {
  /* Create ISS Grouping */

  const ISS = new THREE.Group(); // Just the ISS (no lights)
  bodies.ISS = ISS;

  /* Add world rotation (The ship stays where it is, and the dark matter engines move the universe around it, etc.) */

  const world = new THREE.Group();
  bodies.world = world;
  // const worldBoxSize = meanRadiusOfEarth * 2.5;
  // const worldBox = new THREE.Mesh(
  //   new THREE.BoxBufferGeometry(worldBoxSize, worldBoxSize, worldBoxSize),
  //   new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }),
  // );
  // world.add(worldBox);
  // const worldWireframe = new THREE.Mesh(
  //   new THREE.SphereBufferGeometry(meanRadiusOfEarth * 0.9, 32, 32),
  //   new THREE.MeshBasicMaterial({ wireframe: true, sides: THREE.DoubleSide }),
  // );
  // world.add(worldWireframe);
  scene.add(world);

  /* Add horizon */

  const horizonLine = distanceToHorizon();
  const horizon = new THREE.Mesh(
    new THREE.CylinderBufferGeometry(horizonLine, horizonLine, 0.5, 32),
    new THREE.MeshStandardMaterial({ transparent: true, opacity: 0 }),
  );
  horizon.position.y = -0.251;
  bodies.horizon = horizon;
  scene.add(horizon);

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
  ISSWithLights.position.x = meanRadiusOfEarth;
  bodies.world.add(ISSWithLights);
  bodies.ISSWithLights = ISSWithLights;

  lights.forEach(({ light, position = null }) => {
    bodies.ISSWithLights.add(light);
    if (position && light.isPointLight) {
      light.position.set(position.x * ISSScale, position.y * ISSScale, position.z * ISSScale);
    }
  });

  /* Add Helpers */

  const nullIsland = new THREE.Mesh(
    new THREE.SphereGeometry(100, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
  );
  bodies.world.add(nullIsland);
  const nullIslandCoords = latLongToCartesian({ latitude: 0, longitude: 0 });
  nullIsland.position.set(nullIslandCoords.x, nullIslandCoords.y, nullIslandCoords.z);

  /* Add N/S/E/W markers */
  const boreas = new THREE.Mesh(
    new THREE.BoxBufferGeometry(10, 1000, 10),
    new THREE.MeshBasicMaterial({ color: 0x0000ff }),
  );
  const eurus = new THREE.Mesh(
    new THREE.BoxBufferGeometry(10, 1000, 10),
    new THREE.MeshBasicMaterial({ color: 0xff8000 }),
  );
  const notus = new THREE.Mesh(
    new THREE.BoxBufferGeometry(10, 1000, 10),
    new THREE.MeshBasicMaterial({ color: 0x00ff80 }),
  );
  const zephyrus = new THREE.Mesh(
    new THREE.BoxBufferGeometry(10, 1000, 10),
    new THREE.MeshBasicMaterial({ color: 0xff00ff }),
  );
  bodies.boreas = boreas;
  bodies.eurus = eurus;
  bodies.notus = notus;
  bodies.zephyrus = zephyrus;
  bodies.world.add(boreas, eurus, notus, zephyrus);

  /* Add position helper */

  const userPoint = new THREE.Mesh(
    new THREE.SphereGeometry(10, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff0000 }),
  );
  bodies.userPoint = userPoint;
  bodies.world.add(userPoint);

  /* Add Pointer */

  const cone = new THREE.Mesh(
    new THREE.ConeBufferGeometry(0.25, 1, 16),
    new THREE.MeshBasicMaterial({ color: 0x00ffff }),
  );
  cone.rotation.x = Math.PI / 2;

  const coneContainer = new THREE.Group();
  coneContainer.add(cone); // Save cone rotation
  camera.add(coneContainer); // Attach cone to camera
  coneContainer.position.z = -10; // Slide cone away from camera

  bodies.cone = cone;
  bodies.coneContainer = coneContainer;
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
  canvas.className = 'nv-canvas';

  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  createBodies();

  scene.add(new THREE.AxesHelper(100));
  scene.updateMatrixWorld();

  Observable.fromEvent(window, 'resize')
    .throttleTime(throttleMilliseconds)
    .subscribe(e => resizeHandler(e));

  /* Render */
  renderer.render(scene, camera);
};

/* Update */

const lastUpdate = {
  user: { latitude: 0, longitude: 0, altitude: 0 },
  ISS: { latitude: 0, longitude: 0, altitude: 0, state: 'OBSCURED' },
  rotation: { x: 0, y: 0, z: 0 },
};
let firstFrame = 0;
const update = (
  user = { latitude: 0, longitude: 0, altitude: 0 },
  ISS = { latitude: 0, longitude: 0, altitude: 0 },
) => {
  /* Necessary updates */

  const thisFrame = window.performance.now();

  camera.rotation.set(user.pitch * radian, -user.yaw * radian, 0, 'YXZ'); // set user camera

  // if (bodies.ISS) {
  //   bodies.ISS.rotation.x += 0.005;
  // }

  /* Conditional updates */

  // TODO: calculate ISS position on-screen (x, y) for cone

  // Skip world rotation if user hasn’t moved
  if (lastUpdate.user.longitude !== user.longitude || lastUpdate.user.latitude !== user.latitude) {
    firstFrame = window.performance.now();
    const rotation = radiansToNorthPole(user);
    bodies.world.rotation.set(rotation.x, rotation.y, rotation.z, 'YXZ');
    bodies.world.position.y = -latToRadius(user.latitude);

    lastUpdate.user.latitude = user.latitude;
    lastUpdate.rotation = rotation;

    /* Helpers */
    const boreasCoords = latLongToCartesian({ latitude: user.latitude + 0.1, longitude: user.longitude });
    const notusCoords = latLongToCartesian({ latitude: user.latitude - 0.1, longitude: user.longitude });
    const eurusCoords = latLongToCartesian({ latitude: user.latitude, longitude: user.longitude + 0.1 });
    const zephyrusCoords = latLongToCartesian({ latitude: user.latitude, longitude: user.longitude - 0.1 });

    bodies.boreas.position.set(boreasCoords.x, boreasCoords.y, boreasCoords.z);
    bodies.boreas.rotation.set(-rotation.x, -rotation.y, -rotation.z, 'YXZ');
    bodies.notus.position.set(notusCoords.x, notusCoords.y, notusCoords.z);
    bodies.notus.rotation.set(-rotation.x, -rotation.y, -rotation.z, 'YXZ');
    bodies.eurus.position.set(eurusCoords.x, eurusCoords.y, eurusCoords.z);
    bodies.eurus.rotation.set(-rotation.x, -rotation.y, -rotation.z, 'YXZ');
    bodies.zephyrus.position.set(zephyrusCoords.x, zephyrusCoords.y, zephyrusCoords.z);
    bodies.zephyrus.rotation.set(-rotation.x, -rotation.y, -rotation.z, 'YXZ');

    const userCoords = latLongToCartesian(user);
    // console.log(boreasCoords);
    bodies.userPoint.position.set(userCoords.x, userCoords.y, userCoords.z);
  }

  // Skip ISS repositioning if no new location
  if ((lastUpdate.ISS.longitude !== ISS.longitude) && bodies.ISSWithLights) {
    const coords = latLongToCartesian(ISS);
    bodies.ISSWithLights.position.set(coords.x, coords.y, coords.z);
    const ISSPos = new THREE.Vector3();
    ISSPos.setFromMatrixPosition(bodies.ISSWithLights.matrixWorld);
    lastUpdate.ISS = {
      ...lastUpdate.ISS,
      latitude: ISS.latitude, longitude: ISS.longitude,
      position: ISSPos,
    };

    // See if ISS is below horizon (or in day/night);
    const ray = new THREE.Raycaster(new THREE.Vector3(), lastUpdate.ISS.position);
    let state = 'OBSCURED';
    if (ray.intersectObject(bodies.horizon).length === 0) {
      state = ISS.visibility === 'daylight' ? 'DAY' : 'NIGHT';
    }
    lastUpdate.ISS.state = state;
    ISSGeometries.forEach((part) => {
      bodies.ISSParts[part.part].material = getISSMaterial(part.part, state);
    });
  }

  if (bodies.coneContainer && bodies.ISSWithLights) {
    const orientation = camera.getWorldDirection(lastUpdate.ISS.position);
    bodies.coneContainer.rotation.set(orientation.x, orientation.y, orientation.z, 'YXZ');
  }

  // const userPointPos = new THREE.Vector3();
  // userPointPos.setFromMatrixPosition(bodies.userPoint.matrixWorld);
  // console.log(userPointPos);

  renderer.render(scene, camera);
};

// console.log(latLongToCartesian({ latitude: 28.54364, longitude: -81.3768944 }), radiansToNorthPole({ latitude: 28.54364, longitude: -81.3768944 })); // Orlando
// console.log(latLongToCartesian({ latitude: 39.739236, longitude: -104.990251 }), radiansToNorthPole({ latitude: 39.739236, longitude: -104.990251 })); // Denver
// console.log(latLongToCartesian({ latitude: 48.856614, longitude: 2.35222 }), radiansToNorthPole({ latitude: 48.856614, longitude: 2.35222 })); // Paris
// console.log(latLongToCartesian({ latitude: 54.597285, longitude: -5.930120 }), radiansToNorthPole({ latitude: 54.597285, longitude: -5.930120 })); // Belfast
// console.log(latLongToCartesian({ latitude: -33.924869, longitude: 18.424055 }), radiansToNorthPole({ latitude: -33.924869, longitude: 18.424055 })); // Cape Town
// console.log(latLongToCartesian({ latitude: -36.848460, longitude: 174.763332 }), radiansToNorthPole({ latitude: -36.848460, longitude: 174.763332 })); // Auckland

export default { init, update };

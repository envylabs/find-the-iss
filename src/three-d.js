/**
 * 3D
 * Handles the THREE.js components
 * Units are in km
 */

import * as THREE from 'three';
import STLLoader from 'three/examples/js/loaders/STLLoader.js';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/throttleTime';

import {
  latLongToCartesian,
  meanRadiusOfEarth,
  radiansToNorthPole,
} from './utils/cartesianHelpers';

import ISSFlatBlue from '../models/ISS_FlatBlue.stl';
import ISSFlatDarkGray from '../models/ISS_FlatDkGray.stl';
import ISSFlatGray from '../models/ISS_FlatGray.stl';
import ISSFlatLightGray from '../models/ISS_FlatLightGray.stl';
import ISSFlatRed from '../models/ISS_FlatRed.stl';
import ISSShinyBlue from '../models/ISS_ShinyBlue.stl';
import ISSShinyGold from '../models/ISS_ShinyGold.stl';
import ISSShinySilver from '../models/ISS_ShinySilver.stl';

import px from '../textures/px.jpg';
import nx from '../textures/nx.jpg';
import py from '../textures/py.jpg';
import ny from '../textures/ny.jpg';
import pz from '../textures/pz.jpg';
import nz from '../textures/nz.jpg';

/* Settings */

const ISSScale = 10000;
const earthScale = 0.001; // Default 1

const ISSParts = [
  {
    geometry: ISSFlatBlue,
    material: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#3c86ff'),
      side: THREE.DoubleSide, // Necessary to render both sides
    }),
  },
  {
    geometry: ISSFlatDarkGray,
    material: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#fff'),
      side: THREE.DoubleSide,
    }),
  },
  {
    geometry: ISSFlatGray,
    material: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#fff'),
      side: THREE.DoubleSide,
    }),
  },
  {
    geometry: ISSFlatLightGray,
    material: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#fff'),
      side: THREE.DoubleSide,
    }),
  },
  {
    geometry: ISSFlatRed,
    material: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ff4e68'),
      side: THREE.DoubleSide,
    }),
  },
  {
    geometry: ISSShinyBlue,
    material: new THREE.MeshPhongMaterial({
      color: new THREE.Color('#3c86ff'),
      reflectivity: 1,
      shininess: 200,
      side: THREE.DoubleSide,
    }),
  },
  {
    geometry: ISSShinyGold,
    material: new THREE.MeshPhongMaterial({
      color: new THREE.Color('#bc9739'),
      reflectivity: 1,
      shininess: 200,
      side: THREE.DoubleSide,
    }),
  },
  {
    geometry: ISSShinySilver,
    material: new THREE.MeshPhongMaterial({
      color: new THREE.Color('#bedee9'),
      reflectivity: 1,
      shininess: 200,
      side: THREE.DoubleSide,
    }),
  },
];

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

const bodies = {};

/* Camera */

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100000);
camera.rotation.order = 'YXZ'; // prevent wonky rotations

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
  ISS.rotation.order = 'YXZ';
  ISS.scale.set(ISSScale, ISSScale, ISSScale);
  bodies.ISS = ISS;

  /* Add ISS Orbit (we’ll rotate this to put the ISS in perspective) */

  const orbit = new THREE.Group();
  const orbitSize = 1.25 * (meanRadiusOfEarth * 2); // size is arbitrary, as long as it contains the space station with the Earth at center
  const orbitBox = new THREE.Mesh(
    new THREE.BoxBufferGeometry(orbitSize, orbitSize, orbitSize),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
  );
  orbit.position.y = -meanRadiusOfEarth * earthScale; // Translate world down to user’s eye level
  orbit.scale.set(earthScale, earthScale, earthScale);
  orbit.rotation.order = 'YXZ';
  orbit.add(orbitBox);
  orbit.add(bodies.ISS);
  bodies.orbit = orbit;
  scene.add(orbit);

  /* Add ISS Parts */

  ISSParts.forEach((part) => {
    new THREE.STLLoader().load(part.geometry, (geometry) => {
      const ISSPart = new THREE.Mesh(geometry, part.material);
      bodies.ISS.add(ISSPart);
    });
  });

  /* Add Env Map */

  new THREE.CubeTextureLoader().load(skybox, (texture) => {
    ISSParts.forEach((material) => { material.envMap = texture; });
  });

  /* Add Lights */

  const ISSWithLights = new THREE.Group(); // Allows lights to move with station
  ISSWithLights.rotation.order = 'YXZ';
  ISSWithLights.scale.set(ISSScale, ISSScale, ISSScale);
  ISSWithLights.add(ISS);
  bodies.ISSWithLights = ISSWithLights;

  lights.forEach(({ light, position = null }) => {
    bodies.ISSWithLights.add(light);
    if (position) {
      light.position.set(position.x, position.y, position.z);
    }
  });

  const cone = new THREE.Mesh(
    new THREE.ConeBufferGeometry(0.25, 1, 16),
    new THREE.MeshBasicMaterial({ color: 0x00ffff })
  );

  camera.add(cone); // Attach cone to camera
  cone.position.z = -10; // Slide cone away from camera
  bodies.cone = cone;
};

/* Resize renderer */

const resizeHandler = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

/* First rotates around Y axis (longitude), then X axis (latitude) */

const rotate = (obj, axis, radians) => {
  const rotWorldMatrix = new THREE.Matrix4();
  rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
  rotWorldMatrix.multiplySelf(obj.matrix);
  obj.matrix = rotWorldMatrix;
  obj.rotation.getRotationFromMatrix(obj.matrix, obj.scale);
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

  Observable.fromEvent(window, 'resize')
    .throttleTime(throttleMilliseconds)
    .subscribe(e => resizeHandler(e));

  /* Render */
  renderer.render(scene, camera);
};

/* Update */

const update = (
  user = { latitude: 0, longitude: 0, altitude: 0 },
  ISS = { latitude: 0, longitude: 0, altitude: 0 }
) => {
  // camera.position.y = user.altitude;
  camera.rotation.set(user.pitch * radian, -user.yaw * radian, 0);
  const coords = latLongToCartesian(ISS);
  const rotation = radiansToNorthPole(user);

  if (bodies.ISSWithLights) {
    // TODO: calculate if ISS is visible

    // TODO: calculate ISS position on-screen (x, y) for cone
    bodies.ISSWithLights.position.set(coords.x, coords.y, coords.z);
    bodies.orbit.rotation.set(rotation.x, rotation.y, rotation.z);
    bodies.ISS.rotation.y += 0.005;

    console.log(coords.x, coords.y, coords.z);
  }

  // if (bodies.cone && bodies.ISS) {
  //   const to = camera.getWorldDirection(new THREE.Vector3(coords.x, coords.y, coords.z));
  //   bodies.cone.rotation.set(to.x, to.y, to.z);
  // }

  renderer.render(scene, camera);
};

export default { init, update };

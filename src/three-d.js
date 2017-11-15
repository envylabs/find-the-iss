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

import geoVector from './utils/geoVector';

import ISSModel from '../models/ISS.stl';

/* Options */

const defaultOptions = {
  FPS: 60,   // lock at 60FPS
  canvas: {
    el: document.body,
    className: 'nv-canvas',
  },
};

/* Constants */

const radian = Math.PI / 180;

/* Objects */

const bodies = {};
const lights = {};

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
  new THREE.STLLoader().load(ISSModel, (geometry) => {
    const ISS = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    ISS.rotation.x = Math.PI / 4;
    ISS.scale.set(500, 500, 500);
    scene.add(ISS);
    bodies.ISS = ISS;
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

/* Init */

const init = (options = {}) => {
  const mergedOptions = Object.assign(defaultOptions, options);
  const throttleMilliseconds = 1000 / mergedOptions.FPS;

  canvas.className = mergedOptions.canvas.className;

  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  mergedOptions.canvas.el.appendChild(renderer.domElement);

  createBodies();

  scene.add(new THREE.AxesHelper(100));

  Observable.fromEvent(window, 'resize')
    .throttleTime(throttleMilliseconds)
    .subscribe(e => resizeHandler(e));

  /* Render */
  renderer.render(scene, camera);
};

/* Update */

const update = (user, ISS) => {
  // TODO: calculate if ISS is visible
  const ISSCoords = geoVector(user, ISS);

  // camera.position.y = user.altitude;
  camera.rotation.x = user.pitch * radian;
  camera.rotation.y = -user.yaw * radian;

  if (bodies.ISS) {
    // TODO: calculate ISS position on-screen (x, y) for cone
    bodies.ISS.position.x = ISSCoords.x;
    bodies.ISS.position.y = ISSCoords.y;
    bodies.ISS.position.z = ISSCoords.z;
    bodies.ISS.rotation.y += 0.005;
  }

  if (bodies.cone && bodies.ISS) {
    const to = camera.getWorldDirection(new THREE.Vector3(ISSCoords.x, ISSCoords.y, ISSCoords.z));
    bodies.cone.rotation.x = to.x;
    bodies.cone.rotation.y = to.y;
    bodies.cone.rotation.z = to.z;
  }

  renderer.render(scene, camera);

  return ISSCoords;
};

export default { init, update };

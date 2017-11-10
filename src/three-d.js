/**
 * 3D
 * Handles the THREE.js components
 * Units are in meters
 */

import {
  BoxBufferGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/throttleTime';

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

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
camera.rotation.order = 'YXZ'; // prevent wonky rotations

/* Scene */

const canvas = document.createElement('canvas');
const renderer = new WebGLRenderer({
  alpha: true,
  antialias: true,
  canvas,
});
const scene = new Scene();

/* Create Bodies */

const createBodies = () => {
  bodies.northCube = new Mesh(
    new BoxBufferGeometry(0.5, 0.5, 0.5),
    new MeshBasicMaterial({ color: 0x0000ff })
  );
  bodies.northCube.position.z = -10;

  bodies.eastCube = new Mesh(
    new BoxBufferGeometry(0.5, 0.5, 0.5),
    new MeshBasicMaterial({ color: 0xff8000 })
  );
  bodies.eastCube.position.x = 10;

  bodies.westCube = new Mesh(
    new BoxBufferGeometry(0.5, 0.5, 0.5),
    new MeshBasicMaterial({ color: 0x00ff00 })
  );
  bodies.westCube.position.x = -10;

  bodies.southCube = new Mesh(
    new BoxBufferGeometry(0.5, 0.5, 0.5),
    new MeshBasicMaterial({ color: 0x00ffff })
  );
  bodies.southCube.position.z = 10;

  bodies.polarisCube = new Mesh(
    new BoxBufferGeometry(0.5, 0.5, 0.5),
    new MeshBasicMaterial({ color: 0xffffff })
  );
  bodies.polarisCube.position.y = 10;

  bodies.borealisCube = new Mesh(
    new BoxBufferGeometry(1, 1, 1),
    new MeshBasicMaterial({ color: 0x404040 })
  );
  bodies.borealisCube.position.y = -10;

  scene.add(bodies.northCube, bodies.eastCube, bodies.westCube, bodies.southCube, bodies.polarisCube, bodies.borealisCube);
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

  Observable.fromEvent(window, 'resize')
    .throttleTime(throttleMilliseconds)
    .subscribe(e => resizeHandler(e));

  /* Render */
  renderer.render(scene, camera);
};

/* Update */

const update = (userCamera) => {
  camera.position.y = userCamera.altitude;
  camera.rotation.x = (userCamera.pitch - 90) * radian;
  camera.rotation.y = -userCamera.yaw * radian;

  // camera.lookAt(bodies.northCube.position);

  renderer.render(scene, camera);
};

export default { init, update };

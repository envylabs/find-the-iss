/**
 * Find the ISS AR app
 */

import Stats from 'stats.js';

import UserCamera from './user-camera';
import UserCompass from './user-compass';
import ISS from './ISS';
import ThreeD from './three-d';

/* Options */

const options = {
  FPS: 60, // lock at 60FPS
};

/* Constants */

const interval = 1000 / options.FPS;

/* Render */

// const stats = new Stats();
// stats.showPanel(0);
// document.body.appendChild(stats.dom);

let lastFrame = window.performance.now();

const render = () => {
  // stats.begin();
  const thisFrame = window.performance.now();
  const delta = thisFrame - lastFrame;

  if (delta < interval) {  // Throttled to 60FPS
    // stats.end();
    return window.requestAnimationFrame(render);
  }

  lastFrame = thisFrame - (delta % interval);

  ThreeD.update(UserCompass.latest(), ISS.latest());

  // stats.end();

  window.requestAnimationFrame(render);
};

/* Init */

const build = () => {
  UserCamera.init(options);
  UserCompass.init(options);
  ThreeD.init(options);

  window.requestAnimationFrame(render);
};

build();

/**
 * Find the ISS AR app
 */

import UserCamera from './user-camera';
import UserCompass from './user-compass';
import Debug from './debug';
import ThreeD from './three-d';

/* Options */

const options = {
  FPS: 60, // lock at 60FPS
};

/* Constants */

const interval = 1000 / options.FPS;

/* Render */

let lastFrame = window.performance.now();

const render = () => {
  const thisFrame = window.performance.now();
  const delta = thisFrame - lastFrame;

  if (delta < interval) {  // Throttled to 60FPS
    return window.requestAnimationFrame(render);
  }

  lastFrame = thisFrame - (delta % interval);

  ThreeD.update(UserCompass.latest());
  Debug.update(UserCompass.latest());

  window.requestAnimationFrame(render);
};

/* Init */

const build = () => {
  UserCamera.init(options);
  UserCompass.init(options);
  Debug.init();
  ThreeD.init(options);

  window.requestAnimationFrame(render);
};

build();

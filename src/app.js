/**
 * Find the ISS AR app
 */

import Video from './video';
import Compass from './compass';
import Debug from './debug';

const render = () => {
  Debug.update(Compass.latest());

  window.requestAnimationFrame(render);
};

const build = () => {
  Video.init();
  Compass.init();
  Debug.init();

  window.requestAnimationFrame(render);
};

build();

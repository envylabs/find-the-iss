/**
 * Debug
 * Display relevant stats on-screen
 */

const defaultConfig = {
  el: document.body,
  className: 'stats',
  id: 'stats',
};

/* Add Debug element to DOM */

const display = document.createElement('div');

const buildElement = (config) => {
  display.className = config.className;
  display.id = config.id;

  config.el.appendChild(display);
};

/* Update stats */

let lastFrame = window.performance.now(); // Keep last frame in memory

const update = (stats) => {
  const thisFrame = window.performance.now();

  display.innerHTML = `DEBUG

   latitude: ${stats.latitude}
  longitude: ${stats.longitude}
----------------------------------
      pitch: ${stats.pitch}
        yaw: ${stats.yaw}
----------------------------------
          x: ${stats.ISS.x}
          y: ${stats.ISS.y}
          z: ${stats.ISS.z}
----------------------------------
        FPS: ${1000 / (thisFrame - lastFrame)}
`;

  lastFrame = thisFrame;
};

const init = (config = {}) => {
  const mergedConfig = Object.assign(defaultConfig, config);

  buildElement(mergedConfig);
};

export default { init, update };

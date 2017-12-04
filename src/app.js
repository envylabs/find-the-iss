/**
 * Find the ISS AR app
 */

import Stats from 'stats.js';
import { h, render as PreactRender } from 'preact';
import { Provider } from 'preact-redux';
import { createStore } from 'redux';

import AppState from 'components/reducer';
import UserCamera from 'user/camera';
import UserCompass from 'user/compass';
import ISS from 'ISS';
import App from 'components/App';
import ThreeD from 'three-d';

let store = createStore(AppState);

/* Constants */

const interval = 1000 / 60;

/* Render */

// const stats = new Stats();
// stats.showPanel(0);
// document.body.appendChild(stats.dom);

let lastFrame = window.performance.now();

const render = () => {
  // stats.begin();
  const thisFrame = window.performance.now();
  const delta = thisFrame - lastFrame;

  if (delta < interval) {
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
  UserCamera.init();
  UserCompass.init();
  ThreeD.init();

  PreactRender(
    <Provider store={store}>
      <App
        user={UserCompass.latest()}
        ISS={ISS.latest()}
      />
    </Provider>,
    document.getElementById('app-root'),
  )

  window.requestAnimationFrame(render);
};

build();

if (module.hot) { // Enable React Dev Tools
  require('preact/debug')
}

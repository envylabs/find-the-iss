/**
 * Find the ISS AR app
 */

// import Stats from 'stats.js';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {
  applyMiddleware,
  compose,
  createStore,
} from 'redux';
import createSagaMiddleware from 'redux-saga';

import { initialState, rootReducer } from 'components/reducer';
import { rootSaga } from 'components/sagas';
import UserCamera from 'user/camera';
import UserCompass from 'user/compass';
import ISS from 'ISS';
import App from 'components/App';
import ThreeD from 'three-d';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(sagaMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f,
  )
);

sagaMiddleware.run(rootSaga);

/* Constants */

const interval = 1000 / 60;

/* Render */

// const stats = new Stats();
// stats.showPanel(0);
// document.body.appendChild(stats.dom);

let lastFrame = window.performance.now();
let userPosition = UserCompass.latest();
let ISSPosition = ISS.latest();

const updatePosition = () => {
  userPosition = UserCompass.latest();
  ISSPosition = ISS.latest();
  window.userPosition = userPosition;
  window.ISSPosition = ISSPosition;
};

const render = () => {
  // stats.begin();
  const thisFrame = window.performance.now();
  const delta = thisFrame - lastFrame;

  if (delta < interval) {
    // stats.end();
    return window.requestAnimationFrame(render);
  }

  lastFrame = thisFrame - (delta % interval);
  updatePosition();
  ThreeD.update(userPosition, ISSPosition);
  // stats.end();
  window.requestAnimationFrame(render);
};

/* Init */

const build = () => {
  UserCamera.init();
  UserCompass.init();
  ThreeD.init();

  ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('app-root'));

  window.requestAnimationFrame(render);
};

build();

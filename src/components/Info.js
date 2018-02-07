import React from 'react';
import { connect } from 'react-redux';

import { closeInfo, openInfo } from 'components/actions';
import Close from 'components/Close';
import Question from 'components/Question';
import Stars from 'components/Stars';
import ISS from '../assets/ISS.png';

const Info = ({ dispatch, ...props }) => (
  <div className="info">
    <button className="info-button info-button--open" onClick={() => dispatch(openInfo())}>
      <Question />
    </button>
    {props.isInfoOpen && (
      <div>
        <div className="info-fullscreen">
          <Stars />
          <button className="info-button info-button--close" onClick={() => dispatch(closeInfo())}>
            <Close />
          </button>
          <div className="info-content">
            <img src={ISS} alt="About This Project" className="info-image" />
            <h2 className="info-heading">
              <span>About This Project</span>
            </h2>
            <p>
              Find the ISS is a WebAR experiment that utilizes the{' '}
              <a href="http://wheretheiss.at/" target="_blank" rel="noopener noreferrer">
                Where The ISS At?
              </a>{' '}
              API to track the International Space Station’s position.{' '}
              <a href="https://github.com/mrdoob/three.js/" target="_blank" rel="noopener noreferrer">
                Three.js
              </a>{' '}
              and WebRTC are included, with inspiration drawn from{' '}
              <a href="https://github.com/jeromeetienne/ar.js" target="_blank" rel="noopener noreferrer">
                AR.js
              </a>.
            </p>
            <p>
              Made by{' '}
              <a href="https://envylabs.com" target="_blank" rel="noopener noreferrer">
                Envy Labs
              </a>.
            </p>
            <p>Browser support:</p>
            <ul>
              <li>iOS (11+)</li>
              <li>Chrome Android</li>
            </ul>
          </div>
        </div>
      </div>
    )}
  </div>
);

export default connect(state => ({ isInfoOpen: state.isInfoOpen }), dispatch => ({ dispatch }))(Info);

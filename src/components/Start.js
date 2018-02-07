import React from 'react';
import { connect } from 'react-redux';
import StartGlobe from 'components/StartGlobe';
import Stars from 'components/Stars';
import { closeStart } from 'components/actions';

import ISS from '../assets/ISS.png';

const Start = ({ dispatch, ...props }) => (
  <div
    className="start-fullscreen"
    style={{
      opacity: props.isStartOpen ? '1' : '0',
      transition: 'opacity 500ms 250ms linear, visibility 0ms 500ms',
      visibility: props.isStartOpen ? 'visible' : 'hidden'
    }}
  >
    <Stars />
    <img
      className="start-iss"
      src={ISS}
      style={{
        opacity: props.isStartOpen ? '1' : '0',
        transition: 'opacity 250ms linear, transform 500ms linear',
        transform: props.isStartOpen ? '' : 'translate(-50%, -200%)'
      }}
    />
    <div
      className="start-inner"
      style={{
        opacity: props.isStartOpen ? '1' : '0',
        transition: 'opacity 250ms linear, transform 500ms linear',
        transform: props.isStartOpen ? '' : 'translateY(-10%)'
      }}
    >
      <div className="start-globe">
        <StartGlobe small={true} />
      </div>
      <div className="start-body">
        <h1>Find the ISS</h1>
        <p>
          Find the ISS is a WebAR experiment that utilizes the{' '}
          <a href="http://wheretheiss.at/" target="_blank" rel="noopener noreferrer">
            Where The ISS At?
          </a>{' '}
          API to track the International Space Station’s position.
        </p>
        <p>
          Made by{' '}
          <a href="https://envylabs.com" target="_blank" rel="noopener noreferrer">
            Envy Labs
          </a>.
        </p>
        <p>Browsers supported:</p>
        <ul>
          <li>iOS (11+)</li>
          <li>Chrome Android</li>
        </ul>
        <div>
          <button
            className="start-button"
            onClick={() => dispatch(closeStart())}
          >
            Launch App
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default connect(state => ({ isStartOpen: state.isStartOpen }), dispatch => ({ dispatch }))(Start);

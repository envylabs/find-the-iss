import React from 'react';
import { connect } from 'react-redux';
import StartGlobe from 'components/StartGlobe';
import { closeStart } from 'components/actions';

const Start = ({ dispatch, ...props }) => (
  <div
    className="start-fullscreen"
    style={{
      opacity: props.isStartOpen ? '1' : '0',
      transition: 'opacity 500ms 250ms linear, visibility 0ms 500ms',
      visibility: props.isStartOpen ? 'visible' : 'hidden'
    }}
  >
    <img
      className="start-iss"
      src="./assets/ISS.png"
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
      <StartGlobe small={true} />
      <div className="start-body">
        <h2 className="start-heading">Find the ISS</h2>
        <p>
          A WebAR experiment that relies on the open source{' '}
          <a href="http://wheretheiss.at/" target="_blank" rel="noopener noreferrer">
            Where The ISS At?
          </a>{' '}
          API to track the ISS.
        </p>
        <p>
          Made by{' '}
          <a href="https://envylabs.com" target="_blank" rel="noopener noreferrer">
            Envy Labs
          </a>.
        </p>
        <p>Browsers supported:</p>
        <ul>
          <li>iOS 11</li>
          <li>Chrome Android</li>
        </ul>
      </div>
    </div>
    <button
      className="start-button"
      onClick={() => dispatch(closeStart())}
      style={{
        opacity: props.isStartOpen ? '1' : '0',
        transition: 'opacity 250ms linear, transform 500ms linear',
        transform: props.isStartOpen ? '' : 'translateY(50%)'
      }}
    >
      Launch App
    </button>
  </div>
);

export default connect(state => ({ isStartOpen: state.isStartOpen }), dispatch => ({ dispatch }))(Start);

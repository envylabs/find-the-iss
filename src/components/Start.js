import React from 'react';
import { connect } from 'react-redux';
import Globe from 'components/Globe';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { closeStart } from 'components/actions';

const Fade = ({ children, ...props }) => (
  <CSSTransition {...props} timeout={5000} classNames="fade">
    {children}
  </CSSTransition>
);

const Start = ({ dispatch, ...props }) => {
  if (props.isStartOpen) {
    return (
      <div className="start-fullscreen">
        <div className="start-inner">
          <img className="start-iss" src="./assets/ISS.png" />
          <TransitionGroup>
            <Fade>
              <h2 className="start-heading">Find the ISS</h2>
            </Fade>
          </TransitionGroup>
          <Globe small={true} />
          <div className="start-body">
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
        <button className="start-button" onClick={() => dispatch(closeStart())}>
          Launch App
        </button>
      </div>
    );
  }
  return null;
};

export default connect(state => ({ isStartOpen: state.isStartOpen }), dispatch => ({ dispatch }))(Start);

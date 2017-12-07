import React from 'react';
import { connect } from 'react-redux';

import {
  closeInfo,
  openInfo,
} from './actions';

import Close from './Close';
import Question from './Question';

const Info = (props) => (
  <div className="info">
    <button className="info-button info-open" onClick={props.openInfo}>
      <Question />
    </button>
    {props.isInfoOpen &&
      <div>
        <div className="info-fullscreen">
          <button className="info-button" onClick={props.closeInfo}>
            <Close />
          </button>
          <h2 className="info-heading">About This Project</h2>
          <div className="info-body">
            <p>
              Cras justo odio, dapibus ac facilisis in, egestas eget quam. Nullam
              id dolor id nibh ultricies vehicula ut id elit. Lorem ipsum dolor sit
              amet, consectetur adipiscing elit. Curabitur blandit tempus
              porttitor.
            </p>
            <p>
              Cras justo odio, dapibus ac facilisis in, egestas eget quam. Nullam
              id dolor id nibh ultricies vehicula ut id elit. Lorem ipsum dolor
              sit amet, consectetur adipiscing elit. Curabitur blandit tempus
              porttitor.
            </p>
            <p>
              Built by Envy Labs with help from...
            </p>
          </div>
        </div>
      </div>
    }
  </div>
);

const mapStateToProps = state => ({
  isInfoOpen: state.isInfoOpen,
});

const mapDispatchToProps = dispatch => ({
  closeInfo: () => closeInfo(),
  openInfo: () => openInfo(),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Info);

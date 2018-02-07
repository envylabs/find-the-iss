import React from 'react';
import { connect } from 'react-redux';

import { closeTracker, openTracker } from 'components/actions';
import Close from 'components/Close';
import Globe from 'components/Globe';
import Stars from 'components/Stars';

const Tracker = ({ dispatch, ...props }) => (
  <div>
    <div className="tracker">
      <div className="tracker-toggle">
        {!props.isTrackerOpen && (
          <button className="tracker-button tracker-button--globe" onClick={() => dispatch(openTracker())}>
            <Globe small />
          </button>
        )}
        {props.isTrackerOpen && (
          <button className="tracker-button tracker-button--close" onClick={() => dispatch(closeTracker())}>
            <Close />
          </button>
        )}
      </div>
      <div className="tracker-location">
        <h2>
          <span>Current Location</span>
        </h2>
        <div className="tracker-readout">
          <span>{props.ISSOver}</span>
          <span className="tracker-readout-distance">{`${props.ISSDistance} km`}</span>
        </div>
      </div>
    </div>
    {props.isTrackerOpen && (
      <div className="tracker-fullscreen">
        <Stars />
        <Globe />
      </div>
    )}
  </div>
);

const mapStateToProps = state => ({
  ISSDistance: state.ISSDistance,
  ISSOver: state.ISSOver,
  isTrackerOpen: state.isTrackerOpen
});

export default connect(mapStateToProps, dispatch => ({ dispatch }))(Tracker);

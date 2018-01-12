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
          <button className="tracker-button" onClick={() => dispatch(openTracker())}>
            <Globe small />
          </button>
        )}
        {props.isTrackerOpen && (
          <button className="tracker-button" onClick={() => dispatch(closeTracker())}>
            <Close width="32" />
          </button>
        )}
      </div>
      <div className="tracker-location">
        <h2 className="tracker-heading">
          <span>Current Location</span>
        </h2>
        <div className="tracker-readout">
          <span className="tracker-region">{props.ISSOver}</span>&nbsp;
          <span className="tracker-distance">// {`${props.ISSDistance} km`}</span>
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

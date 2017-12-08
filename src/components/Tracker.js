import React from 'react';
import { connect } from 'react-redux';

import { closeTracker, openTracker } from 'components/actions';
import Close from 'components/Close';
import Globe from 'components/Globe';

const Tracker = ({ dispatch, ...props }) => (
  <div>
    <div className="tracker">
      <div className="tracker-toggle">
        {!props.isTrackerOpen &&
          <button className="tracker-button" onClick={() => dispatch(openTracker())}>
            <Globe small />
          </button>
        }
        {props.isTrackerOpen &&
          <button className="tracker-button" onClick={() => dispatch(closeTracker())}>
            <Close width="32" />
          </button>
        }
      </div>
      <div className="tracker-location">
        <div className="tracker-heading">
          Current Location
        </div>
        <div className="tracker-readout">
          <div className="tracker-region">{props.ISSOver}</div>
          <div className="tracker-distance">{`${props.ISSDistance} km`}</div>
        </div>
      </div>
    </div>
    {props.isTrackerOpen &&
      <div className="tracker-fullscreen">
        <Globe />
      </div>
    }
  </div>
);

const mapStateToProps = state => ({
  ISSDistance: state.ISSDistance,
  ISSOver: state.ISSOver,
  isTrackerOpen: state.isTrackerOpen,
});

export default connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
)(Tracker);

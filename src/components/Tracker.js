import React from 'react';
import { connect } from 'react-redux';

import {
  CLOSE_TRACKER,
  OPEN_TRACKER,
} from './actions';

import { haversine } from 'utils/geodesy';
import geocode from 'utils/geocode';

import Close from './Close';
import Globe from './Globe';
import ISS from 'assets/ISS.png';

const Tracker = props => {
  const horizontal = (props.ISSlongitude / 180 / 3) - 50;
  const vertical = Math.sin(props.ISSlatitude * Math.PI / 180) * 100;

  return (
    <div>
      <div className="tracker">
        <div className="tracker-toggle">
          {!props.isTrackerOpen &&
            <button className="tracker-button" onClick={props.openTracker}>
              <Globe
                horizontal={horizontal}
                vertical={vertical}
              />
            </button>
          }
          {props.isTrackerOpen &&
            <button className="tracker-button" onClick={props.closeTracker}>
              <Close width="32" />
            </button>
          }
        </div>
        <div className="tracker-location">
          <div className="tracker-heading">
            Current Location
          </div>
          <div className="tracker-readout">
            <div className="tracker-region">{props.location}</div>
            <div className="tracker-distance">{props.distance}</div>
          </div>
        </div>
      </div>
      {props.isTrackerOpen &&
        <div className="tracker-fullscreen">
          <img
            alt="International Space Station"
            className="tracker-iss"
            src={ISS}
          />
          <Globe
            horizontal={horizontal}
            vertical={vertical}
          />
        </div>
      }
    </div>
  );
};

const mapStateToProps = state => ({
  distance: state.ISSDistance,
  ISSLatitude: state.ISSLatitude,
  ISSLongitude: state.ISSLongitude,
  ISSOver: state.ISSOver,
  isTrackerOpen: state.isTrackerOpen,
  userLatitude: state.userLatitude,
  userLongitude: state.userLongitude,
});

const mapDispatchToProps = dispatch => ({
  closeTracker: () => dispatch({ type: CLOSE_TRACKER }),
  openTracker: () => dispatch({ type: OPEN_TRACKER }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Tracker);

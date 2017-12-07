import React from 'react';
import { connect } from 'react-redux';

import {
  closeTracker,
  openTracker,
} from './actions';

import { haversine } from 'utils/geodesy';
import geocode from 'utils/geocode';

import Close from './Close';
import Globe from './Globe';
import ISS from 'assets/ISS.png';

const Tracker = props => (
  <div>
    <div className="tracker">
      <div className="tracker-toggle">
        {!props.isTrackerOpen &&
          <button className="tracker-button" onClick={props.openTracker}>
            <Globe
              x={props.mapTranslation.x}
              y={props.mapTranslation.y}
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
          <div className="tracker-region">{props.ISSOver}</div>
          <div className="tracker-distance">{`${props.ISSDistance} km`}</div>
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
          x={props.mapTranslation.x}
          y={props.mapTranslation.y}
        />
      </div>
    }
  </div>
);

const mapStateToProps = state => ({
  ISSDistance: state.ISSDistance,
  ISSOver: state.ISSOver,
  isTrackerOpen: state.isTrackerOpen,
  mapTranslation: state.mapTranslation,
});

const mapDispatchToProps = dispatch => ({
  closeTracker: () => closeTracker(),
  openTracker: () => openTracker(),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Tracker);

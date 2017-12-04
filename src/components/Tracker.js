import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import {
  CLOSE_TRACKER,
  OPEN_TRACKER,
} from './actions';

import Close from './Close';
import Globe from './Globe';

const Tracker = (props, state) => {
  return (
    <div className="tracker">
      <div className="tracker-toggle">
        {!state.isTrackerOpen &&
          <button className="tracker-map" onClick={() => props.openTracker()}>
            <Globe
              horizontal={props.horizontal}
              vertical={props.vertical}
            />
          </button>
        }
        {state.isTrackerOpen &&
          <button onClick={() => props.closeTracker()}>
            <Close width="32" />
          </button>
        }
      </div>
      <div className="tracker-location">
        <div className="tracker-heading">
          Current Location
        </div>
        <div className="tracker-readout">
          <div className="tracker-region">Instabul_Turkey</div>
          <div className="tracker-distance">422.23 km</div>
        </div>
      </div>
      {state.isTrackerOpen &&
        <div className="tracker-fullscreen">
          <Globe
            horizontal={props.horizontal}
            vertical={props.vertical}
          />
        </div>
      }
    </div>
  );
};

const mapStateToProps = state => ({
  isTrackerOpen: state.isTrackerOpen,
});

const mapDispatchToProps = dispatch => ({
  closeTracker: () => dispatch({ type: CLOSE_TRACKER }),
  openTracker: () => dispatch({ type: OPEN_TRACKER }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Tracker);

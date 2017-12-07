import React from 'react';
import { connect } from 'react-redux';

const Globe = ({ small, x = -50, y }) => (
  <div className={`globe${small ? ' globe--small' : ''}`}>
    {small ||
      <div
        className="globe-trace"
        style={{ transform: `scaleY(${1 + y/50})` }}
      />
    }
    <div className="globe-crop">
      <div
        className="globe-map"
        style={{ transform: `translateX(${x}%)` }}
      />
      <div
        className="globe-markercontainer"
        style={{ transform: `translateY(${y}%)` }}
      >
        <div className="globe-marker" />
      </div>
    </div>
  </div>
);

const mapStateToProps = state => ({
  x: state.mapTranslation.x,
  y: state.mapTranslation.y,
});

export default connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
)(Globe);

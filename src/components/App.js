import React from 'react';
import { connect } from 'react-redux';

import {
  UPDATE_COORDS,
  UPDATE_ISS_OVER,
} from './actions';
import geocode from 'utils/geocode';

import Tracker from './Tracker';
import Info from './Info';

import styles from 'styles.css';

class App extends React.Component {
  willReceiveProps(nextProps) {
    if (nextProps.ISSLongitude === this.props.ISSLongitude) return false;

    geocode({
      latitude: nextProps.ISSLatitude,
      longitude: nextProps.ISSLongitude,
    }).then(name =>
      this.props.updateISSOver(name)
    );
  }

  render() {
    return (
      <div className="app">
        <Info />
        <Tracker />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  updateCoords: ({ latitude, longitude }) =>
    dispatch({
      type: UPDATE_COORDS,
      latitude,
      longitude,
    }),
  updateISSOver: (name) =>
    dispatch({
      type: UPDATE_ISS_OVER,
      name,
    }),
});

export default connect(
  state => state,
  mapDispatchToProps,
)(App);

import React from 'react';
import { connect } from 'react-redux';

import {
  updateUserCoords,
  updateISSCoords,
} from './actions';

import Tracker from './Tracker';
import Info from './Info';

import styles from 'styles.css';

class App extends React.Component {
  componentDidMount() {
    if (typeof window === 'undefined') return false;

    this.update = setInterval(() => {
      this.props.updateISSCoords({
        latitude: window.ISSPosition.latitude,
        longitude: window.ISSPosition.longitude,
      });

      this.props.updateUserCoords({
        latitude: window.userPosition.latitude,
        longitude: window.userPosition.longitude,
      });
    }, 5000);
  }

  componentWillUnmount() {
    this.update = null;
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
  updateISSCoords,
  updateUserCoords,
});

export default connect(
  state => state,
  mapDispatchToProps,
)(App);

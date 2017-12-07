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
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    if (typeof window === 'undefined') return false;
    this.updateCycle = setInterval(this.update, 5000);
  }

  update() {
    this.props.dispatch(updateUserCoords({
      latitude: window.userPosition.latitude,
      longitude: window.userPosition.longitude,
    }));

    this.props.dispatch(updateISSCoords({
      latitude: window.ISSPosition.latitude,
      longitude: window.ISSPosition.longitude,
    }));
  }

  componentWillUnmount() {
    this.updateCycle = null;
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

export default connect(
  state => ({ state }),
  dispatch => ({ dispatch }),
)(App);

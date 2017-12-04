import { h, Component } from 'preact';

import { haversine } from '../utils/geodesy';

import Tracker from './Tracker';
import Info from './Info';

import styles from 'styles.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.getISSHorizontal = this.getISSHorizontal.bind(this);
    this.getISSVertical = this.getISSVertical.bind(this);
  }

  componentWillUpdate(nextProps) {
    return nextProps.user.latitude !== this.props.user.latitude
      || nextProps.user.longitude !== this.props.user.longitude
      || nextProps.ISS.latitude !== this.props.ISS.latitude
      || nextProps.ISS.longitude !== this.props.ISS.longitude;
  }

  getDistance() {
    return haversine(this.props.user, this.props.ISS);
  }

  getISSHorizontal() {
    return (this.props.ISS.longitude / 180 / 3) - 50;
  }

  getISSVertical() {
    return Math.sin(this.props.ISS.latitude * Math.PI / 180) * 100;
  }

  render() {
    return (
      <div className="app">
        <Info />
        <Tracker
          horizontal={this.getISSHorizontal()}
          vertical={this.getISSVertical()}
        />
      </div>
    );
  }
}

export default App;

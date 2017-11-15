/**
 * User Compass
 * Get user’s location and looking direction
 */

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/throttleTime';

const defaultOptions = {
  FPS: 60,   // lock at 60FPS
};
const stats = {};

/* Device orientation */

const deviceOrientationHandler = (e) => {
  stats.pitch = e.beta - 90; // tilt (0 = facing horizon; -90 = facing ground; 90 = facing sky)
  stats.yaw = e.webkitCompassHeading; // Compass direction (0/360 = North; 180 = South;)
};

const updateCoords = (position) => {
  stats.altitude = position.coords.altitude; // in meters 🎉
  stats.latitude = position.coords.latitude;
  stats.longitude = position.coords.longitude;
};

const geoLocate = () => {
  window.navigator.geolocation
    .watchPosition(updateCoords, error => console.log(error), ({
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 30000,
    }));
};

const init = (options = {}) => {
  const mergedOptions = Object.assign(defaultOptions, options);
  const throttleMilliseconds = 1000 / mergedOptions.FPS;

  Observable
    .fromEvent(window, 'deviceorientation')
    .throttleTime(throttleMilliseconds)
    .subscribe(e => deviceOrientationHandler(e));

  geoLocate();
};

const latest = () => stats;

export default { init, latest };

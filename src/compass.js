/**
 * Compass
 * Get user’s location and looking direction
 */

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/throttleTime';

const throttleFPS = 100; // throttled to 100FPS;
const throttleMilliseconds = Math.floor(1000 / throttleFPS);
const stats = {};

/* Device orientation */

const deviceOrientationHandler = (e) => {
  stats.pitch = e.beta; // tilt (0 = facing ground; 90 = facing horizon; 180 = facing sky)
  stats.yaw = e.webkitCompassHeading; // Compass direction (0/360 = North; 180 = South;)
};

const updateCoords = (position) => {
  stats.latitude = position.coords.latitude;
  stats.longitude = position.coords.longitude;
};

const geoLocate = () => {
  window.navigator.geolocation
    .watchPosition(updateCoords, error => console.log(error));
};

const init = () => {
  Observable
    .fromEvent(window, 'deviceorientation')
    .throttleTime(throttleMilliseconds)
    .subscribe(e => deviceOrientationHandler(e));

  geoLocate();
};

const latest = () => stats;

export default { init, latest };

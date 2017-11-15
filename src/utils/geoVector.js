/**
 * Geo-vector
 * Converts 2 Earth coordinates to cartesian space
 */

import * as THREE from 'three';

/* Constants */

const largestRadiusOfEarth = 6378.137;
const flatteningOfEarth = 1 / 0.298257223563;
const radian = Math.PI / 180;

/* Convert to Cartesian (THREE.js orientation) */

const latLongToCartesian = ({ latitude, longitude, altitude }) => {
  // toCartesian() from https://github.com/chrisveness/geodesy/

  const φ = latitude * radian;
  const λ = longitude * radian;
  const h = altitude;
  const a = largestRadiusOfEarth;
  const f = flatteningOfEarth;

  const sinφ = Math.sin(φ);
  const cosφ = Math.cos(φ);
  const sinλ = Math.sin(λ);
  const cosλ = Math.cos(λ);

  const eSq = (2 * f) - (f * f);                     // 1st eccentricity squared ≡ (a²-b²)/a²
  const ν = a / Math.sqrt(1 - (eSq * sinφ * sinφ));  // radius of curvature in prime vertical

  const x = (ν + h) * cosφ * sinλ;         // “Y”
  const y = ((ν * (1 - eSq)) + h) * sinφ;  // “Z”
  const z = (ν + h) * cosφ * cosλ;         // “X”

  return { x, y, z };
};

/* Return necessary axis rotations, in radians (THREE.js orientation) */

const getRotation = ({ latitude, longitude }) => {
  const x = (latitude - 90) * radian;   // x axis, or (0, -90°) to (0, 90°)
  const y = longitude * radian;         // y axis, or Earth’s axis

  return { x, y, z: 0 };
};

/* Rotate About Point */
const rotateAboutPoint = (obj, point, axis, theta, pointIsWorld = false) => {
  // https://stackoverflow.com/questions/42812861/three-js-pivot-point/42866733#42866733

  if (pointIsWorld) {
    obj.parent.localToWorld(obj.position); // compensate for world coordinate
  }

  obj.position.sub(point); // remove the offset
  obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
  obj.position.add(point); // re-add the offset

  if (pointIsWorld) {
    obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
  }

  obj.rotateOnAxis(axis, theta); // rotate the OBJECT
};

/* Main */

const geoVector = (origin, compare) => {
  const satellite = latLongToCartesian(compare);

  // TODO: replace this with rotateAboutPoint();
  return satellite;
};

export default geoVector;

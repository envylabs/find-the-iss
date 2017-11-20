/**
 * Geo-vector
 * Converts 2 Earth coordinates to cartesian space
 */

import * as THREE from 'three';

/* Constants */

const largestRadiusOfEarth = 6378.137;
const meanRadiusOfEarth = 6371.008;
const flatteningOfEarth = 1 / 0.298257223563;
const radian = Math.PI / 180;

/* Convert to Cartesian (THREE.js orientation) */

const latLongToCartesian = ({ latitude, longitude, altitude = 0 }) => {
  // http://www.smartjava.org/content/render-open-data-3d-world-globe-threejs

  const phi = latitude * radian;
  const theta = (longitude - 180) * radian;
  const orbitalRadius = meanRadiusOfEarth + altitude;

  const x = -orbitalRadius * Math.cos(phi) * Math.cos(theta);
  const y = orbitalRadius * Math.sin(phi);
  const z = orbitalRadius * Math.cos(phi) * Math.sin(theta);

  // // https://www.movable-type.co.uk/scripts/latlong.html
  //
  // const φ = latitude * radian;
  // const λ = longitude * radian;
  // const h = altitude; // height
  // const a = largestRadiusOfEarth;
  // const f = flatteningOfEarth;

  // const sinφ = Math.sin(φ);
  // const cosφ = Math.cos(φ);
  // const sinλ = Math.sin(λ);
  // const cosλ = Math.cos(λ);

  // const eSq = 2*f - f*f;                      // 1st eccentricity squared ≡ (a²-b²)/a²
  // const ν = a / Math.sqrt(1 - eSq*sinφ*sinφ); // radius of curvature in prime vertical

  // const x2 = (ν + h) * cosφ * cosλ;
  // const y2 = (ν + h) * cosφ * sinλ;
  // const z2 = (ν * (1 - eSq) + h) * sinφ;

  // console.log(z, z2);

  return { x, y, z };
};

/* Return necessary axis rotations, in radians (THREE.js orientation) */

const radiansToNorthPole = ({ latitude, longitude }) => {
  const x = (latitude - 90) * radian;   // x axis, or (0, -90°) to (0, 90°)
  const y = -longitude * radian;        // y axis, or Earth’s axis

  return { x, y, z: 0 };
};

export {
  latLongToCartesian,
  meanRadiusOfEarth,
  radiansToNorthPole,
};

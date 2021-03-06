/**
 * Geo-vector
 * Converts 2 Earth coordinates to cartesian space
 */

/* Constants */

const meanRadiusOfEarth = 6371.008;
const radian = Math.PI / 180;
const WGS84flattening = 1 / 298.257223563;
const WGS84semimajor = 6378.137;
const WGS84semiminor = 6356.7523142;

/* Convert to Cartesian (THREE.js orientation) */

const latLongToCartesian = ({ latitude, longitude, altitude = 0 }) => {
  // https://www.movable-type.co.uk/scripts/latlong.html

  // const φ = latitude * radian;
  // const λ = longitude * radian;
  // const h = altitude + meanRadiusOfEarth; // convert alt to m
  // const a = WGS84semimajor;
  // const f = WGS84flattening;

  // const sinφ = Math.sin(φ);
  // const cosφ = Math.cos(φ);
  // const sinλ = Math.sin(λ);
  // const cosλ = Math.cos(λ);

  // const eSq = (2 * f) - (f * f);                    // 1st eccentricity squared ≡ (a²-b²)/a²
  // const ν = a / Math.sqrt(1 - (eSq * sinφ * sinφ)); // radius of curvature in prime vertical

  // const x = (ν + h) * cosφ * cosλ; // lat/lon (0, 0) is 1; (0, 180) is -1
  // const y = (ν + h) * cosφ * sinλ; // lat/lon (0, 90) is 1; (0, -90) is -1;
  // const z = ((ν * (1 - eSq)) + h) * sinφ; // lat/lon (90, 0) is 1; (-90, 0) is -1

  // return { x, y: z, z: -y }; // Swap Y and Z for THREE.js; invert Z axis for right-handed system

  var cosLat = Math.cos(latitude * Math.PI / 180.0);
  var sinLat = Math.sin(latitude * Math.PI / 180.0);
  var cosLon = Math.cos(longitude * Math.PI / 180.0);
  var sinLon = Math.sin(longitude * Math.PI / 180.0);
  var rad = meanRadiusOfEarth;
  var f = 1.0 / 298.257224;
  var C = 1.0 / Math.sqrt(cosLat * cosLat + (1 - f) * (1 - f) * sinLat * sinLat);
  var S = (1.0 - f) * (1.0 - f) * C;
  var h = altitude;

  var x = (rad * C + h) * cosLat * cosLon;
  var y = (rad * C + h) * cosLat * sinLon;
  var z = (rad * S + h) * sinLat;

  return {x: -x, y: z, z: y};
};

const latToRadius = (latitude) => {
  // https://en.wikipedia.org/wiki/Earth_radius#Geocentric_radius

  const φ = latitude * radian;
  const sinφ = Math.sin(φ);
  const cosφ = Math.cos(φ);
  const a = WGS84semimajor;
  const b = WGS84semiminor;

  const numerator = (a ** 2 * cosφ) ** 2 + (b ** 2 * sinφ) ** 2;
  const denominator = (a * cosφ) ** 2 + (b * sinφ) ** 2;

  return Math.sqrt(numerator / denominator);
};

/* Return necessary axis rotations, in radians (THREE.js orientation) */

const radiansToNorthPole = ({ latitude, longitude }) => {
  const firstTurn = -(longitude + 90) * radian; // Align globe to 0° longitude
  const secondTurn = (latitude - 90) * radian; // Tilt globe on Z-axis so that lat/lon is on top

  return { x: secondTurn || 0, y: firstTurn || 0, z: 0 };
};

/* Distance to horizon */

const averageHumanHeight = 1.6; // convert m to km
const distanceToHorizon = (altitude = 0) =>
  3.57 * Math.sqrt((altitude * 1000) + averageHumanHeight);

const haversine = (coords1, coords2) => {
  if (!coords1 || !coords2) return 0;

  const R = meanRadiusOfEarth;
  const φ1 = coords1.latitude * radian;
  const φ2 = coords2.latitude * radian;
  const Δφ = (coords2.latitude - coords1.latitude) * radian;
  const Δλ = (coords2.longitude - coords1.longitude) * radian;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
};

export {
  distanceToHorizon,
  haversine,
  latLongToCartesian,
  latToRadius,
  meanRadiusOfEarth,
  radiansToNorthPole,
};

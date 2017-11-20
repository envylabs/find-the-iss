/**
 * ISS Location
 * Returns ground coords & altitude
 */

import axios from 'axios';

const ISS = {
  latitude: 0,
  longitude: 0,
  altitude: 4114,
  visibility: 'daylight',
};

const fetch = () => {
  axios.get('https://api.wheretheiss.at/v1/satellites/25544').then(({ data }) => {
    ISS.latitude = data.latitude;
    ISS.longitude = data.longitude;
    ISS.altitude = data.altitude;
    ISS.visibility = data.visibility;
  });
};

const latest = () => ISS;

/* Init */

setInterval(fetch, 5000);

export default { latest };

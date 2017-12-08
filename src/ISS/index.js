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
  axios.get('https://api.wheretheiss.at/v1/satellites/25544')
    .then((request) => {
      ISS.latitude = parseFloat(request.data.latitude).toFixed(5);
      ISS.longitude = parseFloat(request.data.longitude).toFixed(5);
      ISS.altitude = request.data.altitude;
      ISS.visibility = request.data.visibility;
      return request.data;
    })
    .catch(error => console.log(error));
};

const latest = () => ISS;

/* Init */

setInterval(fetch, 5000);

export default { latest };

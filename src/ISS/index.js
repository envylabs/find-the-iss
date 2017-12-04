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

const fetch = async () => {
  const request = await axios.get('https://api.wheretheiss.at/v1/satellites/25544');
  ISS.latitude = parseFloat(request.data.latitude).toFixed(5);
  ISS.longitude = parseFloat(request.data.longitude).toFixed(5);
  ISS.altitude = request.data.altitude;
  ISS.visibility = request.data.visibility;
  return request.data;
};

const latest = () => ISS;

/* Init */

setInterval(fetch, 5000);

export default { latest };

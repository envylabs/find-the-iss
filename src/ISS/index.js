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
  const data = await axios.get('https://api.wheretheiss.at/v1/satellites/25544');
  ISS.latitude = parseFloat(data.latitude).toFixed(5);
  ISS.longitude = parseFloat(data.longitude).toFixed(5);
  ISS.altitude = data.altitude;
  ISS.visibility = data.visibility;
  return data;
};

const latest = () => ISS;

/* Init */

setInterval(fetch, 5000);

export default { latest };

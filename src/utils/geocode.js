import axios from 'axios';

const API_KEY = 'mapzen-8QixsYd';

export default async function geocode({ latitude, longitude }) {
  const response = await axios.get(`https://search.mapzen.com/v1/reverse?size=1&point.lat=${latitude}&point.lon=${longitude}&api_key=${API_KEY}`);
  if (response.data.features[0].properties.locality) {
    return `${response.data.features[0].properties.locality}_${response.data.features[0].properties.country_a}`;
  } else if (response.data.features[0].properties.country_a) {
    return response.data.features[0].country_a;
  } else if (response.data.features[0].properties.ocean) {
    return response.data.features[0].properties.ocean;
  }
  const NorS = latitude >= 0 ? 'N' : 'S';
  const EorW = longitude >= 0 ? 'E' : 'W';
  return `${latitude} ${NorS}, ${longitude} ${EorW}`;
}

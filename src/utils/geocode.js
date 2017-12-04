import axios from 'axios';

const API_KEY = 'mapzen-8QixsYd';

const geocode = async ({ latitude, longitude }) => {
  const data = await axios.get(`https://search.mapzen.com/v1/reverse?size=1&point.lat=40.74358294846026&point.lon=-73.99047374725342&api_key=${API_KEY}`);
  return `${data.features.properties.locality}, ${data.features.properties.country_a}`;
};

export { geocode };

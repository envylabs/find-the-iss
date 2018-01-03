import axios from 'axios';
import xml2js from 'xml2js-es6-promise';

const API_KEY = 'envylabs_findtheiss';

export default function geocode({ latitude, longitude }) {
  return axios
    .get(`https://secure.geonames.org/extendedFindNearby?lat=${latitude}&lng=${longitude}&username=${API_KEY}`)
    .then(response => {
      return xml2js(response.data);
    })
    .then(data => {
      if (data.geonames.address) {
        // City_CountryCode
        return `${data.geonames.address[0].placename['0']}_${data.geonames.address[0].countryCode['0']}`;
      } else if (data.geonames.ocean) {
        // Ocean
        return data.geonames.ocean[0].name[0];
      } else if (data.geonames.geoname) {
        // City_CountryCode
        return `${data.geonames.geoname[data.geonames.geoname.length - 1].toponymName['0']}_${
          data.geonames.geoname[data.geonames.geoname.length - 1].countryCode['0']
        }`;
      }

      // 51.31739 N, 164.78432 W
      const NorS = latitude >= 0 ? 'N' : 'S';
      const EorW = longitude >= 0 ? 'E' : 'W';
      return `${Math.abs(latitude)} ${NorS}, ${Math.abs(longitude)} ${EorW}`;
    });
}

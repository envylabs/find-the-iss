import {
  CLOSE_INFO,
  CLOSE_START,
  CLOSE_TRACKER,
  OPEN_INFO,
  OPEN_TRACKER,
  UPDATE_ISS_COORDS,
  UPDATE_ISS_DISTANCE,
  UPDATE_ISS_OVER,
  UPDATE_MAP_TRANSLATION,
  UPDATE_USER_COORDS
} from './actionTypes';

export const closeInfo = () => ({ type: CLOSE_INFO });
export const closeStart = () => ({ type: CLOSE_START });
export const closeTracker = () => ({ type: CLOSE_TRACKER });
export const openInfo = () => ({ type: OPEN_INFO });
export const openTracker = () => ({ type: OPEN_TRACKER });

export const updateISSCoords = ({ latitude, longitude }) => ({
  type: UPDATE_ISS_COORDS,
  latitude,
  longitude
});

export const updateISSDistance = distance => ({
  type: UPDATE_ISS_DISTANCE,
  distance: parseFloat(distance).toFixed(1)
});

export const updateISSOver = over => {
  console.log(over);
  return {
    type: UPDATE_ISS_OVER,
    over
  };
};

export const updateMapTranslation = ({ latitude, longitude }) => ({
  type: UPDATE_MAP_TRANSLATION,
  translation: {
    x: -(longitude / 180) * 50 / 3 - 50,
    y: Math.sin(latitude / 180 * Math.PI) * -37
  }
});

export const updateUserCoords = ({ latitude, longitude }) => ({
  type: UPDATE_USER_COORDS,
  latitude,
  longitude
});

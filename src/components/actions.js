import {
  CLOSE_INFO,
  CLOSE_TRACKER,
  OPEN_INFO,
  OPEN_TRACKER,
  UPDATE_ISS_COORDS,
  UPDATE_ISS_DISTANCE,
  UPDATE_ISS_OVER,
  UPDATE_MAP_TRANSLATION,
  UPDATE_USER_COORDS,
} from './actionTypes';

export const closeInfo = () => ({
  type: CLOSE_INFO,
});

export const closeTracker = () => ({
  type: CLOSE_TRACKER,
});

export const openInfo = () => ({
  type: OPEN_INFO,
});

export const openTracker = () => ({
  type: OPEN_TRACKER,
});

export const updateISSCoords = ({ latitude, longitude }) => ({
  type: UPDATE_ISS_COORDS,
  latitude,
  longitude,
});

export const updateISSDistance = distance => ({
  type: UPDATE_ISS_DISTANCE,
  distance,
});

export const updateISSOver = over => ({
  type: UPDATE_ISS_OVER,
  over,
});

export const updateMapTranslation = ({ latitude, longitude }) => {
  const x = (longitude / 180 / 3) - 50;
  const y = Math.sin(latitude * Math.PI / 180) * 100;

  return {
    type: UPDATE_MAP_TRANSLATION,
    translation: { x, y },
  };
};

export const updateUserCoords = ({ latitude, longitude }) => ({
  type: UPDATE_USER_COORDS,
  latitude,
  longitude,
});

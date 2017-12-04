import {
  CLOSE_INFO,
  CLOSE_TRACKER,
  OPEN_INFO,
  OPEN_TRACKER,
  UPDATE_ISS_COORDS,
  UPDATE_ISS_OVER,
  UPDATE_USER_COORDS,
} from './actions';

import { haversine } from 'utils/geodesy';
import geocode from 'utils/geocode';

const initialState = {
  isInfoOpen: false,
  ISSDistance: '0 km',
  ISSOver: '???',
  isTrackerOpen: false,
};

const getDistance = (coords1, coords2) =>
  `${haversine(coords1, coords2)} km`;

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CLOSE_INFO:
      return { ...state, isInfoOpen: false };
    case CLOSE_TRACKER:
      return { ...state, isTrackerOpen: false };
    case OPEN_INFO:
      return { ...state, isInfoOpen: true };
    case OPEN_TRACKER:
      return { ...state, isTrackerOpen: true };
    case UPDATE_ISS_COORDS:
      const newISSDistance = getDistance(
        { latitude: state.userLatitude, longitude: state.userLongitude },
        { latitude: action.latitude, longitude: action.longitude },
      );
      return {
        ...state,
        ISSDistance: newISSDifference,
        ISSLatitude: action.latitude,
        ISSLongitude: action.longitude,
      };
    case UPDATE_ISS_OVER:
      return {
        ...state,
        ISSOver: action.name,
      };
    case UPDATE_USER_COORDS:
      const newUserDistance = getDistance(
        { latitude: state.ISSLatitude, longitude: state.ISSLongitude },
        { latitude: action.latitude, longitude: action.longitude },
      );
      return {
        ...state,
        ISSDistance: newUserDistance,
        userLatitude: action.latitude,
        userLongitude: action.longitude,
      };
    default:
      return state;
  }
}

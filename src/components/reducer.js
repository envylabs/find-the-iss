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

export const initialState = {
  isInfoOpen: false,
  ISSDistance: 0,
  ISSOver: '???',
  ISSPos: { latitude: 0, longitude: 0 },
  isTrackerOpen: false,
  mapTranslation: { x: 0, y: 0 },
  userPos: { latitude: 0, longitude: 0 },
};

export function rootReducer(state = initialState, action) {
  switch (action.type) {
    case CLOSE_INFO:
      return { ...state, isInfoOpen: false };
    case CLOSE_TRACKER:
      return { ...state, isTrackerOpen: false };
    case OPEN_INFO:
      return { ...state, isInfoOpen: true };
    case OPEN_TRACKER:
      return { ...state, isTrackerOpen: true };
    case UPDATE_MAP_TRANSLATION:
      return {
        ...state,
        mapTranslation: action.translation,
      };
    case UPDATE_ISS_COORDS:
      return {
        ...state,
        ISSPos: {
          latitude: action.latitude,
          longitude: action.longitude,
        },
      };
    case UPDATE_ISS_DISTANCE:
      return {
        ...state,
        distance: action.distance,
      };
    case UPDATE_ISS_OVER:
      return {
        ...state,
        ISSOver: action.over,
      };
    case UPDATE_USER_COORDS:
      return {
        ...state,
        userPos: {
          latitude: action.latitude,
          longitude: action.longitude,
        },
      };
    default:
      return state;
  }
}

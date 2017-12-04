import {
  CLOSE_TRACKER,
  OPEN_TRACKER,
} from './actions';

const initialState = {
  isTrackerOpen: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_TRACKER:
      return {
        ...state,
        isTrackerOpen: true,
      };
    case CLOSE_TRACKER:
      return {
        ...state,
        isTrackerOpen: false,
      };
    default:
      return state;
  }
}

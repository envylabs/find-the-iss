import { all, call, put, select, takeLatest, throttle } from 'redux-saga/effects';

import {
  UPDATE_ISS_COORDS,
  UPDATE_USER_COORDS,
} from 'components/actionTypes';
import {
  updateISSCoords,
  updateISSDistance,
  updateISSOver,
  updateMapTranslation,
  updateUserCoords,
} from 'components/actions';
import { haversine } from 'utils/geodesy';
import geocode from 'utils/geocode';

export const selectISSPosition = state => ({
  latitude: state.ISSPos.latitude,
  longitude: state.ISSPos.longitude,
});

export const selectUserPosition = state => ({
  latitude: state.userPos.latitude,
  longitude: state.userPos.longitude,
});

function* updateISSData(action) {
  const ISSPos = { latitude: action.latitude, longitude: action.longitude };
  yield put(updateISSCoords(ISSPos));
  yield put(updateMapTranslation(ISSPos));

  const userPos = yield select(selectUserPosition);
  const distance = haversine(userPos, ISSPos);
  yield put(updateISSDistance(distance));
  try {
    const over = yield call(geocode, ISSPos);
    yield put(updateISSOver(over));
  } catch (e) {
    console.log('😵 Couldn’t reach Geonames');
  }
}

function* updateUserData(action) {
  const userPos = { latitude: action.latitude, longitude: action.longitude };
  yield put(updateUserCoords(userPos));
}

function* watchUserPosition() {
  yield throttle(5000, UPDATE_USER_COORDS, updateUserData);
}

function* watchISSPosition() {
  yield throttle(5000, UPDATE_ISS_COORDS, updateISSData);
}

export function* rootSaga() {
  yield all([
    watchUserPosition(),
    watchISSPosition(),
  ]);
}

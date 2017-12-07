import {
  all,
  call,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';

import {
  UPDATE_ISS_COORDS,
  UPDATE_USER_COORDS,
} from 'components/actionTypes';
import {
  updateISSDistance,
  updateISSOver,
  updateMapTranslation,
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

function* updateISSData() {
  const userPos = yield select(selectUserPosition);
  const ISSPos = yield select(selectISSPosition);
  yield put(updateISSDistance(haversine(userPos, ISSPos)));
  yield put(updateMapTranslation(ISSPos));
  const over = yield call(geocode, [ISSPos.latitude, ISSPos.longitude]);
  yield put(updateISSOver(over));
}

function* updateUserData() {
  const ISSPos = yield select(selectISSPosition);
  const userPos = yield select(selectUserPosition);
  const distance = haversine(userPos, ISSPos);
  yield put(updateISSDistance(distance));
}

function* watchISSPosition() {
  yield takeLatest(UPDATE_ISS_COORDS, updateISSData);
}

function* watchUserPosition() {
  yield takeLatest(UPDATE_USER_COORDS, updateUserData);
}

export function* rootSaga() {
  yield all([
    watchISSPosition,
    watchUserPosition,
  ]);
}

import i18n from 'i18next';
import { put, take, takeLatest } from 'redux-saga/effects';
import client from '@services/api/client';
import {
  requestStats,
  setSelectedPolygon,
  setShowLoadingIndicator,
  setStats,
} from '../actions';

let allMapStats: any;

function* fetchStats({ payload }) {
  if (!payload && allMapStats) {
    yield put(setStats(allMapStats));
  } else {
    yield put(setShowLoadingIndicator(true));
    const graphqlData = yield client.getStatics(payload);
    switch (graphqlData.kind) {
      case 'ok':
        if (!payload) {
          allMapStats = graphqlData.data;
        }
        yield put(setStats(graphqlData.data));
        break;
      case 'timeout':
        alert(i18n.t('Request Timeout'));
        break;
      default:
        break;
    }
    yield put(setShowLoadingIndicator(false));
  }
}

export default function* fetchStatsSaga() {
  // wait for request stats action
  yield take(requestStats.getType());
  yield fetchStats({ payload: null });

  // reload stats on polygon select
  yield takeLatest<any>(setSelectedPolygon.getType(), fetchStats);
}

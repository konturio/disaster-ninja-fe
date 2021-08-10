import { put, call, take } from 'redux-saga/effects';
import { requestConfig, setConfig } from '../actions';

export default function* fetchConfigSaga() {
  // wait for request config action
  yield take(requestConfig.getType());

  try {
    const response = yield call(fetch, 'config.json');
    const json: any = yield call([response, 'json']);
    yield put(setConfig(json));
  } catch (e) {
    console.error(e);
  }
}

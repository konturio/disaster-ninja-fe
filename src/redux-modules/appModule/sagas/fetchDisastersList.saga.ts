import { put } from 'redux-saga/effects';
import { setDisastersList } from '../actions';
import client from '~services/api/client';
import { GetDisastersList } from '~services/api/apiTypes';

export default function* fetchDisastersListSaga() {
  try {
    const response: GetDisastersList = yield client.getDisastersList();
    switch (response.kind) {
      case 'ok':
        yield put(setDisastersList(response.data));
        break;
      default:
        break;
    }
  } catch (e) {
    console.error(e);
  }
}

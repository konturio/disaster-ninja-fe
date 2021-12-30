import { put, take } from 'redux-saga/effects';

// eslint-disable-next-line import/prefer-default-export
export function* putAndTake(putActon, takeActionType: string) {
  yield put(putActon);
  const result = yield take(takeActionType);
  return result.payload;
}

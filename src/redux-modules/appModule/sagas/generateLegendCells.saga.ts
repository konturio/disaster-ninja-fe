import { put, takeLatest } from 'redux-saga/effects';
import { setColorTheme, setLegendCells } from '../actions';

function* generateLegendCells({ payload }) {
  const colorTheme = payload;
  if (colorTheme) {
    const legendCells = colorTheme.map(({ id, color }) => ({
      label: id,
      color,
    }));
    yield put(setLegendCells(legendCells));
  } else {
    console.debug('Color themes missing');
  }
}

export default function* generateLegendCellsSaga() {
  yield takeLatest<any>(setColorTheme.getType(), generateLegendCells);
}

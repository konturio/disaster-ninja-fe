import {
  put, select, takeLatest, take,
} from 'redux-saga/effects';
import * as selectors from '../selectors';
import {
  resetSelectedOverlayIndex,
  setMatrixSelection,
  setSelectedOverlayIndex,
  setNumerators,
} from '../actions';

function* onSelectOverlay({ payload: selectedOverlayIndex }) {
  if (selectedOverlayIndex < 0) return;
  const overlays = (yield select(selectors.stats))?.overlays;
  if (!overlays || !overlays.length) return;

  const selectedOverlay = overlays[selectedOverlayIndex];
  if (!selectedOverlay || !selectedOverlay.x || !selectedOverlay.y) return;

  const [xNumerator, xDenominator] = selectedOverlay.x.quotient;
  const [yNumerator, yDenominator] = selectedOverlay.y.quotient;

  const xNumerators = yield select(selectors.xNumerators);
  const yNumerators = yield select(selectors.yNumerators);

  // select denominators
  if (!xNumerators || !yNumerators) return;
  let numsChanged = false;
  const newXNums = [...xNumerators];
  const newYNums = [...yNumerators];
  const selectedXNumIndex = xNumerators.findIndex(
    (num) => num.numeratorId === xNumerator,
  );
  if (
    selectedXNumIndex !== -1
    && xNumerators[selectedXNumIndex].selectedDenominator !== xDenominator
  ) {
    numsChanged = true;
    newXNums[selectedXNumIndex] = {
      ...xNumerators[selectedXNumIndex],
      selectedDenominator: xDenominator,
    };
  }

  const selectedYNumIndex = yNumerators.findIndex(
    (num) => num.numeratorId === yNumerator,
  );
  if (
    selectedYNumIndex !== -1
    && yNumerators[selectedYNumIndex].selectedDenominator !== yDenominator
  ) {
    numsChanged = true;
    newYNums[selectedYNumIndex] = {
      ...yNumerators[selectedYNumIndex],
      selectedDenominator: yDenominator,
    };
  }

  if (numsChanged) {
    yield put(setNumerators(newXNums, newYNums));
  }

  // select numerators
  yield put(setMatrixSelection(xNumerator, yNumerator));

  // wait for select denominator or numerator to reset overlay
  yield take(setMatrixSelection.getType());
  yield put(resetSelectedOverlayIndex());
}

/* on change selected overlay */
export default function* overlaySaga() {
  yield takeLatest<any>(setSelectedOverlayIndex.getType(), onSelectOverlay);
}

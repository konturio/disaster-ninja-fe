import { takeLatest, select, put } from 'redux-saga/effects';
import { setCorrelationMatrix, setNumerators } from '@appModule/actions';
import * as selectors from '@appModule/selectors';
import { CorrelationMatrix } from '@appModule/types';

function* calculateCorrelationMatrix({ payload }) {
  const { numX: xNumerators, numY: yNumerators } = payload;
  const { correlationRates } = yield select(selectors.stats);

  const matrix: CorrelationMatrix = [];
  for (let i = 0; i < yNumerators.length; i += 1) {
    matrix.push([]);
    for (let j = 0; j < xNumerators.length; j += 1) {
      matrix[i].push(null);
    }
  }

  for (let i = 0; i < yNumerators.length; i += 1) {
    const yNumerator = yNumerators[i].numeratorId;
    const yDenominator = yNumerators[i].selectedDenominator;
    for (let j = 0; j < xNumerators.length; j += 1) {
      const xNumerator = xNumerators[j].numeratorId;
      const xDenominator = xNumerators[j].selectedDenominator;
      for (let k = 0; k < correlationRates.length; k += 1) {
        const cr = correlationRates[k];
        if (
          cr.x.quotient[0] === xNumerator
          && cr.x.quotient[1] === xDenominator
          && cr.y.quotient[0] === yNumerator
          && cr.y.quotient[1] === yDenominator
        ) {
          matrix[i][j] = cr.rate;
          break;
        }
      }
    }
  }

  yield put(setCorrelationMatrix(matrix));
}

export default function* calculateCorrelationMatrixSaga() {
  yield takeLatest<any>(setNumerators.getType(), calculateCorrelationMatrix);
}

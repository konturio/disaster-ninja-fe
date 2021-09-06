import { put, takeLatest } from 'redux-saga/effects';
import { setNumerators, setStats } from '~appModule/actions';
import { extractAvailableNumeratorsWithDenominators } from '@k2-packages/bivariate-tools/src/index';
import { NumeratorWithDenominators } from '~appModule/types';

function* bivariateWorkflow({ payload }) {
  const stats = payload;

  // get all available numerators with denominators
  const numerators = extractAvailableNumeratorsWithDenominators(stats);

  // add first denominator as selected
  const numsX: NumeratorWithDenominators[] = numerators.x.map((num) => ({
    ...num,
    selectedDenominator: num.denominators[0],
  }));
  const numsY: NumeratorWithDenominators[] = numerators.y.map((num) => ({
    ...num,
    selectedDenominator: num.denominators[0],
  }));

  yield put(setNumerators(numsX, numsY));
}

export default function* bivariateWorkflowSaga() {
  yield takeLatest<any>(setStats.getType(), bivariateWorkflow);
}

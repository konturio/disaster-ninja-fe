import { put, spawn } from 'redux-saga/effects';
import { putAndTake } from '@utils/saga/helpers';
import client from '@services/api/client';
import bivariateWorkflowSaga from '@appModule/sagas/bivariateWorkflow.saga';
import calculateCorrelationMatrixSaga from '@appModule/sagas/calculateCorrelationMatrixSaga';
import {
  requestConfig,
  requestStats,
  setConfig,
  setSelectedOverlayIndex,
  setStats,
} from '../actions';

import generateMapStyleSaga from './generateMapStyle.saga';
import fetchConfigSaga from './fetchConfig.saga';
import fetchStatsSaga from './fetchStats.saga';
import overlaySaga from './overlay.saga';
import generateLegendCellsSaga from './generateLegendCells.saga';
import checkBoundariesSaga from './checkBoundariesSaga';

/**
  Root saga pipeline:
  - Get config
  - Get stats
  - Set defaults
  - (on every select denominator)
    - Generate matrix
    - (on every select numerator on matrix)
      - Generate mapStyle and legend
 */

export default function* rootSaga() {
  yield spawn(fetchConfigSaga);
  yield spawn(fetchStatsSaga);
  yield spawn(generateLegendCellsSaga);
  yield spawn(generateMapStyleSaga);
  yield spawn(overlaySaga);
  yield spawn(calculateCorrelationMatrixSaga);
  yield spawn(checkBoundariesSaga);
  yield spawn(bivariateWorkflowSaga);

  // get config
  const config = yield putAndTake(requestConfig(), setConfig.getType());
  client.setup(config.GRAPHQL_API);

  // get stats
  const stats = yield putAndTake(requestStats(), setStats.getType());

  // set default overlay
  const { overlays } = stats;
  if (overlays && overlays.length) {
    const activeOverlayIndex = overlays.findIndex((overlay) => overlay.active);
    if (activeOverlayIndex >= 0) {
      yield put(setSelectedOverlayIndex(activeOverlayIndex));
    }
  }
}

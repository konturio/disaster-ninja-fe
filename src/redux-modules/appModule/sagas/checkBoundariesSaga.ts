import i18n from 'i18next';
import { takeLatest, take, put, select } from 'redux-saga/effects';
import {
  checkBoundaries,
  removeMarker,
  setActiveDrawMode,
  setBoundaries,
  setConfig,
  setMarker,
  setSelectedPolygon,
  setSource,
  showBoundaries,
} from '~appModule/actions';
import Client from '@k2-packages/client';
import { BoundariesSagaPlugin } from '@k2-packages/boundaries';
import { createGeoJSONSource } from '~utils/geoJSON/helpers';
import config from '~core/app_config/runtime';
import * as selectors from '~appModule/selectors';

type Action<T = any> = { type: string; payload: T };

export default function* checkBoundariesSaga() {
  const apiConfig = yield take(setConfig.getType());
  if (apiConfig.payload && apiConfig.payload.BOUNDARIES_API) {
    const ifBoundariesEmpty = () => {
      alert(i18n.t('No administrative boundaries'));
    };

    const boundariesClient = new Client(apiConfig.payload.BOUNDARIES_API);
    yield takeLatest(
      checkBoundaries.getType(),
      BoundariesSagaPlugin({
        client: boundariesClient,
        // dispatch: store.dispatch.bind(store),
        dispatch: () => null,
        setMarker,
        removeMarker,
        showBoundary: showBoundaries,
        setBoundary: setBoundaries,
        emptyBoudaryCallback: ifBoundariesEmpty,
      }),
    );

    yield takeLatest(showBoundaries.getType(), function* ({ payload }: Action) {
      yield put(
        setSource({
          id: 'hovered-boundaries',
          ...createGeoJSONSource(payload),
        }),
      );
    });

    yield takeLatest(setBoundaries.getType(), function* ({ payload }: Action) {
      yield put(
        setSource({
          id: 'selected-boundaries',
          ...createGeoJSONSource(payload),
        }),
      );
      yield put(
        setSource({ id: 'hovered-boundaries', ...createGeoJSONSource() }),
      );
      yield put(setSelectedPolygon(JSON.stringify(payload)));
    });

    yield takeLatest(
      setActiveDrawMode.getType(),
      function* ({ payload }: Action) {
        if (payload !== 'SelectBoundaryMode') {
          const sources: any = yield select(selectors.sources);
          if (sources['selected-boundaries'].data.features.length) {
            yield put(
              setSource({
                id: 'selected-boundaries',
                ...createGeoJSONSource(),
              }),
            );
            yield put(setSelectedPolygon(null));
          }

          if (sources['hovered-boundaries'].data.features.length) {
            yield put(
              setSource({ id: 'hovered-boundaries', ...createGeoJSONSource() }),
            );
          }

          // clear markers
          const markers = yield select(selectors.markers);
          if (markers.length) {
            yield put(setMarker(null));
          }
        }
      },
    );
  }
}

import { store } from '~core/store/store';
import { referenceAreaAtom } from '~core/shared_state/referenceArea';
import { registerNewGeometryLayer } from '~core/logical_layers/utils/registerNewGeometryLayer';
import { applyNewGeometryLayerSource } from '~core/logical_layers/utils/applyNewGeometryLayerSource';
import {
  REFERENCE_AREA_COLOR,
  REFERENCE_AREA_LOGICAL_LAYER_ID,
  REFERENCE_AREA_LOGICAL_LAYER_TRANSLATION_KEY,
} from './constants';
import { ReferenceAreaRenderer } from './renderers/ReferenceAreaRenderer';

let isInitialized = false;

export function initReferenceAreaLayer() {
  if (isInitialized) return;
  isInitialized = true;

  // when referenceAreaAtom updates, we create a new reference area layer source
  store.v3ctx.subscribe(referenceAreaAtom, (geometry) => {
    applyNewGeometryLayerSource(REFERENCE_AREA_LOGICAL_LAYER_ID, geometry);
  });

  registerNewGeometryLayer(
    REFERENCE_AREA_LOGICAL_LAYER_ID,
    REFERENCE_AREA_LOGICAL_LAYER_TRANSLATION_KEY,
    new ReferenceAreaRenderer({
      id: REFERENCE_AREA_LOGICAL_LAYER_ID,
    }),
    REFERENCE_AREA_COLOR,
  );
}

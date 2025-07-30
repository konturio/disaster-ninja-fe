import { store } from '~core/store/store';
import { registerNewGeometryLayer } from '~core/logical_layers/utils/registerNewGeometryLayer';
import { applyNewGeometryLayerSource } from '~core/logical_layers/utils/applyNewGeometryLayerSource';
import {
  SEARCH_HIGHLIGHT_LAYER_ID,
  SEARCH_HIGHLIGHT_LAYER_TRANSLATION_KEY,
  SEARCH_HIGHLIGHT_COLOR,
} from './constants';
import { SearchHighlightRenderer } from './renderers/SearchHighlightRenderer';
import { searchHighlightedGeometryAtom } from './atoms/highlightedGeometry';

let isInitialized = false;

export function initSearchHighlightLayer() {
  if (isInitialized) return;
  isInitialized = true;

  store.v3ctx.subscribe(searchHighlightedGeometryAtom, (geometry) => {
    applyNewGeometryLayerSource(SEARCH_HIGHLIGHT_LAYER_ID, geometry);
  });

  registerNewGeometryLayer(
    SEARCH_HIGHLIGHT_LAYER_ID,
    SEARCH_HIGHLIGHT_LAYER_TRANSLATION_KEY,
    new SearchHighlightRenderer({
      layerId: SEARCH_HIGHLIGHT_LAYER_ID,
      sourceId: `${SEARCH_HIGHLIGHT_LAYER_ID}-source`,
      color: SEARCH_HIGHLIGHT_COLOR,
    }),
    SEARCH_HIGHLIGHT_COLOR,
  );
}

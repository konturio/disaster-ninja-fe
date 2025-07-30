import { currentMapAtom } from '~core/shared_state';
import { store } from '~core/store/store';
import type { LogicalLayerState } from '~core/logical_layers/types/logicalLayer';
import {
  SEARCH_HIGHLIGHT_LAYER_ID,
  SEARCH_HIGHLIGHT_COLOR,
} from './constants';
import { searchHighlightedGeometryAtom } from './atoms/highlightedGeometry';
import { SearchHighlightRenderer } from './renderers/SearchHighlightRenderer';

let cleanUp: (() => void) | null = null;

export function initSearchHighlightLayer() {
  if (cleanUp) return cleanUp;

  const ctx = store.v3ctx;
  const map = ctx.get(currentMapAtom.v3atom);
  if (!map) return () => {};

  const sourceId = `${SEARCH_HIGHLIGHT_LAYER_ID}-source`;
  const renderer = new SearchHighlightRenderer({
    layerId: SEARCH_HIGHLIGHT_LAYER_ID,
    sourceId,
    color: SEARCH_HIGHLIGHT_COLOR,
  });

  const state: LogicalLayerState = {
    id: SEARCH_HIGHLIGHT_LAYER_ID,
    isDownloadable: false,
    isVisible: true,
    isLoading: false,
    isEnabled: true,
    isEditable: false,
    isMounted: true,
    source: {
      id: sourceId,
      source: { type: 'geojson', data: { type: 'FeatureCollection', features: [] } },
    },
    legend: null,
    meta: null,
    settings: null,
    error: null,
    contextMenu: null,
    style: null,
    editor: null,
  };

  renderer.willMount({ map, state });

  const unsubscribe = ctx.subscribe(searchHighlightedGeometryAtom, (geometry) => {
    renderer.willSourceUpdate({
      map,
      state: {
        ...state,
        source: {
          id: sourceId,
          source: { type: 'geojson', data: geometry as any },
        },
      },
    });
  });

  cleanUp = () => {
    unsubscribe();
    renderer.willUnMount({ map, state });
    cleanUp = null;
  };

  return cleanUp;
}

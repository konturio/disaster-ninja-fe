import { action, atom } from '@reatom/framework';
import { currentMapAtom } from '~core/shared_state';
import { forceRun } from '~utils/atoms/forceRun';
import { store } from '~core/store/store';
import { v3toV2 } from '~utils/atoms/v3tov2';
import { boundarySelectorControl } from '../control';
import { BoundarySelectorRenderer } from '../renderers/BoundarySelectorRenderer';
import {
  BOUNDARY_GEOMETRY_COLOR,
  BOUNDARY_SELECTOR_LAYER_ID,
  HOVERED_BOUNDARIES_SOURCE_ID,
} from '../constants';
import { highlightedGeometryAtom } from './highlightedGeometry';
import type { LogicalLayerState } from '~core/logical_layers/types/logicalLayer';
import type { LogicalLayerRenderer } from '~core/logical_layers/types/renderer';

function createBoundaryHighlightSource(
  geometry: GeoJSON.Feature | GeoJSON.FeatureCollection,
) {
  return {
    id: HOVERED_BOUNDARIES_SOURCE_ID,
    source: {
      type: 'geojson' as const,
      data: geometry,
    },
  };
}

export const createBoundaryRegistryAtom = (
  layerId: string,
  renderer: LogicalLayerRenderer,
) => {
  const logicalLayerStateAtom = atom<LogicalLayerState>(
    {
      id: layerId,
      isDownloadable: false,
      isVisible: true,
      isLoading: false,
      isEnabled: false,
      isEditable: false,
      isMounted: false,
      source: null,
      legend: null,
      meta: null,
      settings: null,
      error: null,
      contextMenu: null,
      style: null,
      editor: null,
    },
    `logicalLayerState:${layerId}`,
  );

  const startAction = action((ctx) => {
    const map = ctx.get(currentMapAtom.v3atom);
    const highlightedGeometry = ctx.get(highlightedGeometryAtom.v3atom);

    if (map === null) return;
    const state = ctx.get(logicalLayerStateAtom);
    const newState = {
      ...state,
      isEnabled: true,
      source: createBoundaryHighlightSource(highlightedGeometry),
    };

    renderer.willMount({
      map,
      state: newState,
    });

    logicalLayerStateAtom(ctx, {
      ...newState,
      isMounted: true,
    });
  }, 'boundary-startAction');

  const stopAction = action((ctx) => {
    const map = ctx.get(currentMapAtom.v3atom);
    if (map === null) return;
    const state = ctx.get(logicalLayerStateAtom);
    renderer.willUnMount({
      map,
      state: { ...(state as LogicalLayerState) },
    });
    logicalLayerStateAtom(ctx, (oldState) => ({
      ...oldState,
      isMounted: false,
    }));
  }, 'boundary-stopAction');

  highlightedGeometryAtom.v3atom.onChange((ctx, geometry) => {
    const map = ctx.get(currentMapAtom.v3atom);
    if (map === null) return;
    const state = ctx.get(logicalLayerStateAtom);
    if (map && state.isMounted === true) {
      renderer.willSourceUpdate({
        map,
        state: { ...state, source: createBoundaryHighlightSource(geometry) },
      });
    }
  });

  const v2Atom = v3toV2(logicalLayerStateAtom, {
    start: startAction,
    stop: stopAction,
  });

  return v2Atom;
};

boundarySelectorControl.onInit((ctx) => {
  const renderer = new BoundarySelectorRenderer({
    layerId: BOUNDARY_SELECTOR_LAYER_ID,
    sourceId: HOVERED_BOUNDARIES_SOURCE_ID,
    color: BOUNDARY_GEOMETRY_COLOR,
  });

  const boundaryRegistryAtom = createBoundaryRegistryAtom(
    BOUNDARY_SELECTOR_LAYER_ID,
    renderer,
  );

  ctx.boundaryRegistryAtom = boundaryRegistryAtom;
  return forceRun(boundaryRegistryAtom);
});

boundarySelectorControl.onStateChange((ctx, state, prevState) => {
  switch (state) {
    case 'active':
      if (ctx.boundaryRegistryAtom) store.dispatch(ctx.boundaryRegistryAtom.start());
      break;

    default:
      if (prevState === 'active' && ctx.boundaryRegistryAtom)
        store.dispatch(ctx.boundaryRegistryAtom.stop());
  }
});

import { currentMapAtom } from '~core/shared_state';
import { createAtom } from '~utils/atoms';
import { forceRun } from '~utils/atoms/forceRun';
import { store } from '~core/store/store';
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

export const createBoundaryRegistryAtom = (
  layerId: string,
  renderer: LogicalLayerRenderer,
) =>
  createAtom(
    {
      currentMapAtom,
      highlightedGeometry: highlightedGeometryAtom,
      start: () => null,
      stop: () => null,
    },
    (
      { get, onAction, onChange },
      state: LogicalLayerState = {
        id: layerId,
        isDownloadable: false,
        isVisible: true,
        isLoading: false,
        isEnabled: false,
        isMounted: false,
        source: {
          id: 'highlightedGeometry',
          source: {
            type: 'geojson',
            data: get('highlightedGeometry'),
          },
        },
        legend: null,
        meta: null,
        settings: null,
        error: null,
        contextMenu: null,
        style: null,
      },
    ) => {
      const newState = {
        ...state,
        source: {
          id: 'highlightedGeometry',
          source: {
            type: 'geojson',
            data: get('highlightedGeometry'),
          },
        },
      };

      onAction('start', () => {
        newState.isEnabled = true;
        const map = get('currentMapAtom');
        if (!map) return;
        if (newState.source) {
          renderer.willMount({
            map,
            state: { ...newState } as LogicalLayerState,
          });
          newState.isMounted = true;
        }
      });

      onAction('stop', () => {
        const map = get('currentMapAtom');
        if (map) {
          renderer.willUnMount({
            map,
            state: { ...(newState as LogicalLayerState) },
          });
        }
        newState.isMounted = false;
      });

      onChange('currentMapAtom', (map) => {
        if (!map) {
          newState.isMounted = false;
          return;
        }
        if (newState.isEnabled === true && newState.isMounted === false) {
          renderer.willMount({
            map,
            state: { ...(newState as LogicalLayerState) },
          });
          newState.isMounted = true;
        }
      });

      onChange('highlightedGeometry', () => {
        const map = get('currentMapAtom');
        if (map && newState.isMounted === true) {
          renderer.willSourceUpdate({
            map,
            state: { ...(newState as LogicalLayerState) },
          });
        }
      });

      return newState;
    },
    layerId,
  );

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

boundarySelectorControl.onStateChange((ctx, state) => {
  switch (state) {
    case 'active':
      if (ctx.boundaryRegistryAtom) store.dispatch(ctx.boundaryRegistryAtom.start());
      break;

    default:
      if (ctx.boundaryRegistryAtom) store.dispatch(ctx.boundaryRegistryAtom.stop());
  }
});

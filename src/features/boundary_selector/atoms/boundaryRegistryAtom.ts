import { currentMapAtom } from '~core/shared_state';
import { createAtom } from '~utils/atoms';
import type { LogicalLayerState } from '~core/logical_layers/types/logicalLayer';
import { LogicalLayerRenderer } from '~core/logical_layers/types/renderer';
import { highlightedGeometry } from './highlightedGeometry';

export const createBoundaryRegistryAtom = (
  layerId: string,
  renderer: LogicalLayerRenderer,
) =>
  createAtom(
    {
      currentMapAtom,
      highlightedGeometry,
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

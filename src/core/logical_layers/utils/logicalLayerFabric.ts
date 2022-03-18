// https://beta.plectica.com/maps/I6JK50E2F/edit/4NE4TFESC
import { Action } from '@reatom/core';
import { memo } from '@reatom/core/experiments';
import type { AsyncState } from '../types/asyncState';
import type { LogicalLayerRenderer } from '../types/renderer';

import type {
  LogicalLayerActions,
  LogicalLayerState,
} from '../types/logicalLayer';
import type { LayerRegistryAtom } from '../types/registry';

import { currentMapAtom } from '../../shared_state/currentMap';
import { layersSettingsAtom } from '../atoms/layersSettings';
import { enabledLayersAtom } from '../atoms/enabledLayers';
import { mountedLayersAtom } from '../atoms/mountedLayers';
import { hiddenLayersAtom } from '../atoms/hiddenLayers';
import { layersLegendsAtom } from '../atoms/layersLegends';
import { layersMetaAtom } from '../atoms/layersMeta';
import { layersSourcesAtom } from '../atoms/layersSources';
import { layersRegistryAtom } from '../atoms/layersRegistry';
import { downloadObject } from '~utils/fileHelpers/download';
import { deepFreeze } from './deepFreeze';
import { createAtom } from '~utils/atoms';

/**
 * Layer Atom responsibilities:
 * - select and compose layer state from different lists
 * - pass actions back to side states
 * - run layer renderer hooks
 * - mount activated and unmount deactivated layers
 */
const logicalLayerActions: LogicalLayerActions = {
  enable: () => null,
  disable: () => null,
  hide: () => null,
  show: () => null,
  download: () => null,
  destroy: () => null,
};

export function createLogicalLayerAtom(
  id: string,
  renderer: LogicalLayerRenderer,
  registry: LayerRegistryAtom = layersRegistryAtom,
) {
  let hasBeenDestroyed = false;
  const logicalLayerAtom = createAtom(
    {
      ...logicalLayerActions,
      currentMapAtom,
      layersSettingsAtom,
      layersLegendsAtom,
      layersMetaAtom,
      layersSourcesAtom,
      enabledLayersAtom,
      mountedLayersAtom,
      hiddenLayersAtom,
    },
    (
      { get, onAction, onChange, onInit, schedule },
      state: LogicalLayerState = {
        id,
        error: null,
        isEnabled: false,
        isLoading: false,
        isMounted: false,
        isVisible: true,
        isDownloadable: false,
        settings: null,
        meta: null,
        legend: null,
        source: null,
      },
    ) => {
      const actions: Action[] = [];
      const map = get('currentMapAtom') ?? null;

      /**
       * ! Important Note! In you add new sub stores,
       * ! Don't forget clean up external states
       */
      const fallbackAsyncState: AsyncState<null> = {
        isLoading: false,
        data: null,
        error: null,
      };
      const asyncLayerSettings =
        get('layersSettingsAtom').get(id) ?? fallbackAsyncState;
      const asyncLayerMeta =
        get('layersMetaAtom').get(id) ?? fallbackAsyncState;
      const asyncLayerLegend =
        get('layersLegendsAtom').get(id) ?? fallbackAsyncState;
      const asyncLayerSource =
        get('layersSourcesAtom').get(id) ?? fallbackAsyncState;

      const newState = {
        id: state.id,
        error: state.error,
        isLoading: [
          asyncLayerSettings,
          asyncLayerMeta,
          asyncLayerLegend,
          asyncLayerSource,
        ].some((s) => s.isLoading),
        isEnabled: get('enabledLayersAtom').has(id),
        isMounted: get('mountedLayersAtom').has(id),
        isVisible: !get('hiddenLayersAtom').has(id),
        isDownloadable:
          asyncLayerSource.data?.source.type === 'geojson' ?? false, // details.data.source.type === 'geojson'
        settings: deepFreeze(asyncLayerSettings.data),
        meta: deepFreeze(asyncLayerMeta.data),
        legend: deepFreeze(asyncLayerLegend.data),
        source: deepFreeze(asyncLayerSource.data),
      };

      /* Init (lazy) */

      onInit(() => {
        try {
          renderer.willInit({ map, state: { ...newState } });
        } catch (e) {
          console.error(e);
          newState.error = e;
        }
      });

      /* Enable */

      onAction('enable', () => {
        newState.isEnabled = true;
        actions.push(enabledLayersAtom.set(id));
      });

      onAction('disable', () => {
        newState.isEnabled = false;
        actions.push(enabledLayersAtom.delete(id));
      });

      /* Visibility */

      onAction('hide', () => {
        if (!map) return;
        try {
          renderer.willHide({ map, state: { ...newState } });
          newState.isVisible = false;
          actions.push(hiddenLayersAtom.set(id));
        } catch (e) {
          console.error(e);
          newState.error = e;
        }
      });

      onAction('show', () => {
        if (!map) return;
        try {
          renderer.willUnhide({ map, state: { ...newState } });
          newState.isVisible = true;
          actions.push(hiddenLayersAtom.delete(id));
        } catch (e) {
          console.error(e);
          newState.error = e;
        }
      });

      /* Download */

      onAction('download', () => {
        try {
          if (!state.isDownloadable) return;
          if (!state.source?.source) {
            console.error('Download failed, source unavailable');
            return;
          }
          downloadObject(
            state.source.source,
            `${
              state.settings?.name || state.id || 'Disaster Ninja map layer'
            }-${new Date().toISOString()}.json`,
          );
        } catch (e) {
          console.error(e);
          newState.error = e;
        }
      });

      /* Mount / Unmount */

      // enabled <--> mounted
      const syncNotFinished =
        !hasBeenDestroyed && newState.isEnabled !== newState.isMounted;
      const mountStateNotApplied = state.isMounted !== newState.isMounted;

      if (!mountStateNotApplied && syncNotFinished && !newState.isLoading) {
        try {
          if (!newState.isMounted) {
            if (map) {
              renderer.willMount({ map, state: { ...newState } });
              newState.isMounted = true;
              actions.push(mountedLayersAtom.set(id, logicalLayerAtom));
            }
          } else {
            if (map) {
              renderer.willUnMount({
                map,
                state: { ...newState },
              });
              newState.isMounted = false;
              actions.push(mountedLayersAtom.delete(id));
            }
          }
        } catch (e) {
          console.error(e);
          newState.error = e;
        }
      }

      /* Reactive updates */

      if (state.isMounted) {
        const legendHaveUpdate = state.legend !== newState.legend;
        if (legendHaveUpdate) {
          if (map)
            renderer.willLegendUpdate({
              map,
              state: { ...newState },
            });
        }

        const sourceHaveUpdate = state.source !== newState.source;
        if (sourceHaveUpdate) {
          if (map)
            renderer.willSourceUpdate({
              map,
              state: { ...newState },
            });
        }
      }
      /* Destroy */

      onAction('destroy', () => {
        /**
         * Without this layer mounted back right after destroy
         * on the next reducer run (because mountedLayersAtom changed)
         * */

        hasBeenDestroyed = true;
        try {
          renderer.willDestroy({ map, state: { ...newState } });
          actions.push(
            registry.unregister(state.id, {
              notifyLayerAboutDestroy: false, // cancel layer.destroy() call from registry
            }),
          );
        } catch (e) {
          console.error(e);
          newState.error = e;
        }
      });

      /* Schedule batched side effects */

      if (actions.length) {
        schedule((dispatch) => dispatch(actions));
      }

      // Update state only it have changes
      return newState;
    },
    { id, decorators: [memo()] }, // memo do first level compartment for recognize state changed or not
  );

  return logicalLayerAtom;
}

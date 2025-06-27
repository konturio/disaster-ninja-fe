// https://beta.plectica.com/maps/I6JK50E2F/edit/4NE4TFESC
import { deepEqual } from 'fast-equals';
import { currentMapAtom } from '~core/shared_state/currentMap';
import { createAtom } from '~utils/atoms';
import { downloadObject } from '~utils/file/download';
import { spacesToUnderscore } from '~utils/common/strings';
import { configRepo } from '~core/config';
import { FOCUSED_GEOMETRY_LOGICAL_LAYER_ID } from '~core/focused_geometry/constants';
import { REFERENCE_AREA_LOGICAL_LAYER_ID } from '~features/reference_area/constants';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { resetReferenceArea } from '~core/shared_state/referenceArea';
import { store } from '~core/store/store';
import { layersSettingsAtom } from '../atoms/layersSettings';
import { enabledLayersAtom } from '../atoms/enabledLayers';
import {
  mountedLayersAtom,
  _lastUpdatedState_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
} from '../atoms/mountedLayers';
import { hiddenLayersAtom } from '../atoms/hiddenLayers';
import { layersLegendsAtom } from '../atoms/layersLegends';
import { layersMetaAtom } from '../atoms/layersMeta';
import { layersSourcesAtom } from '../atoms/layersSources';
import { layersMenusAtom } from '../atoms/layersMenus';
import { layersEditorsAtom } from '../atoms/layersEditors';
import { deepFreeze } from './deepFreeze';
import { getMutualExcludedActions } from './getMutualExcludedActions';
import type { LayerRegistryAtom } from '../types/registry';
import type { LogicalLayerActions, LogicalLayerState } from '../types/logicalLayer';
import type { LogicalLayerRenderer } from '../types/renderer';
import type { AsyncState } from '../types/asyncState';
import type { Action } from '@reatom/core-v2';

// Utility type to make readonly properties writable
type Writable<T> = { -readonly [P in keyof T]: T[P] };

/**
 * Creates a layer-specific state atom that depends on shared atoms
 * but only extracts data relevant to the specific layer.
 * Uses deep equality to prevent unnecessary updates.
 */
function createLogicalLayerStateAtom(id: string) {
  return createAtom(
    {
      layersSettingsAtom,
      layersLegendsAtom,
      layersMetaAtom,
      layersSourcesAtom,
      enabledLayersAtom,
      mountedLayersAtom,
      hiddenLayersAtom,
      layersMenusAtom,
      layersEditorsAtom,
    },
    ({ get }, prevState: Omit<LogicalLayerState, 'error'> | null = null) => {
      const fallbackAsyncState: AsyncState<null> = {
        isLoading: false,
        data: null,
        error: null,
      };

      const asyncLayerSettings = get('layersSettingsAtom').get(id) ?? fallbackAsyncState;
      const asyncLayerMeta = get('layersMetaAtom').get(id) ?? fallbackAsyncState;
      const asyncLayerLegend = get('layersLegendsAtom').get(id) ?? fallbackAsyncState;
      const asyncLayerSource = get('layersSourcesAtom').get(id) ?? fallbackAsyncState;
      const asyncLayerEditor = get('layersEditorsAtom').get(id) ?? fallbackAsyncState;
      const layersMenus = get('layersMenusAtom').get(id) ?? null;

      let mounted = get('mountedLayersAtom');
      // TODO: Temporary fix of reatom bug. Remove after migration to v3
      if (_lastUpdatedState_DO_NOT_USE_OR_YOU_WILL_BE_FIRED !== mounted) {
        if (configRepo.get().id === '8906feaf-fc18-4180-bb5f-ff545cf65100') {
          console.debug('Apply workaround');
          mounted = _lastUpdatedState_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
        }
      }

      const newState = {
        id,
        isLoading: [
          asyncLayerSettings,
          asyncLayerMeta,
          asyncLayerLegend,
          asyncLayerSource,
        ].some((s) => s.isLoading),
        isEnabled: get('enabledLayersAtom').has(id),
        isMounted: mounted.has(id),
        isVisible: !get('hiddenLayersAtom').has(id),
        isDownloadable:
          asyncLayerSource.data?.source.type === 'geojson' ||
          asyncLayerSource.data?.style?.type === 'mcda' ||
          asyncLayerSource.data?.style?.type === 'multivariate',
        isEditable:
          (asyncLayerSource.data?.style?.type === 'mcda' ||
            asyncLayerSource.data?.style?.type === 'multivariate') &&
          !!asyncLayerSettings.data?.ownedByUser,
        settings: deepFreeze(asyncLayerSettings.data),
        meta: deepFreeze(asyncLayerMeta.data),
        legend: deepFreeze(asyncLayerLegend.data),
        source: deepFreeze(asyncLayerSource.data),
        contextMenu: deepFreeze(layersMenus),
        style: asyncLayerSource.data?.style ?? null,
        editor: deepFreeze(asyncLayerEditor.data),
      };

      // Deep equality optimization
      if (prevState && deepEqual(prevState, newState)) {
        return prevState;
      }

      return newState;
    },
    `logicalLayerStateAtom-${id}`,
  );
}

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
  clean: () => null,
};

const annotatedError =
  (id: string) =>
  (...e) =>
    console.error(`[Logical layer: ${id}]:`, ...e);

export function createLogicalLayerAtom(
  id: string,
  renderer: LogicalLayerRenderer,
  registry: LayerRegistryAtom,
  customMap?: maplibregl.Map | null,
) {
  let hasBeenDestroyed = false;
  const logicalLayerStateAtom = createLogicalLayerStateAtom(id);

  const logicalLayerAtom = createAtom(
    {
      ...logicalLayerActions,
      logicalLayerStateAtom,
      _patchState: (newState: Partial<LogicalLayerState>) => newState,
    },
    (
      { get, onAction, getUnlistedState, onInit, schedule, create },
      state: LogicalLayerState = {
        id,
        error: null,
        isEnabled: false,
        isLoading: false,
        isMounted: false,
        isEditable: false,
        isVisible: true,
        isDownloadable: false,
        settings: null,
        meta: null,
        legend: null,
        source: null,
        contextMenu: null,
        style: null,
        editor: null,
      },
    ) => {
      const actions: Action[] = [];
      const map = customMap || getUnlistedState(currentMapAtom);
      const logError = annotatedError(state.id);

      const computedState = get('logicalLayerStateAtom');

      const newState: Writable<LogicalLayerState> = {
        ...computedState,
        error: state.error,
      };

      /* Init (lazy) */

      onInit(() => {
        try {
          renderer.willInit({ map, state: { ...newState } });
        } catch (e) {
          logError(e);
          newState.error = e;
        }
      });

      /* Enable */

      onAction('enable', () => {
        newState.isEnabled = true;
        actions.push(enabledLayersAtom.set(id), ...getMutualExcludedActions(state));
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
          logError(e);
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
          logError(e);
          newState.error = e;
        }
      });

      /* Download */

      onAction('download', () => {
        try {
          if (!state.isDownloadable) return;
          if (!state.source?.source) {
            logError('Download failed, source unavailable');
            return;
          }
          if (state.source.source.type === 'geojson') {
            downloadObject(
              state.source.source.data,
              `${
                (state.settings?.name && spacesToUnderscore(state.settings.name)) ||
                state.id ||
                'map layer'
              }_${new Date().toISOString()}.geojson`,
            );
          } else if (state.source.style?.type === 'mcda') {
            downloadObject(
              state.source.style,
              `${
                state.settings?.name || state.id || 'MCDA'
              }-${new Date().toISOString()}.json`,
              2,
            );
          } else if (state.source.style?.type === 'multivariate') {
            downloadObject(
              state.source.style,
              `${
                state.settings?.name || state.id || 'MVA'
              }-${new Date().toISOString()}.json`,
              2,
            );
          } else {
            logError('Only geojson layers, MCDA or MVA can be downloaded');
          }
        } catch (e) {
          logError(e);
          newState.error = e;
        }
      });

      /* Reset */
      onAction('clean', () => {
        if (id === FOCUSED_GEOMETRY_LOGICAL_LAYER_ID) {
          schedule((dispatch) => dispatch(focusedGeometryAtom.reset()));
        }
        if (id === REFERENCE_AREA_LOGICAL_LAYER_ID) {
          resetReferenceArea(store.v3ctx);
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
          logError(e);
          newState.error = e;
        }
      }

      /* Reactive updates */

      if (state.isMounted && newState.isMounted) {
        const legendHaveUpdate = state.legend !== newState.legend;
        if (legendHaveUpdate) {
          if (map)
            try {
              renderer.willLegendUpdate({
                map,
                state: { ...newState },
              });
            } catch (e) {
              logError(e);
              newState.error = e;
            }
        }

        const sourceHaveUpdate = state.source !== newState.source;
        if (sourceHaveUpdate) {
          if (map)
            try {
              renderer.willSourceUpdate({
                map,
                state: { ...newState },
              });
            } catch (e) {
              logError(e);
              newState.error = e;
            }
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

          // make this check to avoid double unregister call
          const layersRegistryState = getUnlistedState(registry);
          if (layersRegistryState.has(state.id)) {
            actions.push(
              registry.unregister(state.id, {
                notifyLayerAboutDestroy: false, // cancel layer.destroy() call from registry
              }),
            );
          }
        } catch (e) {
          logError(e);
          newState.error = e;
        }
      });

      onAction('_patchState', (patch) => {
        Object.assign(newState, patch);
      });
      /* Schedule batched side effects */

      if (actions.length) {
        schedule((dispatch) => {
          dispatch(actions);
          renderer.setErrorState((e) => {
            logError(e);
            dispatch(create('_patchState', { error: e.message }));
          });
        });
      }

      // Update state only it have changes
      return newState;
    },
    { id, decorators: [] },
  );

  return logicalLayerAtom;
}

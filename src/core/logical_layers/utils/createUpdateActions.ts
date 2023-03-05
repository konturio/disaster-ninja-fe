import { layersLegendsAtom } from '~core/logical_layers/atoms/layersLegends';
import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
import { layersMetaAtom } from '~core/logical_layers/atoms/layersMeta';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';
import { layersMenusAtom } from '~core/logical_layers/atoms/layersMenus';
import type { Action } from '@reatom/core-v2';
import type { LayerLegend } from '../types/legends';
import type { LayerMeta } from '../types/meta';
import type { LayerSettings } from '../types/settings';
import type { LayerSource } from '../types/source';
import type { LayerContextMenu } from '../types/contextMenu';
import type { AsyncState } from '../types/asyncState';

export interface LayersUpdate {
  id: string;
  legend?: LayerLegend;
  source?: LayerSource;
  meta?: LayerMeta;
  settings?: LayerSettings;
  menu?: LayerContextMenu;
}

type LayerId = string;
type LayersBatchedUpdate = {
  legend: [LayerId, LayerLegend][];
  source: [LayerId, LayerSource][];
  meta: [LayerId, LayerMeta][];
  settings: [LayerId, LayerSettings][];
  menu: [LayerId, LayerContextMenu][];
};

const createBatchedUpdateMap = (): LayersBatchedUpdate => ({
  legend: [],
  source: [],
  meta: [],
  settings: [],
  menu: [],
});

const wrapInAsyncState = <T>([id, data]: [string, T]): [string, AsyncState<T>] => [
  id,
  { data, isLoading: false, error: null },
];

/**
 * Util for fast generate bunch of update various layer data
 * @returns Bunch of update and cleanup actions
 * */
export function createUpdateLayerActions(updates: LayersUpdate[]) {
  const batchedUpdates = updates.reduce((acc, { id, ...update }) => {
    Object.keys(update).forEach((key) => {
      acc[key].push([id, update[key]]);
    });
    return acc;
  }, createBatchedUpdateMap());

  const updateActions: Action[] = [];
  const cleanupActions: Action[] = [];

  if (batchedUpdates.legend.length) {
    const update = batchedUpdates.legend.map(wrapInAsyncState);
    updateActions.push(
      layersLegendsAtom.change((state) => {
        return new Map([...state, ...update]);
      }),
    );
  }

  if (batchedUpdates.source.length) {
    const update = batchedUpdates.source.map(wrapInAsyncState);
    updateActions.push(
      layersSourcesAtom.change((state) => {
        return new Map([...state, ...update]);
      }),
    );
  }

  if (batchedUpdates.meta.length) {
    const update = batchedUpdates.meta.map(wrapInAsyncState);
    updateActions.push(
      layersMetaAtom.change((state) => {
        return new Map([...state, ...update]);
      }),
    );
  }

  if (batchedUpdates.settings.length) {
    const update = batchedUpdates.settings.map(wrapInAsyncState);
    updateActions.push(
      layersSettingsAtom.change((state) => {
        return new Map([...state, ...update]);
      }),
    );
  }

  if (batchedUpdates.menu.length) {
    const update = batchedUpdates.menu;
    updateActions.push(
      layersMenusAtom.change((state) => {
        return new Map([...state, ...update]);
      }),
    );
  }

  return [updateActions, cleanupActions];
}

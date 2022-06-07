import type { Action } from '@reatom/core';
import type { LayerLegend } from '../types/legends';
import type { LayerMeta } from '../types/meta';
import type { LayerSettings } from '../types/settings';
import type { LayerSource } from '../types/source';
import type { LayerContextMenu } from '../types/contextMenu';
import { layersLegendsAtom } from '~core/logical_layers/atoms/layersLegends';
import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
import { layersMetaAtom } from '~core/logical_layers/atoms/layersMeta';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';
import { layersMenusAtom } from '~core/logical_layers/atoms/layersMenus';

export interface LayersUpdate {
  legend?: LayerLegend;
  source?: LayerSource;
  meta?: LayerMeta;
  settings?: LayerSettings;
  menu?: LayerContextMenu;
}

/**
 * Util for fast generate bunch of update various layer data
   @param id layer id
 * @param update object with data wor layer atoms
   @param actions - actions arrays that will be extended
 * @returns Bunch of update and cleanup actions
 * */
export function createUpdateLayerActions(
  id: string,
  update: LayersUpdate,
  // Extend existing actions
  actions?: [Action[], Action[]],
) {
  const updateActions: Action[] = actions ? actions[0] : [];
  const cleanupActions: Action[] = actions ? actions[1] : [];

  if (update.legend) {
    updateActions.push(
      layersLegendsAtom.set(id, {
        isLoading: false,
        error: null,
        data: update.legend,
      }),
    );
    cleanupActions.push(layersLegendsAtom.delete(id));
  }

  if (update.source) {
    updateActions.push(
      layersSourcesAtom.set(id, {
        isLoading: false,
        error: null,
        data: update.source,
      }),
    );
    cleanupActions.push(layersSourcesAtom.delete(id));
  }

  if (update.meta) {
    updateActions.push(
      layersMetaAtom.set(id, {
        isLoading: false,
        error: null,
        data: update.meta,
      }),
    );
    cleanupActions.push(layersMetaAtom.delete(id));
  }

  if (update.settings) {
    updateActions.push(
      layersSettingsAtom.set(id, {
        isLoading: false,
        error: null,
        data: update.settings,
      }),
    );
    cleanupActions.push(layersSettingsAtom.delete(id));
  }

  if (update.menu) {
    updateActions.push(layersMenusAtom.set(id, update.menu));
    cleanupActions.push(layersSettingsAtom.delete(id));
  }

  return [updateActions, cleanupActions];
}

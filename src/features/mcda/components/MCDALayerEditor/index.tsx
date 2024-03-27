import { useAtom } from '@reatom/npm-react';
import { useCallback } from 'react';
import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
import { store } from '~core/store/store';
import { createUpdateLayerActions } from '~core/logical_layers/utils/createUpdateActions';
import { deepCopy } from '~core/logical_layers/utils/deepCopy';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';
import s from './style.module.css';
import { MCDALayerDetails } from './MCDALayerDetails/MCDALayerDetails';
import type {
  MCDAConfig,
  MCDALayer,
} from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { LayerEditorProps } from '~core/logical_layers/types/editors';
import type { Action } from '@reatom/core-v2';

function updateMCDAConfig(config: MCDAConfig) {
  const id = config.id;
  const oldSource = layersSourcesAtom.getState().get(id)?.data;
  if (oldSource) {
    const newSource = deepCopy(oldSource);
    if (newSource?.style?.config) {
      newSource.style.config = { ...config };
    }
    const actions: Array<Action> = [
      enabledLayersAtom.delete(id),
      ...createUpdateLayerActions([
        {
          id,
          source: newSource,
        },
      ]).flat(),
    ];

    store.dispatch(actions);
    store.dispatch(enabledLayersAtom.set(id));
  }
}

export function MCDALayerEditor({ layerId }: LayerEditorProps) {
  const [mcdaConfig] = useAtom(
    (ctx) => {
      const layerSource = ctx.spy(layersSourcesAtom.v3atom).get(layerId);
      return layerSource?.data?.style?.config;
    },
    [layerId],
  );

  const onLayerEdited = useCallback(
    (editedMCDALayer: MCDALayer) => {
      if (!!mcdaConfig) {
        const newLayers = (mcdaConfig?.layers ?? []).map((oldLayer) =>
          oldLayer.id === editedMCDALayer.id ? editedMCDALayer : oldLayer,
        );
        const editedConfig = { ...mcdaConfig, layers: newLayers };
        updateMCDAConfig(editedConfig);
      }
    },
    [mcdaConfig],
  );

  if (!mcdaConfig) return null;

  return (
    <div className={s.editor}>
      {mcdaConfig.layers.map((layer) => (
        <MCDALayerDetails
          key={layer.id}
          layer={layer}
          mcdaConfig={mcdaConfig}
          onLayerEdited={onLayerEdited}
        />
      ))}
    </div>
  );
}

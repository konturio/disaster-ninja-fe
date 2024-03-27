import { useAtom } from '@reatom/npm-react';
import { useCallback } from 'react';
import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
import { applyNewMCDAConfig } from '~features/mcda/utils/applyNewMCDAConfig';
import s from './style.module.css';
import { MCDALayerDetails } from './MCDALayerDetails/MCDALayerDetails';
import type { MCDALayer } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { LayerEditorProps } from '~core/logical_layers/types/editors';

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
        applyNewMCDAConfig(editedConfig);
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

import { useAtom } from '@reatom/npm-react';
import { useCallback, useMemo } from 'react';
import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
import { applyNewMCDAConfig } from '~features/mcda/utils/applyNewMCDAConfig';
import s from './style.module.css';
import { MCDALayerParameters } from './MCDALayerParameters/MCDALayerParameters';
import type { MCDALayer } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { LayerEditorProps } from '~core/logical_layers/types/editors';

export function MCDALayerEditor({ layerId }: LayerEditorProps) {
  const [layerStyle] = useAtom(
    (ctx) => {
      const layerSource = ctx.spy(layersSourcesAtom.v3atom).get(layerId);
      return layerSource?.data?.style;
    },
    [layerId],
  );

  const mcdaConfig = useMemo(
    () => (layerStyle?.type === 'mcda' ? layerStyle.config : null),
    [layerStyle],
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
        <MCDALayerParameters key={layer.id} layer={layer} onLayerEdited={onLayerEdited} />
      ))}
    </div>
  );
}

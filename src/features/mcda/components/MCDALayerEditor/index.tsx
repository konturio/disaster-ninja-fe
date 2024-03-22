import { useAction, useAtom } from '@reatom/npm-react';
import { InfoOutline16, Edit16 } from '@konturio/default-icons';
import { useCallback, useState } from 'react';
import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
import s from './style.module.css';
import { MCDALayerLegend } from './MCDALayerLegend';
import type { MCDALayer } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { LayerEditorProps } from '~core/logical_layers/types/editors';

export function MCDALayerEditor({ layerId }: LayerEditorProps) {
  const [layerSource] = useAtom(
    (ctx) => {
      const layerSource = ctx.spy(layersSourcesAtom.v3atom).get(layerId);
      return layerSource?.data;
    },
    [layerId],
  );

  const onLayerEdited = useCallback((editedMCDALayer: MCDALayer) => {}, []);

  const mcdaConfig = layerSource?.style?.config;
  if (!mcdaConfig) return null;

  // const updateLayerSource = useAction((ctx, source) => layersSourcesAtom.v3atom(ctx, source))

  return (
    <div className={s.editor}>
      {mcdaConfig.layers.map((layer) => (
        <MCDALayerLegend
          key={layer.id}
          layer={layer}
          mcdaConfig={mcdaConfig}
          onLayerEdited={onLayerEdited}
        />
      ))}
    </div>
  );
}

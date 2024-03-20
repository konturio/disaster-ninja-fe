import { useAction, useAtom } from '@reatom/npm-react';
import { InfoOutline16, Edit16 } from '@konturio/default-icons';
import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
import { Sentiments } from './Sentiments';
import s from './style.module.css';
import type { LayerEditorProps } from '~core/logical_layers/types/editors';

export function MCDALayerEditor({ layerId }: LayerEditorProps) {
  const [layerSource] = useAtom(
    (ctx) => {
      const layerSource = ctx.spy(layersSourcesAtom.v3atom).get(layerId);
      return layerSource?.data;
    },
    [layerId],
  );

  const mcdaConfig = layerSource?.style?.config;
  if (!mcdaConfig) return null;

  // const updateLayerSource = useAction((ctx, source) => layersSourcesAtom.v3atom(ctx, source))
  layerSource?.style?.config;
  return (
    <div className={s.editor}>
      {mcdaConfig.layers.map((layer) => (
        <div key={layer.id} className={s.layer}>
          <div className={s.layerHeader}>
            <div>{layer.name}</div>
            <div className={s.layerButtons}>
              <div className={s.editButton} onClick={() => {}}>
                <Edit16 />
              </div>
              <div className={s.infoButton} onClick={() => {}}>
                <InfoOutline16 />
              </div>
            </div>
          </div>
          <Sentiments
            right={{
              label: layer.sentiment.at(0)!, // Sentiments name needed instead of id
              color: 'red',
              value: String(layer.range.at(0)),
            }}
            left={{
              label: layer.sentiment.at(1)!,
              color: 'green',
              value: String(layer.range.at(1)),
            }}
            units={layer.unit}
          />
        </div>
      ))}
    </div>
  );
}

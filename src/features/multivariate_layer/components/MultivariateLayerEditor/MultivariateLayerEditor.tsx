import { useAtom } from '@reatom/npm-react';
import { useMemo } from 'react';
import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
import { i18n } from '~core/localization';
import s from './MultivariateLayerEditor.module.css';
import type { MCDALayer } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { LayerEditorProps } from '~core/logical_layers/types/editors';

export function MultivariateLayerEditor({ layerId }: LayerEditorProps) {
  const [layerStyle] = useAtom(
    (ctx) => {
      const layerSource = ctx.spy(layersSourcesAtom.v3atom).get(layerId);
      return layerSource?.data?.style;
    },
    [layerId],
  );

  const layerConfig = useMemo(
    () => (layerStyle?.type === 'multivariate' ? layerStyle.config : null),
    [layerStyle],
  );
  if (!layerConfig) return null;

  const printMCDAAxes = (dimensionName: string, axes: MCDALayer[]) => {
    return (
      <div>
        <div className={s.dimension}>{dimensionName}</div>
        {axes.map((layer, index) => (
          <div key={`${layer.id}-${index}`} className={s.parameter}>
            - {layer.name}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={s.editor}>
      {!!layerConfig.score?.config.layers.length &&
        printMCDAAxes(i18n.t('multivariate.score'), layerConfig.score.config.layers)}
      {!!layerConfig.base?.config.layers.length &&
        printMCDAAxes(i18n.t('multivariate.compare'), layerConfig.base.config.layers)}
    </div>
  );
}

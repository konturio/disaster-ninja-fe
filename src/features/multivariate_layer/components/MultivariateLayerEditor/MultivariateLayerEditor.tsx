import { useAtom } from '@reatom/npm-react';
import { useMemo } from 'react';
import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
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
        {axes.map((layer) => (
          <div key={layer.id} className={s.parameter}>
            - {layer.name}
          </div>
        ))}
      </div>
    );
  };

  const printValue = (
    dimensionName: string,
    paramName: string,
    value: number | string,
  ) => {
    return (
      <div>
        <div className={s.dimension}>{dimensionName}</div>
        <div className={s.parameter}>
          {paramName}: - {value.toString()}
        </div>
      </div>
    );
  };

  return (
    <div className={s.editor}>
      {printMCDAAxes('Base', layerConfig.base.config.layers)}
      {layerConfig.annex?.config.layers.length &&
        printMCDAAxes('Annex', layerConfig.annex.config.layers)}
      {typeof layerConfig.strength === 'number'
        ? printValue('Strength', 'strength', layerConfig.strength)
        : layerConfig.strength?.type === 'mcda' &&
          printMCDAAxes('Strength', layerConfig.strength.config.layers)}
      {typeof layerConfig.extrusionMax === 'number'
        ? printValue('ExtrusionMax', 'extrusionMax', layerConfig.extrusionMax)
        : layerConfig.extrusionMax?.type === 'mcda' &&
          printMCDAAxes('ExtrusionMax', layerConfig.extrusionMax.config.layers)}
      {typeof layerConfig.extrusionMin === 'number'
        ? printValue('ExtrusionMin', 'extrusionMin', layerConfig.extrusionMin)
        : layerConfig.extrusionMin?.type === 'mcda' &&
          printMCDAAxes('ExtrusionMin', layerConfig.extrusionMin.config.layers)}
    </div>
  );
}

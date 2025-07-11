import { SimpleLegend } from '~components/SimpleLegend/SimpleLegend';
import { sentimentReversed } from '~core/logical_layers/renderers/stylesConfigs/mcda/calculations/constants';
import { arraysAreEqualWithStrictOrder } from '~utils/common/equality';
import { i18n } from '~core/localization';
import type {
  MCDAConfig,
  MCDALayer,
} from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { SimpleLegendStep } from '~core/logical_layers/types/legends';

export type OpacityStepType = {
  fillColor: string;
  label?: string;
};

function joinLayerNames(names: string[]): string {
  return names.join(', ');
}

export default function OpacityStepsLegend({ config }: { config: MCDAConfig }) {
  const reversedLayers: MCDALayer[] = [];
  const defaultDirectionLayers: MCDALayer[] = [];
  config.layers
    .filter((layer) => layer.name)
    .forEach((layer) => {
      if (arraysAreEqualWithStrictOrder(layer.sentiment, sentimentReversed)) {
        reversedLayers.push(layer);
      } else {
        defaultDirectionLayers.push(layer);
      }
    });
  const reversedLow = reversedLayers.length
    ? `${i18n.t('bivariate.legend.low')} ${joinLayerNames(reversedLayers.map((v) => v.name))}`
    : '';
  const reversedHigh = reversedLayers.length
    ? `${i18n.t('bivariate.legend.high')} ${joinLayerNames(reversedLayers.map((v) => v.name))}`
    : '';
  const defaultHigh = defaultDirectionLayers.length
    ? `${i18n.t('bivariate.legend.high')} ${joinLayerNames(defaultDirectionLayers.map((v) => v.name))}`
    : '';
  const defaultLow = defaultDirectionLayers.length
    ? `${i18n.t('bivariate.legend.low')} ${joinLayerNames(defaultDirectionLayers.map((v) => v.name))}`
    : '';

  const steps: SimpleLegendStep[] = [
    {
      // high opacity
      stepName: [reversedLow, defaultHigh].filter(Boolean),
      stepShape: 'square',
      style: { 'fill-color': '#5AC87FFF', width: 0 },
    },
    {
      stepName: '',
      stepShape: 'square',
      style: { 'fill-color': '#5AC87F66', width: 0 },
    },
    {
      // low opacity
      stepName: [defaultLow, reversedHigh].filter(Boolean),
      stepShape: 'square',
      style: { 'fill-color': '#5AC87F33', width: 0 },
    },
  ];
  const legendConfig = {
    type: 'simple' as const,
    name: 'opacity',
    steps: steps,
  };

  return <SimpleLegend legend={legendConfig} />;
}

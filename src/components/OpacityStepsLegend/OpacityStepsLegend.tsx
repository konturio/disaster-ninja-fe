import { SimpleLegend } from '~components/SimpleLegend/SimpleLegend';
import { i18n } from '~core/localization';
import type { MCDALayer } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { SimpleLegendStep } from '~core/logical_layers/types/legends';

export type OpacityStepType = {
  fillColor: string;
  label?: string;
};

function joinLayerNames(names: string[]): string {
  return names.join(', ');
}

export default function OpacityStepsLegend({
  directLayers,
  reversedLayers,
}: {
  directLayers: MCDALayer[];
  reversedLayers: MCDALayer[];
}) {
  const reversedLow = reversedLayers.length
    ? `${i18n.t('bivariate.legend.low')} ${joinLayerNames(reversedLayers.map((v) => v.name))}`
    : '';
  const reversedHigh = reversedLayers.length
    ? `${i18n.t('bivariate.legend.high')} ${joinLayerNames(reversedLayers.map((v) => v.name))}`
    : '';
  const directHigh = directLayers.length
    ? `${i18n.t('bivariate.legend.high')} ${joinLayerNames(directLayers.map((v) => v.name))}`
    : '';
  const directLow = directLayers.length
    ? `${i18n.t('bivariate.legend.low')} ${joinLayerNames(directLayers.map((v) => v.name))}`
    : '';

  const steps: SimpleLegendStep[] = [
    {
      // high opacity
      stepName: [reversedLow, directHigh].filter(Boolean),
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
      stepName: [directLow, reversedHigh].filter(Boolean),
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

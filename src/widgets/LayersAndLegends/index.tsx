import { LayersAndLegends } from './components/LayersAndLegends';
import type { PanelFeatureInterface } from 'types/featuresTypes';

type WidgetProps = {
  isLegendOn?: boolean;
  legend: PanelFeatureInterface;
  isLayersOn?: boolean;
  layers: PanelFeatureInterface;
};
export const LayersAndLegendsWidget = ({
  legend,
  layers,
  isLegendOn,
  isLayersOn,
}: WidgetProps) => {
  return (
    <LayersAndLegends
      layersProps={isLayersOn ? layers : undefined}
      legendProps={isLegendOn ? legend : undefined}
    />
  );
};

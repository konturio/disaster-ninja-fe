import { LayersAndLegends } from './components/LayersAndLegends';
import type { PanelFeatureInterface } from 'types/featuresTypes';

type WidgetProps = {
  legendFeatureIsOn?: boolean;
  legendPanelInterface: PanelFeatureInterface;
  layersFeatureIsOn?: boolean;
  layersPanelInterface: PanelFeatureInterface;
};
export const LayersAndLegendsWidget = ({
  legendPanelInterface,
  layersPanelInterface,
  legendFeatureIsOn,
  layersFeatureIsOn,
}: WidgetProps) => {
  return (
    <LayersAndLegends
      legendMinHeight={legendPanelInterface.minHeight}
      legendPanelContent={legendFeatureIsOn && legendPanelInterface.content}
      legendIcon={legendFeatureIsOn && legendPanelInterface.panelIcon}
      legendHeader={legendPanelInterface.header}
      layersPanelContent={layersFeatureIsOn && layersPanelInterface.content}
      layersIcon={layersFeatureIsOn && layersPanelInterface.panelIcon}
      layersMinHeight={layersPanelInterface.minHeight}
      layersHeader={layersPanelInterface.header}
    />
  );
};

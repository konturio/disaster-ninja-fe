import { createBindAtom } from '~utils/atoms';
import { logicalLayersRegistryAtom } from '~core/logical_layers/atoms/logicalLayersRegistry';
import { createLogicalLayerAtom } from '~core/logical_layers/createLogicalLayerAtom';
import { layersInAreaResourceAtom } from './layersInArea';
import { GenericLayer } from '../layers/GenericLayer';
import { focusedGeometryAtom } from '~core/shared_state';
import { LayerInArea } from '~features/layers_in_area/types';
import { generateBivariateStyleForAxis } from '@k2-packages/bivariate-tools';
import config from '~core/app_config';
import { BivariateLegend, BivariateLegendBackend } from '~core/logical_layers/createLogicalLayerAtom/types';
import {
  BivariateLayerStyle,
  generateLayerStyleFromBivariateLegendBackend,
} from '~utils/bivariate/bivariateColorThemeUtils';
import { BivariateLayer } from '~features/bivariate_manager/layers/BivariateLayer';

export const layersInAreaLogicalLayersAtom = createBindAtom(
  {
    layersInAreaResourceAtom,
  },
  ({ get, schedule, getUnlistedState }) => {
    const { data: layersInArea, loading } = get('layersInAreaResourceAtom');

    if (layersInArea && !loading) {
      const currentRegistry = getUnlistedState(logicalLayersRegistryAtom);
      const registry = new Set(Object.keys(currentRegistry));
      const newLayers = layersInArea.filter((l) => !registry.has(l.id));
      /* Create logical layers and wrap into atoms */
      const logicalLayersAtoms = newLayers.map((layer: LayerInArea) => {
        if (layer.group === 'bivariate') {
          const bl = layer.legend as BivariateLegendBackend;
          if (!bl) return null;
          const xAxis = {...bl.axises.x, steps: bl.axises.x.steps.map(stp => ({value: stp}))};
          const yAxis = {...bl.axises.y, steps: bl.axises.y.steps.map(stp => ({value: stp}))};
          bl.axises = { x: xAxis, y: yAxis } as any;
          const bivariateStyle = generateLayerStyleFromBivariateLegendBackend(bl);
          const bivariateLegend: BivariateLegend = {
            name: layer.name,
            type: "bivariate",
            axis: bl.axises,
            copyrights: layer.copyrights || [],
            description: layer.description || '',
            steps: bl.colors.map(clr => ({ label: clr.id, color: clr.color }))
          };

          return createLogicalLayerAtom(
            new BivariateLayer(
              layer.name,
              bivariateStyle,
              bivariateLegend,
            ),
          );
        } else {
          return createLogicalLayerAtom(new GenericLayer(layer), focusedGeometryAtom);
        }
      });
      if (logicalLayersAtoms.length > 0) {
        /* Batch actions into one transaction */
        schedule((dispatch) => {
          dispatch(logicalLayersRegistryAtom.registerLayer(logicalLayersAtoms));
        });
      }
    }
  },
  'layersInAreaLogicalLayers',
);

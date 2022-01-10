import type { Action } from '@reatom/core';
import { createBindAtom } from '~utils/atoms';
import { logicalLayersRegistryAtom } from '~core/logical_layers/atoms/logicalLayersRegistry';
import { createLogicalLayerAtom, LogicalLayerAtom } from '~core/logical_layers/createLogicalLayerAtom';
import { layersInAreaResourceAtom } from './layersInArea';
import { GenericLayer } from '../layers/GenericLayer';
import { focusedGeometryAtom } from '~core/shared_state';
import { LayerInArea } from '../types';
import { BivariateLegend, BivariateLegendBackend } from '~core/logical_layers/createLogicalLayerAtom/types';
import {
  convertRGBtoObj,
  generateLayerStyleFromBivariateLegendBackend,
} from '~utils/bivariate/bivariateColorThemeUtils';
import { BivariateLayer } from '~features/bivariate_manager/layers/BivariateLayer';

type LayersInAreaAtomProps = {
  loading: boolean;
  data?: LayerInArea[] | null;
  error: unknown;
};

export const layersInAreaLogicalLayersAtom = createBindAtom(
  {
    layersInAreaResourceAtom,
  },
  ({ onChange, schedule }) => {
    onChange(
      'layersInAreaResourceAtom',
      (
        { loading, data: newLayers, error }: LayersInAreaAtomProps,
        prevData: LayersInAreaAtomProps | null,
      ) => {
        if (loading) return null;
        const oldLayers: LayerInArea[] = prevData?.data || [];
        const actions: Action[] = [];

        /* Find what added */
        const oldLayersIds = new Set(oldLayers.map((l) => l.id));
        const mustBeRegistered = newLayers
          ? newLayers.filter((l) => !oldLayersIds.has(l.id))
          : [];
        const logicalLayersAtoms = mustBeRegistered.reduce((acc: LogicalLayerAtom[], layer) => {
            if (layer.legend?.type === 'bivariate') {
              const bl = layer.legend as BivariateLegendBackend;
              if (!bl) return acc;

              // add opacity .5 to colors
              bl.colors = bl.colors.map(clr => {
                const clrObj = convertRGBtoObj(clr.color);
                return { id: clr.id, color: `rgba(${clrObj.r},${clrObj.g},${clrObj.b},0.5)`}
              });

              const bivariateStyle = generateLayerStyleFromBivariateLegendBackend(bl);
              const bivariateLegend: BivariateLegend = {
                name: layer.name,
                type: "bivariate",
                axis: { x: bl.axes.y, y: bl.axes.x },
                copyrights: layer.copyrights || [],
                description: layer.description || '',
                steps: bl.colors.map(clr => ({ label: clr.id, color: clr.color }))
              };

              acc.push(createLogicalLayerAtom(
                new BivariateLayer(
                  layer.name,
                  bivariateStyle,
                  bivariateLegend,
                ),
              ));
            } else {
              acc.push(createLogicalLayerAtom(new GenericLayer(layer), focusedGeometryAtom))
            }
            return acc;
        }, []

        );
        if (logicalLayersAtoms.length > 0) {
          actions.push(
            logicalLayersRegistryAtom.registerLayer(logicalLayersAtoms),
          );
        }

        /* Find what removed */
        const newLayersIds = new Set(
          newLayers ? newLayers.map((l) => l.id) : [],
        );
        const mustBeUnregistered = oldLayers.filter(
          (layer) => !newLayersIds.has(layer.id),
        );

        mustBeUnregistered.forEach((config) => {
          const action = logicalLayersRegistryAtom.unregisterLayer(config.id);
          actions.push(action);
        });

        /* Batch actions into one transaction */
        if (actions.length > 0) {
          schedule((dispatch) => {
            dispatch(actions);
          });
        }
      },
    );
  },
  'layersInAreaLogicalLayers',
);

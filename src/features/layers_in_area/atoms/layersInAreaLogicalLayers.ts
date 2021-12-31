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
  error: any;
};

function isValidTimestamp(_timestamp) {
  const dt = new Date(_timestamp);
  const newTimestamp = new Date(_timestamp).getTime();
  return isNumeric(newTimestamp) && dt.getFullYear() > 1970;
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

const makeLabel = (step) => {
  let parsed = parseFloat(step);
  if (!isNaN(parsed)) {
    parsed *= 1000;
    if (isValidTimestamp(parsed)) {
      const date = new Date(parsed);
      return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`;
    }
  }
  return '';
}

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

              const xAxis = {...bl.axises.x, steps: bl.axises.x.steps.map(stp => ({value: stp, label: makeLabel(stp)}))};
              const yAxis = {...bl.axises.y, steps: bl.axises.y.steps.map(stp => ({value: stp, label: makeLabel(stp)}))};
              bl.axises = { x: xAxis, y: yAxis } as any;

              // add opacity .5 to colors
              bl.colors = bl.colors.map(clr => {
                const clrObj = convertRGBtoObj(clr.color);
                return { id: clr.id, color: `rgba(${clrObj.r},${clrObj.g},${clrObj.b},0.5)`}
              });

              const bivariateStyle = generateLayerStyleFromBivariateLegendBackend(bl);
              const bivariateLegend: BivariateLegend = {
                name: layer.name,
                type: "bivariate",
                axis: { x: yAxis, y: xAxis } as any,
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

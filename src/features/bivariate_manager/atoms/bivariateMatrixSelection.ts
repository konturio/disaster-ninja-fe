import { createAtom } from '~utils/atoms';
import { bivariateStatisticsResourceAtom } from '~features/bivariate_manager/atoms/bivariateStatisticsResource';
import { BivariateLayerStyle, generateColorThemeAndBivariateStyle } from '~utils/bivariate/bivariateColorThemeUtils';
import { createBivariateLegend } from '~utils/bivariate/bivariateLegendUtils';
import { ColorTheme } from '~core/types';
import { layersRegistryAtom } from '~core/logical_layers/atoms/layersRegistry';
import { bivariateNumeratorsAtom } from '~features/bivariate_manager/atoms/bivariateNumerators';
import { createLayerActionsFromLayerInArea } from '~features/layers_in_area/atoms/areaLayers';
import { Action } from '@reatom/core';

export const bivariateMatrixSelectionAtom = createAtom(
  {
    setMatrixSelection: (
      xNumerator: string | null,
      xDenominator: string | null,
      yNumerator: string | null,
      yDenominator: string | null,
    ) => ({ xNumerator, xDenominator, yNumerator, yDenominator }),
  },
  (
    { onAction, schedule, getUnlistedState },
    state: {
      xNumerator: string | null;
      xDenominator: string | null;
      yNumerator: string | null;
      yDenominator: string | null;
    } = {
      xNumerator: null,
      xDenominator: null,
      yNumerator: null,
      yDenominator: null,
    },
  ) => {
    onAction('setMatrixSelection', (selection) => {
      state = selection;

      const { xNumerator, xDenominator, yNumerator, yDenominator } = selection;
      if (xNumerator === null || yNumerator === null) return;

      const { xGroups, yGroups } = getUnlistedState(
        bivariateNumeratorsAtom,
      );
      const bivariateStatisticsResource = getUnlistedState(
        bivariateStatisticsResourceAtom,
      ).data;
      if (bivariateStatisticsResource === null) return;
      const stats =
        bivariateStatisticsResource.polygonStatistic.bivariateStatistic;

      if (
        !xGroups ||
        !yGroups ||
        !xGroups.length ||
        !yGroups.length
      )
        return;

      if (!xDenominator || !yDenominator) return;

      const res = generateColorThemeAndBivariateStyle(
        xNumerator,
        xDenominator,
        yNumerator,
        yDenominator,
        stats,
      );
      if (res) {
        const [colorTheme, bivariateStyle] = res;
        const legend = createBivariateLegend(
          'Bivariate Layer',
          colorTheme as ColorTheme,
          xNumerator,
          xDenominator,
          yNumerator,
          yDenominator,
          stats,
        );

        if (legend) {
          const id = (bivariateStyle as BivariateLayerStyle).id;
          const layerInArea = {
            id,
            name: 'Bivariate Layer',
            category: 'overlay' as 'overlay' | 'base',
            group: 'bivariate',
            legend,
            boundaryRequiredForRetrieval: false,
          };

          const actions = createLayerActionsFromLayerInArea(id, layerInArea);

          const currentRegistry = getUnlistedState(layersRegistryAtom);
          for (const [layerId, layer] of Array.from(currentRegistry)) {
            const layerData = getUnlistedState(layer);
            if (layerData.legend?.type === 'bivariate' && layerData.legend?.name === 'Bivariate Layer') {
                actions.push(layersRegistryAtom.unregister(layerId));
            }
            if (layerData.id === id) {
              actions.push(layer.show());
            }
          }

          if (actions.length) {
            schedule((dispatch) => {
              dispatch(actions);
              console.log('new state', getUnlistedState(layersRegistryAtom));
            });
          }
        }
      }
    });

    return state;
  },
  'bivariateMatrixSelection',
);

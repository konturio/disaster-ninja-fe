import { createAtom } from '~utils/atoms';
import { bivariateStatisticsResourceAtom } from '~features/bivariate_manager/atoms/bivariateStatisticsResource';
import {
  BivariateLayerStyle,
  generateColorThemeAndBivariateStyle,
} from '~utils/bivariate/bivariateColorThemeUtils';
import { createBivariateLegend } from '~utils/bivariate/bivariateLegendUtils';
import { ColorTheme } from '~core/types';
import { layersRegistryAtom } from '~core/logical_layers/atoms/layersRegistry';
import { bivariateNumeratorsAtom } from '~features/bivariate_manager/atoms/bivariateNumerators';
import { createLayerActionsFromLayerInArea } from '~features/layers_in_area/atoms/areaLayers';
import { TileSource } from '~features/layers_in_area/types';

export const bivariateMatrixSelectionAtom = createAtom(
  {
    setMatrixSelection: (
      xNumerator: string | null,
      xDenominator: string | null,
      yNumerator: string | null,
      yDenominator: string | null,
    ) => ({ xNumerator, xDenominator, yNumerator, yDenominator }),
    enableBivariateLayer: (layerId: string) => layerId,
  },
  (
    { onAction, schedule, getUnlistedState, create },
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

      const { xGroups, yGroups } = getUnlistedState(bivariateNumeratorsAtom);
      const bivariateStatisticsResource = getUnlistedState(
        bivariateStatisticsResourceAtom,
      ).data;
      if (bivariateStatisticsResource === null) return;
      const stats =
        bivariateStatisticsResource.polygonStatistic.bivariateStatistic;

      if (!xGroups || !yGroups || !xGroups.length || !yGroups.length) return;

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
          const bivStyle = bivariateStyle as BivariateLayerStyle;
          const id = bivStyle.id;
          const layerInArea = {
            id,
            name: 'Bivariate Layer',
            category: 'overlay' as 'overlay' | 'base',
            group: 'bivariate',
            legend,
            boundaryRequiredForRetrieval: false,
            source: bivStyle.source as TileSource,
          };

          const actions = createLayerActionsFromLayerInArea(id, layerInArea);

          const currentRegistry = getUnlistedState(layersRegistryAtom);
          for (const [layerId, layer] of Array.from(currentRegistry)) {
            const layerData = getUnlistedState(layer);
            if (
              layerData.legend?.type === 'bivariate' &&
              layerData.legend?.name === 'Bivariate Layer'
            ) {
              actions.unshift(layersRegistryAtom.unregister(layerId));
              actions.unshift(layer.disable());
              actions.unshift(layer.hide());
            }
          }

          actions.push(create('enableBivariateLayer', id));

          if (actions.length) {
            schedule((dispatch) => {
              dispatch(actions);
            });
          }
        }
      }
    });

    onAction('enableBivariateLayer', (lId: string) => {
      const currentRegistry = getUnlistedState(layersRegistryAtom);
      for (const [layerId, layer] of Array.from(currentRegistry)) {
        if (layerId === lId) {
          schedule((dispatch) => {
            dispatch(layer.enable());
          });
          break;
        }
      }
    });

    return state;
  },
  'bivariateMatrixSelection',
);

import { createBindAtom } from '~utils/atoms';
import { bivariateStatisticsResourceAtom } from '~features/bivariate_manager/atoms/bivariateStatisticsResource';
import { Stat } from '@k2-packages/bivariate-tools';
import {
  BivariateLayerStyle,
  generateColorThemeAndBivariateStyle,
} from '~utils/bivariate/bivariateColorThemeUtils';
import { createBivariateLegend } from '~utils/bivariate/bivariateLegendUtils';
import { ColorTheme } from '~appModule/types';
import { logicalLayersRegistryAtom } from '~core/shared_state';
import {
  LogicalLayerAtom,
  createLogicalLayerAtom,
} from '~core/logical_layers/createLogicalLayerAtom';
import { BivariateLayer } from '~features/bivariate_manager/layers/BivariateLayer';

export const bivariateOverlayLayersAtom = createBindAtom(
  {
    bivariateStatisticsResourceAtom,
  },
  ({ get, schedule, getUnlistedState }) => {
    const { data: statisticsData, loading } = get(
      'bivariateStatisticsResourceAtom',
    );

    if (statisticsData && !loading) {
      const stats: Stat = statisticsData.polygonStatistic.bivariateStatistic;
      if (!stats.overlays || !stats.overlays.length) return;

      const currentRegistry = getUnlistedState(logicalLayersRegistryAtom);
      const registry = new Set(Object.keys(currentRegistry));

      const layers: LogicalLayerAtom[] = [];

      stats.overlays.forEach((overlay) => {
        const [xNumerator, xDenominator] = overlay.x.quotient;
        const [yNumerator, yDenominator] = overlay.y.quotient;

        const layerId = `${overlay.x.quotient.join(
          '&',
        )}|${overlay.y.quotient.join('&')}`;
        if (!registry.has(layerId)) {
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
              overlay.name,
              colorTheme as ColorTheme,
              xNumerator,
              xDenominator,
              yNumerator,
              yDenominator,
              stats,
            );

            if (legend) {
              layers.push(
                createLogicalLayerAtom(
                  new BivariateLayer(
                    overlay.name,
                    bivariateStyle as BivariateLayerStyle,
                    legend,
                  ),
                ),
              );
            }
          }
        }
      });
      if (layers.length) {
        schedule((dispatch) => {
          dispatch(logicalLayersRegistryAtom.registerLayer(layers));
        });
      }
    }
  },
  'bivariateOverlayLayers',
);

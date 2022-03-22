import { createAtom } from '~utils/atoms';
import { bivariateStatisticsResourceAtom } from '~features/bivariate_manager/atoms/bivariateStatisticsResource';
import {
  BivariateLayerStyle,
  generateColorThemeAndBivariateStyle,
} from '~utils/bivariate/bivariateColorThemeUtils';
import {
  createBivariateLegend,
  createBivariateMeta,
} from '~utils/bivariate/bivariateLegendUtils';
import { ColorTheme } from '~core/types';
import { layersRegistryAtom } from '~core/logical_layers/atoms/layersRegistry';
import { bivariateNumeratorsAtom } from '~features/bivariate_manager/atoms/bivariateNumerators';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';
import { createUpdateLayerActions } from '~core/logical_layers/utils/createUpdateActions';
import { BivariateRenderer } from '../renderers/BivariateRenderer';

export const bivariateMatrixSelectionAtom = createAtom(
  {
    setMatrixSelection: (
      xNumerator: string | null,
      xDenominator: string | null,
      yNumerator: string | null,
      yDenominator: string | null,
    ) => ({ xNumerator, xDenominator, yNumerator, yDenominator }),
    enableBivariateLayer: (layerId: string) => layerId,
    disableBivariateLayer: () => null,
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
          const biSource = bivStyle.source;
          const id = bivStyle.id;
          const meta = createBivariateMeta(
            xNumerator,
            xDenominator,
            yNumerator,
            yDenominator,
            stats,
          );

          const source = {
            id,
            maxZoom: biSource.maxzoom,
            minZoom: biSource.minzoom,
            source: {
              type: biSource.type,
              urls: biSource.tiles,
              tileSize: 512,
            },
          };

          const [updateActions, cleanUpActions] = createUpdateLayerActions(id, {
            legend,
            meta,
            source,
          });

          // Setup only (because it static)
          const currentSettings = getUnlistedState(layersSettingsAtom);
          if (!currentSettings.has(id)) {
            createUpdateLayerActions(
              id,
              {
                settings: {
                  id,
                  name: 'Bivariate Layer',
                  category: 'overlay' as const,
                  group: 'bivariate',
                },
              },
              [updateActions, cleanUpActions],
            );
          }

          // Register and Enable
          const currentRegistry = getUnlistedState(layersRegistryAtom);
          if (!currentRegistry.has(id)) {
            updateActions.push(
              layersRegistryAtom.register({
                id,
                renderer: new BivariateRenderer({ id }),
                cleanUpActions,
              }),
              create('enableBivariateLayer', id),
            );
          }

          if (updateActions.length) {
            schedule(
              (dispatch, ctx: { bivariateLayerAtomId?: string } = {}) => {
                ctx.bivariateLayerAtomId = id;
                dispatch(updateActions);
              },
            );
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

    onAction('disableBivariateLayer', () => {
      const currentRegistry = getUnlistedState(layersRegistryAtom);
      schedule((dispatch, ctx: { bivariateLayerAtomId?: string } = {}) => {
        if (ctx.bivariateLayerAtomId) {
          const layerAtom = currentRegistry.get(ctx.bivariateLayerAtomId);
          layerAtom && dispatch(layerAtom.destroy());
        }
      });
    });

    return state;
  },
  'bivariateMatrixSelection',
);

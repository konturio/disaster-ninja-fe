import { createAtom } from '~utils/atoms';
import { bivariateStatisticsResourceAtom } from '~core/resources/bivariateStatisticsResource';
import { generateColorThemeAndBivariateStyle } from '~utils/bivariate/bivariateColorThemeUtils';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';
import { layersLegendsAtom } from '~core/logical_layers/atoms/layersLegends';
import {
  createBivariateLegend,
  createBivariateMeta,
} from '~utils/bivariate/bivariateLegendUtils';
import { layersRegistryAtom } from '~core/logical_layers/atoms/layersRegistry';
import { bivariateNumeratorsAtom } from '~features/bivariate_manager/atoms/bivariateNumerators';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';
import { createUpdateLayerActions } from '~core/logical_layers/utils/createUpdateActions';
import { BivariateRenderer } from '~core/logical_layers/renderers/BivariateRenderer/BivariateRenderer';
import { SOURCE_LAYER_BIVARIATE } from '~core/logical_layers/renderers/BivariateRenderer/constants';
import { onCalculateSelectedCell, selectQuotientInGroupByNumDen } from './utils';
import type { SelectionInput } from './utils';
import type { AxisGroup, ColorTheme } from '~core/types';
import type { BivariateLayerStyle } from '~utils/bivariate/bivariateColorThemeUtils';
import type { LogicalLayerState } from '~core/logical_layers/types/logicalLayer';
import type { BivariateLegend } from '~core/logical_layers/types/legends';

type SelectCellCallback = (x: number, y: number) => void;

type State = {
  xNumerator: SelectionInput['xNumerator'];
  xDenominator: SelectionInput['xDenominator'];
  yNumerator: SelectionInput['yNumerator'];
  yDenominator: SelectionInput['yDenominator'];
  selectedCell: { x: number; y: number } | null;
  selectCellCallback: SelectCellCallback | null;
};

const DEFAULT_STATE = {
  xNumerator: null,
  xDenominator: null,
  yNumerator: null,
  yDenominator: null,
  selectedCell: null,
  selectCellCallback: null,
};

const formatSelection = (
  xNumerator: string | null,
  xDenominator: string | null,
  yNumerator: string | null,
  yDenominator: string | null,
): SelectionInput => ({ xNumerator, xDenominator, yNumerator, yDenominator });

export const bivariateMatrixSelectionAtom = createAtom(
  {
    enabledLayersAtom,
    layersLegendsAtom,

    calculateSelectedCell: () => null,
    resetSelection: () => null,
    setSelectCellCallback: (cb: SelectCellCallback) => cb,
    runPreselection: () => null,
    setMatrixSelection: formatSelection,
    presetMatrixSelection: (selection: SelectionInput) => selection,
    enableBivariateLayer: (layerId: string) => layerId,
    disableBivariateLayer: () => null,
  },
  (
    { onAction, schedule, getUnlistedState, create, onChange },
    state: State = DEFAULT_STATE,
  ) => {
    onAction('calculateSelectedCell', () => {
      const { xGroups, yGroups } = getUnlistedState(bivariateNumeratorsAtom);
      const nextSelectedCell = onCalculateSelectedCell(
        xGroups,
        yGroups,
        formatSelection(
          state.xNumerator,
          state.xDenominator,
          state.yNumerator,
          state.yDenominator,
        ),
      );
      const currentCell = state.selectedCell;

      if (
        !currentCell ||
        nextSelectedCell.x !== currentCell.x ||
        nextSelectedCell.y !== currentCell.y
      ) {
        state = { ...state, selectedCell: nextSelectedCell };
      }
    });

    // this is onSelect method from BivariateMatrixControl
    onAction('setSelectCellCallback', (selectCellCallback) => {
      state = { ...state, selectCellCallback };
    });

    const getEnabledBivariateLayer = () => {
      const enabledLayers = getUnlistedState(enabledLayersAtom);
      const registry = getUnlistedState(layersRegistryAtom);
      const layer = [...enabledLayers]
        .map((layer) => registry.get(layer)?.getState())
        .find(
          (layer) => layer && layer.isEnabled && layer.legend?.type === 'bivariate',
        ) as (LogicalLayerState & { legend: BivariateLegend }) | undefined;

      return layer;
    };

    onAction('resetSelection', () => {
      state = {
        ...state,

        xNumerator: null,
        xDenominator: null,
        yNumerator: null,
        yDenominator: null,
        selectedCell: null,
      };

      schedule((_dispatch) => {
        state?.selectCellCallback?.(-1, -1);
      });
    });

    onAction('runPreselection', () => {
      const layer = getEnabledBivariateLayer();
      if (!layer || !layer?.legend) {
        // it happens when overlays are deselected and we have no active bivariate layer - just deselect all
        schedule((dispatch) => {
          dispatch(create('resetSelection'));
        });
        return;
      }

      const axis = layer.legend.axis;

      if (axis) {
        // check if we already have combination for selected items, if yes - select
        const preselectionFormatted = formatSelection(
          axis.x.quotient[0] || null,
          axis.x.quotient[1] || null,
          axis.y.quotient[0] || null,
          axis.y.quotient[1] || null,
        );

        const { xGroups, yGroups } = getUnlistedState(bivariateNumeratorsAtom);
        const nextSelectedCell = onCalculateSelectedCell(
          xGroups,
          yGroups,
          preselectionFormatted,
        );

        if (nextSelectedCell.x >= 0 && nextSelectedCell.y >= 0) {
          schedule((dispatch) => {
            dispatch(create('presetMatrixSelection', preselectionFormatted));
            state?.selectCellCallback?.(nextSelectedCell.x, nextSelectedCell.y);
          });

          return;
        }

        //if no - need to find and select quotients for x and y
        let newXGroups: AxisGroup[] = xGroups;
        let newYGroups: AxisGroup[] = yGroups;

        if (nextSelectedCell.x === -1) {
          newXGroups = selectQuotientInGroupByNumDen(
            xGroups,
            axis.x.quotient[0],
            axis.x.quotient[1],
          );
        }
        if (nextSelectedCell.y === -1) {
          newYGroups = selectQuotientInGroupByNumDen(
            yGroups,
            axis.y.quotient[0],
            axis.y.quotient[1],
          );
        }

        // after selection of quotients we check if we can select again
        const finishSelection = onCalculateSelectedCell(
          newXGroups,
          newYGroups,
          preselectionFormatted,
        );
        schedule((dispatch) => {
          if (finishSelection.x >= 0 && finishSelection.y >= 0) {
            dispatch(bivariateNumeratorsAtom.setNumerators(newXGroups, newYGroups));
            dispatch(create('presetMatrixSelection', preselectionFormatted));
            state?.selectCellCallback?.(finishSelection.x, finishSelection.y);
          } else {
            dispatch(create('resetSelection'));
          }
        });
      }
    });

    onAction('presetMatrixSelection', (selection) => {
      state = { ...state, ...selection };
      schedule((dispatch) => {
        dispatch(create('calculateSelectedCell'));
      });
    });

    onAction('setMatrixSelection', (selection) => {
      state = { ...state, ...selection };
      schedule((dispatch) => {
        dispatch(create('calculateSelectedCell'));
      });

      const { xNumerator, xDenominator, yNumerator, yDenominator } = selection;
      if (xNumerator === null || yNumerator === null) return;

      const { xGroups, yGroups } = getUnlistedState(bivariateNumeratorsAtom);
      const stats = getUnlistedState(bivariateStatisticsResourceAtom).data;
      if (stats === null) return;

      if (!xGroups || !yGroups || !xGroups.length || !yGroups.length) return;

      if (!xDenominator || !yDenominator) return;

      const res = generateColorThemeAndBivariateStyle(
        xNumerator,
        xDenominator,
        yNumerator,
        yDenominator,
        stats,
        SOURCE_LAYER_BIVARIATE,
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

          const source = biSource
            ? {
                id,
                maxZoom: biSource.maxzoom,
                minZoom: biSource.minzoom,
                source: {
                  type: biSource.type,
                  urls: biSource.tiles,
                  tileSize: 512,
                  apiKey: '',
                },
              }
            : undefined;

          const [updateActions, cleanUpActions] = createUpdateLayerActions([
            {
              id,
              legend,
              meta,
              source,
            },
          ]);

          // Setup only (because it static)
          const currentSettings = getUnlistedState(layersSettingsAtom);
          if (!currentSettings.has(id)) {
            updateActions.push(
              ...createUpdateLayerActions([
                {
                  id,
                  settings: {
                    id,
                    name: 'Bivariate Layer',
                    category: 'overlay' as const,
                    group: 'bivariate',
                    ownedByUser: true,
                  },
                },
              ]).flat(),
            );
          }

          // Register and Enable
          const currentRegistry = getUnlistedState(layersRegistryAtom);
          if (!currentRegistry.has(id)) {
            updateActions.push(
              create('disableBivariateLayer'),
              layersRegistryAtom.register({
                id,
                renderer: new BivariateRenderer({ id }),
                cleanUpActions,
              }),
              create('enableBivariateLayer', id),
            );
          }

          if (updateActions.length) {
            schedule((dispatch, ctx: { bivariateLayerAtomId?: string } = {}) => {
              dispatch(updateActions);
              ctx.bivariateLayerAtomId = id;
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

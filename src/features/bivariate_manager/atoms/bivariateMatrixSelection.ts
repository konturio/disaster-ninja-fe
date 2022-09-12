import { createAtom } from '~utils/atoms';
import { bivariateStatisticsResourceAtom } from '~features/bivariate_manager/atoms/bivariateStatisticsResource';
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
import { BivariateRenderer } from '~core/logical_layers/renderers/BivariateRenderer';
import type { AxisGroup, ColorTheme } from '~core/types';
import type { BivariateLayerStyle } from '~utils/bivariate/bivariateColorThemeUtils';
import type { LogicalLayerState } from '~core/logical_layers/types/logicalLayer';
import type { BivariateLegend } from '~core/logical_layers/types/legends';

type SelectionInput = {
  xNumerator: string | null;
  xDenominator: string | null;
  yNumerator: string | null;
  yDenominator: string | null;
};

type SelectCellCallback = (x: number, y: number) => void;

type State = {
  xNumerator: SelectionInput['xNumerator'];
  xDenominator: SelectionInput['xDenominator'];
  yNumerator: SelectionInput['yNumerator'];
  yDenominator: SelectionInput['yDenominator'];
  preselectMode: boolean | false;
  selectedCell: { x: number; y: number } | null;
  selectCellCallback: SelectCellCallback | null;
};

const DEFAULT_STATE = {
  xNumerator: null,
  xDenominator: null,
  yNumerator: null,
  yDenominator: null,

  preselectMode: false,
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
    setPreselectMode: (flag: boolean) => flag,
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

    // in these 2 onChange callbacks we react on selection of overlays
    // enabledLayersAtom we need when we select layer already selected before - it has legend downloaded
    onChange('enabledLayersAtom', () => {
      if (state.preselectMode) {
        schedule((dispatch) => {
          dispatch(create('runPreselection'));
        });
      }
    });
    // layersLegendsAtom we need when we select layer first time, it has no legend, so we need to wait until it's ready
    onChange('layersLegendsAtom', () => {
      if (state.preselectMode) {
        schedule((dispatch) => {
          dispatch(create('runPreselection'));
        });
      }
    });
    // when matrix component mounted we set this mode and need to run selection first time
    onAction('setPreselectMode', (preselectMode) => {
      state = { ...state, preselectMode };
      if (preselectMode) {
        schedule((dispatch) => {
          dispatch(create('runPreselection'));
        });
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

    onAction('runPreselection', () => {
      const layer = getEnabledBivariateLayer();
      if (!layer || !layer?.legend) {
        // it happens when overlays are deselected and we have no active bivariate layer - just deselect all
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

        if (
          preselectionFormatted.xDenominator === state.xDenominator &&
          preselectionFormatted.xNumerator === state.xNumerator &&
          preselectionFormatted.yDenominator === state.yDenominator &&
          preselectionFormatted.yNumerator === state.yNumerator
        )
          return;

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

        if (finishSelection.x >= 0 && finishSelection.y >= 0) {
          schedule((dispatch) => {
            dispatch(bivariateNumeratorsAtom.setNumerators(newXGroups, newYGroups));
            dispatch(create('presetMatrixSelection', preselectionFormatted));
            state?.selectCellCallback?.(finishSelection.x, finishSelection.y);
          });
        }
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
      const bivariateStatisticsResource = getUnlistedState(
        bivariateStatisticsResourceAtom,
      ).data;
      if (bivariateStatisticsResource === null) return;
      const stats = bivariateStatisticsResource.polygonStatistic.bivariateStatistic;

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
                  ownedByUser: true,
                },
              },
              [updateActions, cleanUpActions],
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

const selectQuotientInGroupByNumDen = (
  groups: AxisGroup[],
  numId: string,
  denId: string,
): AxisGroup[] => {
  const newGroups = [...groups];

  let selectedQuotient;
  const groupIndex = newGroups.findIndex(({ quotients }) => {
    selectedQuotient = quotients.find(
      (q: [string, string]) => q[0] === numId && q[1] === denId,
    );
    return selectedQuotient;
  });

  if (selectedQuotient) {
    newGroups[groupIndex] = { ...newGroups[groupIndex], selectedQuotient };
  }

  return newGroups;
};

const onCalculateSelectedCell = (
  xGroups: AxisGroup[],
  yGroups: AxisGroup[],
  matrixSelection: SelectionInput,
): { x: number; y: number } => {
  const xIndex = xGroups
    ? xGroups.findIndex(
        (group) =>
          group.selectedQuotient[0] === matrixSelection?.xNumerator &&
          group.selectedQuotient[1] === matrixSelection?.xDenominator,
      )
    : -1;
  const yIndex = yGroups
    ? yGroups.findIndex(
        (group) =>
          group.selectedQuotient[0] === matrixSelection?.yNumerator &&
          group.selectedQuotient[1] === matrixSelection?.yDenominator,
      )
    : -1;

  return { x: xIndex, y: yIndex };
};

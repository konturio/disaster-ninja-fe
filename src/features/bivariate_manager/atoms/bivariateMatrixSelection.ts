import { action, atom, type Ctx } from '@reatom/framework';
import { generateColorThemeAndBivariateStyle } from '~utils/bivariate/bivariateColorThemeUtils';
import {
  createBivariateLegend,
  createBivariateMeta,
} from '~utils/bivariate/bivariateLegendUtils';
import { createUpdateLayerActions } from '~core/logical_layers/utils/createUpdateActions';
import { BivariateRenderer } from '~core/logical_layers/renderers/BivariateRenderer/BivariateRenderer';
import { SOURCE_LAYER_BIVARIATE } from '~core/logical_layers/renderers/BivariateRenderer/constants';
import { store } from '~core/store/store';
import * as meta from '../meta';
import { bivariateNumeratorsAtom, setNumeratorsAction } from './bivariateNumerators';
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

function formatSelection(
  xNumerator: string | null,
  xDenominator: string | null,
  yNumerator: string | null,
  yDenominator: string | null,
): SelectionInput {
  return { xNumerator, xDenominator, yNumerator, yDenominator };
}

// use v3 atoms
const enabledLayersAtom = meta.enabledLayersAtom.v3atom;
const layersRegistryAtom = meta.layersRegistryAtom.v3atom;
const layersRegistryAtom_register = meta.layersRegistryAtom.register.v3action;
const layersSettingsAtom = meta.layersSettingsAtom.v3atom;
const bivariateStatisticsResourceAtom = meta.bivariateStatisticsResourceAtom.v3atom;

let bivariateLayerAtomId;

export const bivariateMatrixSelectionAtom = atom<State>(
  DEFAULT_STATE,
  'bivariateMatrixSelectionAtom',
);

export const calculateSelectedCellAction = action((ctx) => {
  const { xGroups, yGroups } = ctx.get(bivariateNumeratorsAtom);
  const state = ctx.get(bivariateMatrixSelectionAtom);
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
    bivariateMatrixSelectionAtom(ctx, { ...state, selectedCell: nextSelectedCell });
  }
}, 'calculateSelectedCellAction');

export const setSelectCellCallbackAction = action((ctx, selectCellCallback) => {
  bivariateMatrixSelectionAtom(ctx, (state) => ({ ...state, selectCellCallback }));
}, 'setSelectCellCallbackAction');

export const callSelectCellCallbackAction = action((ctx, objWithXY) => {
  const { x, y } = objWithXY;
  ctx.get(bivariateMatrixSelectionAtom)?.selectCellCallback?.(x, y);
}, 'callSelectCellCallbackAction');

export const resetSelectionAction = action((ctx) => {
  bivariateMatrixSelectionAtom(ctx, (state) => {
    ctx.schedule(() => {
      state?.selectCellCallback?.(-1, -1);
    });
    return {
      ...state,
      xNumerator: null,
      xDenominator: null,
      yNumerator: null,
      yDenominator: null,
      selectedCell: null,
    };
  });
}, 'resetSelectionAction');

export const runPreselectionAction = action((ctx) => {
  const layer = getEnabledBivariateLayer(ctx);
  if (!layer || !layer?.legend) {
    // it happens when overlays are deselected and we have no active bivariate layer - just deselect all
    resetSelectionAction(ctx);
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

    const { xGroups, yGroups } = ctx.get(bivariateNumeratorsAtom);
    const nextSelectedCell = onCalculateSelectedCell(
      xGroups,
      yGroups,
      preselectionFormatted,
    );

    if (nextSelectedCell.x >= 0 && nextSelectedCell.y >= 0) {
      ctx.schedule(() => {
        presetMatrixSelectionAction(ctx, preselectionFormatted);
        callSelectCellCallbackAction(ctx, nextSelectedCell);
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
    ctx.schedule(() => {
      if (finishSelection.x >= 0 && finishSelection.y >= 0) {
        setNumeratorsAction(ctx, { xGroups: newXGroups, yGroups: newYGroups });
        presetMatrixSelectionAction(ctx, preselectionFormatted);
        callSelectCellCallbackAction(ctx, finishSelection);
      } else {
        resetSelectionAction(ctx);
      }
    });
  }
}, 'runPreselectionAction');

export const presetMatrixSelectionAction = action((ctx, selection) => {
  bivariateMatrixSelectionAtom(ctx, (state) => ({ ...state, ...selection }));
  calculateSelectedCellAction(ctx);
}, 'presetMatrixSelectionAction');

export const enableBivariateLayerAction = action((ctx, lId: string) => {
  const registry = ctx.get(layersRegistryAtom);
  const layer = registry.get(lId);
  if (layer) {
    layer.enable.v3action(ctx); // FIX: v2 action call
  }
}, 'enableBivariateLayerAction');

export const disableBivariateLayerAction = action(
  (ctx, bivariateLayerAtomId?: string) => {
    const registry = ctx.get(layersRegistryAtom);
    if (bivariateLayerAtomId) {
      const layerAtom = registry.get(bivariateLayerAtomId);
      layerAtom && layerAtom.destroy.v3action(ctx); // FIX: v2 action call
    }
  },
  'disableBivariateLayerAction',
);

export const setMatrixSelectionAction = action(
  (
    ctx,
    xNumerator: string | null,
    xDenominator: string | null,
    yNumerator: string | null,
    yDenominator: string | null,
  ) => {
    // const { xNumerator, xDenominator, yNumerator, yDenominator } = selection;
    bivariateMatrixSelectionAtom(ctx, (state) => ({
      ...state,
      xNumerator,
      xDenominator,
      yNumerator,
      yDenominator,
    }));
    calculateSelectedCellAction(ctx);

    if (xNumerator === null || yNumerator === null) return;

    const { xGroups, yGroups } = ctx.get(bivariateNumeratorsAtom);
    const stats = ctx.get(bivariateStatisticsResourceAtom).data;
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
        const currentSettings = ctx.get(layersSettingsAtom);
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
        const currentRegistry = ctx.get(layersRegistryAtom);
        if (!currentRegistry.has(id)) {
          // remove current Biv layer
          disableBivariateLayerAction(ctx, bivariateLayerAtomId);
          bivariateLayerAtomId = id;

          layersRegistryAtom_register(ctx, [
            {
              id,
              renderer: new BivariateRenderer({ id }),
              cleanUpActions,
            },
          ]);
          enableBivariateLayerAction(ctx, id);
        }

        if (updateActions.length) {
          store.dispatch(updateActions);
        }
      }
    }
  },
  'setMatrixSelectionAction',
);

function getEnabledBivariateLayer(ctx: Ctx) {
  const enabledLayers = ctx.get(enabledLayersAtom);
  const registry = ctx.get(layersRegistryAtom);
  const layer = [...enabledLayers]
    .map((layer) => registry.get(layer)?.getState()) // FIX: v2 action call
    .find((layer) => layer && layer.isEnabled && layer.legend?.type === 'bivariate') as
    | (LogicalLayerState & { legend: BivariateLegend })
    | undefined;

  return layer;
}

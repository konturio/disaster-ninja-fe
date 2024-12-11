import { createAtom } from '~utils/atoms';
import { BivariateRenderer } from '~core/logical_layers/renderers/BivariateRenderer/BivariateRenderer';
import { createUpdateLayerActions } from '~core/logical_layers/utils/createUpdateActions';
import { generateBivariateStyle } from '~utils/bivariate/bivariateColorThemeUtils';
import { fillBivariateLegend } from '~utils/bivariate/bivariateLegendUtils';
import { LayersOrderManager } from '~core/logical_layers/utils/layersOrder/layersOrder';
import { createLayersRegistryAtom } from '~core/logical_layers/atoms/layersRegistry';
import { SOURCE_LAYER_BIVARIATE } from '~core/logical_layers/renderers/BivariateRenderer/constants';
import { getMaxIndicatorsZoomLevel } from '~utils/bivariate/getMaxZoomLevel';
import { bivariateColorManagerDataAtom } from './bivariateColorManagerData';
import type { LayerSelectionFull } from '../components/LegendWithMap/LegendWithMap';
import type { BivariateLayerStyle } from '~utils/bivariate/bivariateColorThemeUtils';

export const bivariateSampleMapLayersOrderManager = new LayersOrderManager();
export const bivariateregistry = createLayersRegistryAtom('bivariateregistry');

export type BivariateColorManagerAtomState = {
  map: maplibregl.Map | null;
};

const DEFAULT_STATE = {
  map: null,
};

export const bivariateColorManagerSamleMap = createAtom(
  {
    enableBivariateLayer: (layerId: string) => layerId,
    disableBivariateLayer: () => null,
    generateLayerStyles: (input: LayerSelectionFull) => input,
    setCurrentMap: (input: maplibregl.Map | null) => input,
  },
  (
    { onAction, schedule, create, getUnlistedState },
    state: BivariateColorManagerAtomState = DEFAULT_STATE,
  ) => {
    onAction('setCurrentMap', (map) => {
      state = {
        ...state,
        map,
      };
    });

    onAction('generateLayerStyles', (selection) => {
      const { _initialData, meta } = getUnlistedState(bivariateColorManagerDataAtom);
      if (!_initialData || !meta || !state.map) return;

      const { key, vertical, horizontal } = selection;
      const { colorTheme } = _initialData[key];
      const verticalAxis = vertical.axis;
      const horizontalAxis = horizontal.axis;
      if (!verticalAxis || !horizontalAxis) return;

      const legend = fillBivariateLegend(
        'Bivariate Layer',
        verticalAxis,
        horizontalAxis,
        colorTheme,
      );

      const maxZoom = getMaxIndicatorsZoomLevel(
        [...(verticalAxis.quotients ?? []), ...(horizontalAxis.quotients ?? [])],
        meta.max_zoom,
      );

      const bivariateStyle = generateBivariateStyle(
        verticalAxis,
        horizontalAxis,
        colorTheme,
        maxZoom,
        SOURCE_LAYER_BIVARIATE,
      );

      const bivStyle = bivariateStyle as BivariateLayerStyle;
      const biSource = bivStyle.source;
      const id = bivStyle.id;

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
          source,
        },
      ]);

      const currentRegistry = getUnlistedState(bivariateregistry);
      if (!currentRegistry.has(id)) {
        updateActions.push(
          create('disableBivariateLayer'),
          bivariateregistry.register({
            id,
            renderer: new BivariateRenderer({
              id,
              layersOrderManager: bivariateSampleMapLayersOrderManager,
            }),
            cleanUpActions,
            map: state.map,
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
    });

    onAction('enableBivariateLayer', (lId: string) => {
      const currentRegistry = getUnlistedState(bivariateregistry);
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
      const currentRegistry = getUnlistedState(bivariateregistry);
      schedule((dispatch, ctx: { bivariateLayerAtomId?: string } = {}) => {
        if (ctx.bivariateLayerAtomId) {
          const layerAtom = currentRegistry.get(ctx.bivariateLayerAtomId);
          layerAtom && dispatch(layerAtom.destroy());
        }
      });
    });

    return state;
  },
);

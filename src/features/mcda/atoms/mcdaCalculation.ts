import isEqual from 'lodash-es/isEqual';
import sumBy from 'lodash-es/sumBy';
import { createAtom } from '~utils/atoms';
import { layersRegistryAtom } from '~core/logical_layers/atoms/layersRegistry';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';
import { createUpdateLayerActions } from '~core/logical_layers/utils/createUpdateActions';
import {
  anyCondition,
  featureProp,
  notEqual,
} from '~utils/bivariate/bivariate_style/styleGen';
import { adaptTileUrl } from '~utils/bivariate/tile/adaptTileUrl';
import appConfig from '~core/app_config';
import {
  MCDARenderer,
  sentimentDefault,
  sentimentReversed,
} from '../renderers/MCDARenderer';
import type {
  BivariateLayerSource,
  BivariateLayerStyle,
} from '~utils/bivariate/bivariateColorThemeUtils';
import type { Quotient } from '~utils/bivariate';

export interface JsonMCDA {
  id?: string;
  layers: {
    axis: [string, string];
    range: [number, number];
    sentiment: [string, string];
    coefficient: number;
  }[];
  colors: {
    good: string;
    bad: string;
  };
}

const DEFAULT_GREEN = 'rgba(90, 200, 127, 0.5)';
const DEFAULT_RED = 'rgba(228, 26, 28, 0.5)';

const filterSetup = (layers: JsonMCDA['layers']) =>
  anyCondition(
    ...layers.map(({ axis }) =>
      notEqual(['/', featureProp(axis[0]), featureProp(axis[1])], 0),
    ),
  );

const layerNormalized = (
  [num, den]: Quotient,
  [min, max]: [number, number],
  sentiment: [string, string],
  coefficient: number,
) => {
  const layerNormalizedFormula = [
    '*',
    coefficient,
    ['/', ['-', ['/', ['get', num], ['get', den]], min], max - min],
  ];

  if (isEqual(sentiment, sentimentDefault)) {
    return layerNormalizedFormula;
  } else if (isEqual(sentiment, sentimentReversed)) {
    return ['-', 1, layerNormalizedFormula];
  }
};

const linearNormalization = (json: JsonMCDA) => {
  const layersCount = json.layers.length;
  if (layersCount === 1) {
    const { axis, range, sentiment, coefficient } = json.layers[0];

    return layerNormalized(axis, range, sentiment, coefficient);
  } else if (layersCount > 1) {
    return [
      '/',
      [
        '+',
        ...json.layers.map(({ axis, range, sentiment, coefficient }) =>
          layerNormalized(axis, range, sentiment, coefficient),
        ),
      ],
      sumBy(json.layers, 'coefficient'),
    ];
  }
};

export const mcdaCalculationAtom = createAtom(
  {
    calcMCDA: (json: JsonMCDA) => json,
    enableMCDALayer: (layerId: string) => layerId,
    disableMCDALayer: () => null,
  },
  ({ onAction, schedule, getUnlistedState, create }) => {
    onAction('calcMCDA', (json) => {
      const id = json.id || 'MCDA_layer';
      const { good = DEFAULT_GREEN, bad = DEFAULT_RED } = json.colors;
      const layerStyle: BivariateLayerStyle = {
        id,
        type: 'fill',
        layout: {},
        filter: filterSetup(json.layers),
        paint: {
          'fill-color': [
            'let',
            'mcdaResult',
            ['to-number', linearNormalization(json), -1], // falsy values become -1
            [
              'case',
              ['all', ['>=', ['var', 'mcdaResult'], 0], ['<=', ['var', 'mcdaResult'], 1]],
              ['interpolate-hcl', ['linear'], ['var', 'mcdaResult'], 0, bad, 1, good],
              'transparent', // all values outside of range [0,1] will be painted as transparent
            ],
          ],
          'fill-opacity': 1,
          'fill-antialias': false,
        },

        source: {
          type: 'vector',
          tiles: [
            `${adaptTileUrl(
              appConfig.bivariateTilesRelativeUrl,
            )}{z}/{x}/{y}.mvt?indicatorsClass=${appConfig.bivariateTilesIndicatorsClass}`,
          ],
          maxzoom: 8,
          minzoom: 0,
        },
        'source-layer': 'stats',
      };

      const layerSource: BivariateLayerSource = layerStyle.source!;
      const source = {
        id,
        maxZoom: layerSource.maxzoom,
        minZoom: layerSource.minzoom,
        source: {
          type: layerSource.type,
          urls: layerSource.tiles,
          tileSize: 512,
          apiKey: '',
        },
      };

      const [updateActions, cleanUpActions] = createUpdateLayerActions([
        {
          id,
          legend: undefined,
          meta: undefined,
          source,
        },
      ]);

      const currentSettings = getUnlistedState(layersSettingsAtom);
      if (!currentSettings.has(id)) {
        updateActions.push(
          ...createUpdateLayerActions([
            {
              id,
              settings: {
                id,
                name: id,
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
          layersRegistryAtom.register({
            id,
            renderer: new MCDARenderer({ id, layerStyle, json }),
            cleanUpActions,
          }),
          create('enableMCDALayer', id),
        );
      }

      if (updateActions.length) {
        schedule((dispatch, ctx: { mcdaLayerAtomId?: string } = {}) => {
          dispatch(updateActions);
          ctx.mcdaLayerAtomId = id;
        });
      }
    });

    onAction('enableMCDALayer', (id: string) => {
      const currentRegistry = getUnlistedState(layersRegistryAtom);
      for (const [layerId, layer] of Array.from(currentRegistry)) {
        if (layerId === id) {
          schedule((dispatch) => {
            dispatch(layer.enable());
          });
          break;
        }
      }
    });

    onAction('disableMCDALayer', () => {
      const currentRegistry = getUnlistedState(layersRegistryAtom);
      schedule((dispatch, ctx: { mcdaLayerAtomId?: string } = {}) => {
        if (ctx.mcdaLayerAtomId) {
          const layerAtom = currentRegistry.get(ctx.mcdaLayerAtomId);
          layerAtom && dispatch(layerAtom.destroy());
        }
      });
    });
  },
  'mcdaCalculation',
);

import type { Describe, Infer } from 'superstruct';
import type { JsonMCDA, JsonMCDAv1, JsonMCDAv2, JsonMCDAv3 } from './types';
import type * as superstruct from 'superstruct';
import type {
  ColorsByMapLibreExpression,
  ColorsBySentiments,
  TransformationFunction,
} from '~core/logical_layers/renderers/stylesConfigs/mcda/types';

type Superstruct = typeof superstruct;

const validators = {
  colors: (s: Superstruct) =>
    s.object({
      good: s.string(),
      bad: s.string(),
    }),
  mapExpression: (s: Superstruct) =>
    s.define<string>('MapExpression', (v: unknown): v is maplibregl.Expression => {
      const docLink = `\nRead about expressions here: https://maplibre.org/maplibre-gl-js-docs/style-spec/expressions/`;
      if (!Array.isArray(v) || v.length === 0) {
        return `Map expression must be a non-empty array.${docLink}` as unknown as boolean;
      }

      if (typeof v.at(0) === 'string') {
        return `Expressions must start from expressions name.${docLink}` as unknown as boolean;
      }

      return true;
    }),
  colorsBySentiments: (s: Superstruct): Describe<ColorsBySentiments> =>
    s.object({
      type: s.literal('sentiments'),
      parameters: validators.colors(s),
    }),
  colorsByExpression: (s: Superstruct): Describe<ColorsByMapLibreExpression> =>
    s.object({
      type: s.literal('mapLibreExpression'),
      parameters: s.record(
        s.string(),
        s.union([
          s.string(),
          s.number(),
          validators.mapExpression(s) as unknown as superstruct.Struct<
            maplibregl.Expression,
            null
          >,
          s.boolean(),
        ]),
      ),
    }),
  transformationFunction: (s: Superstruct) =>
    s.define<string>(
      'TransformationFunction',
      (v: unknown): v is TransformationFunction =>
        typeof v === 'string' && ['no', 'natural_logarithm', 'square_root'].includes(v),
    ),
  JsonMCDAShapeV1: (s: Superstruct) => {
    const shape: Describe<JsonMCDAv1> = s.object({
      id: s.optional(s.string()),
      layers: s.array(
        s.object({
          axis: s.tuple([s.string(), s.string()]),
          range: s.tuple([s.number(), s.number()]),
          sentiment: s.tuple([s.string(), s.string()]),
          coefficient: s.number(),
        }),
      ),
      colors: validators.colors(s),
    });
    return shape;
  },
  JsonMCDAShapeV2: (s: Superstruct) => {
    const shape: Describe<JsonMCDAv2> = s.object({
      id: s.optional(s.string()),
      version: s.literal(2),
      layers: s.array(
        s.object({
          axis: s.tuple([s.string(), s.string()]),
          range: s.tuple([s.number(), s.number()]),
          sentiment: s.tuple([s.string(), s.string()]),
          coefficient: s.number(),
          transformationFunction: s.enums(['no', 'natural_logarithm', 'square_root']),
        }),
      ),
      colors: validators.colors(s),
    });
    return shape;
  },
  JsonMCDAShapeV3: (s: Superstruct) => {
    const shape: Describe<JsonMCDAv3> = s.object({
      id: s.optional(s.string()),
      version: s.literal(3),
      layers: s.array(
        s.object({
          axis: s.tuple([s.string(), s.string()]),
          range: s.tuple([s.number(), s.number()]),
          sentiment: s.tuple([s.string(), s.string()]),
          coefficient: s.number(),
          transformationFunction: s.enums(['no', 'natural_logarithm', 'square_root']),
          normalization: s.enums(['max-min', 'no']),
        }),
      ),
      colors: validators.colors(s),
    });
    return shape;
  },
  JsonMCDAShapeV4: (s: Superstruct) => {
    // can't use Describe<JsonMCDAv4> here since some mistake in Describe generic with unions
    const shape = s.object({
      id: s.optional(s.string()),
      version: s.literal(4),
      layers: s.array(
        s.object({
          axis: s.tuple([s.string(), s.string()]),
          range: s.tuple([s.number(), s.number()]),
          sentiment: s.tuple([s.string(), s.string()]),
          coefficient: s.number(),
          transformationFunction: s.enums(['no', 'natural_logarithm', 'square_root']),
          normalization: s.enums(['max-min', 'no']),
        }),
      ),
      colors: s.union([
        validators.colorsBySentiments(s),
        validators.colorsByExpression(s),
      ]),
    });
    return shape;
  },
};

/** TODO: Use some library for check ts interface in runtime */
export const createValidator = async () => {
  const s = await import('superstruct');
  // https://github.com/microsoft/TypeScript/issues/36931#issuecomment-633659882
  const assert: Superstruct['assert'] = s.assert;
  return (obj: Record<string, any>): obj is JsonMCDA => {
    switch (obj.version) {
      case undefined:
        assert(obj, validators.JsonMCDAShapeV1(s));
        return true;
      case 2:
        assert(obj, validators.JsonMCDAShapeV2(s));
        return true;
      case 3:
        assert(obj, validators.JsonMCDAShapeV3(s));
        return true;
      case 4:
        assert(obj, validators.JsonMCDAShapeV4(s));
        return true;
      default:
        throw Error(`Unknown version of config: ${obj.version}`);
    }
  };
};

import type { Describe } from 'superstruct';
import type { JsonMCDA, JsonMCDAv1, JsonMCDAv2, JsonMCDAv3 } from './types';
import type * as superstruct from 'superstruct';
import type { TransformationFunction } from '../types';
type Superstruct = typeof superstruct;

const validators = {
  colors: (s: Superstruct) =>
    s.object({
      good: s.string(),
      bad: s.string(),
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
      default:
        throw Error(`Unknown version of config: ${obj.version}`);
    }
  };
};

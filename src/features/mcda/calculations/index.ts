import isEqual from 'lodash-es/isEqual';
import { sentimentDefault, sentimentReversed } from './constants';
import type { MCDAConfig, TransformationFunction } from '../types';

type MapExpression = string | number | Array<string | number | MapExpression>;

interface Operations<T> {
  rate: (args: { num: T; den: T }) => T;
  /** (x - min) / (max - min) */
  normalize: (args: { x: T; min: number; max: number }) => T;
  transform: (args: {
    x: T;
    transformation: TransformationFunction;
    min: number;
    max: number;
  }) => T;
  /** 1 - x */
  invert: (x: T) => T;
  /** x * coefficient (a.k.a. weight) */
  scale: (x: T, coefficient: number) => T;
}

export const inStyleCalculations: Operations<MapExpression> = {
  rate: ({ num, den }: { num: MapExpression; den: MapExpression }) => ['/', num, den],
  normalize: ({ x, min, max }: { x: MapExpression; min: number; max: number }) => [
    '/',
    ['-', x, min],
    max - min,
  ],
  transform: ({
    x,
    transformation,
    min,
    max,
  }: {
    x: MapExpression;
    transformation: TransformationFunction;
    min: number;
    max: number;
  }) => {
    switch (transformation) {
      case 'no':
        return x;

      /* square_root: (sqrt(x) - sqrt(min)) / (sqrt(max) - sqrt(min)) */
      case 'square_root':
        // prettier-ignore
        return [
          '/',
          ['-', ['sqrt', x], ['sqrt', min]],
          ['-', ['sqrt', max], ['sqrt', min]],
        ];

      /* natural_logarithm: (ln(x) - ln(min)) / (ln(max) - ln(min)) */
      case 'natural_logarithm':
        // prettier-ignore
        return ['/',
          ['-', ['ln', x], ['ln', min]],
          ['-', ['ln', max], ['ln', min]]
        ];
    }
  },
  invert: (x: MapExpression) => ['-', 1, x],
  scale: (x: MapExpression, coefficient = 1) => ['*', x, coefficient],
};

export const inViewCalculations: Operations<number> = {
  rate: ({ num, den }: { num: number; den: number }) => num / den,
  normalize: ({ x, min, max }: { x: number; min: number; max: number }) =>
    (x - min) / (max - min),
  transform: ({
    x,
    transformation,
    min,
    max,
  }: {
    x: number;
    transformation: TransformationFunction;
    min: number;
    max: number;
  }) => {
    switch (transformation) {
      case 'no':
        return x;

      /* square_root: (sqrt(x) - sqrt(min)) / (sqrt(max) - sqrt(min)) */
      case 'square_root':
        // prettier-ignore
        return (Math.sqrt(x) - Math.sqrt(min)) / (Math.sqrt(max) - Math.sqrt(min));

      /* natural_logarithm: (ln(x) - ln(min)) / (ln(max) - ln(min)) */
      case 'natural_logarithm':
        // prettier-ignore
        return (Math.log(x) - Math.log(min)) / (Math.log(max) - Math.log(min))
    }
  },
  invert: (x: number) => 1 - x,
  scale: (x: number, coefficient = 1) => x * coefficient,
};

export const calculateLayerPipeline =
  <T>(
    operations: Operations<T>,
    getValue: (axis: { num: string; den: string }) => { num: T; den: T },
  ) =>
  ({
    axis,
    range,
    coefficient,
    sentiment,
    transformationFunction,
  }: MCDAConfig['layers'][0]) => {
    const [num, den] = axis;
    const [min, max] = range;
    const inverted = isEqual(sentiment, sentimentReversed);
    if (!inverted)
      console.assert(isEqual(sentiment, sentimentDefault), 'Not inverted equals default');

    const values = getValue({ num, den });
    const rate = operations.rate(values);
    const transformed = operations.transform({
      x: rate,
      transformation: transformationFunction,
      min,
      max,
    });
    const normalized = operations.normalize({ x: transformed, min, max });
    const orientated = inverted ? operations.invert(normalized) : normalized;
    const scaled = operations.scale(orientated, coefficient);
    return scaled;
  };

import { sentimentDefault, sentimentReversed } from './constants';
import { JsMath, MapMath } from './operations';
import type { IsomorphMath } from './operations';
import type { MCDAConfig, TransformationFunction } from '../types';

const equalSentiments = (a: Array<string>, b: Array<string>) =>
  a.length === b.length && a.every((x, i) => x === b[i]);

interface IsomorphCalculations<T> {
  rate: (args: { num: T; den: T }) => T;
  /** (x - min) / (max - min) */
  normalize: (args: { x: T; min: T; max: T }) => T;
  transform: (args: {
    x: T;
    transformation: TransformationFunction;
    min: T;
    max: T;
  }) => T;
  /** 1 - x */
  invert: (x: T) => T;
  /** x * coefficient (a.k.a. weight) */
  scale: (x: T, coefficient: T) => T;
}

class Calculations<T> implements IsomorphCalculations<T> {
  math: IsomorphMath<T>;

  constructor(operations: IsomorphMath<T>) {
    this.math = operations;
  }

  rate({ num, den }: { num: T; den: T }) {
    return this.math.div(num, den);
  }

  normalize({ x, min, max }: { x: T; min: T; max: T }) {
    return this.math.div(this.math.sub(x, min), this.math.sub(max, min));
  }

  transform({
    x,
    transformation,
    min,
    max,
  }: {
    x: T;
    transformation: TransformationFunction;
    min: T;
    max: T;
  }) {
    switch (transformation) {
      case 'no':
        return x;

      /* square_root: (sqrt(x) - sqrt(min)) / (sqrt(max) - sqrt(min)) */
      case 'square_root':
        return this.math.div(
          this.math.sub(this.math.sqrt(x), this.math.sqrt(min)),
          this.math.sub(this.math.sqrt(max), this.math.sqrt(min)),
        );

      /* natural_logarithm: (ln(x) - ln(min)) / (ln(max) - ln(min)) */
      case 'natural_logarithm':
        return this.math.div(
          this.math.sub(this.math.log(x), this.math.log(min)),
          this.math.sub(this.math.log(max), this.math.log(min)),
        );
    }
  }

  invert(x: T) {
    return this.math.sub(1 as T, x);
  }

  scale(x: T, coefficient: T) {
    return this.math.mult(x, coefficient);
  }
}

export const inStyleCalculations = new Calculations(new MapMath());
export const inViewCalculations = new Calculations(new JsMath());

export const calculateLayerPipeline =
  <T extends number>(
    operations: IsomorphCalculations<number>,
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
    const inverted = equalSentiments(sentiment, sentimentReversed);
    if (!inverted)
      console.assert(
        equalSentiments(sentiment, sentimentDefault),
        'Not inverted equals default',
      );

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

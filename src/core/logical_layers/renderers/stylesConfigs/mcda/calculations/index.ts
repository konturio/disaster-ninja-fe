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
  transform: (args: { x: T; transformation: TransformationFunction; min: T; max: T }) => {
    tX: T;
    tMin: T;
    tMax: T;
  };
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
    min,
    max,
    transformation,
  }: {
    x: T;
    transformation: TransformationFunction;
    min: T;
    max: T;
  }) {
    switch (transformation) {
      case 'no':
        return {
          tX: x,
          tMin: min,
          tMax: max,
        };

      /* square_root: (sqrt(x) - sqrt(min)) / (sqrt(max) - sqrt(min)) */
      case 'square_root':
        return {
          tX: this.math.sqrt(x),
          tMin: this.math.sqrt(min),
          tMax: this.math.sqrt(max),
        };

      /* natural_logarithm: (ln(x) - ln(min)) / (ln(max) - ln(min)) */
      case 'natural_logarithm':
        return {
          tX: this.math.log(this.math.add(x, 1 as T)),
          tMin: this.math.log(this.math.add(min, 1 as T)),
          tMax: this.math.log(this.math.add(max, 1 as T)),
        };
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
    normalization,
    outliers,
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
    // tX - shortcut for transformedX
    const { tX, tMin, tMax } = operations.transform({
      x: rate,
      min,
      max,
      transformation: transformationFunction,
    });
    let rangeChecked = tX;
    if (outliers === 'as_on_limits') {
      if (rangeChecked < tMin) {
        rangeChecked = tMin;
      } else if (rangeChecked > tMax) {
        rangeChecked = tMax;
      }
    }
    const normalized =
      normalization === 'max-min'
        ? operations.normalize({ x: rangeChecked, min: tMin, max: tMax })
        : rangeChecked;
    const orientated = inverted ? operations.invert(normalized) : normalized;
    const scaled = operations.scale(orientated, coefficient);
    return scaled;
  };

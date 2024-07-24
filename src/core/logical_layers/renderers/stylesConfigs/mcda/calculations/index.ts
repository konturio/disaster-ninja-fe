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
  /**
   * transformation({ x, min, max }) => { tX, tMin, tMax }
   * @param min lower bound of the applied range. Must be >= datasetMin
   * @param max upper bound of the applied range
   * @param datasetMin global minimum of the axis dataset
   */
  transform: (args: {
    x: T;
    transformation: TransformationFunction;
    min: T;
    max: T;
    datasetMin?: T;
  }) => {
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
    datasetMin,
    transformation,
  }: {
    x: T;
    transformation: TransformationFunction;
    min: T;
    datasetMin?: T;
    max: T;
  }) {
    switch (transformation) {
      case 'no':
        return {
          tX: x,
          tMin: min,
          tMax: max,
        };

      /* square_root: sign(x)√(|x|) */
      case 'square_root':
        return {
          tX: this.math.mult(this.math.sign(x), this.math.sqrt(this.math.abs(x))),
          tMin: this.math.mult(this.math.sign(min), this.math.sqrt(this.math.abs(min))),
          tMax: this.math.mult(this.math.sign(max), this.math.sqrt(this.math.abs(max))),
        };

      /* cube_root:  ∛x */
      case 'cube_root':
        return {
          tX: this.math.cbrt(x),
          tMin: this.math.cbrt(min),
          tMax: this.math.cbrt(max),
        };

      /* log(x - datasetMin + 1) */
      case 'log':
        if (datasetMin === undefined) {
          throw new Error('Could not find required data for given transformation');
        }
        return {
          tX: this.math.log10(this.math.add(this.math.sub(x, datasetMin), 1 as T)),
          tMin: this.math.log10(this.math.add(this.math.sub(min, datasetMin), 1 as T)),
          tMax: this.math.log10(this.math.add(this.math.sub(max, datasetMin), 1 as T)),
        };

      /* log(x - datasetMin + ε) */
      case 'log_epsilon':
        if (datasetMin === undefined) {
          throw new Error('Could not find required data for given transformation');
        }
        return {
          tX: this.math.log10(
            this.math.add(this.math.sub(x, datasetMin), Number.EPSILON as T),
          ),
          tMin: this.math.log10(
            this.math.add(this.math.sub(min, datasetMin), Number.EPSILON as T),
          ),
          tMax: this.math.log10(
            this.math.add(this.math.sub(max, datasetMin), Number.EPSILON as T),
          ),
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
    datasetRange,
  }: MCDAConfig['layers'][0]) => {
    const [num, den] = axis;
    const [min, max] = range;
    const datasetMin = datasetRange?.[0];
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
      datasetMin: datasetMin,
      transformation: transformationFunction,
    });
    let rangeChecked = tX;
    if (outliers === 'clamp') {
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

import nextafter from 'nextafter';
import { isNumber } from '~utils/common';
import { arraysAreEqualWithStrictOrder } from '~utils/common/equality';
import { sentimentDefault, sentimentReversed } from './constants';
import { JsMath, MapMath } from './operations';
import type { IsomorphMath } from './operations';
import type { MCDALayer, TransformationFunction } from '../types';

const equalSentiments = (a: Array<string>, b: Array<string>) =>
  arraysAreEqualWithStrictOrder(a, b);

const nextFloatValueInDirection = (
  value: number,
  direction: number,
  transformation?: TransformationFunction,
): number => {
  const deltaAdjustmentFunctions = {
    cube_root: (x) => Math.cbrt(x),
    square_root: (x) => Math.sqrt(x),
    log: (x) => 10 * x,
    log_epsilon: (x) => 10 * x,
  };

  const sign = Math.sign(direction - value);
  const nextNumber = nextafter(value, direction);
  const delta = Math.abs(value - nextNumber);
  if (delta < 1 && transformation && deltaAdjustmentFunctions[transformation]) {
    let adjustedDelta = deltaAdjustmentFunctions[transformation](delta);
    if (adjustedDelta > 1) {
      adjustedDelta = 0.1;
    }
    return value + sign * adjustedDelta;
  }
  return nextNumber;
};

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
  /** returns x if it's within [min; max], otherwise returns min/max */
  clamp: (x: T, min: T, max: T) => T;
  /** returns the smaller of two values */
  min: (v1: T, v2: T) => T;
  /** returns the bigger of two values */
  max: (v1: T, v2: T) => T;
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

  clamp(x: T, min: T, max: T) {
    return this.math.clamp(x, min, max);
  }

  min(v1: T, v2: T) {
    return this.math.min(v1, v2);
  }

  max(v1: T, v2: T) {
    return this.math.max(v1, v2);
  }
}

export const inStyleCalculations = new Calculations(new MapMath());
export const inViewCalculations = new Calculations(new JsMath());

export const calculateLayerPipeline =
  <T extends number>(
    type: 'view' | 'layerStyle',
    getValue: (axis: { num: string; den: string }) => { num: T; den: T },
  ) =>
  (
    layer: MCDALayer,
    forceMinMaxInLayerStyle?: boolean,
    preventValueInversion?: boolean,
  ) => {
    const {
      axis,
      range,
      coefficient,
      sentiment,
      transformationFunction,
      transformation,
      normalization,
      outliers,
      datasetStats,
    } = layer;
    // @ts-expect-error - IsomorphCalculations typing needs fixing. The code works though, so for now ignoring the ts error
    const operations: IsomorphCalculations<number> =
      type === 'layerStyle' ? inStyleCalculations : inViewCalculations;
    const [num, den] = axis;
    let min = range[0];
    const max = range[1];
    // HACK: see #19471. Changing min to avoid breaking MCDA calculation with 0 in denominator.
    // TODO: Should apply proper solution later
    if (min === max) {
      min = nextFloatValueInDirection(
        min,
        Number.NEGATIVE_INFINITY,
        transformation?.transformation ?? transformationFunction,
      );
    }
    const datasetMin = datasetStats?.minValue;
    const inverted = equalSentiments(sentiment, sentimentReversed);
    if (!inverted)
      console.assert(
        equalSentiments(sentiment, sentimentDefault),
        'Not inverted equals default',
      );

    const values = getValue({ num, den });
    const rate = operations.rate(values);
    const clamped = outliers === 'clamp' ? operations.clamp(rate, min, max) : rate;
    // tX - shortcut for transformedX
    let { tX, tMin, tMax } = operations.transform({
      x: clamped,
      min,
      max,
      datasetMin,
      transformation: transformation?.transformation ?? transformationFunction,
    });
    /* if transformation was applied and lowerBound and upperBound are defined,
       use them as clamp boundaries for the transformed value. */
    if (
      transformation?.transformation &&
      transformation?.transformation !== 'no' &&
      isNumber(transformation.lowerBound) &&
      isNumber(transformation.upperBound)
    ) {
      let lowerBound = transformation.lowerBound;
      const upperBound = transformation.upperBound;
      // HACK: see #19471. Changing min to avoid breaking MCDA calculation with 0 in denominator.
      // TODO: Should apply proper solution later
      if (lowerBound === upperBound) {
        lowerBound = nextFloatValueInDirection(lowerBound, Number.NEGATIVE_INFINITY);
      }
      tMin = operations.max(tMin, lowerBound);
      tMax = operations.min(tMax, upperBound);
      // Don't limit the values for outliers: unmodified
      if (outliers !== 'unmodified') {
        tX = operations.clamp(tX, tMin, tMax);
      }
    }
    let normalized = tX;
    if (
      normalization === 'max-min' ||
      (type === 'layerStyle' && forceMinMaxInLayerStyle)
    ) {
      // always apply min-max normalization for mcda style with sentiments colors,
      // because we need to have (0..1) values in expressions for proper colors interpolation in sentiments colors (see sentimentPaint())
      normalized = operations.normalize({ x: tX, min: tMin, max: tMax });
    }
    let oriented = inverted ? operations.invert(normalized) : normalized;
    if ((type === 'view' && normalization === 'no') || preventValueInversion) {
      // don't invert non-normalized values, because applying (1-value) doesn't make sense for them
      oriented = normalized;
    }

    const scaled = operations.scale(oriented, coefficient);
    return scaled;
  };

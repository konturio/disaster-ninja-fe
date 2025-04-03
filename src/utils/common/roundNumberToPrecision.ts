import { isNumber } from './isNumber';

/**
 * Rounds numerical value to specified number of digits after the decimal point.
 * If the value is smaller than specified precision (e.g. value = 0.009, decimals = 2), exponential notation is used.
 * @param value
 * @param decimals Number of digits after decimal comma.
 * @param exponentialDecimals (Optional) Number of digits after decimal point in exponential notation. If absent, decimals parameter is used instead.
 * @returns String representation of the number, either in fixed-point or in exponential notation.
 */
export function roundNumberToPrecision(
  value: number,
  decimals: number,
  exponentialDecimals?: number,
): string {
  let precisionThreshold = 1;
  for (let i = 0; i < decimals; i++) {
    precisionThreshold = precisionThreshold / 10;
  }
  if (Math.abs(value) < precisionThreshold && Math.abs(value) > 0) {
    return value.toExponential(
      isNumber(exponentialDecimals) ? exponentialDecimals : decimals,
    );
  } else {
    return Number.parseFloat(value.toFixed(decimals)).toString();
  }
}

import { isNumber } from './isNumber';

/**
 * Rounds numerical value to specified number of digits after the decimal point.
 * If the value is smaller than specified precision (e.g. value = 0.009, decimals = 2), exponential notation is used.
 * @param value
 * @param decimals Number of digits after decimal comma. Must be 0..100.
 * @param exponentialDecimals (Optional) Number of digits after decimal point in exponential notation. Must be 0..100. If absent, decimals parameter is used instead.
 * @returns String representation of the number, either in fixed-point or in exponential notation.
 */
export function roundNumberToPrecision(
  value: number,
  decimals: number,
  exponentialDecimals?: number,
): string {
  if (decimals < 0) {
    console.error('decimals and exponentialDecimals argument must be between 0 and 100');
  }
  const precisionThreshold = Math.pow(10, -decimals);
  if (Math.abs(value) < precisionThreshold && Math.abs(value) > 0) {
    return value.toExponential(
      isNumber(exponentialDecimals) ? exponentialDecimals : decimals,
    );
  } else {
    return Number.parseFloat(value.toFixed(decimals)).toString();
  }
}

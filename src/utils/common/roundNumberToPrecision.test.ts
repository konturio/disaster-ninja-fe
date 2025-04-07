import { expect, describe, it } from 'vitest';
import { roundNumberToPrecision } from './roundNumberToPrecision';

describe('roundNumberToPrecision', () => {
  it('should round numbers to specified number of decimals', () => {
    expect(roundNumberToPrecision(0.0078, 3)).toEqual('0.008');
    expect(roundNumberToPrecision(-0.0078, 3)).toEqual('-0.008');
    expect(roundNumberToPrecision(-0.02, 3)).toEqual('-0.020');
  });

  it('should remove trailing zeros if removeTrailingZeros === true', () => {
    expect(roundNumberToPrecision(0.01, 3, true)).toEqual('0.01');
    expect(roundNumberToPrecision(-0.01, 3, true)).toEqual('-0.01');
    expect(roundNumberToPrecision(25.0, 3, true)).toEqual('25');
  });

  it('should return string in exponential notation if abs(value) is smaller than specified precision', () => {
    expect(roundNumberToPrecision(0.00758, 1)).toEqual('7.6e-3');
    expect(roundNumberToPrecision(-0.00758, 1)).toEqual('-7.6e-3');
    expect(roundNumberToPrecision(0.001, 2)).toEqual('1.00e-3');
  });

  it('should use exponentialDecimals parameter for exponential precision if it is specified', () => {
    expect(roundNumberToPrecision(0.0025, 2, false, 1)).toEqual('2.5e-3');
    expect(roundNumberToPrecision(0.0025, 2, true, 1)).toEqual('2.5e-3');
    expect(roundNumberToPrecision(-0.0025, 2, false, 2)).toEqual('-2.50e-3');
    expect(roundNumberToPrecision(0.0025, 2, false, 4)).toEqual('2.5000e-3');
  });

  it('should return "NaN", "Infinity" acoordingly to the original value', () => {
    expect(roundNumberToPrecision(NaN, 2)).toEqual('NaN');
    expect(roundNumberToPrecision(Infinity, 2)).toEqual('Infinity');
    expect(roundNumberToPrecision(-Infinity, 2)).toEqual('-Infinity');
  });
});

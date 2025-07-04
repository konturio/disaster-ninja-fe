import { describe, expect, it } from 'vitest';
import { checkIfCondition } from './checkIfCondition';
import type { UniLayoutIfCondition } from '../Layout/types';

describe('checkIfCondition()', () => {
  it('should return false for invalid operator', () => {
    expect(
      checkIfCondition(true, {
        op: '&&',
        value: true,
      } as unknown as UniLayoutIfCondition),
    ).toEqual(false);
  });

  // ==
  it('== should return true for equal strings', () => {
    expect(
      checkIfCondition('ABC', {
        op: '==',
        value: 'ABC',
      }),
    ).toEqual(true);
  });

  it('== should return false for inequal strings', () => {
    expect(
      checkIfCondition('123', {
        op: '==',
        value: 'ABC',
      }),
    ).toEqual(false);
  });

  it('== should return false for values of different types', () => {
    expect(
      checkIfCondition('123', {
        op: '==',
        value: 123,
      }),
    ).toEqual(false);
  });

  // !==
  it('!== should return true for inequal values', () => {
    expect(
      checkIfCondition('123', {
        op: '!==',
        value: 'ABC',
      }),
    ).toEqual(true);
  });

  it('!== should return false for equal values', () => {
    expect(
      checkIfCondition(123, {
        op: '!==',
        value: 123,
      }),
    ).toEqual(false);
  });

  it('!== should return true for values of different types', () => {
    expect(
      checkIfCondition('123', {
        op: '!==',
        value: 123,
      }),
    ).toEqual(true);
  });

  // >
  it('> should return true if the first value (v1) bigger than the second value (v2)', () => {
    expect(
      checkIfCondition(100, {
        op: '>',
        value: 0,
      }),
    ).toEqual(true);
  });

  it('> should return false if v1 === v2', () => {
    expect(
      checkIfCondition(100, {
        op: '>',
        value: 100,
      }),
    ).toEqual(false);
  });

  it('> should return false if v1 < v2', () => {
    expect(
      checkIfCondition(-100, {
        op: '>',
        value: 0,
      }),
    ).toEqual(false);
  });

  // >=
  it('>= should return true if the first value (v1) bigger than the second value (v2)', () => {
    expect(
      checkIfCondition(100, {
        op: '>=',
        value: 0,
      }),
    ).toEqual(true);
  });

  it('>= should return true if v1 === v2', () => {
    expect(
      checkIfCondition(100, {
        op: '>=',
        value: 100,
      }),
    ).toEqual(true);
  });

  it('>= should return false if v1 < v2', () => {
    expect(
      checkIfCondition(-100, {
        op: '>=',
        value: 0,
      }),
    ).toEqual(false);
  });

  // <
  it('< should return true if the first value (v1) smaller than the second value (v2)', () => {
    expect(
      checkIfCondition(-100, {
        op: '<',
        value: 0,
      }),
    ).toEqual(true);
  });

  it('< should return false if v1 === v2', () => {
    expect(
      checkIfCondition(100, {
        op: '<',
        value: 100,
      }),
    ).toEqual(false);
  });

  it('< should return false if v1 > v2', () => {
    expect(
      checkIfCondition(100, {
        op: '<',
        value: 0,
      }),
    ).toEqual(false);
  });

  // <=
  it('<= should return true if the first value (v1) smaller than the second value (v2)', () => {
    expect(
      checkIfCondition(-100, {
        op: '<=',
        value: 0,
      }),
    ).toEqual(true);
  });

  it('<= should return true if v1 === v2', () => {
    expect(
      checkIfCondition(100, {
        op: '<=',
        value: 100,
      }),
    ).toEqual(true);
  });

  it('<= should return false if v1 > v2', () => {
    expect(
      checkIfCondition(100, {
        op: '<=',
        value: 0,
      }),
    ).toEqual(false);
  });
});

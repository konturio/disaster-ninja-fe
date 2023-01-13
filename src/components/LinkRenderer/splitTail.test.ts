import { expect, it } from 'vitest';
import { splitTail } from './splitTail';

it('Split string on two parts with fixed size tail', () => {
  expect(splitTail('abcdef', 3)).toEqual(['abc', 'def']);
  expect(splitTail('abcde', 3)).toEqual(['ab', 'cde']);
});
it('Whole string becomes tail when string shorter than tailSize', () => {
  expect(splitTail('abcdef', 10)).toEqual(['', 'abcdef']);
});

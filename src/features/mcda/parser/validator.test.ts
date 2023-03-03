import { test, expect } from 'vitest';
import { createValidator } from './validator';

test('Validator throw error if layers absent', () => {
  const [isJsonMCDA, errors] = createValidator();
  expect(isJsonMCDA({})).toBe(false);
  expect(errors).toContain('Json must include "layers" property');
});

test('Validator throw error if layers not array', () => {
  const [isJsonMCDA, errors] = createValidator();
  expect(isJsonMCDA({ layers: {} })).toBe(false);
  expect(errors).toContain('"layers" property must be an Array');
});

test('Validator throw error if layers an empty array', () => {
  const [isJsonMCDA, errors] = createValidator();
  expect(isJsonMCDA({ layers: [] })).toBe(false);
  expect(errors).toContain('You need at least one layer');
});

test('Validator throw error if colors absent', () => {
  const [isJsonMCDA, errors] = createValidator();
  expect(isJsonMCDA({})).toBe(false);
  expect(errors).toContain('Json must include "colors" property');
});

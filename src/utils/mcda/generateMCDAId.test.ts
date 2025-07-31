import { describe, test, expect, vi } from 'vitest';
import { generateMCDAId } from './generateMCDAId';

vi.mock('nanoid', () => ({ nanoid: () => 'abcd' }));

describe('generateMCDAId', () => {
  test('adds prefix and random id', () => {
    expect(generateMCDAId()).toBe('mcda-layer_abcd');
    expect(generateMCDAId('custom')).toBe('custom_abcd');
  });
});

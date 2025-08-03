import { describe, it, expect } from 'vitest';
import { USER_LAYER_FIELDS, FieldTypes } from './constants';

describe('USER_LAYER_FIELDS', () => {
  it('does not contain placeholder option', () => {
    const placeholder = USER_LAYER_FIELDS.find((f) => f.type === FieldTypes.None);
    expect(
      placeholder,
      'USER_LAYER_FIELDS should not contain placeholder option with type "none"',
    ).toBeUndefined();
  });
});

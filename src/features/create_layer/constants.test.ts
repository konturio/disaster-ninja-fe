import { describe, it, expect } from 'vitest';
import { USER_LAYER_FIELDS, FieldTypes } from './constants';

describe('USER_LAYER_FIELDS', () => {
  it('does not contain placeholder option', () => {
    USER_LAYER_FIELDS.forEach((field) =>
      expect(
        field.type,
        `Unexpected placeholder option with type "none" found at label "${field.label}"`,
      ).not.toBe(FieldTypes.None),
    );
  });
});

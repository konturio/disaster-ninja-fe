import { describe, expect, it } from 'vitest';
import { splitTextIntoSections } from './utils';

describe('splitTextIntoSections', () => {
  it('should split text into sections with default names', () => {
    const text = 'Text 1 <!-- Section2 --> Text 2 <!-- Section3 --> Text 3';
    const expected = [
      ['INITIAL', 'Text 1'],
      ['Section2', 'Text 2'],
      ['Section3', 'Text 3'],
    ];
    expect(splitTextIntoSections(text)).toEqual(expected);
  });

  it('should split text into sections with custom initial name', () => {
    const text = 'Text 1 <!-- Section2 --> Text 2 <!-- se_2 --> Text 3';
    const expected = [
      ['Custom Initial', 'Text 1'],
      ['Section2', 'Text 2'],
      ['se_2', 'Text 3'],
    ];
    expect(splitTextIntoSections(text, 'Custom Initial')).toEqual(expected);
  });

  it('should split text into sections with custom default name', () => {
    const text = 'Text 1 <!-- Section2 --> Text 2 <!-- --> Text 3';
    const expected = [
      ['INITIAL', 'Text 1'],
      ['Section2', 'Text 2'],
      ['Custom Default', 'Text 3'],
    ];
    expect(splitTextIntoSections(text, undefined, 'Custom Default')).toEqual(expected);
  });

  it('should handle empty text', () => {
    const text = '';
    const expected = [];
    expect(splitTextIntoSections(text)).toEqual(expected);
  });

  it('should handle text with no sections', () => {
    const text = 'Text 1';
    const expected = [['INITIAL', 'Text 1']];
    expect(splitTextIntoSections(text)).toEqual(expected);
  });

  it('should handle text that starts with a section', () => {
    const text = '<!-- Section1 --> Text 1 <!-- Section2 --> Text 2';
    const expected = [
      ['Section1', 'Text 1'],
      ['Section2', 'Text 2'],
    ];
    expect(splitTextIntoSections(text)).toEqual(expected);
  });

  it('should handle text that ends with a section', () => {
    const text = 'Text 1 <!-- Section1 --> Text 2 <!-- Section2 -->';
    const expected = [
      ['INITIAL', 'Text 1'],
      ['Section1', 'Text 2'],
      ['Section2', ''],
    ];
    expect(splitTextIntoSections(text)).toEqual(expected);
  });
});

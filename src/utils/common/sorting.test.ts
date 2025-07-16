import { expect, describe, it } from 'vitest';
import { sortByAlphabet, sortByNumber, sortByWordOccurrence } from './sorting';
import type { SelectableItem } from '@konturio/ui-kit';

describe('sortByWordOccurrence', () => {
  it('should sort items based on earlier occurrence of the substring at a starting word boundary', () => {
    const items: SelectableItem[] = [
      { title: 'CCC. Lower case word', value: '1' },
      { title: 'BB. Words can be plural', value: '2' },
      { title: 'A. Word', value: '3' },
      { title: 'Nonword. Not at the start boundary, does not count', value: '4' },
      { title: 'Word at the start of the line', value: '5' },
    ];
    sortByWordOccurrence(items, (item) => item.title, 'word');
    expect(items).toMatchSnapshot();
  });
});

describe('sortByAlphabet', () => {
  it('should sort items alphabetically, ignoring case', () => {
    const items: SelectableItem[] = [
      { title: 'CCC', value: '1' },
      { title: 'BB', value: '2' },
      { title: 'Ab', value: '3' },
      { title: 'ac longer item', value: '4' },
      { title: '999 numbers are earlier than letters', value: '5' },
    ];
    sortByAlphabet(items, (item) => item.title);
    expect(items).toMatchSnapshot();
  });
});

describe('sortByNumber', () => {
  it('should sort items numerically in descending order', () => {
    const items: SelectableItem[] = [
      { title: 'Value 5', value: 5 },
      { title: 'Value 2', value: 2 },
      { title: 'Value 3', value: 3 },
      { title: 'Value 1', value: 1 },
      { title: 'Value 4', value: 4 },
    ];
    sortByNumber(items, (item) => item.value, 'desc');
    expect(items.map((v) => v.value)).toEqual([5, 4, 3, 2, 1]);
  });

  it('should sort items numerically in ascending ordrer', () => {
    const items: SelectableItem[] = [
      { title: 'Value 5', value: 5 },
      { title: 'Value 2', value: 2 },
      { title: 'Value 3', value: 3 },
      { title: 'Value 1', value: 1 },
      { title: 'Value 4', value: 4 },
    ];
    sortByNumber(items, (item) => item.value, 'asc');
    expect(items.map((v) => v.value)).toEqual([1, 2, 3, 4, 5]);
  });
});

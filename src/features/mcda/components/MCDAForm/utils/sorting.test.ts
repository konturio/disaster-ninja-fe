import { expect, describe, it } from 'vitest';
import { sortByAlphabet, sortByWordOccurence } from './sorting';
import type { SelectableItem } from '@konturio/ui-kit';

describe('sortByWordOccurence', () => {
  it('should sort items based on earlier occurence of the substring at a starting word boundary', () => {
    const items: SelectableItem[] = [
      { title: 'CCC. Lower case word', value: '1' },
      { title: 'BB. Words can be plural', value: '2' },
      { title: 'A. Word', value: '3' },
      { title: 'Nonword. Not at the start boundary, does not count', value: '4' },
      { title: 'Word at the start of the line', value: '5' },
    ];
    sortByWordOccurence(items, 'word');
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
    sortByAlphabet(items);
    expect(items).toMatchSnapshot();
  });
});

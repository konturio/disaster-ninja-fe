import type { SelectableItem } from '@konturio/ui-kit';

export function sortByAlphabet(items: SelectableItem[]) {
  return items.sort((axis1, axis2) =>
    axis1.title?.localeCompare(axis2.title, undefined, { sensitivity: 'base' }),
  );
}

/**
 * Sorts an array in place. Item moves higher if the substring occurs at the start
 * of a word boundary. The earlier the occurence - the higher the item moves.
 */
export function sortByWordOccurence(items: SelectableItem[], substring: string) {
  items.sort((axis1, axis2) => {
    const regex = new RegExp(`\\b(${substring})`, 'i');
    const NOT_FOUND = 10000;
    const axis1FirstWordIndex = axis1.title.search(regex);
    const axis2FirstWordIndex = axis2.title.search(regex);
    return (
      (axis1FirstWordIndex >= 0 ? axis1FirstWordIndex : NOT_FOUND) -
      (axis2FirstWordIndex >= 0 ? axis2FirstWordIndex : NOT_FOUND)
    );
  });
}

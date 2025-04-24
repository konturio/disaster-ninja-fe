import type { SelectableItem } from '@konturio/ui-kit';

export const sortByKey =
  <T extends Record<string, unknown>>(key: string, direction: 'asc' | 'desc') =>
  (a: T, b: T) => {
    const aVal = a[key];
    const bVal = b[key];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return direction === 'desc' ? bVal - aVal : aVal - bVal;
    }
    return 0;
  };

/**
 * Sorts an array in place alphabetically.
 **/
export function sortByAlphabet<T>(items: T[], getValue: (item: T) => string): T[] {
  return items.sort((item1, item2) =>
    getValue(item1).localeCompare(getValue(item2), undefined, { sensitivity: 'base' }),
  );
}

/**
 * Sorts an array in place. Item moves higher if the substring occurs at the start
 * of a word boundary. The earlier the occurrence - the higher the item moves.
 */
export function sortByWordOccurrence<T>(
  items: T[],
  getItemValue: (item: T) => string,
  word: string,
): T[] {
  return items.sort((item1, item2) => {
    const regex = new RegExp(`\\b(${word})`, 'i');
    const NOT_FOUND = 10000;
    const axis1FirstWordIndex = getItemValue(item1).search(regex);
    const axis2FirstWordIndex = getItemValue(item2).search(regex);
    return (
      (axis1FirstWordIndex >= 0 ? axis1FirstWordIndex : NOT_FOUND) -
      (axis2FirstWordIndex >= 0 ? axis2FirstWordIndex : NOT_FOUND)
    );
  });
}

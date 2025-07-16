type PropertyAccessor<T, V> = (data: T) => V;

export function sortByNumericProperty<T>(
  items: T[],
  accessor: PropertyAccessor<T, number>,
  direction: 'asc' | 'desc' = 'desc',
) {
  const comparator = (a: T, b: T) =>
    direction === 'desc' ? -(accessor(a) - accessor(b)) : accessor(a) - accessor(b);

  return items.sort(comparator);
}

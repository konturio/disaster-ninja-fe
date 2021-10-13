export function sortByPredefinedOrder<T extends { id: string }>(
  controls: T[],
  order: string[],
): T[] {
  return [...controls].sort((c1, c2) => {
    return order.indexOf(c1.id) - order.indexOf(c2.id);
  });
}

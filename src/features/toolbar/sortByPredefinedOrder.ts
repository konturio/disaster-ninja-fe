export function sortByPredefinedOrder<
  T extends { id: string; icon: JSX.Element | null },
>(controls: T[], order: string[]): T[] {
  const res = [...controls]
    .sort((c1, c2) => {
      return order.indexOf(c1.id) - order.indexOf(c2.id);
    })
    .filter((control) => control.icon);
  return res;
}

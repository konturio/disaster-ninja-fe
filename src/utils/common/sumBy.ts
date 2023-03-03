export const sumBy = <T extends string>(arr: Array<Record<T, number>>, prop: T) =>
  arr.reduce((acc, item) => acc + item[prop], 0);

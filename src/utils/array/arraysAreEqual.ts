export function arraysAreEqualWithStrictOrder<T>(
  array1: T[],
  array2: T[],
): boolean {
  return (
    array1.length === array2.length &&
    array1.every((value, index) => value === array2[index])
  );
}

export function arraysAreEqual<T>(array1: T[], array2: T[]): boolean {
  return (
    array1.length === array2.length &&
    arraysAreEqualWithStrictOrder(array1.slice().sort(), array2.slice().sort())
  );
}

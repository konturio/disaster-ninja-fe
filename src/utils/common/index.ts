export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const toCapitalizedList = (arr: string[]): string =>
  arr.map(capitalize).join(', ');

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

export const isErrorWithMessage = (
  e: unknown,
): e is {
  message: string;
  [key: string]: any;
} => {
  return e !== null && typeof e === 'object' && 'message' in e;
};

type simpleObject = Record<string, string | boolean | number | undefined | null>;

export function flatObjectsAreEqual(
  objectA: simpleObject | null,
  objectB: simpleObject | null,
) {
  if (objectA === null || objectB === null) return false;
  const aKeys = Object.keys(objectA);
  const bKeys = Object.keys(objectB);
  if (!aKeys.length && !bKeys.length) return true;
  if (aKeys.length !== bKeys.length) return false;

  for (let i = 0; i < aKeys.length; i++) {
    const keyToCompare = aKeys[i];
    if (!(keyToCompare in objectB)) return false;
    if (objectA[keyToCompare] !== objectB[keyToCompare]) return false;
  }
  return true;
}

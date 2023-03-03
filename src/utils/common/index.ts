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

type flatObject = Record<string, string | boolean | number | undefined | null>;

export function flatObjectsAreEqual(
  objectA: flatObject | null,
  objectB: flatObject | null,
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

type NoUndefinedField<T> = {
  [P in keyof T]-?: Exclude<T[P], null | undefined>;
};

export const removeEmpty = <T extends Record<string, unknown | null | undefined>>(
  obj: T,
): NoUndefinedField<T> =>
  Object.keys(obj).reduce((acc, key: keyof T) => {
    if (obj[key] !== undefined && obj[key] !== null) {
      acc[key] = obj[key] as NoUndefinedField<T>[keyof T];
    }
    return acc;
  }, {} as NoUndefinedField<T>);

export function transformIconLink(iconPath: string) {
  if (iconPath.startsWith('http')) return iconPath;

  const iconLocations = iconPath.split('/');
  const iconName = iconLocations[iconLocations.length - 1];
  const iconStaticPath =
    import.meta.env?.VITE_BASE_PATH +
    import.meta.env?.VITE_STATIC_PATH +
    'favicon/' +
    iconName;
  return iconStaticPath;
}

export const sumBy = <T extends string>(arr: Array<Record<T, number>>, prop: T) =>
  arr.reduce((acc, item) => acc + item[prop], 0);

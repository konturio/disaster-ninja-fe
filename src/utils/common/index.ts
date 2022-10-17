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

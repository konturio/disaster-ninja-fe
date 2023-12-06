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

export const withoutUndefined = <T>(x: T | undefined): x is NonNullable<T> =>
  x !== undefined;

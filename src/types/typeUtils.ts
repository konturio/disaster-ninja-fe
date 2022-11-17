export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

export type NonNullableField<T, K extends keyof T> = T & NonNullableFields<Pick<T, K>>;

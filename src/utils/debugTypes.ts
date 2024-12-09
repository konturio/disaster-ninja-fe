/**
 * Expands object types one level deep
 */
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

/**
 * Expands object types recursively
 */
export type ExpandRecursively<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T;

/**
 * Forces type display in IDE
 */
export type Debug<T> = { [P in keyof T]: T[P] } & {};

/**
 * Type assertion utility
 */
export type IsExact<T, U> =
  (<G>() => G extends T ? 1 : 2) extends <G>() => G extends U ? 1 : 2 ? true : false;

export type Assert<T extends true> = T;

export type AssertEquals<T, U> = IsExact<T, U> extends true ? Assert<true> : never;

/**
 * Pretty print object type
 */
export type Format<T> = {
  [P in keyof T]: T[P];
} extends infer O
  ? { [P in keyof O]: O[P] }
  : never;

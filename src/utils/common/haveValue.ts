/* when you want use if (value) { ... } and value can be a number */
export const haveValue = <T>(val: T | undefined | null): val is T =>
  val !== undefined && val !== null;

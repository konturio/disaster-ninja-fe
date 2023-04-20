export interface Constructor<T> {
  new (settings?: { timeout?: number }): T;
}

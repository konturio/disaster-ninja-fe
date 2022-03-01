export function deepFreeze<T = unknown>(object: T): T {
  if (object && typeof object === 'object') {
    const propNames = Object.getOwnPropertyNames(object);
    for (const name of propNames) {
      const value = (object as Record<string, unknown>)[name];
      deepFreeze(value);
    }
    return Object.freeze(object);
  }
  return object;
}

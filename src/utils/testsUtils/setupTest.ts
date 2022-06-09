import anyTest from 'ava';
import type { TestInterface } from 'ava';

/* Allow setup typed context */
// https://github.com/avajs/ava/blob/main/docs/recipes/typescript.md
export function setupTestContext<T extends Record<string, unknown>>(
  contextOrCallback: (() => T) | T,
) {
  let context: T;
  const test = anyTest as TestInterface<typeof context>;
  test.beforeEach((t) => {
    if (typeof contextOrCallback === 'function') {
      context = contextOrCallback();
    } else {
      context = contextOrCallback;
    }
    t.context = context;
  });
  return test;
}

export const createLocalStorageMock = () => ({
  getItem: (key: string) => null,
  setItem: (key: string, value: string) => null,
  removeItem: (key: string) => null,
  clear: () => null,
  key: (idx: number) => null,
  length: 0,
});

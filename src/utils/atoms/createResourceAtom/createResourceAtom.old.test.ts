import { expect, test, describe, vi } from 'vitest';
import { createBooleanAtom, createPrimitiveAtom } from './createPrimitives';
import { createResourceAtom } from './createResourceAtom';

const wait = (sec: number) => new Promise((res) => setTimeout(res, sec * 1000));
const waitCallbackBeenCalled = (fn) => {
  let resolve: (value: unknown) => void;
  const promise = new Promise((r) => (resolve = r));
  return [
    vi.fn((...args) => {
      resolve(true);
      return fn(...args);
    }),
    promise,
  ] as const;
};

test('Ignore response of previous request after new request created (lazy mode)', async () => {
  const deps = createPrimitiveAtom({});
  let i = 0;
  const atom = createResourceAtom(
    async () => {
      await wait(0.3);
      return i++;
    },
    deps,
    'testResource',
    true,
  );
  // Record state changes
  const stateChanges = vi.fn(async () => null);
  atom.subscribe(stateChanges);

  deps.set.dispatch({ value: 'foo' });
  await wait(0.1); // prevent batching
  deps.set.dispatch({ value: 'bar' });
  await wait(0.3); // wait until last request ended
  expect(stateChanges.mock.calls.length).toBe(2);
  // @ts-expect-error - typescript can't handle such dynamic code
  expect(stateChanges.mock.calls[1][0].data).toBe(2);
});

test.todo(
  'Ignore response of previous request after new request created in lazy mode',
  async () => {
    // Required ability to pass custom store for listening changes with subscriber
  },
);

test.todo('Send abort signal when request canceled', () => {
  // Required ability cancel requests by default
});

describe('Resource atom without deps', () => {
  test('Auto fetch data when created by default', () => {
    const fetcher = vi.fn(async () => null);
    createResourceAtom(fetcher);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  test('Fetch data only when have subscribers (lazy)', () => {
    const fetcher = vi.fn(async () => null);
    createResourceAtom(fetcher, null, 'testResource', true);
    expect(fetcher).toHaveBeenCalledTimes(0);
  });
});

describe('Resource atom with deps', () => {
  test('Auto fetch data when created by default', () =>
    new Promise((done) => {
      const deps = createBooleanAtom(false);
      createResourceAtom(async () => {
        done(true);
      }, deps);
    }));

  test('Fetch data only when have subscribers (lazy)', async () => {
    const fetcher = vi.fn(async () => null);
    const deps = createBooleanAtom();
    const atom = createResourceAtom(fetcher, deps, 'testResource', true);
    await wait(0.1);
    expect(fetcher).toHaveBeenCalledTimes(0);
    atom.subscribe(() => null);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  test('Re-run fetcher when deps changed', async () => {
    const [fetcher, hasBeenCalled] = waitCallbackBeenCalled(() => null);
    const deps = createBooleanAtom(false);
    const atom = createResourceAtom(
      async () => fetcher(),
      deps,
      'testResource',
      true,
    );
    atom.subscribe(() => null); // +1
    deps.setTrue.dispatch(); // +1
    await hasBeenCalled;
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
});

describe('Resource atoms chain', () => {
  test.todo('Inherit loading state', () => {
    // TODO after refactor
  });

  test.todo('Inherit error state', () => {
    // TODO after refactor
  });

  test.todo('Inherit canceled state', () => {
    // TODO after refactor
  });
});

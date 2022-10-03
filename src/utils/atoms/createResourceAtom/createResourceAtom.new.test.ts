import { createStore } from '@reatom/core';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import { createResourceAtom } from './createResourceAtom';
import { ABORT_ERROR_MESSAGE } from './abort-error';
import type { Store } from '@reatom/core';

const id = (() => {
  const idCreator = function* () {
    let i = 0;
    while (true) yield i++;
  };
  const idsGenerator = idCreator();
  return () => String(idsGenerator.next().value);
})();

const wait = (sec = 1, opt: { failWithMessage?: string } = {}) =>
  new Promise((res, rej) =>
    setTimeout(
      opt?.failWithMessage ? () => rej({ message: opt.failWithMessage }) : res,
      sec,
    ),
  );

declare module 'vitest' {
  export interface TestContext {
    store: Store;
  }
}

beforeEach(async (context) => {
  context.store = createStore();
});

describe('Resource atom add resource state structure', () => {
  test('have correct initial state', ({ store }) => {
    const resAtomA = createResourceAtom(null, async () => null, 'resAtomA', {
      store,
    });

    expect(resAtomA.getState()).toEqual({
      loading: false,
      data: null,
      error: null,
      lastParams: null,
      dirty: false,
    });
  });

  test('have correct loading state', ({ store }) => {
    const resAtomA = createResourceAtom(null, async () => await wait(1), 'resAtomA', {
      store,
    });
    store.dispatch(resAtomA.request(null));
    expect(resAtomA.getState()).toMatchObject({
      loading: true,
      error: null,
    });
  });

  test('have correct lastParams state', async ({ store }) => {
    const resAtomA = createResourceAtom(null, async () => await wait(1), 'resAtomA', {
      store,
    });
    store.dispatch(resAtomA.request('foo'));
    expect(resAtomA.getState()).toMatchObject({
      lastParams: 'foo',
    });
  });

  test('have correct error state', async ({ store }) => {
    const resAtomA = createResourceAtom(
      null,
      async () => await wait(1, { failWithMessage: 'Test error' }),
      'resAtomA',
      { store },
    );
    store.dispatch(resAtomA.request('foo'));
    await wait(1);
    expect(resAtomA.getState().error).toBe('Test error');
  });

  test('have correct data state', async ({ store }) => {
    const resAtomA = createResourceAtom(
      null,
      async () => {
        await wait(1);
        return 1;
      },
      id(),
      { store },
    );
    store.dispatch(resAtomA.request('foo'));
    await wait(1);
    expect(resAtomA.getState()).toMatchObject({
      data: 1,
    });
  });
});

describe('Resource canceling', () => {
  test('Resource call abort of abortController when request canceled', async ({
    store,
  }) => {
    const onAbort = vi.fn(async () => null);
    const resAtomA = createResourceAtom(
      null,
      async (value, abortController) => {
        abortController.signal.addEventListener('abort', onAbort);
        await wait(1);
        return value;
      },
      id(),
      {
        store,
      },
    );
    store.dispatch(resAtomA.request(1));
    await wait(0.5);
    store.dispatch(resAtomA.request(2));
    expect(onAbort).toHaveBeenCalledTimes(1);
  });

  test('Resource set error:canceled state after canceled by other request', async ({
    store,
  }) => {
    const stateChangesLog = vi.fn(async (arg) => null);

    const resAtomA = createResourceAtom(
      null,
      async (value, abortController) => {
        await Promise.race([
          wait(5),
          new Promise((res, rej) =>
            abortController.signal.addEventListener('abort', () => {
              const error = new Error();
              // @ts-expect-error - this custom error of our api client
              error.problem = { kind: 'canceled' };
              rej(error);
            }),
          ),
        ]);
        return value;
      },
      id(),
      {
        store,
      },
    );

    resAtomA.subscribe((s) => stateChangesLog(s));

    store.dispatch(resAtomA.request(1));
    await wait(1);
    store.dispatch(resAtomA.request(2));

    while (stateChangesLog.mock.calls.length < 5) {
      await wait(1);
    }

    // first request loading state
    expect(stateChangesLog).toHaveBeenNthCalledWith(2, {
      loading: true,
      data: null,
      error: null,
      lastParams: 1,
      dirty: true,
    });

    expect(stateChangesLog).toHaveBeenNthCalledWith(3, {
      loading: false, // should out from loading state
      data: null,
      error: ABORT_ERROR_MESSAGE,
      lastParams: 1, // should have parameters of request that was canceled
      dirty: true,
    });

    expect(stateChangesLog).toHaveBeenNthCalledWith(4, {
      loading: true,
      data: null,
      error: null, // reset error on new request
      lastParams: 2,
      dirty: true,
    });

    expect(stateChangesLog).toHaveBeenNthCalledWith(5, {
      loading: false,
      data: 2,
      error: null,
      lastParams: 2,
      dirty: true,
    });
  });

  test('Resource set error state after canceled by cancel action', async ({ store }) => {
    const stateChangesLog = vi.fn(async (arg) => null);

    const resAtomA = createResourceAtom(
      null,
      async (value, abortController) => {
        await Promise.race([
          wait(5),
          new Promise((res, rej) =>
            abortController.signal.addEventListener('abort', () => {
              const error = new Error();
              // @ts-expect-error - this custom error of our api client
              error.problem = { kind: 'canceled' };
              rej(error);
            }),
          ),
        ]);
        return value;
      },
      id(),
      {
        store,
      },
    );

    resAtomA.subscribe((s) => stateChangesLog(s));

    store.dispatch(resAtomA.request(1));
    await wait(1);
    store.dispatch(resAtomA.cancel());

    while (stateChangesLog.mock.calls.length < 3) {
      await wait(1);
    }

    expect(stateChangesLog).toHaveBeenNthCalledWith(2, {
      loading: true,
      data: null,
      error: null,
      lastParams: 1,
      dirty: true,
    });

    expect(stateChangesLog).toHaveBeenNthCalledWith(3, {
      loading: false, // should out from loading state
      data: null,
      error: ABORT_ERROR_MESSAGE,
      lastParams: 1, // should have parameters of request that was canceled
      dirty: true,
    });
  });

  test('Resource set error:canceled state after canceled by other request when fetcher use try catch', async ({
    store,
  }) => {
    const stateChangesLog = vi.fn(async (arg) => null);

    const resAtomA = createResourceAtom(
      null,
      async (value) => {
        // I'am not rise any error in fetcher on cancel
        // It's the similar to wrap real fetcher in try catch
        // Because our client rise error on cancel signal automatically
        await wait(5);
        return value;
      },
      id(),
      {
        store,
      },
    );

    resAtomA.subscribe((s) => stateChangesLog(s));

    store.dispatch(resAtomA.request(1));
    await wait(1);
    store.dispatch(resAtomA.request(2));

    while (stateChangesLog.mock.calls.length < 3) {
      await wait(1);
    }
    expect(stateChangesLog).toHaveBeenNthCalledWith(3, {
      error: ABORT_ERROR_MESSAGE,
      dirty: true,
      data: null,
      lastParams: 1, // should have parameters of request that was canceled
      loading: false, // should out from loading state
    });
  });
});

describe('Resource refetch', () => {
  test.todo('Resource can be re-fetched with last parameters', () => {
    // TODO
  });

  test.todo('Resource ignore refetch if in already in loading state', () => {
    // TODO
  });

  test.todo('Resource ignore refetch if it never fetched before', () => {
    // TODO
  });
});

describe('Resource atoms chaining state', () => {
  test('Inherit loading state', async ({ store }) => {
    const resAtomA = createResourceAtom(
      null,
      async () => {
        await wait(1);
      },
      id(),
      { store },
    );

    const resAtomB = createResourceAtom(
      resAtomA,
      async () => {
        await wait(1);
      },
      id(),
      { store },
    );

    store.dispatch(resAtomA.request(null));
    await wait(0.1);
    expect(resAtomB.getState().loading).toBe(true);
  });

  test('Inherit error state', async ({ store }) => {
    const resAtomA = createResourceAtom(
      null,
      async () => {
        await wait(1, { failWithMessage: 'Test error' });
      },
      id(),
      { store },
    );

    const resAtomB = createResourceAtom(
      resAtomA,
      async () => {
        await wait(1);
      },
      id(),
      { store, inheritState: true },
    );

    store.dispatch(resAtomA.request(null));
    await wait(0.1);
    expect(resAtomB.getState().error).toBe('Test error');
  });

  test.todo('Not inherit loading state when chaining disabled', async ({ store }) => {
    const resAtomA = createResourceAtom(
      null,
      async () => {
        await wait(1);
        return 'result';
      },
      id(),
      { store },
    );
    resAtomA.subscribe(() => null);
    await wait(1);

    const resAtomB = createResourceAtom(
      resAtomA,
      async () => {
        await wait(1);
      },
      id(),
      { store, inheritState: false },
    );
    resAtomB.subscribe(() => null);

    await wait(1);

    expect(resAtomA.getState().loading).toBe(true);
    expect(resAtomB.getState().loading).toBe(false);
  });
});

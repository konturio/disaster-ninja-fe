import { createAtom, createStore } from '@reatom/core-v2';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import { createBooleanAtom } from '@reatom/core-v2/primitives';
import { incrementId, wait, waitMockCalls } from '~utils/test';
import { createAsyncAtom } from './createAsyncAtom';
import { ABORT_ERROR_MESSAGE } from './abort-error';
import type { Store } from '@reatom/core-v2';

const id = incrementId;

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
    const resAtomA = createAsyncAtom(null, async () => null, id(), {
      store,
      auto: false,
    });

    expect(resAtomA.getState()).toEqual({
      loading: false,
      data: null,
      error: null,
      lastParams: null,
      dirty: false,
    });
  });

  test('have correct loading state', async ({ store }) => {
    const resAtomA = createAsyncAtom(null, async () => await wait(1), id(), {
      store,
    });
    store.dispatch(resAtomA.request(null));
    expect(resAtomA.getState()).toMatchObject({
      loading: true,
      error: null,
    });
  });

  test('have correct lastParams state', async ({ store }) => {
    const resAtomA = createAsyncAtom(
      null,
      async (_, abortController) => await wait(1),
      id(),
      {
        store,
      },
    );
    store.dispatch(resAtomA.request('foo'));
    await wait(0.1);
    expect(resAtomA.getState()).toMatchObject({
      lastParams: 'foo',
    });
  });

  test('have correct error state', async ({ store }) => {
    const resAtomA = createAsyncAtom(
      null,
      async (params) =>
        /* Throw error when 'bad' in params */
        await wait(1, params === 'bad' ? { failWithMessage: 'Test error' } : {}),
      'resAtomA',
      { store, auto: false },
    );
    store.dispatch(resAtomA.request('bad'));
    await wait(2);
    expect(resAtomA.getState().error).toBe('Test error');
    store.dispatch(resAtomA.request('good'));
    await wait(1);
    expect(resAtomA.getState().error).toBe(null);
  });

  test('have correct data state', async ({ store }) => {
    const resAtomA = createAsyncAtom(
      null,
      async () => {
        await wait(1);
        return 1;
      },
      id(),
      { store, auto: false },
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
    const resAtomA = createAsyncAtom(
      null,
      async (value, abortController) => {
        abortController.signal.addEventListener('abort', onAbort);
        await wait(1);
        return value;
      },
      id(),
      {
        store,
        auto: false,
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

    const resAtomA = createAsyncAtom(
      null,
      async (value, abortController) => {
        await Promise.race([
          wait(3), // TODO: Check why it still waiting after abort (set 5 for fail test)
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
        auto: false,
      },
    );

    resAtomA.subscribe((s) => stateChangesLog(s));

    store.dispatch(resAtomA.request(1));
    await wait(1);
    store.dispatch(resAtomA.request(2));

    await waitMockCalls(stateChangesLog, 5);

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

    const resAtomA = createAsyncAtom(
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
        auto: false,
      },
    );

    resAtomA.subscribe((s) => stateChangesLog(s));

    store.dispatch(resAtomA.request(1));
    await wait(1);
    store.dispatch(resAtomA.cancel());

    await waitMockCalls(stateChangesLog, 3);

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

  test('Resource not wait aborted request for continue work', async ({ store }) => {
    const stateChangesLog = vi.fn(async (arg) => null);

    const resAtomA = createAsyncAtom(
      null,
      async (value) => {
        // timeout longer than available
        await wait(5);
        return value;
      },
      id(),
      {
        store,
        auto: false,
      },
    );

    resAtomA.subscribe((s) => stateChangesLog(s));

    store.dispatch(resAtomA.request(1));
    await wait(1);
    store.dispatch(resAtomA.request(2));

    await waitMockCalls(stateChangesLog, 3);

    expect(stateChangesLog).toHaveBeenNthCalledWith(3, {
      error: ABORT_ERROR_MESSAGE,
      dirty: true,
      data: null,
      lastParams: 1, // should have parameters of request that was canceled
      loading: false, // should out from loading state
    });
  });

  test('Resource set error:canceled state after canceled by other request when fetcher use try catch', async ({
    store,
  }) => {
    const stateChangesLog = vi.fn(async (arg) => null);

    const resAtomA = createAsyncAtom(
      null,
      async (value) => {
        // I'am not rise any error in fetcher on cancel
        // It's the similar to wrap real fetcher in try catch
        // Because our client rise error on cancel signal automatically
        await wait(3);
        return value;
      },
      id(),
      {
        store,
        auto: false,
      },
    );

    resAtomA.subscribe((s) => stateChangesLog(s));

    store.dispatch(resAtomA.request(1));
    await wait(1);
    store.dispatch(resAtomA.request(2));

    await waitMockCalls(stateChangesLog, 3);

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
  test('Resource can be re-fetched with last parameters', async ({ store }) => {
    const stateChangesLog = vi.fn(async (arg) => null);

    let i = 0;
    const resAtomA = createAsyncAtom(
      null,
      async (value) => {
        await wait(0.5);
        return value + ++i;
      },
      id(),
      {
        store,
        auto: false,
      },
    );

    resAtomA.subscribe((s) => stateChangesLog(s));

    store.dispatch(resAtomA.request(42));
    await waitMockCalls(stateChangesLog, 3);
    expect(stateChangesLog).toHaveBeenNthCalledWith(3, {
      error: null,
      dirty: true,
      data: 43,
      lastParams: 42,
      loading: false,
    });
    store.dispatch(resAtomA.refetch());
    await waitMockCalls(stateChangesLog, 5);
    expect(stateChangesLog).toHaveBeenNthCalledWith(5, {
      error: null,
      dirty: true,
      data: 44,
      lastParams: 42,
      loading: false,
    });
  });

  test('Resource ignore refetch if in already in loading state', async ({ store }) => {
    const stateChangesLog = vi.fn(async (arg) => null);

    let i = 0;
    const resAtomA = createAsyncAtom(
      null,
      async (value) => {
        await wait(3);
        return value + ++i;
      },
      id(),
      {
        store,
        auto: false,
      },
    );

    resAtomA.subscribe((s) => stateChangesLog(s));

    store.dispatch(resAtomA.request(42));
    await waitMockCalls(stateChangesLog, 2);
    expect(stateChangesLog.mock.calls[1][0]).toMatchObject({
      loading: true,
    });

    store.dispatch(resAtomA.refetch());
    await wait(0.5);
    expect(stateChangesLog).toHaveBeenCalledTimes(2);
  });

  test('Resource ignore refetch if it never fetched before', async ({ store }) => {
    const stateChangesLog = vi.fn(async (arg) => null);

    let i = 0;
    const resAtomA = createAsyncAtom(
      null,
      async (value) => {
        await wait(3);
        return value + ++i;
      },
      id(),
      {
        store,
        auto: false,
      },
    );

    resAtomA.subscribe((s) => stateChangesLog(s));

    expect(store.getState(resAtomA).dirty).toBe(false);
    store.dispatch(resAtomA.refetch());
    await wait(1);
    expect(store.getState(resAtomA).dirty).toBe(false);
  });
});

describe('Resource reactivity', () => {
  test('Refetch when deps primitive changed', async ({ store }) => {
    // Primitive dep
    const deps = createBooleanAtom(false, { store });

    // Async atom that depends from it
    let i = 0;
    const resAtomB = createAsyncAtom(
      deps,
      async () => {
        await wait(1);
        return 'updated-' + ++i;
      },
      id(),
      { store, auto: false },
    );

    // listen changes
    const stateChangesLog = vi.fn(async (arg) => null);
    resAtomB.subscribe((s) => stateChangesLog(s));

    // mutate deps
    store.dispatch(deps.set(true));
    expect(stateChangesLog).toHaveBeenNthCalledWith(2, {
      error: null,
      dirty: true,
      data: null,
      lastParams: true,
      loading: true,
    });
    await wait(1);

    store.dispatch(deps.set(false));
    expect(stateChangesLog).toHaveBeenNthCalledWith(4, {
      error: null,
      dirty: true,
      data: 'updated-1',
      lastParams: false,
      loading: true,
    });
  });

  test.todo('Refetch when deps object changed', async ({ store }) => {
    const deps = createAtom({ set: (state) => state }, ($, state = null) => {
      $.onAction('set', (s) => (state = s));
      return state;
    });

    // Async atom that depends from it
    let i = 0;
    const resAtomB = createAsyncAtom(
      deps,
      async () => {
        await wait(1);
        return 'updated-' + ++i;
      },
      id(),
      { store },
    );

    // listen changes
    const stateChangesLog = vi.fn(async (arg) => null);
    resAtomB.subscribe((s) => stateChangesLog(s));

    // mutate deps
    store.dispatch(deps.set({ foo: 'bar' }));

    expect(stateChangesLog).toHaveBeenNthCalledWith(1, {
      error: null,
      dirty: false,
      data: null,
      lastParams: null,
      loading: false,
    });

    await waitMockCalls(stateChangesLog, 4);

    expect(stateChangesLog).toHaveBeenNthCalledWith(4, {
      error: null,
      dirty: true,
      data: 'updated-2',
      lastParams: { foo: 'bar' },
      loading: false,
    });
  });

  test('Refetch after async deps finish loading', async ({ store }) => {
    const deps = createAsyncAtom(
      null,
      async () => {
        await wait(1);
        return 'Answer to the Ultimate Question of Life, The Universe, and Everything';
      },
      id(),
      { store },
    );

    // Async atom that depends from it
    const resAtomB = createAsyncAtom(
      deps,
      async () => {
        await wait(1);
        return 42;
      },
      id(),
      { store },
    );

    // listen changes
    const stateChangesLog = vi.fn(async (arg) => null);
    resAtomB.subscribe((s) => stateChangesLog(s));

    expect(stateChangesLog).toHaveBeenNthCalledWith(1, {
      error: null,
      dirty: false,
      data: null,
      lastParams: null,
      loading: false,
    });

    await waitMockCalls(stateChangesLog, 3);

    expect(stateChangesLog).toHaveBeenNthCalledWith(2, {
      error: null,
      dirty: true,
      data: null,
      lastParams: 'Answer to the Ultimate Question of Life, The Universe, and Everything',
      loading: true,
    });

    expect(stateChangesLog).toHaveBeenNthCalledWith(3, {
      error: null,
      dirty: true,
      data: 42,
      lastParams: 'Answer to the Ultimate Question of Life, The Universe, and Everything',
      loading: false,
    });
  });
});

describe('Edge cases', () => {
  test.todo('Set done state when fetcher resolved instantly (request skipped)', () => {
    // TODO
  });
});

describe('Resource atoms chaining state', () => {
  test('Inherit loading state', async ({ store }) => {
    const resAtomA = createAsyncAtom(
      null,
      async () => {
        await wait(1);
      },
      id(),
      { store, auto: false },
    );

    const resAtomB = createAsyncAtom(
      resAtomA,
      async () => {
        await wait(1);
      },
      id(),
      { store, inheritState: true },
    );

    store.dispatch(resAtomA.request(null));
    await wait(0.1);

    expect(resAtomB.getState().loading).toBe(true);
  });

  test('Inherit error state', async ({ store }) => {
    const resAtomA = createAsyncAtom(
      null,
      async () => {
        await wait(1, { failWithMessage: 'Test error' });
      },
      id(),
      { store, auto: false },
    );

    const resAtomB = createAsyncAtom(
      resAtomA,
      async () => {
        await wait(1);
      },
      id(),
      { store, inheritState: true },
    );

    store.dispatch(resAtomA.request(null));
    await wait(1);

    expect(resAtomB.getState().error).toBe('Test error');
  });

  test('Not inherit loading state when chaining disabled', async ({ store }) => {
    const resAtomA = createAsyncAtom(
      null,
      async () => {
        await wait(1);
        return 'result';
      },
      id(),
      { store, auto: false },
    );

    const resAtomB = createAsyncAtom(
      resAtomA,
      async () => {
        await wait(1);
      },
      id(),
      { store, inheritState: false },
    );

    store.dispatch(resAtomA.request(null));
    await wait(0.1);

    expect(resAtomA.getState().loading).toBe(true);
    expect(resAtomB.getState().loading).toBe(false);
  });
});

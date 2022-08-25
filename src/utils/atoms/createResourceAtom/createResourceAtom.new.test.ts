import { createStore } from '@reatom/core';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import { createResourceAtom } from './createResourceAtom';
import { ABORT_ERROR_MESSAGE } from './abort-error';
import type { Store } from '@reatom/core';

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
    });
  });

  test('have correct loading state', ({ store }) => {
    const resAtomA = createResourceAtom(
      null,
      async () => await wait(1),
      'resAtomA',
      { store },
    );
    resAtomA.request.dispatch(null);
    expect(resAtomA.getState()).toMatchObject({
      loading: true,
      error: null,
    });
  });

  test('have correct lastParams state', async ({ store }) => {
    const resAtomA = createResourceAtom(
      null,
      async () => await wait(1),
      'resAtomA',
      { store },
    );
    resAtomA.request.dispatch('foo');
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
    resAtomA.request.dispatch('foo');
    await wait(1);
    expect(resAtomA.getState().error).toBe('Test error');
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
      'resAtomA',
      {
        store,
      },
    );
    resAtomA.request.dispatch(1);
    await wait(0.5);
    resAtomA.request.dispatch(2);
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
          wait(3),
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
      'resAtomAA',
      {
        store,
      },
    );

    resAtomA.subscribe((s) => stateChangesLog(s));

    resAtomA.request.dispatch(1);
    await wait(1);
    resAtomA.request.dispatch(2);

    // State change with error should be - 3
    // 1) initial state
    //    (first request)
    // 2) first request loading state
    //    (second request)
    // 3) first request canceled state <- this is we looking for!
    // 4) second request loading state

    // wait 3 state changes
    while (stateChangesLog.mock.calls.length < 3) {
      // console.log(stateChangesLog.mock.calls)
      await wait(1);
    }
    expect(stateChangesLog).toHaveBeenNthCalledWith(3, {
      error: ABORT_ERROR_MESSAGE,
      data: null,
      lastParams: 1, // should have parameters of request that was canceled
      loading: false, // should out from loading state
    });
  });

  test.todo('Resource set error state after canceled by cancel action', () => {
    // TODO
  });

  test.todo(
    'Resource set error:canceled state after canceled by other request when fetcher use try catch',
    async ({ store }) => {
      const stateChangesLog = vi.fn(async (arg) => null);

      const resAtomA = createResourceAtom(
        null,
        async (value) => {
          // I'am not rise any error in fetcher on cancel
          // It's the similar to wrap real fetcher in try catch
          await wait(5);
          return value;
        },
        'resAtomAA',
        {
          store,
        },
      );

      resAtomA.subscribe((s) => stateChangesLog(s));

      resAtomA.request.dispatch(1);
      await wait(1);
      resAtomA.request.dispatch(2);

      // State change with error should be - 3
      // 1) initial state
      //    (first request)
      // 2) first request loading state
      //    (second request)
      // 3) first request canceled state <- this is we looking for!
      // 4) second request loading state

      // wait 3 state changes
      while (stateChangesLog.mock.calls.length < 3) {
        await wait(1);
      }
      expect(stateChangesLog).toHaveBeenNthCalledWith(3, {
        error: ABORT_ERROR_MESSAGE,
        data: null,
        lastParams: 1, // should have parameters of request that was canceled
        loading: false, // should out from loading state
      });
    },
  );
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
      'resAtomA',
      { store },
    );

    const resAtomB = createResourceAtom(
      resAtomA,
      async () => {
        await wait(1);
      },
      'resAtomB',
      { store },
    );

    resAtomA.request.dispatch(null);
    await wait(0.1);
    expect(resAtomB.getState().loading).toBe(true);
  });

  test('Inherit error state', async ({ store }) => {
    const resAtomA = createResourceAtom(
      null,
      async () => {
        await wait(1, { failWithMessage: 'Test error' });
      },
      'resAtomA',
      { store },
    );

    const resAtomB = createResourceAtom(
      resAtomA,
      async () => {
        await wait(1);
      },
      'resAtomB',
      { store, inheritState: true },
    );

    resAtomA.request.dispatch(null);
    await wait(0.1);
    expect(resAtomB.getState().error).toBe('Test error');
  });

  test.todo(
    'Not inherit loading state when chaining disabled',
    async ({ store }) => {
      const resAtomA = createResourceAtom(
        null,
        async () => {
          await wait(1);
          return 'result';
        },
        'resAtomA',
        { store },
      );
      resAtomA.subscribe(() => null);
      await wait(1);

      const resAtomB = createResourceAtom(
        resAtomA,
        async () => {
          await wait(1);
        },
        'resAtomB',
        { store, inheritState: false },
      );
      resAtomB.subscribe(() => null);

      await wait(1);

      expect(resAtomA.getState().loading).toBe(true);
      expect(resAtomB.getState().loading).toBe(false);
    },
  );
});

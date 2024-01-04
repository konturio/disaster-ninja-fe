import { action, atom } from '@reatom/core';
import { isObject } from '@reatom/core-v2';
import { deferred, type DeferredPromise } from '@homer0/deferred';
import { isErrorWithMessage } from '~utils/common/error';
import { store as defaultStore } from '~core/store/store';
import { v3toV2 } from '../v3tov2';
import { ABORT_ERROR_MESSAGE, abortable, isAbortError } from './abort-error';
import { isAtomLike } from './is-atom-like';
import type { AsyncAtomDeps, AsyncAtomOptions, AsyncAtomState, Fetcher } from './types';
import type { AtomBinded, AtomState, AtomSelfBinded } from '@reatom/core-v2';

function generateErrorMessage(e: unknown): string {
  if (isAbortError(e)) {
    return ABORT_ERROR_MESSAGE;
  } else {
    return isErrorWithMessage(e) ? e.message : typeof e === 'string' ? e : 'Unknown';
  }
}

/* Check that name unique */
const getUniqueId = ((mem) => {
  return (newId: string): string => {
    if (!mem.has(newId)) {
      mem.add(newId);
      return newId;
    }

    // HRM sometime can double atoms, and this can create bugs
    console.warn(`Atom with name ${newId} already exist. Full page reload recommended`);
    const uniqId = newId + performance.now();
    return getUniqueId(uniqId);
  };
})(new Set());

const defaultOptions = {
  inheritState: false,
  store: defaultStore,
  auto: true,
};

export function createAsyncAtom<
  F extends Fetcher<Exclude<AtomState<D>, null>, Awaited<ReturnType<F>>>,
  D extends AtomBinded,
>(
  depsAtom: D | null,
  fetcher: F,
  name: string,
  resourceAtomOptions: AsyncAtomOptions<Awaited<ReturnType<F>>, AtomState<D>> = {},
): AtomSelfBinded<
  AsyncAtomState<AtomState<D>, Awaited<ReturnType<F>>>,
  AsyncAtomDeps<D, F>
> {
  type State = AsyncAtomState<AtomState<D>, Awaited<ReturnType<F>>>;

  type Options = AsyncAtomOptions<Awaited<ReturnType<F>>, AtomState<D>>;
  const options: Options & Required<Pick<Options, 'store'>> = {
    ...resourceAtomOptions,
    auto: resourceAtomOptions.auto ?? defaultOptions.auto,
    inheritState: resourceAtomOptions.inheritState ?? defaultOptions.inheritState,
    store: resourceAtomOptions.store ?? defaultOptions.store,
  };

  const asyncAtom = atom<State>(
    {
      loading: false,
      data: null,
      error: null,
      lastParams: null,
      dirty: false,
    },
    getUniqueId(name),
  );

  let abortController: AbortController | null = null;
  let deferredCancel: DeferredPromise<void>;

  const requestAction = action(async (ctx, params) => {
    const log = (...args) => console.debug(`[${params}]: `, ...args);
    const logStateChange = (from, to) => {
      console.debug(`[${params}] from -> to: `, from, to);
      return to;
    };
    log('request');
    // In case we already have request action in progress, cancel it
    if (abortController) {
      log('wait cancel');
      await cancelAction(ctx);
      log('after cancel');
    }
    // Set loading state

    asyncAtom(ctx, (state) =>
      logStateChange(state, {
        ...state,
        error: null,
        lastParams: params,
        dirty: true, // for unblock refetch
        loading: true,
      }),
    );
    log('after async atom state change');
    try {
      abortController = new AbortController();
      const data = await ctx.schedule(() => {
        if (abortController) {
          return abortable(abortController, fetcher(params, abortController));
        } else {
          throw Error('abortController was reset before it was used');
        }
      });
      log('after fetcher');
      // Inside the fetcher's logic, abort error could have been caught accidentally
      // Here I rethrow abort error to be sure it will be processed
      abortController.signal.throwIfAborted();
      // Set done state
      asyncAtom(ctx, (state) =>
        logStateChange(state, { ...state, data, lastParams: params, loading: false }),
      );
    } catch (error) {
      log('error', error);
      log('set error state');
      asyncAtom(ctx, (state) =>
        logStateChange(state, {
          ...state,
          lastParams: params,
          loading: false,
          error: generateErrorMessage(error),
        }),
      );
      if (isAbortError(error)) {
        deferredCancel?.resolve();
      }
    } finally {
      abortController = null;
    }
  });

  const cancelAction = action(async (ctx) => {
    if (abortController) {
      // If previous request is active
      deferredCancel = deferred();

      await ctx.schedule(async () => {
        // Cancel it (that trigger catch section in previous request)
        abortController?.abort();
        // Wait for abort state;
        return await deferredCancel.promise;
      });
    }
  });

  const refetchAction = action((ctx) => {
    const { lastParams, dirty, loading } = ctx.get(asyncAtom);
    if (dirty) {
      !loading && requestAction(ctx, lastParams);
    } else {
      console.error(`[${name}]:`, 'Do not call refetch before request');
    }
  });

  const actions = {
    request: requestAction,
    refetch: refetchAction,
    cancel: cancelAction,
  };

  if (depsAtom) {
    // Call request action when deps changes
    depsAtom.v3atom.onChange((ctx, depsAtomState) => {
      console.debug('onChange', depsAtomState);
      if (isObject(depsAtomState)) {
        // If Deps atom looks like resource
        console.debug('options.inheritState', options.inheritState);
        if (options.inheritState) {
          // Use his properties for state
          asyncAtom(ctx, (state) => ({
            ...state,
            loading: depsAtomState.loading || state.loading,
            error: depsAtomState.error || state.error,
          }));
        }
        if (isAtomLike(depsAtomState)) {
          if (!depsAtomState.loading && !depsAtomState.error && depsAtomState.dirty) {
            requestAction(ctx, depsAtomState.data);
          }
        } else {
          // Is plain object
          requestAction(ctx, depsAtomState);
        }
      } else {
        // Deps is primitive
        if (depsAtomState !== null) {
          requestAction(ctx, depsAtomState);
        } else {
          console.warn(
            `Resource atom with name ${name} skips running as its dependency state ${depsAtom?.id} is null`,
          );
        }
      }
    });
    return v3toV2<State, AsyncAtomDeps<D, F>>(asyncAtom, actions, options.store);
  } else {
    if (options.auto) {
      requestAction(options.store.v3ctx, null);
    }
  }

  return v3toV2<State, AsyncAtomDeps<D, F>>(asyncAtom, actions, options.store);
}

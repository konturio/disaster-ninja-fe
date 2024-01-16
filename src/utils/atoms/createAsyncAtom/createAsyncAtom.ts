import { action, atom } from '@reatom/core';
import { isObject } from '@reatom/core-v2';
import { deferred, type DeferredPromise } from '@homer0/deferred';
import { isErrorWithMessage } from '~utils/common/error';
import { store as defaultStore } from '~core/store/store';
import { v3toV2 } from '../v3tov2';
import { ABORT_ERROR_MESSAGE, abortable, isAbortError } from './abort-error';
import { isAtomLike } from './is-atom-like';
import type { Ctx } from '@reatom/core';
import type { AsyncAtomDeps, AsyncAtomOptions, AsyncAtomState, Fetcher } from './types';
import type { AtomBinded, AtomState, AtomSelfBinded } from '@reatom/core-v2';

function generateErrorMessage(e: unknown): string {
  if (isAbortError(e)) {
    return ABORT_ERROR_MESSAGE;
  } else {
    return isErrorWithMessage(e) ? e.message : typeof e === 'string' ? e : 'Unknown';
  }
}

function verboseLog(name: string, verbose: boolean) {
  return (...args) => verbose && console.debug(`[${name}]:`, ...args);
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
  verbose: false,
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
  const options: Options & Required<Pick<Options, 'store' | 'verbose'>> = {
    ...resourceAtomOptions,
    auto: resourceAtomOptions.auto ?? defaultOptions.auto,
    inheritState: resourceAtomOptions.inheritState ?? defaultOptions.inheritState,
    store: resourceAtomOptions.store ?? defaultOptions.store,
    verbose: resourceAtomOptions.verbose ?? defaultOptions.verbose,
  };
  const debug = verboseLog(name, options.verbose);

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
    // In case we already have request action in progress, cancel it
    if (abortController) {
      await cancelAction(ctx);
    }
    // Set loading state
    asyncAtom(ctx, (state) => ({
      ...state,
      error: null,
      lastParams: params,
      dirty: true, // for unblock refetch
      loading: true,
    }));

    try {
      abortController = new AbortController();
      const data = await ctx.schedule(() => {
        if (abortController) {
          return abortable(abortController, fetcher(params, abortController));
        } else {
          throw Error('abortController was reset before it was used');
        }
      });
      // Inside the fetcher's logic, abort error could have been caught accidentally
      // Here I rethrow abort error to be sure it will be processed
      abortController.signal.throwIfAborted();
      // Set done state
      asyncAtom(ctx, (state) => ({ ...state, data, lastParams: params, loading: false }));
    } catch (error) {
      asyncAtom(ctx, (state) => ({
        ...state,
        lastParams: params,
        loading: false,
        error: generateErrorMessage(error),
      }));
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
    const onChange = (ctx: Ctx, depsAtomState: unknown) => {
      debug('Deps atom changed');
      if (isObject(depsAtomState)) {
        // If Deps atom looks like resource
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
    };
    // Unlazy deps atom
    depsAtom.subscribe((s) => null);
    // Request data with current deps state
    if (options.auto) {
      onChange(options.store.v3ctx, options.store.getState(depsAtom));
    }

    // Call request action when deps changes
    depsAtom.v3atom.onChange(onChange);

    return v3toV2<State, AsyncAtomDeps<D, F>>(asyncAtom, actions, options.store);
  } else {
    if (options.auto) {
      requestAction(options.store.v3ctx, null);
    }
  }

  return v3toV2<State, AsyncAtomDeps<D, F>>(asyncAtom, actions, options.store);
}

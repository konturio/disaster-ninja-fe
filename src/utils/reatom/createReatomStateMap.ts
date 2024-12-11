import { useAtom } from '@reatom/npm-react';
import type {
  Action,
  AsyncDataAtom,
  AsyncStatusesAtom,
  AtomMut,
  reatomResource,
} from '@reatom/framework';

type ReatomResourceWithAtoms<T> = ReturnType<typeof reatomResource<T>> & {
  dataAtom: AsyncDataAtom<T>;
  errorAtom: AtomMut<Error | undefined> & { reset: Action<[], void> };
  statusesAtom: AsyncStatusesAtom;
};

/**
 * Creates a component state manager for Reatom resources that handles common UI states.
 *
 * @example
 * ```tsx
 * const EventsList = () => {
 *   const stateMap = createReatomStateMap(eventListResourceAtom);
 *
 *   return stateMap({
 *     init: <NoEventsMessage />,
 *     loading: <LoadingSpinner />,
 *     error: (err) => <ErrorMessage message={err.message} />,
 *     ready: (events) => <EventsListView events={events} />,
 *   });
 * };
 * ```
 *
 * @param resource - Reatom resource with data, error and status atoms
 * @returns Component state manager function that renders appropriate UI based on resource state
 */
export function createReatomStateMap<T>(resource: ReatomResourceWithAtoms<T>) {
  return function StateMapComponent({
    loading = null,
    error = null,
    ready,
    init = null,
  }: {
    /** Component to show during loading state */
    loading?: (() => JSX.Element | null) | JSX.Element | null;
    /** Component to show when error occurs */
    error?: ((error: Error) => JSX.Element | null) | JSX.Element | null;
    /** Component to show when data is loaded successfully */
    ready: (data: T) => JSX.Element | null;
    /** Component to show in initial state before first load */
    init?: (() => JSX.Element | null) | JSX.Element | null;
  }): JSX.Element | null {
    const [data] = useAtom(resource.dataAtom);
    const [err] = useAtom(resource.errorAtom);
    const [statuses] = useAtom(resource.statusesAtom);

    // Error state takes precedence
    if (err && error) {
      return typeof error === 'function' ? error(err) : error;
    }

    // Loading states
    if (statuses.isPending) {
      if (statuses.isFirstPending) {
        // First load - show loading or init
        return loading
          ? typeof loading === 'function'
            ? loading()
            : loading
          : typeof init === 'function'
            ? init()
            : init;
      }
      // Subsequent load with existing data - show stale data
      if (data) {
        return ready(data);
      }
      // Subsequent load without data - show loading
      return typeof loading === 'function' ? loading() : loading;
    }

    // Ready state with data
    if (data) {
      return ready(data);
    }

    // Initial state (no data, no error, not loading)
    return typeof init === 'function' ? init() : init;
  };
}

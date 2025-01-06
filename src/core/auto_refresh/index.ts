import type { Unsubscribe } from '@reatom/core-v2';

type SubscribeFn = (callback: (state: { loading: boolean }) => void) => () => void;

/**
 * Service that manages automatic periodic refreshing of data resources.
 * Used in conjunction with Reatom atoms to automatically refresh data at specified intervals.
 *
 * @remarks
 * The service maintains a registry of resources that need periodic refreshing.
 * Each resource is identified by a unique string ID and contains its loading state
 * and refetch function. The service ensures that resources are not refetched while
 * they are already loading.
 */
class AutoRefreshService {
  private resources: Record<
    string,
    {
      loading: boolean;
      unsubscribe: Unsubscribe;
      refetch: () => void;
    }
  > = {};

  private intervalSec = 60;
  private timer: NodeJS.Timeout | null = null;

  /**
   * Starts the auto-refresh service with the specified interval.
   * @param sec - The interval in seconds between refresh attempts. Defaults to 60 if not specified.
   */
  start(sec: number) {
    this.intervalSec = sec || this.intervalSec;
    this.timer = setInterval(() => {
      Object.entries(this.resources).forEach(([id, resource]) => {
        // Don't repeat request if previous still in progress
        if (resource.loading) return;
        resource.refetch();
      });
    }, this.intervalSec * 1000);
  }

  /**
   * Stops the auto-refresh service and clears the refresh timer.
   */
  stop() {
    if (this.timer) clearInterval(this.timer);
  }

  /**
   * Adds a resource to be watched for auto-refresh.
   * @param id - Unique identifier for the resource
   * @param atom - The Reatom atom to watch, must have:
   *   - refetch.dispatch: Function to trigger a refresh
   *   - subscribe: Function to subscribe to loading state changes
   */
  addWatcher(
    id: string,
    atom: { refetch: { dispatch: () => void }; subscribe: SubscribeFn },
  ) {
    const unsubscribe = atom.subscribe((state) => {
      this.resources[id] = {
        refetch: () => atom.refetch.dispatch(),
        unsubscribe: () => null,
        loading: state.loading,
      };
    });
    this.resources[id].unsubscribe = unsubscribe;
  }

  /**
   * Removes a resource from being watched for auto-refresh.
   * @param id - Unique identifier of the resource to remove
   */
  removeWatcher(id: string) {
    delete this.resources[id];
  }
}

export const autoRefreshService = new AutoRefreshService();

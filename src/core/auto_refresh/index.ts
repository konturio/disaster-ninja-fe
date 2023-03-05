import type { Unsubscribe } from '@reatom/core-v2';

type SubscribeFn = (callback: (state: { loading: boolean }) => void) => () => void;

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

  stop() {
    if (this.timer) clearInterval(this.timer);
  }

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

  removeWatcher(id: string) {
    delete this.resources[id];
  }
}

export const autoRefreshService = new AutoRefreshService();

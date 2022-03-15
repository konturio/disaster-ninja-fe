import { Unsubscribe } from '@reatom/core';
import { ResourceAtom } from '~utils/atoms/createResourceAtom';

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

  addWatcher(id: string, atom: ResourceAtom<any, any>) {
    console.log('addWatcher', id);
    const unsubscribe = atom.subscribe(({ loading }) => {
      this.resources[id] = {
        refetch: () => atom.refetch.dispatch(),
        unsubscribe: () => null,
        loading,
      };
    });
    this.resources[id].unsubscribe = unsubscribe;
  }

  removeWatcher(id: string) {
    delete this.resources[id];
  }
}

export const autoRefreshService = new AutoRefreshService();

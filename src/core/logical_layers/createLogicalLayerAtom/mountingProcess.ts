import isPromise from 'is-promise';
import { LayerLegend } from './types';

interface MountStateUpdate {
  isError?: boolean;
  isMounted?: boolean;
  isLoading?: boolean;
  legend?: LayerLegend | null;
  isDownloadable?: boolean;
}

export async function doMount(
  mountResult:
    | Promise<{ legend?: LayerLegend; isDownloadable?: boolean }>
    | { legend?: LayerLegend; isDownloadable?: boolean }
    | null
    | void,
): Promise<MountStateUpdate> {
  // Async
  if (isPromise(mountResult)) {
    const stateUpdate: MountStateUpdate = {};

    try {
      const { isDownloadable, legend } = await mountResult;
      stateUpdate.legend = legend;
      stateUpdate.isDownloadable = Boolean(isDownloadable);
      stateUpdate.isError = false;
      stateUpdate.isMounted = true;
    } catch (e) {
      stateUpdate.isError = true;
      stateUpdate.isMounted = false;
      console.error(e);
    } finally {
      stateUpdate.isLoading = false;
      return stateUpdate;
    }
    // Sync
  } else {
    return {
      isError: false,
      isMounted: true,
      isLoading: false,
      legend: mountResult?.legend,
      isDownloadable: Boolean(mountResult?.isDownloadable),
    };
  }
}

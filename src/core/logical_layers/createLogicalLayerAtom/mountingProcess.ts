import isPromise from 'is-promise';
import { LayerLegend } from './types';

interface MountStateUpdate {
  isError?: boolean;
  isMounted?: boolean;
  isLoading?: boolean;
  legend?: LayerLegend;
}

export async function doMount(
  mountResult: LayerLegend | Promise<LayerLegend>,
): Promise<MountStateUpdate> {
  // Async
  if (isPromise(mountResult)) {
    const stateUpdate: MountStateUpdate = {};

    try {
      stateUpdate.legend = await mountResult;
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
      legend: mountResult,
    };
  }
}

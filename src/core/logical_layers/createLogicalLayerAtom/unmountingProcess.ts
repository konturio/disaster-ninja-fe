import isPromise from 'is-promise';

interface UnmountStateUpdate {
  isError?: boolean;
  isMounted?: boolean;
  isLoading?: boolean;
  legend: null;
}

export async function doUnmount(layerUnmountTask): Promise<UnmountStateUpdate> {
  // Async
  if (isPromise(layerUnmountTask)) {
    const stateUpdate: UnmountStateUpdate = {
      legend: null,
    };

    try {
      await layerUnmountTask;
      stateUpdate.isError = false;
      stateUpdate.isMounted = false;
    } catch (e) {
      stateUpdate.isError = true;
      stateUpdate.isMounted = true;
      console.error(e);
    } finally {
      stateUpdate.isLoading = false;
      return stateUpdate;
    }
    // Sync
  } else {
    return {
      isError: false,
      isMounted: false,
      isLoading: false,
      legend: null,
    };
  }
}

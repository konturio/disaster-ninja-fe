import isPromise from 'is-promise';

interface MountStateUpdate {
  isError?: boolean;
  isMounted?: boolean;
  isLoading?: boolean;
}

export async function doMount(layerMountTask): Promise<MountStateUpdate> {
  // Async
  if (isPromise(layerMountTask)) {
    const stateUpdate: MountStateUpdate = {};

    try {
      await layerMountTask;
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
    };
  }
}

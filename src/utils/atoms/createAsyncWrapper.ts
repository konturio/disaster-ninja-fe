import type { AsyncState } from '~core/logical_layers/types/asyncState';

export function createAsyncWrapper<T>(
  data: T,
  error = null,
  isLoading = false,
): AsyncState<T> {
  return {
    data,
    isLoading,
    error,
  };
}

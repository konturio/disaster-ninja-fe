export interface AtomStatesHandlers<T> {
  loading?: (() => JSX.Element | null) | JSX.Element | null;
  error?: ((errorMessage?: string) => JSX.Element | null) | JSX.Element | null;
  ready: (data: T) => JSX.Element | null;
  init?: (() => JSX.Element) | JSX.Element | null;
}

export function createStateMap<T>({
  loading: LoadingState,
  error: errorMessage,
  data,
}: {
  loading: boolean;
  error: string | null;
  data: T | null;
}) {
  return ({ loading, error, ready, init = null }: AtomStatesHandlers<T>) => {
    if (LoadingState && loading)
      return typeof loading === 'function' ? loading() : loading;
    if (errorMessage && error)
      return typeof error === 'function' ? error(errorMessage) : error;
    if (data !== null) return ready(data);
    return typeof init === 'function' ? init() : init;
  };
}

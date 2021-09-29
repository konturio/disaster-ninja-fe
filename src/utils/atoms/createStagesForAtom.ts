export interface AtomStatesHandlers<T> {
  loading?: (() => JSX.Element | null) | JSX.Element | null;
  error?: ((errorMessage?: string) => JSX.Element | null) | JSX.Element | null;
  ready: (data: T) => JSX.Element | JSX.Element[] | null;
}

export function createStagesForAtom<T>({
  loading: LoadingState,
  error: errorMessage,
  data,
}: {
  loading: boolean;
  error: string | null;
  data: T;
}) {
  return ({ loading, error, ready }: AtomStatesHandlers<T>) => {
    if (LoadingState && loading)
      return typeof loading === 'function' ? loading() : loading;
    if (errorMessage && error)
      return typeof error === 'function' ? error(errorMessage) : error;
    if (data) return ready(data);
  };
}

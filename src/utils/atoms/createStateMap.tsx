import { useEffect, useState } from 'react';

export interface AtomStatesHandlers<T> {
  loading?: (() => JSX.Element | null) | JSX.Element | null;
  error?: ((errorMessage?: string) => JSX.Element | null) | JSX.Element | null;
  ready: (data: T) => JSX.Element | null;
  init?: (() => JSX.Element) | JSX.Element | null;
}

interface StateMapSettings {
  loadingStateDelayMs?: number;
}

function DelayedLoading({
  loadingComponent,
  loadingState,
  delayMs,
  children,
}: React.PropsWithChildren<{
  loadingComponent: JSX.Element | null;
  loadingState: boolean;
  delayMs: number;
}>) {
  const [showSpinner, setShowSpinner] = useState(delayMs ? false : true);
  useEffect(() => {
    if (loadingState === false) {
      setShowSpinner(false);
      return;
    }
    if (!delayMs) {
      setShowSpinner(true);
      return;
    }

    const timerId = setTimeout(() => {
      setShowSpinner(true);
    }, delayMs);
    return () => clearTimeout(timerId);
  }, [loadingState, delayMs]);

  return showSpinner ? loadingComponent : <>{children}</>;
}

export function createStateMap<T>(
  {
    loading: LoadingState,
    error: errorMessage,
    data,
  }: {
    loading: boolean;
    error: string | null;
    data: T | null;
  },
  settings?: StateMapSettings,
) {
  function StateMapComponent({
    loading = null,
    error = null,
    ready,
    init = null,
  }: AtomStatesHandlers<T>): JSX.Element | null {
    const getLoadingComponent = () =>
      typeof loading === 'function' ? loading() : loading;
    const getErrorComponent = (message: string) =>
      typeof error === 'function' ? error(message) : error;
    const getDataComponent = (data: T) => ready(data);
    const getInitialComponent = () => (typeof init === 'function' ? init() : init);

    if (errorMessage && error) {
      return getErrorComponent(errorMessage);
    }

    if (settings?.loadingStateDelayMs) {
      return (
        <DelayedLoading
          loadingState={LoadingState}
          delayMs={settings.loadingStateDelayMs}
          loadingComponent={getLoadingComponent()}
        >
          {data === null ? getInitialComponent() : getDataComponent(data)}
        </DelayedLoading>
      );
    }

    if (LoadingState && loading) {
      return getLoadingComponent();
    }

    if (data !== null) {
      return getDataComponent(data);
    }

    return getInitialComponent();
  }
  return StateMapComponent;
}

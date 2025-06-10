import { useCallback, useRef, useState } from 'react';

export function usePersistentError<T extends object>(visibleMs: number) {
  const [error, setError] = useState<T>({} as T);
  const timeoutRef = useRef<number>();

  const setPersistentError = useCallback(
    (err: T) => {
      setError(err);
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setError({} as T), visibleMs);
    },
    [visibleMs],
  );

  const clear = useCallback(() => {
    window.clearTimeout(timeoutRef.current);
    setError({} as T);
  }, []);

  return { error, setPersistentError, clear };
}

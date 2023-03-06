import { useRef } from 'react';

/* Use it when you want read value in effect without adding it in deps */
export function useUnlistedRef<T>(value: T) {
  const valueRef = useRef(value);
  valueRef.current = value;
  return valueRef;
}

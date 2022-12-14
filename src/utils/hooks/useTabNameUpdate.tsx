import { useEffect } from 'react';

export function useTabNameUpdate(name?: string) {
  useEffect(() => {
    if (name && document.title !== name) document.title = name;
  }, [name]);
}

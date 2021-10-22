import { useEffect } from 'react';

export function Reports() {
  useEffect(() => {
    console.log('%c⧭', 'color: #00b300', 'reports did run');
  }, []);

  return <h2>Reports block</h2>;
}

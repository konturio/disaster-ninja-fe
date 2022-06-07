import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { authClientInstance } from '~core/authClientInstance';

export function AuthWrapper({
  children,
}: {
  children: ReactNode | ReactNode[];
}) {
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    async function initApp() {
      await authClientInstance.checkAuth();
      setInitialized(true);
    }

    initApp();
  }, [setInitialized]);

  return initialized ? <>{children}</> : null;
}

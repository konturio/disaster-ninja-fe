import { useEffect, useState } from 'react';
import core from '~core/index';
import type { ReactNode } from 'react';

export function AuthWrapper({ children }: { children: ReactNode | ReactNode[] }) {
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    async function initApp() {
      await core.api.authClient.checkAuth();
      setInitialized(true);
    }

    initApp();
  }, [setInitialized]);

  return initialized ? <>{children}</> : null;
}

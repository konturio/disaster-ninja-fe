import { ReactNode, useEffect, useState } from 'react';
import { authClient } from '~core/index';

export function AuthWrapper({
  children,
}: {
  children: ReactNode | ReactNode[];
}) {
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    async function initApp() {
      await authClient.checkAuth();
      setInitialized(true);
    }

    initApp();
  }, [setInitialized]);

  return initialized ? <>{children}</> : null;
}

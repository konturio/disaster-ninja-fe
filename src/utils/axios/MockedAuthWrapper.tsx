import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { enableMocking } from '~utils/axios/axiosMockUtils';

/* Use in instead of <AuthWrapper /> */
function MockedAuthWrapper({
  children,
}: {
  children: ReactNode | ReactNode[];
}) {
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    async function initApp() {
      // todo: Remove mocking once backend service will be fully complete
      enableMocking(true);
      setInitialized(true);
    }

    initApp();
  }, [setInitialized]);

  return initialized ? <>{children}</> : null;
}

export default MockedAuthWrapper;

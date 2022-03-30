import { ReactNode, useEffect, useState } from 'react';
import { enableMocking } from '~utils/axios/axiosMockUtils';
import { setupFeatureFlagsMocking } from '~utils/axios/setupTemporaryMocking';
import { apiClient } from '~core/index';

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
      await setupFeatureFlagsMocking(
        apiClient['apiSauceInstance'].axiosInstance,
      );
      setInitialized(true);
    }

    initApp();
  }, [setInitialized]);

  return initialized ? <>{children}</> : null;
}

export default MockedAuthWrapper;

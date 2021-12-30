import { ReactNode, useEffect, useState } from 'react';
import { enableMocking } from '~utils/axios/axiosMockUtils';
import { setupTemporaryMocking } from '~utils/axios/setupTemporaryMocking';
import { apiClient } from '~core/index';

function MockWrapper ({ children }: { children: ReactNode | ReactNode[]}){
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    async function initApp() {
      // todo: Remove mocking once backend service will be fully complete
      enableMocking(true);
      await setupTemporaryMocking(apiClient['apiSauceInstance'].axiosInstance);
      setInitialized(true);
    }

    initApp();
  }, [setInitialized]);

  return initialized ? <>{children}</> : null;
}

export default MockWrapper;

import { createRoot } from 'react-dom/client';
import { reatomContext } from '@reatom/react';
import { StrictMode, Suspense } from 'react';
import { lazily } from 'react-lazily';
import { appInit } from '~core/app/init';
import { store } from '~core/store/store';
const { Router } = lazily(() => import('~core/router'));

const root = createRoot(document.getElementById('root')!);

appInit().then(() => {
  root.render(
    import.meta.env?.VITE_DEBUG_DISABLE_REACTSTRICTMODE ? (
      <reatomContext.Provider value={store}>
        <Suspense>
          <Router />
        </Suspense>
      </reatomContext.Provider>
    ) : (
      <StrictMode>
        <reatomContext.Provider value={store}>
          <Suspense>
            <Router />
          </Suspense>
        </reatomContext.Provider>
      </StrictMode>
    ),
  );
});

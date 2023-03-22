import { createRoot } from 'react-dom/client';
import { reatomContext } from '@reatom/react';
import { StrictMode, Suspense } from 'react';
import { lazily } from 'react-lazily';
// import { appInit } from '~core/app/init';
import { store } from '~core/store/store';
import { postAppInit } from '~core/app/postAppInit';
const { Router } = lazily(() => import('~core/router'));

const root = createRoot(document.getElementById('root')!);

function renderApp() {
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
}

export async function startApp(initialState) {
  await postAppInit(initialState);
  renderApp();
}

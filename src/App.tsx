import { createRoot } from 'react-dom/client';
import { reatomContext } from '@reatom/react';
import { StrictMode } from 'react';
import { appInit } from '~core/app/init';
import { store } from '~core/store/store';
import { Router } from '~core/router';

const root = createRoot(document.getElementById('root')!);

appInit().then(() => {
  root.render(
    import.meta.env?.VITE_DEBUG_DISABLE_REACTSTRICTMODE ? (
      <reatomContext.Provider value={store}>
        <Router />
      </reatomContext.Provider>
    ) : (
      <StrictMode>
        <reatomContext.Provider value={store}>
          <Router />
        </reatomContext.Provider>
      </StrictMode>
    ),
  );
});

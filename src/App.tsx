import { createRoot } from 'react-dom/client';
import { reatomContext } from '@reatom/react';
import { StrictMode } from 'react';
import core from '~core/index';
import { Views } from '~views/Common';

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <reatomContext.Provider value={core.store}>
      <Views />
    </reatomContext.Provider>
  </StrictMode>,
);

import { atom } from '@reatom/framework';
import { urlStoreAtom } from '~core/url_store';

export const presentationModeAtom = atom((ctx) => {
  const urlData = ctx.spy(urlStoreAtom.v3atom);
  if (urlData?.presentationMode !== undefined) {
    return urlData.presentationMode.toLowerCase() === 'true';
  }

  return !!globalThis.presentationMode;
}, 'presentationModeAtom');

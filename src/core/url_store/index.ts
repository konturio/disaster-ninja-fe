import { urlStoreAtom } from './atoms/urlStore';

let wasStarted = false;
export const initUrlStore = () => {
  if (!wasStarted) {
    urlStoreAtom.subscribe(() => null);
    wasStarted = true;
  }
};

import { urlStoreAtom } from './atoms/urlStore';

export const initUrlStore = () => {
  urlStoreAtom.subscribe(() => null);
};

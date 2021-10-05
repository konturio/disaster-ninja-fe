import { sharedUrlAtom } from './atoms/shared_url_atom';

export const initSharedUrl = () => sharedUrlAtom.subscribe((state) => null);

import { atom } from '@reatom/framework';

export const clickCoordinatesAtom = atom<{ lng: number; lat: number } | null>(
  null,
  'clickCoordinatesAtom',
);

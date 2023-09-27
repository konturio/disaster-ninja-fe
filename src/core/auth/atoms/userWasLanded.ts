import { configRepo } from '~core/config';
import { createAtom } from '~utils/atoms';
import { localStorage } from '~utils/storage';

export const userWasLandedAtom = createAtom(
  {},
  ({ get }, state: 'yes' | 'no' | 'pending' = 'pending') => {
    const userLoaded = true;
    if (userLoaded) {
      const initialUrl = new URL(localStorage.getItem('initialUrl') || '');
      const noSettingUrl =
        location.pathname === configRepo.get().baseUrl && initialUrl.search === '';
      const userHaveLandedMark = localStorage.getItem('landed');
      if (noSettingUrl && !userHaveLandedMark) {
        state = 'no';
      } else {
        state = 'yes';
      }
    }
    return state;
  },
  'userWasLandedAtom',
);

export const landUser = () => localStorage.setItem('landed', 'true');

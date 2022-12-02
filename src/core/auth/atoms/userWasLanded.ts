import config from '~core/app_config';
import { createAtom } from '~utils/atoms';
import { userResourceAtom } from './userResource';

export const userWasLandedAtom = createAtom(
  {
    userResourceAtom,
  },
  ({ get }, state: 'yes' | 'no' | 'pending' = 'pending') => {
    const userModel = get('userResourceAtom');
    const userLoaded = userModel.data && !userModel.loading;
    if (userLoaded) {
      const initialUrl = new URL(localStorage.getItem('initialUrl') || '');
      const noSettingUrl =
        location.pathname === config.baseUrl && initialUrl.search === '';
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

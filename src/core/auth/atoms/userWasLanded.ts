import { configRepo } from '~core/config';
import { localStorage } from '~utils/storage';

export const landUser = () => localStorage.setItem('landed', 'true');
export function userWasLanded() {
  const initialUrl = new URL(localStorage.getItem('initialUrl') || '');
  const noSettingUrl =
    location.pathname === configRepo.get().baseUrl && initialUrl.search === '';
  const userHaveLandedMark = localStorage.getItem('landed');
  return noSettingUrl && !userHaveLandedMark;
}

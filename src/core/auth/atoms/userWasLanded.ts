import { configRepo } from '~core/config';
import { localStorage } from '~utils/storage';

export const landUser = () => localStorage.setItem('landed', 'true');
export function userWasLanded() {
  if (localStorage.getItem('landed') !== null) return true;
  const initialUrl = new URL(localStorage.getItem('initialUrl') || '');
  const noSettingUrl =
    location.pathname === configRepo.get().baseUrl && initialUrl.search === '';
  return !noSettingUrl;
}

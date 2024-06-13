import { configRepo } from '~core/config';
import { localStorage } from '~utils/storage';

export function userWasLanded() {
  if (localStorage.getItem('landed') !== null) return true;

  // TODO: move this detection to earlier stage in init and avoid using localStorage for initialUrl
  const initialUrl = localStorage.getItem('initialUrl');
  if (initialUrl === null) return true;
  const initialUrlObj = new URL(initialUrl);
  const isHomepageOnFirstVisit =
    location.pathname === configRepo.get().baseUrl && initialUrlObj.search === '';
  return !isHomepageOnFirstVisit;
}

export const landUser = () => localStorage.setItem('landed', 'true');

import { configRepo } from '~core/config';
import { localStorage } from '~utils/storage';

export function userWasLanded() {
  if (localStorage.getItem('landed') !== null) return true;

  const initialUrl = configRepo.get().initialUrl;
  if (initialUrl === null) return true;
  const initialUrlObj = new URL(initialUrl);
  // check that user visits homepage and not came via link to disaster etc (should be no params in url)
  const isHomepageOnFirstVisit =
    location.pathname === configRepo.get().baseUrl && initialUrlObj.search === '';
  return !isHomepageOnFirstVisit;
}

export const landUser = () => localStorage.setItem('landed', 'true');

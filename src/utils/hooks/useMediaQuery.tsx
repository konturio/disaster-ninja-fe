import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);

  return matches;
};

export const IS_MOBILE_QUERY = '(max-width: 960px)';
export const COLLAPSE_PANEL_QUERY = '(max-width: 1280px)';
export const IS_LAPTOP_QUERY = '(max-width: 1900px)';

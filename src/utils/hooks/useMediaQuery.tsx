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

export const MOBILE_WIDTH_PX = 960;
export const IS_MOBILE_QUERY = `(max-width: ${MOBILE_WIDTH_PX}px)`;

export const COLLAPSE_PANEL_QUERY = IS_MOBILE_QUERY;

export const LAPTOP_WIDTH_PX = 1530;
export const IS_LAPTOP_QUERY = `
  (max-width: ${LAPTOP_WIDTH_PX}px) and (min-width: ${MOBILE_WIDTH_PX + 1}px)
`;

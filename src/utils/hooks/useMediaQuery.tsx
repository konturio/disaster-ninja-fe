import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from '~utils/common';

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  const debouncedSetMAtches = useRef(debounce(setMatches, 1000));

  useEffect(() => {
    const listener = () => {
      const media = window.matchMedia(query);
      debouncedSetMAtches.current(media.matches);
    };
    listener();
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [query]);

  return matches;
};

export const MOBILE_WIDTH_PX = 960;
export const IS_MOBILE_QUERY = `(max-width: ${MOBILE_WIDTH_PX}px)`;

export const COLLAPSE_PANEL_QUERY = IS_MOBILE_QUERY;

export const LAPTOP_WIDTH_PX = 1530;
export const IS_LAPTOP_QUERY = `
  (max-width: ${LAPTOP_WIDTH_PX}px) and (min-width: ${MOBILE_WIDTH_PX + 1}px)
`;

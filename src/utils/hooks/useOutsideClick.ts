import { useEffect, useRef } from 'react';

export const useOutsideClick = <ElementType extends HTMLElement>(callback) => {
  const ref = useRef<ElementType | null>(null);

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [ref]);

  return ref;
};

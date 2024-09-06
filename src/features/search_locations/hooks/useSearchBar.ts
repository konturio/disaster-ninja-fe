import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useOutsideClick } from '~utils/hooks/useOutsideClick';
import type { SelectableItem } from '@konturio/ui-kit';

interface UseSearchBarProps {
  items: SelectableItem[];
  noResults?: boolean;
  error?: boolean;
  onSearch: (query: string) => void;
  onItemSelect: (item: SelectableItem) => void;
  onReset: () => void;
}

export function useSearchBar({
  items,
  onSearch,
  onItemSelect,
  onReset,
  error,
  noResults,
}: UseSearchBarProps) {
  const [inputValue, setInputValue] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchInputEl = useRef<HTMLInputElement>();

  const searchBarRef = useOutsideClick<HTMLDivElement>(() => setIsMenuOpen(false));

  useEffect(() => {
    if (items.length || error || noResults) setIsMenuOpen(true);
  }, [items, error, noResults]);

  const onChange = useCallback((event) => {
    setInputValue(event.target.value);
    setHighlightedIndex(-1);
  }, []);

  const handleItemSelect = useCallback(
    (index) => {
      if (!items) return;

      onItemSelect(items[index]);
      setInputValue(items[index].title);
      setIsMenuOpen(false);
    },
    [items, onItemSelect],
  );

  const onKeyDown = useCallback(
    (event) => {
      if (isMenuOpen && items) {
        switch (event.key) {
          case 'ArrowDown':
            setHighlightedIndex((prevIndex) => (prevIndex + 1) % items.length);
            break;
          case 'ArrowUp':
            setHighlightedIndex(
              (prevIndex) => (prevIndex - 1 + items.length) % items.length,
            );
            break;
          case 'Enter':
            // If menu is opened and one item navigated then insert it to inputField, otherwise do search
            if (highlightedIndex >= 0 && items[highlightedIndex]) {
              handleItemSelect(highlightedIndex);
            } else {
              setIsMenuOpen(false);
              onSearch(inputValue.trim());
            }
            break;
        }
      } else if (event.key === 'Enter') {
        setIsMenuOpen(false);
        onSearch(inputValue.trim());
      }
    },
    [handleItemSelect, highlightedIndex, inputValue, isMenuOpen, items, onSearch],
  );

  const handleSearch = useCallback(() => {
    onSearch(inputValue.trim());
  }, [inputValue, onSearch]);

  const handleReset = useCallback(() => {
    setInputValue('');
    setIsMenuOpen(false);
    setHighlightedIndex(-1);
    searchInputEl.current && searchInputEl.current.focus();
    onReset();
  }, [onReset]);

  const inputProps = useMemo(
    () => ({
      value: inputValue,
      ref: searchInputEl,
      onChange,
      onKeyDown,
      onClick: () => setIsMenuOpen(items?.length > 0),
    }),
    [inputValue, items, onChange, onKeyDown],
  );

  return {
    inputProps,
    isMenuOpen,
    highlightedIndex,
    handleSearch,
    handleReset,
    handleItemSelect,
    searchBarRef,
  };
}

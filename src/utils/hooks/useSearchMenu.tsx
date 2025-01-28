import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useOutsideClick } from '~utils/hooks/useOutsideClick';

interface ListItem {
  name: string;
}

interface UseSearchMenuProps<T extends ListItem> {
  items: T[];
  onSearch: (query: string) => void;
  onItemSelect?: (item: T) => void;
  onReset: () => void;
  open: boolean;
}

export function useSearchMenu<T extends ListItem = ListItem>({
  items,
  onSearch,
  onItemSelect,
  onReset,
  open,
}: UseSearchMenuProps<T>) {
  const [inputValue, setInputValue] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchInputEl = useRef<HTMLInputElement>();
  const searchBarRef = useOutsideClick<HTMLDivElement>(() => setIsMenuOpen(false));

  useEffect(() => {
    if (open) {
      setIsMenuOpen(true);
    }
  }, [open]);

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setHighlightedIndex(-1);
  }, []);

  const handleItemSelect = useCallback(
    (item: T) => {
      onItemSelect?.(item);
      setInputValue(item.name);
      setIsMenuOpen(false);
    },
    [onItemSelect],
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
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
              handleItemSelect(items[highlightedIndex]);
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
    onSearch(inputValue);
    setIsMenuOpen(false);
  }, [inputValue, onSearch]);

  const handleReset = useCallback(() => {
    setInputValue('');
    setIsMenuOpen(false);
    setHighlightedIndex(-1);
    searchInputEl.current?.focus();
    onReset();
  }, [onReset]);

  const inputProps = useMemo(
    () => ({
      value: inputValue,
      onChange,
      onKeyDown,
      onClick: () => setIsMenuOpen(true),
    }),
    [inputValue, onChange, onKeyDown],
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

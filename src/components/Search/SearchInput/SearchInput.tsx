import React, { forwardRef } from 'react';
import { Close16, Loader24, Search16 } from '@konturio/default-icons';
import cn from 'clsx';
import { Button } from '@konturio/ui-kit';
import styles from './SearchInput.module.css';

export interface SearchInputProps {
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  isLoading: boolean;
  onSearch: () => void;
  onReset: () => void;
  placeholder?: string;
  classes?: {
    searchButton?: string;
    inputWrapper?: string;
    container?: string;
  };
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    { inputProps, isLoading, placeholder, onReset, onSearch, classes }: SearchInputProps,
    ref,
  ) => {
    const reset = () => {
      if (ref && typeof ref !== 'function' && 'current' in ref) {
        ref.current?.focus();
      }
      onReset();
    };

    return (
      <div className={cn(styles.searchInputContainer, classes?.container)}>
        <div className={cn(styles.searchInputWrapper, classes?.inputWrapper)}>
          <input
            className={styles.searchInput}
            placeholder={placeholder}
            {...inputProps}
          />

          <Loader24
            className={cn(styles.LoadingSpinner, { [styles.shown]: isLoading })}
          />

          <button type="reset" onClick={reset} aria-label="Reset search input">
            <Close16 />
          </button>
        </div>

        <Button
          variant="invert"
          onClick={onSearch}
          className={classes?.searchButton}
          aria-label="search"
        >
          <Search16 />
        </Button>
      </div>
    );
  },
);

SearchInput.displayName = 'SearchInput';

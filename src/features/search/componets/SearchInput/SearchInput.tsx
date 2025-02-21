import React from 'react';
import { Close16, Loader24, Search16 } from '@konturio/default-icons';
import cn from 'clsx';
import { Button } from '@konturio/ui-kit';
import { reatomComponent } from '@reatom/npm-react';
import styles from './SearchInput.module.css';
import type { AtomMut } from '@reatom/framework';

export interface SearchInputProps {
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  inputAtom: AtomMut<string>;
  isLoading: boolean;
  onSearch: () => void;
  onReset: () => void;
  placeholder?: string;
  classes?: {
    button?: string;
    inputWrapper?: string;
  };
}

export const SearchInput = reatomComponent<SearchInputProps>(
  ({
    ctx,
    inputAtom,
    inputProps,
    isLoading,
    placeholder,
    onReset,
    onSearch,
    classes,
  }) => {
    return (
      <div className={styles.searchInputContainer}>
        <div className={cn(styles.searchInputWrapper, classes?.inputWrapper)}>
          <input
            className={styles.searchInput}
            placeholder={placeholder}
            {...inputProps}
            value={ctx.spy(inputAtom)}
            onChange={(e) => inputAtom(ctx, e.target.value)}
          />

          <Loader24
            className={cn(styles.LoadingSpinner, { [styles.shown]: isLoading })}
          />

          <button type="reset" onClick={onReset} aria-label="Reset search input">
            <Close16 />
          </button>
        </div>

        <Button
          variant="invert"
          onClick={onSearch}
          className={classes?.button}
          aria-label="search"
          iconAfter={<Search16 />}
        />
      </div>
    );
  },
);

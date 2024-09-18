import cn from 'clsx';
import { SelectItem } from '@konturio/ui-kit';
import { useAction, useAtom } from '@reatom/npm-react';
import { useSearchBar } from '~features/search/hooks/useSearchBar';
import {
  resetAction,
  searchLocationsAction,
  searchLocationsAtom,
  itemSelectAction,
} from '~features/search/searchLocationAtoms';
import { SearchInput } from '../SearchInput/SearchInput';
import style from './SearchBar.module.css';

export function SearchBar() {
  const onSearch = useAction(searchLocationsAction);
  const onReset = useAction(resetAction);
  const onItemSelect = useAction(itemSelectAction);

  const [{ data: locations, error, loading, emptyResult }] = useAtom(searchLocationsAtom);

  const {
    inputProps,
    isMenuOpen,
    highlightedIndex,
    handleItemSelect,
    handleSearch,
    handleReset,
    searchBarRef,
  } = useSearchBar({
    items: locations,
    error: error,
    emptyResult,
    onSearch,
    onItemSelect,
    onReset,
  });

  const renderError = () => (
    <SelectItem
      key="error"
      item={{
        disabled: true,
        title: 'Something went wrong. Please try again',
        value: null,
      }}
      itemProps={{ role: 'option' }}
    />
  );

  const renderNoResults = () => (
    <SelectItem
      key="no-data"
      item={{ disabled: true, title: 'No results', value: null }}
      itemProps={{ role: 'option' }}
    />
  );

  const renderItems = () =>
    locations.map((item, index) => (
      <SelectItem
        item={{ ...item, hasDivider: true }}
        key={item.value}
        highlighted={highlightedIndex === index}
        className={style.searchItem}
        itemProps={{ onClick: () => handleItemSelect(index), role: 'option' }}
      />
    ));

  const renderMenu = () => {
    if (error) return renderError();
    if (emptyResult) return renderNoResults();
    if (locations.length) return renderItems();

    return null;
  };

  return (
    <div className={style.searchBar} ref={searchBarRef}>
      <SearchInput
        inputProps={inputProps}
        isLoading={loading}
        placeholder="Search location"
        onReset={handleReset}
        onSearch={handleSearch}
        classes={{ inputWrapper: style.searchInputWrapper, button: style.searchItem }}
      />
      {isMenuOpen && <ul className={cn(style.searchMenu)}>{renderMenu()}</ul>}
    </div>
  );
}

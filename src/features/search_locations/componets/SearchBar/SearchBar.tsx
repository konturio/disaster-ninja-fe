import cn from 'clsx';
import { SelectItem } from '@konturio/ui-kit';
import { useAction, useAtom } from '@reatom/npm-react';
import { useSearchBar } from '~features/search_locations/hooks/useSearchBar';
import { initialState } from '~features/search_locations/constants';
import {
  errorAtom,
  isLoadingAtom,
  noResultsAtom,
  searchLocations,
  selectableLocationsAtom,
  setSearchState,
  setSelectedLocation,
} from '~features/search_locations/atoms';
import { store } from '~core/store/store';
import { SearchInput } from '../SearchInput/SearchInput';
import style from './SearchBar.module.css';

export function SearchBar() {
  const [isLoading] = useAtom(isLoadingAtom);
  const [locations] = useAtom(selectableLocationsAtom);
  const [error] = useAtom(errorAtom);
  const [noResults] = useAtom(noResultsAtom);

  const onSearch = useAction(searchLocations);
  const onReset = useAction(() => setSearchState(store.v3ctx, { ...initialState }));
  const onItemSelect = useAction(setSelectedLocation);

  // const onItemSelect = (index: number) => {
  //   console.log('selected item', item); // TODO: add map highlighting in separate task
  // };

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
    onSearch,
    onItemSelect,
    onReset,
    error: error,
    noResults: noResults,
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
        itemProps={{ onClick: () => handleItemSelect(index) }}
      />
    ));

  const renderMenu = () => {
    if (error) return renderError();
    if (noResults) return renderNoResults();
    return renderItems();
  };

  return (
    <div className={style.searchBar} ref={searchBarRef}>
      <SearchInput
        inputProps={inputProps}
        isLoading={isLoading}
        placeholder="Search location"
        onReset={handleReset}
        onSearch={handleSearch}
        classes={{ inputWrapper: style.searchInputWrapper, button: style.searchItem }}
      />
      {isMenuOpen && (
        <ul className={cn(style.searchMenu, { [style.open]: isMenuOpen })}>
          {renderMenu()}
        </ul>
      )}
    </div>
  );
}

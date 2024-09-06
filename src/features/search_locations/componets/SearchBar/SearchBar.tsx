import { useReducer } from 'react';
import cn from 'clsx';
import { SelectItem } from '@konturio/ui-kit';
import { useSearchBar } from '~features/search_locations/hooks/useSearchBar';
import { getLocations } from '~core/api/locations';
import { mapLocations } from '~features/search_locations/utils/mapLocations';
import { initialState } from '~features/search_locations/constants';
import { SearchInput } from '../SearchInput/SearchInput';
import style from './SearchBar.module.css';
import type { SearchLocationState } from '~features/search_locations/types';

function reducer(
  state: SearchLocationState,
  newState: Partial<SearchLocationState>,
): SearchLocationState {
  return { ...state, ...newState };
}

export function SearchBar() {
  const [state, setState] = useReducer(reducer, initialState);
  const onSearch = async (query) => {
    if (query) {
      setState({ isLoading: true, noResults: false, error: false, locations: [] });

      try {
        const response = await getLocations(query);
        const items = response?.locations.features || [];
        if (items.length === 0) {
          setState({ noResults: true });
        } else {
          setState({ locations: mapLocations(items) });
        }
      } catch {
        setState({ error: true });
      } finally {
        setState({ isLoading: false });
      }
    }
  };

  const onReset = () => {
    setState(initialState);
  };

  const onItemSelect = (item) => {
    // console.log('selected item', item); // TODO: add map highlighting in separate feature
  };

  const {
    inputProps,
    isMenuOpen,
    highlightedIndex,
    handleSearch,
    handleReset,
    handleItemSelect,
    searchBarRef,
  } = useSearchBar({
    items: state.locations,
    onSearch,
    onItemSelect,
    onReset,
    error: state.error,
    noResults: state.noResults,
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
    state.locations.map((item, index) => (
      <SelectItem
        item={{ ...item, hasDivider: true }}
        key={item.value}
        highlighted={highlightedIndex === index}
        className={style.searchItem}
        itemProps={{ onClick: () => handleItemSelect(index) }}
      />
    ));

  const renderMenu = () => {
    if (state.error) return renderError();
    if (state.noResults) return renderNoResults();
    return renderItems();
  };

  return (
    <div className={style.searchBar} ref={searchBarRef}>
      <SearchInput
        inputProps={inputProps}
        isLoading={state.isLoading}
        placeholder="Search location"
        onReset={handleReset}
        onSearch={handleSearch}
        classes={{ inputWrapper: style.searchInputWrapper }}
      />
      {isMenuOpen && (
        <ul className={cn(style.searchMenu, { [style.open]: isMenuOpen })}>
          {renderMenu()}
        </ul>
      )}
    </div>
  );
}

import { SelectItem } from '@konturio/ui-kit';
import { useAction, useAtom } from '@reatom/npm-react';
import { useMemo, useRef } from 'react';
import cn from 'clsx';
import { searchLocationsAtom } from '~features/search/searchLocationAtoms';
import {
  itemSelectAction,
  handleKeyDownAction,
  highlightedIndexAtom,
  inputAtom,
  isMenuOpenAtom,
  searchAction,
  resetSearchAction,
  showInfoBlockAtom,
  aggregatedSearchAtom,
} from '~features/search/searchAtoms';
import { useOutsideClick } from '~utils/hooks/useOutsideClick';
import { i18n } from '~core/localization';
import { isMCDASearchEnabled, MCDAAtom } from '~features/search/searchMcdaAtoms';
import { SearchInput } from '../SearchInput/SearchInput';
import style from './SearchBar.module.css';

export function SearchBar() {
  const [isMenuOpen, setIsMenuOpen] = useAtom(isMenuOpenAtom);
  const [highlightedIndex] = useAtom(highlightedIndexAtom);
  const [showInfoBlock] = useAtom(showInfoBlockAtom);

  const inputPlaceholder = isMCDASearchEnabled
    ? i18n.t('search.input_placeholder_mcda')
    : i18n.t('search.input_placeholder');

  const searchInputEl = useRef<HTMLInputElement>();
  const searchBarRef = useOutsideClick<HTMLDivElement>(() => setIsMenuOpen(false));

  const handleInputKeyDown = useAction(handleKeyDownAction);
  const handleSearch = useAction(searchAction);
  const handleItemSelect = useAction(itemSelectAction);
  const onReset = useAction(resetSearchAction);

  const handleReset = () => {
    searchInputEl.current?.focus();
    onReset();
  };

  const [{ error, loading, emptyResult }] = useAtom(searchLocationsAtom);
  const [state] = useAtom(MCDAAtom);
  const [aggregatedResults] = useAtom(aggregatedSearchAtom);

  const inputProps = useMemo(
    () => ({
      ref: searchInputEl,
      onKeyDown: handleInputKeyDown,
      onClick: () => {
        setIsMenuOpen(true);
      },
    }),
    [handleInputKeyDown, setIsMenuOpen],
  );

  const renderError = () => (
    <SelectItem
      key="error"
      item={{
        disabled: true,
        title: 'Something went wrong. Please try again',
        value: null,
      }}
      className={style.listItem}
      itemProps={{ role: 'option' }}
    />
  );

  const renderNoResults = () => (
    <SelectItem
      key="no-data"
      item={{ disabled: true, title: 'No results', value: null }}
      className={style.listItem}
      itemProps={{ role: 'option' }}
    />
  );

  const renderItems = () => {
    return (
      <>
        {aggregatedResults.map((item, index) => {
          switch (item.source) {
            case 'locations':
              return (
                <SelectItem
                  key={item.properties.osm_id}
                  item={{
                    title: item.properties.display_name,
                    value: item.properties.osm_id,
                    hasDivider: true,
                  }}
                  highlighted={highlightedIndex === index}
                  className={style.listItem}
                  itemProps={{
                    onClick: () => handleItemSelect(item),
                    role: 'option',
                  }}
                />
              );
            case 'mcda':
              return (
                <SelectItem
                  key={item.name}
                  className={cn(style.listItem, style.createMcdaAnalysis)}
                  item={{
                    title: `✨${i18n.t('search.mcda_create_analysis')} "${item.name}"`,
                    value: item.name,
                    hasDivider: true,
                  }}
                  highlighted={highlightedIndex === index}
                  itemProps={{
                    onClick: () => handleItemSelect(item),
                    role: 'option',
                  }}
                />
              );
            default:
              return null;
          }
        })}
      </>
    );
  };

  const LocationSearchStatus = () => (
    <>
      {error && renderError()}
      {emptyResult && renderNoResults()}
    </>
  );

  return (
    <div className={style.searchBar} ref={searchBarRef}>
      <SearchInput
        inputAtom={inputAtom}
        inputProps={inputProps}
        isLoading={loading}
        placeholder={inputPlaceholder}
        onReset={handleReset}
        onSearch={handleSearch}
        classes={{ inputWrapper: style.searchInputWrapper }}
      />
      {isMenuOpen && (
        <>
          {showInfoBlock && (
            <div className={style.infoBanner}>{i18n.t('search.info_block')}</div>
          )}
          <ul className={style.resultsList}>
            {isMCDASearchEnabled && <MCDASearchStatus state={state} />}
            {renderItems()}
            <LocationSearchStatus />
          </ul>
        </>
      )}
    </div>
  );
}

export function MCDASearchStatus({ state }) {
  const { error, loading } = state;

  if (error?.status === 422)
    return (
      <li className={cn(style.mcdaStatusItem)}>{i18n.t('search.mcda_no_result')}</li>
    );
  if (error)
    return (
      <li className={cn(style.mcdaStatusItem, style.error)}>
        {i18n.t('search.mcda_error_message')}
      </li>
    );
  if (loading)
    return (
      <li className={cn(style.mcdaStatusItem, style.loading)}>
        {i18n.t('search.mcda_loading_message')}
      </li>
    );
  return null;
}

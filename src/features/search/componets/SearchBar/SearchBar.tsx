import { SelectItem } from '@konturio/ui-kit';
import { useAction, useAtom } from '@reatom/npm-react';
import cn from 'clsx';
import { forwardRef, useEffect } from 'react';
import { searchLocationsAtom } from '~features/search/searchLocationAtoms';
import {
  itemSelectAction,
  searchAction,
  resetSearchAction,
  showInfoBlockAtom,
  aggregatedSearchAtom,
} from '~features/search/searchAtoms';
import { i18n } from '~core/localization';
import {
  isMCDASearchEnabled,
  MCDASuggestionAtom,
} from '~features/search/searchMcdaAtoms';
import { SearchInput } from '~components/Search/SearchInput/SearchInput';
import { searchHighlightedGeometryAtom } from '../../atoms/highlightedGeometry';
import type { Feature } from 'geojson';
import { EMPTY_HIGHLIGHT } from '../../constants';
import { useSearchMenu } from '~utils/hooks/useSearchMenu';
import style from './SearchBar.module.css';
import type { AggregatedSearchItem } from '~features/search/searchAtoms';

type SearchBarProps = {
  onItemSelect?: () => void;
  searchBarClass?: string;
};

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ onItemSelect, searchBarClass }, ref: React.ForwardedRef<HTMLInputElement>) => {
    const [showInfoBlock] = useAtom(showInfoBlockAtom);

    const inputPlaceholder = isMCDASearchEnabled
      ? i18n.t('search.input_placeholder_mcda')
      : i18n.t('search.input_placeholder');

  const search = useAction(searchAction);
  const itemSelectActionFn = useAction(itemSelectAction);
  const reset = useAction(resetSearchAction);
  const setHighlightedGeometry = useAction(searchHighlightedGeometryAtom);

    const itemSelect = (item: AggregatedSearchItem) => {
      itemSelectActionFn(item);
      setHighlightedGeometry(EMPTY_HIGHLIGHT);
      onItemSelect?.();
    };

    const [{ error, loading, data }] = useAtom(searchLocationsAtom);
    const emptyLocations = data ? data.length === 0 : false;
    const [mcdaSearchStatus] = useAtom(MCDASuggestionAtom);
  const [aggregatedResults] = useAtom(aggregatedSearchAtom);

  useEffect(() => {
    return () => {
      setHighlightedGeometry(EMPTY_HIGHLIGHT);
    };
  }, [setHighlightedGeometry]);

    const renderError = () => (
      <SelectItem
        key="error"
        item={{
          disabled: true,
          title: i18n.t('errors.error_try_again'),
          value: null,
        }}
        className={style.listItem}
        itemProps={{ role: 'option' }}
      />
    );

    const renderNoResults = () => (
      <SelectItem
        key="no-data"
        item={{
          disabled: true,
          title: i18n.t('search.locations_no_result'),
          value: null,
        }}
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
                      onMouseEnter: () =>
                        item.geometry &&
                        setHighlightedGeometry(item as Feature),
                      onMouseLeave: () =>
                        setHighlightedGeometry(EMPTY_HIGHLIGHT),
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
                      onMouseEnter: () =>
                        setHighlightedGeometry(EMPTY_HIGHLIGHT),
                      onMouseLeave: () =>
                        setHighlightedGeometry(EMPTY_HIGHLIGHT),
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
        {emptyLocations && renderNoResults()}
      </>
    );

    const {
      inputProps,
      isMenuOpen,
      highlightedIndex,
      handleItemSelect,
      handleSearch,
      handleReset,
      searchBarRef,
    } = useSearchMenu({
      items: aggregatedResults,
      onSearch: search,
      onItemSelect: itemSelect,
      onReset: reset,
      open:
        !!aggregatedResults.length ||
        !!error ||
        mcdaSearchStatus.loading ||
        emptyLocations,
    });

    useEffect(() => {
      if (!isMenuOpen) setHighlightedGeometry(EMPTY_HIGHLIGHT);
    }, [isMenuOpen, setHighlightedGeometry]);

    return (
      <>
        <div className={cn(style.searchBar, searchBarClass)} ref={searchBarRef}>
          <SearchInput
            ref={ref}
            inputProps={inputProps}
            isLoading={loading}
            placeholder={inputPlaceholder}
            classes={{ container: style.inputContainer }}
            onReset={handleReset}
            onSearch={handleSearch}
          />
        </div>
        {isMenuOpen && (
          <>
            {showInfoBlock && (
              <div className={style.infoBanner}>
                {isMCDASearchEnabled
                  ? i18n.t('search.info_block_with_mcda')
                  : i18n.t('search.info_block')}
              </div>
            )}
            <ul className={style.resultsList}>
              {isMCDASearchEnabled && <MCDASearchStatus state={mcdaSearchStatus} />}
              {renderItems()}
              <LocationSearchStatus />
            </ul>
          </>
        )}
      </>
    );
  },
);

SearchBar.displayName = 'SearchBar';

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

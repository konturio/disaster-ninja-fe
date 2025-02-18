import { useAction, useAtom } from '@reatom/npm-react';
import { SelectItem } from '@konturio/ui-kit';
import { useEffect } from 'react';
import { SearchInput } from '~components/Search/SearchInput/SearchInput';
import { i18n } from '~core/localization';
import { useSearchMenu } from '~utils/hooks/useSearchMenu';
import {
  resetSearchRefAreaAtom,
  searchRefAreaAtom,
  searchAction,
} from '~features/user_profile/components/SettingsForm/ReferenceAreaInfo/searchAtoms';
import { updateReferenceArea } from '~core/api/features';
import { setReferenceArea } from '~core/shared_state/referenceArea';
import { store } from '~core/store/store';
import { notificationServiceInstance } from '~core/notificationServiceInstance';
import s from './SearchBar.module.css';

export const SearchBar = () => {
  const [{ data, loading, error }] = useAtom(searchRefAreaAtom);
  const search = useAction(searchAction);
  const reset = useAction(resetSearchRefAreaAtom);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const itemSelect = async (item) => {
    await updateReferenceArea(item);
    await setReferenceArea(store.v3ctx, item);
    notificationServiceInstance.success(
      {
        title: i18n.t('profile.reference_area.notification', {
          name: item.name,
        }),
      },
      2,
    );
  };

  const {
    inputProps,
    isMenuOpen,
    highlightedIndex,
    handleItemSelect,
    handleSearch,
    handleReset,
    searchBarRef,
  } = useSearchMenu({
    items: data || [],
    onSearch: search,
    onItemSelect: itemSelect,
    onReset: reset,
    open: !!data,
  });

  const renderError = () => (
    <SelectItem
      key="error"
      item={{
        disabled: true,
        title: i18n.t('errors.error_try_again'),
        value: null,
      }}
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
      itemProps={{ role: 'option' }}
    />
  );

  const LocationSearchStatus = () => (
    <>
      {error && renderError()}
      {data?.length === 0 && renderNoResults()}
    </>
  );

  const renderItems = () => {
    return (
      <>
        {data?.map((item, index) => {
          return (
            <SelectItem
              key={item.properties.osm_id}
              item={{
                title: item.properties.display_name,
                value: item.properties.osm_id,
                hasDivider: true,
              }}
              highlighted={highlightedIndex === index}
              itemProps={{
                onClick: () => handleItemSelect(item),
                role: 'option',
              }}
              className={s.listItem}
            />
          );
        })}
      </>
    );
  };

  return (
    <div className={s.searchBar} ref={searchBarRef}>
      <SearchInput
        inputProps={inputProps}
        isLoading={loading}
        placeholder={i18n.t('search.search_location')}
        onReset={handleReset}
        onSearch={handleSearch}
        classes={{ container: s.searchContainer }}
      />
      {isMenuOpen && (
        <ul className={s.resultsList}>
          {renderItems()}
          <LocationSearchStatus />
        </ul>
      )}
    </div>
  );
};

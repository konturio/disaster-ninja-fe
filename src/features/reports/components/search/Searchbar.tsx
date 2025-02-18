import { SearchIcon } from '@konturio/default-icons';
import { Input } from '@konturio/ui-kit';
import { useEffect, useState } from 'react';
import { useAtom } from '@reatom/react-v2';
import { i18n } from '~core/localization';
import { tableAtom } from '~features/reports/atoms/tableAtom';
import { useUnlistedRef } from '~utils/hooks/useUnlistedRef';
import s from './search.module.css';
import type { FormEvent } from 'react';

export function Searchbar({ searchIndexes = [] }: { searchIndexes: number[] }) {
  const [query, setQuery] = useState('');
  const [, { search }] = useAtom(tableAtom);

  function onInput(e: FormEvent<HTMLInputElement>) {
    setQuery((e.target as HTMLInputElement).value);
  }
  function cancel() {
    setQuery('');
  }

  const unlistedState = useUnlistedRef({ searchIndexes, search });

  useEffect(() => {
    const { searchIndexes, search } = unlistedState.current;
    const delayDebounceFn = setTimeout(() => {
      search(query, searchIndexes);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query, unlistedState]);

  return (
    <div className={s.searchContainer}>
      <Input
        onInput={onInput}
        value={query}
        onTouchCancel={cancel}
        placeholder={i18n.t('search.search_location')}
      >
        <SearchIcon width={16} />
      </Input>
    </div>
  );
}

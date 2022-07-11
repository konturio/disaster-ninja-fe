import { SearchIcon } from '@konturio/default-icons';
import { Input } from '@konturio/ui-kit';
import { useEffect, useState } from 'react';
import { useAtom } from '@reatom/react';
import { i18n } from '~core/localization';
import { tableAtom } from '~features/reports/atoms/tableAtom';
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

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      search(query, searchIndexes);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className={s.searchContainer}>
      <Input
        onInput={onInput}
        value={query}
        onTouchCancel={cancel}
        placeholder={i18n.t('Search location')}
      >
        <SearchIcon width={20} />
      </Input>
    </div>
  );
}

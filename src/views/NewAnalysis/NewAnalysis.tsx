import { useState } from 'react';
import { Button } from '@konturio/ui-kit';
import { i18n } from '~core/localization';
import { configRepo } from '~core/config';
import { AppFeature } from '~core/app/types';
import { SearchInput } from '~components/Search/SearchInput/SearchInput';
import style from './NewAnalysis.module.css';

function getLocalizedExample(ex: Record<string, string>) {
  const lang = i18n.language;
  return ex[lang] || ex.en || Object.values(ex)[0];
}

export function NewAnalysisPage() {
  const featureConfig = configRepo.get().features[AppFeature.NEW_ANALYSIS] as
    | { examples?: Record<string, string>[] }
    | boolean;

  const examples = Array.isArray((featureConfig as any)?.examples)
    ? ((featureConfig as any).examples as Record<string, string>[])
    : [];

  const [query, setQuery] = useState('');

  const onExampleClick = (text: string) => {
    setQuery(text);
    // TODO: trigger AI analysis generation
  };

  const onGenerate = () => {
    // TODO: trigger AI analysis generation
  };

  return (
    <div className={style.container}>
      <h1 className={style.title}>{i18n.t('new_analysis.title')}</h1>
      <div className={style.lead}>
        <h2>{i18n.t('new_analysis.heading')}</h2>
        <p className={style.leadText}>{i18n.t('new_analysis.description')}</p>
      </div>
      <div className={style.examples}>
        {examples.map((ex) => {
          const text = getLocalizedExample(ex);
          return (
            <button
              key={text}
              className={style.exampleChip}
              onClick={() => onExampleClick(text)}
            >
              {text}
            </button>
          );
        })}
      </div>
      <div className={style.searchRow}>
        <SearchInput
          inputProps={{
            value: query,
            onChange: (e) => setQuery(e.target.value),
          }}
          isLoading={false}
          onSearch={onGenerate}
          onReset={() => setQuery('')}
          placeholder={i18n.t('search.input_placeholder_mcda')}
          classes={{ searchButton: style.hiddenSearchButton }}
        />
        <Button variant="primary" disabled={!query} onClick={onGenerate}>
          {i18n.t('new_analysis.generate_button')}
        </Button>
      </div>
      <div className={style.tryMap}>
        <a href="#/map">{i18n.t('new_analysis.try_map_link')}</a>
      </div>
    </div>
  );
}

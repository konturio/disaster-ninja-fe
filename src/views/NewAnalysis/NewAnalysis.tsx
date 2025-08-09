import { useState } from 'react';
import { Button } from '@konturio/ui-kit';
import { i18n } from '~core/localization';
import { configRepo } from '~core/config';
import { AppFeature } from '~core/app/types';
import { SearchInput } from '~components/Search/SearchInput/SearchInput';
import { getMCDA } from '~core/api/search';
import style from './NewAnalysis.module.css';

function getLocalizedExample(ex: Record<string, string>) {
  const lang = i18n.instance.language;
  return ex[lang] || ex.en || Object.values(ex)[0];
}

export function NewAnalysisPage() {
  interface NewAnalysisFeatureConfig {
    examples?: Record<string, string>[];
  }

  const rawConfig = configRepo.get().features[AppFeature.NEW_ANALYSIS];
  const featureConfig =
    typeof rawConfig === 'object' ? (rawConfig as NewAnalysisFeatureConfig) : undefined;

  const examples = featureConfig?.examples ?? [];

  const [query, setQuery] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const onGenerate = async (q = query) => {
    if (!q.trim()) return;
    setIsLoading(true);
    try {
      const result = await getMCDA(q);
      console.info(result);
    } catch (error) {
      console.error('Failed to generate analysis', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onExampleClick = (text: string) => {
    setQuery(text);
    void onGenerate(text);
  };

  return (
    <div className={style.container}>
      <h1 className={style.title}>{i18n.t('new_analysis_page.title')}</h1>
      <div className={style.lead}>
        <h2>{i18n.t('new_analysis_page.heading')}</h2>
        <p className={style.leadText}>{i18n.t('new_analysis_page.description')}</p>
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
          isLoading={isLoading}
          onSearch={() => onGenerate()}
          onReset={() => setQuery('')}
          placeholder={i18n.t('search.input_placeholder_mcda')}
          classes={{ searchButton: style.hiddenSearchButton }}
        />
        <Button
          type="button"
          variant="primary"
          disabled={!query || isLoading}
          onClick={() => onGenerate()}
        >
          {i18n.t('new_analysis_page.generate_button')}
        </Button>
      </div>
      <div className={style.tryMap}>
        <a href="#/map">{i18n.t('new_analysis_page.try_map_link')}</a>
      </div>
    </div>
  );
}

import { SelectItem } from '@konturio/ui-kit';
import { useAction, useAtom } from '@reatom/npm-react';
import { MCDAAtom, showAnalysis } from '~features/search/searchMcdaAtoms';

export function MCDASearchResult() {
  const [{ data, error, loading }] = useAtom(MCDAAtom);
  const onShowResults = useAction(showAnalysis);

  const loadingMessage = (
    <SelectItem
      key="search-mcda-pending"
      item={{
        title: 'AI is generating an analysis for you...',
        value: null,
      }}
      itemProps={{
        onClick: () => {},
        role: 'option',
      }}
    />
  );

  const errorMessage = (
    <SelectItem
      key="search-mcda-error"
      item={{
        title: 'AI engine did not respond. Try again later',
        value: null,
      }}
      itemProps={{
        onClick: () => {},
        role: 'option',
      }}
    />
  );

  const renderShowResultsMessage = (name) => (
    <SelectItem
      key="search-mcda-results"
      item={{
        title: `Create analysis "${name}"`,
        value: null,
      }}
      itemProps={{
        onClick: onShowResults,
        role: 'option',
      }}
    />
  );

  if (error) return errorMessage;
  if (loading) return loadingMessage;
  if (data) return renderShowResultsMessage(data.config.name);
  return null;
}

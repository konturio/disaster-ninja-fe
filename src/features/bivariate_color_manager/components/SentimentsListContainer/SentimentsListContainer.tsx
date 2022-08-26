import { useAtom } from '@reatom/react';
import { KonturSpinner } from '~components/LoadingSpinner/KonturSpinner';
import { SentimentsCombinationsList } from '~features/bivariate_color_manager/components';
import { bivariateColorManagerResourceAtom } from '~features/bivariate_color_manager/atoms/bivariateColorManagerResource';
import { bivariateColorManagerAtom } from '~features/bivariate_color_manager/atoms/bivariateColorManager';
import style from './SentimentsListContainer.module.css';

export const SentimentsListContainer = () => {
  const [loading] = useAtom(
    bivariateColorManagerResourceAtom,
    (state) => state.loading,
  );

  const [
    { filteredData: data, layersSelection, selectedRows, filters },
    { setLayersSelection, setSelectedRows },
  ] = useAtom(bivariateColorManagerAtom);

  const anyFilterActivated = Object.values(filters).filter(Boolean).length > 0;

  return (
    <div className={style.ListBody}>
      {loading ? (
        <KonturSpinner className={style.LoadingSpinner} />
      ) : (
        <SentimentsCombinationsList
          anyFilterActivated={anyFilterActivated}
          data={data!}
          setLayersSelection={setLayersSelection}
          layersSelection={layersSelection}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
      )}
    </div>
  );
};

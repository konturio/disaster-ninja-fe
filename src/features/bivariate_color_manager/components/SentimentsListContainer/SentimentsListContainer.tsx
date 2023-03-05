import { useAtom } from '@reatom/react-v2';
import { KonturSpinner } from '~components/LoadingSpinner/KonturSpinner';
import { SentimentsCombinationsList } from '~features/bivariate_color_manager/components';
import { bivariateColorManagerResourceAtom } from '~features/bivariate_color_manager/atoms/bivariateColorManagerResource';
import { bivariateColorManagerDataAtom } from '~features/bivariate_color_manager/atoms/bivariateColorManagerData';
import style from './SentimentsListContainer.module.css';

export const SentimentsListContainer = () => {
  const [loading] = useAtom(bivariateColorManagerResourceAtom, (state) => state.loading);

  const [
    { filteredData, layersSelection, selectedRows, filters },
    { setLayersSelection, setSelectedRows },
  ] = useAtom(bivariateColorManagerDataAtom);

  const anyFilterActivated = Object.values(filters).filter(Boolean).length > 0;

  return (
    <div className={style.ListBody}>
      {loading ? (
        <KonturSpinner className={style.LoadingSpinner} />
      ) : (
        <SentimentsCombinationsList
          anyFilterActivated={anyFilterActivated}
          data={filteredData!}
          setLayersSelection={setLayersSelection}
          layersSelection={layersSelection}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
      )}
    </div>
  );
};

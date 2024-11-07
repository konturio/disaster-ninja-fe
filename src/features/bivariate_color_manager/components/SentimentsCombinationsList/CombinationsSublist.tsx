import clsx from 'clsx';
import {
  CSSTransitionWrapper,
  fadeClassNames,
} from '~components/CssTransitionWrapper/CssTransitionWrapper';
import { sortByKey } from '~utils/common';
import s from './CombinationsSublist.module.css';
import type {
  BivariateColorManagerData,
  BivariateColorManagerDataValue,
  TableDataValue,
} from '~features/bivariate_color_manager/atoms/bivariateColorManagerResource';
import type {
  BivariateColorManagerDataAtomState,
  LayerSelectionInput,
} from '~features/bivariate_color_manager/atoms/bivariateColorManagerData';

type SentimentsCombinationsListProps = {
  data: BivariateColorManagerData;
  setLayersSelection: (input: LayerSelectionInput) => void;
  layersSelection: BivariateColorManagerDataAtomState['layersSelection'];
};

const sortDescendingByQuality = sortByKey<TableDataValue>('correlationLevel', 'desc');

type SublistProps = {
  open: boolean;
  rowData: BivariateColorManagerDataValue;
  rowKey: string;
  setLayersSelection: SentimentsCombinationsListProps['setLayersSelection'];
  layersSelection: SentimentsCombinationsListProps['layersSelection'];
};

type Plane = 'vertical' | 'horizontal';

const CombinationsSublist = ({
  open = false,
  rowData,
  rowKey: key,
  setLayersSelection,
  layersSelection,
}: SublistProps) => {
  const { vertical, horizontal } = rowData;
  const verticalList = Object.values(vertical).sort(sortDescendingByQuality);
  const horizontalList = Object.values(horizontal).sort(sortDescendingByQuality);
  const selectlayer = (plane: Plane, quotientIndicator: TableDataValue): void => {
    setLayersSelection({
      key,
      [plane]: quotientIndicator,
    });
  };

  const isLayerSelected = (plane: Plane, quotientIndicator: TableDataValue) =>
    layersSelection && quotientIndicator.label === layersSelection?.[plane]?.label;

  // eslint-disable-next-line react/display-name
  const renderItem = (plane: Plane) => (quotientIndicator: TableDataValue) => (
    <div
      onClick={() => selectlayer(plane, quotientIndicator)}
      className={clsx(
        s.sublistRow,
        isLayerSelected(plane, quotientIndicator) && s.sublistRowSelected,
      )}
      key={quotientIndicator.label}
    >
      {quotientIndicator.label}
    </div>
  );

  const renderVerticalItem = renderItem('vertical');
  const renderHorizontalItem = renderItem('horizontal');

  return (
    <CSSTransitionWrapper
      in={open}
      timeout={300}
      unmountOnExit
      appear
      classNames={fadeClassNames}
    >
      {(ref) => (
        <tr ref={ref} className={s.sublist}>
          <td />
          <td />
          <td>{verticalList.map(renderVerticalItem)}</td>
          <td>{horizontalList.map(renderHorizontalItem)}</td>
        </tr>
      )}
    </CSSTransitionWrapper>
  );
};

export { CombinationsSublist };

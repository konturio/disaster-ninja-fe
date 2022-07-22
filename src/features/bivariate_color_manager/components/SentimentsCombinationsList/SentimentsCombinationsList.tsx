import clsx from 'clsx';
import React, {
  Children,
  cloneElement,
  isValidElement,
  memo,
  useRef,
  useState,
} from 'react';
import { CSSTransition } from 'react-transition-group';
import { joinAndCapitalizeItems, sortByKey } from '~utils/common';
import { i18n } from '~core/localization';
import { MiniLegend } from '~features/bivariate_color_manager/components/MiniLegend/MiniLegend';
import { invertClusters } from '~utils/bivariate';
import s from './SentimentsCombinationsList.module.css';
import type {
  BivariateColorManagerData,
  TableDataValue,
} from '~features/bivariate_color_manager/atoms/bivariateColorManagerResource';
import type { BivariateLegend } from '~core/logical_layers/types/legends';
import type { CSSTransitionProps } from 'react-transition-group/CSSTransition';

type Row = {
  key: string;
  maps: number;
  verticalLabel: string;
  horizontalLabel: string;
  legend?: BivariateLegend;
};

type SentimentsCombinationsListProps = {
  data: BivariateColorManagerData;
};

const sortDescendingByMaps = sortByKey<Row>('maps', 'desc');
const sortDescendingByQuality = sortByKey<TableDataValue>('quality', 'desc');

const convertDirectionsArrayToLabel = (directions: string[][]) => {
  const [from = '', to = ''] = directions;
  return `${joinAndCapitalizeItems(from)} → ${joinAndCapitalizeItems(to)}`;
};

const fadeClassNames = {
  enter: s.fadeEnter,
  enterActive: s.fadeEnterActive,
  exit: s.fadeExit,
  exitActive: s.fadeExitActive,
};

const SentimentsCombinationsList = memo(
  ({ data }: SentimentsCombinationsListProps) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<{
      [key: string]: boolean;
    }>({});
    const columns = [
      { title: i18n.t('Legend'), className: s.centered },
      { title: i18n.t('Maps'), className: s.centered },
      { title: i18n.t('Vertical direction') },
      { title: i18n.t('Horizontal direction') },
    ];

    const rows: Row[] = Object.entries(data)
      .map(([key, value]) => {
        const { maps, legend } = value;
        const keyParsed = JSON.parse(key);
        const verticalLabel = convertDirectionsArrayToLabel(keyParsed.vertical);
        const horizontalLabel = convertDirectionsArrayToLabel(
          keyParsed.horizontal,
        );

        return {
          key,
          maps,
          verticalLabel,
          horizontalLabel,
          legend,
        };
      })
      .sort(sortDescendingByMaps);

    return (
      <table className={s.table}>
        <thead>
          <tr>
            {columns.map(({ title, className }) => (
              <th key={title} className={className}>
                {title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map(({ key, legend, maps, verticalLabel, horizontalLabel }) => {
            const rowSelected = selectedRowKeys[key];
            const selectRow = () =>
              setSelectedRowKeys({
                ...selectedRowKeys,
                [key]: !selectedRowKeys[key],
              });

            const { vertical, horizontal } = data[key];
            const verticalList = Object.values(vertical).sort(
              sortDescendingByQuality,
            );
            const horizontalList = Object.values(horizontal).sort(
              sortDescendingByQuality,
            );

            return (
              <React.Fragment key={key}>
                <tr
                  onClick={selectRow}
                  className={clsx(rowSelected && s.rowSeleted)}
                >
                  <td>
                    <div className={s.legendWrapper}>
                      {legend && (
                        <MiniLegend
                          legend={invertClusters(legend.steps, 'label')}
                        />
                      )}
                    </div>
                  </td>
                  <td className={s.centered}>{maps}</td>
                  <td className={s.label}>{verticalLabel}</td>
                  <td className={s.label}>{horizontalLabel}</td>
                </tr>

                <CSSTransitionWrapper
                  in={rowSelected}
                  timeout={300}
                  unmountOnExit
                  appear
                  classNames={fadeClassNames}
                >
                  <tr className={s.sublist}>
                    <td />
                    <td />
                    <td>
                      {verticalList.map(({ label }) => (
                        <div className={s.sublistRow} key={label}>
                          {label}
                        </div>
                      ))}
                    </td>
                    <td>
                      {horizontalList.map(({ label }) => (
                        <div className={s.sublistRow} key={label}>
                          {label}
                        </div>
                      ))}
                    </td>
                  </tr>
                </CSSTransitionWrapper>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    );
  },
);

const CSSTransitionWrapper = ({ children, ...props }: CSSTransitionProps) => {
  const nodeRef = useRef(null);

  return (
    <CSSTransition {...props} nodeRef={nodeRef}>
      <>
        {Children.map(children, (child) =>
          isValidElement(child) ? cloneElement(child, { ref: nodeRef }) : child,
        )}
      </>
    </CSSTransition>
  );
};

SentimentsCombinationsList.displayName = 'SentimentsCombinationsList';

export { SentimentsCombinationsList };

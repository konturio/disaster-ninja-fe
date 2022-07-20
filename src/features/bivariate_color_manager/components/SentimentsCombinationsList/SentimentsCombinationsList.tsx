import { nanoid } from 'nanoid';
import clsx from 'clsx';
import { memo } from 'react';
import { joinAndCapitalizeItems, sortByKey } from '~utils/common';
import { i18n } from '~core/localization';
import { MiniLegend } from '~features/bivariate_color_manager/components/MiniLegend/MiniLegend';
import { invertClusters } from '~utils/bivariate';
import s from './SentimentsCombinationsList.module.css';
import type { BivariateColorManagerData } from '~features/bivariate_color_manager/atoms/bivariateColorManagerResource';
import type { BivariateLegend } from '~core/logical_layers/types/legends';

type Row = {
  key: string;
  maps: number;
  verticalLabel: string;
  horizontalLabel: string;
  legend?: BivariateLegend;
  id: string;
};

type SentimentsCombinationsListProps = {
  data: BivariateColorManagerData;
};

const sortDescendingByMaps = sortByKey<Row>('maps', 'desc');

const convertDirectionsArrayToLabel = (directions: string[][]) => {
  const [from = '', to = ''] = directions;
  return `${joinAndCapitalizeItems(from)} → ${joinAndCapitalizeItems(to)}`;
};

const SentimentsCombinationsList = memo(
  ({ data }: SentimentsCombinationsListProps) => {
    const columns = [
      { title: i18n.t('Legend'), className: clsx(s.centered) },
      { title: i18n.t('Maps'), className: clsx(s.centered) },
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
          id: nanoid(4),
        };
      })
      .sort(sortDescendingByMaps);

    return (
      <table className={clsx(s.table)}>
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
          {rows.map(({ id, legend, maps, verticalLabel, horizontalLabel }) => (
            <tr key={id}>
              <td>
                <div className={clsx(s.legendWrapper)}>
                  {legend && (
                    <MiniLegend
                      legend={invertClusters(legend.steps, 'label')}
                    />
                  )}
                </div>
              </td>
              <td className={clsx(s.centered)}>{maps}</td>
              <td className={clsx(s.label)}>{verticalLabel}</td>
              <td className={clsx(s.label)}>{horizontalLabel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
);

SentimentsCombinationsList.displayName = 'SentimentsCombinationsList';

export { SentimentsCombinationsList };

import clsx from 'clsx';
import React, { memo, useState } from 'react';
import { sortByKey } from '~utils/common';
import { i18n } from '~core/localization';
import { MiniLegend } from '~features/bivariate_color_manager/components/MiniLegend/MiniLegend';
import { invertClusters } from '~utils/bivariate';
import { convertDirectionsArrayToLabel } from '~utils/bivariate';
import { CombinationsSublist } from './CombinationsSublist';
import s from './SentimentsCombinationsList.module.css';
import type { BivariateColorManagerData } from '~features/bivariate_color_manager/atoms/bivariateColorManagerResource';
import type { BivariateLegend } from '~core/logical_layers/types/legends';
import type {
  BivariateColorManagerAtomState,
  LayerSelectionInput,
} from '~features/bivariate_color_manager/atoms/bivariateColorManager';

type Row = {
  key: string;
  maps: number;
  verticalLabel: string;
  horizontalLabel: string;
  legend?: BivariateLegend;
};

type SentimentsCombinationsListProps = {
  data: BivariateColorManagerData;
  setLayersSelection: (input: LayerSelectionInput) => void;
  layersSelection: BivariateColorManagerAtomState['layersSelection'];
};

const sortDescendingByMaps = sortByKey<Row>('maps', 'desc');

const columns = [
  { title: i18n.t('Legend'), className: s.centered },
  { title: i18n.t('Maps'), className: s.centered },
  { title: i18n.t('Vertical direction') },
  { title: i18n.t('Horizontal direction') },
];

const SentimentsCombinationsList = memo(
  ({
    data,
    setLayersSelection,
    layersSelection,
  }: SentimentsCombinationsListProps) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<{
      [key: string]: boolean;
    }>({});

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

            let layersSelectionData;
            if (layersSelection?.key === key)
              layersSelectionData = layersSelection;

            return (
              <React.Fragment key={key}>
                <tr
                  onClick={selectRow}
                  className={clsx(s.rowSelectable, rowSelected && s.rowSeleted)}
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

                <CombinationsSublist
                  open={rowSelected}
                  rowData={data[key]}
                  rowKey={key}
                  setLayersSelection={setLayersSelection}
                  layersSelection={layersSelectionData}
                />
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    );
  },
);

SentimentsCombinationsList.displayName = 'SentimentsCombinationsList';

export { SentimentsCombinationsList };

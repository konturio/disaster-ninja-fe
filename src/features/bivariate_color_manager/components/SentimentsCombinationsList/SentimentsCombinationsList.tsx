import clsx from 'clsx';
import React, { memo } from 'react';
import { EyeOff24 } from '@konturio/default-icons';
import { sortByKey } from '~utils/common';
import core from '~core/index';
import { MiniLegend } from '~features/bivariate_color_manager/components/MiniLegend/MiniLegend';
import { invertClusters } from '~utils/bivariate';
import { convertDirectionsArrayToLabel } from '~utils/bivariate';
import { CombinationsSublist } from './CombinationsSublist';
import s from './SentimentsCombinationsList.module.css';
import type { BivariateColorManagerData } from '~features/bivariate_color_manager/atoms/bivariateColorManagerResource';
import type { BivariateLegend } from '~core/logical_layers/types/legends';
import type {
  BivariateColorManagerDataAtomState,
  LayerSelectionInput,
} from '~features/bivariate_color_manager/atoms/bivariateColorManagerData';

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
  layersSelection: BivariateColorManagerDataAtomState['layersSelection'];
  setSelectedRows: (key: string) => void;
  selectedRows: BivariateColorManagerDataAtomState['selectedRows'];
  anyFilterActivated: boolean;
};

const sortDescendingByMaps = sortByKey<Row>('maps', 'desc');

const columns = [
  { title: core.i18n.t('legend'), className: s.centered },
  { title: core.i18n.t('maps'), className: s.centered },
  { title: core.i18n.t('vertical_direction') },
  { title: core.i18n.t('horizontal_direction') },
];

const SentimentsCombinationsList = memo(
  ({
    data,
    setLayersSelection,
    layersSelection,
    setSelectedRows,
    selectedRows,
    anyFilterActivated = false,
  }: SentimentsCombinationsListProps) => {
    const rows: Row[] = Object.entries(data || {})
      .map(([key, value]) => {
        const { maps, legend } = value;
        const keyParsed = JSON.parse(key);
        const verticalLabel = convertDirectionsArrayToLabel(keyParsed.vertical);
        const horizontalLabel = convertDirectionsArrayToLabel(keyParsed.horizontal);

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
          {rows.length === 0
            ? showEmptyResultsTable(anyFilterActivated)
            : rows.map(({ key, legend, maps, verticalLabel, horizontalLabel }) => {
                const rowSelected = selectedRows[key];
                const selectRow = () => setSelectedRows(key);

                let layersSelectionData;
                if (layersSelection?.key === key) layersSelectionData = layersSelection;

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
                              legendSteps={invertClusters(legend.steps, 'label')}
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

const showEmptyResultsTable = (anyFilterActivated: boolean) => (
  <tr className={s.emptyResults}>
    <td width="100%">
      {anyFilterActivated ? (
        <>
          <EyeOff24 />
          {core.i18n.t('bivariate.color_manager.no_legends')}
        </>
      ) : (
        core.i18n.t('bivariate.color_manager.no_data')
      )}
    </td>
  </tr>
);

SentimentsCombinationsList.displayName = 'SentimentsCombinationsList';

export { SentimentsCombinationsList };

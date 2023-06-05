import { useAtom } from '@reatom/react';
import { Heading } from '@konturio/ui-kit';
import { useVirtual } from 'react-virtual';
import { useRef } from 'react';
import { i18n } from '~core/localization';
import { currentReportAtom } from '../../atoms/reportResource';
import { tableAtom } from '../../atoms/tableAtom';
import sortIcon from '../../icons/sort_triangle.svg';
import styles from './ReportTable.module.css';
import { TableCell } from './TableCell';
import { PREFIX } from './constants';

export function ReportTable() {
  const [{ data, thead, ascending, sortIndex, isSorting }, { sortBy, setState }] =
    useAtom(tableAtom);
  const [meta] = useAtom(currentReportAtom);

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const { virtualItems: virtualRows, totalSize } = useVirtual({
    parentRef: tableContainerRef,
    size: data?.length ?? 0,
    overscan: 10,
  });

  if (data === null) {
    return <Heading type="heading-01">{i18n.t('reports.no_data')}</Heading>;
  }

  if (isSorting) {
    return <Heading type="heading-01">{i18n.t('reports.sorting')}</Heading>;
  }

  return (
    <div ref={tableContainerRef}>
      <table>
        <thead>
          <tr>
            {thead?.map((title, i) => {
              if (!meta?.sortable) return <th key={title}>{title}</th>;
              function onClick() {
                sortBy(title);
              }
              function cName() {
                if (!meta?.sortable) return styles.noSort;
                if (sortIndex === i && ascending)
                  return styles.sortIcon + ' ' + styles.ascending;
                if (sortIndex === i && ascending === false)
                  return styles.sortIcon + ' ' + styles.descending;
                return styles.sortIcon + ' ' + styles.defaultSort;
              }
              return (
                <th key={title} onClick={onClick} className={cName()}>
                  <span className={styles.columnTitle}>{title}</span>
                  <img src={sortIcon} alt={i18n.t('sort_icon')} />
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {virtualRows.map((virtualRow) => {
            const rowIndex = virtualRow.index;
            const row = data![rowIndex];
            return (
              <tr
                key={row[0] + 'row' + rowIndex}
                className={row[0].startsWith(PREFIX.subRow) ? styles.subRow : ''}
              >
                {row.map((cell, cellIndex) => (
                  <TableCell
                    key={row[0] + 'cell' + cellIndex}
                    cell={
                      cell.startsWith(PREFIX.subRow)
                        ? cell.substring(PREFIX.subRow.length)
                        : cell
                    }
                  />
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

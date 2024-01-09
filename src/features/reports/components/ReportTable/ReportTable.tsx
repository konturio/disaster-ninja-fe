import { useAtom } from '@reatom/react-v2';
import { Heading } from '@konturio/ui-kit';
import { memo, useEffect, useRef, useState, useTransition } from 'react';
import { i18n } from '~core/localization';
import { currentReportAtom } from '../../atoms/reportResource';
import { tableAtom } from '../../atoms/tableAtom';
import sortIcon from '../../icons/sort_triangle.svg';
import styles from './ReportTable.module.css';
import { TableCell } from './TableCell';
import { PREFIX } from './constants';

const Rows = memo(function Rows({ rows }: { rows: Array<any> }) {
  return (
    <>
      {rows.map((row, rowIndex) => {
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
    </>
  );
});

export function ReportTable() {
  const [{ data, thead, ascending, sortIndex, isSorting }, { sortBy, setState }] =
    useAtom(tableAtom);
  const [meta] = useAtom(currentReportAtom);

  const [isPending, startTransition] = useTransition();
  const [dataStream, setDataStream] = useState<string[][]>([]);
  const dataRef = useRef(data);
  const pointerRef = useRef(0);
  useEffect(() => {
    if (!data || data.length === 0) {
      dataRef.current = data;
      pointerRef.current = 0;
      startTransition(() => {
        setDataStream([]);
      });
      return;
    }
    if (data !== dataRef.current) {
      // Data changed
      dataRef.current = data;
      pointerRef.current = 0;
    }

    if (!isPending && pointerRef.current < data.length) {
      const sliceSize = 10;
      const slice = data.slice(0, pointerRef.current + sliceSize);
      pointerRef.current += sliceSize;
      startTransition(() => {
        setDataStream(slice);
      });
    }
  }, [data, isPending, dataStream]);

  const tableContainerRef = useRef<HTMLDivElement>(null);

  if (data === null || data === undefined) {
    return <Heading type="heading-01">{i18n.t('reports.no_data')}</Heading>;
  }

  if (isSorting) {
    return <Heading type="heading-01">{i18n.t('reports.sorting')}</Heading>;
  }

  return (
    <div ref={tableContainerRef}>
      <div style={{ opacity: dataStream.length !== data.length ? 1 : 0 }}>
        {`${dataStream.length} / ${data.length} rows loaded`}
      </div>
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
          <Rows rows={dataStream ?? []} />
        </tbody>
      </table>
    </div>
  );
}

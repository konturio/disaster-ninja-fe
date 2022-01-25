import { useEffect, useMemo } from 'react';
import { useAtom } from '@reatom/react';
import { tableAtom } from '../../atoms/tableAtom';
import clsx from 'clsx';
import i18next from 'i18next';
import styles from './ReportTable.module.css';
import sortIcon from '../../icons/sort_triangle.svg';
import { TableCell } from './TableCell';
import { InconsistsTableCell } from './InconsistsTableCell';

function jOSMRedirect(
  e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  link: string,
) {
  e.preventDefault();
  fetch(link, { method: 'GET' });
}

function openOSMID(
  e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  link: string,
) {
  e.preventDefault();
  window.open(link);
}

export function ReportTable() {
  const [{ data, thead, ascending, sortIndex, meta }, { sortBy, setState }] =
    useAtom(tableAtom);

  useEffect(() => {
    return () => {
      setState({ meta: null, sortIndex: 0, ascending: null });
    };
  }, []);

  const tableBody = useMemo(() => {
    const OSMIdIndex = thead?.findIndex(
      (val) => val.toUpperCase() === 'OSM ID',
    );
    if (OSMIdIndex === undefined || OSMIdIndex == -1) {
      console.error(`Can't find OSMIdIndex`);
      return null;
    }
    if (!data?.length || !thead) return null;

    if (meta?.id === 'osm_population_inconsistencies') {
      const nameI = thead?.findIndex((val) => val === 'Name');

      function cName(row: string[], i: number) {
        if (!row[nameI].includes(' -')) return styles.headingRow;
        if (i % 2) return styles.evenRow;
      }

      return (
        <tbody>
          {data.map((row, rowIndex) => {
            const OSMId = row[OSMIdIndex];
            return (
              <tr
                key={row[0] + 'row' + rowIndex}
                className={cName(row, rowIndex)}
              >
                {row.map((cell, cellIndex) => (
                  <InconsistsTableCell
                    key={row[0] + 'cell' + cellIndex + rowIndex}
                    row={row}
                    cell={cell}
                    index={cellIndex}
                    jOSMRedirect={jOSMRedirect}
                    openOSMID={openOSMID}
                    meta={meta}
                    thead={thead}
                    cName={styles.inconsistencesName}
                    nested={styles.nested}
                    OSMId={OSMId}
                  />
                ))}
              </tr>
            );
          })}
        </tbody>
      );
    }

    return (
      <tbody>
        {data.map((row, rowIndex) => {
          const OSMId = row[OSMIdIndex];
          return (
            <tr
              key={row[0] + 'row' + rowIndex}
              className={clsx(styles.regularRow)}
            >
              {row.map((cell, cellIndex) => (
                <TableCell
                  key={row[0] + 'cell' + cellIndex}
                  row={row}
                  cell={cell}
                  index={cellIndex}
                  jOSMRedirect={jOSMRedirect}
                  openOSMID={openOSMID}
                  meta={meta}
                  thead={thead}
                  OSMId={OSMId}
                  OSMIdIndex={OSMIdIndex}
                />
              ))}
            </tr>
          );
        })}
      </tbody>
    );
  }, [data, thead, ascending, sortIndex]);

  return (
    <div>
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
                  <img src={sortIcon} alt={i18next.t('sort icon')} />
                </th>
              );
            })}
          </tr>
        </thead>

        {/* render if not inconsistancies */}
        {tableBody}
      </table>
    </div>
  );
}

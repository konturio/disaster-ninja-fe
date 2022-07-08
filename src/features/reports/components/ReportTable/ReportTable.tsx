import { useEffect } from 'react';
import { useAtom } from '@reatom/react';
import i18next from 'i18next';
import { Text } from '@konturio/ui-kit';
import { currentReportAtom } from '~features/reports/atoms/reportResource';
import { i18n } from '~core/localization';
import { tableAtom } from '../../atoms/tableAtom';
import sortIcon from '../../icons/sort_triangle.svg';
import styles from './ReportTable.module.css';
import { TableCell } from './TableCell';

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
  const [{ data, thead, ascending, sortIndex }, { sortBy, setState }] =
    useAtom(tableAtom);
  const [meta] = useAtom(currentReportAtom);

  useEffect(() => {
    return () => {
      setState({ sortIndex: 0, ascending: null });
    };
  }, []);

  if (data === null) {
    return <Text type="heading-xl">{i18n.t('No data for this report')}</Text>;
  }

  if (data === 'sorting') {
    return <Text type="heading-xl">{i18n.t('Sorting data...')}</Text>;
  }

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

        <tbody>
          {data?.map((row, rowIndex) => {
            return (
              <tr
                key={row[0] + 'row' + rowIndex}
                className={row[0].startsWith('subrow_') ? styles.subRow : ''}
              >
                {row.map((cell, cellIndex) => (
                  <TableCell
                    key={row[0] + 'cell' + cellIndex}
                    cell={cell}
                    jOSMRedirect={jOSMRedirect}
                    openOSMID={openOSMID}
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

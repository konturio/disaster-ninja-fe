import { useAtom } from '@reatom/react';
import { limit, tableAtom } from '../../atoms/tableAtom';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import i18next from 'i18next';
import commonStyles from '../ReportsList/ReportsList.module.css';
import styles from './ReportTable.module.css';
import sortIcon from '../../icons/sort_triangle.svg';

export function ReportTable() {
  const [
    { data, thead, ascending, sortIndex, meta },
    { sortBy, setState, addLimit },
  ] = useAtom(tableAtom);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    function listener(e: Event) {
      const t = e.target as HTMLElement;
      if (t.scrollHeight - t.scrollTop < t.clientHeight + 200 && !pending) {
        setPending(true);
        addLimit(() => setPending(false));
      }
    }
    document
      .getElementsByTagName('body')[0]
      .addEventListener('scroll', listener);

    return () => {
      setState({ meta: null, ascending: false, sortIndex: 0, limit });
      document
        .getElementsByTagName('body')[0]
        .removeEventListener('scroll', listener);
    };
  }, []);

  if (!data?.length || !thead) return null;

  function bodyRow(row: string[], i: number) {
    function jOSMRedirect(
      e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
      link: string,
    ) {
      e.preventDefault();
      fetch(link, { method: 'GET' });
    }

    if (meta?.id === 'osm_population_inconsistencies') {
      const nameI = thead?.findIndex((val) => val === 'Name')!;
      let padded = false;
      const cName = (function () {
        if (!row[nameI].includes(' -')) return styles.headingRow;
        else padded = true;
        if (i % 2) return styles.evenRow;
      })();

      return (
        <tr key={row[0]} className={cName}>
          {row.map((value, i) => {
            if (!thead) return null;
            if (thead[i] === 'OSM ID')
              return (
                <td key={row[0] + value + i + Math.random()}>
                  <a
                    href={meta?.column_link_templates[0]['OSM ID']?.replace(
                      '{{OSM ID}}',
                      value,
                    )}
                  >
                    {value}
                  </a>
                </td>
              );
            if (thead[i] === 'Name') {
              const link = meta?.column_link_templates[1]['Name'].replace(
                '{{OSM ID}}',
                row[0],
              );
              return (
                <td
                  key={row[0] + value + i + Math.random()}
                  className={clsx(
                    padded && styles.paddedRow,
                    styles.inconsistencesName,
                  )}
                >
                  <a onClick={(e) => jOSMRedirect(e, link)} href={link}>
                    {value.replace('-', '')}
                  </a>
                </td>
              );
            }
            return (
              <td key={row[0] + value + i + Math.random()}>{value || '-'}</td>
            );
          })}
        </tr>
      );
    }

    return (
      <tr key={row[0]} className={clsx(styles.regularRow)}>
        {row.map((value, i) => {
          if (!thead) return null;
          if (thead[i].toUpperCase() === 'OSM ID')
            return (
              <td key={row[0] + value + i}>
                <a
                  href={meta?.column_link_templates[0]['OSM ID']?.replace(
                    '{{OSM ID}}',
                    value,
                  )}
                >
                  {value}
                </a>
              </td>
            );
          if (thead[i] === 'OSM name') {
            const link = meta?.column_link_templates[1]['OSM name'].replace(
              '{{OSM ID}}',
              row[0],
            );
            return (
              <td key={row[0] + value + i}>
                <a onClick={(e) => jOSMRedirect(e, link)} href={link}>
                  {value}
                </a>
              </td>
            );
          }
          if (thead[i] === 'Name') {
            const link = meta?.column_link_templates[1]['Name'].replace(
              '{{OSM ID}}',
              row[0],
            );
            return (
              <td key={row[0] + value + i}>
                <a onClick={(e) => jOSMRedirect(e, link)} href={link}>
                  {value}
                </a>
              </td>
            );
          }
          return <td key={row[0] + value + i}>{value || '-'}</td>;
        })}
      </tr>
    );
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
          {data.map((row, i) => {
            if (!i) return null;
            return bodyRow(row, i);
          })}
        </tbody>
      </table>
    </div>
  );
}

import { memo, useCallback } from 'react';
import { Report } from '~features/reports/atoms/reportsAtom';
import { TranslationService as i18n } from '~core/localization';
import jOSMLogo from '~features/reports/icons/JOSM.svg';

type TableCellProps = {
  row: string[];
  cell: string;
  index: number;
  jOSMRedirect: (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    link: string,
  ) => void;
  openOSMID: (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    link: string,
  ) => void;
  thead: string[] | undefined;
  meta: Report | null;
};

export function TableCellComponent({
  row,
  cell,
  index,
  jOSMRedirect,
  openOSMID,
  thead,
  meta,
}: TableCellProps) {
  const getIDLink = useCallback(
    () => meta?.column_link_templates[0]['OSM ID']?.replace('{{OSM ID}}', cell),
    [cell, meta],
  );

  const getNameLink = useCallback(
    (toReplace: string) =>
      meta?.column_link_templates[1][toReplace]?.replace('{{OSM ID}}', row[0]),
    [row, cell, meta],
  );

  if (!thead) return null;

  if (thead[index].toUpperCase() === 'OSM ID') {
    const link = getIDLink();
    return (
      <td>{link ? <a onClick={(e) => openOSMID(e, link)}>{cell}</a> : cell}</td>
    );
  }
  if (thead[index] === 'OSM name') {
    const link = getNameLink('OSM name');
    return (
      <td>
        <a onClick={(e) => jOSMRedirect(e, link)} href={link} title={i18n.t('Open via JOSM remote control')}>
          <img src={jOSMLogo} alt={i18n.t('JOSM logo')} />
          {cell}
        </a>
      </td>
    );
  }
  if (thead[index] === 'Name') {
    const link = getNameLink('Name');
    return (
      <td>
        <a onClick={(e) => jOSMRedirect(e, link)} href={link} title={i18n.t('Open via JOSM remote control')}>
          <img src={jOSMLogo} alt={i18n.t('JOSM logo')} />
          {cell}
        </a>
      </td>
    );
  }
  return <td>{cell || '-'}</td>;
}
export const TableCell = memo(TableCellComponent);

import { memo, useCallback } from 'react';
import { Report } from '~features/reports/atoms/reportsAtom';
import { TranslationService as i18n } from '~core/localization';
import jOSMLogo from '~features/reports/icons/JOSM.svg';

type InconsistsTableCellProps = {
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
  cName: string;
  nested: string;
};

function InconsistsTableCellComponent({
  row,
  cell,
  index,
  jOSMRedirect,
  openOSMID,
  thead,
  meta,
  cName,
  nested,
}: InconsistsTableCellProps) {
  const getLink = useCallback(
    (index: number, toReplace: string, replacer: string) =>
      meta?.column_link_templates[index][toReplace].replace(
        '{{OSM ID}}',
        replacer,
      ),
    [row, cell, meta],
  );

  if (!thead) return null;
  if (thead[index] === 'OSM ID') {
    const link = getLink(0, 'OSM ID', cell);
    return (
      <td>
        <a href={link} onClick={(e) => openOSMID(e, link)}>
          {cell}
        </a>
      </td>
    );
  }
  if (thead[index] === 'Name') {
    const link = getLink(1, 'Name', row[0]);

    // CASE it's nested
    if (cell.startsWith(' - ')) return (
      <td className={`${cName} ${nested}`}>
        <a onClick={(e) => jOSMRedirect(e, link)} href={link} title={i18n.t('Open via JOSM remote control')}>
          {'   '}
          <img src={jOSMLogo} alt={i18n.t('JOSM logo')} />
          {cell.replace(' - ', '')}
        </a>
      </td>
    );
    return (
      <td className={cName}>
        <a onClick={(e) => jOSMRedirect(e, link)} href={link} title={i18n.t('Open via JOSM remote control')}>
          <img src={jOSMLogo} alt={i18n.t('JOSM logo')} />
          {cell}
        </a>
      </td>
    );
  }
  return <td>{cell || '-'}</td>;
}
export const InconsistsTableCell = memo(InconsistsTableCellComponent);

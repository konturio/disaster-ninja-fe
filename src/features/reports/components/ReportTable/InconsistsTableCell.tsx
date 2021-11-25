import { memo, useCallback } from 'react';
import { Report } from '~features/reports/atoms/reportsAtom';

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
    return (
      <td className={cName}>
        <a onClick={(e) => jOSMRedirect(e, link)} href={link}>
          {cell.replace('-', '')}
        </a>
      </td>
    );
  }
  return <td>{cell || '-'}</td>;
}
export const InconsistsTableCell = memo(InconsistsTableCellComponent);

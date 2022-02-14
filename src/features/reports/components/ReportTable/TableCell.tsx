import { memo } from 'react';
import { TranslationService as i18n } from '~core/localization';
import jOSMLogo from '~features/reports/icons/JOSM.svg';
import styles from './ReportTable.module.css';

type TableCellProps = {
  cell: string;
  jOSMRedirect: (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    link: string,
  ) => void;
  openOSMID: (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    link: string,
  ) => void;
};

export function TableCellComponent({
  cell,
  jOSMRedirect,
  openOSMID,
}: TableCellProps) {
  if (cell.startsWith('subrow_')) cell = cell.substring(7);

  if (cell.startsWith('hrefIcon_')) {
    // eslint-disable-next-line
    let [, name, link] = cell.split(/\[([^\[\]]*)\]\((http.*?)\)/);
    let cName = '';
    if (name.startsWith('tab_')) {
      cName = styles.nested;
      name = name.substring(4);
    }
    return (
      <td className={cName}>
        <a
          onClick={(e) => jOSMRedirect(e, link)}
          href={link}
          title={i18n.t('Open via JOSM remote control')}
        >
          <img src={jOSMLogo} alt={i18n.t('JOSM logo')} /> {name}
        </a>
      </td>
    );
  }

  if (cell.startsWith('href_')) {
    // eslint-disable-next-line
    let [, name, link] = cell.split(/\[([^\[\]]*)\]\((http.*?)\)/);
    let cName = '';
    if (name.startsWith('tab_')) {
      cName = styles.nested;
      name = name.substring(4);
    }
    return (
      <td className={cName}>
        {link ? <a onClick={(e) => openOSMID(e, link)}>{name}</a> : name}
      </td>
    );
  }

  return (
    <td className={cell.startsWith('tab_') ? styles.nested : ''}>
      {cell ? (cell.startsWith('tab_') ? cell.substring(4) : cell) : '-'}
    </td>
  );
}
export const TableCell = memo(TableCellComponent);

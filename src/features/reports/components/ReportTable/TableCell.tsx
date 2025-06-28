import cn from 'clsx';
import { memo } from 'react';
import { i18n } from '~core/localization';
import jOSMLogo from '~features/reports/icons/JOSM.svg';
import styles from './ReportTable.module.css';
import { PREFIX } from './constants';

/* This method must redirect user to application. Used for JOSM links */
function sendRequest(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, link: string) {
  e.preventDefault();
  window.open(link, '_blank')?.focus();
}

const mdLinks = /(\w+)_\[([^\]]+)\]\((https?:\/\/[\w\d:./?=/#/\-&_]+)\)/gm;
type ParsedCell = { before: string; prefix?: string; text?: string; link?: string };
function parseCell(raw: string) {
  const matches = raw.matchAll(mdLinks);
  const result = new Array<ParsedCell>();
  let pointer = 0;
  for (const match of matches) {
    const [whole, prefix, text, link] = match;
    if (match.input) {
      const before = match.input.slice(pointer, match.index ?? 0);
      pointer = (match.index ?? 0) + whole.length;
      result.push({
        before,
        prefix: prefix + '_',
        text,
        link,
      });
    }
  }
  return result.length === 0
    ? [
        {
          before: raw,
        },
      ]
    : result;
}

type TableCellProps = {
  cell: string;
};

function extractTabPrefix(chunks: ParsedCell[]) {
  if (!chunks[0]) return false;
  return (
    (chunks[0].before.startsWith(PREFIX.tab)
      ? ((chunks[0].before = chunks[0].before.substring(PREFIX.tab.length)), true)
      : false) ||
    (chunks[0].text?.startsWith(PREFIX.tab)
      ? ((chunks[0].text = chunks[0].text.substring(PREFIX.tab.length)), true)
      : false)
  );
}

export function TableCellComponent({ cell }: TableCellProps) {
  const chunks = parseCell(cell);
  /* Legacy support - if whole string or first link starts from "tab_" - add nested style */
  const isTab = extractTabPrefix(chunks);

  return (
    <td className={cn({ [styles.nested]: isTab })}>
      {chunks.map((ch) => {
        const hasHrefIcon = ch.prefix?.includes(PREFIX.hrefIcon) ?? false;
        const isJosmLink = hasHrefIcon;
        return (
          <span key={ch.link ?? ch.before} className={styles.cell}>
            <span>{ch.before}</span>
            {hasHrefIcon && <img src={jOSMLogo} alt={i18n.t('reports.josm_logo_alt')} />}
            {ch.link ? (
              <a
                title={isJosmLink ? i18n.t('reports.open_josm') : ''}
                href={!isJosmLink ? ch.link : '#'}
                target={isJosmLink ? undefined : '_blank'}
                rel="noreferrer"
                onClick={isJosmLink ? (e) => sendRequest(e, ch.link!) : undefined}
              >
                {ch.text ?? '-'}
              </a>
            ) : (
              (ch.text ?? '')
            )}
          </span>
        );
      })}
    </td>
  );
}

export const TableCell = memo(TableCellComponent);

import clsx from 'clsx';
import { CORNER_POINTS_INDEXES } from '~components/BivariateLegend/const';
import s from './MiniLegend.module.css';
import type { ColorTheme } from '~core/types';
import type { CSSProperties } from 'react';

export type MiniLegendProps = {
  legend: ColorTheme;
  changes?: { [key: string]: { color?: string } };
};

export const MiniLegend = ({ legend, changes = {} }: MiniLegendProps) => {
  const corners = CORNER_POINTS_INDEXES.map((corner) => legend[corner]);
  const changesHasUndefinedColor = Object.values(changes).some(
    ({ color }) => !color,
  );
  return (
    <div className={clsx(s.LegendGrid)}>
      {corners.map((cell) => {
        let cellColor: string | undefined = cell.color;
        let changed = false;
        let cellBorderClass: string | undefined;
        let style: CSSProperties | undefined;

        if (changes[cell.id]) {
          changed = true;
          const nextColor = changes[cell.id]?.color;
          cellColor = nextColor;
          cellBorderClass = nextColor
            ? s.LegendGridCellChanged
            : s.LegendGridCellUndefinedChanged;
        }

        if (cellColor) style = { backgroundColor: cellColor };

        return (
          <div
            key={cell.id}
            className={clsx(s.LegendGridCell, cellBorderClass)}
            style={style}
          >
            {changed && <div className={clsx(s.CircleIndicator)} />}
          </div>
        );
      })}

      {changesHasUndefinedColor && (
        <div className={clsx(s.UndefinedColorsIndicator)}>
          <AlarmIcon />
        </div>
      )}
    </div>
  );
};

const AlarmIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <circle cx="10" cy="10" r="10" fill="white" />
    <path
      d="M10 3C6.13438 3 3 6.13438 3 10C3 13.8656 6.13438 17 10 17C13.8656 17 17 13.8656 17 10C17 6.13438 13.8656 3 10 3ZM10 15.8125C6.79063 15.8125 4.1875 13.2094 4.1875 10C4.1875 6.79063 6.79063 4.1875 10 4.1875C13.2094 4.1875 15.8125 6.79063 15.8125 10C15.8125 13.2094 13.2094 15.8125 10 15.8125Z"
      fill="#F5222D"
    />
    <path
      d="M9.25 12.75C9.25 12.9489 9.32902 13.1397 9.46967 13.2803C9.61032 13.421 9.80109 13.5 10 13.5C10.1989 13.5 10.3897 13.421 10.5303 13.2803C10.671 13.1397 10.75 12.9489 10.75 12.75C10.75 12.5511 10.671 12.3603 10.5303 12.2197C10.3897 12.079 10.1989 12 10 12C9.80109 12 9.61032 12.079 9.46967 12.2197C9.32902 12.3603 9.25 12.5511 9.25 12.75ZM9.625 11H10.375C10.4438 11 10.5 10.9438 10.5 10.875V6.625C10.5 6.55625 10.4438 6.5 10.375 6.5H9.625C9.55625 6.5 9.5 6.55625 9.5 6.625V10.875C9.5 10.9438 9.55625 11 9.625 11Z"
      fill="#F5222D"
    />
  </svg>
);

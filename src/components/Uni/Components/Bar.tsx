import clsx from 'clsx';
import s from './Bar.module.css';

export type StackedProgressBarItem = {
  title: string;
  value: number;
  color?: string;
};

type StackedProgressBarProps = {
  value: StackedProgressBarItem[];
  caption?: string;
  className?: string;
};

/**
 * Renders a stacked progress bar where each bar segment is individually sized and aligned from the start (0%).
 * The segments are layered visually according to their value.
 *
 * @param {object} props - The component props.
 * @param {StackedProgressBarItem[]} props.value - An array of items, where each item represents a segment of the bar.
 *   Each item requires a `value` (number 0-100) determining its width, and a `title` (string) for the description.
 *   An optional `color` (string) can set the background color of the bar segment and the text color in the description.
 * @param {string} [props.caption] - An optional text caption displayed above the bar.
 */
export function StackedProgressBar({
  value: items,
  caption,
  className,
}: StackedProgressBarProps) {
  return (
    <div className={clsx(s.progress, className)}>
      {caption && <div className={s.caption}>{caption}</div>}
      <div className={s.stack}>
        {items
          .map(({ color, value }, i) => {
            const style = {};
            if (color) style['backgroundColor'] = color;
            const clampedValue = Math.max(0, Math.min(100, value));
            style['width'] = clampedValue + '%;';
            return <div key={i} style={style} />;
          })
          .reverse()}
      </div>
      <div className={s.desc}>
        {items.map(({ color, title, value }, i) => {
          const style = {};
          if (color) style['color'] = color;
          return (
            <div key={i} style={style}>
              {value + title}
            </div>
          );
        })}
      </div>
    </div>
  );
}

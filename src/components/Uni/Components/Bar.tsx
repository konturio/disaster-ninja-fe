import s from './Bar.module.css';

export type StackedProgressBarItem = {
  title: string;
  value: number;
  color?: string;
};

type StackedProgressBarProps = {
  value: StackedProgressBarItem[];
  caption?: string;
};

export function StackedProgressBar({ value: items, caption }: StackedProgressBarProps) {
  return (
    <div className={s.progress}>
      {caption && <div className={s.caption}>{caption}</div>}
      <div className={s.stack}>
        {items
          .map(({ color, value }, i) => {
            const style = {};
            if (color) style['backgroundColor'] = color;
            style['width'] = value + '%';
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

import s from './Progress.module.css';

type ProgressItem = {
  title: string;
  value: number;
  color: string;
};

type ProgressProps = {
  caption?: string;
  items: ProgressItem[];
};

export function Progress({ caption, items }: ProgressProps) {
  return (
    <div className={s.progress}>
      {caption && <div className={s.caption}>{caption}</div>}
      <div className={s.stack}>
        {items
          .map(({ color, title, value }, i) => {
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

import s from './Label.module.css';

type LabelItem = {
  value: string;
  color?: string;
  backgroundColor?: string;
};

export function Label({ items }: { items: LabelItem[] }) {
  return (
    <div className={s.labelsList}>
      {items.map(({ value, color, backgroundColor }, i) => {
        const style = {};
        if (color) style['color'] = color;
        if (backgroundColor) style['backgroundColor'] = backgroundColor;
        return (
          <div key={i} style={style}>
            {value}
          </div>
        );
      })}
    </div>
  );
}

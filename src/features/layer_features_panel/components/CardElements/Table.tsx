import s from './Table.module.css';
export function Table(props: { rows: string[][] }) {
  const { rows } = props;
  return (
    <div className={s.table}>
      {rows.map((row, i) => (
        <div key={i}>
          {row.map((r, ri) => (
            <div key={ri}>{r}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

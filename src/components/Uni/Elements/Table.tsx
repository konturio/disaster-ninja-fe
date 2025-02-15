import s from './Table.module.css';

export interface TableProps {
  value: string[][];
}

export function Table({ value: rows }: TableProps) {
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

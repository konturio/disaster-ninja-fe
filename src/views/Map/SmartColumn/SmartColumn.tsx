import { useRef, useLayoutEffect, useState } from 'react';
import { ColumnContext, Resizer } from './columnContext';
import s from './SmartColumn.module.css';

export function SmartColumn({ children }) {
  const columnRef = useRef<null | HTMLDivElement>(null);
  const limiterRef = useRef<null | HTMLDivElement>(null);

  const [resizer, setResizer] = useState<Resizer | null>(null);

  useLayoutEffect(() => {
    const resizer = new Resizer(columnRef, limiterRef);
    setResizer(resizer);
    return () => resizer.destroy();
  }, [setResizer]);
  return (
    <div className={s.smartColumn} ref={limiterRef}>
      <div className={s.smartColumnContent} ref={columnRef}>
        {resizer && (
          <ColumnContext.Provider value={resizer}>{children}</ColumnContext.Provider>
        )}
      </div>
    </div>
  );
}

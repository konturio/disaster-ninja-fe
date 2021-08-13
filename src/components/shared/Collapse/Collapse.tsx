import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './Collapse.module.css';

interface CollapseProps {
  className?: string;
  location?: 'left' | 'right' | 'bottom';
  children: React.ReactNode;
}

const Collapse = ({
  className,
  location = 'right',
  children,
}: CollapseProps) => {
  const [state, setState] = useState<{ open: boolean; title: string }>({
    open: document.body.clientWidth > 600,
    title: 'Click to collapse panel',
  });
  const onClickHandle = () => {
    if (state.open) {
      setState({ open: false, title: 'Expand panel back' });
    } else {
      setState({ open: true, title: 'Click to collapse panel' });
    }
  };

  return (
    <div
      className={clsx({
        [className || '']: className,
        [styles.root]: true,
        [styles.right]: location === 'right',
        [styles.left]: location === 'left',
        [styles.bottom]: location === 'bottom',
        [styles.hidden]: !state.open,
      })}
    >
      {children}
      <button
        type="button"
        className={styles.hideBtn}
        onClick={onClickHandle}
        title={state.title}
      >
        <svg
          className={styles.icon}
          width="10"
          height="9"
          viewBox="0 0 10 9"
          fill="none"
        >
          <path
            d="M1 4C0.723858 4 0.5 4.22386 0.5 4.5C0.5 4.77614 0.723858 5 1 5L1 4ZM9.85355 4.85355C10.0488 4.65829 10.0488 4.34171 9.85355 4.14645L6.67157 0.964467C6.47631 0.769205 6.15973 0.769205 5.96447 0.964467C5.7692 1.15973 5.7692 1.47631 5.96447 1.67157L8.79289 4.5L5.96447 7.32843C5.7692 7.52369 5.7692 7.84027 5.96447 8.03553C6.15973 8.2308 6.47631 8.2308 6.67157 8.03553L9.85355 4.85355ZM1 5L9.5 5L9.5 4L1 4L1 5Z"
            fill="white"
          />
        </svg>
      </button>
    </div>
  );
};

export default Collapse;

import React from 'react';
import styles from './LinkBtn.module.css';

interface LinkBtnProps {
  isActive: boolean;
  onClick: () => void;
}

const LinkBtn = ({ isActive, onClick }: LinkBtnProps) => (
  <button type="button" className={styles.linkButton} onClick={onClick}>
    {isActive ? (
      <svg
        width="24"
        height="24"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13 13V16V16C13 19.3137 15.6863 22 19 22H23C26.3137 22 29 19.3137 29 16V16C29 12.6863 26.3137 10 23 10H22L20 10"
          stroke="black"
          strokeWidth="2"
        />
        <path
          d="M19 19L19 16V16C19 12.6863 16.3137 10 13 10L9 10C5.68629 10 3 12.6863 3 16V16C3 19.3137 5.68629 22 9 22L10 22H12"
          stroke="black"
          strokeWidth="2"
        />
      </svg>
    ) : (
      <svg
        width="24"
        height="24"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.5 22L8 22C4.68629 22 2 19.3137 2 16V16C2 12.6863 4.68629 10 8 10L12 10"
          stroke="black"
          strokeWidth="2"
        />
        <path
          d="M19 10L24 10C27.3137 10 30 12.6863 30 16V16C30 19.3137 27.3137 22 24 22L19.5 22"
          stroke="black"
          strokeWidth="2"
        />
      </svg>
    )}
  </button>
);

export default LinkBtn;

import React, { MouseEventHandler } from 'react';
import ActionButton from '../ActionButton/ActionButton';

interface CollapseButtonProps {
  className?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const CollapseButton = ({ className, onClick }: CollapseButtonProps) => (
  <ActionButton type="icon" className={className} onClick={onClick}>
    <svg
      className="svgIcon24"
      focusable="false"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M15.5 5H11l5 7-5 7h4.5l5-7z" />
      <path d="M8.5 5H4l5 7-5 7h4.5l5-7z" />
    </svg>
  </ActionButton>
);

export default CollapseButton;

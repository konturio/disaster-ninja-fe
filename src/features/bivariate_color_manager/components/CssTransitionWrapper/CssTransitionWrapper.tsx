import { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import s from './CssTransitionWrapper.module.css';
import type { CSSTransitionProps } from 'react-transition-group/CSSTransition';
import type { ReactNode, MutableRefObject } from 'react';

export const fadeClassNames = {
  enter: s.fadeEnter,
  enterActive: s.fadeEnterActive,
  exit: s.fadeExit,
  exitActive: s.fadeExitActive,
};

type ChildrenFunction = (ref: MutableRefObject<null>) => ReactNode;

type CSSTransitionWrapperProps = {
  children: ChildrenFunction;
} & CSSTransitionProps;

export const CSSTransitionWrapper = ({
  children,
  ...props
}: CSSTransitionWrapperProps) => {
  const nodeRef = useRef(null);

  return (
    <CSSTransition {...props} nodeRef={nodeRef}>
      {children(nodeRef)}
    </CSSTransition>
  );
};

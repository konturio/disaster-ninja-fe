import { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import s from './CssTransitionWrapper.module.css';
import type {
  LegacyRef,
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
} from 'react';
import type { CSSTransitionProps } from 'react-transition-group/CSSTransition';

export const fadeClassNames = {
  enter: s.fadeEnter,
  enterActive: s.fadeEnterActive,
  exit: s.fadeExit,
  exitActive: s.fadeExitActive,
};

type ChildrenFunction = (
  ref: LegacyRef<any>,
) => ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment;

type CSSTransitionWrapperProps = CSSTransitionProps & {
  children: ChildrenFunction;
};

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

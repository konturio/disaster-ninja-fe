import {
  type ReactNode,
  useRef,
  useEffect,
  useState,
  isValidElement,
  cloneElement,
} from 'react';
import {
  useFloating,
  offset,
  flip,
  shift,
  arrow,
  FloatingArrow,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  autoUpdate,
  type Placement,
} from '@floating-ui/react';
import s from './Overlays.module.css';

interface TooltipProps {
  content: ReactNode;
  children?: ReactNode;
  placement?: Placement;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerRef?: React.RefObject<HTMLElement>;
}

export function Tooltip({
  content,
  children,
  placement = 'top',
  isOpen: controlledOpen,
  onOpenChange,
  triggerRef,
}: TooltipProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const arrowRef = useRef(null);

  const isOpen = controlledOpen ?? uncontrolledOpen;
  const setIsOpen = onOpenChange ?? setUncontrolledOpen;

  const { x, y, strategy, refs, context } = useFloating({
    placement,
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip(), shift(), arrow({ element: arrowRef })],
  });

  const hover = useHover(context, {
    enabled: controlledOpen == null,
  });
  const focus = useFocus(context, {
    enabled: controlledOpen == null,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  // Set reference element when triggerRef is provided
  useEffect(() => {
    if (triggerRef?.current) {
      refs.setReference(triggerRef.current);
    }
  }, [triggerRef, refs]);

  return (
    <>
      {children && isValidElement(children)
        ? cloneElement(children, {
            ref: refs.setReference,
            ...getReferenceProps(),
            ...children.props,
            'data-state': isOpen ? 'open' : 'closed',
          })
        : null}
      {isOpen && (
        <FloatingPortal>
          <div
            className={s.tooltipContent}
            ref={refs.setFloating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              zIndex: 'var(--tooltip)',
            }}
            {...getFloatingProps()}
          >
            {content}
            <FloatingArrow
              ref={arrowRef}
              context={context}
              className={s.arrow}
              stroke="transparent"
              strokeWidth={2}
              height={8}
              width={16}
            />
          </div>
        </FloatingPortal>
      )}
    </>
  );
}

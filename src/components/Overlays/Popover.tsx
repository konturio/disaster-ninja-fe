import * as React from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  useMergeRefs,
  FloatingPortal,
  FloatingFocusManager,
  arrow,
  FloatingArrow,
  type Placement,
} from '@floating-ui/react';
import { Close16 } from '@konturio/default-icons';
import s from './Overlays.module.css';

interface PopoverOptions {
  initialOpen?: boolean;
  placement?: Placement;
  modal?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  virtualReference?: { x: number; y: number };
}

export function usePopover({
  initialOpen = false,
  placement = 'top',
  modal,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  virtualReference,
}: PopoverOptions = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);
  const arrowRef = React.useRef(null);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  // Virtual reference for programmatic positioning
  const virtualRef = React.useRef({
    getBoundingClientRect: () => ({
      x: virtualReference?.x ?? 0,
      y: virtualReference?.y ?? 0,
      width: 0,
      height: 0,
      top: virtualReference?.y ?? 0,
      left: virtualReference?.x ?? 0,
      right: virtualReference?.x ?? 0,
      bottom: virtualReference?.y ?? 0,
    }),
  });

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8), // match arrow height
      flip({
        crossAxis: placement.includes('-'),
        fallbackAxisSideDirection: 'end',
        padding: 5,
      }),
      shift({ crossAxis: false, padding: 0 }),
      arrow({ element: arrowRef, padding: 8 }), // Adding padding to prevent arrow from overlapping rounded corners
    ],
  });

  const context = data.context;

  const click = useClick(context, {
    enabled: controlledOpen == null && !virtualReference,
  });
  const dismiss = useDismiss(context, {
    enabled: !virtualReference, // Disable dismiss when using virtual reference
  });
  const role = useRole(context);

  const interactions = useInteractions([click, dismiss, role]);

  // Update virtual reference when coordinates change
  React.useEffect(() => {
    if (virtualReference) {
      // Update the getBoundingClientRect function with new coordinates
      virtualRef.current.getBoundingClientRect = () => ({
        x: virtualReference.x,
        y: virtualReference.y,
        width: 0,
        height: 0,
        top: virtualReference.y,
        left: virtualReference.x,
        right: virtualReference.x,
        bottom: virtualReference.y,
      });
      data.refs.setReference(virtualRef.current);
      // Force position update when virtual reference changes
      data.update();
    }
  }, [virtualReference, data.refs, data.update]);

  return React.useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      modal,
      arrowRef, // Pass arrowRef to components
      virtualReference,
    }),
    [open, setOpen, interactions, data, modal, virtualReference],
  );
}

type ContextType = ReturnType<typeof usePopover> | null;

const PopoverContext = React.createContext<ContextType>(null);

export const usePopoverContext = () => {
  const context = React.useContext(PopoverContext);

  if (context == null) {
    throw new Error('Popover components must be wrapped in <Popover />');
  }

  return context;
};

export function Popover({
  children,
  modal = false,
  ...restOptions
}: {
  children: React.ReactNode;
} & PopoverOptions) {
  // This can accept any props as options, e.g. `placement`,
  // or other positioning options.
  const popover = usePopover({ modal, ...restOptions });
  return <PopoverContext.Provider value={popover}>{children}</PopoverContext.Provider>;
}

interface PopoverTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export const PopoverTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLProps<HTMLElement> & PopoverTriggerProps
>(function PopoverTrigger({ children, asChild = false, ...props }, propRef) {
  const context = usePopoverContext();
  const childrenRef = (children as any).ref;
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

  // `asChild` allows the user to pass any element as the anchor
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children,
      context.getReferenceProps({
        ref,
        ...props,
        ...children.props,
        'data-state': context.open ? 'open' : 'closed',
      }),
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      // The user can style the trigger based on the state
      data-state={context.open ? 'open' : 'closed'}
      {...context.getReferenceProps(props)}
    >
      {children}
    </button>
  );
});

export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(function PopoverContent({ style, ...props }, propRef) {
  const { context: floatingContext, arrowRef, ...context } = usePopoverContext();
  const ref = useMergeRefs([context.refs.setFloating, propRef]);

  if (!floatingContext.open) return null;

  return (
    <FloatingPortal>
      <FloatingFocusManager context={floatingContext} modal={context.modal}>
        <div
          ref={ref}
          style={{ ...context.floatingStyles, ...style }}
          className={s.Popover}
          {...context.getFloatingProps(props)}
        >
          <PopoverClose />
          <div className={s.PopoverContent}>{props.children}</div>
          <FloatingArrow
            ref={arrowRef}
            context={floatingContext}
            className={s.PopoverArrow}
            stroke="transparent"
            strokeWidth={1}
            height={8}
            width={16}
          />
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
});

export const PopoverClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function PopoverClose(props, ref) {
  const { setOpen } = usePopoverContext();
  return (
    <button
      type="button"
      ref={ref}
      className={s.PopoverClose}
      {...props}
      onClick={(event) => {
        props.onClick?.(event);
        setOpen(false);
      }}
    >
      {props.children ?? <Close16 />}
    </button>
  );
});

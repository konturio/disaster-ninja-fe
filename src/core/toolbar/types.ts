import type { ButtonProps } from '@konturio/ui-kit/tslib/Button';
import type { PrimitiveAtom } from '@reatom/core/primitives';

export type ControlID = string;

/* Whole panel settings */
export type ToolbarSettings = {
  sections: Array<ToolbarSectionSetting>;
};

/* Section - group of toolbar controls */
export type ToolbarSectionSetting = {
  name: string;
  controls: Array<ControlID>;
};

export type ValueForState<T> = Record<ControlState, T>;

export type ToolbarControlSettings = ToolbarButtonSettings | ToolbarWidgetSettings;

interface CommonToolbarControlSettings {
  id: ControlID;
  /** Set true if control override map interactions while active (default: false) */
  borrowMapInteractions?: boolean;
  type: ControlType;
  typeSettings: Record<string, unknown>;
}

// Button
interface ToolbarButtonSettings extends CommonToolbarControlSettings {
  type: 'button';
  typeSettings: {
    name: string | ValueForState<string>;
    hint: string | ValueForState<string>;
    icon: string | ValueForState<string>;
    preferredSize: ButtonProps['size'];
    /* Only for edge cases when you need direct access to element */
    onRef?: (el: HTMLElement) => void;
  };
}

// Control button component props
export interface ControlComponentProps {
  icon: React.ReactElement;
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  active?: boolean;
  size: ButtonProps['size'];
  variant?: ButtonProps['variant'];
  className?: string;
}

// Widget
export interface WidgetProps {
  controlComponent: React.ComponentType<ControlComponentProps>;
  state: ControlState;
  onClick: () => void;
}

interface ToolbarWidgetSettings extends CommonToolbarControlSettings {
  type: 'widget';
  typeSettings: {
    component: (props: WidgetProps) => JSX.Element | null;
  };
}

export type ControlState = 'active' | 'disabled' | 'regular';
type ControlType = 'button' | 'widget';

export type OnRemoveCb = () => void;
export interface ControlController<Ctx = Record<string, unknown>> {
  // Actions
  init: () => void;
  remove: () => void;
  setState: (state: ControlState) => {
    payload: ControlState;
    type: string;
  };
  // Hooks
  onInit: (cb: (ctx: Ctx) => OnRemoveCb | void) => void;
  onStateChange: (cb: (ctx: Ctx, state: ControlState) => void) => void;
  onRemove: (cb: (ctx: Ctx) => void) => void;
  // Subscriptions
  stateStream: StateStream<ControlState>;
}

export type SetupControlAction<Ctx = Record<string, unknown>> = (
  settings: ToolbarControlSettings,
) => ControlController<Ctx>;

type SteamUnsubscribe = () => void;
export interface StateStream<T> {
  subscribe: (cb: (data: T) => void) => SteamUnsubscribe;
}

export type Toolbar<Ctx = Record<string, unknown>> = {
  setupControl: SetupControlAction<Ctx>;
  toolbarSettings: ToolbarSettings;
  controls: PrimitiveAtom<Map<ControlID, ToolbarControlSettings>>;
  getControlState: (id: ControlID) => PrimitiveAtom<ControlState> | undefined;
};

export type ToolbarControlStateAtom = PrimitiveAtom<ControlState>;

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

type ValueForState<T> = Record<ControlState, T>;

export type ToolbarControlSettings<T = Record<string, unknown>> = {
  id: ControlID;
  type: ControlType;
  onInit?: () => T;
  onStateChange: (state: ControlState, ctx: T) => void;
  onRemove?: (ctx: T) => void;
  typeSettings: {
    name: string | ValueForState<string>;
    hint: string | ValueForState<string>;
    icon: string | ValueForState<string>;
    preferredSize: 'large' | 'small' | 'medium';
    /* Only for edge cases when you need direct access to element */
    onRef?: (el: HTMLElement) => void;
  };
};

export type ControlState = 'active' | 'disabled' | 'regular';
type ControlType = 'button';
export interface ControlController {
  setState: (state: ControlState) => {
    payload: ControlState;
    type: string;
  };
  stateStream: StateStream<ControlState>;
  init: () => void;
  dispose: () => void;
}

export type SetupControlAction = <
  T extends Record<string, unknown> = Record<string, unknown>,
>(
  settings: ToolbarControlSettings<T>,
) => ControlController;

type SteamUnsubscribe = () => void;
export interface StateStream<T> {
  subscribe: (cb: (data: T) => void) => SteamUnsubscribe;
}

export interface Toolbar {
  setupControl: SetupControlAction;
  toolbarSettings: ToolbarSettings;
}

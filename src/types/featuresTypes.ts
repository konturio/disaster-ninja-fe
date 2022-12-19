export type PanelFeatureInterface = {
  header?: string;
  panelIcon?: JSX.Element;
  content?: JSX.Element | null;
  minHeight?: number;
  maxHeight?: number;
  // noShrinking?
  skipAutoResize?: boolean;
};

export type PanelFeatureInterface = {
  header?: string;
  panelIcon?: JSX.Element;
  content?: JSX.Element | null;
  minHeight?: number;
  maxHeight?: number | string;
  contentheight?: number | string;
  skipAutoResize?: boolean;
  resize?: 'vertical' | 'horizontal' | 'both' | 'none';
};

export interface IPanelFeatureComponent {
  (): PanelFeatureInterface;
}

export interface LayerFeaturesPanelConfig {
  layerId: string;
  requiresEnabledLayer?: boolean;
  maxItems?: number;
  sortOrder?: 'asc' | 'desc';
  requireGeometry?: boolean;
  showBboxFilterToggle?: boolean;
}

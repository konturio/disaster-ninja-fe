export interface LayerFeaturesPanelConfig {
  layerId: string;
  requiresEnabledLayer?: boolean;
  requiresGeometry?: boolean;
  maxItems?: number;
  sortOrder?: 'asc' | 'desc';
  showBboxFilterToggle?: boolean;
}

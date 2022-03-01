export interface LayerSettings {
  id: string;
  name: string;
  category?: 'base' | 'overlay';
  group?: string;
  boundaryRequiredForRetrieval?: boolean;
}

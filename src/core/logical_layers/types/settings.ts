export interface LayerSettings {
  id: string;
  name: string;
  category?: 'base' | 'overlay';
  group?: string;
  boundaryRequiredForRetrieval?: boolean;
  ownedByUser: boolean;
  /**
   * Optional order value used to sort layers inside a group.
   * Layers with lower values appear before those without or with higher order.
   */
  order?: number;
}

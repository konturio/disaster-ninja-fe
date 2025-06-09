export interface IMapProvider<TMap, TConfig> {
  createMap(container: HTMLElement, config: TConfig): TMap;
  supportsFeature(feature: string): boolean;
  getTypeName(): string;
}

export interface IMap {
  on(event: string, handler: (event: any) => void): void;
  off(event: string, handler: (event: any) => void): void;
  getCenter(): { lng: number; lat: number };
  getZoom(): number;
  getBounds(): { north: number; south: number; east: number; west: number };
  addLayer(layer: any, beforeId?: string): void;
  removeLayer(layerId: string): void;
  addSource(sourceId: string, source: any): void;
  removeSource(sourceId: string): void;
  getLayer(layerId: string): any;
  getSource(sourceId: string): any;
  setLayoutProperty(layerId: string, property: string, value: any): void;
  getStyle(): { layers?: any[] };
  resize(): void;
  destroy(): void;
  underlying?: any; // Access to original map instance if needed
}

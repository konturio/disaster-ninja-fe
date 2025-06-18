import { Map } from 'maplibre-gl';
import type { Map as MapLibreMap } from 'maplibre-gl';
import type { MapOptions } from 'maplibre-gl';
import type { IMapProvider, IMap } from './IMapProvider';

export class MapLibreProvider implements IMapProvider<MapLibreMap, MapOptions> {
  createMap(container: HTMLElement, config: MapOptions): MapLibreMap {
    const mapInstance = new Map({ ...config, container });

    // Set up light for extrusion layers
    mapInstance.once('styledata', () => {
      mapInstance.setLight({ anchor: 'viewport', color: '#FFF', intensity: 1 });
    });

    return mapInstance;
  }

  supportsFeature(feature: string): boolean {
    const supportedFeatures = ['rtl-text', 'terrain', 'custom-layers'];
    return supportedFeatures.includes(feature);
  }

  getTypeName(): string {
    return 'maplibre-gl';
  }
}

export class MapLibreAdapter implements IMap {
  constructor(private map: MapLibreMap) {}

  get underlying(): MapLibreMap {
    return this.map;
  }

  on(event: string, handler: (event: any) => void): void {
    this.map.on(event as any, handler as any);
  }

  off(event: string, handler: (event: any) => void): void {
    this.map.off(event as any, handler as any);
  }

  getCenter(): { lng: number; lat: number } {
    const center = this.map.getCenter();
    return { lng: center.lng, lat: center.lat };
  }

  getZoom(): number {
    return this.map.getZoom();
  }

  getBounds(): { north: number; south: number; east: number; west: number } {
    const bounds = this.map.getBounds();
    return {
      north: bounds.getNorth(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      west: bounds.getWest(),
    };
  }

  addLayer(layer: any, beforeId?: string): void {
    this.map.addLayer(layer, beforeId);
  }

  removeLayer(layerId: string): void {
    if (this.map.getLayer(layerId)) {
      this.map.removeLayer(layerId);
    }
  }

  addSource(sourceId: string, source: any): void {
    this.map.addSource(sourceId, source);
  }

  removeSource(sourceId: string): void {
    if (this.map.getSource(sourceId)) {
      this.map.removeSource(sourceId);
    }
  }

  getLayer(layerId: string): any {
    return this.map.getLayer(layerId);
  }

  getSource(sourceId: string): any {
    return this.map.getSource(sourceId);
  }

  setLayoutProperty(layerId: string, property: string, value: any): void {
    this.map.setLayoutProperty(layerId, property, value);
  }

  getStyle(): { layers?: any[] } {
    return this.map.getStyle();
  }

  resize(): void {
    this.map.resize();
  }

  destroy(): void {
    this.map.remove();
  }
}

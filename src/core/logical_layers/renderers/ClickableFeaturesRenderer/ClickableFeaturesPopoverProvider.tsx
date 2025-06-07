import { isFeatureVisible } from '../helpers/featureVisibilityCheck';
import type { IMapPopoverContentProvider, MapPopoverOptions } from '~core/map/types';
import type { MapMouseEvent } from 'maplibre-gl';
import type { LayerStyle } from '../../types/style';

/**
 * Content provider for ClickableFeaturesRenderer-based layers.
 * Works with the abstract createPopupContent method to provide registry-based popups.
 */
export class ClickableFeaturesPopoverProvider implements IMapPopoverContentProvider {
  constructor(
    private sourceId: string,
    private clickableLayerId: string,
    private style: LayerStyle,
    private createPopupContent: (
      feature: GeoJSON.Feature,
      style: LayerStyle,
    ) => React.ReactNode | null,
  ) {}

  renderContent(mapEvent: MapMouseEvent): React.ReactNode | null {
    const features = mapEvent.target
      .queryRenderedFeatures(mapEvent.point)
      .filter((f) => f.source.includes(this.sourceId));

    // Don't show popup when click in empty place
    if (!features.length || !features[0].geometry) return null;

    const feature = features.find((f) => f.layer.id === this.clickableLayerId);

    // Don't show popup when click on feature that filtered by map style
    if (!feature || !isFeatureVisible(feature)) return null;

    // Use the provided createPopupContent method to generate React content
    return this.createPopupContent(feature, this.style);
  }

  getPopoverOptions(): MapPopoverOptions {
    return {
      placement: 'top',
      closeOnMove: true,
      className: 'clickable-features-popup',
    };
  }
}

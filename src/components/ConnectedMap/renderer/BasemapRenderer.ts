import { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import type { SimpleLegend } from '~core/logical_layers/types/legends';
import { LogicalLayerDefaultRenderer } from '~core/logical_layers/renderers/DefaultRenderer';
import { LogicalLayerState } from '~core/logical_layers/types/logicalLayer';

/**
 * mapLibre have very expensive event handler with getClientRects. Sometimes it took almost ~1 second!
 * I found that if i call setLayer by requestAnimationFrame callback - UI becomes much more responsive!
 */

type BasemapRendererProps = {
  id: string;
  name?: string;
  category?: string;
  group?: string;
  description?: string;
  copyrights?: string[];
  legend?: SimpleLegend;
};
export class BasemapRenderer extends LogicalLayerDefaultRenderer {
  public readonly id: string;
  public readonly name?: string;
  public legend?: SimpleLegend;
  public readonly category?: string;
  public readonly group?: string;
  public readonly description?: string;
  public readonly copyrights?: string[];
  public isDownloadable = false;
  private _baseMapLayers: any[];
  // temporary checker for when map is rendered somewhere else
  private _wasUnmountedBefore: boolean;

  public constructor({
    id,
    legend,
    category,
    copyrights,
    description,
    group,
    name,
  }: BasemapRendererProps) {
    super();
    this.id = id;
    this.name = name;
    this.category = category;
    this.group = group;
    this.description = description;
    this.copyrights = copyrights;
    this.legend = legend;
    /* private */
    this._baseMapLayers = [];
    this._wasUnmountedBefore = false;
  }

  willInit() {
    // noop

    console.log('%c⧭', 'color: #7f2200', 'will init');
  }

  public willMount({
    map,
    state,
  }: {
    map: ApplicationMap;
    state: LogicalLayerState;
  }) {
    console.log('%c⧭ willMount', 'color: #00258c', this._wasUnmountedBefore, {
      ...state,
    });
    // actual mount of basemap layers happend elsewhere
    // so let's just save basemap layers for the first call
    if (this._wasUnmountedBefore) this._restoreBaseMapLayers(map);
    else if (!this._baseMapLayers.length) {
      // TODO once api for basemaps will be created, we could change 'composite' to some custom source name
      // so we could guarantee only basemap layers will be affected
      // @ts-expect-error
      // it seems to me that map._loaded represents current map state which is needed,
      // whereas map.loaded() or map.isStyleLoaded() check allows
      // to set a callback on map.on('load') method, that will never run
      if (map._loaded) this._storeBasemapLayers(map);
      else map.on('load', () => this._storeBasemapLayers(map));
    }
  }

  public willUnMount({ map }: { map: ApplicationMap }) {
    console.log('%c⧭ willUnmount !', 'color: #e807e8');
    this._removeBaseMapLayers(map);
    this._wasUnmountedBefore = true;
  }

  willHide({ map }: { map: ApplicationMap }) {
    this._removeBaseMapLayers(map);
  }

  willUnhide({ map }: { map: ApplicationMap }) {
    this._restoreBaseMapLayers(map);
  }

  private _removeBaseMapLayers(map: ApplicationMap) {
    const mapStyle = map.getStyle();
    const customLayers = mapStyle.layers?.filter(
      (l) => 'source' in l && l.source !== 'composite',
    );
    map.setStyle({ ...mapStyle, layers: customLayers });
  }

  private _restoreBaseMapLayers(map: ApplicationMap) {
    const mapStyle = map.getStyle();
    const customLayers = mapStyle.layers || [];
    map.setStyle({
      ...mapStyle,
      layers: [...this._baseMapLayers, ...customLayers],
    });
  }

  private _storeBasemapLayers(map) {
    const baseMapLayers = map
      .getStyle()
      ?.layers?.filter((l) => 'source' in l && l.source === 'composite');
    if (!baseMapLayers) return console.error('no basemap layers received');

    this._baseMapLayers = baseMapLayers;
  }

  willDestroy({
    map,
  }: {
    map: ApplicationMap | null;
    state: LogicalLayerState;
  }) {
    if (map) this.willUnMount({ map });
  }
}

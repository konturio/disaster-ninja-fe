import { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import { EditableGeoJsonLayer } from '@nebula.gl/layers';
// import { CustomDrawPolygonMode } from '@k2-packages/map-draw-tools/tslib/customDrawModes/CustomDrawPolygonMode';
import { MapboxLayer } from '@deck.gl/mapbox';
import { LogicalLayer } from '~utils/atoms/createLogicalLayerAtom';
import { layersOrderManager } from '~core/layersOrder';
// import { handleClick } from './handleClick';
import { LocalDrawPolygonMode } from '../modes/drawPolygon';
import { DrawModeType } from '../constants';

// const drawPolygonMode = new CustomDrawPolygonMode();

// drawPolygonMode.handleClick = handleClick;

type MountedLayersType = {
  [key in DrawModeType]?: any
}

export class DrawModeLayer implements LogicalLayer {
  public readonly id: string;
  public readonly name?: string;
  public mountedLayers: MountedLayersType
  private _isMounted = false;
  private _deckLayer?: MapboxLayer<unknown>;

  public constructor(id: string, name?: string) {
    this.id = id;
    this.mountedLayers = { }
    if (name) {
      this.name = name;
    }
  }

  get isMounted(): boolean {
    return this._isMounted;
  }

  public onInit() {
    return { isVisible: true, isLoading: false, isListed: false };
  }

  willMount(map: ApplicationMap): void {
    if (!this._deckLayer) {
      const deckGLLayer = {
        id: 'draw-mode-testo-layer',
        type: EditableGeoJsonLayer,
        mode: LocalDrawPolygonMode,
        parameters: {
          depthTest: false, // skip z-buffer check
        },
        _subLayerProps: {
          tooltips: {
            // getSize: () => 20,
          },
          guides: {
            // getRadius: () => {
            //   const zoom = map.getZoom();
            //   return 20000 / (zoom * zoom);
            // },
            getFillColor: () => [0xff, 0x66, 0x00, 0xff],
            getLineWidth: () => 2,
            stroked: false,
          },
        },
        modeConfig: {
          multipoint: true,
          // turfOptions: { units: 'kilometers' },
          // formatTooltip: (distance: number) => {
          //   const km = translationService.t('km');
          //   const m = translationService.t('m');
          //   const distanceLabel =
          //     distance > 1
          //       ? `${distance.toFixed(1)} ${km}.`
          //       : `${(distance * 1000).toFixed(2)} ${m}.`;
          //   const filler = new Array(distanceLabel.length + 2).join(' ');
          //   return `${distanceLabel}${filler}`;
          // },
        },
      };

      this._deckLayer = new MapboxLayer(deckGLLayer);
    }
    const beforeId = layersOrderManager.getBeforeIdByType(this._deckLayer.type);
    // patch for hmr
    if (!map.getLayer(this._deckLayer.id)?.id)
      map.addLayer(this._deckLayer, beforeId);
    this._isMounted = true;
  }

  willUnmount(map: ApplicationMap): void {
    if (this._deckLayer) {
      map.removeLayer(this._deckLayer.id);
    }
    this._isMounted = false;
  }

  // on logic layer mount - add watch/edit deck layer mode
  addDeckLayer() { }

  removeDeckLayer() { }
  // on logic layer unmount - remove all our layers
}

import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import { MapboxLayer } from '@deck.gl/mapbox';
import { CustomMeasureDistanceMode } from '~core/draw_tools/customDrawModes/CustomMeasureDistanceMode';
import { i18n } from '~core/localization';
import { LogicalLayerDefaultRenderer } from '~core/logical_layers/renderers/DefaultRenderer';
import { layerByOrder } from '~core/logical_layers';
import { registerMapListener } from '~core/shared_state/mapListeners';
import type {
  NullableMap,
  CommonHookArgs,
  NotNullableMap,
} from '~core/logical_layers/types/renderer';

/* Add cyrillic alphabet to character set */
function getCyrillicCharacterSet() {
  // Latin + symbols
  const charSet: string[] = [];
  for (let i = 32; i <= 175; i++) {
    charSet.push(String.fromCharCode(i));
  }

  // `a`.charCodeAt() == 1040
  // `я`.charCodeAt() == 1103
  for (let i = 1040; i <= 1103; i++) {
    charSet.push(String.fromCharCode(i));
  }

  return charSet;
}

export class MapRulerRenderer extends LogicalLayerDefaultRenderer {
  public readonly id: string;
  private _deckLayer?: MapboxLayer<unknown>;
  private _removeClickListener: null | (() => void) = null;
  private _removeMousemoveListener: null | (() => void) = null;
  public constructor(id: string) {
    super();
    this.id = id;
  }

  willInit(args: NullableMap & CommonHookArgs): void {
    // noop
  }

  willMount(args: NotNullableMap & CommonHookArgs) {
    const map = args.map;
    if (!this._deckLayer) {
      // I have to use any because types expected for new MapboxLayer aren't fully correct. The config is working at the time of writing
      const deckGLLayer: any = {
        id: this.id,
        type: EditableGeoJsonLayer,
        mode: CustomMeasureDistanceMode,
        parameters: {
          depthTest: false, // skip z-buffer check
        },
        _subLayerProps: {
          tooltips: {
            characterSet: getCyrillicCharacterSet(),
            getSize: () => 20,
          },
          guides: {
            getFillColor: () => [0xff, 0x66, 0x00, 0xff],
            getLineWidth: () => 2,
            stroked: false,
            pointRadiusMinPixels: 4,
            pointRadiusMaxPixels: 4,
          },
        },
        modeConfig: {
          multipoint: true,
          turfOptions: { units: 'kilometers' },
          formatTooltip: (distance: number) => {
            const km = i18n.t('km');
            const m = i18n.t('m');
            const distanceLabel =
              distance > 1
                ? `${distance.toFixed(1)} ${km}.`
                : `${(distance * 1000).toFixed(2)} ${m}.`;
            const filler = new Array(distanceLabel.length + 2).join(' ');
            return `${distanceLabel}${filler}`;
          },
        },
      };
      this._deckLayer = new MapboxLayer(deckGLLayer);
    }

    layerByOrder(map).addAboveLayerWithSameType(this._deckLayer, this.id);
    this.addClickListener();
  }

  willUnMount(args: NotNullableMap & CommonHookArgs): void {
    if (this._deckLayer) {
      args.map.removeLayer(this._deckLayer.id);
    }
    this._removeClickListener?.();
    this._removeMousemoveListener?.();
    this._removeClickListener = null;
    this._removeMousemoveListener = null;
  }

  public addClickListener() {
    if (this._removeClickListener !== null) return;
    function preventClicking(e) {
      e.preventDefault();
      return false;
    }
    function preventMousemove(e) {
      return false;
    }
    // Use the highest priority to block map interactions from other layers
    this._removeClickListener = registerMapListener('click', preventClicking, 100);
    this._removeMousemoveListener = registerMapListener(
      'mousemove',
      preventMousemove,
      100,
    );
  }
}

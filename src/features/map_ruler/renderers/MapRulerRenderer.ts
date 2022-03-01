import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import { CustomMeasureDistanceMode } from '@k2-packages/map-draw-tools/tslib/customDrawModes/CustomMeasureDistanceMode';
import { translationService } from '~core/index';
import { MapboxLayer } from '@deck.gl/mapbox';
import { LogicalLayerDefaultRenderer } from '~core/logical_layers/renderers/DefaultRenderer';
import { layersOrderManager } from '~core/logical_layers/utils/layersOrder';
import {
  NullableMap,
  CommonHookArgs,
  NotNullableMap,
} from '~core/logical_layers/types/renderer';

// add cyrillic alphabet to character set
function getCyrillicCharacterSet() {
  const charSet: string[] = [];
  for (let i = 32; i <= 175; i++) {
    charSet.push(String.fromCharCode(i));
  }
  const cyrLettersBig =
    'А,Б,В,Г,Д,Е,Ё,Ж,З,И,Й,К,Л,М,Н,О,П,Р,С,Т,У,Ф,Х,Ц,Ч,Ш,Щ,Ъ,Ы,Ь,Э,Ю,Я';
  const cyrLettersSmall = cyrLettersBig.toLowerCase();

  return charSet
    .concat(cyrLettersBig.split(','))
    .concat(cyrLettersSmall.split(','));
}

export class MapRulerRenderer extends LogicalLayerDefaultRenderer {
  public readonly id: string;
  private _deckLayer?: MapboxLayer<unknown>;
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
            const km = translationService.t('km');
            const m = translationService.t('m');
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
    const deckLayer = this._deckLayer;
    layersOrderManager.getBeforeIdByType(this._deckLayer.type, (beforeId) => {
      map.addLayer(deckLayer, beforeId);
    });
  }

  willUnMount(args: NotNullableMap & CommonHookArgs): void {
    if (this._deckLayer) {
      args.map.removeLayer(this._deckLayer.id);
    }
  }
}

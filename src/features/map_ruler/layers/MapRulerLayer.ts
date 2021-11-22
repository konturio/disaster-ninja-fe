import { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import { CustomMeasureDistanceMode } from '@k2-packages/map-draw-tools/tslib/customDrawModes/CustomMeasureDistanceMode';
import { translationService } from '~core/index';
import { MapboxLayer } from '@deck.gl/mapbox';
import { LogicalLayer } from '~utils/atoms/createLogicalLayerAtom';

// add cyrillic alphabet to character set
function getCyryllicCharacterSet() {
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

export class MapRulerLayer implements LogicalLayer {
  public readonly id: string;
  public readonly name?: string;
  private _isMounted = false;
  private _deckLayer?: MapboxLayer<unknown>;

  public constructor(id: string, name?: string) {
    this.id = id;
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
        id: 'measure-edit-layer',
        type: EditableGeoJsonLayer,
        mode: CustomMeasureDistanceMode,
        parameters: {
          depthTest: false, // skip z-buffer check
        },
        _subLayerProps: {
          tooltips: {
            characterSet: getCyryllicCharacterSet(),
            getSize: () => 20,
          },
          guides: {
            getRadius: () => {
              const zoom = map.getZoom();
              return 20000 / (zoom * zoom);
            },
            getFillColor: () => [0xff, 0x66, 0x00, 0xff],
            getLineWidth: () => 2,
            stroked: false,
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
    map.addLayer(this._deckLayer);
    this._isMounted = true;
  }

  willUnmount(map: ApplicationMap): void {
    if (this._deckLayer) {
      map.removeLayer(this._deckLayer.id);
    }
    this._isMounted = false;
  }
}

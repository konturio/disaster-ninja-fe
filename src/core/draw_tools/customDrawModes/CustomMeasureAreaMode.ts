import turfArea from '@turf/area';
import turfCentroid from '@turf/centroid';
import { GeoJsonEditMode, utils } from '@nebula.gl/edit-modes';
import type {
  ClickEvent,
  Tooltip,
  ModeProps,
  GuideFeatureCollection,
  PointerMoveEvent,
  FeatureCollection,
  Position,
  GuideFeature,
  TentativeFeature,
} from '@nebula.gl/edit-modes';

const DEFAULT_TOOLTIPS = [];

export class CustomMeasureAreaMode extends GeoJsonEditMode {
  _isMeasuringSessionFinished = false;

  _createTentativeFeature(props: ModeProps<FeatureCollection>): TentativeFeature {
    const { lastPointerMoveEvent } = props;
    const clickSequence = this['getClickSequence']();

    const lastCoords = lastPointerMoveEvent ? [lastPointerMoveEvent.mapCoords] : [];

    let tentativeFeature;
    if (clickSequence.length === 1 || clickSequence.length === 2) {
      tentativeFeature = {
        type: 'Feature',
        properties: {
          guideType: 'tentative',
        },
        geometry: {
          type: 'LineString',
          coordinates: [...clickSequence, ...lastCoords],
        },
      };
    } else if (clickSequence.length > 1) {
      tentativeFeature = {
        type: 'Feature',
        properties: {
          guideType: 'tentative',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[...clickSequence, ...lastCoords, clickSequence[0]]],
        },
      };
    }

    return tentativeFeature;
  }

  getTooltips(props: ModeProps<FeatureCollection>): Tooltip[] {
    const tentativeGuide = this['getTentativeGuide'](props);

    if (tentativeGuide && tentativeGuide.geometry.type === 'Polygon') {
      const { modeConfig } = props;
      const { formatTooltip, measurementCallback } = modeConfig || {};
      const units = 'sq. m';

      const centroid = turfCentroid(tentativeGuide);
      const area = turfArea(tentativeGuide);

      let text;
      if (formatTooltip) {
        text = formatTooltip(area);
      } else {
        // By default, round to 2 decimal places and append units
        text = `${parseFloat(String(area)).toFixed(2)} ${units}`;
      }

      if (measurementCallback) {
        measurementCallback(area);
      }

      return [
        {
          position: centroid?.geometry?.coordinates as Position,
          text,
        },
      ];
    }
    return DEFAULT_TOOLTIPS;
  }

  getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection {
    const { lastPointerMoveEvent } = props;

    const guides = {
      type: 'FeatureCollection' as const,
      features: new Array<GuideFeature>(),
    };

    const clickSequence = this['getClickSequence']();
    if (!clickSequence.length) return guides;

    const lastCoords =
      lastPointerMoveEvent && !this._isMeasuringSessionFinished
        ? [lastPointerMoveEvent.mapCoords]
        : [];

    let tentativeFeature;
    if (clickSequence.length === 1) {
      tentativeFeature = {
        type: 'Feature',
        properties: {
          guideType: 'tentative',
        },
        geometry: {
          type: 'LineString',
          coordinates: [...clickSequence, ...lastCoords],
        },
      };
    } else {
      tentativeFeature = {
        type: 'Feature',
        properties: {
          guideType: 'tentative',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[...clickSequence, ...lastCoords, clickSequence[0]]],
        },
      };
    }

    if (tentativeFeature) {
      guides.features.push(tentativeFeature);
    }

    const editHandles: GuideFeature[] = clickSequence.map((clickedCoord, index) => ({
      type: 'Feature',
      properties: {
        guideType: 'editHandle',
        editHandleType: 'existing',
        featureIndex: -1,
        positionIndexes: [index],
      },
      geometry: {
        type: 'Point',
        coordinates: clickedCoord,
      },
    }));

    guides.features.push(...editHandles);

    return guides;
  }

  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
    // restart measuring session
    if (this._isMeasuringSessionFinished) {
      this._isMeasuringSessionFinished = false;
      this['resetClickSequence']();
    }

    const { picks } = event;
    const clickedEditHandle = utils.getPickedEditHandle(picks);

    let positionAdded = false;
    if (!clickedEditHandle) {
      // Don't add another point right next to an existing one
      this['addClickSequence'](event);
      positionAdded = true;
    }
    const clickSequence = this['getClickSequence']();

    if (
      clickSequence.length > 2 &&
      clickedEditHandle &&
      Array.isArray(clickedEditHandle.properties.positionIndexes) &&
      (clickedEditHandle.properties.positionIndexes[0] === 0 ||
        clickedEditHandle.properties.positionIndexes[0] === clickSequence.length - 1)
    ) {
      // They clicked the first or last point (or double-clicked), so complete the polygon
      this._isMeasuringSessionFinished = true;
    } else if (positionAdded) {
      // new tentative point
      props.onEdit({
        // data is the same
        updatedData: props.data,
        editType: 'addTentativePosition',
        editContext: {
          position: event.mapCoords,
        },
      });
    }
  }

  handleKeyUp(event: KeyboardEvent, props: ModeProps<FeatureCollection>) {
    if (this._isMeasuringSessionFinished) return;

    event.stopPropagation();
    const { key } = event;

    const clickSequenceLength = this['getClickSequence']().length;

    switch (key) {
      case 'Escape':
        this._isMeasuringSessionFinished = true;
        if (clickSequenceLength <= 2) {
          this['resetClickSequence']();
        }
        props.onUpdateCursor('cell');
        break;
      case 'Enter':
        if (clickSequenceLength > 1) {
          this.handleClick(props.lastPointerMoveEvent, props);
          this._isMeasuringSessionFinished = true;
        }
        break;
    }
  }

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>) {
    props.onUpdateCursor('cell');
  }
}

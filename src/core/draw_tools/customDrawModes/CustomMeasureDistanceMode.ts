import turfDistance from '@turf/distance';
import greatCircle from '@turf/great-circle';
import { GeoJsonEditMode, utils } from '@nebula.gl/edit-modes';
import type {
  FeatureCollection,
  ClickEvent,
  PointerMoveEvent,
  ModeProps,
  GuideFeatureCollection,
  Tooltip,
} from '@nebula.gl/edit-modes';

export class CustomMeasureDistanceMode extends GeoJsonEditMode {
  _isMeasuringSessionFinished = false;
  _currentTooltips: any[] = [];
  _currentLines: any[] = [];
  _currentDistance = 0;

  _calculateDistanceForTooltip = (positionA, positionB, modeConfig) => {
    const { turfOptions, measurementCallback } = modeConfig || {};
    const distance = turfDistance(positionA, positionB, turfOptions);

    if (measurementCallback) {
      measurementCallback(distance);
    }

    return distance;
  };

  _calculateGeoLine = (positionA, positionB) => {
    const line = greatCircle(positionA, positionB);
    return { ...line, geometry: this._checkGeometry(line.geometry) };
  };

  // fix turfjs interpolation issues
  _checkGeometry(geom) {
    if (geom.type === 'LineString') {
      let antimeridianVertexIndex = -1;
      for (let i = 0; i < geom.coordinates.length - 1; i++) {
        if (Math.abs(geom.coordinates[i][0] - geom.coordinates[i + 1][0]) > 100) {
          antimeridianVertexIndex = i;
          break;
        }
      }
      if (antimeridianVertexIndex !== -1) {
        const arr1 = geom.coordinates.slice(0, antimeridianVertexIndex + 1);
        const arr2 = geom.coordinates.slice(antimeridianVertexIndex + 1);
        const c1 = geom.coordinates[antimeridianVertexIndex];
        const c2 = geom.coordinates[antimeridianVertexIndex + 1];
        const yDiff = c2[1] - c1[1];
        const xDiff1 = 180 - Math.abs(c1[0]);
        const xDiff2 = 180 - Math.abs(c2[0]);
        const xDiff = xDiff1 + xDiff2;
        if (c1[0] > 0) {
          arr1.push([180, c1[1] + (xDiff1 * yDiff) / xDiff]);
        } else {
          arr1.push([-180, c1[1] + (xDiff1 * yDiff) / xDiff]);
        }
        if (c2[0] > 0) {
          arr2.unshift([180, c2[1] - (xDiff2 * yDiff) / xDiff]);
        } else {
          arr2.unshift([-180, c2[1] - (xDiff2 * yDiff) / xDiff]);
        }
        return { type: 'MultiLineString', coordinates: [arr1, arr2] };
      } else {
        return geom;
      }
    } else {
      return geom;
    }
  }

  _formatTooltip(distance, modeConfig?, checkZero?) {
    const { formatTooltip, turfOptions } = modeConfig || {};
    const units = (turfOptions && turfOptions.units) || 'kilometers';
    if (checkZero && distance < 0.0001) {
      distance = 0;
    }

    let text;
    if (formatTooltip) {
      text = formatTooltip(distance);
    } else {
      // By default, round to 2 decimal places and append units
      text = `${parseFloat(distance).toFixed(2)} ${units}`;
    }

    return text;
  }

  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
    const { modeConfig, data, onEdit } = props;

    // restart measuring session
    if (this._isMeasuringSessionFinished) {
      this._isMeasuringSessionFinished = false;
      this['resetClickSequence']();
      this._currentTooltips = [];
      this._currentLines = [];
      this._currentDistance = 0;
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
      clickSequence.length > 1 &&
      clickedEditHandle &&
      Array.isArray(clickedEditHandle.properties.positionIndexes) &&
      clickedEditHandle.properties.positionIndexes[0] === clickSequence.length - 1
    ) {
      // They clicked the last point (or double-clicked), so add the LineString
      this._isMeasuringSessionFinished = true;
    } else if (positionAdded) {
      if (clickSequence.length > 1) {
        this._currentDistance += this._calculateDistanceForTooltip(
          clickSequence[clickSequence.length - 2],
          clickSequence[clickSequence.length - 1],
          modeConfig,
        );
        this._currentTooltips.push({
          position: event.mapCoords,
          text: this._formatTooltip(this._currentDistance, modeConfig),
        });
        this._currentLines.push(
          this._calculateGeoLine(
            clickSequence[clickSequence.length - 2],
            clickSequence[clickSequence.length - 1],
          ),
        );

        // finish measuring session on second click if multipoint is not specified
        if (clickSequence.length === 2 && !modeConfig?.multipoint) {
          this._isMeasuringSessionFinished = true;
        }
      }

      // new tentative point
      onEdit({
        // data is the same
        updatedData: data,
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
        if (clickSequenceLength === 1) {
          this['resetClickSequence']();
          this._currentTooltips = [];
        }
        props.onUpdateCursor('cell');
        break;
      case 'Enter':
        this.handleClick(props.lastPointerMoveEvent, props);
        this._isMeasuringSessionFinished = true;
        break;
    }
  }

  getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection {
    const { lastPointerMoveEvent } = props;
    const clickSequence = this['getClickSequence']();

    const guides = {
      type: 'FeatureCollection' as const,
      features: new Array<any>(),
    };

    if (clickSequence.length > 0) {
      this._currentLines.forEach((lineFeat) =>
        guides.features.push({
          ...lineFeat,
          properties: { guideType: 'tentative' },
        }),
      );
      if (lastPointerMoveEvent && !this._isMeasuringSessionFinished) {
        const lastLine = this._calculateGeoLine(
          clickSequence[clickSequence.length - 1],
          lastPointerMoveEvent.mapCoords,
        );
        lastLine.properties = { guideType: 'tentative' };
        guides.features.push(lastLine);
      }
    }

    const editHandles = clickSequence.map((clickedCoord, index) => ({
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

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>) {
    props.onUpdateCursor('cell');
  }

  getTooltips(props: ModeProps<FeatureCollection>): Tooltip[] {
    const { lastPointerMoveEvent, modeConfig } = props;
    const positions = this['getClickSequence']();

    if (
      positions.length > 0 &&
      lastPointerMoveEvent &&
      !this._isMeasuringSessionFinished
    ) {
      const distance = this._calculateDistanceForTooltip(
        positions[positions.length - 1],
        lastPointerMoveEvent.mapCoords,
        props.modeConfig,
      );
      return [
        ...this._currentTooltips,
        {
          position: lastPointerMoveEvent.mapCoords,
          text: this._formatTooltip(
            this._currentDistance + distance,
            modeConfig,
            positions.length === 1,
          ),
        },
      ];
    }

    return this._currentTooltips;
  }
}

import { getPickedEditHandle } from '@nebula.gl/edit-modes/dist/utils';
import { GeoJsonEditMode } from '@nebula.gl/edit-modes/dist/index';
import kinks from '@turf/kinks';
import type {
  Polygon,
  FeatureCollection,
  Position,
} from '@nebula.gl/edit-modes/dist/geojson-types';
import type {
  ClickEvent,
  PointerMoveEvent,
  ModeProps,
  GuideFeatureCollection,
  TentativeFeature,
} from '@nebula.gl/edit-modes/dist/types';

export class CustomDrawPolygonMode extends GeoJsonEditMode {
  createTentativeFeature(
    props: ModeProps<FeatureCollection>,
  ): TentativeFeature {
    const { lastPointerMoveEvent } = props;
    const clickSequence = this['getClickSequence']();

    const lastCoords = lastPointerMoveEvent
      ? [lastPointerMoveEvent.mapCoords]
      : [];

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
    } else if (clickSequence.length > 2) {
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

  intersectionsTest(
    props: ModeProps<FeatureCollection>,
    coords: Position[],
  ): boolean {
    if (props.modeConfig && props.modeConfig.disableSelfIntersections) {
      const k = kinks({
        type: 'Polygon',
        coordinates: [coords],
      });
      if (k.features.length) {
        props.onEdit({
          // data is the same
          updatedData: props.data,
          editType: 'skipSelfIntersection',
          editContext: {
            position: coords[coords.length - 1],
          },
        });
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection {
    const clickSequence = this['getClickSequence']();

    const guides: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    const tentativeFeature = this.createTentativeFeature(props);
    if (tentativeFeature) {
      guides.features.push(tentativeFeature);
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

  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
    const { picks } = event;
    const clickedEditHandle = getPickedEditHandle(picks);

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
        clickedEditHandle.properties.positionIndexes[0] ===
          clickSequence.length - 1)
    ) {
      // They clicked the first or last point (or double-clicked), so complete the polygon

      const polygonCoords = [...clickSequence, clickSequence[0]];

      if (this.intersectionsTest(props, polygonCoords)) return;

      // Remove the hovered position
      const polygonToAdd: Polygon = {
        type: 'Polygon',
        coordinates: [polygonCoords],
      };

      this['resetClickSequence']();

      console.log(polygonToAdd, props);
      const editAction = this['getAddFeatureOrBooleanPolygonAction'](
        polygonToAdd,
        props,
      );
      if (editAction) {
        props.onEdit(editAction);
      }
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
    const clickSequence = this['getClickSequence']();
    const clickSequenceLength = clickSequence.length;

    if (!clickSequenceLength) return;
    event.stopPropagation();

    switch (event.key) {
      case 'Enter':
        if (clickSequenceLength >= 2) {
          const polygonCoords = [
            ...clickSequence,
            props.lastPointerMoveEvent.mapCoords,
            clickSequence[0],
          ];
          if (this.intersectionsTest(props, polygonCoords)) {
            this['resetClickSequence']();
            return;
          }

          const polygonToAdd: Polygon = {
            type: 'Polygon',
            coordinates: [polygonCoords],
          };

          this['resetClickSequence']();

          const editAction = this['getAddFeatureOrBooleanPolygonAction'](
            polygonToAdd,
            props,
          );
          if (editAction) {
            props.onEdit(editAction);
          }
        }
        break;
      case 'Escape':
        if (clickSequenceLength >= 3) {
          const polygonCoords = [...clickSequence, clickSequence[0]];
          if (this.intersectionsTest(props, polygonCoords)) {
            this['resetClickSequence']();
            return;
          }

          const polygonToAdd: Polygon = {
            type: 'Polygon',
            coordinates: [polygonCoords],
          };

          const editAction = this['getAddFeatureOrBooleanPolygonAction'](
            polygonToAdd,
            props,
          );
          if (editAction) {
            props.onEdit(editAction);
          }
        }

        this['resetClickSequence']();
        break;
    }
  }

  handlePointerMove(
    event: PointerMoveEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    super.handlePointerMove(event, props);
    props.onUpdateCursor('cell');
  }
}

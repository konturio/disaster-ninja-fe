import { utils } from '@nebula.gl/edit-modes';
import { currentNotificationAtom } from '~core/shared_state';
import { i18n } from '~core/localization';
import { CustomDrawPolygonMode } from '../customDrawModes/CustomDrawPolygonMode';
import type {
  ClickEvent,
  ModeProps,
  FeatureCollection,
  Polygon,
} from '@nebula.gl/edit-modes';

export class LocalDrawPolygonMode extends CustomDrawPolygonMode {
  handleKeyUp(event: KeyboardEvent, props: ModeProps<FeatureCollection>) {
    const clickSequence = this['getClickSequence']();
    const clickSequenceLength = clickSequence.length;

    if (!clickSequenceLength) return;
    event.stopPropagation();

    switch (event.key) {
      case 'Enter':
        if (clickSequenceLength >= 2) {
          const lastCoord =
            props.lastPointerMoveEvent?.mapCoords ||
            clickSequence[clickSequenceLength - 1];
          const polygonCoords = [...clickSequence, lastCoord, clickSequence[0]];
          if (this.intersectionsTest(props, polygonCoords)) {
            currentNotificationAtom.showNotification.dispatch(
              'error',
              { title: i18n.t('draw_tools.overlap_error') },
              5,
            );
            this['resetClickSequence']();
            return;
          }

          const polygonToAdd: Polygon = {
            type: 'Polygon',
            coordinates: [polygonCoords],
          };

          this['resetClickSequence']();

          // in this['getAddFeatureOrBooleanPolygonAction'](polygonToAdd, props);
          // props.data.features must be [] but we were passing props.data as []
          if (Array.isArray(props.data))
            props.data = {
              features: [],
              type: 'FeatureCollection',
            };

          const editAction = this['getAddFeatureOrBooleanPolygonAction'](
            polygonToAdd,
            props,
          );

          if (editAction) {
            props.onEdit(editAction);
            // props.data.features = editAction.updatedData.features
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

  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
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

      // disable zoom for finishing double-click

      const polygonCoords = [...clickSequence, clickSequence[0]];

      if (this.intersectionsTest(props, polygonCoords)) {
        currentNotificationAtom.showNotification.dispatch(
          'error',
          { title: i18n.t('draw_tools.overlap_error') },
          5,
        );
        this['resetClickSequence']();
        return;
      }

      // Remove the hovered position
      const polygonToAdd: Polygon = {
        type: 'Polygon',
        coordinates: [polygonCoords],
      };

      this['resetClickSequence']();

      // in this['getAddFeatureOrBooleanPolygonAction'](polygonToAdd, props);
      // props.data.features must be [] but we were passing props.data as []
      if (Array.isArray(props.data))
        props.data = {
          features: [],
          type: 'FeatureCollection',
        };

      const editAction = this['getAddFeatureOrBooleanPolygonAction'](polygonToAdd, props);

      if (editAction) {
        props.onEdit(editAction);
      }
    } else if (positionAdded) {
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

  handlePointerMove(event, props: ModeProps<FeatureCollection>) {
    super.handlePointerMove(event, props);
    props.onUpdateCursor('cell');
  }
}

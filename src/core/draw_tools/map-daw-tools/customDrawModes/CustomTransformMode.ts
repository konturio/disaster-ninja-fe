import { featureCollection } from '@turf/helpers';
import {
  ScaleMode,
  RotateMode,
  CompositeMode
} from '@nebula.gl/edit-modes';
import { CustomTranslateMode } from './CustomTranslateMode';
import type {
  PointerMoveEvent,
  ModeProps,
  StartDraggingEvent,
  FeatureCollection,
  GeoJsonEditMode} from '@nebula.gl/edit-modes';

// extension for @nebula.gl/edit-modes 1.0.2-alpha.0
export class CustomTransformMode extends CompositeMode {
  constructor() {
    super([new CustomTranslateMode(), new ScaleMode(), new RotateMode()]);
  }

  handlePointerMove(
    event: PointerMoveEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    let updatedCursor: string | null = null;
    super.handlePointerMove(event, {
      ...props,
      onUpdateCursor: (cursor) => {
        updatedCursor = cursor || updatedCursor;
      },
    });
    props.onUpdateCursor(updatedCursor);
  }

  handleStartDragging(
    event: StartDraggingEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    let scaleMode: any = null;
    let translateMode: any = null;
    const filteredModes: GeoJsonEditMode[] = [];

    // If the user selects a scaling edit handle that overlaps with part of the selected feature,
    // it is possible for both scale and translate actions to be triggered. This logic prevents
    // this simultaneous action trigger from happening by putting a higher priority on scaling
    // since the user needs to be more precise to hover over a scaling edit handle.
    this._modes.forEach((mode) => {
      if (mode instanceof CustomTranslateMode) {
        translateMode = mode;
      } else {
        if (mode instanceof ScaleMode) {
          scaleMode = mode;
        }
        filteredModes.push(mode);
      }
    });

    if (scaleMode instanceof ScaleMode && !scaleMode.isEditHandleSelected()) {
      filteredModes.push(translateMode);
    }

    filteredModes
      .filter(Boolean)
      .forEach((mode) => mode.handleStartDragging(event, props));
  }

  getGuides(props: ModeProps<FeatureCollection>) {
    let compositeGuides = super.getGuides(props);
    const rotateMode = (this._modes || []).find(
      (mode) => mode instanceof RotateMode,
    );

    if (rotateMode instanceof RotateMode) {
      const nonEnvelopeGuides = compositeGuides.features.filter((guide) => {
        const { editHandleType, mode } = (guide.properties as any) || {};
        // Both scale and rotate modes have the same enveloping box as a guide - only need one
        const guidesToFilterOut = [mode];
        // Do not render scaling edit handles if rotating
        if (rotateMode.getIsRotating()) {
          guidesToFilterOut.push(editHandleType);
        }
        return !guidesToFilterOut.includes('scale');
      });
      // @ts-ignore
      compositeGuides = featureCollection(nonEnvelopeGuides);
    }
    return compositeGuides;
  }
}

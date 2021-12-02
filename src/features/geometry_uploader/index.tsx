import { focusedGeometryAtom } from '~core/shared_state/focusedGeometry';
import { sideControlsBarAtom } from '~core/shared_state';
import { askGeoJSONFile } from './askGeoJSONFile';
import { UploadFileIcon } from '@k2-packages/default-icons';
import { GEOMETRY_UPLOADER_CONTROL_ID, GEOMETRY_UPLOADER_CONTROL_NAME } from './constants';
import { controlGroup, controlVisualGroup } from '~core/shared_state/sideControlsBar';

export function initFileUploader() {
  sideControlsBarAtom.addControl.dispatch({
    id: GEOMETRY_UPLOADER_CONTROL_ID,
    name: GEOMETRY_UPLOADER_CONTROL_NAME,
    active: false,
    exclusiveGroup: controlGroup.mapTools,
    visualGroup: controlVisualGroup.withAnalitics,
    icon: <UploadFileIcon />,
    onClick: () => {
      /**
       * In webkit you can't use additional function wrapper including useCallback
       * because it's disable file upload popup.
       */
      askGeoJSONFile((geoJSON) =>
        focusedGeometryAtom.setFocusedGeometry.dispatch(
          { type: 'uploaded' },
          geoJSON,
        ),
      );
    },
  });
}

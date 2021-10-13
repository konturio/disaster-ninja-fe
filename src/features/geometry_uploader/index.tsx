import { focusedGeometryAtom } from '~core/shared_state/focusedGeometry';
import { sideControlsBarAtom } from '~core/shared_state';
import { askGeoJSONFile } from './askGeoJSONFile';
import { UploadFileIcon } from './UploadFileIcon';

export function initFileUploader() {
  sideControlsBarAtom.addControl.dispatch({
    id: 'upload_file',
    name: 'Upload File',
    active: false,
    group: 'AOI',
    icon: <UploadFileIcon />,
    onClick: () => {
      /**
       * In webkit you can't use additional function wrapper including useCallback
       * because it's disable file upload popup.
       */
      askGeoJSONFile((geoJSON) =>
        focusedGeometryAtom.setFocusedGeometry.dispatch(geoJSON),
      );
    },
  });
}

import { focusedGeometryAtom } from '~core/shared_state/focusedGeometry';
import { sideControlsBarAtom } from '~core/shared_state';
import { askGeoJSONFile } from './askGeoJSONFile';
import UploadFileIcon from '@k2-packages/default-icons/tslib/icons/UploadFileIcon';

export function initFileUploader() {
  sideControlsBarAtom.addControl.dispatch({
    id: 'UploadFile',
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
        focusedGeometryAtom.setFocusedGeometry.dispatch(
          { type: 'uploaded' },
          geoJSON,
        ),
      );
    },
  });
}

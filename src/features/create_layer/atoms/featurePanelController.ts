import { createAtom } from '~utils/atoms/createPrimitives';
import { EditTargets } from '../constants';
import { editTargetAtom } from './editTarget';

export const featurePanelControllerAtom = createAtom(
  {
    editFeatures: (layerId: string) => layerId,
  },
  ({ onAction, schedule }) => {
    onAction('editFeatures', (layerId) => {
      schedule((dispatch) => {
        dispatch(
          editTargetAtom.set({
            type: EditTargets.features,
            layerId,
          }),
        );
      });
    });
  },
  'featurePanelControllerAtom',
);

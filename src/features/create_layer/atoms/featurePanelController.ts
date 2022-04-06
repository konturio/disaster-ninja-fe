import { createAtom } from '~utils/atoms/createPrimitives';
import { editTargetAtom } from './editTarget';
import { EditTargets } from '../constants';

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

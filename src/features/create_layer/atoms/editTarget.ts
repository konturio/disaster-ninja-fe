import { createPrimitiveAtom } from '~utils/atoms/createPrimitives';
import { EditTargets } from '../constants';
import { EditTargetsType } from '../types';

export const editTargetAtom = createPrimitiveAtom<EditTargetsType>(
  EditTargets.none,
);

editTargetAtom.subscribe((s) => console.log(s));

import { createPrimitiveAtom } from '~utils/atoms/createPrimitives';
import { EditTargets } from '../constants';
import { EditTargetsType } from '../types';

export const editTargetAtom = createPrimitiveAtom<{
  type: EditTargetsType;
  layerId?: string;
}>({ type: EditTargets.none });

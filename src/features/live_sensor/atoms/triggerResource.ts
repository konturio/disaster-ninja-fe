import { createNumberAtom } from '~utils/atoms/createPrimitives';

export const resourceTriggerAtom = createNumberAtom(0, 'resourceTriggerAtom');
export const triggerRequestAction = resourceTriggerAtom.increment;
export type TriggerRequestActionType = typeof triggerRequestAction;

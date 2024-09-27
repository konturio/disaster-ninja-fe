import { atom, action } from '@reatom/core';
import { v3toV2 } from '~utils/atoms/v3tov2';
import { focusedGeometryAtom } from '../focused_geometry/model';

// reatom v2 imports mapped to reatom v3
const __v3_imports = {
  focusedGeometryAtom: focusedGeometryAtom.v3atom,
};

function __create_v3() {
  const { focusedGeometryAtom } = __v3_imports;
  // v3 definitions section

  // * CurrentEventAtomState *
  // null represents the initial state of event - we need that state for cases of autoselecting event
  // { id: null } represents event reset was caused by user actions
  type CurrentEventAtomState = { id: string | null } | null;

  const currentEventAtom = atom<CurrentEventAtomState>(null, 'currentEventAtom');
  const scheduledAutoSelect = atom(false, 'scheduledAutoSelect');
  const scheduledAutoFocus = atom(false, 'scheduledAutoFocus');

  const setCurrentEventId = action((ctx, eventId: string | null) => {
    currentEventAtom(ctx, { id: eventId });
  }, 'setCurrentEventId');

  // Stateless computed atom that updates currentEventAtom based on focusedGeometryAtom
  const computedCurrentEventAtom = atom((ctx) => {
    const currentEvent = ctx.spy(currentEventAtom);
    const focusedGeometry = ctx.spy(focusedGeometryAtom);
    const currentGeometrySource = focusedGeometry?.source;

    if (
      currentGeometrySource &&
      currentGeometrySource.type !== 'event' &&
      currentGeometrySource.type !== 'episode'
    ) {
      if (currentEvent?.id !== null) {
        currentEventAtom(ctx, { id: null });
      }
    }
  }, 'computedCurrentEventAtom');

  // v3 exports object
  return {
    currentEventAtom,
    scheduledAutoSelect,
    scheduledAutoFocus,
    setCurrentEventId,
    computedCurrentEventAtom,
  };
}

const v3 = __create_v3();
// v3 exports as default
export default v3;

// v2 compatible exports keeping the same names
export const currentEventAtom = v3toV2(v3.currentEventAtom, {
  setCurrentEventId: v3.setCurrentEventId,
});
export const scheduledAutoSelect = v3toV2(v3.scheduledAutoSelect);
export const scheduledAutoFocus = v3toV2(v3.scheduledAutoFocus);

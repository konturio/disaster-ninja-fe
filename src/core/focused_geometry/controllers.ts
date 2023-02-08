import { createAtom } from '~utils/atoms';
import { currentEventResourceAtom } from '../shared_state/currentEventResource';
import { episodesPanelState } from '../shared_state/episodesPanelState';
import { focusedGeometryAtom } from './model';

/* Restore event geometry when episodes panel closed */
export const episodesPanelStateHandler = createAtom(
  {
    episodesPanelState,
  },
  ({ onChange, schedule, getUnlistedState }) => {
    onChange('episodesPanelState', (newState) => {
      if (!newState.isOpen) {
        const currentEvent = getUnlistedState(currentEventResourceAtom);
        if (!currentEvent.loading && !currentEvent.error && currentEvent.data) {
          const event = currentEvent.data;
          schedule((dispatch) => {
            dispatch(
              focusedGeometryAtom.setFocusedGeometry(
                {
                  type: 'event',
                  meta: event,
                },
                event.geojson,
              ),
            );
          });
        }
      }
    });
  },
  'episodesPanelStateHandler',
);

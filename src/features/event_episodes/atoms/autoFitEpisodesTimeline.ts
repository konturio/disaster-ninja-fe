import { createAtom } from '~utils/atoms';
import { episodesTimeline } from './episodesTimeline';
import { episodesResource } from './episodesResource';

export const autoFitEpisodesTimeline = createAtom(
  {
    episodesTimeline,
    episodesResource,
  },
  ({ onChange, schedule }) => {
    const fit = () => {
      schedule((dispatch) => {
        dispatch(episodesTimeline.resetZoom());
      });
    };
    onChange('episodesTimeline', fit);
    onChange('episodesResource', (resource) => {
      if (!resource.loading && !resource.error) {
        fit();
      }
    });
  },
  'autoFitEpisodesTimeline',
);

import { Timeline } from '@konturio/ui-kit';
import { useAtom } from '@reatom/react';
import { useCallback, useMemo } from 'react';
import { eventEpisodesController } from '../../controller';
import { eventEpisodesModel } from '../../model';
import type { TimelineProps } from '@konturio/ui-kit';
import type { Episode } from '~core/types';

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

const timelineMargins = { axis: 2 };

export function EpisodesTimeline({ episodes }: { episodes: Episode[] }) {
  const [selectedEpisode] = useAtom(eventEpisodesModel.currentEpisode);
  const [timelineState] = useAtom(eventEpisodesModel.episodesTimelineState);
  useAtom(eventEpisodesModel.autoClearCurrentEpisode);

  const timelineSelection = useMemo(
    () => (selectedEpisode ? [selectedEpisode.id] : []),
    [selectedEpisode],
  );

  const dataSet: TimelineProps['dataset'] = useMemo(() => {
    if (episodes.length) {
      return episodes.map((episode) =>
        episode.startedAt !== episode.endedAt
          ? // Time range
            {
              id: episode.id,
              start: new Date(episode.startedAt),
              end: new Date(episode.endedAt),
            }
          : // Point
            {
              id: episode.id,
              start: new Date(episode.startedAt),
            },
      );
    } else {
      return [];
    }
  }, [episodes]);

  const onSelect = useCallback<WithRequired<TimelineProps, 'onSelect'>['onSelect']>(
    (selection) => {
      if (selection.length > 1) {
        return; // its cluster
      }
      if (selection[0] !== undefined) {
        eventEpisodesController.setCurrentEpisode(String(selection[0].id));
      } else {
        eventEpisodesController.resetCurrentEpisode();
      }
    },
    [],
  );

  // Timeline library have imperative api that provided trough useImperativeHandle handle
  // Here I pass this api to atom.
  const onRefChange = eventEpisodesController.setTimelineImperativeApi;
  return (
    <div>
      <Timeline
        dataset={dataSet}
        ref={onRefChange}
        selected={timelineSelection}
        stack={timelineState.settings.stack}
        cluster={timelineState.settings.cluster}
        onSelect={onSelect}
        margin={timelineMargins}
      />
    </div>
  );
}

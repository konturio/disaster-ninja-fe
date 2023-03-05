import { Timeline } from '@konturio/ui-kit';
import { useAtom } from '@reatom/react-v2';
import { useCallback, useMemo } from 'react';
import { eventEpisodesController } from '../../controller';
import { eventEpisodesModel } from '../../model';
import s from './EpisodesTimeline.module.css';
import type { TimelineProps } from '@konturio/ui-kit';
import type { Episode } from '~core/types';

interface DataEntry {
  id: string | number;
  start: Date;
  end?: Date;
  group?: string;
  forecasted: boolean;
}

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

  const timelineEntryClassName = useCallback(
    (entry: DataEntry, defaultClassName?: string) => {
      if (entry.forecasted) {
        return s.forecasted;
      }

      return defaultClassName;
    },
    [],
  );

  const dataSet = useMemo(() => {
    if (episodes.length) {
      return episodes.map((episode) =>
        episode.startedAt !== episode.endedAt
          ? // Time range
            {
              id: episode.id,
              start: new Date(episode.startedAt),
              end: new Date(episode.endedAt),
              forecasted: episode.forecasted,
              content: '',
            }
          : // Point
            {
              id: episode.id,
              start: new Date(episode.startedAt),
              forecasted: episode.forecasted,
              content: '',
            },
      );
    } else {
      return [];
    }
  }, [episodes]);

  const onSelect = useCallback((selection) => {
    if (selection.length > 1) {
      return; // its cluster
    }
    const [item] = selection;
    if (item !== undefined) {
      eventEpisodesController.setCurrentEpisode(String(item.id));
    } else {
      eventEpisodesController.resetCurrentEpisode();
    }
  }, []);

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
        getEntryClassName={timelineEntryClassName}
      />
    </div>
  );
}

import { EventCard } from './EventCard';
import type { Event } from '~core/types';

const event: Event = {
  eventId: '085aa3fc-7f3a-42d3-9acc-db04215e20bf',
  eventName: 'Earthquake',
  description:
    'On 8/9/2024 10:57:37 AM, an earthquake occurred in Japan potentially affecting 39.4 million in 100km. The earthquake had Magnitude 5M, Depth:24.876km.',
  location: 'Japan',
  severity: 'MODERATE',
  affectedPopulation: 38777564,
  settledArea: 14975.532431108208,
  osmGaps: 0,
  updatedAt: '2024-08-10T05:11:21.231Z',
  externalUrls: [
    'https://www.gdacs.org/report.aspx?eventtype=EQ&eventid=1441158',
    'https://www.gdacs.org/report.aspx?eventid=1441158&episodeid=1587245&eventtype=EQ',
  ],
  bbox: [138.236, 34.495, 140.446, 36.297],
  // centroid: [139.34125, 35.412],
  episodeCount: 1,
};

export default {
  EventCardFixture() {
    return [
      <EventCard
        event={event}
        externalUrls={event.externalUrls}
        isActive
        showDescription
        key={1}
        alternativeActionControl={<div>Alternative action control</div>}
      />,
    ];
  },
};

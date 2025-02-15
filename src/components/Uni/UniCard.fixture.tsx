import React from 'react';
import { UniCard } from './UniCard';
import type { UniCardCfg, UniCardItem } from './Elements';

const _test_uni_item_types: UniCardCfg = {
  items: [
    { label: { value: [{ value: '2' }] } },
    { label: ['A', 'B'] },
    {
      progress: {
        caption: 'ProgCap',
        value: [{ title: 'P_20', value: 20, color: 'green' }],
      },
    },
    { title: 'Title shorthand' },
    {
      progress: [
        { title: 'Prog10', value: 10 },
        { title: 'Prog50', value: 50 },
      ],
    },
    { title: { value: '' } },
    {
      table: [
        ['a', 'b'],
        ['a2', 'b2'],
      ],
    },
  ],
};

export default {
  UniCard_event: <UniCard key="1" feature={_getEventMock()} isActive />,
  UniCard_test: <UniCard key="1" feature={_test_uni_item_types} />,
};

function _getEventMock() {
  const c: UniCardCfg = {
    id: 'f84f21e0-65c9-48e0-8e37-f43dab2777f5',
    focus: [98.1180632, -10.2927858, 140.76358974504504, 4.2304443],
    properties: {
      eventId: 'f84f21e0-65c9-48e0-8e37-f43dab2777f5',
      eventName: 'Flood',
      eventType: 'FLOOD',
      description:
        'On 17/11/2024, a flood started in Indonesia, lasting until 12/02/2025 (last update). The flood caused 37 deaths and 4190 displaced .',
      location: 'Indonesia',
      severity: 'MODERATE',
      affectedPopulation: 130969671,
      settledArea: 10031.986031753553,
      osmGaps: 3,
      startedAt: '2024-11-17T01:00:00Z',
      updatedAt: '2025-02-11T15:46:01.944Z',
      externalUrls: [
        'https://www.gdacs.org/report.aspx?eventtype=FL&eventid=1103025',
        'https://www.gdacs.org/report.aspx?eventid=1103025&episodeid=44&eventtype=FL',
      ],
      bbox: [98.1180632, -10.2927858, 140.76358974504504, 4.2304443],
      centroid: [98.8796722168584, 1.1440190000000001],
      episodeCount: 1,
    },
    items: [
      {
        severity: 'MODERATE',
      },
      {
        title: 'Flood',
      },
      {
        text: 'Indonesia',
      },
      {
        icl: [
          {
            title: '130,969,671',
            alt: 'Affected people',
            data: '',
            icon: 'People16',
          },
          {
            title: '10,032 km²',
            alt: 'Settled area',
            icon: 'Area16',
          },
          {
            title: '3%',
            alt: 'Osm Gaps',
            icon: 'OsmGaps16',
          },
        ],
      },
      {
        text: 'On 17/11/2024, a flood started in Indonesia, lasting until 12/02/2025 (last update). The flood caused 37 deaths and 4190 displaced .',
      },
      {
        actions: [
          {
            title: 'gdacs.org',
            type: 'external_link',
            data: 'https://www.gdacs.org/report.aspx?eventtype=FL&eventid=1103025',
          },
          {
            title: 'gdacs.org',
            type: 'external_link',
            data: 'https://www.gdacs.org/report.aspx?eventid=1103025&episodeid=44&eventtype=FL',
          },
        ],
      },
      {
        text: 'Started Nov 17, 2024, 4:00 AM GMT+3',
      },
      {
        text: 'Updated Feb 11, 2025, 6:46 PM GMT+3',
      },
    ],
  };
  return c;
}

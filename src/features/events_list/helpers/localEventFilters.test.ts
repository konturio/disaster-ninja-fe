import { describe, it, expect } from 'vitest';
import {
  filterByEventTypes,
  filterByCountry,
  filterByMaxStartedAt,
  filterByMaxUpdatedAt,
} from './localEventFilters';
import type { Event } from '~core/types';

const sampleEvents: Event[] = [
  {
    eventId: '1',
    eventName: 'Flood in USA',
    location: 'United States',
    severity: 'SEVERE',
    affectedPopulation: 0,
    settledArea: 0,
    osmGaps: 0,
    startedAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
    externalUrls: [],
    bbox: [0, 0, 0, 0],
    episodeCount: 1,
    eventType: 'FLOOD',
  },
  {
    eventId: '2',
    eventName: 'Storm in Canada',
    location: 'Canada',
    severity: 'MINOR',
    affectedPopulation: 0,
    settledArea: 0,
    osmGaps: 0,
    startedAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
    externalUrls: [],
    bbox: [0, 0, 0, 0],
    episodeCount: 1,
    eventType: 'STORM',
  },
];

describe('localEventFilters', () => {
  it('filters by event types', () => {
    const result = filterByEventTypes(sampleEvents, ['FLOOD']);
    expect(result.length, 'filterByEventTypes should keep only FLOOD events').toBe(1);
    expect(result[0].eventId, 'filterByEventTypes should return eventId 1').toBe('1');
  });

  it('filters by country', () => {
    const result = filterByCountry(sampleEvents, 'can');
    expect(
      result.length,
      'filterByCountry should match country substring case-insensitively',
    ).toBe(1);
    expect(result[0].eventId, 'filterByCountry should return eventId 2').toBe('2');
  });

  it('filters by max startedAt', () => {
    const result = filterByMaxStartedAt(sampleEvents, '2024-01-15');
    expect(
      result.length,
      'filterByMaxStartedAt should exclude events after the max date',
    ).toBe(1);
    expect(result[0].eventId, 'filterByMaxStartedAt should return eventId 1').toBe('1');
  });

  it('filters by max updatedAt', () => {
    const result = filterByMaxUpdatedAt(sampleEvents, '2024-01-31');
    expect(
      result.length,
      'filterByMaxUpdatedAt should exclude events updated after the max date',
    ).toBe(1);
    expect(result[0].eventId, 'filterByMaxUpdatedAt should return eventId 1').toBe('1');
  });
});

import React from 'react';
import { MiniLegend } from './MiniLegend';

const mockResponse = [
  {
    id: 'A1',
    color: 'rgba(232,232,157,0.5)',
  },
  {
    id: 'A2',
    color: 'rgba(216,159,88,0.5)',
  },
  {
    id: 'A3',
    color: 'rgba(228,26,28,0.5)',
  },
  {
    id: 'B1',
    color: 'rgba(169,218,122,0.5)',
  },
  {
    id: 'B2',
    color: 'rgba(159,171,87,0.5)',
  },
  {
    id: 'B3',
    color: 'rgba(140,127,57,0.5)',
  },
  {
    id: 'C1',
    color: 'rgba(90,200,127,0.5)',
  },
  {
    id: 'C2',
    color: 'rgba(88,176,117,0.5)',
  },
  {
    id: 'C3',
    color: 'rgba(83,152,106,0.5)',
  },
];

export default (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    }}
  >
    All next colors - undefined
    <MiniLegend
      legend={mockResponse}
      changes={{
        A1: { color: undefined },
        A3: { color: undefined },
        C1: { color: undefined },
        C3: { color: undefined },
      }}
    />
    No changes
    <MiniLegend legend={mockResponse} changes={{}} />
    All changed
    <MiniLegend
      legend={mockResponse}
      changes={{
        A1: { color: 'rgba(173, 169, 200, 0.5)' },
        A3: { color: 'rgba(12, 155, 237, 0.5)' },
        C1: { color: 'rgba(171, 216, 237, 0.5)' },
        C3: { color: 'rgba(83, 152, 106, 0.5)' },
      }}
    />
    Half of cells changed
    <MiniLegend
      legend={mockResponse}
      changes={{
        A1: { color: 'rgba(173, 169, 200, 0.5)' },
        C3: { color: 'rgba(83, 152, 106, 0.5)' },
      }}
    />
    Half of cells changed, half comes incorrect
    <MiniLegend
      legend={mockResponse}
      changes={{
        A1: { color: undefined },
        A3: { color: 'rgba(12, 155, 237, 0.5)' },
        C1: { color: 'rgba(173, 169, 200, 0.5)' },
        C3: { color: undefined },
      }}
    />
  </div>
);

import { ActionButtons } from './ActionButtons';
import { Title } from './Title';
import { Table } from './Table';
import { Label } from './Label';
import { Progress } from './Progress';
import type { LngLatBoundsLike } from 'maplibre-gl';

// TODO: add new card elements here
export const CardElementsMap = {
  label: Label,
  title: Title,
  table: Table,
  actions: ActionButtons,
  progress: Progress,
};

type CardElementId = keyof typeof CardElementsMap;

export type FeatureCardItemCfg<E extends CardElementId> = { type: E } & Parameters<
  (typeof CardElementsMap)[E]
>[0];

export type FeatureCardCfg = {
  id: number;
  focus: LngLatBoundsLike;
  properties: object;
  items: FeatureCardItemCfg<CardElementId>[];
};

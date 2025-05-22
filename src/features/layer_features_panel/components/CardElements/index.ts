import { SeverityIndicator } from '~components/SeverityIndicator/SeverityIndicator';
import { ActionButtons } from './ActionButtons';
import { Title } from './Title';
import { Table } from './Table';
import { Label } from './Label';
import { Progress } from './Progress';
import { CardText } from './CardText';
import { CardImage } from './CardImage';
import type { LngLatBoundsLike } from 'maplibre-gl';

// add new card elements here
export const CardElementsMap = {
  label: Label,
  title: Title,
  table: Table,
  actions: ActionButtons,
  progress: Progress,
  text: CardText,
  severity: SeverityIndicator,
  image: CardImage,
};

export type CardElementId = keyof typeof CardElementsMap;

type InferProps<T> = T extends React.ComponentType<infer P> ? P : never;

export type CardElementProps = {
  [K in CardElementId]: InferProps<(typeof CardElementsMap)[K]>;
};

export type FeatureCardItem = {
  [K in CardElementId]: {
    type: K;
  } & InferProps<(typeof CardElementsMap)[K]>;
}[CardElementId];

export type FeatureCardCfg = {
  id: number;
  focus?: LngLatBoundsLike;
  properties: object;
  items: FeatureCardItem[];
};

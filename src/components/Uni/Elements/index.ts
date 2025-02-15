import { SeverityElement } from './Severity';
import { ActionButtons, IconList } from './ActionButtons';
import { Title } from './Title';
import { Table } from './Table';
import { Label } from './Label';
import { Progress } from './Progress';
import { CardText } from './CardText';
import type { LngLatBoundsLike } from 'maplibre-gl';

// add new card elements here
export const UniElementsMap = {
  label: Label,
  title: Title,
  table: Table,
  actions: ActionButtons,
  icl: IconList,
  progress: Progress,
  text: CardText,
  severity: SeverityElement,
};

export type UniElementId = keyof typeof UniElementsMap;

type InferProps<T> = T extends React.ComponentType<infer P> ? P : never;

export type UniCardCfg = {
  id: string;
  focus?: LngLatBoundsLike;
  properties: object;
  items: UniCardItem[];
};

type ComponentProps<T> = T extends React.ComponentType<infer P> ? P : never;
type ElementValueType<T> = ComponentProps<T> extends { value: infer V } ? V : never;

export type UniCardItem = {
  [K in UniElementId]:
    | { [P in K]: ElementValueType<(typeof UniElementsMap)[K]> } // Shorthand
    | { [P in K]: ComponentProps<(typeof UniElementsMap)[K]> }; // Full props
}[UniElementId];

export function isValidUniElement(
  item: Record<UniElementId, unknown>,
  type: UniElementId,
): item is Record<UniElementId, { value: any }> {
  return (
    type in item && typeof item[type] === 'object' && 'value' in (item[type] as object)
  );
}

import { nanoid } from 'nanoid';

export function generateMultivariateId(mvaName?: string) {
  return `${mvaName ?? 'mva-layer'}_${nanoid(4)}`;
}

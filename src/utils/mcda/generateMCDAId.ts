import { nanoid } from 'nanoid';

export function generateMCDAId(mcdaName?: string) {
  return `${mcdaName ?? 'mcda-layer'}_${nanoid(4)}`;
}

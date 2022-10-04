import type { AsyncAtomState } from './types';
// @ts-ignore
export function isAtomLike(
  state: Record<string, unknown>,
): state is AsyncAtomState<any, any> {
  return 'loading' in state || 'error' in state;
}

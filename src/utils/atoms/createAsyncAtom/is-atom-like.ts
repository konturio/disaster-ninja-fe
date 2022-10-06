import type { AsyncAtomState } from './types';
export function isAtomLike(
  state: Record<string, unknown>,
  // @ts-ignore
): state is AsyncAtomState<any, any> {
  return 'loading' in state || 'error' in state;
}

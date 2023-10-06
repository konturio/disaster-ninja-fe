import type { ToolbarControlSettings } from './types';

/** Select value according  */
export function resolveValue<X extends string>(
  value: Record<X, string> | string,
  state: X,
) {
  return typeof value === 'string' ? value : value[state];
}

export function passRefToSettings(
  settings: ToolbarControlSettings,
  ref: HTMLElement | null,
) {
  if ('onRef' in settings.typeSettings) {
    ref && settings.typeSettings.onRef?.(ref);
  }
}

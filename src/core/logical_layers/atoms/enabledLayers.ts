import { createSetAtom } from '~utils/atoms/createPrimitives';
import { localStorage } from '~utils/storage';
import { store } from '~core/store/store';

export const ENABLED_LAYERS_LS_KEY = 'enabled_layers';

function readInitialState() {
  try {
    const raw = localStorage.getItem(ENABLED_LAYERS_LS_KEY);
    if (!raw) return new Set<string>();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return new Set<string>(parsed);
  } catch {}
  return new Set<string>();
}

export const enabledLayersAtom = createSetAtom(readInitialState(), 'enabledLayers');

store.v3ctx.subscribe(enabledLayersAtom, (layers) => {
  try {
    localStorage.setItem(ENABLED_LAYERS_LS_KEY, JSON.stringify(Array.from(layers)));
  } catch {}
});

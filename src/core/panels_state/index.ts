import { AppStorage } from '~core/cookie_settings/AppStorage';
import { configRepo } from '~core/config';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';

const layersStorageKey = () => `kontur_layers_${configRepo.get().id}`;

export function loadEnabledLayers(): string[] | null {
  const storage = new AppStorage<string[]>(layersStorageKey());
  return storage.get('layers');
}

export function persistEnabledLayers() {
  const storage = new AppStorage<string[]>(layersStorageKey());
  enabledLayersAtom.v3atom.onChange((ctx, layers) => {
    storage.set('layers', Array.from(layers));
  });
}

export function savePanelState(panelId: string, state: string) {
  const storage = new AppStorage<string>(`kontur_panels_${configRepo.get().id}`);
  storage.set(panelId, state);
}

export function loadPanelState(panelId: string): string | null {
  const storage = new AppStorage<string>(`kontur_panels_${configRepo.get().id}`);
  return storage.get(panelId);
}

export function savePanelHeight(panelId: string, height: string | null) {
  const storage = new AppStorage<string>(`kontur_panel_heights_${configRepo.get().id}`);
  if (height) {
    storage.set(panelId, height);
  } else {
    storage.remove(panelId);
  }
}

export function loadPanelHeight(panelId: string): string | null {
  const storage = new AppStorage<string>(`kontur_panel_heights_${configRepo.get().id}`);
  return storage.get(panelId);
}

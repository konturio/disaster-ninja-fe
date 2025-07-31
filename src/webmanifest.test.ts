/**
 * @vitest-environment happy-dom
 */
import { describe, test, expect, vi } from 'vitest';
import { setupWebManifest } from 'webmanifest';

describe('setupWebManifest', () => {
  test('injects manifest link from app config', () => {
    const createObjectURL = vi.fn(() => 'blob:url');
    // @ts-ignore
    global.URL.createObjectURL = createObjectURL;
    document.body.innerHTML = "<link rel='manifest' />";
    setupWebManifest({
      name: 'App',
      faviconPack: { 'icon-192x192.png': '192.png', 'icon-512x512.png': '512.png' },
    } as any);
    expect(createObjectURL).toHaveBeenCalled();
    const link = document.querySelector("link[rel='manifest']") as HTMLLinkElement;
    expect(link.getAttribute('href')).toBe('blob:url');
  });
});

import type { AppConfig } from '~core/config/types';

export function setupWebManifest(appConfig: AppConfig) {
  const manifest = {
    name: appConfig.name,
    short_name: appConfig.name,
    orientation: 'portrait',
    display: 'standalone',
    start_url: './',
    icons: [
      {
        src: appConfig?.faviconPack['icon-192x192.png'] ?? '/active/api/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: appConfig?.faviconPack['icon-512x512.png'] ?? '/active/api/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    theme_color: '#ffffff',
    background_color: '#ffffff',
  };
  const blob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
  const manifestURL = URL.createObjectURL(blob);
  document.querySelector("link[rel='manifest']")?.setAttribute('href', manifestURL);
}

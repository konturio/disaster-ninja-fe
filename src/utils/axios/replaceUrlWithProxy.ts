const proxyHost = 'localhost:3000';

/* Replace api url that require CORS to proxy */
export function replaceUrlWithProxy(originalUrl: string): string {
  const viteProxyConfig = globalThis['viteProxyConfig'];
  if (!viteProxyConfig) return originalUrl;

  const associatedProxyTarget = Object.keys(viteProxyConfig).find((link) =>
    originalUrl.includes(link),
  );
  if (!associatedProxyTarget) return originalUrl;

  // Replace host in link with same link with proxy host
  // Was: Client -> Server with cors
  // Will: Client -> Dev server (-> Server with cors)
  try {
    return originalUrl.replace(new URL(originalUrl).host, proxyHost);
  } catch (e: any) {
    return originalUrl;
  }
}

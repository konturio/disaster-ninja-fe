const host = 'http://localhost:3000';

/* Replace api url that require CORS to proxy */
export function replaceUrlWithProxy(originalUrl: string): string {
  const viteProxyConfig = window['viteProxyConfig'];
  if (!viteProxyConfig) return originalUrl;
  try {
    return Object.entries(viteProxyConfig).reduce(
      (url, rule: [string, any]) => {
        const proxyTarget =
          typeof rule[1] === 'string' ? rule[1] : rule[1].target;
        if (proxyTarget) {
          return url.replace(String(proxyTarget), host);
        } else {
          return url;
        }
      },
      originalUrl,
    );
  } catch (e: any) {
    return originalUrl;
  }
}

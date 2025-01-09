const proxyHost = 'localhost:3000';

type ProxyConfig = {
  [key: string]: string | { target: string };
};

/* Replace api url that require CORS to proxy */
export function replaceUrlWithProxy(originalUrl: string): string {
  if (!originalUrl) return originalUrl;

  const viteProxyConfig = globalThis['viteProxyConfig'] as ProxyConfig | undefined;
  if (!viteProxyConfig) return originalUrl;

  try {
    // First try to match against proxy rules
    return Object.entries(viteProxyConfig).reduce<string>((url, [path, config]) => {
      const target = typeof config === 'string' ? config : config.target;
      if (target && url.includes(target)) {
        // Ensure we only replace the host part if it's a valid URL
        try {
          const urlObj = new URL(url);
          return url.replace(urlObj.host, proxyHost);
        } catch {
          // If URL parsing fails, do a simple string replacement
          return url.replace(target, `http://${proxyHost}`);
        }
      }
      return url;
    }, originalUrl);
  } catch (e: any) {
    return originalUrl;
  }
}

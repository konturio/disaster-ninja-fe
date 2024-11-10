export function isExternalLink(href: string) {
  const externalProtocols = ['http://', 'https://', 'mailto:'];
  return externalProtocols.some((protocol) => href.startsWith(protocol));
}

export function isInnerAnchorLink(href: string) {
  // if the hash starts at 0, it means there's no slug and it's an inner anchor link
  return href.indexOf('#') === 0;
}

interface MediaParams {
  width?: number;
  height?: number;
  allowFullscreen?: boolean;
}

export function parseMediaParams(url: string): {
  originalUrl: string;
  params: MediaParams | null;
} {
  const parts = url.split('::');
  if (parts.length !== 2) return { originalUrl: url, params: null };

  const [width, height, fullscreen] = parts[1].split(',');

  return {
    originalUrl: parts[0],
    params: {
      ...(width && { width: parseInt(width) }),
      ...(height && { height: parseInt(height) }),
      ...(fullscreen !== undefined && { allowFullscreen: fullscreen === '1' }),
    },
  };
}

const YOUTUBE_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|shorts\/)?([a-zA-Z0-9_-]{11})/;

export const isYoutubeUrl = (url: string): boolean => YOUTUBE_REGEX.test(url);

export function getYoutubeEmbedUrl(url: string): string {
  const match = url.match(YOUTUBE_REGEX);
  if (!match) return url;
  return `https://www.youtube.com/embed/${match[5]}`;
}

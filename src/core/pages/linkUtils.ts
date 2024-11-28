export function isExternalLink(href: string) {
  const externalProtocols = ['http://', 'https://', 'mailto:', 'ftp://', 'tel:'] as const;
  return externalProtocols.some((protocol) => href.startsWith(protocol));
}

export function isInnerAnchorLink(href: string) {
  return href.startsWith('#');
}

interface MediaParams {
  width?: number;
  height?: number;
  allowFullscreen?: boolean;
}

const MEDIA_PARAMS_SEPARATOR = '::';
const MEDIA_PARAMS_DELIMITER = ',';

export function parseMediaParams(url: string): {
  originalUrl: string;
  params: MediaParams | null;
} {
  const parts = url.split(MEDIA_PARAMS_SEPARATOR);
  if (parts.length !== 2) return { originalUrl: url, params: null };

  const [width, height, fullscreen] = parts[1].split(MEDIA_PARAMS_DELIMITER);

  return {
    originalUrl: parts[0],
    params: {
      ...(width && { width: parseInt(width) }),
      ...(height && { height: parseInt(height) }),
      ...(fullscreen !== undefined && { allowFullscreen: fullscreen === '1' }),
    },
  };
}

const YOUTUBE_DOMAINS = ['youtube.com', 'youtu.be'];

export const isYoutubeUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return YOUTUBE_DOMAINS.some((domain) => parsedUrl.hostname.endsWith(domain));
  } catch {
    return false;
  }
};

export function getYoutubeEmbedUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    let videoId: string | null = null;

    if (parsedUrl.hostname.includes('youtu.be')) {
      // Handle shortened URLs (youtu.be/VIDEO_ID)
      videoId = parsedUrl.pathname.slice(1);
    } else {
      // Handle youtube.com URLs
      if (parsedUrl.pathname.includes('shorts')) {
        videoId = parsedUrl.pathname.split('/shorts/')[1];
      } else if (parsedUrl.pathname.includes('embed')) {
        videoId = parsedUrl.pathname.split('/embed/')[1];
      } else {
        videoId = parsedUrl.searchParams.get('v');
      }
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  } catch {
    return url;
  }
}

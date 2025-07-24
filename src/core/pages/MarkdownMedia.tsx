import { configRepo } from '~core/config';
import {
  parseMediaParams,
  isYoutubeUrl,
  getYoutubeEmbedUrl,
  isExternalLink,
} from './linkUtils';

export function buildAssetUrl(asset: string) {
  return `${configRepo.get().apiGateway}/apps/${configRepo.get().id}/assets/${asset}`;
}

/**
 * Markdown media component that handles both images and embeds
 *
 * @example
 * ```md
 * Regular image:
 * ![Alt text](path/to/image.jpg)
 *
 * Image with dimensions:
 * ![Alt text](path/to/image.jpg::800,600)
 *
 * YouTube embed (default 560x315):
 * ![Video title](https://youtube.com/watch?v=xyz)
 *
 * YouTube with custom params:
 * ![Video title](https://youtube.com/watch?v=xyz::800,450,1)
 * ```
 */
export function MarkdownMedia({
  title,
  alt,
  src,
}: {
  title: string;
  alt: string;
  src: string;
}) {
  const { originalUrl, params } = parseMediaParams(src);

  // Handle YouTube embeds
  if (isYoutubeUrl(originalUrl)) {
    const width = params?.width ?? 560;
    const height = params?.height ?? 315;
    return (
      <iframe
        src={getYoutubeEmbedUrl(originalUrl)}
        title={title || alt || 'YouTube video player'}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen={params?.allowFullscreen ?? true}
        referrerPolicy="strict-origin-when-cross-origin"
        style={{ width: '100%', aspectRatio: `${width} / ${height}` }}
      />
    );
  }

  // Handle regular images
  let realSrc = originalUrl;
  if (!isExternalLink(originalUrl)) {
    realSrc = buildAssetUrl(originalUrl);
  }

  return (
    <img
      src={realSrc}
      alt={alt}
      title={title}
      {...(params?.width && { width: params.width })}
      {...(params?.height && { height: params.height })}
    />
  );
}

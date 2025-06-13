import s from './Image.module.css';

export interface ImageProps {
  src: string;
  alt?: string;
}

export function Image({ src, alt }: ImageProps) {
  return (
    <div className={s.image}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt ?? ''} className={s.thumb} />
    </div>
  );
}

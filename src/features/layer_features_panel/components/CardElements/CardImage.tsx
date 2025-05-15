import s from './CardImage.module.css';

type CardImageProps = {
  src: string;
};

export function CardImage({ src }: CardImageProps) {
  return (
    <div className={s.image}>
      <img src={src} className={s.thumb}></img>
    </div>
  );
}

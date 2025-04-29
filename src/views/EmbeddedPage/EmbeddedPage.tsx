import s from './EmbeddedPage.module.css';

export function EmbeddedPage({ url, title }: { url: string; title?: string }) {
  return <iframe title={title} src={url} className={s.embeddedContent} />;
}

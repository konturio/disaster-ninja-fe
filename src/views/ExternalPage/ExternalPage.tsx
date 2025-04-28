import s from './ExternalPage.module.css';

export function ExternalPage({ url }: { url: string }) {
  return (
    <iframe
      id="externalPageContainer"
      title="External page"
      src={url}
      className={s.externalContent}
    ></iframe>
  );
}

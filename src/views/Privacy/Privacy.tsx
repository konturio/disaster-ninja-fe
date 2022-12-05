import ReactMarkdown from 'react-markdown';
import privacyPolicyText from './privacyPolicy.en.md?raw';
import s from './Privacy.module.css';

export function PrivacyPage() {
  return (
    <div className={s.mainWrap}>
      <article className={s.content}>
        <ReactMarkdown className={s.markdown}>{privacyPolicyText}</ReactMarkdown>
      </article>
    </div>
  );
}

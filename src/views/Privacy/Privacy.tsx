import ReactMarkdown from 'react-markdown';
import PrivacyPolicyText from './privacyPolicy.en.mdx';
import s from './Privacy.module.css';

export function PrivacyPage() {
  return (
    <div className={s.mainWrap}>
      <article className={s.content}>
        <PrivacyPolicyText className={s.markdown} />
      </article>
    </div>
  );
}

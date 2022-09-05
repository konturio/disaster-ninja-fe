import { Finish16 } from '@konturio/default-icons';
import { useEffect, useState } from 'react';
import { i18n } from '~core/localization';
import s from './ProgressTooltip.module.css';

export const ProgressTooltip = ({ close }) => {
  const [content, setContent] = useState<JSX.Element>();

  useEffect(() => {
    setContent(renderingContent);
    setTimeout(() => {
      setContent(doneContent);

      setTimeout(() => {
        close();
      }, 800);
    }, 400);
  }, [close]);
  return <div className={s.PopupContainer}>{content}</div>;
};

const LoadingSpinner16 = () => (
  <svg
    className={s.LoadingSpinner}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.98598 2.74142C9.05221 2.38823 8.81918 2.04465 8.46088 2.01744C8.30877 2.00588 8.15507 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 7.72291 13.9812 7.45021 13.9449 7.1831C13.8964 6.82712 13.5395 6.61511 13.191 6.70225C12.8428 6.78929 12.6358 7.14218 12.6736 7.49906C12.6911 7.66365 12.7 7.83078 12.7 8C12.7 10.5957 10.5957 12.7 8 12.7C5.40426 12.7 3.3 10.5957 3.3 8C3.3 5.40426 5.40426 3.3 8 3.3C8.07433 3.3 8.14825 3.30173 8.22174 3.30514C8.58011 3.32178 8.91987 3.09403 8.98598 2.74142Z"
      fill="currentColor"
    />
  </svg>
);

const renderingContent = (
  <>
    <LoadingSpinner16 />
    {i18n.t('bivariate.matrix.progress.rendering')}
  </>
);

const doneContent = (
  <>
    <Finish16 className={s.DoneIcon} />
    {i18n.t('bivariate.matrix.progress.applied')}
  </>
);

import { Finish16, Loading16 } from '@konturio/default-icons';
import { useEffect, useState } from 'react';
import core from '~core/index';
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

const renderingContent = (
  <>
    <Loading16 className={s.LoadingSpinner} />
    {core.i18n.t('bivariate.matrix.progress.rendering')}
  </>
);

const doneContent = (
  <>
    <Finish16 className={s.DoneIcon} />
    {core.i18n.t('bivariate.matrix.progress.applied')}
  </>
);

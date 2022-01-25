import s from './BetaLabel.module.css';
import { translationService } from '~core/index';

export function BetaLabel() {
  return <div className={s.betaLabel}>{translationService.t('BETA')}</div>;
}

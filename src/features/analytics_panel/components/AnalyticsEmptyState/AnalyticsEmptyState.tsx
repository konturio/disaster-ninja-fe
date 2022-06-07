import s from './AnalyticsEmptyState.module.css';
import {
  SelectArea24,
  DisastersListIcon,
  Poly24,
  Plus24,
} from '@konturio/default-icons';
import { i18n } from '~core/localization';

interface AnalyticsEmptyStateProps {
  stateType?: 'initial' | 'not-found';
}

export const AnalyticsEmptyState = ({
  stateType = 'initial',
}: AnalyticsEmptyStateProps) => {
  return (
    <div className={s.stateContainer}>
      {stateType === 'not-found' && (
        <>
          {i18n.t('Sorry, requested event not found.')}
          <br />
        </>
      )}
      {i18n.t('Please, select an area')}
      <br />
      {i18n.t('to see state of the map')}
      <div className={s.iconsContainer}>
        <div className={s.iconRow}>
          <DisastersListIcon /> {i18n.t('Pick disaster from the list')}
        </div>
        <div className={s.iconRow}>
          <Poly24 /> {i18n.t('Draw polygon on the map')}
        </div>
        <div className={s.iconRow}>
          <SelectArea24 /> {i18n.t('Select boundary on the map')}
        </div>
        <div className={s.iconRow}>
          <Plus24 /> {i18n.t('Upload your own geoJSON')}
        </div>
      </div>
    </div>
  );
};

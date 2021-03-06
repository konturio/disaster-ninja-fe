import {
  SelectArea24,
  DisastersListIcon,
  Poly24,
  Plus24,
} from '@konturio/default-icons';
import { i18n } from '~core/localization';
import s from './AdvancedAnalyticsEmptyState.module.css';

interface AdvancedAnalyticsEmptyStateProps {
  stateType?: 'initial' | 'not-found' | 'error';
}

export const AdvancedAnalyticsEmptyState = ({
  stateType = 'initial',
}: AdvancedAnalyticsEmptyStateProps) => {
  return (
    <div className={s.stateContainer}>
      {stateType === 'not-found' && (
        <>
          {i18n.t('Sorry, requested event not found.')}
          <br />
        </>
      )}
      {stateType === 'error' && (
        <>
          {i18n.t('An error occured!')}
          <br />
        </>
      )}

      {i18n.t('Please, select an area again')}
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

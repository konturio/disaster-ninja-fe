import { Heading, Text } from '@konturio/ui-kit';
import { useAtom } from '@reatom/npm-react';
import { InfoOutline16, Rubber16 } from '@konturio/default-icons';
import { useMemo, useState } from 'react';
import { SimpleTooltip } from '@konturio/floating';
import { i18n } from '~core/localization';
import {
  referenceAreaAtom,
  resetReferenceArea,
  setReferenceArea,
} from '~core/shared_state/referenceArea';
import { goTo } from '~core/router/goTo';
import { store } from '~core/store/store';
import { updateReferenceArea } from '~core/api/features';
import { getUserLocation } from '~utils/common/userLocation';
import { getBoundaries } from '~core/api/boundaries';
import { notificationServiceInstance } from '~core/notificationServiceInstance';
import { SearchBar } from '~features/user_profile/components/SettingsForm/ReferenceAreaInfo/SearchBar';
import s from './ReferenceAreaInfo.module.css';

export function ReferenceAreaInfo() {
  const [referenceAreaGeometry] = useAtom(referenceAreaAtom);
  const [isLocationLoading, setIsLocationLoading] = useState<boolean>(false);
  const [locationLoadError, setLocationLoadError] = useState<boolean>(false);

  const referenceAreaName = useMemo(() => {
    if (
      referenceAreaGeometry?.type === 'Feature' &&
      referenceAreaGeometry.properties?.name
    ) {
      return referenceAreaGeometry.properties.name;
    }
    return i18n.t('profile.reference_area.freehand_geometry');
  }, [referenceAreaGeometry]);

  const onSelectCurrentLocation = async () => {
    setIsLocationLoading(true);
    setLocationLoadError(false);

    try {
      const coords = await getUserLocation();
      const response = await getBoundaries(coords);
      if (!response) {
        throw new Error('No response for boundaries request');
      }

      const features = response.features.sort(
        (f1, f2) => f2.properties?.admin_level - f1.properties?.admin_level,
      );

      const refArea = features[0];
      await updateReferenceArea(refArea);
      await setReferenceArea(store.v3ctx, refArea);
      notificationServiceInstance.success(
        {
          title: i18n.t('profile.reference_area.notification', {
            name: refArea.properties?.name,
          }),
        },
        2,
      );
    } catch (error) {
      setLocationLoadError(true);
      console.error('Error occurred while getting user location', error);
    } finally {
      setIsLocationLoading(false);
    }
  };

  return (
    <div className={s.infoContainer}>
      <Text type="long-m">{i18n.t('profile.reference_area.description')}</Text>

      {referenceAreaGeometry ? (
        <>
          <div className={s.geometryNameContainer}>
            <Heading type="heading-04" margins={false}>
              {referenceAreaName}
            </Heading>
            <span className={s.clean} onClick={() => resetReferenceArea(store.v3ctx)}>
              <Rubber16 />
            </span>
          </div>
          <div>
            <Text type="long-m">
              {i18n.t('profile.reference_area.to_replace_reference_area')}
            </Text>
          </div>
        </>
      ) : (
        <>
          <SearchBar />
          <div className={s.linksWrapper}>
            <a className={s.link} onClick={() => goTo('/map')}>
              {i18n.t('profile.reference_area.set_the_reference_area')}
            </a>
            <SimpleTooltip content={i18n.t('profile.reference_area.tooltip_text')}>
              <span className={s.tooltip}>
                <InfoOutline16 />
              </span>
            </SimpleTooltip>
            <span className={s.delimiter}>{i18n.t('or')}</span>
            {isLocationLoading ? (
              <span className={s.userLocationLoader}>
                {i18n.t('profile.reference_area.accessing_location')}
              </span>
            ) : locationLoadError ? (
              <span className={s.errorMessage}>
                {i18n.t('profile.reference_area.accessing_location_error')}
              </span>
            ) : (
              <button className={s.link} onClick={onSelectCurrentLocation}>
                {i18n.t('profile.reference_area.select_location')}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

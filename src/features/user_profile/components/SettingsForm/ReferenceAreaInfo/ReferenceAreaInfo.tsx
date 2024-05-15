import { Text } from '@konturio/ui-kit';
import { useAtom } from '@reatom/npm-react';
import { Rubber16 } from '@konturio/default-icons';
import { useCallback } from 'react';
import { i18n } from '~core/localization';
import { referenceAreaAtom, resetReferenceArea } from '~core/shared_state/referenceArea';
import { goTo } from '~core/router/goTo';
import { store } from '~core/store/store';
import { getReferenceAreaName } from '../utils/getReferenceAreaName';
import s from './ReferenceAreaInfo.module.css';

export function ReferenceAreaInfo() {
  const [referenceAreaGeometry] = useAtom(referenceAreaAtom);

  const onDeleteReferenceAreaClicked = useCallback(() => {
    resetReferenceArea(store.v3ctx);
  }, []);

  return (
    <div>
      {referenceAreaGeometry ? (
        <>
          <div className={s.geometryNameContainer}>
            <Text type="short-l">{getReferenceAreaName(referenceAreaGeometry)}</Text>
            <span className={s.clean} onClick={onDeleteReferenceAreaClicked}>
              <Rubber16 />
            </span>
          </div>
          <div>
            <Text type="long-m" className={s.hint}>
              {i18n.t('profile.reference_area.to_replace_reference_area')}
            </Text>
          </div>
        </>
      ) : (
        <>
          <Text type="long-m" className={s.hint}>
            {i18n.t('profile.reference_area.select_are_on_the_map')}
          </Text>
          <div className={s.clickableText} onClick={() => goTo('/')}>
            {i18n.t('profile.reference_area.set_the_reference_area')}
          </div>
        </>
      )}
    </div>
  );
}

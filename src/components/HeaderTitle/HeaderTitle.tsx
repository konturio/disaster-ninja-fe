import { useHistory } from 'react-router';
import { Text } from '@konturio/ui-kit';
import core from '~core/index';
import s from './HeaderTitle.module.css';
import type { PropsWithChildren } from 'react';

export function HeaderTitle({ children }: PropsWithChildren) {
  const history = useHistory();
  const toHomePage = () => history.push(core.config.baseUrl);

  return (
    <Text type="short-l">
      <div className={s.customAppTitle}>
        <span
          className={s.clickable}
          onClick={toHomePage}
          title={core.i18n.t('to_main_page')}
        >
          Disaster Ninja
        </span>{' '}
        {children}
      </div>
    </Text>
  );
}

import { TranslationService as i18n } from '~core/localization';
import { AnalyticsData } from '~appModule/types';
import { Panel, Text } from '@k2-packages/ui-kit';
import { createStateMap } from '~utils/atoms/createStateMap';
import s from './AnalyticsPanel.module.css';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';

export function AnalyticsPanel({
  error,
  loading,
  analyticsDataList,
}: {
  error: string | null;
  loading: boolean;
  analyticsDataList?: AnalyticsData[] | null;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (
      !isOpen &&
      (loading || error || (analyticsDataList && analyticsDataList.length))
    ) {
      setIsOpen(true);
    }
  }, [analyticsDataList, loading, error, setIsOpen]);

  const statesToComponents = createStateMap({
    error,
    loading,
    data: analyticsDataList,
  });

  const onPanelClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return (
    <div className={s.panelContainer}>
      <Panel
        header={<Text type="heading-l">{i18n.t('Analytics')}</Text>}
        onClose={onPanelClose}
        className={clsx(s.sidePannel, isOpen && s.show, !isOpen && s.hide)}
        classes={{
          header: s.header,
        }}
      >
        <div className={s.panelBody}>
          {statesToComponents({
            loading: <LoadingSpinner />,
            error: (errorMessage) => <ErrorMessage message={errorMessage} />,
            ready: (dataList) => {
              return <div>Analytics test</div>;
            },
          })}
        </div>
      </Panel>
    </div>
  );
}

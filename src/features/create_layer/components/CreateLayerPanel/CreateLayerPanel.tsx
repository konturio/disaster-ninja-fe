import s from './CreateLayerPanel.module.css';
import { Panel, Text } from '@k2-packages/ui-kit';
import clsx from 'clsx';
import { TranslationService as i18n } from '~core/localization';
import { useCallback } from 'react';
import { useAtom } from '@reatom/react';
import { activeCreateLayerAtom } from '~features/create_layer/atoms/activeCreateLayer';
import { sideControlsBarAtom } from '~core/shared_state';
import { CREATE_LAYER_CONTROL_ID } from '~features/create_layer/constants';
import { createStateMap } from '~utils/atoms';
import { Atom } from '@reatom/core';
import { CreateLayerModel } from '~features/create_layer/types';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { CreateLayerForm } from '~features/create_layer/components/CreateLayerForm/CreateLayerForm';

export function CreateLayerPanel() {
  const [ createLayerState ] = useAtom(activeCreateLayerAtom);

  let statesToComponents: ReturnType<typeof createStateMap> | undefined = undefined;
  if (createLayerState) {
    statesToComponents = createStateMap<Atom<CreateLayerModel>>(createLayerState);
  }

  const onPanelClose = useCallback(() => {
    sideControlsBarAtom.disable.dispatch(CREATE_LAYER_CONTROL_ID);
  }, []);

  return (
    <Panel
      header={<Text type="heading-l">{i18n.t('Create Layer')}</Text>}
      onClose={onPanelClose}
      className={clsx(s.sidePannel, createLayerState && s.show, !createLayerState && s.hide)}
    >
      <div className={s.panelBody}>
        {statesToComponents &&
        statesToComponents({
          loading: <LoadingSpinner />,
          error: (errorMessage) => <ErrorMessage message={errorMessage} />,
          ready: (data) => {
            return <CreateLayerForm data={data as Atom<CreateLayerModel>} />;
          },
        })}
      </div>
    </Panel>
  );
}

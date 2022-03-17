import s from './CreateLayerPanel.module.css';
import { Panel, Text } from '@k2-packages/ui-kit';
import clsx from 'clsx';
import { TranslationService as i18n } from '~core/localization';
import { useCallback } from 'react';
import { useAtom } from '@reatom/react';
import { createLayerControllerAtom } from '~features/create_layer/atoms/createLayerController';
import { sideControlsBarAtom } from '~core/shared_state';
import { CREATE_LAYER_CONTROL_ID } from '~features/create_layer/constants';
import { createStateMap } from '~utils/atoms';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { CreateLayerForm } from '~features/create_layer/components/CreateLayerForm/CreateLayerForm';
import { LayerDataAtomType } from '~features/create_layer/atoms/createLayerData';

export function CreateLayerPanel() {
  const [createLayerState, { save }] = useAtom(createLayerControllerAtom);

  let statesToComponents: ReturnType<typeof createStateMap> | undefined =
    undefined;
  if (createLayerState) {
    statesToComponents = createStateMap<LayerDataAtomType>(createLayerState);
  }

  const onPanelClose = useCallback(() => {
    sideControlsBarAtom.disable.dispatch(CREATE_LAYER_CONTROL_ID);
  }, []);

  return (
    <Panel
      header={<Text type="heading-l">{i18n.t('Create Layer')}</Text>}
      onClose={onPanelClose}
      className={clsx(
        s.sidePannel,
        createLayerState && s.show,
        !createLayerState && s.hide,
      )}
    >
      <div className={s.panelBody}>
        {statesToComponents &&
          statesToComponents({
            loading: <LoadingSpinner message={i18n.t('Saving layer...')} />,
            error: (errorMessage) => <ErrorMessage message={errorMessage} />,
            ready: (data) => {
              return (
                <CreateLayerForm
                  data={data as LayerDataAtomType}
                  onSave={save}
                  onCancel={onPanelClose}
                />
              );
            },
          })}
      </div>
    </Panel>
  );
}

import { useCallback } from 'react';
import { useAtom } from '@reatom/react';
import clsx from 'clsx';
import { Panel, Text } from '@k2-packages/ui-kit';
import { TranslationService as i18n } from '~core/localization';
import { sideControlsBarAtom } from '~core/shared_state';
import { createStateMap } from '~utils/atoms';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import type { LayerEditorFormAtomType } from '../../atoms/layerEditorForm';
import { EditLayerForm } from '../../components/EditLayerForm/EditLayerForm';
import { editableLayerControllerAtom } from '../../atoms/editableLayerController';
import { CREATE_LAYER_CONTROL_ID } from '../../constants';
import s from './EditLayerPanel.module.css';

export function EditLayerPanel() {
  const [createLayerState, { save }] = useAtom(editableLayerControllerAtom);

  let statesToComponents: ReturnType<typeof createStateMap> | undefined =
    undefined;
  if (createLayerState) {
    statesToComponents =
      createStateMap<LayerEditorFormAtomType>(createLayerState);
  }

  const onPanelClose = useCallback(() => {
    sideControlsBarAtom.disable.dispatch(CREATE_LAYER_CONTROL_ID);
  }, []);

  return (
    <Panel
      header={<Text type="heading-l">{i18n.t('Create Layer')}</Text>}
      onClose={onPanelClose}
      className={clsx(
        s.sidePanel,
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
                <EditLayerForm
                  data={data as LayerEditorFormAtomType}
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

import { useCallback } from 'react';
import { useAction, useAtom } from '@reatom/react';
import clsx from 'clsx';
import { Panel } from '@konturio/ui-kit';
import { i18n } from '~core/localization';
import { toolbarControlsAtom } from '~core/shared_state';
import { createStateMap } from '~utils/atoms';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { editTargetAtom } from '~features/create_layer/atoms/editTarget';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { EditLayerForm } from '../../components/EditLayerForm/EditLayerForm';
import { editableLayerControllerAtom } from '../../atoms/editableLayerController';
import { CREATE_LAYER_CONTROL_ID, EditTargets } from '../../constants';
import s from './EditLayerPanel.module.css';
import type { LayerEditorFormAtomType } from '../../atoms/layerEditorForm';

export function EditLayerPanel() {
  const [createLayerState, { saveLayer }] = useAtom(editableLayerControllerAtom);
  const disableSideBarControl = useAction(
    () => toolbarControlsAtom.disable(CREATE_LAYER_CONTROL_ID),
    [],
  );
  const disableEditing = useAction(
    () => editTargetAtom.set({ type: EditTargets.none }),
    [],
  );
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);

  const onPanelClose = useCallback(() => {
    disableSideBarControl();
    disableEditing();
  }, [disableEditing, disableSideBarControl]);

  const statesToComponents = createLayerState
    ? createStateMap<LayerEditorFormAtomType>(createLayerState)
    : null;

  return (
    <Panel
      header={String(i18n.t('create_layer.create_layer'))}
      onHeaderClick={onPanelClose}
      className={clsx(
        s.sidePanel,
        createLayerState && s.show,
        !createLayerState && s.hide,
      )}
      modal={{
        onModalClick: onPanelClose,
        showInModal: isMobile,
      }}
    >
      <div className={s.panelBody}>
        {statesToComponents &&
          statesToComponents({
            loading: <LoadingSpinner message={i18n.t('create_layer.saving_layer')} />,
            error: (errorMessage) => <ErrorMessage message={errorMessage} />,
            ready: (data) => {
              return (
                <EditLayerForm
                  data={data as LayerEditorFormAtomType}
                  onSave={saveLayer}
                  onCancel={onPanelClose}
                />
              );
            },
          })}
      </div>
    </Panel>
  );
}

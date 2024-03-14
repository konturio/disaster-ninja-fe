import { useAtom } from '@reatom/npm-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Input,
  MultiselectChipWithSearch,
  Text,
  ModalDialog,
  type SelectableItem,
} from '@konturio/ui-kit';
import { i18n } from '~core/localization';
import { createStateMap } from '~utils/atoms';
import { availableBivariateAxisesAtom } from '../../atoms/availableBivariateAxisesAtom';
import s from './style.module.css';
import type { Axis } from '~utils/bivariate';

type FormInitialState = {
  name: string;
  axises: { id: string; label: string }[];
};

type FormResult = {
  name: string;
  axises: Axis[];
};

export function MCDAForm({
  initialState,
  onConfirm,
}: {
  initialState: FormInitialState;
  onConfirm: (value: FormResult | null) => void;
}) {
  // Layer name input
  const [name, setName] = useState(initialState.name);
  const onNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value),
    [],
  );

  // Indicators input
  const [selectedIndicators, selectIndicators] = useState<SelectableItem[]>([]);
  const onSelectedIndicatorsChange = useCallback(
    (e: { selectedItems: SelectableItem[] }) => selectIndicators(e.selectedItems),
    [],
  );
  const [axisesResource] = useAtom(availableBivariateAxisesAtom);
  const inputItems = useMemo(
    () =>
      (axisesResource.data ?? []).map((d) => ({
        title: d.label,
        value: d.id,
      })) ?? [],
    [axisesResource],
  );

  const indicatorSelectorEmpty = selectedIndicators.length === 0;
  useEffect(() => {
    // Setup indicators input initial state after we get available indicators
    const preselected = new Set(initialState.axises.map((a) => a.id));
    if (axisesResource.data && indicatorSelectorEmpty) {
      selectIndicators(
        axisesResource.data
          .filter((a) => preselected.has(a.id))
          .map((ind) => ({ value: ind.id, title: ind.label })),
      );
    }
  }, [initialState.axises, axisesResource, indicatorSelectorEmpty]);

  // Possible exits
  const cancelAction = useCallback(() => onConfirm(null), [onConfirm]);
  const saveAction = useCallback(() => {
    if (axisesResource.data) {
      const selection = new Set(selectedIndicators.map((ind) => ind.value));
      const onlySelectedIndicators = axisesResource.data.filter((ind) =>
        selection.has(ind.id),
      );
      onConfirm({
        name,
        axises: onlySelectedIndicators,
      });
    }
  }, [axisesResource, selectedIndicators, onConfirm, name]);

  const statesToComponents = createStateMap(axisesResource);

  const indicatorsSelector = statesToComponents({
    init: <div>{'Preparing data'}</div>,
    loading: <div>{'Preparing data'}</div>,
    error: (errorMessage) => <div style={{ color: 'red' }}>{errorMessage}</div>,
    ready: () => (
      <MultiselectChipWithSearch
        label={i18n.t('mcda.modal_input_indicators')}
        selectedItems={selectedIndicators}
        items={inputItems}
        onChange={onSelectedIndicatorsChange}
        placeholder={i18n.t('mcda.modal_input_indicators_placeholder')}
        noOptionsText={i18n.t('mcda.modal_input_indicators_no_options')}
      />
    ),
  });

  return (
    <ModalDialog
      title={i18n.t('mcda.modal_title')}
      onClose={cancelAction}
      footer={
        <div className={s.buttonsRow}>
          <Button type="reset" onClick={cancelAction} variant="invert-outline">
            {i18n.t('mcda.btn_cancel')}
          </Button>
          <Button disabled={!axisesResource.data} type="submit" onClick={saveAction}>
            {i18n.t('mcda.btn_save')}
          </Button>
        </div>
      }
    >
      <div className={s.MCDAForm}>
        <Input
          type="text"
          value={name}
          onChange={onNameChange}
          renderLabel={<Text type="label">{i18n.t('mcda.modal_input_name')}</Text>}
          placeholder={i18n.t('mcda.modal_input_name_placeholder')}
        />
        {indicatorsSelector}
      </div>
    </ModalDialog>
  );
}

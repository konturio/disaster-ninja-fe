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
import { sortByAlphabet, sortByWordOccurence } from '~utils/common/sorting';
import { dispatchMetricsEvent } from '~core/metrics/dispatch';
import { availableBivariateAxesAtom } from '../../atoms/availableBivariateAxesAtom';
import { generateEmojiPrefix } from '../../utils/generateEmojiPrefix';
import s from './style.module.css';
import type { Axis } from '~utils/bivariate';

type FormInitialState = {
  name: string;
  axes: { id: string; label: string }[];
};

type FormResult = {
  name: string;
  axes: Axis[];
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
  const [nameError, setNameError] = useState<string>('');
  const onNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (!e.target.value) {
      setNameError(i18n.t('mcda.error_analysis_name_cannot_be_empty'));
    } else {
      setNameError('');
    }
  }, []);

  // Indicators input
  const [selectedIndicators, selectIndicators] = useState<SelectableItem[]>([]);
  const [selectionInitialized, setSelectionInitialized] = useState(false);

  const onSelectedIndicatorsChange = useCallback(
    (e: { selectedItems: SelectableItem[] }) => {
      dispatchMetricsEvent('mcda_add_layer');
      selectIndicators(e.selectedItems);
    },
    [],
  );
  const [axesResource] = useAtom(availableBivariateAxesAtom);
  const inputItems = useMemo(() => {
    const sortedItems = sortByAlphabet<Axis>(
      axesResource?.data ?? [],
      (axis) => axis.label,
    );
    return sortedItems.map((d) => ({
      title: `${generateEmojiPrefix(d.quotients?.[0]?.emoji)} ${d.label}`,
      value: d.id,
    }));
  }, [axesResource]);

  useEffect(() => {
    // Setup indicators input initial state after we get available indicators
    const preselected = new Set(initialState.axes.map((a) => a.id));
    if (axesResource.data && !selectionInitialized && preselected.size > 0) {
      selectIndicators(
        axesResource.data
          .filter((a) => preselected.has(a.id))
          .map((ind) => ({ value: ind.id, title: ind.label })),
      );
      setSelectionInitialized(true);
    }
  }, [initialState.axes, axesResource, selectionInitialized]);

  // Possible exits
  const cancelAction = useCallback(() => onConfirm(null), [onConfirm]);
  const saveAction = useCallback(() => {
    if (axesResource.data) {
      dispatchMetricsEvent('mcda_create');
      const selection = new Set(selectedIndicators.map((ind) => ind.value));
      const onlySelectedIndicators = axesResource.data.filter((ind) =>
        selection.has(ind.id),
      );
      onConfirm({
        name,
        axes: onlySelectedIndicators,
      });
    }
  }, [axesResource, selectedIndicators, onConfirm, name]);

  const sortDropdownItems = useCallback(
    (items: SelectableItem[], search: string): SelectableItem[] => {
      if (search) {
        sortByWordOccurence(items, (item) => item.title, search);
      }
      return items;
    },
    [],
  );

  const statesToComponents = createStateMap(axesResource);

  const indicatorsSelector = statesToComponents({
    init: <div>{'Preparing data'}</div>,
    loading: <div>{'Preparing data'}</div>,
    error: (errorMessage) => <div style={{ color: 'red' }}>{errorMessage}</div>,
    ready: () => (
      <div className={s.multiselectContainer}>
        <MultiselectChipWithSearch
          label={i18n.t('mcda.modal_input_indicators')}
          selectedItems={selectedIndicators}
          items={inputItems}
          onChange={onSelectedIndicatorsChange}
          placeholder={i18n.t('mcda.modal_input_indicators_placeholder')}
          noOptionsText={i18n.t('mcda.modal_input_indicators_no_options')}
          transformSearchResults={sortDropdownItems}
        />
      </div>
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
          <Button
            disabled={
              !axesResource.data || selectedIndicators.length === 0 || !name?.length
            }
            type="submit"
            onClick={saveAction}
          >
            {i18n.t('mcda.btn_save')}
          </Button>
        </div>
      }
    >
      <div className={s.MCDAForm} data-testid="mcda-form">
        <Input
          data-testid="mcda-input-layer-name"
          type="text"
          value={name}
          error={nameError}
          onChange={onNameChange}
          renderLabel={<Text type="label">{i18n.t('mcda.modal_input_name')}</Text>}
          placeholder={i18n.t('mcda.modal_input_name_placeholder')}
        />
        {indicatorsSelector}
      </div>
    </ModalDialog>
  );
}

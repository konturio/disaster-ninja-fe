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
import { availableBivariateAxesAtom } from '~core/bivariate/atoms/availableBivariateAxesAtom';
import { padEmojiStringToLength } from '~utils/mcda/padEmojiStringToLength';
import s from './style.module.css';
import type { MultivariateLayerConfig } from '~core/logical_layers/renderers/MultivariateRenderer/types';
import type { Axis } from '~utils/bivariate';

type FormInitialState = {
  analysisConfig?: MultivariateLayerConfig;
};

type FormResult = {
  analysisConfig: MultivariateLayerConfig;
};

export function MultivariateAnalysisForm({
  initialState,
  onConfirm,
}: {
  initialState: FormInitialState;
  onConfirm: (value: FormResult | null) => void;
}) {
  // const [analysisConfig, setAnalysisConfig] = useState(initialState.analysisConfig ?? );

  // Layer name input
  const [name, setName] = useState(initialState.analysisConfig?.name ?? '');
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
      title: `${padEmojiStringToLength(d.quotients?.[0]?.emoji)} ${d.label}`,
      value: d.id,
    }));
  }, [axesResource]);

  // Possible exits
  const cancelAction = useCallback(() => onConfirm(null), [onConfirm]);
  const saveAction = useCallback(() => {
    // TODO: pass updated config as result
    // if (axesResource.data) {
    //   const selection = new Set(selectedIndicators.map((ind) => ind.value));
    //   const onlySelectedIndicators = axesResource.data.filter((ind) =>
    //     selection.has(ind.id),
    //   );
    //   onConfirm({
    //     name,
    //     axes: onlySelectedIndicators,
    //   });
    // }
  }, [axesResource, selectedIndicators, onConfirm, name]);

  const addLayersAction = useCallback(() => {
    // TODO: add new layers to the config, re-create it and update state
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
    init: <div>{i18n.t('preparing_data')}</div>,
    loading: <div>{i18n.t('preparing_data')}</div>,
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
        <Button
          disabled={
            !axesResource.data || selectedIndicators.length === 0 || !name?.length
          }
          type="submit"
          onClick={addLayersAction}
        >
          {'Add layers'}
        </Button>
      </div>
    ),
  });

  return (
    <ModalDialog
      title={i18n.t('multivariate.multivariate_analysis')}
      onClose={cancelAction}
      footer={
        <div className={s.buttonsRow}>
          <Button type="reset" onClick={cancelAction} variant="invert-outline">
            {i18n.t('cancel')}
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
      <div>
        <div>Score</div>
        <div></div>
      </div>
    </ModalDialog>
  );
}

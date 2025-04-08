import { useAtom } from '@reatom/npm-react';
import { useCallback, useMemo, useState } from 'react';
import {
  Button,
  Input,
  MultiselectChipWithSearch,
  Text,
  ModalDialog,
  type SelectableItem,
  Select,
} from '@konturio/ui-kit';
import { Rubber16 } from '@konturio/default-icons';
import { i18n } from '~core/localization';
import { createStateMap } from '~utils/atoms';
import { sortByAlphabet, sortByWordOccurence } from '~utils/common/sorting';
import { availableBivariateAxesAtom } from '~core/bivariate/atoms/availableBivariateAxesAtom';
import { padEmojiStringToLength } from '~utils/mcda/padEmojiStringToLength';
import { createMCDALayersFromBivariateAxes } from '~utils/mcda/createMCDALayersFromBivariateAxes';
import { createEmptyMultivariateConfig } from '~features/multivariate_layer/helpers/createMultivariateConfig';
import { MCDALayerParameters } from '~features/mcda/components/MCDALayerEditor/MCDALayerParameters/MCDALayerParameters';
import { LayerActionIcon } from '~components/LayerActionIcon/LayerActionIcon';
import s from './style.module.css';
import type { MCDALayer } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { MultivariateLayerConfig } from '~core/logical_layers/renderers/MultivariateRenderer/types';
import type { Axis } from '~utils/bivariate';

type FormResult = {
  config: MultivariateLayerConfig;
};

type MultivariateDimensionsLayers = {
  score: MCDALayer[];
  base: MCDALayer[];
};

export function MultivariateAnalysisForm({
  initialConfig,
  onConfirm,
}: {
  initialConfig?: MultivariateLayerConfig;
  onConfirm: (value: FormResult | null) => void;
}) {
  // Layer name input
  const [name, setName] = useState(initialConfig?.name ?? '');
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
  const [selectedIndicators, setSelectedIndicators] = useState<SelectableItem[]>([]);
  const [dimensionsLayers, setDimensionsLayers] = useState<MultivariateDimensionsLayers>({
    score: [],
    base: [],
  });

  const onSelectedIndicatorsChange = useCallback(
    (e: { selectedItems: SelectableItem[] }) => {
      setSelectedIndicators(e.selectedItems);
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
    const config = createEmptyMultivariateConfig({
      name,
      score: dimensionsLayers.score,
      base: dimensionsLayers.base,
    });
    onConfirm({ config });
  }, [name, dimensionsLayers.score, dimensionsLayers.base, onConfirm]);

  const addLayersAction = useCallback(() => {
    if (axesResource.data) {
      const selection = new Set(selectedIndicators.map((ind) => ind.value));
      const selectedAxes = axesResource.data.filter((ind) => selection.has(ind.id));
      const newLayers = createMCDALayersFromBivariateAxes(selectedAxes);
      // console.log({ selectedAxes, newLayers });
      setDimensionsLayers((oldLayers) => ({
        score: [...(oldLayers?.score ?? []), ...newLayers],
        base: oldLayers.base,
      }));
      setSelectedIndicators([]);
    }
  }, [axesResource, selectedIndicators]);

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
          className={s.addLayersButton}
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
              !axesResource.data ||
              (dimensionsLayers.score.length === 0 &&
                dimensionsLayers.base.length === 0) ||
              !name?.length
            }
            type="submit"
            onClick={saveAction}
          >
            {i18n.t('mcda.btn_save')}
          </Button>
        </div>
      }
    >
      <div className={s.analysisForm} data-testid="mcda-form">
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
        {!!dimensionsLayers.score.length && (
          <div className={s.dimension}>
            <div className={s.dimensionName}>Score</div>
            {dimensionsLayers.score.map((mcdaLayer, index, array) => (
              <div key={`score-${index}-${mcdaLayer.name}`} className={s.layerRow}>
                <Select
                  className={s.dimensionTypeSelect}
                  type="inline"
                  value={0}
                  onChange={(e) => {
                    // console.log('type changed to:', e.selectedItem);
                  }}
                  items={[
                    { value: 0, title: 'Score' },
                    { value: 1, title: 'Base' },
                  ]}
                />
                <div>
                  <MCDALayerParameters
                    layer={mcdaLayer}
                    onLayerEdited={(editedLayer) => {
                      setDimensionsLayers((oldLayers) => ({
                        score: [
                          ...oldLayers.score.map((oldLayer) =>
                            oldLayer.id === mcdaLayer.id ? editedLayer : oldLayer,
                          ),
                        ],
                        base: oldLayers.base,
                      }));
                    }}
                  />
                </div>
                <div className={s.deleteButton}>
                  <LayerActionIcon
                    onClick={() => {
                      setDimensionsLayers((oldLayers) => ({
                        score: [
                          ...oldLayers.score.filter((layer) => layer.id !== mcdaLayer.id),
                        ],
                        base: oldLayers.base,
                      }));
                    }}
                    hint={i18n.t('layer_actions.tooltips.erase')}
                  >
                    <Rubber16 />
                  </LayerActionIcon>
                </div>
              </div>
            ))}
          </div>
        )}
        {!!dimensionsLayers.base.length && (
          <div className={s.dimension}>
            <div className={s.dimensionName}>Base</div>
            {dimensionsLayers.score.map((mcdaLayer, index) => (
              <div key={`base-${index}-${mcdaLayer.name}`}>{mcdaLayer.name}</div>
            ))}
          </div>
        )}
      </div>
    </ModalDialog>
  );
}

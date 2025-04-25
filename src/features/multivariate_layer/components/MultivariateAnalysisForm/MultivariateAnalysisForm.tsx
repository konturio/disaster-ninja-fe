import { useAtom } from '@reatom/npm-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Button,
  Input,
  MultiselectChipWithSearch,
  Text,
  ModalDialog,
  type SelectableItem,
  Checkbox,
} from '@konturio/ui-kit';
import { i18n } from '~core/localization';
import { createStateMap } from '~utils/atoms';
import { sortByAlphabet, sortByWordOccurrence } from '~utils/common/sorting';
import { availableBivariateAxesAtom } from '~core/bivariate/atoms/availableBivariateAxesAtom';
import { padEmojiStringToLength } from '~utils/mcda/padEmojiStringToLength';
import { createMCDALayersFromBivariateAxes } from '~utils/mcda/createMCDALayersFromBivariateAxes';
import { createMultivariateConfig } from '~features/multivariate_layer/helpers/createMultivariateConfig';
import { MultivariateLegend } from '~components/MultivariateLegend/MultivariateLegend';
import { DEFAULT_MULTIBIVARIATE_STEPS } from '~utils/multivariate/constants';
import { createStepsForMCDADimension } from '~features/multivariate_layer/helpers/createStepsForMCDADimension';
import { isNumber } from '~utils/common';
import { MultivariateDimensionDetails } from '../MultivariateDimensionDetails/MultivariateDimensionDetails';
import { CustomStepsInput, type CustomSteps } from '../CustomStepsInput/CustomStepsInput';
import s from './MultivariateAnalysisForm.module.css';
import type { CustomStepsErrors } from '../CustomStepsInput/CustomStepsInput';
import type { MCDALayer } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { MultivariateLayerConfig } from '~core/logical_layers/renderers/MultivariateRenderer/types';
import type { Axis } from '~utils/bivariate';

type FormResult = {
  config: MultivariateLayerConfig;
};

export type MVAFormDimensions = {
  score: MCDALayer[];
  compare: MCDALayer[];
  opacity: MCDALayer[];
};

export type MVAFormDimensionKey = keyof MVAFormDimensions;

function copyDimensions(dimensions: MVAFormDimensions): MVAFormDimensions {
  return {
    score: [...dimensions.score],
    compare: [...dimensions.compare],
    opacity: Array.isArray(dimensions.opacity) ? [...dimensions.opacity] : [],
  };
}

const DEFAULT_CUSTOM_STEPS: CustomSteps = {
  baseSteps: DEFAULT_MULTIBIVARIATE_STEPS.map((v) => v.value.toString()),
  scoreSteps: DEFAULT_MULTIBIVARIATE_STEPS.map((v) => v.value.toString()),
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
  const onNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  // Indicators input
  const [selectedIndicators, setSelectedIndicators] = useState<SelectableItem[]>([]);
  const [dimensionsLayers, setDimensionsLayers] = useState<MVAFormDimensions>({
    score: initialConfig?.score?.config.layers ?? [],
    compare: initialConfig?.base?.config.layers ?? [],
    opacity:
      initialConfig?.opacity && !isNumber(initialConfig?.opacity)
        ? initialConfig?.opacity?.config.layers
        : [],
  });
  const [isKeepColorsChecked, setKeepColorsChecked] = useState(true);
  const [isCustomStepsChecked, setCustomStepsChecked] = useState(false);
  const [customSteps, setCustomSteps] = useState<CustomSteps>(DEFAULT_CUSTOM_STEPS);
  const [customStepsErrors, setCustomStepsErrors] = useState<CustomStepsErrors | null>(
    null,
  );
  const buttonsRowRef = useRef<HTMLDivElement>(null);

  const [opacityStatic, setOpacityStatic] = useState(
    isNumber(initialConfig?.opacity) ? initialConfig?.opacity?.toString() : undefined,
  );

  const isBivariate = useMemo(
    () => !!dimensionsLayers.score.length && !!dimensionsLayers.compare.length,
    [dimensionsLayers],
  );

  const showKeepColorsCheckbox = useMemo(() => {
    const colorType = isBivariate ? 'bivariate' : 'mcda';
    return initialConfig?.colors && initialConfig?.colors?.type === colorType;
  }, [initialConfig?.colors, isBivariate]);

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

  const [showLegendPreview, setShowLegendPreview] = useState(true);

  const isConfigValid = useMemo(
    () =>
      axesResource.data &&
      (dimensionsLayers.score.length > 0 || dimensionsLayers.compare.length > 0) &&
      ((isCustomStepsChecked && !customStepsErrors) || !isCustomStepsChecked),
    [
      axesResource.data,
      customStepsErrors,
      dimensionsLayers.compare.length,
      dimensionsLayers.score.length,
      isCustomStepsChecked,
    ],
  );

  const previewConfig = useMemo(() => {
    const customStepOverrides =
      isCustomStepsChecked && !customStepsErrors
        ? {
            scoreSteps: customSteps.scoreSteps.map((v) => ({
              value: Number.parseFloat(v),
            })),
            baseSteps: customSteps.baseSteps.map((v) => ({
              value: Number.parseFloat(v),
            })),
          }
        : null;
    // mcda opacity takes precedence
    let opacity: number | MCDALayer[] | undefined = dimensionsLayers.opacity;
    if (!opacity.length && !!opacityStatic) {
      opacity = isNumber(parseFloat(opacityStatic))
        ? parseFloat(opacityStatic)
        : undefined;
    }
    return isConfigValid
      ? createMultivariateConfig(
          {
            name,
            score: dimensionsLayers.score,
            base: dimensionsLayers.compare,
            colors:
              showKeepColorsCheckbox && isKeepColorsChecked
                ? initialConfig?.colors
                : undefined,
            stepOverrides:
              isCustomStepsChecked && customStepOverrides
                ? customStepOverrides
                : initialConfig?.stepOverrides,
            opacity: opacity,
          },
          axesResource.data ?? [],
        )
      : undefined;
  }, [
    axesResource.data,
    customSteps.baseSteps,
    customSteps.scoreSteps,
    customStepsErrors,
    dimensionsLayers.compare,
    dimensionsLayers.opacity,
    dimensionsLayers.score,
    initialConfig?.colors,
    initialConfig?.stepOverrides,
    isConfigValid,
    isCustomStepsChecked,
    isKeepColorsChecked,
    name,
    opacityStatic,
    showKeepColorsCheckbox,
  ]);

  // Possible exits
  const cancelAction = useCallback(() => onConfirm(null), [onConfirm]);

  const saveAction = useCallback(() => {
    if (previewConfig) onConfirm({ config: previewConfig });
  }, [previewConfig, onConfirm]);

  const addLayersAction = useCallback(() => {
    if (axesResource.data) {
      const selection = new Set(selectedIndicators.map((ind) => ind.value));
      const selectedAxes = axesResource.data.filter((ind) => selection.has(ind.id));
      const newLayers = createMCDALayersFromBivariateAxes(selectedAxes);
      setDimensionsLayers((oldLayers) => ({
        score: [...(oldLayers?.score ?? []), ...newLayers],
        compare: oldLayers.compare,
        opacity: oldLayers.opacity,
      }));
      setSelectedIndicators([]);
    }
  }, [axesResource, selectedIndicators]);

  const sortDropdownItems = useCallback(
    (items: SelectableItem[], search: string): SelectableItem[] => {
      if (search) {
        sortByWordOccurrence(items, (item) => item.title, search);
      }
      return items;
    },
    [],
  );

  const statesToComponents = createStateMap(axesResource);

  const indicatorsSelector = statesToComponents({
    init: <div>{i18n.t('preparing_data')}</div>,
    loading: <div>{i18n.t('preparing_data')}</div>,
    error: (errorMessage) => <div className={s.error}>{errorMessage}</div>,
    ready: () => (
      <div className={s.multiselectContainer}>
        <MultiselectChipWithSearch
          className={s.layersDropdown}
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
          disabled={!axesResource.data || selectedIndicators.length === 0}
          type="submit"
          onClick={addLayersAction}
        >
          {'Add layers'}
        </Button>
      </div>
    ),
  });

  const moveLayerToDimension = useCallback(
    (updatedLayer: MCDALayer, oldDimension: string, newDimension: string) => {
      setDimensionsLayers((oldLayers) => {
        const newLayers = copyDimensions(oldLayers);
        newLayers[oldDimension] = [
          ...oldLayers[oldDimension].filter((layer) => layer.id !== updatedLayer.id),
        ];
        newLayers[newDimension] = [...oldLayers[newDimension], updatedLayer];
        return newLayers;
      });
    },
    [],
  );

  const deleteLayerFromDimension = useCallback(
    (deletedLayer: MCDALayer, dimension: string) => {
      setDimensionsLayers((oldLayers) => {
        const newLayers = copyDimensions(oldLayers);
        newLayers[dimension] = [
          ...oldLayers[dimension].filter((layer) => layer.id !== deletedLayer.id),
        ];
        return newLayers;
      });
    },
    [],
  );

  const editLayerInDimension = useCallback(
    (editedLayer: MCDALayer, dimension: string) => {
      setDimensionsLayers((oldLayers) => {
        const newLayers = copyDimensions(oldLayers);
        newLayers[dimension] = [
          ...oldLayers[dimension].map((oldLayer) =>
            oldLayer.id === editedLayer.id ? editedLayer : oldLayer,
          ),
        ];
        return newLayers;
      });
    },
    [],
  );

  const dimensionParams: {
    dimensionKey: MVAFormDimensionKey;
    dimensionTitle: string;
  }[] = [
    { dimensionKey: 'score', dimensionTitle: i18n.t('multivariate.score') },
    { dimensionKey: 'compare', dimensionTitle: i18n.t('multivariate.compare') },
    { dimensionKey: 'opacity', dimensionTitle: i18n.t('multivariate.hide_area') },
  ];

  function onCustomStepsCheckboxChanged(checked: boolean): void {
    setCustomStepsChecked(checked);

    if (checked) {
      // scroll back to buttons row, because adding custom step inputs makes the page jump
      setTimeout(() => {
        if (buttonsRowRef?.current) {
          (buttonsRowRef.current as HTMLElement).scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    const scoreSteps = initialConfig?.stepOverrides?.scoreSteps
      ? initialConfig.stepOverrides.scoreSteps.map((step) => step.value.toString())
      : createStepsForMCDADimension(dimensionsLayers.score, axesResource.data ?? []).map(
          (v) => v.value.toString(),
        );
    const baseSteps = initialConfig?.stepOverrides?.baseSteps
      ? initialConfig.stepOverrides.baseSteps.map((step) => step.value.toString())
      : createStepsForMCDADimension(
          dimensionsLayers.compare,
          axesResource.data ?? [],
        ).map((v) => v.value.toString());
    setCustomSteps({ scoreSteps, baseSteps });
    setCustomStepsErrors(null);
  }

  const onCustomStepsChanged = useCallback((newCustomSteps: CustomSteps) => {
    let hasErrors = false;
    const validateDimensionStepsInput = (dimensionStepsInput: string[]) => {
      return dimensionStepsInput.map((step) => {
        if (!isNumber(Number.parseFloat(step))) {
          hasErrors = true;
          return true;
        }
        return false;
      });
    };
    const errors: CustomStepsErrors = {
      scoreSteps: validateDimensionStepsInput(newCustomSteps.scoreSteps),
      baseSteps: validateDimensionStepsInput(newCustomSteps.baseSteps),
    };
    setCustomSteps(newCustomSteps);
    setCustomStepsErrors(hasErrors ? errors : null);
  }, []);

  return (
    <ModalDialog
      contentClassName={s.modalContent}
      className={s.modalDialog}
      title={i18n.t('multivariate.multivariate_analysis')}
      onClose={cancelAction}
      footer={
        <div className={s.buttonsRow} ref={buttonsRowRef}>
          <>
            <Checkbox
              id="showLegendCheckbox"
              checked={showLegendPreview}
              onChange={(checked) => setShowLegendPreview(checked)}
              label="Legend preview"
            />
            {showKeepColorsCheckbox && (
              <Checkbox
                id="keepColorsCheckbox"
                checked={isKeepColorsChecked}
                onChange={(checked) => setKeepColorsChecked(checked)}
                label="Keep colors"
              />
            )}
            {isBivariate && (
              <Checkbox
                id="customStepsCheckbox"
                checked={isCustomStepsChecked}
                onChange={(checked) => onCustomStepsCheckboxChanged(checked)}
                label="Custom steps"
              />
            )}
          </>
          <Button type="reset" onClick={cancelAction} variant="invert-outline">
            {i18n.t('cancel')}
          </Button>
          <Button disabled={!previewConfig} type="submit" onClick={saveAction}>
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
          onChange={onNameChange}
          renderLabel={<Text type="label">{i18n.t('mcda.modal_input_name')}</Text>}
          placeholder={i18n.t('mcda.modal_input_name_placeholder')}
        />
        {indicatorsSelector}
        <div className={s.detailsContainer}>
          {dimensionParams
            .filter(({ dimensionKey }) => dimensionsLayers[dimensionKey]?.length)
            .map(({ dimensionKey, dimensionTitle }) => (
              <MultivariateDimensionDetails
                key={`dimension-${dimensionKey}`}
                dimensionsLayers={dimensionsLayers}
                dimensionKey={dimensionKey}
                dimensionTitle={dimensionTitle}
                onLayerEdited={editLayerInDimension}
                onLayerDeleted={deleteLayerFromDimension}
                onLayerDimensionChanged={moveLayerToDimension}
              />
            ))}
          {previewConfig && !dimensionsLayers['opacity'].length && (
            <div className={s.staticOpacity}>
              <Input
                type="text"
                value={opacityStatic ?? ''}
                onChange={(e) => {
                  setOpacityStatic(e.target.value);
                }}
                renderLabel={<Text type="label">Static opacity</Text>}
                placeholder="Opacity"
              />
            </div>
          )}
          {showLegendPreview && previewConfig && (
            <div className={s.legendSection}>
              <Text type="label">Legend</Text>
              <div className={s.legendContainer}>
                <div className={s.legendPreview}>
                  <MultivariateLegend config={previewConfig} />
                </div>
              </div>
            </div>
          )}
          {isBivariate && isCustomStepsChecked && (
            <CustomStepsInput
              customSteps={customSteps}
              onCustomStepsChanged={onCustomStepsChanged}
              errors={customStepsErrors}
            />
          )}
        </div>
      </div>
    </ModalDialog>
  );
}

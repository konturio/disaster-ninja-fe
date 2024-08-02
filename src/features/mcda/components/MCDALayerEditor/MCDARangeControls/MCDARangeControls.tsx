import { Input, Text } from '@konturio/ui-kit';
import clsx from 'clsx';
import { useCallback, type Dispatch, type SetStateAction } from 'react';
import { i18n } from '~core/localization';
import { generateSigmaRange } from '~features/mcda/utils/generateSigmaRange';
import { NUMBER_FILTER } from '../MCDALayerParameters/constants';
import s from './MCDARangeControls.module.css';
import type {
  MCDALayer,
  TransformationFunction,
} from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { AxisTransformationWithPoints } from '~utils/bivariate';

type Props = {
  rangeFrom: string;
  rangeTo: string;
  setRangeFrom: Dispatch<SetStateAction<string>>;
  setRangeTo: Dispatch<SetStateAction<string>>;
  rangeFromError: string;
  rangeToError: string;
  setRangeFromError: Dispatch<SetStateAction<string>>;
  setRangeToError: Dispatch<SetStateAction<string>>;
  disabled: boolean;
  axisDatasetRange: string[] | null;
  layer: MCDALayer;
  transformationsStatistics: Map<
    TransformationFunction,
    AxisTransformationWithPoints
  > | null;
};

function MCDARangeControls({
  rangeFrom,
  rangeTo,
  setRangeFrom,
  setRangeTo,
  rangeFromError,
  rangeToError,
  setRangeFromError,
  setRangeToError,
  disabled,
  axisDatasetRange,
  layer,
  transformationsStatistics,
}: Props) {
  const setToFullDatasetRange = useCallback(() => {
    if (!disabled) {
      if (axisDatasetRange) {
        setRangeFrom(axisDatasetRange[0]);
        setRangeTo(axisDatasetRange[1]);
      } else {
        console.error(`Couldn\'nt find default range for ${layer.id}`);
      }
    }
  }, [disabled, axisDatasetRange, setRangeFrom, setRangeTo, layer.id]);

  const setToSigmaRange = useCallback(
    (numberOfSigmas: number) => {
      const noTransformStatistics = transformationsStatistics?.get('no');
      const datasetRange = [
        parseFloat(axisDatasetRange?.[0] ?? '0'),
        parseFloat(axisDatasetRange?.[1] ?? '1'),
      ];
      if (!disabled) {
        if (layer.datasetStats) {
          const [lowerSigmaRange, upperSigmaRange] = generateSigmaRange(
            layer.datasetStats,
            numberOfSigmas,
          );
          setRangeFrom(lowerSigmaRange.toString());
          setRangeTo(upperSigmaRange.toString());
        } else if (noTransformStatistics) {
          // TODO: remove this case once datasetStats is present in all MCDA presets
          const mean = noTransformStatistics.mean;
          const stddev = noTransformStatistics.stddev;
          const [lowerSigmaRange, upperSigmaRange] = generateSigmaRange(
            {
              mean,
              stddev,
              minValue: datasetRange[0],
              maxValue: datasetRange[1],
            },
            numberOfSigmas,
          );
          setRangeFrom(lowerSigmaRange.toString());
          setRangeTo(upperSigmaRange.toString());
        } else {
          console.error(`Couldn\'nt find the data to set sigma range for ${layer.id}.`);
        }
      }
    },
    [
      transformationsStatistics,
      axisDatasetRange,
      disabled,
      layer.datasetStats,
      layer.id,
      setRangeFrom,
      setRangeTo,
    ],
  );

  return (
    <>
      <div className={s.rangeInputContainer}>
        <Input
          className={s.rangeInputRoot}
          classes={{
            inputBox: s.rangeInputBox,
            error: s.hiddenError,
          }}
          type="text"
          value={rangeFrom}
          onChange={(event) => {
            const value = event.target.value.replace(NUMBER_FILTER, '');
            setRangeFrom(value);
          }}
          error={rangeFromError}
        />
        <span className={s.inputRangeDivider}>{'-'}</span>
        <Input
          className={s.rangeInputRoot}
          classes={{
            inputBox: s.rangeInputBox,
            error: s.hiddenError,
          }}
          type="text"
          value={rangeTo}
          onChange={(event) => {
            const value = event.target.value.replace(NUMBER_FILTER, '');
            setRangeTo(value);
          }}
          error={rangeToError}
        />
      </div>
      <Text type="short-m" className={s.error}>
        {rangeFromError ? rangeFromError : rangeToError}
      </Text>
      <div className={s.rangeTextButtonsContainer}>
        <span
          className={clsx(s.rangeTextButtons, {
            [s.textButtonDisabled]: disabled,
          })}
          onClick={setToFullDatasetRange}
        >
          {i18n.t('mcda.layer_editor.range_buttons.full_range')}
        </span>
        <span
          className={clsx(s.rangeTextButtons, {
            [s.textButtonDisabled]: disabled,
          })}
          onClick={() => setToSigmaRange(3)}
        >
          {i18n.t('mcda.layer_editor.range_buttons.3_sigma')}
        </span>
        <span
          className={clsx(s.rangeTextButtons, {
            [s.textButtonDisabled]: disabled,
          })}
          onClick={() => setToSigmaRange(2)}
        >
          {i18n.t('mcda.layer_editor.range_buttons.2_sigma')}
        </span>
        <span
          className={clsx(s.rangeTextButtons, {
            [s.textButtonDisabled]: disabled,
          })}
          onClick={() => setToSigmaRange(1)}
        >
          {i18n.t('mcda.layer_editor.range_buttons.1_sigma')}
        </span>
      </div>
    </>
  );
}

MCDARangeControls.propTypes = {};

export default MCDARangeControls;

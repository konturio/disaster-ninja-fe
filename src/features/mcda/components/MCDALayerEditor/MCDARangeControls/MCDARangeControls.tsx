import { Input, Text } from '@konturio/ui-kit';
import clsx from 'clsx';
import { useCallback, useEffect, type Dispatch, type SetStateAction } from 'react';
import { i18n } from '~core/localization';
import { generateSigmaRange } from '~utils/mcda/generateSigmaRange';
import { isNumber } from '~utils/common';
import { INPUT_FILTER_NUMBER } from '~utils/form/inputFilters';
import s from './MCDARangeControls.module.css';
import type { MCDALayer } from '~mcda/types';

type Props = {
  rangeFrom: string;
  rangeTo: string;
  setRangeFrom: Dispatch<SetStateAction<string>>;
  setRangeTo: Dispatch<SetStateAction<string>>;
  rangeFromError: string;
  rangeToError: string;
  setRangeFromError: Dispatch<SetStateAction<string>>;
  setRangeToError: Dispatch<SetStateAction<string>>;
  disabled?: boolean;
  axisDatasetRange: string[] | null;
  layer: MCDALayer;
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
}: Props) {
  useEffect(() => {
    const rangeFromNum = Number(rangeFrom);
    const rangeToNum = Number(rangeTo);
    let errorFrom = '';
    let errorTo = '';
    if (!isNumber(rangeFromNum)) {
      errorFrom = i18n.t('mcda.layer_editor.errors.range_must_be_a_number');
    }
    if (!isNumber(rangeToNum)) {
      errorTo = i18n.t('mcda.layer_editor.errors.range_must_be_a_number');
    }
    if (rangeFromNum > rangeToNum) {
      errorFrom = i18n.t('mcda.layer_editor.errors.range_from_cannot_be_bigger');
    }
    if (!rangeTo) {
      errorTo = i18n.t('mcda.layer_editor.errors.range_cannot_be_empty');
    }
    if (!rangeFrom) {
      errorFrom = i18n.t('mcda.layer_editor.errors.range_cannot_be_empty');
    }
    setRangeFromError(errorFrom);
    setRangeToError(errorTo);
  }, [rangeFrom, rangeTo, setRangeFromError, setRangeToError]);

  const setToFullDatasetRange = useCallback(() => {
    if (!axisDatasetRange) {
      console.error(`Couldn't find default range for ${layer.id}`);
      return;
    }
    setRangeFrom(axisDatasetRange[0]);
    setRangeTo(axisDatasetRange[1]);
  }, [axisDatasetRange, setRangeFrom, setRangeTo, layer.id]);

  const setToSigmaRange = useCallback(
    (numberOfSigmas: number) => {
      if (!layer.datasetStats) {
        console.error(`Couldn\'t find the data to set sigma range for ${layer.id}`);
        return;
      }
      const [lowerSigmaRange, upperSigmaRange] = generateSigmaRange(
        layer.datasetStats,
        numberOfSigmas,
      );
      setRangeFrom(lowerSigmaRange.toString());
      setRangeTo(upperSigmaRange.toString());
    },
    [layer.datasetStats, layer.id, setRangeFrom, setRangeTo],
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
            const value = event.target.value.replace(INPUT_FILTER_NUMBER, '');
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
            const value = event.target.value.replace(INPUT_FILTER_NUMBER, '');
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

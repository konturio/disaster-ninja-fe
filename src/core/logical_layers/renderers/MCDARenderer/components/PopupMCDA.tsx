import { useMemo } from 'react';
import { capitalize } from '~utils/common';
import { roundNumberToPrecision } from '~utils/common/roundNumberToPrecision';
import { i18n } from '~core/localization';
import s from './PopupMCDA.module.css';
import type { MCDALayer } from '../../stylesConfigs/mcda/types';
import type { PopupMCDAProps } from '../types';

function OneLayerPopup({
  layer,
  normalized,
  resultMCDA,
}: {
  normalized: {
    [key: string]: {
      norm: number;
      val: number;
      numValue: number;
      denValue: number;
    };
  };
  resultMCDA: number;
  layer: MCDALayer;
}) {
  const key = `${layer.axis[0]}-${layer.axis[1]}`;

  const { numLabel, denLabel, resultLabel } = useMemo(() => {
    const [numLabel, denLabel] = layer.axis.map((ax) =>
      capitalize(ax.replaceAll('_', ' ')),
    );
    const resultLabel =
      layer.normalization === 'no' && layer.transformation?.transformation === 'no'
        ? `${numLabel} / ${denLabel}`
        : i18n.t('map_popup.normalized_value');
    return { numLabel, denLabel, resultLabel };
  }, [layer]);

  return (
    <ul className={s.list}>
      <li>
        <span className={s.entryName}>{numLabel}:</span>{' '}
        {roundNumberToPrecision(normalized[key].numValue, 3, false, 2)}
      </li>
      <li>
        <span className={s.entryName}>{denLabel}:</span>{' '}
        {roundNumberToPrecision(normalized[key].denValue, 3, false, 2)}
      </li>
      <li>
        <span className={s.entryName}>{resultLabel}:</span>{' '}
        {roundNumberToPrecision(resultMCDA, 2, true)}
      </li>
    </ul>
  );
}

type MultiLayerPopup = PopupMCDAProps;
function MultiLayerPopup({ layers, normalized, resultMCDA }: MultiLayerPopup) {
  return (
    <table>
      <thead>
        <tr>
          <th>{i18n.t('layer')}</th>
          <th>{i18n.t('map_popup.range')}</th>
          <th>{i18n.t('map_popup.coefficient')}</th>
          <th>{i18n.t('map_popup.value')}</th>
          <th>{i18n.t('map_popup.normalized_value')}</th>
        </tr>
      </thead>
      <tbody className={s.tableBody}>
        {layers.map(({ axis, range, coefficient }, index) => {
          const [min, max] = range;
          const [num, den] = axis;

          return (
            <tr key={`${num}-${den}-${index}`}>
              <td>
                {num} / {den}
              </td>
              <td>
                {roundNumberToPrecision(min, 2, true)} -{' '}
                {roundNumberToPrecision(max, 2, true)}
              </td>
              <td>{coefficient}</td>
              <td>{roundNumberToPrecision(normalized[`${num}-${den}`].val, 3)}</td>
              <td>{roundNumberToPrecision(normalized[`${num}-${den}`].norm, 3)}</td>
            </tr>
          );
        })}
        <tr>
          <td colSpan={5}>
            <b className={s.result}>
              Result: {roundNumberToPrecision(resultMCDA, 2, true)}
            </b>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export function PopupMCDA({ layers, normalized, resultMCDA }: PopupMCDAProps) {
  return layers.length === 1 ? (
    <OneLayerPopup
      layer={layers.at(0)!}
      normalized={normalized}
      resultMCDA={resultMCDA}
    />
  ) : (
    <MultiLayerPopup layers={layers} normalized={normalized} resultMCDA={resultMCDA} />
  );
}

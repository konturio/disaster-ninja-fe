import { useMemo } from 'react';
import { capitalize } from '~utils/common';
import { roundNumberToPrecision } from '~utils/common/roundNumberToPrecision';
import s from './PopupMCDA.module.css';
import type { PopupMCDAProps } from '../types';

export function OneLayerPopup({
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
  layer: {
    axis: [string, string];
    range: [number, number];
    sentiment: [string, string];
    coefficient: number;
  };
}) {
  const key = `${layer.axis[0]}-${layer.axis[1]}`;
  const [num, den] = useMemo(
    () => layer.axis.map((ax) => capitalize(ax.replaceAll('_', ' '))),
    [layer],
  );
  return (
    <ul className={s.list}>
      <li>
        <span className={s.entryName}>{num}:</span>{' '}
        {roundNumberToPrecision(normalized[key].numValue, 3, false, 2)}
      </li>
      <li>
        <span className={s.entryName}>{den}:</span>{' '}
        {roundNumberToPrecision(normalized[key].denValue, 3, false, 2)}
      </li>
      <li>
        <span className={s.entryName}>
          {num} / {den}:
        </span>{' '}
        {roundNumberToPrecision(resultMCDA, 2, true)}
      </li>
    </ul>
  );
}

type MultiLayerPopup = PopupMCDAProps;
export function MultiLayerPopup({ layers, normalized, resultMCDA }: MultiLayerPopup) {
  return (
    <table>
      <thead>
        <tr>
          <th>Layer</th>
          <th>Range</th>
          <th>Coefficient</th>
          <th>Value</th>
          <th>Normalized Value</th>
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

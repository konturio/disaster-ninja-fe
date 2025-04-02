import { useMemo } from 'react';
import { capitalize } from '~utils/common';
import s from './PopupMCDA.module.css';
import type { PopupMCDAProps } from '../types';

function formatValue(value: number): string {
  if (Math.abs(value) < 0.00001 && Math.abs(value) > 0) {
    return value.toExponential(3);
  } else {
    return parseFloat(value.toFixed(3)).toString();
  }
}

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
        {formatValue(normalized[key].numValue)}
      </li>
      <li>
        <span className={s.entryName}>{den}:</span>{' '}
        {formatValue(normalized[key].denValue)}
      </li>
      <li>
        <span className={s.entryName}>
          {num} / {den}:
        </span>{' '}
        {formatValue(resultMCDA)}
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
                {min} - {max}
              </td>
              <td>{coefficient}</td>
              <td>{normalized[`${num}-${den}`].val.toFixed(2)}</td>
              <td>{normalized[`${num}-${den}`].norm.toFixed(2)}</td>
            </tr>
          );
        })}
        <tr>
          <td colSpan={5}>
            <b className={s.result}>Result: {resultMCDA.toFixed(2)}</b>
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

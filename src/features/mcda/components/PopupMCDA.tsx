import s from './PopupMCDA.module.css';
import type { JsonMCDA } from '../atoms/mcdaCalculation';

export type PopupMCDAProps = {
  json: JsonMCDA;
  normalized: {
    [key: string]: { norm: number; val: number };
  };
  resultMCDA: number;
};

export const PopupMCDA = ({ json, normalized, resultMCDA }: PopupMCDAProps) => (
  <table>
    <thead>
      <tr>
        <th>Layer</th>
        <th>Range</th>
        <th>Coeffitient</th>
        <th>Value</th>
        <th>Normalized Value</th>
      </tr>
    </thead>
    <tbody className={s.tableBody}>
      {json.layers.map(({ axis, range, coefficient }) => {
        const [min, max] = range;
        const [num, den] = axis;

        return (
          <tr key={`${num}-${den}`}>
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

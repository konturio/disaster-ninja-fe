import { generateMCDAPopupTable } from '../../MCDARenderer/popup';
import type { MultivariateLayerConfig } from '../types';

export function PopupMultivariate(
  feature: GeoJSON.Feature,
  config: MultivariateLayerConfig,
) {
  const baseMCDAAxes = config.base.config.layers;
  const baseTable = (
    <>
      <div>Base:</div>
      <div>{generateMCDAPopupTable(feature, baseMCDAAxes)}</div>
    </>
  );
  let annexTable;
  if (config.annex) {
    const annexMCDAAxes = config.annex?.config.layers ?? [];
    annexTable = (
      <>
        <div>Annex:</div>
        <div>{generateMCDAPopupTable(feature, annexMCDAAxes)}</div>
      </>
    );
  }

  // strength
  let strengthTable;
  if (config.strength) {
    if (typeof config.strength === 'number') {
      strengthTable = <div>Strength: {config.strength}</div>;
    } else {
      const strengthMCDAAxes = config.strength.config.layers;
      strengthTable = (
        <>
          <div>Strength:</div>
          {generateMCDAPopupTable(feature, strengthMCDAAxes)}
        </>
      );
    }
  }
  let extrusionHeightTable;
  if (config.extrusionMax) {
    if (typeof config.extrusionMax === 'number') {
      extrusionHeightTable = <div>Extrusion height: {config.extrusionMax}</div>;
    } else {
      const extrusionHeightMCDAAxes = config.extrusionMax.config.layers;
      extrusionHeightTable = (
        <>
          <div>Extrusion height:</div>
          <div>{generateMCDAPopupTable(feature, extrusionHeightMCDAAxes)}</div>
        </>
      );
    }
  }

  return (
    <>
      {baseTable}
      {annexTable}
      {strengthTable}
      {extrusionHeightTable}
    </>
  );
}

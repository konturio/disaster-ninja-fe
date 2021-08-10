import React from 'react';
import { createSelector } from 'reselect';
import * as selectors from '@appModule/selectors';
import { StateWithAppModule } from '@appModule/types';
import { connect, ConnectedProps } from 'react-redux';
import styles from './MapStatusCaption.module.scss';

const captionSelector = createSelector(
  [
    selectors.stats,
    selectors.xNumerators,
    selectors.yNumerators,
    selectors.correlationMatrix,
    selectors.matrixSelection,
  ],
  (stats, xNumerators, yNumerators, matrix, matrixSelection) => {
    if (
      !stats ||
      !stats.indicators ||
      !xNumerators ||
      !yNumerators ||
      !matrix ||
      !matrixSelection ||
      matrixSelection.xNumerator === null ||
      matrixSelection.yNumerator === null
    )
      return null;

    const xDenominator = xNumerators.find(
      (num) => num.numeratorId === matrixSelection.xNumerator,
    )?.selectedDenominator;
    const yDenominator = yNumerators.find(
      (num) => num.numeratorId === matrixSelection.yNumerator,
    )?.selectedDenominator;
    if (!xDenominator || !yDenominator) return null;

    const xAxisLabel = stats.indicators.find(
      (ind) => ind.name === matrixSelection.xNumerator,
    )?.label;
    const yAxisLabel = stats.indicators.find(
      (ind) => ind.name === matrixSelection.yNumerator,
    )?.label;
    const xDenominatorLabel = stats.indicators.find(
      (ind) => ind.name === xDenominator,
    )?.label;
    const yDenominatorLabel = stats.indicators.find(
      (ind) => ind.name === yDenominator,
    )?.label;

    let caption = `This map shows relation of ${xAxisLabel} (normalized by ${xDenominatorLabel}) to the base of ${yAxisLabel} (normalized by ${yDenominatorLabel}).`;
    // find correlation
    const xIndex = xNumerators.findIndex(
      (numerator) => numerator.numeratorId === matrixSelection.xNumerator,
    );
    const yIndex = yNumerators.findIndex(
      (numerator) => numerator.numeratorId === matrixSelection.yNumerator,
    );
    if (xIndex !== -1 && yIndex !== -1) {
      const correlation = matrix[yIndex][xIndex];
      if (correlation !== null) {
        caption += ` Correlation is ${correlation.toFixed(3)}`;
      }
    }

    caption += ')';
    return caption;
  },
);

const mapStateToProps = (state: StateWithAppModule) => ({
  caption: captionSelector(state),
});

const connector = connect(mapStateToProps);

const MapStatusCaption = ({ caption }: ConnectedProps<typeof connector>) =>
  caption ? <div className={styles.caption}>{caption}</div> : null;

export default connector(MapStatusCaption);

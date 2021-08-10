import { AxisControl } from '@k2-packages/ui-kit';
import React, { forwardRef, useCallback } from 'react';
import { createSelector } from 'reselect';
import { connect, ConnectedProps } from 'react-redux';
import { Axis, Indicator } from '@k2-packages/bivariate-tools';
import * as selectors from '@appModule/selectors';
import {
  NumeratorWithDenominators,
  StateWithAppModule,
} from '@appModule/types';
import { setMatrixSelection, setNumerators } from '@appModule/actions';

const qualityFormat = (quality?) =>
  quality ? Math.floor(quality * 100) : undefined;

const selectedCellSelector = createSelector(
  [selectors.matrixSelection, selectors.xNumerators, selectors.yNumerators],
  (selection, xNumerators, yNumerators) => {
    const xIndex = xNumerators?.findIndex(
      (numerator) => numerator.numeratorId === selection?.xNumerator,
    );
    const yIndex = yNumerators?.findIndex(
      (numerator) => numerator.numeratorId === selection?.yNumerator,
    );

    return { x: xIndex, y: yIndex };
  },
);

const mapHeaderCell = (
  numerator: NumeratorWithDenominators,
  indicators: Indicator[],
  axis: Axis[],
) => ({
  label:
    indicators.find((indicator) => indicator.name === numerator.numeratorId)
      ?.label || '',
  selectedDenominator: {
    id: numerator.selectedDenominator,
    label: indicators.find(
      (indicator) => indicator.name === numerator.selectedDenominator,
    )?.label,
  },
  quality: qualityFormat(
    axis.find(
      (ax) =>
        ax.quotient[0] === numerator.numeratorId &&
        ax.quotient[1] === numerator.selectedDenominator,
    )?.quality,
  ),
  denominators: numerator.denominators.map((denId) => ({
    id: denId,
    label: indicators.find((indicator) => indicator.name === denId)?.label,
    quality: qualityFormat(
      axis.find(
        (ax) =>
          ax.quotient[0] === numerator.numeratorId && ax.quotient[1] === denId,
      )?.quality,
    ),
  })),
});

const headingsSelector = createSelector(
  [selectors.xNumerators, selectors.yNumerators, selectors.stats],
  (xNumerators, yNumerators, stats) => {
    if (
      !stats ||
      !stats.indicators ||
      !xNumerators ||
      !xNumerators.length ||
      !yNumerators ||
      !yNumerators.length
    ) {
      return null;
    }

    const mapWithIndicators = (numerator: NumeratorWithDenominators) =>
      mapHeaderCell(numerator, stats?.indicators, stats?.axis);

    return {
      x: xNumerators.map(mapWithIndicators),
      y: yNumerators.map(mapWithIndicators),
    };
  },
);

const mapStateToProps = (state: StateWithAppModule) => ({
  matrix: selectors.correlationMatrix(state),
  xNumerators: selectors.xNumerators(state),
  yNumerators: selectors.yNumerators(state),
  headings: headingsSelector(state),
  selectedCell: selectedCellSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  dSelectNumerator: (xNumerator: string | null, yNumerator: string | null) =>
    dispatch(setMatrixSelection(xNumerator, yNumerator)),
  dSetNumerators: (
    numX: NumeratorWithDenominators[],
    numY: NumeratorWithDenominators[],
  ) => dispatch(setNumerators(numX, numY)),
});

const connector = connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
});

const ConnectedAxisControl = forwardRef<HTMLDivElement | null, any>(
  (
    {
      selectedCell,
      matrix,
      xNumerators,
      yNumerators,
      headings,
      dSelectNumerator,
      dSetNumerators,
    }: ConnectedProps<typeof connector>,
    ref,
  ) => {
    const onSelectCellHandler = useCallback(
      (e, { x, y }) => {
        if (
          !xNumerators ||
          !yNumerators ||
          (x === selectedCell.x && y === selectedCell.y)
        )
          return;
        dSelectNumerator(
          x !== -1 ? xNumerators[x].numeratorId : null,
          y !== -1 ? yNumerators[y].numeratorId : null,
        );
      },
      [xNumerators, yNumerators, selectedCell],
    );

    const onSelectDenominator = useCallback(
      (horizontal: boolean, index: number, denId: string) => {
        const props = horizontal ? yNumerators : xNumerators;
        if (xNumerators && yNumerators && props) {
          const newProps = [...props];
          newProps[index] = { ...props[index], selectedDenominator: denId };
          if (horizontal) {
            dSetNumerators(xNumerators, newProps);
          } else {
            dSetNumerators(newProps, yNumerators);
          }

          // refresh colors
          if (
            selectedCell.x !== null &&
            selectedCell.y !== null &&
            selectedCell.x !== -1 &&
            selectedCell.y !== -1 &&
            ((horizontal && selectedCell.y === index) ||
              (!horizontal && selectedCell.x === index))
          ) {
            dSelectNumerator(
              xNumerators[selectedCell.x].numeratorId,
              yNumerators[selectedCell.y].numeratorId,
            );
          }
        }
      },
      [xNumerators, yNumerators, selectedCell],
    );

    return matrix && headings ? (
      <AxisControl
        ref={ref}
        matrix={matrix}
        xHeadings={headings.x}
        yHeadings={headings.y}
        onSelectCell={onSelectCellHandler}
        selectedCell={selectedCell}
        onSelectDenominator={onSelectDenominator}
      />
    ) : null;
  },
);

export default connector(ConnectedAxisControl);

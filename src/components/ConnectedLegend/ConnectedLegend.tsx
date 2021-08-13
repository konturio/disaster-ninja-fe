import { connect, ConnectedProps } from 'react-redux';
import { Legend } from '@k2-packages/ui-kit/src/index';
import { createSelector } from 'reselect';
import * as selectors from '@appModule/selectors';
import { StateWithAppModule } from '@appModule/types';
import { invertClusters } from '@k2-packages/bivariate-tools';
import styles from './ConnectedLegend.module.css';

interface ConnectedLegendProps {
  showAxisLabels?: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  showOverlayTitle?: boolean;
}

const showTitleSelector = (
  state: StateWithAppModule,
  props: ConnectedLegendProps,
) => props.showOverlayTitle;

const titleSelector = createSelector(
  [showTitleSelector, selectors.selectedOverlayIndex, selectors.stats],
  (showTitle, overlayIndex, stats) =>
    showTitle && overlayIndex !== -1
      ? stats?.overlays[overlayIndex].name
      : undefined,
);

const axisesSelector = createSelector(
  [
    selectors.matrixSelection,
    selectors.xNumerators,
    selectors.yNumerators,
    selectors.stats,
  ],
  (selection, xNumerators, yNumerators, stats) => {
    if (!selection || !xNumerators || !yNumerators || !stats) return null;

    const xDenominator = xNumerators.find(
      (num) => num.numeratorId === selection.xNumerator,
    )?.selectedDenominator;
    const yDenominator = yNumerators.find(
      (num) => num.numeratorId === selection.yNumerator,
    )?.selectedDenominator;

    if (!xDenominator || !yDenominator) return null;

    const { axis, indicators } = stats;
    let xAxis: any = axis.find(
      (ax) =>
        ax.quotient[0] === selection.xNumerator &&
        ax.quotient[1] === xDenominator,
    );
    let yAxis: any = axis.find(
      (ax) =>
        ax.quotient[0] === selection.yNumerator &&
        ax.quotient[1] === yDenominator,
    );

    if (!xAxis.label) {
      xAxis = {
        ...xAxis,
        label: indicators.find((ind) => ind.name === xAxis.quotient[0])?.label,
      };
    }

    if (!yAxis.label) {
      yAxis = {
        ...yAxis,
        label: indicators.find((ind) => ind.name === yAxis.quotient[0])?.label,
      };
    }
    // swap axises
    return { x: yAxis, y: xAxis };
  },
);

const mapStateToProps = (
  state: StateWithAppModule,
  props: ConnectedLegendProps,
) => ({
  legendCells: selectors.legendCells(state),
  selectedAxises: axisesSelector(state),
  title: titleSelector(state, props),
});

const connector = connect(mapStateToProps);

const ConnectedLegend = ({
  selectedAxises,
  legendCells,
  showAxisLabels = false,
  title,
}: ConnectedProps<typeof connector> & ConnectedLegendProps) =>
  selectedAxises && legendCells ? (
    <div className={styles.connectedLegendContainer}>
      <Legend
        showAxisLabels={showAxisLabels}
        size={3}
        cells={invertClusters(legendCells, 'label')}
        axis={selectedAxises as any}
        title={title}
      />
    </div>
  ) : null;

export default connector(ConnectedLegend);

import React, { useState, useEffect } from 'react';
import { Selector } from '@k2-packages/ui-kit';
import { connect, ConnectedProps } from 'react-redux';
import clsx from 'clsx';
import LinkBtn from '@components/DenominatorsSelector/components/LinkBtn/LinkBtn';
import { setDenominator } from '@appModule/actions';
import * as selectors from '@appModule/selectors';
import { DenominatorValues, StateWithAppModule } from '@appModule/types';
import styles from './DenominatorsSelector.module.scss';

const mapStateToProps = (state: StateWithAppModule) => ({
  currentDenominator: selectors.denominatorsCurrent(state),
  availableDenominators: selectors.denominatorsAvailable(state),
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentDenominator: (values: DenominatorValues) => {
    dispatch(setDenominator(values));
  },
});

const connector = connect(mapStateToProps, mapDispatchToProps);

const mapDenominatorToOptions = (den) => ({
  label: den.quality ? (
    <>
      {den.label}
      <span className={styles.qualityLabel}>
        ({Math.floor(den.quality * 100)})
      </span>
    </>
  ) : (
    den.label
  ),
  value: den.value,
});

const DenominatorsSelector = ({
  currentDenominator,
  availableDenominators,
  setCurrentDenominator,
}: ConnectedProps<typeof connector>) => {
  // Set defaults
  useEffect(() => {
    if (availableDenominators === undefined) return;
    if (currentDenominator !== undefined) return;
    // TODO: Add check - if available not include selected
    setCurrentDenominator({
      x: availableDenominators.x[0].value,
      y: availableDenominators.y[0].value,
    });
  }, [availableDenominators]);

  // Link denominators
  const [isDenominatorsLinked, setDenominatorsLinked] = useState(
    !(currentDenominator && currentDenominator.x !== currentDenominator.y),
  );

  const switchDenominators = (value: string, axis: 'x' | 'y') => {
    if (isDenominatorsLinked) {
      setCurrentDenominator({
        x: value,
        y: value,
      });
    } else {
      setCurrentDenominator({
        ...currentDenominator,
        [axis]: value,
      });
    }
  };

  return (
    currentDenominator && (
      <div className={styles.controlsBar}>
        <div>
          <div className={styles.denominatorLabel}>Annex axis denominator</div>
          <Selector
            className={styles.selector}
            selected={currentDenominator.x ?? undefined}
            small
            collapse={false}
            onChange={(value): void => switchDenominators(value, 'x')}
            options={availableDenominators.x.map(mapDenominatorToOptions)}
          />
        </div>
        <LinkBtn
          isActive={isDenominatorsLinked}
          onClick={() => setDenominatorsLinked((curr) => !curr)}
        />
        <div className={styles.rightDenominator}>
          <div className={styles.denominatorLabel}>Base axis denominator</div>
          <Selector
            className={clsx(styles.selector)}
            selected={currentDenominator.y ?? undefined}
            small
            collapse={false}
            onChange={(value): void => switchDenominators(value, 'y')}
            options={availableDenominators.y.map(mapDenominatorToOptions)}
          />
        </div>
      </div>
    )
  );
};

export default connector(DenominatorsSelector);

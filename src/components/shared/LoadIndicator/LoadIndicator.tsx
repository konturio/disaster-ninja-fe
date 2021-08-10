import React from 'react';
import { StateWithAppModule } from '@appModule/types';
import * as selectors from '@appModule/selectors';
import { connect, ConnectedProps } from 'react-redux';
import styles from './LoadIndicator.module.scss';

const mapStateToProps = (state: StateWithAppModule) => ({
  showIndicator: selectors.showLoadingIndicator(state),
});

const connector = connect(mapStateToProps);

const LoadIndicator = ({ showIndicator }: ConnectedProps<typeof connector>) =>
  showIndicator ? (
    <>
      <div className={styles.modalBG} />
      <div className={styles.loadIndicator}>
        <i className="icon is-medium fas fa-spinner fa-pulse" />
      </div>
    </>
  ) : null;

export default connector(LoadIndicator);

import { useCallback } from 'react';
import { Overlay } from '@k2-packages/bivariate-tools/';
import { connect, ConnectedProps } from 'react-redux';
import * as selectors from '~appModule/selectors';
import { setSelectedOverlayIndex } from '~appModule/actions';
import { StateWithAppModule } from '~appModule/types';
import styles from './OverlaySelector.module.css';

interface OverlayItemProps {
  overlay: Overlay;
  isSelected: boolean;
  index: number;
  onSelect: (overlayIndex: number) => void;
}

const OverlayItem = ({
  overlay,
  isSelected,
  index,
  onSelect,
}: OverlayItemProps) => (
  <li title={overlay.description} className={styles.overlayItem}>
    <input
      type="radio"
      onClick={() => {
        onSelect(index);
      }}
      checked={isSelected}
      readOnly
    />
    {overlay.name}
  </li>
);

const mapStateToProps = (state: StateWithAppModule) => ({
  overlays: selectors.stats(state)?.overlays,
  overlayIndex: selectors.selectedOverlayIndex(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSelectedOverlay: (selectedOverlay: number) => {
    dispatch(setSelectedOverlayIndex(selectedOverlay));
  },
});

const connector = connect(mapStateToProps, mapDispatchToProps);

const OverlaySelector = ({
  overlays,
  overlayIndex,
  dispatchSelectedOverlay,
}: ConnectedProps<typeof connector>) => {
  const setSelectedOverlay = useCallback(
    (selectedOverlay: number) => {
      if (selectedOverlay !== overlayIndex) {
        dispatchSelectedOverlay(selectedOverlay);
      }
    },
    [dispatchSelectedOverlay, overlayIndex],
  );

  if (!overlays || overlays.length === 0) return null;

  return (
    <div className={styles.overlaysSelector}>
      <div className={styles.selectorCaption}>Select preset:</div>
      <ul className={styles.overlaysList}>
        {overlays.map((overlay, index) => (
          <OverlayItem
            key={overlay.name}
            overlay={overlay}
            isSelected={overlayIndex === index}
            index={index}
            onSelect={setSelectedOverlay}
          />
        ))}
      </ul>
    </div>
  );
};

export default connector(OverlaySelector);

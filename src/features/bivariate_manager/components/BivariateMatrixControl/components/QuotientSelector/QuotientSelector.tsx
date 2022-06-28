import { memo, useCallback } from 'react';
import cn from 'clsx';
import DenominatorIcon from '../DenominatorIcon/DenominatorIcon';
import { useHeadingGlobalState } from '../../utils/globalState';
import styles from './QuotientSelector.module.css';

interface QuotientItemProps {
  numeratorId: string;
  denominatorId: string;
  numeratorLabel?: string;
  quality?: number | null;
  onSelectQuotient: (numId: string, denId: string) => void;
}

const QuotientItem = ({
  numeratorId,
  denominatorId,
  numeratorLabel,
  quality,
  onSelectQuotient,
}: QuotientItemProps) => {
  const onClick = (ev) => {
    ev.stopPropagation();
    onSelectQuotient(numeratorId, denominatorId);
  };

  return (
    <div onClick={onClick}>
      <DenominatorIcon iconId={denominatorId} />
      <div className="qualityLabel">
        {quality !== null && quality !== undefined ? quality : '&nbsp;'}
      </div>
      <div className="quotientLabel">{numeratorLabel}</div>
    </div>
  );
};

interface QuotientSelectorProps {
  id: string;
  quotients: {
    id: [string, string];
    label?: string;
    quality?: number;
  }[];
  selectedQuotient: {
    id: [string, string];
    label?: string;
  };
  onSelectQuotient: (numId: string, denId: string) => void;
  type: 'horizontal' | 'vertical';
}

const QuotientSelectorEnabled = ({
  id,
  quotients,
  selectedQuotient,
  onSelectQuotient,
  type,
}: QuotientSelectorProps) => {
  const [headingState, setHeadingState] = useHeadingGlobalState();

  const toggleVisibility = () => {
    if (headingState.headingId === id) {
      setHeadingState({ headingId: '' });
    } else {
      setHeadingState({ headingId: id });
    }
  };

  const selectQuotient = useCallback(
    (numId: string, denId: string) => {
      setHeadingState({ headingId: '' });
      onSelectQuotient(numId, denId);
    },
    [setHeadingState, onSelectQuotient],
  );

  return (
    <div
      className={cn({
        [styles.denominators]: true,
        [styles.row]: type === 'horizontal',
        [styles.column]: type === 'vertical',
      })}
    >
      <div className={styles.denominatorSelector} onClick={toggleVisibility}>
        <i className="fas fa-caret-down" />
      </div>
      {headingState.headingId === id && (
        <div className={styles.denominatorsContainer}>
          {quotients.map(({ id, label: numeratorLabel, quality }) =>
            id[0] !== selectedQuotient.id[0] ||
            id[1] !== selectedQuotient.id[1] ? (
              <QuotientItem
                key={JSON.stringify(id)}
                onSelectQuotient={selectQuotient}
                quality={quality}
                numeratorId={id[0]}
                denominatorId={id[1]}
                numeratorLabel={numeratorLabel}
              />
            ) : null,
          )}
        </div>
      )}
    </div>
  );
};

const QuotientSelectorDisabled = ({
  type,
}: {
  type: 'horizontal' | 'vertical';
}) => (
  <div
    className={cn({
      [styles.denominators]: true,
      [styles.row]: type === 'horizontal',
      [styles.column]: type === 'vertical',
    })}
  >
    <div className={cn(styles.denominatorSelector, styles.disabled)}>
      <i className="fas fa-caret-down" />
    </div>
  </div>
);

export const QuotientSelector = memo(
  ({
    id,
    quotients,
    selectedQuotient,
    onSelectQuotient,
    type,
  }: QuotientSelectorProps) => {
    return quotients.length > 1 ? (
      <QuotientSelectorEnabled
        id={id}
        quotients={quotients}
        selectedQuotient={selectedQuotient}
        onSelectQuotient={onSelectQuotient}
        type={type}
      />
    ) : (
      <QuotientSelectorDisabled type={type} />
    );
  },
);

QuotientSelector.displayName = 'QuotientSelector';

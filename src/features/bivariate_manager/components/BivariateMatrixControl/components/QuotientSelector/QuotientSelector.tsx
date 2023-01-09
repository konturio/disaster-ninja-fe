import { memo, useCallback, useMemo } from 'react';
import cn from 'clsx';
import DenominatorIcon from '../DenominatorIcon/DenominatorIcon';
import { useHeadingGlobalState } from '../../utils/globalState';
import styles from './QuotientSelector.module.css';

interface QuotientItemProps {
  numeratorId: string;
  denominatorId: string;
  numeratorLabel?: string;
  quality?: string | null;
  isSelected?: boolean;
  onSelectQuotient: (numId: string, denId: string) => void;
}

const QuotientItem = ({
  numeratorId,
  denominatorId,
  numeratorLabel,
  quality,
  onSelectQuotient,
  isSelected = false,
}: QuotientItemProps) => {
  const onClick = (ev) => {
    ev.stopPropagation();
    onSelectQuotient(numeratorId, denominatorId);
  };

  return (
    <div
      className={cn(styles.quotientItem, isSelected && styles.selected)}
      onClick={onClick}
    >
      <DenominatorIcon iconId={denominatorId} />

      {/* do no needed on prod, only for testing purposes */}
      {sessionStorage.getItem('BIVARIATE_QA_MOD') && (
        <div className="qualityLabel">
          {quality !== null && quality !== undefined ? quality : '&nbsp;'}
        </div>
      )}

      <div className="quotientLabel">{numeratorLabel}</div>
    </div>
  );
};

type Quotient = {
  id: [string, string];
  label?: string;
  quality?: string;
};

interface QuotientSelectorProps {
  id: string;
  quotients: Quotient[];
  selectedQuotient: {
    id: [string, string];
    label?: string;
  };
  onSelectQuotient: (numId: string, denId: string) => void;
  type: 'horizontal' | 'vertical';
  children?: JSX.Element;
}

const SCALING_BACK = 100 / 70; // to go back from 70% to 100%
const MODAL_MARGIN = 5;

export const QuotientSelector = memo(
  ({
    id,
    quotients,
    selectedQuotient,
    onSelectQuotient,
    type,
    children,
  }: QuotientSelectorProps) => {
    const [headingState, setHeadingState] = useHeadingGlobalState();

    const toggleVisibility = (e) => {
      e.stopPropagation();
      if (headingState.headingId === id) {
        setHeadingState({ headingId: '', width: 0 });
      } else {
        const selectorPosition = e.currentTarget.getBoundingClientRect();
        const wholeRowPosition =
          e.currentTarget.parentElement.parentElement.getBoundingClientRect();
        const width = Math.ceil(
          (selectorPosition.left - wholeRowPosition.left) * SCALING_BACK + MODAL_MARGIN,
        );
        setHeadingState({ headingId: id, width });
      }
    };

    const selectQuotient = useCallback(
      (numId: string, denId: string) => {
        setHeadingState({ headingId: '' });
        onSelectQuotient(numId, denId);
      },
      [setHeadingState, onSelectQuotient],
    );

    const [selected, notSelected] = useMemo(() => {
      const selectedIndex = quotients.findIndex(
        ({ id }) => id[0] === selectedQuotient.id[0] && id[1] === selectedQuotient.id[1],
      );
      if (selectedIndex >= 0) {
        return [
          quotients[selectedIndex],
          quotients.filter((_, i) => i !== selectedIndex),
        ];
      }
      return [null, quotients];
    }, [quotients, selectedQuotient.id]);

    const renderQuotientItem = (
      { id, label: numeratorLabel, quality }: Quotient,
      isSelected: boolean,
    ) => (
      <QuotientItem
        key={JSON.stringify(id)}
        onSelectQuotient={selectQuotient}
        quality={quality}
        numeratorId={id[0]}
        denominatorId={id[1]}
        numeratorLabel={numeratorLabel}
        isSelected={isSelected}
      />
    );

    return (
      <div
        className={cn({
          [styles.denominators]: true,
          [styles.row]: type === 'horizontal',
          [styles.column]: type === 'vertical',
        })}
      >
        <div onClick={toggleVisibility}>{children}</div>
        {headingState.headingId === id && (
          <div
            className={styles.denominatorsContainer}
            style={
              type === 'horizontal'
                ? {
                    left: -headingState.width,
                    right: 0,
                  }
                : {
                    top: -headingState.width,
                    bottom: 0,
                  }
            }
          >
            {selected && renderQuotientItem(selected, true)}
            {notSelected.map((item) => renderQuotientItem(item, false))}
          </div>
        )}
      </div>
    );
  },
);

QuotientSelector.displayName = 'QuotientSelector';

import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import cn from 'clsx';
import DenominatorIcon from '../DenominatorIcon/DenominatorIcon';
import { QuotientSelector } from '../QuotientSelector/QuotientSelector';
import styles from './BivariateMatrixHeadingEntry.module.css';
import type { CSSProperties } from 'react';

const getHeadingPositionStyle = (isColum: boolean, index: number) => {
  const styles: any = {
    gridColumn: isColum ? `${index + 3} / ${index + 4}` : '1',
    gridRow: isColum ? '1' : `${index + 3} / ${index + 4}`,
  };

  return styles;
};

interface BivariateMatrixHeadingEntry {
  index: number;
  type: 'horizontal' | 'vertical';
  className?: string;
  selectedIndex?: number | null;
  headerCell: {
    label: string;
    selectedQuotient: {
      id: [string, string];
      label?: string;
    };
    quality?: number;
    quotients: {
      id: [string, string];
      label?: string;
      quality?: number;
    }[];
  };
  id: string;
  onCellHover: (cellIndex: number | null) => void;
  onCellClick: (cellIndex: number) => void;
  onSelectQuotient: (index: number, numId: string, denId: string) => void;
  baseDimension: number;
  calculateHeadingsStyle: (
    baseDimension: number,
    vertical: boolean,
    index: number,
  ) => CSSProperties;
}

export const BivariateMatrixHeadingEntry = forwardRef(
  (
    {
      index,
      type,
      className,
      selectedIndex = -1,
      headerCell,
      id,
      onCellHover,
      onCellClick,
      onSelectQuotient,
      baseDimension,
      calculateHeadingsStyle,
    }: BivariateMatrixHeadingEntry,
    ref,
  ) => {
    const onMouseOver = () => {
      onCellHover(index);
    };

    const onMouseOut = () => {
      onCellHover(null);
    };

    const onClick = (ev) => {
      // hack to not select axis on denominators menu open
      // TODO: find less cheating way implement this functionality and get rid of hack
      const target: any = ev.target;
      if (
        target.tagName === 'svg' ||
        target.tagName === 'path' ||
        (target.className &&
          target.className.indexOf &&
          target.className.indexOf('denominator') !== -1)
      )
        return;

      onCellClick(index);
    };

    const selectQuotient = useCallback(
      (numId: string, denId: string) => {
        onSelectQuotient(index, numId, denId);
      },
      [onSelectQuotient, index],
    );

    const numberOfAdditionalQuotientsInGroup =
      headerCell.quotients.length > 1 ? (
        <div className={styles.quotientsCountLabel}>
          +{headerCell.quotients.length - 1} layers
        </div>
      ) : null;

    const containerRef = useRef<HTMLDivElement>(null);

    let isHovered = false;
    let isSelected = false;
    const isHorizontal = type === 'horizontal';
    const isVertical = type === 'vertical';

    const baseClassNames = cn({
      [className || '']: className,
      [styles.axisRecord]: true,
      [styles.column]: isVertical,
      [styles.row]: isHorizontal,
      [styles.verticalText]: isVertical,
      horizontal: isHorizontal,
      vertical: isVertical,
    });

    function generateClassNames(): string {
      return `${baseClassNames} ${cn({
        [styles.hovered]: isHovered,
        [styles.selected]: isSelected,
      })}`;
    }

    useImperativeHandle(ref, () => ({
      setHovered: () => {
        if (containerRef.current) {
          isHovered = true;
          containerRef.current.className = generateClassNames();
        }
      },
      resetHovered: () => {
        if (containerRef.current) {
          isHovered = false;
          containerRef.current.className = generateClassNames();
        }
      },
      setSelectedCol: () => {
        if (isVertical && containerRef.current) {
          isSelected = true;
          containerRef.current.className = generateClassNames();
        }
      },
      resetSelectedCol: () => {
        if (isVertical && containerRef.current) {
          isSelected = false;
          containerRef.current.className = generateClassNames();
        }
      },
      setSelectedRow: () => {
        if (isHorizontal && containerRef.current) {
          isSelected = true;
          containerRef.current.className = generateClassNames();
        }
      },
      resetSelectedRow: () => {
        if (isHorizontal && containerRef.current) {
          isSelected = false;
          containerRef.current.className = generateClassNames();
        }
      },
    }));

    return (
      <div
        ref={containerRef}
        onMouseEnter={onMouseOver}
        onMouseOut={onMouseOut}
        onClick={onClick}
        style={getHeadingPositionStyle(type === 'vertical', index)}
        className={baseClassNames}
      >
        <div
          style={calculateHeadingsStyle(baseDimension, isVertical, index)}
          className={styles.container}
        >
          <div className={styles.corner}></div>
          <DenominatorIcon iconId={headerCell.selectedQuotient.id[1]} />
          <div className="qualityLabel">
            {headerCell.quality ? headerCell.quality : '&nbsp;'}
          </div>
          <QuotientSelector
            id={`quotient_${id}`}
            onSelectQuotient={selectQuotient}
            selectedQuotient={headerCell.selectedQuotient}
            quotients={headerCell.quotients}
            type={type}
          />
          {headerCell.label}
          {numberOfAdditionalQuotientsInGroup}
        </div>
      </div>
    );
  },
);

BivariateMatrixHeadingEntry.displayName = 'BivariateMatrixHeadingEntry';

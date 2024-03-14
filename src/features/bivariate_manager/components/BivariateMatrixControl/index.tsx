import { memo, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { useAction, useAtom } from '@reatom/npm-react';
import { setSelectCellCallbackAction } from '~features/bivariate_manager/atoms/bivariateMatrixSelection';
import { BivariateMatrixContext } from '../BivariateMatrixContainer/bivariateMatrixContext';
import {
  calculateHeadingsStyle,
  generateCellStyles,
  useBaseMatrixDimension,
  useGridStyle,
} from './utils/utils';
import { BivariateMatrixCell } from './components/BivariateMatrixCell/BivariateMatrixCell';
import styles from './style.module.css';
import { BivariateMatrixCellConnector } from './components/BivariateMatrixConnector/BivariateMatrixCellConnector';
import { BivariateMatrixHeadingEntry } from './components/BivariateMatrixHeadingEntry/BivariateMatrixHeadingEntry';
import { AxisCaptions } from './components/AxisCaptions/AxisCaptions';
import { MATRIX_CELL_SIDE, MATRIX_SCALE } from './constants';
import type { BivariateMatrixHeadingType } from './types';
import type { MouseEvent } from 'react';

const CELL_INDEX_X_OFFSET = 3;
const CELL_INDEX_Y_OFFSET = 3;
const MATRIX_CORNERS_OVERFLOW = 15;

interface BivariateMatrixControlProps {
  angle?: number;
  onSelectCell: (x: number, y: number, e?: MouseEvent<Element>) => void;
  selectedCell: { x: number; y: number } | null;
  cellSize?: number;
  matrix: (number | null)[][];
  xHeadings: BivariateMatrixHeadingType[];
  yHeadings: BivariateMatrixHeadingType[];
  onSelectQuotient: (
    horizontal: boolean,
    index: number,
    numId: string,
    denId: string,
    e?: MouseEvent<Element>,
  ) => void;
}

const BivariateMatrixControl = ({
  matrix,
  xHeadings,
  yHeadings,
  onSelectCell,
  selectedCell,
  cellSize = 0,
  onSelectQuotient,
}: BivariateMatrixControlProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bivariateMatrixContext = useContext(BivariateMatrixContext);
  const cellRowReferences: any[] = [];
  const cellColumnReferences: any[] = [];
  let hoveredColIndex = -1;
  let hoveredRowIndex = -1;
  const selectedColIndex = useRef(selectedCell?.x ?? -1);
  const selectedRowIndex = useRef(selectedCell?.y ?? -1);

  const setSelectCellCallback = useAction(setSelectCellCallbackAction);

  const setCellReference = (ref, rowIndex, colIndex) => {
    if (rowIndex >= 0) {
      if (!cellRowReferences[rowIndex]) {
        cellRowReferences[rowIndex] = [];
      }
      cellRowReferences[rowIndex].push(ref);
    }

    if (colIndex >= 0) {
      if (!cellColumnReferences[colIndex]) {
        cellColumnReferences[colIndex] = [];
      }
      cellColumnReferences[colIndex].push(ref);
    }
  };

  const onMouseOver = (x: number, y: number) => {
    if (hoveredColIndex !== x) {
      hoveredColIndex = x;
      if (hoveredColIndex !== -1) {
        const columns = cellColumnReferences[hoveredColIndex];
        if (columns) {
          columns.forEach((clmn) => {
            clmn?.setHovered();
          });
        }
      }
    }

    if (hoveredRowIndex !== y) {
      hoveredRowIndex = y;
      if (hoveredRowIndex !== -1) {
        const rows = cellRowReferences[hoveredRowIndex];
        if (rows) {
          rows.forEach((rw) => {
            rw?.setHovered();
          });
        }
      }
    }
  };

  const onMouseOut = () => {
    if (hoveredColIndex !== -1) {
      const columns = cellColumnReferences[hoveredColIndex];
      if (columns) {
        columns.forEach((clmn) => {
          clmn?.resetHovered();
        });
      }
      hoveredColIndex = -1;
    }

    if (hoveredRowIndex !== -1) {
      const rows = cellRowReferences[hoveredRowIndex];
      if (rows) {
        rows.forEach((rw) => {
          rw?.resetHovered();
        });
      }
      hoveredRowIndex = -1;
    }
  };

  const onCellHoverX = (cellIndex: number | null) => {
    onMouseOut();
    if (cellIndex) {
      onMouseOver(cellIndex, hoveredRowIndex);
    }
  };

  const onCellHoverY = (cellIndex: number | null) => {
    onMouseOut();
    if (cellIndex) {
      onMouseOver(hoveredColIndex, cellIndex);
    }
  };

  const onResetSelected = () => {
    if (selectedColIndex.current !== -1) {
      const columns = cellColumnReferences[selectedColIndex.current];
      if (columns) {
        columns.forEach((clmn) => {
          clmn?.resetSelectedCol();
        });
      }
      selectedColIndex.current = -1;
    }

    if (selectedRowIndex.current !== -1) {
      const rows = cellRowReferences[selectedRowIndex.current];
      if (rows) {
        rows.forEach((rw) => {
          rw?.resetSelectedRow();
        });
      }
      selectedRowIndex.current = -1;
    }
  };

  // onInnerSelect is triggered only when clicking by mouse on matrix elements
  const onInnerSelect = (x: number, y: number, e?: MouseEvent<Element>) => {
    onResetSelected();
    onSelectRowCol(x, y);
    onSelectCell(x, y, e);
  };

  // onOuterSelect is triggered only when you select overlay and we need to preselect layers in matrix
  const onOuterSelect = (x: number, y: number) => {
    onResetSelected();
    onSelectRowCol(x, y);
  };

  const onSelectRowCol = (x: number, y: number) => {
    if (x !== -1 && selectedColIndex.current !== x) {
      selectedColIndex.current = x;
      const columns = cellColumnReferences[selectedColIndex.current];
      if (columns) {
        columns.forEach((clmn) => {
          clmn?.setSelectedCol();
        });
      }
    }

    if (y !== -1 && selectedRowIndex.current !== y) {
      selectedRowIndex.current = y;
      const rows = cellRowReferences[selectedRowIndex.current];
      if (rows) {
        rows.forEach((rw) => {
          rw?.setSelectedRow();
        });
      }
    }
  };

  const onCellSelectX = (cellIndex: number, e: MouseEvent<Element>) => {
    onInnerSelect(cellIndex, selectedRowIndex.current, e);
  };

  const onCellSelectY = (cellIndex: number, e: MouseEvent<Element>) => {
    onInnerSelect(selectedColIndex.current, cellIndex, e);
  };

  const selectQuotientX = useCallback(
    (index: number, numId: string, denId: string, e?: MouseEvent<Element>) => {
      onSelectQuotient(false, index, numId, denId, e);
    },
    [onSelectQuotient],
  );

  const selectQuotientY = useCallback(
    (index: number, numId: string, denId: string, e?: MouseEvent<Element>) => {
      onSelectQuotient(true, index, numId, denId, e);
    },
    [onSelectQuotient],
  );

  const baseDimension = useBaseMatrixDimension(xHeadings, yHeadings);
  const rotatedMatrixWrapperSide =
    Math.sqrt(
      Math.pow(xHeadings.length * MATRIX_CELL_SIDE, 2) +
        Math.pow(yHeadings.length * MATRIX_CELL_SIDE, 2),
    ) *
      MATRIX_SCALE +
    MATRIX_CORNERS_OVERFLOW;

  useEffect(() => {
    bivariateMatrixContext?.onMatrixPositionRecalculated(
      baseDimension,
      rotatedMatrixWrapperSide,
    );

    // we hide matrix before all placements calculated
    if (containerRef.current) containerRef.current.style.visibility = 'visible';
  }, [baseDimension]);

  const gridStyle = useGridStyle(xHeadings.length + 1, yHeadings.length + 1, cellSize);
  const matrixContainerStyles = useMemo(
    () => ({
      width: rotatedMatrixWrapperSide,
      height: rotatedMatrixWrapperSide,
    }),
    [rotatedMatrixWrapperSide],
  );
  const cellStyles = useMemo(() => {
    return generateCellStyles(
      xHeadings.length + CELL_INDEX_X_OFFSET,
      yHeadings.length + CELL_INDEX_Y_OFFSET,
    );
  }, [xHeadings, yHeadings]);

  useEffect(() => {
    setSelectCellCallback(onOuterSelect.bind(this));
    if (selectedCell && (selectedCell.x !== -1 || selectedCell.y !== -1)) {
      onOuterSelect(selectedCell.x, selectedCell.y);
    }
  }, [matrix]);

  return (
    <div
      ref={containerRef}
      className={styles.matrixContainer}
      style={matrixContainerStyles}
    >
      <div style={gridStyle} className={styles.rotatedMatrix}>
        {matrix.map((_row, rowIndex) => (
          <BivariateMatrixCellConnector
            key={`${rowIndex}_row_connector`}
            type="horizontal"
            style={cellStyles[-1 + CELL_INDEX_X_OFFSET][rowIndex + CELL_INDEX_Y_OFFSET]}
            ref={(rf) => setCellReference(rf, rowIndex, -1)}
          />
        ))}
        {matrix[0].map((_col, colIndex) => (
          <BivariateMatrixCellConnector
            key={`${colIndex}_col_connector`}
            type="vertical"
            style={cellStyles[colIndex + CELL_INDEX_X_OFFSET][-1 + CELL_INDEX_Y_OFFSET]}
            ref={(rf) => setCellReference(rf, -1, colIndex)}
          />
        ))}

        {matrix.map((row, rowIndex) =>
          row.map((val, colIndex) => {
            return (
              <BivariateMatrixCell
                x={colIndex}
                y={rowIndex}
                key={`matrix_cell_${colIndex}_${rowIndex}`}
                onClick={onInnerSelect}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                style={
                  cellStyles[colIndex + CELL_INDEX_X_OFFSET][
                    rowIndex + CELL_INDEX_Y_OFFSET
                  ]
                }
                ref={(rf) => setCellReference(rf, rowIndex, colIndex)}
                value={val === null ? undefined : val}
                disabled={val === null}
                firstRow={rowIndex === 0}
                firstCol={colIndex === 0}
                lastRow={rowIndex === matrix.length - 1}
                lastCol={colIndex === row.length - 1}
              />
            );
          }),
        )}

        {[...yHeadings].reverse().map((entry, index) => (
          <BivariateMatrixHeadingEntry
            key={`hor_${yHeadings.length - 1 - index}`}
            id={`hor_${yHeadings.length - 1 - index}`}
            index={yHeadings.length - 1 - index}
            type="horizontal"
            selectedIndex={selectedCell?.y}
            headerCell={entry}
            onCellHover={onCellHoverY}
            onCellClick={onCellSelectY}
            onSelectQuotient={selectQuotientY}
            baseDimension={baseDimension}
            calculateHeadingsStyle={calculateHeadingsStyle}
            ref={(rf) => setCellReference(rf, yHeadings.length - 1 - index, -1)}
          />
        ))}

        <AxisCaptions baseDimension={baseDimension} />

        {xHeadings.map((entry, index) => (
          <BivariateMatrixHeadingEntry
            key={`vert_${index}`}
            id={`vert_${index}`}
            index={index}
            type="vertical"
            selectedIndex={selectedCell?.x}
            headerCell={entry}
            onCellHover={onCellHoverX}
            onCellClick={onCellSelectX}
            onSelectQuotient={selectQuotientX}
            baseDimension={baseDimension}
            calculateHeadingsStyle={calculateHeadingsStyle}
            ref={(rf) => setCellReference(rf, -1, index)}
          />
        ))}
      </div>
    </div>
  );
};

BivariateMatrixControl.displayName = 'BivariateMatrixControl';

export const BivariateMatrixControlComponent = memo(
  BivariateMatrixControl,
  (oldProps, newProps) => oldProps.matrix === newProps.matrix,
);

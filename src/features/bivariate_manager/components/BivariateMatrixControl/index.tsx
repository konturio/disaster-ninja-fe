import {
  forwardRef,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { MatrixRedrawContext } from '~features/bivariate_manager/utils/useMatrixRedraw';
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
import type { BivariateMatrixHeadingType } from './types';

const CELL_INDEX_X_OFFSET = 3;
const CELL_INDEX_Y_OFFSET = 3;

interface BivariateMatrixControlProps {
  angle?: number;
  onSelectCell: (x: number, y: number) => void;
  selectedCell?: { x: number; y: number };
  cellSize?: number;
  matrix: (number | null)[][];
  xHeadings: BivariateMatrixHeadingType[];
  yHeadings: BivariateMatrixHeadingType[];
  onSelectQuotient: (
    horizontal: boolean,
    index: number,
    numId: string,
    denId: string,
  ) => void;
}

const BivariateMatrixControl = forwardRef<HTMLDivElement | null, any>(
  (
    {
      matrix,
      xHeadings,
      yHeadings,
      onSelectCell,
      selectedCell,
      cellSize = 0,
      onSelectQuotient,
    }: BivariateMatrixControlProps,
    ref: any,
  ) => {
    const cellRowReferences: any[] = [];
    const cellColumnReferences: any[] = [];
    let hoveredColIndex = -1;
    let hoveredRowIndex = -1;
    let selectedColIndex = selectedCell?.x ?? -1;
    let selectedRowIndex = selectedCell?.y ?? -1;

    function updateBounds(
      left: number,
      top: number,
      right: number,
      bottom: number,
    ) {
      //cellRowReferences[5][5].checkBounds(left, top, right, bottom);
      if (cellRowReferences) {
        cellRowReferences.forEach((row) => {
          row.forEach(
            (ref) =>
              ref.checkBounds && ref.checkBounds(left, top, right, bottom),
          );
        });
      }
    }

    const [, setHandler] = useContext(MatrixRedrawContext);
    setHandler(updateBounds);

    const setCellReference = (ref, rowIndex, colIndex) => {
      if (!ref) return;

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

    const onSelect = (x: number, y: number) => {
      if (selectedColIndex !== -1) {
        const columns = cellColumnReferences[selectedColIndex];
        if (columns) {
          columns.forEach((clmn) => {
            clmn.resetSelectedCol();
          });
        }
        selectedColIndex = -1;
      }

      if (selectedRowIndex !== -1) {
        const rows = cellRowReferences[selectedRowIndex];
        if (rows) {
          rows.forEach((rw) => {
            rw.resetSelectedRow();
          });
        }
        selectedRowIndex = -1;
      }

      if (x !== -1 && selectedColIndex !== x) {
        selectedColIndex = x;
        const columns = cellColumnReferences[selectedColIndex];
        if (columns) {
          columns.forEach((clmn) => {
            clmn.setSelectedCol();
          });
        }
      }

      if (y !== -1 && selectedRowIndex !== y) {
        selectedRowIndex = y;
        const rows = cellRowReferences[selectedRowIndex];
        if (rows) {
          rows.forEach((rw) => {
            rw.setSelectedRow();
          });
        }
      }

      onSelectCell(x, y);
    };

    const onCellSelectX = (cellIndex: number) => {
      onSelect(cellIndex, selectedRowIndex);
    };

    const onCellSelectY = (cellIndex: number) => {
      onSelect(selectedColIndex, cellIndex);
    };

    const selectQuotientX = useCallback(
      (index: number, numId: string, denId: string) => {
        onSelectQuotient(false, index, numId, denId);
      },
      [onSelectQuotient],
    );

    const selectQuotientY = useCallback(
      (index: number, numId: string, denId: string) => {
        onSelectQuotient(true, index, numId, denId);
      },
      [onSelectQuotient],
    );

    const baseDimension = useBaseMatrixDimension(xHeadings, yHeadings);
    const gridStyle = useGridStyle(
      xHeadings.length + 1,
      yHeadings.length + 1,
      cellSize,
    );

    const cellStyles = useMemo(() => {
      return generateCellStyles(
        xHeadings.length + CELL_INDEX_X_OFFSET,
        yHeadings.length + CELL_INDEX_Y_OFFSET,
      );
    }, [xHeadings, yHeadings]);

    useEffect(() => {
      if (selectedCell && (selectedCell.x !== -1 || selectedCell.y !== -1)) {
        onSelect(selectedCell.x, selectedCell.y);
      }
    }, []);

    return (
      <div
        ref={ref}
        base-dimension={baseDimension}
        className={styles.rotatedMatrix}
      >
        <div style={gridStyle}>
          {matrix.map((row, rowIndex) => (
            <BivariateMatrixCellConnector
              key={`${rowIndex}_row_connector`}
              type="horizontal"
              style={
                cellStyles[-1 + CELL_INDEX_X_OFFSET][
                  rowIndex + CELL_INDEX_Y_OFFSET
                ]
              }
              ref={(rf) => setCellReference(rf, rowIndex, -1)}
            />
          ))}
          {matrix[0].map((col, colIndex) => (
            <BivariateMatrixCellConnector
              key={`${colIndex}_col_connector`}
              type="vertical"
              style={
                cellStyles[colIndex + CELL_INDEX_X_OFFSET][
                  -1 + CELL_INDEX_Y_OFFSET
                ]
              }
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
                  onClick={onSelect}
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
              ref={(rf) =>
                setCellReference(rf, yHeadings.length - 1 - index, -1)
              }
            />
          ))}
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
  },
);

BivariateMatrixControl.displayName = 'BivariateMatrixControl';

// eslint-disable-next-line react/display-name
export const BivariateMatrixControlComponent = memo(
  BivariateMatrixControl,
  (oldProps, newProps) => oldProps.matrix === newProps.matrix,
);

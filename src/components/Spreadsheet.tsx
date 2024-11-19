import { Box, Flex, Text } from '@chakra-ui/react';
import { useCallback } from 'react';
import { useAtom } from 'jotai';

import { selectedCellAtom } from '../state/spreadsheetAtoms';
import { NUM_COLUMNS, NUM_ROWS } from '../constants';

import Cell from './Cell';

const Spreadsheet: React.FC = () => {
  // Create an array of empty values that is dimensions  NUM_COLUMNS, NUM_ROWS
  // This component doesn't need access to individual state since cells are responsible for rendering
  // their own state based on colIdx and rowIdx
  const [selectedCell, setSelectedCell] = useAtom(selectedCellAtom);

  // Move selection based on arrow key input
  const moveSelection = useCallback(
    (rowDelta: number, colDelta: number) => {
      if (selectedCell) {
        const newRow = Math.max(0, Math.min(NUM_ROWS - 1, selectedCell.row + rowDelta));
        const newCol = Math.max(0, Math.min(NUM_COLUMNS - 1, selectedCell.col + colDelta));
        // @ts-ignore TODO: Address this jotai typing issue
        setSelectedCell({ row: newRow, col: newCol });
      }
    },
    [selectedCell],
  );

  // Handle keypress to move selection
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          moveSelection(-1, 0);
          event.preventDefault();
          break;
        case 'ArrowDown':
          moveSelection(1, 0);
          event.preventDefault();
          break;
        case 'ArrowLeft':
          moveSelection(0, -1);
          event.preventDefault();
          break;
        case 'ArrowRight':
          moveSelection(0, 1);
          event.preventDefault();
          break;
      }
    },
    [moveSelection],
  );

  return (
    <Box width="full" onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Column Labels */}
      <Flex>
        <Box width="50px" />
        {Array.from({ length: NUM_COLUMNS }, (_, idx) => (
          <Box
            key={idx}
            width="100px"
            height="40px"
            textAlign="center"
            display="flex"
            alignItems="center"
            justifyContent="center"
            border="1px solid gray"
            boxSizing="border-box"
          >
            <Text fontWeight="bold">{String.fromCharCode(65 + idx)}</Text>
          </Box>
        ))}
      </Flex>

      {/* Spreadsheet Rows */}
      {Array.from({ length: NUM_ROWS }).map((_row, rowIdx) => (
        <Flex key={rowIdx}>
          <Box
            width="50px"
            height="40px"
            textAlign="center"
            display="flex"
            alignItems="center"
            justifyContent="center"
            border="1px solid gray"
            boxSizing="border-box"
          >
            <Text fontWeight="bold">{rowIdx + 1}</Text>
          </Box>
          {Array.from({ length: NUM_COLUMNS }).map((_col, colIdx) => (
            <Cell key={`${rowIdx}/${colIdx}`} rowIdx={rowIdx} colIdx={colIdx} />
          ))}
        </Flex>
      ))}
    </Box>
  );
};

export default Spreadsheet;

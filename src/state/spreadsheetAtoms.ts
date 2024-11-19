import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

import { NUM_ROWS, NUM_COLUMNS } from '../constants';

type CellAtomFamilyArgs = { rowIdx: number; colIdx: number };

// Create an atom family for each cell's value
export const cellAtomFamily = atomFamily(({ rowIdx, colIdx }: CellAtomFamilyArgs) => {
  const cellAtom = atom(
    (get) => get(spreadsheetStateAtom)[rowIdx][colIdx], // Get cell value from the spreadsheet state
    (get, set, newValue: string) => {
      const spreadsheet = get(spreadsheetStateAtom);
      const updatedSpreadsheet = [...spreadsheet];
      updatedSpreadsheet[rowIdx] = [...spreadsheet[rowIdx]];
      updatedSpreadsheet[rowIdx][colIdx] = newValue; // Update the cell's value
      set(spreadsheetStateAtom, updatedSpreadsheet); // Set the new spreadsheet state
    },
  );
  return cellAtom;
}, isEqual);

function isEqual(a: CellAtomFamilyArgs, b: CellAtomFamilyArgs) {
  return a.rowIdx === b.rowIdx && a.colIdx === b.colIdx;
}

// Root atom that holds the entire spreadsheet state
// Intentionally not exported from this file to prevent direct access to the overall spreadsheet state
const spreadsheetStateAtom = atom(
  Array.from({ length: NUM_ROWS }, () => Array(NUM_COLUMNS).fill('')), // Initialize with 10x10 empty cells
);

// Atom to store the currently selected cell
export const selectedCellAtom = atom<{ row: number; col: number } | null>(null);

export const isSelectedCellAtomFamily = atomFamily(
  ({ rowIdx, colIdx }: CellAtomFamilyArgs) =>
    atom((get) => {
      const selectedCell = get(selectedCellAtom);
      return selectedCell?.row === rowIdx && selectedCell?.col === colIdx;
    }),
  isEqual,
);

import { Box, Input } from '@chakra-ui/react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useAtom, useSetAtom, useAtomValue } from 'jotai';

import {
  cellAtomFamily,
  selectedCellAtom,
  isSelectedCellAtomFamily,
} from '../state/spreadsheetAtoms';

interface CellProps {
  rowIdx: number;
  colIdx: number;
}

const formatAsCurrency = (value: string): string => {
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
  if (isNaN(numericValue)) return value;
  return `$${numericValue.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

const parseFromCurrency = (formattedValue: string): string => {
  return formattedValue.replace(/[$,]/g, '');
};

const Cell: React.FC<CellProps> = memo(({ rowIdx, colIdx }) => {
  const [value, setValue] = useAtom(cellAtomFamily({ rowIdx, colIdx }));
  const isSelected = useAtomValue(isSelectedCellAtomFamily({ rowIdx, colIdx }));
  const [displayValue, setDisplayValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // @ts-expect-error TODO: Address this typing issue. I installed the latest version of Jotai and I suspect
  // there is some type of unexpected typing mismatch. Would take ~30 minutes to investigate.
  const setSelectedCell = useSetAtom(selectedCellAtom);

  const onChangeHandler: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (ev) => {
      const rawValue = ev.target.value;
      setDisplayValue(rawValue);
      setValue(parseFromCurrency(rawValue));
    },
    [setValue],
  );

  const handleOnFocus = useCallback(() => {
    setSelectedCell({ row: rowIdx, col: colIdx });
    setDisplayValue(value);
  }, [setSelectedCell, rowIdx, colIdx, value]);

  const handleOnBlur = useCallback(() => {
    setDisplayValue(formatAsCurrency(value));
  }, [value]);

  // Focus the input element if the cell becomes selected
  useEffect(() => {
    if (isSelected && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSelected]);

  return (
    <Box
      width="100px"
      height="40px"
      border={isSelected ? '2px solid blue' : '1px solid gray'}
      boxSizing="border-box"
      onClick={handleOnFocus}
      cursor="pointer"
      _hover={{
        backgroundColor: 'rgba(0, 0, 255, 0.1)',
        borderColor: 'blue',
      }}
    >
      <Input
        ref={inputRef}
        data-testid={`cell-${rowIdx}-${colIdx}`}
        value={isSelected ? displayValue : formatAsCurrency(value)}
        border="none"
        width="full"
        height="full"
        padding="0"
        margin="0"
        boxSizing="border-box"
        outline="none"
        onChange={onChangeHandler}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        variant={isSelected ? 'unstyled' : 'flushed'}
      />
    </Box>
  );
});

export default Cell;

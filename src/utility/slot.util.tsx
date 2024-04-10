function getRowColumn(index: number, rows?: number) {
  const column = Math.floor(index / (rows ?? 1));

  let row: number;
  const rowDivisor = (rows ?? 1) * column;
  if (rowDivisor === 0) {
    row = index;
  } else {
    row = index % rowDivisor;
  }

  return { row: row + 1, column: column + 1 };
}

function formatSlotTitle(row: number, column: number) {
  return `Row ${row}, Column ${column}`;
}

export function getSlotTitle(index: number, rows?: number) {
  const { row, column } = getRowColumn(index, rows);

  return formatSlotTitle(row, column);
}

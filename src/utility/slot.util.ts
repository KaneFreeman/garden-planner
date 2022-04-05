export default function getSlotTitle(index: number, rows?: number) {
  const column = Math.floor(index / (rows ?? 1));

  let row: number;
  const rowDivisor = (rows ?? 1) * column;
  if (rowDivisor === 0) {
    row = index;
  } else {
    row = index % rowDivisor;
  }

  return `Row ${row + 1}, Column ${column + 1}`;
}

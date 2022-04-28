/* eslint-disable import/prefer-default-export */
export function setToMidnight(d: Date | null | undefined) {
  if (!d) {
    return null;
  }

  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
}

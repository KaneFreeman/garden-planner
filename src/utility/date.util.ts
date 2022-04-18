/* eslint-disable import/prefer-default-export */
export function setToMidnight(d: Date | null) {
  if (!d) {
    return d;
  }

  const date = new Date(d);
  d.setHours(0, 0, 0, 0);
  return date;
}

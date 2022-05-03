export function setToMidnight(d: null | undefined): null;
export function setToMidnight(d: Date): Date;
export function setToMidnight(d: Date | null | undefined): Date | null;
export function setToMidnight(d: Date | null | undefined): Date | null {
  if (!d) {
    return null;
  }

  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function getMidnight() {
  return setToMidnight(new Date());
}

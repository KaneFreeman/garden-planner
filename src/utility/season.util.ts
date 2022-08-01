import { FALL, Season, SPRING } from '../interface';

export default function computeSeason(): Season {
  const now = new Date();
  const month = now.getMonth();

  // July or later
  if (month >= 6) {
    return FALL;
  }

  return SPRING;
}

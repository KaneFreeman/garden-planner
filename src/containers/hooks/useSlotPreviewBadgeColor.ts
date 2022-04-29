import { useMemo } from 'react';
import { SortedTasks } from '../../interface';

export default function useSlotPreviewBadgeColor(tasks: SortedTasks) {
  return useMemo(() => {
    const { thisWeek, active, overdue } = tasks;

    let color: 'success' | 'default' | 'primary' | 'error' | 'warning';

    if (overdue.length > 0) {
      color = 'error';
      return { badgeColor: color, badgeCount: overdue.length };
    }

    if (thisWeek.length > 0) {
      color = 'warning';
      return { badgeColor: color, badgeCount: thisWeek.length };
    }

    if (active.length > 0) {
      color = 'primary';
      return { badgeColor: color, badgeCount: active.length };
    }

    color = 'default';
    return { badgeColor: color, badgeCount: 0 };
  }, [tasks]);
}

import Badge, { BadgeProps } from '@mui/material/Badge';
import { ReactNode, useMemo } from 'react';
import { SortedTasks, Task, TaskGroup } from '../interface';

interface TaskBadgeProperties<T extends (Task | TaskGroup) | Task> {
  tasks?: SortedTasks<T>;
  children: ReactNode;
}

const TaskBadge = <T extends (Task | TaskGroup) | Task>({ tasks, children }: TaskBadgeProperties<T>) => {
  const { overdue = [], active = [], thisWeek = [] } = tasks || {};

  const { taskCount, taskColor }: { taskCount: number; taskColor: BadgeProps['color'] } = useMemo(() => {
    if (overdue.length > 0) {
      return { taskCount: overdue.length, taskColor: 'error' };
    }

    if (thisWeek.length > 0) {
      return { taskCount: thisWeek.length, taskColor: 'warning' };
    }

    if (active.length > 0) {
      return { taskCount: active.length, taskColor: 'primary' };
    }

    return { taskCount: 0, taskColor: 'default' };
  }, [active.length, overdue.length, thisWeek.length]);

  return (
    <Badge badgeContent={taskCount} color={taskColor}>
      {children}
    </Badge>
  );
};

export default TaskBadge;

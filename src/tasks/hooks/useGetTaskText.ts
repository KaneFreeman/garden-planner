import { useMemo } from 'react';
import format from 'date-fns/format';
import formatDistance from 'date-fns/formatDistance';
import { Task } from '../../interface';
import { setToMidnight } from '../../utility/date.util';

export default function useGetTaskText(task: Task | undefined, today: number, showStart = false) {
  const secondary = useMemo(() => {
    let text = '';
    if (!task) {
      return text;
    }

    const completedOnDate = setToMidnight(task.completedOn);
    if (completedOnDate !== null) {
      text += `Completed ${format(completedOnDate, 'MMMM d')}`;
      if (completedOnDate.getTime() < today) {
        text += ` (${formatDistance(today, completedOnDate)} ago)`;
      } else if (completedOnDate.getTime() === today) {
        text += ` (today)`;
      }
    } else {
      if (showStart) {
        if (task.start.getTime() > today) {
          text += `Starts ${format(task.start, 'MMMM d')} (in ${formatDistance(task.start, today)})`;
        } else if (task.start.getTime() === today) {
          text += `Started ${format(task.start, 'MMMM d')} (today)`;
        } else {
          text += `Started ${format(task.start, 'MMMM d')} (${formatDistance(task.start, today)} ago)`;
        }
        text += ', ';
      }

      text += `Due ${format(task.due, 'MMMM d')}`;
      if (task.due.getTime() < today) {
        text += ` (${formatDistance(today, task.due)} ago)`;
      } else if (task.due.getTime() === today) {
        text += ` (today)`;
      } else {
        text += ` (in ${formatDistance(task.due, today)})`;
      }
    }

    return text;
  }, [showStart, task, today]);

  return useMemo(
    () => ({
      primary: task?.text ?? '',
      secondary
    }),
    [secondary, task?.text]
  );
}

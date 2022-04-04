import { addDays } from 'date-fns';
import { useTracker } from 'meteor/react-meteor-data';
import { useMemo } from 'react';
import { TasksCollection } from '../../api/Tasks';

export default function useTasks() {
  const tasks = useTracker(() =>
    TasksCollection.find()
      .fetch()
      .sort((a, b) => a.start.getTime() - b.start.getTime())
  );

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, []);

  const thirtyDaysFromNow = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return addDays(d, 30).getTime();
  }, []);

  const completed = useMemo(() => {
    const completedTasks = tasks.filter((task) => Boolean(task.completedOn));
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    completedTasks.sort((a, b) => a.completedOn!.getTime() - b.completedOn!.getTime());
    return completedTasks;
  }, [tasks]);
  const overdue = useMemo(() => {
    const overdueTasks = tasks.filter((task) => !task.completedOn && task.due.getTime() < today);
    overdueTasks.sort((a, b) => a.due.getTime() - b.due.getTime());
    return overdueTasks;
  }, [tasks, today]);
  const next30Days = useMemo(() => {
    const next30DaysTasks = tasks.filter(
      (task) => !task.completedOn && task.start.getTime() > today && task.start.getTime() <= thirtyDaysFromNow
    );
    next30DaysTasks.sort((a, b) => a.start.getTime() - b.start.getTime());
    return next30DaysTasks;
  }, [tasks, thirtyDaysFromNow, today]);
  const current = useMemo(() => {
    const currentTasks = tasks.filter(
      (task) => !task.completedOn && task.start.getTime() <= today && task.due.getTime() >= today
    );
    currentTasks.sort((a, b) => a.due.getTime() - b.due.getTime());
    return currentTasks;
  }, [tasks, today]);

  return { tasks, completed, overdue, next30Days, current };
}

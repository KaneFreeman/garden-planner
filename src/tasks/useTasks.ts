import { addDays } from 'date-fns';
import { useCallback, useEffect, useMemo } from 'react';
import { fromTaskDTO, Task, toTaskDTO } from '../interface';
import Api from '../api/api';
import useFetch from '../api/useFetch';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectTasks, updateTasks } from '../store/slices/tasks';

export const useGetTasks = () => {
  const fetch = useFetch();

  const getTasks = useCallback(async () => {
    const response = await fetch(Api.task_Get, {});
    return response;
  }, [fetch]);

  return getTasks;
};

const useTaskOperation = () => {
  const getTasks = useGetTasks();
  const dispatch = useAppDispatch();

  const runOperation = useCallback(
    async <T>(operation: () => Promise<T | undefined>) => {
      const response = await operation();

      if (!response) {
        return undefined;
      }

      const tasks = await getTasks();
      if (tasks) {
        dispatch(updateTasks(tasks));
      }

      return response;
    },
    [dispatch, getTasks]
  );

  return runOperation;
};

export const useAddTask = () => {
  const fetch = useFetch();
  const runOperation = useTaskOperation();

  const addTask = useCallback(
    async (data: Omit<Task, '_id'>) => {
      const response = await runOperation(() =>
        fetch(Api.task_Post, {
          body: toTaskDTO(data)
        })
      );

      if (!response) {
        return undefined;
      }

      return fromTaskDTO(response);
    },
    [fetch, runOperation]
  );

  return addTask;
};

export const useUpdateTask = () => {
  const fetch = useFetch();
  const runOperation = useTaskOperation();

  const addTask = useCallback(
    async (data: Task) => {
      const response = await runOperation(() =>
        fetch(Api.task_IdPut, {
          params: {
            taskId: data._id
          },
          body: toTaskDTO(data)
        })
      );

      if (!response) {
        return undefined;
      }

      return fromTaskDTO(response);
    },
    [fetch, runOperation]
  );

  return addTask;
};

export const useRemoveTask = () => {
  const fetch = useFetch();
  const runOperation = useTaskOperation();

  const removeTask = useCallback(
    async (taskId: string) => {
      const response = await runOperation(() =>
        fetch(Api.task_IdDelete, {
          params: {
            taskId
          }
        })
      );

      if (!response) {
        return undefined;
      }

      return fromTaskDTO(response);
    },
    [fetch, runOperation]
  );

  return removeTask;
};

export function useTasks() {
  const getTasks = useGetTasks();
  const dispatch = useAppDispatch();
  const taskDtos = useAppSelector(selectTasks);
  const tasks = useMemo(() => taskDtos.map(fromTaskDTO), [taskDtos]);

  useEffect(() => {
    let alive = true;

    const getTasksCall = async () => {
      const data = await getTasks();

      if (data && alive) {
        dispatch(updateTasks(data));
      }
    };

    getTasksCall();

    return () => {
      alive = false;
    };
  }, [dispatch, getTasks]);

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
    completedTasks.sort((a, b) => b.completedOn!.getTime() - a.completedOn!.getTime());
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

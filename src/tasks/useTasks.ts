import { addDays } from 'date-fns';
import { useCallback, useEffect, useMemo } from 'react';
import { fromTaskDTO, Task, toTaskDTO } from '../interface';
import Api from '../api/api';
import useFetch from '../api/useFetch';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectTasks, selectTasksByPath, updateTasks, updateTasksForPath } from '../store/slices/tasks';

const useGetTasks = () => {
  const fetch = useFetch();

  const getTasks = useCallback(async () => {
    const response = await fetch(Api.task_Get, {});
    return response;
  }, [fetch]);

  return getTasks;
};

const useTasksOperation = () => {
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
  const runOperation = useTasksOperation();

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
  const runOperation = useTasksOperation();

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
  const runOperation = useTasksOperation();

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

function useSortTasks(tasks: Task[], limit = 30) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, []);

  const daysFromNow = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return addDays(d, limit).getTime();
  }, [limit]);

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

  const next = useMemo(() => {
    const nextTasks = tasks.filter(
      (task) =>
        !task.completedOn && task.start.getTime() > today && (limit === -1 || task.start.getTime() <= daysFromNow)
    );
    nextTasks.sort((a, b) => a.start.getTime() - b.start.getTime());
    return nextTasks;
  }, [daysFromNow, limit, tasks, today]);

  const current = useMemo(() => {
    const currentTasks = tasks.filter(
      (task) => !task.completedOn && task.start.getTime() <= today && task.due.getTime() >= today
    );
    currentTasks.sort((a, b) => a.due.getTime() - b.due.getTime());
    return currentTasks;
  }, [tasks, today]);

  return { tasks, completed, overdue, next, current };
}

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

  return useSortTasks(tasks);
}

const useGetTasksByPath = () => {
  const fetch = useFetch();
  const dispatch = useAppDispatch();

  const getTasks = useCallback(
    async (path: string | undefined) => {
      if (!path) {
        return [];
      }

      const response = await fetch(Api.task_Get, { query: { path } });

      if (response) {
        dispatch(updateTasksForPath({ path, tasks: response }));
      }

      return response;
    },
    [dispatch, fetch]
  );

  return getTasks;
};

export const useTasksByPath = (path: string | undefined, limit?: number) => {
  const getTasksByPath = useGetTasksByPath();
  const selector = useMemo(() => selectTasksByPath(path), [path]);
  const taskDtos = useAppSelector(selector);
  const tasks = useMemo(() => taskDtos?.map(fromTaskDTO) ?? [], [taskDtos]);

  return { ...useSortTasks(tasks, limit), getTasksByPath };
};

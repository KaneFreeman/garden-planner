/* eslint-disable no-param-reassign */
import addDays from 'date-fns/addDays';
import { useCallback, useEffect, useMemo } from 'react';
import { fromTaskDTO, SortedTasks, Task, toTaskDTO } from '../interface';
import Api from '../api/api';
import useFetch from '../api/useFetch';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  selectTasks,
  selectTasksByContainer,
  selectTasksByContainers,
  selectTasksByPath,
  updateTasks
} from '../store/slices/tasks';

export const useGetTasks = () => {
  const fetch = useFetch();
  const dispatch = useAppDispatch();

  const getTasks = useCallback(async () => {
    const response = await fetch(Api.task_Get, {});

    if (response) {
      dispatch(updateTasks(response));
    }

    return response;
  }, [dispatch, fetch]);

  return getTasks;
};

const useTasksOperation = () => {
  const getTasks = useGetTasks();

  const runOperation = useCallback(
    async <T>(operation: () => Promise<T | undefined>) => {
      const response = await operation();

      if (!response) {
        return undefined;
      }

      await getTasks();

      return response;
    },
    [getTasks]
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

function sortTasks(tasks: Task[], today: number, daysFromNow: number, limit: number): SortedTasks {
  const completed = tasks.filter((task) => Boolean(task.completedOn));
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  completed.sort((a, b) => b.completedOn!.getTime() - a.completedOn!.getTime());

  const overdue = tasks.filter((task) => !task.completedOn && task.due.getTime() < today);
  overdue.sort((a, b) => a.due.getTime() - b.due.getTime());

  const next = tasks.filter(
    (task) => !task.completedOn && task.start.getTime() > today && (limit === -1 || task.start.getTime() <= daysFromNow)
  );
  next.sort((a, b) => a.start.getTime() - b.start.getTime());

  const current = tasks.filter(
    (task) => !task.completedOn && task.start.getTime() <= today && task.due.getTime() >= today
  );
  current.sort((a, b) => a.due.getTime() - b.due.getTime());

  return { tasks, completed, overdue, next, current };
}

function useSortDates(daysLimit = 30) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, []);

  const daysFromNow = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return addDays(d, daysLimit).getTime();
  }, [daysLimit]);

  return { today, daysFromNow, daysLimit };
}

function useSortTasks(tasks: Task[], limit?: number) {
  const { today, daysFromNow, daysLimit } = useSortDates(limit);

  return useMemo(() => sortTasks(tasks, today, daysFromNow, daysLimit), [daysFromNow, daysLimit, tasks, today]);
}

export function useTasks() {
  const getTasks = useGetTasks();
  const dispatch = useAppDispatch();
  const taskDtos = useAppSelector(selectTasks);
  const tasks = useMemo(() => taskDtos.map(fromTaskDTO), [taskDtos]);

  useEffect(() => {
    getTasks();
  }, [dispatch, getTasks]);

  return useSortTasks(tasks);
}

export const useTasksByPath = (path: string | undefined, limit?: number) => {
  const selector = useMemo(() => selectTasksByPath(path), [path]);
  const taskDtos = useAppSelector(selector);
  const tasks = useMemo(() => taskDtos?.map(fromTaskDTO) ?? [], [taskDtos]);
  return useSortTasks(tasks, limit);
};

export const useTasksByContainer = (containerId: string | undefined, limit?: number) => {
  const selector = useMemo(() => selectTasksByContainer(containerId), [containerId]);
  const taskDtos = useAppSelector(selector);
  const tasks = useMemo(() => taskDtos?.map(fromTaskDTO) ?? [], [taskDtos]);
  return useSortTasks(tasks, limit);
};

export const useTasksByContainers = (limit?: number) => {
  const taskDtos = useAppSelector(selectTasksByContainers);
  const { today, daysFromNow, daysLimit } = useSortDates(limit);
  return useMemo(
    () =>
      Object.keys(taskDtos).reduce((byContainer, containerId) => {
        byContainer[containerId] = sortTasks(taskDtos[containerId].map(fromTaskDTO), today, daysFromNow, daysLimit);

        return byContainer;
      }, {} as Record<string, ReturnType<typeof useSortTasks>>),
    [daysFromNow, daysLimit, taskDtos, today]
  );
};

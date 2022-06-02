/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-param-reassign */
import addDays from 'date-fns/addDays';
import { useCallback, useEffect, useMemo } from 'react';
import { fromTaskDTO, SortedTasks, Task, toTaskDTO } from '../../interface';
import Api from '../../api/api';
import useFetch, { ExtraFetchOptions } from '../../api/useFetch';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectTaskById,
  selectTasks,
  selectTasksByContainer,
  selectTasksByContainers,
  selectTasksByPath,
  selectTasksByPlantInstance,
  updateTasks
} from '../../store/slices/tasks';
import { getMidnight } from '../../utility/date.util';
import { selectPlantInstancesByIds } from '../../store/slices/plant-instances';

export const useGetTasks = (options?: ExtraFetchOptions) => {
  const fetch = useFetch();
  const dispatch = useAppDispatch();
  const plantInstancesByIds = useAppSelector(selectPlantInstancesByIds);

  const getTasks = useCallback(async () => {
    const response = await fetch(Api.task_Get, {}, options);

    if (response) {
      dispatch(updateTasks({ tasks: response, plantInstancesByIds } ));
    }

    return response;
  }, [dispatch, fetch, options, plantInstancesByIds]);

  return getTasks;
};

const useTasksOperation = (options?: ExtraFetchOptions) => {
  const getTasks = useGetTasks(options);

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
  const runOperation = useTasksOperation({ force: true });

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
  const runOperation = useTasksOperation({ force: true });

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
  const runOperation = useTasksOperation({ force: true });

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

function sortTasks(
  tasks: Task[],
  today: number,
  oneWeekFromNow: number,
  daysFromNow: number,
  limit: number,
  options?: { reverseSortCompleted: boolean }
): SortedTasks {
  const { reverseSortCompleted = true } = options || {};

  const completed = tasks.filter((task) => Boolean(task.completedOn));
  completed.sort((a, b) => {
    if (reverseSortCompleted) {
      return b.completedOn!.getTime() - a.completedOn!.getTime();
    }
    return a.completedOn!.getTime() - b.completedOn!.getTime();
  });

  const overdue = tasks.filter((task) => !task.completedOn && task.due.getTime() < today);
  overdue.sort((a, b) => a.due.getTime() - b.due.getTime());

  const next = tasks.filter(
    (task) => !task.completedOn && task.start.getTime() > today && (limit === -1 || task.start.getTime() <= daysFromNow)
  );
  next.sort((a, b) => a.start.getTime() - b.start.getTime());

  const thisWeek = tasks.filter(
    (task) =>
      !task.completedOn &&
      task.start.getTime() <= today &&
      task.due.getTime() >= today &&
      task.due.getTime() < oneWeekFromNow
  );
  thisWeek.sort((a, b) => a.due.getTime() - b.due.getTime());

  const active = tasks.filter(
    (task) => !task.completedOn && task.start.getTime() <= today && task.due.getTime() >= oneWeekFromNow
  );
  active.sort((a, b) => a.due.getTime() - b.due.getTime());

  return { tasks, completed, overdue, next, thisWeek, active };
}

function useSortDates(daysLimit = 30) {
  const today = useMemo(() => getMidnight().getTime(), []);

  const oneWeekFromNow = useMemo(() => {
    const d = new Date(today);
    return addDays(d, 7).getTime();
  }, [today]);

  const daysFromNow = useMemo(() => {
    const d = new Date(today);
    return addDays(d, daysLimit).getTime();
  }, [daysLimit, today]);

  return { today, oneWeekFromNow, daysFromNow, daysLimit };
}

function useSortTasks(tasks: Task[], limit?: number, options?: { reverseSortCompleted: boolean }) {
  const { today, oneWeekFromNow, daysFromNow, daysLimit } = useSortDates(limit);

  return useMemo(
    () => sortTasks(tasks, today, oneWeekFromNow, daysFromNow, daysLimit, options),
    [daysFromNow, daysLimit, oneWeekFromNow, options, tasks, today]
  );
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

export const useTasksByPath = (
  path: string | undefined,
  limit?: number,
  options?: { reverseSortCompleted: boolean }
) => {
  const selector = useMemo(() => selectTasksByPath(path), [path]);
  const taskDtos = useAppSelector(selector);
  const tasks = useMemo(() => taskDtos?.map(fromTaskDTO) ?? [], [taskDtos]);
  return useSortTasks(tasks, limit, options);
};

export const useTasksByContainer = (
  containerId: string | undefined,
  limit?: number,
  options?: { reverseSortCompleted: boolean }
) => {
  const selector = useMemo(() => selectTasksByContainer(containerId), [containerId]);
  const taskDtos = useAppSelector(selector);
  const tasks = useMemo(() => taskDtos?.map(fromTaskDTO) ?? [], [taskDtos]);
  return useSortTasks(tasks, limit, options);
};

export const useTasksByPlantInstance = (
  plantInstanceId: string | undefined,
  limit?: number,
  options?: { reverseSortCompleted: boolean }
) => {
  const selector = useMemo(() => selectTasksByPlantInstance(plantInstanceId), [plantInstanceId]);
  const taskDtos = useAppSelector(selector);
  console.log('tasks', taskDtos);
  const tasks = useMemo(() => taskDtos?.map(fromTaskDTO) ?? [], [taskDtos]);
  return useSortTasks(tasks, limit, options);
};

export const useTasksByContainers = (limit?: number) => {
  const taskDtos = useAppSelector(selectTasksByContainers);
  const { today, oneWeekFromNow, daysFromNow, daysLimit } = useSortDates(limit);
  return useMemo(
    () =>
      Object.keys(taskDtos).reduce((byContainer, containerId) => {
        byContainer[containerId] = sortTasks(
          taskDtos[containerId].map(fromTaskDTO),
          today,
          oneWeekFromNow,
          daysFromNow,
          daysLimit
        );

        return byContainer;
      }, {} as Record<string, ReturnType<typeof useSortTasks>>),
    [daysFromNow, daysLimit, oneWeekFromNow, taskDtos, today]
  );
};

export const useTask = (id: string | undefined) => {
  const selector = useMemo(() => selectTaskById(id), [id]);
  const taskDto = useAppSelector(selector);
  return useMemo(() => (taskDto ? fromTaskDTO(taskDto) : undefined), [taskDto]);
};

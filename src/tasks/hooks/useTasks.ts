import { addDays } from 'date-fns';
import { useCallback, useEffect, useMemo } from 'react';
import Api from '../../api/api';
import { ExtraFetchOptions, fetchEndpoint } from '../../api/useFetch';
import { BulkCompleteTaskDTO, SortedTasks, Task, TaskGroup, fromTaskDTO, toTaskDTO } from '../../interface';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectSelectedGarden } from '../../store/slices/gardens';
import {
  selectTaskById,
  selectTasks,
  selectTasksByContainer,
  selectTasksByContainers,
  selectTasksByPlantInstance,
  updateTasks
} from '../../store/slices/tasks';
import { getMidnight } from '../../utility/date.util';
import { createTaskGroups } from '../../utility/task.util';

export const useGetTasks = (options?: ExtraFetchOptions) => {
  const dispatch = useAppDispatch();
  const garden = useAppSelector(selectSelectedGarden);

  const getTasks = useCallback(async () => {
    const response = await fetchEndpoint(Api.task_Get, { params: { gardenId: garden?._id ?? '' } }, options);

    if (response && typeof response !== 'string') {
      dispatch(updateTasks(response));
    }

    return response;
  }, [dispatch, garden?._id, options]);

  return getTasks;
};

const useTasksOperation = (options?: ExtraFetchOptions) => {
  const getTasks = useGetTasks(options);

  const runOperation = useCallback(
    async <T>(operation: () => Promise<T | undefined>) => {
      const response = await operation();

      await getTasks();

      if (!response) {
        return undefined;
      }

      return response;
    },
    [getTasks]
  );

  return runOperation;
};

export const useAddTask = () => {
  const runOperation = useTasksOperation({ force: true });
  const garden = useAppSelector(selectSelectedGarden);

  const addTask = useCallback(
    async (data: Omit<Task, '_id'>) => {
      const response = await runOperation(() =>
        fetchEndpoint(Api.task_Post, {
          params: { gardenId: garden?._id ?? '' },
          body: toTaskDTO(data)
        })
      );

      if (!response || typeof response === 'string') {
        return undefined;
      }

      return fromTaskDTO(response);
    },
    [garden?._id, runOperation]
  );

  return addTask;
};

export const useUpdateTask = () => {
  const runOperation = useTasksOperation({ force: true });
  const garden = useAppSelector(selectSelectedGarden);

  const addTask = useCallback(
    async (data: Task) => {
      const response = await runOperation(() =>
        fetchEndpoint(Api.task_IdPut, {
          params: {
            gardenId: garden?._id ?? '',
            taskId: data._id
          },
          body: toTaskDTO(data)
        })
      );

      if (!response || typeof response === 'string') {
        return undefined;
      }

      return fromTaskDTO(response);
    },
    [garden?._id, runOperation]
  );

  return addTask;
};

export const useRemoveTask = () => {
  const runOperation = useTasksOperation({ force: true });
  const garden = useAppSelector(selectSelectedGarden);

  const removeTask = useCallback(
    async (taskId: string) => {
      const response = await runOperation(() =>
        fetchEndpoint(Api.task_IdDelete, {
          params: { gardenId: garden?._id ?? '', taskId }
        })
      );

      if (!response || typeof response === 'string') {
        return undefined;
      }

      return fromTaskDTO(response);
    },
    [garden?._id, runOperation]
  );

  return removeTask;
};

function sortTasks<T extends (Task | TaskGroup) | Task>(
  tasks: T[],
  today: number,
  oneWeekFromNow: number,
  daysFromNow: number,
  limit: number,
  options?: { reverseSortCompleted: boolean }
): SortedTasks<T> {
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

function useSortTasks<T extends (Task | TaskGroup) | Task>(
  tasks: T[],
  limit?: number,
  options?: { reverseSortCompleted: boolean }
) {
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
  const tasks = useMemo(() => createTaskGroups(taskDtos.map(fromTaskDTO)), [taskDtos]);

  useEffect(() => {
    getTasks();
  }, [dispatch, getTasks]);

  return useSortTasks(tasks);
}

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
  const tasks = useMemo(() => taskDtos?.map(fromTaskDTO) ?? [], [taskDtos]);
  return useSortTasks(tasks, limit, options);
};

export const useTasksByContainers = (limit?: number) => {
  const taskDtos = useAppSelector(selectTasksByContainers);
  const { today, oneWeekFromNow, daysFromNow, daysLimit } = useSortDates(limit);
  return useMemo(
    () =>
      Object.keys(taskDtos).reduce(
        (byContainer, containerId) => {
          byContainer[containerId] = sortTasks(
            taskDtos[containerId].map(fromTaskDTO),
            today,
            oneWeekFromNow,
            daysFromNow,
            daysLimit
          );

          return byContainer;
        },
        {} as Record<string, ReturnType<typeof useSortTasks>>
      ),
    [daysFromNow, daysLimit, oneWeekFromNow, taskDtos, today]
  );
};

export const useTask = (id: string | undefined) => {
  const selector = useMemo(() => selectTaskById(id), [id]);
  const taskDto = useAppSelector(selector);
  return useMemo(() => (taskDto ? fromTaskDTO(taskDto) : undefined), [taskDto]);
};

export const useBulkCompleteTasks = () => {
  const runOperation = useTasksOperation({ force: true });
  const garden = useAppSelector(selectSelectedGarden);

  const bulkCompleteTasks = useCallback(
    async (data: BulkCompleteTaskDTO) => {
      return runOperation(() =>
        fetchEndpoint(Api.task_PutBulkComplete, {
          params: { gardenId: garden?._id ?? '' },
          body: data
        })
      );
    },
    [garden, runOperation]
  );

  return bulkCompleteTasks;
};

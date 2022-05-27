import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { PlantInstanceDTO, TaskDTO } from '../../interface';

// Define a type for the slice state
export interface TasksState {
  tasks: TaskDTO[];
  tasksById: Record<string, TaskDTO>;
  tasksByPath: Record<string, TaskDTO[]>;
  tasksByContainer: Record<string, TaskDTO[]>;
}

// Define the initial state using that type
const initialState: TasksState = {
  tasks: [],
  tasksById: {},
  tasksByPath: {},
  tasksByContainer: {}
};

export const TasksSlice = createSlice({
  name: 'tasks',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updateTasks: (
      state,
      action: PayloadAction<{ tasks: TaskDTO[]; plantInstancesByIds: Record<string, PlantInstanceDTO> }>
    ) => {
      const tasksById: Record<string, TaskDTO> = {};
      const tasksByPath: Record<string, TaskDTO[]> = {};
      const tasksByContainer: Record<string, TaskDTO[]> = {};
      action.payload.tasks.forEach((task) => {
        if (task.path) {
          if (!(task.path in tasksByPath)) {
            tasksByPath[task.path] = [];
          }

          tasksByPath[task.path].push(task);
        }

        if (task.plantInstanceId) {
          const plantInstance = action.payload.plantInstancesByIds[task.plantInstanceId];
          if (plantInstance && plantInstance.containerId) {
            if (!(plantInstance.containerId in tasksByContainer)) {
              tasksByContainer[plantInstance.containerId] = [];
            }

            tasksByContainer[plantInstance.containerId].push(task);
          }
        }

        tasksById[task._id] = task;
      });

      return { ...state, tasks: action.payload.tasks, tasksById, tasksByPath, tasksByContainer };
    }
  }
});

export const { updateTasks } = TasksSlice.actions;

export const selectTasks = (state: RootState) => state.tasks.tasks;
export const selectTaskById = (id?: string) => (state: RootState) => id ? state.tasks.tasksById[id] : undefined;
export const selectTasksByPath = (path?: string) => (state: RootState) => path ? state.tasks.tasksByPath[path] : [];
export const selectTasksByContainer = (containerId?: string) => (state: RootState) =>
  containerId ? state.tasks.tasksByContainer[containerId] : [];
export const selectTasksByContainers = (state: RootState) => state.tasks.tasksByContainer;

export default TasksSlice.reducer;

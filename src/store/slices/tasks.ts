import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { PlantInstanceDTO, TaskDTO } from '../../interface';

// Define a type for the slice state
export interface TasksState {
  tasks: TaskDTO[];
  tasksById: Record<string, TaskDTO>;
  tasksByContainer: Record<string, TaskDTO[]>;
  tasksByPlantInstance: Record<string, TaskDTO[]>;
}

// Define the initial state using that type
const initialState: TasksState = {
  tasks: [],
  tasksById: {},
  tasksByContainer: {},
  tasksByPlantInstance: {}
};

export const TasksSlice = createSlice({
  name: 'tasks',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updateTasks: (state, action: PayloadAction<TaskDTO[]>) => {
      const tasksById: Record<string, TaskDTO> = {};
      const tasksByPlantInstance: Record<string, TaskDTO[]> = {};
      action.payload.forEach((task) => {
        if (task.plantInstanceId) {
          if (!(task.plantInstanceId in tasksByPlantInstance)) {
            tasksByPlantInstance[task.plantInstanceId] = [];
          }

          tasksByPlantInstance[task.plantInstanceId].push(task);
        }

        tasksById[task._id] = task;
      });

      return { ...state, tasks: action.payload, tasksById, tasksByPlantInstance };
    },
    buildTaskLookupByContainer: (
      state,
      action: PayloadAction<{ tasks: TaskDTO[]; plantInstancesByIds: Record<string, PlantInstanceDTO> }>
    ) => {
      const tasksByContainer: Record<string, TaskDTO[]> = {};
      action.payload.tasks.forEach((task) => {
        if (task.plantInstanceId && task.completedOn === undefined) {
          const plantInstance = action.payload.plantInstancesByIds[task.plantInstanceId];
          if (plantInstance) {
            if (plantInstance.containerId) {
              if (!(plantInstance.containerId in tasksByContainer)) {
                tasksByContainer[plantInstance.containerId] = [];
              }

              tasksByContainer[plantInstance.containerId].push(task);
            }
          }
        }
      });

      return { ...state, tasksByContainer };
    }
  }
});

export const { updateTasks, buildTaskLookupByContainer } = TasksSlice.actions;

export const selectTasks = (state: RootState) => state.tasks.tasks;
export const selectTaskById = (id?: string) => (state: RootState) => (id ? state.tasks.tasksById[id] : undefined);
export const selectTasksByContainer = (containerId?: string) => (state: RootState) =>
  containerId ? state.tasks.tasksByContainer[containerId] : undefined;
export const selectTasksByContainers = (state: RootState) => state.tasks.tasksByContainer;
export const selectTasksByPlantInstance = (plantInstanceId?: string) => (state: RootState) =>
  plantInstanceId ? state.tasks.tasksByPlantInstance[plantInstanceId] : undefined;
export const selectTasksByPlantInstances = (state: RootState) => state.tasks.tasksByPlantInstance;

export default TasksSlice.reducer;

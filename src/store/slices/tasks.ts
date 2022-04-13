import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { TaskDTO } from '../../interface';

// Define a type for the slice state
export interface TasksState {
  tasks: TaskDTO[];
  tasksByPath: Record<string, TaskDTO[]>;
}

// Define the initial state using that type
const initialState: TasksState = {
  tasks: [],
  tasksByPath: {}
};

export const TasksSlice = createSlice({
  name: 'tasks',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updateTasks: (state, action: PayloadAction<TaskDTO[]>) => {
      const tasksByPath: Record<string, TaskDTO[]> = {};
      action.payload.forEach((task) => {
        if (!task.path) {
          return;
        }

        if (!(task.path in tasksByPath)) {
          tasksByPath[task.path] = [];
        }

        tasksByPath[task.path].push(task);
      });

      return { ...state, tasks: action.payload, tasksByPath };
    }
  }
});

export const { updateTasks } = TasksSlice.actions;

export const selectTasks = (state: RootState) => state.tasks.tasks;
export const selectTasksByPath = (path?: string) => (state: RootState) => path ? state.tasks.tasksByPath[path] : [];

export default TasksSlice.reducer;

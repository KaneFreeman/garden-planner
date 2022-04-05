import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { TaskDTO } from '../../interface';

// Define a type for the slice state
export interface TasksState {
  tasks: TaskDTO[];
}

// Define the initial state using that type
const initialState: TasksState = {
  tasks: []
};

export const TasksSlice = createSlice({
  name: 'tasks',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updateTasks: (state, action: PayloadAction<TaskDTO[]>) => ({ ...state, tasks: action.payload })
  }
});

export const { updateTasks } = TasksSlice.actions;

export const selectTasks = (state: RootState) => state.tasks.tasks;

export default TasksSlice.reducer;

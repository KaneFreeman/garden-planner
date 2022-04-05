import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { ContainerDTO } from '../../interface';

// Define a type for the slice state
export interface ContainersState {
  container?: ContainerDTO;
  containers: ContainerDTO[];
}

// Define the initial state using that type
const initialState: ContainersState = {
  containers: []
};

export const ContainersSlice = createSlice({
  name: 'containers',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updateContainers: (state, action: PayloadAction<ContainerDTO[]>) => ({ ...state, containers: action.payload }),
    updateContainer: (state, action: PayloadAction<ContainerDTO>) => {
      const index = state.containers.findIndex((value) => value._id === action.payload._id);
      if (index < 0) {
        return { ...state, container: action.payload };
      }

      const containers = [...state.containers];
      containers[index] = action.payload;

      return { ...state, container: action.payload, containers };
    }
  }
});

export const { updateContainers, updateContainer } = ContainersSlice.actions;

export const selectContainers = (state: RootState) => state.containers.containers;
export const selectContainer = (state: RootState) => state.containers.container;

export default ContainersSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { ContainerDTO } from '../../interface';

// Define a type for the slice state
export interface ContainersState {
  containersById: Record<string, ContainerDTO>;
  containers: ContainerDTO[];
}

// Define the initial state using that type
const initialState: ContainersState = {
  containersById: {},
  containers: []
};

export const ContainersSlice = createSlice({
  name: 'containers',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updateContainers: (state, action: PayloadAction<ContainerDTO[]>) => ({ ...state, containers: action.payload }),
    updateContainer: (state, action: PayloadAction<ContainerDTO>) => {
      const containersById = {...state.containersById};
      containersById[action.payload._id] = action.payload;

      const index = state.containers.findIndex((value) => value._id === action.payload._id);
      if (index < 0) {
        return { ...state, containersById };
      }

      const containers = [...state.containers];
      containers[index] = action.payload;

      return { ...state, containersById, containers };
    }
  }
});

export const { updateContainers, updateContainer } = ContainersSlice.actions;

export const selectContainers = (state: RootState) => state.containers.containers;
export const selectContainer = (id?: string) => (state: RootState) => id ? state.containers.containersById[id] : undefined;

export default ContainersSlice.reducer;

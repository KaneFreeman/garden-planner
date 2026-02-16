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
    updateContainers: (state, action: PayloadAction<ContainerDTO[]>) => {
      const containersById: Record<string, ContainerDTO> = {};
      action.payload.forEach((container) => {
        containersById[container._id] = container;
      });

      return { ...state, containers: action.payload, containersById };
    }
  }
});

export const { updateContainers } = ContainersSlice.actions;

export const selectContainers = (state: RootState) => state.containers.containers;
export const selectContainersById = (state: RootState) => state.containers.containersById;
export const selectContainer = (id?: string) => (state: RootState) =>
  id ? (state.containers.containersById[id] ?? undefined) : undefined;

export default ContainersSlice.reducer;

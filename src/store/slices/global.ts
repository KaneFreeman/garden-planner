import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '..';

// Define a type for the slice state
export interface GlobalState {
  sidepanelOpen: boolean;
}

// Define the initial state using that type
const initialState: GlobalState = { sidepanelOpen: false };

export const GlobalSlice = createSlice({
  name: 'global',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    toggleSidepanel: (state) => {
      state.sidepanelOpen = !state.sidepanelOpen;
    }
  }
});

export const { toggleSidepanel } = GlobalSlice.actions;

export const selectSidepanelOpen = (state: RootState) => state.global.sidepanelOpen;

export default GlobalSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '..';

const getInitialOnlineState = () => {
  if (typeof navigator === 'undefined') {
    return true;
  }

  return navigator.onLine;
};

// Define a type for the slice state
export interface GlobalState {
  sidepanelOpen: boolean;
  isOnline: boolean;
  realtimeBootstrapComplete: boolean;
  realtimeBootstrapInProgress: boolean;
  realtimeConnected: boolean;
  realtimeLastError?: string;
}

// Define the initial state using that type
const initialState: GlobalState = {
  sidepanelOpen: false,
  isOnline: getInitialOnlineState(),
  realtimeBootstrapComplete: false,
  realtimeBootstrapInProgress: false,
  realtimeConnected: false
};

export const GlobalSlice = createSlice({
  name: 'global',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    toggleSidepanel: (state) => {
      state.sidepanelOpen = !state.sidepanelOpen;
    },
    setBrowserOnline: (state, action: { payload: boolean }) => {
      state.isOnline = action.payload;
    },
    setRealtimeBootstrapState: (state, action: { payload: { complete: boolean; inProgress: boolean } }) => {
      state.realtimeBootstrapComplete = action.payload.complete;
      state.realtimeBootstrapInProgress = action.payload.inProgress;
    },
    setRealtimeConnected: (state, action: { payload: boolean }) => {
      state.realtimeConnected = action.payload;
    },
    setRealtimeLastError: (state, action: { payload: string | undefined }) => {
      state.realtimeLastError = action.payload;
    },
    resetRealtimeState: (state) => {
      state.realtimeBootstrapComplete = false;
      state.realtimeBootstrapInProgress = false;
      state.realtimeConnected = false;
      state.realtimeLastError = undefined;
    }
  }
});

export const {
  toggleSidepanel,
  setBrowserOnline,
  setRealtimeBootstrapState,
  setRealtimeConnected,
  setRealtimeLastError,
  resetRealtimeState
} = GlobalSlice.actions;

export const selectSidepanelOpen = (state: RootState) => state.global.sidepanelOpen;
export const selectIsOnline = (state: RootState) => state.global.isOnline;
export const selectRealtimeBootstrapComplete = (state: RootState) => state.global.realtimeBootstrapComplete;
export const selectRealtimeBootstrapInProgress = (state: RootState) => state.global.realtimeBootstrapInProgress;
export const selectRealtimeConnected = (state: RootState) => state.global.realtimeConnected;
export const selectRealtimeLastError = (state: RootState) => state.global.realtimeLastError;
export const selectIsReadOnly = (state: RootState) =>
  !state.global.isOnline || (state.global.realtimeBootstrapComplete && !state.global.realtimeConnected);

export default GlobalSlice.reducer;

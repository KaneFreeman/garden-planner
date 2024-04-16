import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { SessionDTO } from '../../interface';

// Define a type for the slice state
export interface AuthState {
  user?: SessionDTO;
}

// Define the initial state using that type
const initialState: AuthState = {};

export const AuthSlice = createSlice({
  name: 'auth',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<SessionDTO>) => {
      localStorage.setItem('token', action.payload.accessToken);

      return {
        ...state,
        user: action.payload
      };
    },
    logout: (state) => {
      localStorage.removeItem('token');

      return {
        ...state,
        user: undefined
      };
    }
  }
});

export const { updateUser, logout } = AuthSlice.actions;

export const selectAccessToken = (state: RootState) => state.auth.user?.accessToken;

export const selectUser = (state: RootState) => state.auth.user;

export default AuthSlice.reducer;

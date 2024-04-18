import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { SessionDTO, UserDTO } from '../../interface';

// Define a type for the slice state
export interface AuthState {
  user?: SessionDTO;
  userDetails?: UserDTO;
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
    updateUserDetails: (state, action: PayloadAction<UserDTO>) => {
      return {
        ...state,
        userDetails: action.payload
      };
    },
    logout: (state) => {
      localStorage.removeItem('token');

      return {
        ...state,
        user: undefined,
        userDetails: undefined
      };
    }
  }
});

export const { updateUser, updateUserDetails, logout } = AuthSlice.actions;

export const selectAccessToken = (state: RootState) => state.auth.user?.accessToken;

export const selectUser = (state: RootState) => state.auth.user;

export const selectUserDetails = (state: RootState) => state.auth.userDetails;

export default AuthSlice.reducer;

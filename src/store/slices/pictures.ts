import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { PictureDTO } from '../../interface';

// Define a type for the slice state
export interface PicturesState {
  picture?: PictureDTO;
}

// Define the initial state using that type
const initialState: PicturesState = {};

export const PicturesSlice = createSlice({
  name: 'pictures',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updatePicture: (state, action: PayloadAction<PictureDTO>) => {
      return { ...state, picture: action.payload };
    }
  }
});

export const { updatePicture } = PicturesSlice.actions;

export const selectPicture = (state: RootState) => state.pictures.picture;

export default PicturesSlice.reducer;

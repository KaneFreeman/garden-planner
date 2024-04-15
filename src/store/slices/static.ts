import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { PlantDataDTO, PlantType } from '../../interface';

// Define a type for the slice state
export interface StaticState {
  plantData?: Record<PlantType, PlantDataDTO>;
}

// Define the initial state using that type
const initialState: StaticState = {};

export const StaticSlice = createSlice({
  name: 'static',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updatePlantData: (state, action: PayloadAction<Record<PlantType, PlantDataDTO>>) => ({
      ...state,
      plantData: action.payload
    })
  }
});

export const { updatePlantData } = StaticSlice.actions;

export const selectPlantData = (state: RootState) => state.static.plantData;

export default StaticSlice.reducer;

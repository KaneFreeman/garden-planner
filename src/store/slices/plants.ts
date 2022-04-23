import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { PlantDTO } from '../../interface';

// Define a type for the slice state
export interface PlantsState {
  plant?: PlantDTO;
  plants: PlantDTO[];
  filterPlants: boolean;
}

// Define the initial state using that type
const initialState: PlantsState = {
  plants: [],
  filterPlants: false
};

export const PlantsSlice = createSlice({
  name: 'plants',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updatePlants: (state, action: PayloadAction<PlantDTO[]>) => ({ ...state, plants: action.payload }),
    updatePlant: (state, action: PayloadAction<PlantDTO>) => {
      const index = state.plants.findIndex((value) => value._id === action.payload._id);
      if (index < 0) {
        return { ...state, plant: action.payload };
      }

      const plants = [...state.plants];
      plants[index] = action.payload;

      return { ...state, plant: action.payload, plants };
    },
    toggleFilterPlants: (state) => ({ ...state, filterPlants: !state.filterPlants })
  }
});

export const { updatePlants, updatePlant, toggleFilterPlants } = PlantsSlice.actions;

export const selectPlants = (state: RootState) => state.plants.plants;
export const selectPlant = (state: RootState) => state.plants.plant;
export const selectFilterPlants = (state: RootState) => state.plants.filterPlants;

export default PlantsSlice.reducer;

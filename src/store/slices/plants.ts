import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { PlantDTO } from '../../interface';

// Define a type for the slice state
export interface PlantsState {
  plants: PlantDTO[];
  plantsById: Record<string, PlantDTO>;
  filterPlants: boolean;
}

// Define the initial state using that type
const initialState: PlantsState = {
  plants: [],
  plantsById: {},
  filterPlants: false
};

export const PlantsSlice = createSlice({
  name: 'plants',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updatePlants: (state, action: PayloadAction<PlantDTO[]>) => {
      const plantsById: Record<string, PlantDTO> = {};
      action.payload.forEach((plant) => {
        plantsById[plant._id] = plant;
      });

      return { ...state, plants: action.payload, plantsById };
    },
    toggleFilterPlants: (state) => ({ ...state, filterPlants: !state.filterPlants })
  }
});

export const { updatePlants, toggleFilterPlants } = PlantsSlice.actions;

export const selectPlants = (state: RootState) => state.plants.plants;
export const selectPlant = (plantId: string | undefined) => (state: RootState) =>
  plantId ? state.plants.plantsById[plantId] : undefined;
export const selectFilterPlants = (state: RootState) => state.plants.filterPlants;

export default PlantsSlice.reducer;

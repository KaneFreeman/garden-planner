import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { Garden, GardenDTO } from '../../interface';
import { isNullish } from '../../utility/null.util';

// Define a type for the slice state
export interface GardensState {
  selectedGarden?: Garden;
  gardens?: Garden[];
  gardensById: Record<string, GardenDTO>;
}

// Define the initial state using that type
const initialState: GardensState = {
  gardensById: {}
};

export const GardensSlice = createSlice({
  name: 'gardens',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updateGardens: (state, action: PayloadAction<Garden[]>) => {
      const gardensById: Record<string, Garden> = {};
      action.payload.forEach((garden) => {
        gardensById[garden._id] = garden;
      });

      let selectedGarden = state.selectedGarden ? gardensById[state.selectedGarden._id] : undefined;
      if (isNullish(selectedGarden) && action.payload.length > 0) {
        selectedGarden = action.payload[0];
      }

      return { ...state, gardens: action.payload, gardensById, selectedGarden };
    },
    setSelectedGarden: (state, action: PayloadAction<string>) => {
      return { ...state, selectedGarden: state.gardensById[action.payload] };
    }
  }
});

export const { updateGardens, setSelectedGarden } = GardensSlice.actions;

export const selectSelectedGarden = (state: RootState) => state.gardens.selectedGarden;
export const selectGardens = (state: RootState) => state.gardens.gardens;
export const selectGardensById = (state: RootState) => state.gardens.gardensById;
export const selectGarden = (gardenId: string | undefined) => (state: RootState) =>
  gardenId ? state.gardens.gardensById[gardenId] : undefined;

export default GardensSlice.reducer;

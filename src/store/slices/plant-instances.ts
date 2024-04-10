import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { PlantInstanceDTO } from '../../interface';
import { isNotNullish } from '../../utility/null.util';

// Define a type for the slice state
export interface PlantInstanceState {
  plantInstances: PlantInstanceDTO[];
  plantInstancesById: Record<string, PlantInstanceDTO>;
  plantInstancesByContainer: Record<string, PlantInstanceDTO[]>;
  plantInstancesByPlants: Record<string, PlantInstanceDTO[]>;
}

// Define the initial state using that type
const initialState: PlantInstanceState = {
  plantInstances: [],
  plantInstancesById: {},
  plantInstancesByContainer: {},
  plantInstancesByPlants: {}
};

export const PlantInstanceSlice = createSlice({
  name: 'tasks',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updatePlantInstances: (state, action: PayloadAction<PlantInstanceDTO[]>) => {
      const plantInstancesById: Record<string, PlantInstanceDTO> = {};
      const plantInstancesByContainer: Record<string, PlantInstanceDTO[]> = {};
      const plantInstancesByPlants: Record<string, PlantInstanceDTO[]> = {};
      action.payload.forEach((plantInstance) => {
        if (plantInstance.containerId) {
          if (!(plantInstance.containerId in plantInstancesByContainer)) {
            plantInstancesByContainer[plantInstance.containerId] = [];
          }

          plantInstancesByContainer[plantInstance.containerId].push(plantInstance);
        }

        if (plantInstance.plant) {
          if (!(plantInstance.plant in plantInstancesByPlants)) {
            plantInstancesByPlants[plantInstance.plant] = [];
          }

          plantInstancesByPlants[plantInstance.plant].push(plantInstance);
        }

        plantInstancesById[plantInstance._id] = plantInstance;
      });

      return {
        ...state,
        plantInstances: action.payload,
        plantInstancesById,
        plantInstancesByContainer,
        plantInstancesByPlants
      };
    }
  }
});

export const { updatePlantInstances } = PlantInstanceSlice.actions;

export const selectPlantInstances = (state: RootState) => state.plantInstances.plantInstances;
export const selectPlantInstanceById = (id?: string | null) => (state: RootState) =>
  isNotNullish(id) ? state.plantInstances.plantInstancesById[id] : undefined;
export const selectPlantInstancesByIds = (state: RootState) => state.plantInstances.plantInstancesById;
export const selectPlantInstancesByContainer = (containerId?: string) => (state: RootState) =>
  containerId ? state.plantInstances.plantInstancesByContainer[containerId] : undefined;
export const selectPlantInstancesByContainers = (state: RootState) => state.plantInstances.plantInstancesByContainer;
export const selectPlantInstancesByPlant = (plantId?: string) => (state: RootState) =>
  plantId ? state.plantInstances.plantInstancesByPlants[plantId] : undefined;
export const selectPlantInstancesByPlants = (state: RootState) => state.plantInstances.plantInstancesByPlants;

export default PlantInstanceSlice.reducer;

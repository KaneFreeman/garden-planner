import { configureStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from '../middleware/logger';
import monitorReducersEnhancer from '../middleware/monitorReducer';
import authReducer from './slices/auth';
import containersReducer from './slices/containers';
import gardensReducer from './slices/gardens';
import picturesReducer from './slices/pictures';
import plantInstancesReducer from './slices/plant-instances';
import plantsReducer from './slices/plants';
import staticReducer from './slices/static';
import tasksReducer from './slices/tasks';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    static: staticReducer,
    gardens: gardensReducer,
    tasks: tasksReducer,
    plants: plantsReducer,
    containers: containersReducer,
    pictures: picturesReducer,
    plantInstances: plantInstancesReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware).concat(loggerMiddleware),
  enhancers: [monitorReducersEnhancer]
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export type AppThunkOptions = {
  dispatch: AppDispatch;
  state: RootState;
};

import { configureStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';
import staticReducer from './slices/static';
import tasksReducer from './slices/tasks';
import plantsReducer from './slices/plants';
import containersReducer from './slices/containers';
import picturesReducer from './slices/pictures';
import loggerMiddleware from '../middleware/logger';
import monitorReducersEnhancer from '../middleware/monitorReducer';

export const store = configureStore({
  reducer: {
    static: staticReducer,
    tasks: tasksReducer,
    plants: plantsReducer,
    containers: containersReducer,
    pictures: picturesReducer
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

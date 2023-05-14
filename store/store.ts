import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { storage } from './sync_storage';
import { api } from './services/api';
import { settingsSlice } from './features/settings';
import { userSlice } from './features/user';

const reducers = combineReducers({
  [api.reducerPath]: api.reducer,
  [settingsSlice.name]: settingsSlice.reducer,
  [userSlice.name]: userSlice.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
  blacklist: [api.reducerPath],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const getStore = () =>
  configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat([api.middleware]),
  });

const store = getStore();

const persistor = persistStore(store);

export { store, getStore, persistor };

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

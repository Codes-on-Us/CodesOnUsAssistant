import { configureStore } from '@reduxjs/toolkit';
import httpCacheReducer from './httpCacheSlice';

/**
 * Configure Redux store for HTTP caching
 * This is used internally by the HTTP Assistant library
 */
export const store = configureStore({
  reducer: {
    httpCache: httpCacheReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

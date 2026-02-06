/**
 * Redux store configuration for HTTP caching
 *
 * This module is only loaded if Redux is available.
 * For optional Redux support, use reduxManager.ts instead.
 */

let storeInstance: any;

try {
  // Dynamically import Redux - only succeeds if installed
  const { configureStore } = require('@reduxjs/toolkit');
  const httpCacheReducer = require('./httpCacheSlice').default;

  storeInstance = configureStore({
    reducer: {
      httpCache: httpCacheReducer,
    },
  });
} catch (error) {
  storeInstance = null;
}

export const store = storeInstance;

/**
 * Type definitions for Redux store
 * These are only used for TypeScript compilation
 */
export type RootState = any;
export type AppDispatch = any;

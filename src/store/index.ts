/**
 * Redux Store Exports for HTTP Caching
 *
 * This module exports all Redux store utilities for HTTP caching.
 * Redux is optional - the library will work with or without it.
 *
 * Usage:
 * import { store, RootState, AppDispatch } from '@codes-on-us/assistant/store';
 */

// Store and types
export { store } from './store';
export type { RootState, AppDispatch } from './store';

// Redux manager utilities
export {
  isReduxAvailable,
  initializeReduxStore,
  getReduxStore,
  setReduxStore,
  dispatchToRedux,
  getReduxState,
} from './reduxManager';

// Cache slice and actions
export {
  httpCacheSlice,
  setCacheEntry,
  removeCacheEntry,
  clearCache,
} from './httpCacheSlice';

// Cache slice selectors
export {
  selectCacheEntry,
  selectAllCache,
} from './httpCacheSlice';

export type { HttpCacheEntry, HttpCacheState } from './httpCacheSlice';

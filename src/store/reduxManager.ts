/**
 * Redux Manager for HTTP Caching
 *
 * This module manages HTTP caching with optional Redux support.
 * If Redux is available, it uses Redux for state management.
 * Otherwise, it falls back to Map-based caching.
 */

let reduxAvailable = false;
let storeInstance: any = null;

try {
  const redux = require('@reduxjs/toolkit');
  reduxAvailable = !!redux;
} catch (e) {
  reduxAvailable = false;
}

/**
 * Check if Redux is available in the application
 */
export function isReduxAvailable(): boolean {
  return reduxAvailable;
}

/**
 * Initialize Redux store instance
 */
export function initializeReduxStore() {
  if (!reduxAvailable) {
    console.warn(
      'Redux is not available. HTTP caching will use Map-based storage. ' +
      'Install Redux for better state management: npm install redux @reduxjs/toolkit'
    );
    return null;
  }

  try {
    if (!storeInstance) {
      const { store } = require('./store');
      storeInstance = store;
    }
    return storeInstance;
  } catch (error) {
    console.warn('Failed to initialize Redux store:', error);
    return null;
  }
}

/**
 * Get Redux store instance
 */
export function getReduxStore() {
  if (!storeInstance && reduxAvailable) {
    initializeReduxStore();
  }
  return storeInstance;
}

/**
 * Set Redux store instance (useful for testing or custom configuration)
 */
export function setReduxStore(store: any) {
  storeInstance = store;
}

/**
 * Dispatch action to Redux store
 */
export function dispatchToRedux(action: any) {
  const store = getReduxStore();
  if (store) {
    store.dispatch(action);
  }
}

/**
 * Get state from Redux store
 */
export function getReduxState(): any {
  const store = getReduxStore();
  if (store) {
    return store.getState();
  }
  return null;
}

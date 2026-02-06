import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface HttpCacheEntry {
  data: any;
  timestamp: number;
}

export interface HttpCacheState {
  cache: Record<string, HttpCacheEntry>;
  pendingRequests: Record<string, Promise<any>>;
}

const initialState: HttpCacheState = {
  cache: {},
  pendingRequests: {},
};

export const httpCacheSlice = createSlice({
  name: 'httpCache',
  initialState,
  reducers: {
    setCacheEntry: (
      state,
      action: PayloadAction<{ key: string; data: any }>
    ) => {
      state.cache[action.payload.key] = {
        data: action.payload.data,
        timestamp: Date.now(),
      };
    },
    removeCacheEntry: (state, action: PayloadAction<string>) => {
      delete state.cache[action.payload];
    },
    clearCache: (state) => {
      state.cache = {};
    },
    setPendingRequest: (
      state,
      action: PayloadAction<{ key: string; promise: Promise<any> }>
    ) => {
      state.pendingRequests[action.payload.key] = action.payload.promise;
    },
    removePendingRequest: (state, action: PayloadAction<string>) => {
      delete state.pendingRequests[action.payload];
    },
    clearPendingRequests: (state) => {
      state.pendingRequests = {};
    },
  },
});

export const {
  setCacheEntry,
  removeCacheEntry,
  clearCache,
  setPendingRequest,
  removePendingRequest,
  clearPendingRequests,
} = httpCacheSlice.actions;

// Selectors
export const selectCacheEntry = (state: { httpCache: HttpCacheState }, key: string) =>
  state.httpCache.cache[key];

export const selectPendingRequest = (state: { httpCache: HttpCacheState }, key: string) =>
  state.httpCache.pendingRequests[key];

export const selectAllCache = (state: { httpCache: HttpCacheState }) =>
  state.httpCache.cache;

export const selectAllPendingRequests = (state: { httpCache: HttpCacheState }) =>
  state.httpCache.pendingRequests;

export default httpCacheSlice.reducer;

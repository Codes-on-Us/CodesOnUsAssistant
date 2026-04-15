import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface HttpCacheEntry {
  data: any;
  timestamp: number;
}

export interface HttpCacheState {
  cache: Record<string, HttpCacheEntry>;
}

const initialState: HttpCacheState = {
  cache: {},
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
  },
});

export const {
  setCacheEntry,
  removeCacheEntry,
  clearCache,
} = httpCacheSlice.actions;

// Selectors
export const selectCacheEntry = (state: { httpCache: HttpCacheState }, key: string) =>
  state.httpCache.cache[key];

export const selectAllCache = (state: { httpCache: HttpCacheState }) =>
  state.httpCache.cache;

export default httpCacheSlice.reducer;

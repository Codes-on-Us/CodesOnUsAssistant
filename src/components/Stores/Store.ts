import { configureStore } from '@reduxjs/toolkit';
import UserReducer from './User/User';
import LoadUserInProcessReducer from './LoadUserInProcess/LoadUserInProcess';

export const Store = configureStore({
    reducer: {
        User: UserReducer,
        LoadUserInProcessReducer: LoadUserInProcessReducer
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof Store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof Store.dispatch

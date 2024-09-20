
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state

export interface ILoadUserInProcess {
    value: boolean
}

// Define the initial state using that type
const initialState: ILoadUserInProcess = {
    value: false,
} as ILoadUserInProcess


export const LoadUserInProcessSlice = createSlice({
    name: 'LoadUserInProcess',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        updateLoadUserInProcess: (state, data: PayloadAction<boolean>) => {
            state.value = data.payload;
        }
    },
})

export const { updateLoadUserInProcess } = LoadUserInProcessSlice.actions

// Other code such as selectors can use the imported `RootState` type


export default LoadUserInProcessSlice.reducer
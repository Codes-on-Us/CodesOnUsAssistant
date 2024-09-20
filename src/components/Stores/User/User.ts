
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state

export interface IUser {
    value?: any
}

// Define the initial state using that type
const initialState: IUser = {
    value: undefined,
} as IUser

export const UserSlice = createSlice({
    name: 'User',
    initialState,
    reducers: {
        updateUser: (state, data: PayloadAction<any | undefined>) => {
            state.value = data.payload;
        }
    },
})

export const { updateUser } = UserSlice.actions

// Other code such as selectors can use the imported `RootState` type


export default UserSlice.reducer
// src/app/store/slices/counterSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const initialState = { value: 0 }

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (s) => { s.value += 1 },
    decrement: (s) => { s.value -= 1 },
    reset: (s) => { s.value = 0 },
  },
})

export const { increment, decrement, reset } = counterSlice.actions
export default counterSlice.reducer

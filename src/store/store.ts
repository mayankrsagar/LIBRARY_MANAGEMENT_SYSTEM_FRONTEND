// src/app/store/store.ts
import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/authSlice';
import bookReducer from '../features/book/bookSlice';
import borrowReducer from '../features/borrow/borrowSlice';
import counterReducer from '../features/counter/counterSlice';
import popupReducer from '../features/popUp/popUpSlice';
import userReducer from '../features/user/userSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
   popup:popupReducer, 
   user: userReducer,
   book: bookReducer,
   borrow: borrowReducer
  },
})

// Infer the `RootState` and `AppDispatch` types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

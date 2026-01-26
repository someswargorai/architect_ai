import { configureStore } from "@reduxjs/toolkit";
import flowReducer from "./slices/flowSlice"
import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    flow: flowReducer,
    auth: authReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

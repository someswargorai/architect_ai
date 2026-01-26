import { configureStore } from "@reduxjs/toolkit";
import flowReducer from "./slices/flowSlice"
import authReducer from './slices/authSlice'
import projectReducer from './slices/projectSlice'

export const store = configureStore({
  reducer: {
    flow: flowReducer,
    auth: authReducer,
    project: projectReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

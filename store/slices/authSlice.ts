import { createSlice } from "@reduxjs/toolkit";

type UserType = {
  email: string;
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  designation: string;
  profilePic: string;
  accessToken: string;
  refreshToken: string;
};

type AuthState = {
  isAuthenticated: boolean;
  user: UserType | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    getUser: (state) => {
      return state;
    },
  },
});
export const { setUser, clearUser, getUser } = authSlice.actions;
export default authSlice.reducer;

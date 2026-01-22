import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import type { ExtendedUserProperties, UserWithToken } from "./classes/user";

export interface UserState {
  currentUser?: UserWithToken<ExtendedUserProperties>;
}

const initialState: UserState = {
  currentUser: undefined,
};

export const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["currentUser"],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveUser(
      state,
      action: PayloadAction<UserWithToken<ExtendedUserProperties>>,
    ) {
      state.currentUser = action.payload;
    },

    clearUser(state) {
      state.currentUser = undefined;
    },
  },
});

export const { saveUser, clearUser } = userSlice.actions;
export const userReducer = userSlice.reducer;

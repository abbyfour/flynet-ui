import { AppTheme, type SidepanelWindows } from "@data/classes/ui";
import {
  createSelector,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import type { Coordinates } from "../util/mapUtil";
import type { AppRootState } from "./store";

export interface Thinking {
  message: string;
}

export interface UIState {
  activeSidepanelWindow?: SidepanelWindows;
  isEditingProfile: boolean;
  viewedProfileUsername?: string;
  theme?: AppTheme;
  mapPosition?: Coordinates;
  thinking?: Thinking;
}

const initialState: UIState = {
  activeSidepanelWindow: undefined,
  isEditingProfile: false,
  viewedProfileUsername: undefined,
  mapPosition: undefined,
};

export const uiPersistConfig = {
  key: "ui",
  storage,
  whitelist: ["activeSidepanelWindow", "theme", "mapPosition"],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setActiveSidepanelWindow(
      state: UIState,
      action: PayloadAction<SidepanelWindows>,
    ) {
      state.activeSidepanelWindow = action.payload;

      if (action.payload !== "profile") {
        state.isEditingProfile = false;
      }
    },

    closeActiveSidepanelWindow(state: UIState) {
      state.activeSidepanelWindow = undefined;
      state.isEditingProfile = false;
    },

    setIsEditingProfile(state: UIState, action: PayloadAction<boolean>) {
      state.isEditingProfile = action.payload;
    },

    setViewedProfileUsername(
      state: UIState,
      action: PayloadAction<string | undefined>,
    ) {
      state.viewedProfileUsername = action.payload;
    },

    setTheme(state: UIState, action: PayloadAction<AppTheme | undefined>) {
      state.theme = action.payload;
    },

    recordMapPosition(state: UIState, action: PayloadAction<Coordinates>) {
      state.mapPosition = action.payload;
    },

    // Thinking
    setPermanentThinking(state: UIState, action: PayloadAction<string>) {
      if (action.payload) {
        state.thinking = { message: action.payload };
      }
    },

    clearThinking(state: UIState) {
      state.thinking = undefined;
    },
  },
});

export const {
  setActiveSidepanelWindow,
  closeActiveSidepanelWindow,
  setIsEditingProfile,
  setViewedProfileUsername,

  setTheme,
  recordMapPosition,

  setPermanentThinking,
  clearThinking,
} = uiSlice.actions;

export const uiReducer = uiSlice.reducer;

const selectThemeFallbackToSystem = createSelector(
  (state: AppRootState) => state.ui.theme,
  (theme) => {
    if (theme) {
      return theme;
    }

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    return prefersDark ? AppTheme.Dark : AppTheme.Light;
  },
);

export { selectThemeFallbackToSystem };

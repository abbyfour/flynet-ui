import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { uiReducer } from "./uiSlice";

const uiPersistConfig = {
  key: "ui",
  storage,
  whitelist: ["mapProjection", "activeSidepanelWindow"],
};

const rootReducer = combineReducers({
  ui: persistReducer(uiPersistConfig, uiReducer),
  // [flightsApi.reducerPath]: flightsApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,

  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //        serializableCheck: false // redux-persist needs this
  // }).concat(flightsApi.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

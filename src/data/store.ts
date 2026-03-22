import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import { flightsReducer } from "./flightsSlice";
import { flightsApi } from "./services/flights/flightsAPI";
import { tailsApi } from "./services/tails";
import { usersApi } from "./services/usersAPI";
import { sidepanelReducer } from "./sidepanelSlice";
import { uiPersistConfig, uiReducer } from "./uiSlice";
import { userPersistConfig, userReducer } from "./userSlice";

const rootReducer = combineReducers({
  ui: persistReducer(uiPersistConfig, uiReducer),
  user: persistReducer(userPersistConfig, userReducer),

  sidepanel: sidepanelReducer,
  flights: flightsReducer,

  [usersApi.reducerPath]: usersApi.reducer,
  [flightsApi.reducerPath]: flightsApi.reducer,
  [tailsApi.reducerPath]: tailsApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist needs this
    })
      .concat(usersApi.middleware)
      .concat(flightsApi.middleware)
      .concat(tailsApi.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type AppRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppRootState> = useSelector;

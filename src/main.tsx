import { navigator, routes } from "@data/location/navigation.ts";
import { NavigationProvider } from "@data/location/navigator/NavigationProvider.tsx";
import { persistor, store } from "@data/store.ts";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationProvider navigator={navigator} routes={routes}>
          <App />
        </NavigationProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
);

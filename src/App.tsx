import { AppContext } from "@components/AppContext.tsx";
import { Dock } from "@components/desktop/Dock.tsx";
import { LoginWindow } from "@components/desktop/windows/LoginWindow.tsx";
import { SidepanelWindow } from "@components/desktop/windows/SidepanelWindow.tsx";
import { StatusBar } from "@components/desktop/windows/statusBar/StatusBar.tsx";
import { Map } from "@components/map/Map.tsx";

import "./styles.shim.ts";

function App() {
  return (
    <AppContext>
      <div className="app">
        {/* Desktop UI */}
        <StatusBar />
        <Dock />

        {/* Windows */}
        <LoginWindow />
        <SidepanelWindow />

        {/* Renders both base map and data layers */}
        <Map />
      </div>
    </AppContext>
  );
}

export default App;

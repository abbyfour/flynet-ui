import { AppContext } from "./ui/AppContext.tsx";
import { Dock } from "./ui/desktop/Dock.tsx";
import { StatusBar } from "./ui/desktop/statusBar/StatusBar.tsx";
import { ThemeToggle } from "./ui/desktop/themeToggle/ThemeToggle.tsx";
import { LoginWindow } from "./ui/desktop/windows/login/LoginWindow.tsx";
import { SidepanelWindow } from "./ui/desktop/windows/SidepanelWindow.tsx";
import { ProjectionToggle } from "./ui/map/controls/ProjectionToggle.tsx";
import { Map } from "./ui/map/Map.tsx";

import "./styles.shim.ts";

function App() {
  return (
    <AppContext>
      {/* Desktop UI */}
      <StatusBar />
      <Dock />

      {/* Windows */}
      <LoginWindow />
      <SidepanelWindow />

      {/* Map controls */}
      <ProjectionToggle />
      <ThemeToggle />

      {/* Renders both base map and data layers */}
      <Map />
    </AppContext>
  );
}

export default App;

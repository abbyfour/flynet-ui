import { AppContext } from "./ui/AppContext";
import { Dock } from "./ui/desktop/Dock";
import { StatusBar } from "./ui/desktop/statusBar/StatusBar";
import { ThemeToggle } from "./ui/desktop/themeToggle/ThemeToggle";
import { LoginWindow } from "./ui/desktop/windows/login/LoginWindow";
import { SidepanelWindow } from "./ui/desktop/windows/SidepanelWindow";
import { ProjectionToggle } from "./ui/map/controls/ProjectionToggle";
import { Map } from "./ui/map/Map";

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

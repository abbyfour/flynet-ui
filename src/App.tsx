import { Dock } from "./lib/desktop/Dock";
import { StatusBar } from "./lib/desktop/statusBar/StatusBar";
import { ThemeToggle } from "./lib/desktop/themeToggle/ThemeToggle";
import { LoginWindow } from "./lib/desktop/windows/login/LoginWindow";
import { SidepanelWindow } from "./lib/desktop/windows/SidepanelWindow";
import { ProjectionToggle } from "./lib/map/controls/ProjectionToggle";
import { Map } from "./lib/map/Map";
import { AppContext } from "./lib/uilib/AppContext";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "maplibre-gl/dist/maplibre-gl.css";

import "./App.scss";

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

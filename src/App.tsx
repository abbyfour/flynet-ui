import "maplibre-gl/dist/maplibre-gl.css";
import "./App.scss";
import { Dock } from "./lib/desktop/Dock";
import { StatusBar } from "./lib/desktop/statusBar/StatusBar";
import { ThemeToggle } from "./lib/desktop/themeToggle/ProjectionToggle";
import { LoginWindow } from "./lib/desktop/windows/login/LoginWindow";
import { SidepanelWindow } from "./lib/desktop/windows/SidepanelWindow";
import { BaseMap } from "./lib/map/BaseMap";
import { ProjectionToggle } from "./lib/map/controls/ProjectionToggle";

function App() {
  return (
    <>
      <StatusBar />
      <LoginWindow />
      <SidepanelWindow />
      <Dock />
      <ProjectionToggle />
      <ThemeToggle />
      <BaseMap />;
    </>
  );
}

export default App;

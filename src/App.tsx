import "maplibre-gl/dist/maplibre-gl.css";
import "./App.scss";
import { Dock } from "./lib/desktop/Dock";
import { SidepanelWindow } from "./lib/desktop/windows/SidepanelWindow";
import { BaseMap } from "./lib/map/BaseMap";
import { ProjectionToggle } from "./lib/map/controls/ProjectionToggle";

function App() {
  return (
    <>
      <SidepanelWindow />
      <Dock />
      <ProjectionToggle />
      <BaseMap />;
    </>
  );
}

export default App;

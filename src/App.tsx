import "maplibre-gl/dist/maplibre-gl.css";
import "./App.scss";
import { BaseMap } from "./lib/map/BaseMap";
import { ProjectionToggle } from "./lib/map/controls/ProjectionToggle";

function App() {
  return (
    <>
      <ProjectionToggle />
      <BaseMap />;
    </>
  );
}

export default App;

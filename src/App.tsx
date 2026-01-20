import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";
import { BaseMap, MapProjection } from "./lib/map/BaseMap";

function App() {
  return <BaseMap projection={MapProjection.Globe} />;
}

export default App;

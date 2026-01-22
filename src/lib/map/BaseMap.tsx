import "maplibre-gl/dist/maplibre-gl.css";
import Map from "react-map-gl/maplibre";
import "react-toggle/style.css";
import { useAppSelector } from "../../data/store";

const maptilerKey = import.meta.env.VITE_MAPTILER_KEY;

export function BaseMap() {
  const projection = useAppSelector((state) => state.ui.mapProjection);
  const theme = useAppSelector((state) => state.ui.theme);

  const mapTilerStyle = theme === "dark" ? "dataviz-v4-dark" : "dataviz-v4";

  return (
    <div className="app">
      <Map
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 4,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={`https://api.maptiler.com/maps/${mapTilerStyle}/style.json?key=${maptilerKey}`}
        projection={projection}
      />
    </div>
  );
}

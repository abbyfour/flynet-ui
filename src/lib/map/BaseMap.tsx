import "maplibre-gl/dist/maplibre-gl.css";
import Map from "react-map-gl/maplibre";
import "react-toggle/style.css";
import { useAppSelector } from "../../redux/store";

const maptilerKey = import.meta.env.VITE_MAPTILER_KEY;

export type BaseMapProps = {};

export function BaseMap({}: BaseMapProps) {
  const projection = useAppSelector((state) => state.ui.mapProjection);

  return (
    <div className="app">
      <Map
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 4,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={`https://api.maptiler.com/maps/base-v4/style.json?key=${maptilerKey}`}
        projection={projection}
      />
    </div>
  );
}

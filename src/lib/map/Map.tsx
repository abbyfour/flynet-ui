import BaseMap from "react-map-gl/maplibre";
import { useAppSelector } from "../../data/store";
import { DataLayers } from "./DataLayers";

const maptilerKey = import.meta.env.VITE_MAPTILER_KEY;

export function Map() {
  const projection = useAppSelector((state) => state.ui.mapProjection);
  const theme = useAppSelector((state) => state.ui.theme);

  const mapTilerStyle = theme === "dark" ? "dataviz-v4-dark" : "dataviz-v4";

  return (
    <BaseMap
      mapStyle={`https://api.maptiler.com/maps/${mapTilerStyle}/style.json?key=${maptilerKey}`}
      projection={projection}
    >
      <DataLayers />
    </BaseMap>
  );
}

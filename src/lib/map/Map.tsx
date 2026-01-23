import { useState } from "react";
import BaseMap from "react-map-gl/maplibre";
import { store, useAppDispatch, useAppSelector } from "../../data/store";
import { recordMapPosition } from "../../data/uiSlice";
import { DataLayers } from "./DataLayers";

const maptilerKey = import.meta.env.VITE_MAPTILER_KEY;

export function Map() {
  const dispatch = useAppDispatch();

  const projection = useAppSelector((state) => state.ui.mapProjection);
  const theme = useAppSelector((state) => state.ui.theme);

  // Capture initial view state once without subscribing to mapPosition updates
  const [initialView] = useState(() => {
    const pos = store.getState().ui.mapPosition;
    return {
      latitude: pos?.[0] ?? 51.4779,
      longitude: pos?.[1] ?? -0.0015,
      zoom: pos?.[2] ?? 2,
    };
  });

  const mapTilerStyle =
    theme === "dark"
      ? "dataviz-v4-dark"
      : "019bea9d-6f20-789c-a22f-3ea6415f0b5a";

  // Force a full remount of the BaseMap when projection/theme/DPR change.
  // This avoids timing/attachment issues where Deck overlays lose connection
  // to the map when MapLibre recreates its canvas during reprojection.
  const mapKey = `${projection}-${theme}-${
    typeof window !== "undefined" ? window.devicePixelRatio : 1
  }`;

  return (
    <BaseMap
      key={mapKey}
      mapStyle={`https://api.maptiler.com/maps/${mapTilerStyle}/style.json?key=${maptilerKey}`}
      projection={projection}
      initialViewState={initialView}
      onMoveEnd={(e) => {
        const { latitude, longitude, zoom } = e.viewState;
        dispatch(recordMapPosition([latitude, longitude, zoom]));
      }}
    >
      <DataLayers />
    </BaseMap>
  );
}

import { useState } from "react";
import BaseMap from "react-map-gl/maplibre";

import { AppTheme } from "@data/classes/ui";
import { store, useAppDispatch, useAppSelector } from "@data/store";
import { recordMapPosition, selectThemeFallbackToSystem } from "@data/uiSlice";
import { DataLayers } from "./DataLayers";

const maptilerKey = import.meta.env.VITE_MAPTILER_KEY;

export function Map() {
  const dispatch = useAppDispatch();

  const theme = useAppSelector(selectThemeFallbackToSystem);

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
    theme === AppTheme.Dark ? "dataviz-v4-dark" : "dataviz-v4-light";

  // Force a full remount of the BaseMap when theme/DPR changes..
  const mapKey = `${theme}-${
    typeof window !== "undefined" ? window.devicePixelRatio : 1
  }`;

  return (
    <BaseMap
      key={mapKey}
      mapStyle={`https://api.maptiler.com/maps/${mapTilerStyle}/style.json?key=${maptilerKey}`}
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

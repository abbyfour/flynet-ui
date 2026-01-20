import "maplibre-gl/dist/maplibre-gl.css";
import { useState } from "react";
import Map from "react-map-gl/maplibre";
import Toggle from "react-toggle";
import "react-toggle/style.css";

const maptilerKey = import.meta.env.VITE_MAPTILER_KEY;

export enum MapProjection {
  Globe = "globe",
  Mercator = "mercator",
}

export type BaseMapProps = {
  initialProjection?: MapProjection;
};

export function BaseMap({ initialProjection }: BaseMapProps) {
  const [projection, setProjection] = useState(
    initialProjection || MapProjection.Mercator,
  );

  return (
    <div className="app">
      <div style={{ position: "absolute", bottom: 10, left: 10, zIndex: 1 }}>
        <Toggle
          id="projection-toggle"
          icons={false}
          checked={projection === MapProjection.Globe}
          onChange={(e) =>
            setProjection(
              e.target.checked ? MapProjection.Globe : MapProjection.Mercator,
            )
          }
        />
      </div>

      <Map
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 3,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={`https://api.maptiler.com/maps/base-v4/style.json?key=${maptilerKey}`}
        projection={projection}
      />
    </div>
  );
}

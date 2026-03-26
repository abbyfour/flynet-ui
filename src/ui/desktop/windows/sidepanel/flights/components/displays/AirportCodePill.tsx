import type { Airport } from "../../../../../../../data/classes/flights/Airport";
import { joinClasses } from "../../../../../../../util/componentUtil";

import "./AirportCodePill.scss";

type AirportCodePillProps = {
  airport: Airport;
  size?: "sm" | "md";
};

export function AirportCodePill({
  airport,
  size = "md",
}: AirportCodePillProps) {
  return (
    <div className={joinClasses("AirportCodePill", size)}>
      {airport.displayCode}
      <span className="tooltip">{generateTooltipText(airport)}</span>
    </div>
  );
}

function generateTooltipText(airport: Airport) {
  return [
    airport.iataCode && `IATA: ${airport.iataCode || "N/A"}`,
    airport.icaoCode && `ICAO: ${airport.icaoCode || "N/A"}`,
    airport.localCode && `Local: ${airport.localCode || "N/A"}`,
  ]
    .filter(Boolean)
    .join(" | ");
}

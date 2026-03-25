import type { Airport } from "../../../../../../data/classes/flights/Airport";
import { joinClasses } from "../../../../../../util/componentUtil";

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
      <span className="tooltip">
        IATA: {airport.iataCode || "N/A"} | ICAO: {airport.icaoCode || "N/A"} |
        Local: {airport.localCode || "N/A"}
      </span>
    </div>
  );
}

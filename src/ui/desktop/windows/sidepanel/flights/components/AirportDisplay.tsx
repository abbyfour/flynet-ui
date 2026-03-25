import type { Airport } from "../../../../../../data/classes/flights/Airport";
import { joinClasses } from "../../../../../../util/componentUtil";
import { displayAirportType } from "../../../../../../util/flights";

import "./AirportDisplay.scss";

type AirportDisplayProps = {
  airport: Airport;
  className?: string;
  onClick?: () => void;
};

export function AirportDisplay({
  airport,
  className,
  onClick,
}: AirportDisplayProps) {
  return (
    <div className={joinClasses("AirportDetails", className)} onClick={onClick}>
      <div className="left">
        <AirportCodePill airport={airport} />
      </div>

      <div className="right">
        <span className="name">{airport.name}</span>

        <span className="subline">
          {displayAirportType(airport.type)} • {airport.city},{" "}
          {airport.isoRegion}, {airport.isoCountry}
        </span>
      </div>
    </div>
  );
}

export function AirportCodePill({ airport }: { airport: Airport }) {
  return (
    <div className="AirportCodePill">
      {airport.displayCode}
      <span className="tooltip">
        IATA: {airport.iataCode || "N/A"} | ICAO: {airport.icaoCode || "N/A"} |
        Local: {airport.localCode || "N/A"}
      </span>
    </div>
  );
}

import type { Airport } from "../../../../../data/classes/flights/Airport";
import { joinClasses } from "../../../../../util/componentUtil";
import { displayAirportType } from "../../../../../util/flights";
import { AirportCodePill } from "./FlightView";

import "./AirportDetails.scss";

export function AirportDetails({
  airport,
  className,
}: {
  airport: Airport;
  className?: string;
}) {
  return (
    <div className={joinClasses("AirportDetails", className)}>
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

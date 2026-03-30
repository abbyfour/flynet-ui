import type { Airport } from "../../../../../../../data/classes/flights/Airport";
import { joinClasses } from "../../../../../../../util/componentUtil";
import { displayAirportType } from "../../../../../../../util/flights";
import { AirportCodePill } from "./AirportCodePill";

import "./AirportDisplay.scss";

type AirportDisplayProps = {
  airport: Airport;
  className?: string;
  onClick?: () => void;
  minimal?: boolean;
  noHover?: boolean;
};

export function AirportDisplay({
  airport,
  className,
  onClick,
  minimal = false,
  noHover = false,
}: AirportDisplayProps) {
  return !minimal ? (
    <div
      className={joinClasses(
        "AirportDetails",
        className,
        noHover ? "no-hover" : "",
      )}
      onClick={onClick}
    >
      <div className="left">
        <AirportCodePill airport={airport} size="md" />
      </div>

      <div className="right">
        <span className="name">{airport.name}</span>

        <span className="subline">
          {displayAirportType(airport.type)} • {airport.city},{" "}
          {airport.isoRegion}, {airport.isoCountry}
        </span>
      </div>
    </div>
  ) : (
    <div className="AirportDetails minimal" onClick={onClick}>
      <AirportCodePill airport={airport} size="sm" /> {airport.city}
    </div>
  );
}

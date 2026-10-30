import { AirlineTail } from "@assets/tails/AirlineTail";
import type { Airline } from "@data/classes/flights/Airline";

import "./AirlineDisplay.scss";

type AirlineDisplayProps = {
  airline: Airline;
  flightNumber?: string;
  onClick?: () => void;
  noHover?: boolean;
};

export function AirlineDisplay({
  airline,
  flightNumber,
  onClick,
  noHover = false,
}: AirlineDisplayProps) {
  return (
    <div
      className={`AirlineDisplay ${noHover ? "no-hover" : ""}`}
      onClick={onClick}
    >
      <AirlineTail
        key={flightNumber || airline.name}
        airline={airline}
        icaoCode={airline.icaoCode}
        iataCode={airline.iataCode}
        noTooltip={true}
      />

      <div className="airline-details">
        <p className="airline-name">{airline.name}</p>

        <div className="airline-code text-small">
          {airline.displayCode || "N/A"}
        </div>
      </div>
    </div>
  );
}

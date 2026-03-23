import { AirlineTail } from "../../../../../../assets/tails/AirlineTail";
import type { Airline } from "../../../../../../data/classes/flights/Airline";

import "./AirlineDisplay.scss";

type AirlineDisplayProps = {
  airline: Airline;
  flightNumber?: string;
};

export function AirlineDisplay({ airline, flightNumber }: AirlineDisplayProps) {
  const iataCode = flightNumber?.substring(0, 2) ?? null;

  return (
    <div className="AirlineDisplay">
      <AirlineTail
        key={flightNumber || airline.name}
        airline={airline}
        flightNumber={flightNumber}
        noTooltip={true}
      />

      <div className="airline-details">
        <p className="airline-name">{airline.name}</p>

        <div className="airline-code text-small">{iataCode || "N/A"}</div>
      </div>
    </div>
  );
}

import type { Flight } from "../../../../../data/classes/flights/Flight";
import { joinClasses } from "../../../../../util/componentUtil";

type FlightPillProps = {
  flight: Flight;
  highlighted?: boolean;
};

export function FlightPill({ flight, highlighted }: FlightPillProps) {
  return (
    <div
      className={joinClasses("FlightPill", highlighted && "highlighted")}
      key={flight.id}
    >
      <div className="icon"></div>

      <div className="details">
        <div className="header">
          <div className="left">
            <span className="flight-number">{flight.flightNumber}</span>
            <span className="route">
              {flight.origin.displayCode} → {flight.destination.displayCode}
            </span>
          </div>

          <div className="right">{flight.date?.toDateString()}</div>
        </div>

        <div className="middle">
          {flight.origin.name} to {flight.destination.name}
        </div>

        <div className="footer">
          <span className="plane-model">
            {flight.plane?.model || "Unknown"} •{" "}
            {flight.plane?.registration || "UN-KNWN"}
          </span>
        </div>
      </div>
    </div>
  );
}

import type {
  Airport,
  AirportType,
} from "../../../../../data/classes/flights/Airport";
import type { Flight } from "../../../../../data/classes/flights/Flight";
import { useAppDispatch } from "../../../../../data/store";
import { clearSelectedFlight } from "../../../../../data/uiSlice";
import { joinClasses } from "../../../../../util/componentUtil";

import "./FlightView.scss";

type FlightViewProps = {
  flight: Flight;
};

export function FlightView({ flight }: FlightViewProps) {
  const dispatch = useAppDispatch();

  const goBack = () => dispatch(clearSelectedFlight());

  return (
    <div className="FlightView">
      <button onClick={goBack}>back</button>

      <div className="content">
        <h4 className="title">
          {flight.flightNumber && (
            <>
              <span className="flight-number">{flight.flightNumber}:</span>{" "}
            </>
          )}
          {flight.origin.city} to {flight.destination.city}
        </h4>

        {flight.date && (
          <div className="date">
            <h5>Date:</h5>
            {flight.date.toLocaleDateString()}
          </div>
        )}

        {flight.airline && (
          <div className="airline-details">
            <h5>Airline:</h5>
            {flight.airline.name}
          </div>
        )}

        {flight.plane && (
          <div className="plane-details">
            <h5>Plane:</h5>
            {flight.plane
              ? `${flight.plane.model || "unknown model"}${
                  flight.plane?.registration
                    ? ` • ${flight.plane?.registration}`
                    : ""
                }`
              : "Unknown Plane"}
          </div>
        )}

        <div className="route-details">
          <h5>Route:</h5>
          {flight.route.origin.displayCode} -&gt;{" "}
          {flight.route.destination.displayCode}
        </div>

        <div className="airport-details">
          <div className="origin">
            <h5>Origin:</h5>
            {AirportDetails({ airport: flight.origin })}
          </div>

          <div className="destination">
            <h5>Destination:</h5>
            {AirportDetails({ airport: flight.destination })}
          </div>
        </div>

        {flight.note && (
          <div className="notes">
            <h5>Notes:</h5>
            {flight.note}
          </div>
        )}
      </div>
    </div>
  );
}

function AirportDetails({
  airport,
  className,
}: {
  airport: Airport;
  className?: string;
}) {
  return (
    <div className={joinClasses("AirportDetails", className)}>
      <span className="name">
        {<AirportCodePill airport={airport} />} {airport.name}
      </span>

      <span className="subline">
        {displayAirportType(airport.type)} • {airport.city}, {airport.isoRegion}
        , {airport.isoCountry}
      </span>
    </div>
  );
}

function AirportCodePill({ airport }: { airport: Airport }) {
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

function displayAirportType(type: AirportType) {
  switch (type) {
    case "large_airport":
      return "Large Airport";
    case "medium_airport":
      return "Medium Airport";
    case "small_airport":
      return "Small Airport";
    case "seaplane_base":
      return "Seaplane Base";
    default:
      return type;
  }
}

import { icons } from "../../../../../assets/text/icons";
import type { Route } from "../../../../../data/classes/flights/Route";
import { selectSelectedFlights } from "../../../../../data/services/flights/selectFlights";
import { useAppSelector } from "../../../../../data/store";
import { AirportDetails } from "./AirportDetails";
import { FlightListItem } from "./FlightListItem";

import "./RouteView.scss";

export function RouteView({ route }: { route: Route | undefined }) {
  const flights = useAppSelector((state) => selectSelectedFlights(state));

  if (!route || !flights || flights.length === 0) {
    return <></>;
  }

  return (
    <div className="RouteView">
      <h4 className="title">
        {route.origin.city} {icons.flights.route(16)} {route.destination.city}
      </h4>

      <div className="airport-details">
        <div className="origin">
          <h5>Origin:</h5>
          <AirportDetails airport={route.origin} />
        </div>

        <div className="destination">
          <h5>Destination:</h5>
          <AirportDetails airport={route.destination} />
        </div>
      </div>

      <div className="flights">
        <h5>Flights:</h5>

        <p className="flight-count">{flights.length} flights on this route</p>

        <div className="flight-list">
          {flights.map((flight) => (
            <FlightListItem key={flight.id} flight={flight} />
          ))}
        </div>
      </div>
    </div>
  );
}

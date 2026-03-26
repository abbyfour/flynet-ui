import { icons } from "../../../../../assets/icons/icons";
import type { Route } from "../../../../../data/classes/flights/Route";
import { setSelected } from "../../../../../data/flightsSlice";
import { selectSelectedFlights } from "../../../../../data/services/flights/selectFlights";
import { useAppDispatch, useAppSelector } from "../../../../../data/store";
import { AirportDisplay } from "./components/displays/AirportDisplay";
import { FlightListItem } from "./FlightListItem";

import "./RouteView.scss";

export function RouteView({ route }: { route: Route | undefined }) {
  const flights = useAppSelector((state) => selectSelectedFlights(state));
  const dispatch = useAppDispatch();

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
          <h5>Airport 1:</h5>
          <AirportDisplay
            airport={route.origin}
            onClick={() =>
              route.origin &&
              dispatch(
                setSelected({
                  type: "airport",
                  airportId: route.origin.id,
                }),
              )
            }
          />
        </div>

        <div className="destination">
          <h5>Airport 2:</h5>
          <AirportDisplay
            airport={route.destination}
            onClick={() =>
              route.destination &&
              dispatch(
                setSelected({
                  type: "airport",
                  airportId: route.destination.id,
                }),
              )
            }
          />
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

import type { Flight } from "../../../../../data/classes/flights/Flight";
import { useGetFlightsQuery } from "../../../../../data/services/flights/flightsAPI";
import {
  selectFlightsAsObjects,
  selectSelectedFlight,
} from "../../../../../data/services/flights/selectFlights";
import { useAppSelector } from "../../../../../data/store";
import { FlightPill } from "./FlightPill";
import "./Flights.scss";
import { FlightView } from "./FlightView";

export function Flights() {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const selectedFlight = useAppSelector(selectSelectedFlight);
  const { isLoading: flightsLoading, isError: flightsErrored } =
    useGetFlightsQuery();

  const flightsReady = !flightsLoading && !flightsErrored;

  const flights = useAppSelector(selectFlightsAsObjects);
  const highlightedRouteKey = useAppSelector(
    (state) => state.ui.highlightedRouteKey,
  );
  const highlightedAirportId = useAppSelector(
    (state) => state.ui.highlightedAirportId,
  );

  const isHighlighted = (flight: Flight) =>
    highlightedRouteKey === flight.route.key ||
    highlightedAirportId === flight.route.origin.id ||
    highlightedAirportId === flight.route.destination.id;

  if (!currentUser) {
    return (
      <div>
        <p>Please log in to view your flights.</p>
      </div>
    );
  }

  return (
    <div className="Flights">
      <h3 className="title">Flights</h3>

      {!flightsReady ? <p>Loading flights...</p> : <></>}

      {flightsReady && selectedFlight ? (
        <FlightView flight={selectedFlight} />
      ) : (
        <></>
      )}

      {!selectedFlight && flights && flights.length ? (
        <ul>
          {flights.map((flight) => (
            <FlightPill
              key={flight.id}
              flight={flight}
              highlighted={isHighlighted(flight)}
            />
          ))}
        </ul>
      ) : (
        <></>
      )}
    </div>
  );
}

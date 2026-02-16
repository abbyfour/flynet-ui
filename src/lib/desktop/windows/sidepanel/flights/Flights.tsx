import type { Flight } from "../../../../../data/classes/flights/Flight";
import { useGetFlightsQuery } from "../../../../../data/services/flights/flightsAPI";
import { selectFlightsAsObjects } from "../../../../../data/services/flights/selectFlights";
import { useAppSelector } from "../../../../../data/store";
import { FlightPill } from "./FlightPill";
import "./Flights.scss";

export function Flights() {
  const currentUser = useAppSelector((state) => state.user.currentUser);
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
      <h1 className="title">Flights</h1>

      {!flightsReady ? <p>Loading flights...</p> : <></>}

      {flights && flights.length ? (
        <ul>
          {flights.map((flight) => (
            <FlightPill flight={flight} highlighted={isHighlighted(flight)} />
          ))}
        </ul>
      ) : (
        <p>No flights found.</p>
      )}
    </div>
  );
}

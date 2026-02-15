import { useGetFlightsQuery } from "../../../../data/services/flights/flightsAPI";
import { useAppSelector } from "../../../../data/store";

export function Flights() {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const { data: flights, isLoading: areFlightsLoading } = useGetFlightsQuery();

  if (!currentUser) {
    return (
      <div>
        <p>Please log in to view your flights.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Flights</h1>

      {areFlightsLoading ? <p>Loading flights...</p> : <></>}

      {flights && flights.items.length ? (
        <ul>
          {flights.items.map((flight) => (
            <li key={flight.id}>
              Flight {flight.id} - {flight.originAirport.airportName} to{" "}
              {flight.destinationAirport.airportName}
            </li>
          ))}
        </ul>
      ) : (
        <p>No flights found.</p>
      )}
    </div>
  );
}

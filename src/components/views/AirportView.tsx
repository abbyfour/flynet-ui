import { AirportDisplay } from "@components/displays/AirportDisplay";
import { FlightListItem } from "@components/panels/flights/FlightListItem";
import type { Airport } from "@data/classes/flights/Airport";
import type { Flight } from "@data/classes/flights/Flight";
import { setSelected } from "@data/flightsSlice";
import { SelectionType } from "@data/services/SelectionHistory";
import { useAppDispatch } from "@data/store";
import { uniquifyBy } from "@util/arrayUtil";
import { displayAirportType } from "@util/flights";
import "./AirportView.scss";

export function AirportView({
  airport,
  flights,
}: {
  airport: Airport | undefined;
  flights: Flight[];
}) {
  const dispatch = useAppDispatch();

  if (!airport || flights.length === 0) {
    return <></>;
  }

  return (
    <div className="AirportView">
      <h4 className="title">
        {airport.name}
        {airport.displayCode && (
          <>
            <span className="airport-code">{airport.displayCode}</span>
          </>
        )}
      </h4>

      <div className="location">
        <h5 className="tiny-header">Location:</h5>
        <span>
          {airport.city}, {airport.isoRegion}, {airport.isoCountry}
        </span>
      </div>

      <div className="type">
        <h5 className="tiny-header">Type:</h5>
        <span>{displayAirportType(airport.type)}</span>
      </div>

      <div className="coordinates">
        <h5 className="tiny-header">Coordinates:</h5>
        <span>
          {airport.coords[0].toFixed(4)}, {airport.coords[1].toFixed(4)}
        </span>
      </div>

      <div className="destinations">
        <h5 className="tiny-header">Your destinations:</h5>
        <div className="destinations-list">
          {uniquifyBy(
            flights
              .filter(
                (flight) =>
                  flight.origin.id === airport.id ||
                  flight.destination.id === airport.id,
              )
              .flatMap((flight) =>
                [flight.origin, flight.destination].filter(
                  (a) => a.id !== airport.id,
                ),
              ),
            (a) => a.id,
          )
            .sort((a, b) => a.city.localeCompare(b.city))
            .map((airport) => (
              <AirportDisplay
                key={airport.id}
                airport={airport}
                minimal
                onClick={() =>
                  dispatch(
                    setSelected({
                      type: SelectionType.Airport,
                      airportId: airport.id,
                    }),
                  )
                }
              />
            ))}
        </div>
      </div>

      <div>
        <h5 className="tiny-header">Flights:</h5>

        <p className="flight-count">
          {flights.length} flights to or from this airport
        </p>
      </div>

      <div className="flights">
        <div className="flight-list">
          {flights.map((flight) => (
            <FlightListItem key={flight.id} flight={flight} />
          ))}
        </div>
      </div>
    </div>
  );
}

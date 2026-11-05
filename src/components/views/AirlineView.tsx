import { FlightListItem } from "@components/panels/flights/FlightListItem";
import type { Airline } from "@data/classes/flights/Airline";
import type { Flight } from "@data/classes/flights/Flight";
import { uniquifyBy } from "@util/arrayUtil";

import { LocationModule } from "@data/location/Location";
import { Link } from "@data/location/navigator/Link";
import { SelectionType } from "@data/location/Selection";
import "./AirlineView.scss";

export function AirlineView({
  airline,
  flights,
}: {
  airline: Airline | undefined;
  flights: Flight[];
}) {
  if (!airline || flights.length === 0) {
    return <></>;
  }

  return (
    <div className="AirlineView">
      <div className="content">
        <h4 className="title">
          {airline.name}
          {airline.iataCode && (
            <>
              <span className="subtitle">{airline.iataCode}</span>
            </>
          )}
        </h4>

        <div className="planes">
          <h5 className="tiny-header">Planes:</h5>

          <ul className="planes-list">
            {uniquifyBy(
              flights.filter((flight) => !!flight.airline),
              (a) => a.aircraft?.manufacturerModel,
            )
              .sort(
                (a, b) =>
                  a.aircraft?.manufacturerModel?.localeCompare(
                    b.aircraft?.manufacturerModel ?? "",
                  ) ?? 0,
              )
              .map((flight) => (
                <li key={flight.id}>
                  •{" "}
                  <Link
                    to={{
                      module: LocationModule.Flights,
                      selected: {
                        type: SelectionType.Aircraft,
                        aircraftId: flight.aircraft!.id,
                      },
                    }}
                  >
                    {flight.aircraft?.manufacturerModel}
                  </Link>
                </li>
              ))}
          </ul>
        </div>

        <div className="flights">
          <h5 className="tiny-header">Flights:</h5>

          <p className="flight-count">
            {flights.length} flights for this airline
          </p>
        </div>

        <div className="flight-list">
          {flights.map((flight) => (
            <FlightListItem key={flight.id} flight={flight} />
          ))}
        </div>
      </div>
    </div>
  );
}

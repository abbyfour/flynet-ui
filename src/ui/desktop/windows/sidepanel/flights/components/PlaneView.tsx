import type { Plane } from "../../../../../../data/classes/flights/Plane";
import { selectSelectedFlights } from "../../../../../../data/services/flights/selectFlights";
import { useAppSelector } from "../../../../../../data/store";
import { uniquifyBy } from "../../../../../../util/arrayUtil";
import { FlightListItem } from "../FlightListItem";

import "./PlaneView.scss";

export function PlaneView({ plane }: { plane: Plane | undefined }) {
  const flights = useAppSelector((state) => selectSelectedFlights(state));

  if (!plane || !flights || flights.length === 0) {
    return <></>;
  }

  return (
    <div className="PlaneView">
      <div className="content">
        <h4 className="title">
          <span className="manufacturer">{plane.manufacturer}</span>
          <span className="model">{plane.manufacturerModel}</span>
        </h4>

        <div className="airlines">
          <h5>Airlines:</h5>

          <ul className="airlines-list">
            {uniquifyBy(
              flights.filter((flight) => !!flight.airline),
              (a) => a.airline?.name,
            )
              .sort(
                (a, b) =>
                  a.airline?.name?.localeCompare(b.airline?.name ?? "") ?? 0,
              )
              .map((flight) => (
                <li key={flight.id}>{flight.airline?.name}</li>
              ))}
          </ul>
        </div>

        <div>
          <h5>Flights:</h5>

          <p className="flight-count">{flights.length} flights on this plane</p>
        </div>

        <div className="flights">
          <div className="flight-list">
            {flights.map((flight) => (
              <FlightListItem key={flight.id} flight={flight} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

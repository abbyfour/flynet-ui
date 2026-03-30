import { icons } from "../../../../../../assets/icons/icons";
import type { Plane } from "../../../../../../data/classes/flights/Plane";
import { selectSelectedFlights } from "../../../../../../data/services/flights/selectFlights";
import { useAppSelector } from "../../../../../../data/store";
import {
  flightawareLink,
  jetphotosLink,
  planespottersLink,
} from "../../../../../../util/flights";
import { FlightListItem } from "../FlightListItem";

import "./RegistrationView.scss";

type RegistrationViewProps = {
  plane: Plane;
};

export function RegistrationView({ plane }: RegistrationViewProps) {
  const flights = useAppSelector((state) => selectSelectedFlights(state));

  if (!plane?.registration || !flights || flights.length === 0) {
    return <></>;
  }

  return (
    <div className="RegistrationView">
      <div className="content">
        <h4 className="title">
          {plane.registration}
          <span className="subtitle">{plane.model}</span>
        </h4>

        <div>
          <h5 className="tiny-header">External links:</h5>

          <div className="external-links">
            <a
              href={jetphotosLink(plane.registration)}
              target="_blank"
              rel="noopener noreferrer"
            >
              JetPhotos {icons.actions.externalLink()}
            </a>

            <a
              href={flightawareLink(plane.registration)}
              target="_blank"
              rel="noopener noreferrer"
            >
              FlightAware {icons.actions.externalLink()}
            </a>

            <a
              href={planespottersLink(plane.registration)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Planespotters {icons.actions.externalLink()}
            </a>
          </div>
        </div>

        <div className="flights">
          <h5 className="tiny-header">Flights:</h5>

          <p className="flight-count">
            {flights.length} flights on this aircraft
          </p>

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

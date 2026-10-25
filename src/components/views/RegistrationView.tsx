import { icons } from "@assets/icons/icons";
import { FlightListItem } from "@components/panels/flights/FlightListItem";
import type { Aircraft } from "@data/classes/flights/Aircraft";
import type { Flight } from "@data/classes/flights/Flight";
import {
  flightawareLink,
  jetphotosLink,
  planespottersLink,
} from "@util/flights";

import "./RegistrationView.scss";

type RegistrationViewProps = {
  aircraft: Aircraft;
  flights: Flight[];
};

export function RegistrationView({
  aircraft,
  flights,
}: RegistrationViewProps) {
  if (!aircraft?.registration || flights.length === 0) {
    return <></>;
  }

  return (
    <div className="RegistrationView">
      <div className="content">
        <h4 className="title">
          {aircraft.registration}
          <span className="subtitle">{aircraft.model}</span>
        </h4>

        <div>
          <h5 className="tiny-header">External links:</h5>

          <div className="external-links">
            <a
              href={jetphotosLink(aircraft.registration)}
              target="_blank"
              rel="noopener noreferrer"
            >
              JetPhotos {icons.actions.externalLink()}
            </a>

            <a
              href={flightawareLink(aircraft.registration)}
              target="_blank"
              rel="noopener noreferrer"
            >
              FlightAware {icons.actions.externalLink()}
            </a>

            <a
              href={planespottersLink(aircraft.registration)}
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

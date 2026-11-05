import { icons } from "@assets/icons/icons";
import { AircraftDisplay } from "@components/displays/AircraftDisplay";
import { FlightListItem } from "@components/panels/flights/FlightListItem";
import { useSelect } from "@components/panels/flights/useSelect";
import type { Aircraft } from "@data/classes/flights/Aircraft";
import type { Flight } from "@data/classes/flights/Flight";
import { SelectionType } from "@data/location/Selection";
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

export function RegistrationView({ aircraft, flights }: RegistrationViewProps) {
  const select = useSelect();

  if (!aircraft?.registration || flights.length === 0) {
    return <></>;
  }

  return (
    <div className="RegistrationView">
      <div className="content">
        <h4 className="title">{aircraft.registration}</h4>

        <div className="manufacturer-model">
          <h5 className="tiny-header">Model:</h5>
          <AircraftDisplay
            aircraft={aircraft.deregister()}
            onClick={() =>
              select({
                type: SelectionType.Aircraft,
                aircraftId: aircraft.id,
              })
            }
          />
        </div>

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

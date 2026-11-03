import { icons } from "@assets/icons/icons";
import { m } from "@assets/text/messages";
import { Button } from "@components/common/buttons/Button";
import { DeleteButton } from "@components/common/buttons/DeleteButton";
import { confirm } from "@components/common/notices/Confirm";
import { dispatchNotice } from "@components/common/notices/dispatchNotice";
import { Toasts } from "@components/common/notices/Toast";
import { AircraftDisplay } from "@components/displays/AircraftDisplay";
import { AirlineDisplay } from "@components/displays/AirlineDisplay";
import { AirportDisplay } from "@components/displays/AirportDisplay";
import { RouteDisplay } from "@components/displays/RouteDisplay";
import { useSelect } from "@components/panels/flights/useSelect";
import type { Flight } from "@data/classes/flights/Flight";
import { useDeleteFlightMutation } from "@data/services/flights/flightsAPI";
import { LocationModule } from "@location/Location";
import { useNavigator } from "@location/navigator/hooks";
import { SelectionType } from "@location/Selection";

import "./FlightView.scss";

type FlightViewProps = {
  flight: Flight;
  canEdit?: boolean;
};

export function FlightView({ flight, canEdit = true }: FlightViewProps) {
  const navigator = useNavigator();
  const select = useSelect();

  const [deleteFlight] = useDeleteFlightMutation();

  const handleDeleteFlight = async () => {
    const confirmation = await confirm({
      title: m.flight.confirmDeletion.title,
      children: <p>{m.flight.confirmDeletion.text}</p>,
      color: "red",
      labels: { confirm: "Yes, goodbye.", cancel: "Nevermind..." },
    });

    if (confirmation) {
      const result = await deleteFlight(flight.id);

      if (result.error) {
        dispatchNotice(Toasts.error(m.flight.couldNotBeDeleted));
      } else {
        dispatchNotice(Toasts.success(m.flight.deletedSuccessfully()));
      }

      navigator.back();
    }
  };

  const handleEditFlight = () => {
    navigator.push({
      module: LocationModule.Flights,
      draft: { type: "edit", flightId: flight.id },
    });
  };

  return (
    <div className="FlightView">
      <div className="flight">
        <h4 className="title">
          {flight.flightNumber && <>{flight.flightNumber}</>}
          <span className="subtitle">
            {flight.origin.city} to {flight.destination.city}
          </span>
        </h4>

        {flight.date && (
          <div>
            <div className="date">
              {icons.flights.date(16)} {flight.date.toLocaleDateString()}{" "}
            </div>

            {flight.departureTime && flight.arrivalTime && (
              <div className="time">
                <div className="departure-time">
                  {icons.flights.departure(16)} {flight.departureTime}
                </div>

                <div className="arrival-time">
                  {icons.flights.arrival(16)} {flight.arrivalTime}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="route-details">
          <RouteDisplay
            route={flight.route}
            onClick={() =>
              flight.route &&
              select({
                type: SelectionType.Route,
                routeKey: flight.route.key,
              })
            }
          />

          <AirportDisplay
            airport={flight.origin}
            onClick={() =>
              flight.origin &&
              select({
                type: SelectionType.Airport,
                airportId: flight.origin.id,
              })
            }
          />

          <AirportDisplay
            airport={flight.destination}
            onClick={() =>
              flight.destination &&
              select({
                type: SelectionType.Airport,
                airportId: flight.destination.id,
              })
            }
          />
        </div>

        {flight.airline && (
          <div className="airline-details">
            <h5 className="tiny-header">Airline:</h5>

            <AirlineDisplay
              airline={flight.airline}
              flightNumber={flight.flightNumber}
              onClick={() =>
                flight.airline &&
                select({
                  type: SelectionType.Airline,
                  airlineId: flight.airline.id,
                })
              }
            />
          </div>
        )}

        {flight.aircraft && (
          <div className="plane-details">
            <h5 className="tiny-header">Plane:</h5>
            <AircraftDisplay
              aircraft={flight.aircraft}
              onClick={() =>
                flight.aircraft &&
                select({
                  type: SelectionType.Aircraft,
                  aircraftId: flight.aircraft.id,
                })
              }
              onRegistrationClick={() =>
                flight.aircraft?.registration &&
<<<<<<< Updated upstream
                select({
                  type: SelectionType.Registration,
                  registration: flight.aircraft!.registration!,
                })
=======
<<<<<<< Updated upstream
                dispatch(
                  setSelected({
                    type: SelectionType.Registration,
                    registration: flight.aircraft!.registration!,
                  }),
                )
=======
                select({
                  type: SelectionType.Registration,
                  registration: flight.aircraft.registration,
                })
>>>>>>> Stashed changes
>>>>>>> Stashed changes
              }
            />
          </div>
        )}

        {flight.note && (
          <div className="notes support-newlines">
            <h5 className="tiny-header">Notes:</h5>
            {flight.note}
          </div>
        )}
      </div>

      {canEdit && (
        <div className="action-buttons">
          <Button icon={icons.actions.edit(16)} onClick={handleEditFlight}>
            Edit
          </Button>
          <DeleteButton
            className="delete-button"
            onClick={handleDeleteFlight}
          />
        </div>
      )}
    </div>
  );
}

import { m } from "../../../../../assets/text/messages";
import type { Flight } from "../../../../../data/classes/flights/Flight";
import {
  goBackInSelection,
  setEditingFlight,
  setSelected,
} from "../../../../../data/flightsSlice";
import { useDeleteFlightMutation } from "../../../../../data/services/flights/flightsAPI";
import { useAppDispatch } from "../../../../../data/store";
import { confirm } from "../../../../notices/Confirm";

import { icons } from "../../../../../assets/icons/icons";
import { Button } from "../../../../buttons/Button";
import { DeleteButton } from "../../../../buttons/DeleteButton";
import { Toasts } from "../../../../notices/Toast";
import { dispatchNotice } from "../../../../notices/dispatchNotice";
import "./FlightView.scss";
import { AirlineDisplay } from "./components/displays/AirlineDisplay";
import { AirportDisplay } from "./components/displays/AirportDisplay";
import { RouteDisplay } from "./components/displays/RouteDisplay";

type FlightViewProps = {
  flight: Flight;
};

export function FlightView({ flight }: FlightViewProps) {
  const dispatch = useAppDispatch();

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

      dispatch(goBackInSelection());
    }
  };

  const handleEditFlight = () => {
    dispatch(setEditingFlight({ flightId: flight.id }));
  };

  return (
    <div className="FlightView">
      <div className="content">
        <h4 className="title">
          {flight.flightNumber && (
            <>
              <span className="flight-number">{flight.flightNumber}</span>
            </>
          )}
          {flight.origin.city} to {flight.destination.city}
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
          <h5>Route:</h5>
          <RouteDisplay
            route={flight.route}
            onClick={() =>
              dispatch(
                flight.route &&
                  setSelected({
                    type: "route",
                    routeKey: flight.route?.key,
                  }),
              )
            }
          />

          <AirportDisplay
            airport={flight.origin}
            onClick={() =>
              flight.origin &&
              dispatch(
                setSelected({
                  type: "airport",
                  airportId: flight.origin.id,
                }),
              )
            }
          />

          <AirportDisplay
            airport={flight.destination}
            onClick={() =>
              flight.destination &&
              dispatch(
                setSelected({
                  type: "airport",
                  airportId: flight.destination.id,
                }),
              )
            }
          />
        </div>

        {flight.airline && (
          <div className="airline-details">
            <h5>Airline:</h5>

            <AirlineDisplay
              airline={flight.airline}
              flightNumber={flight.flightNumber}
              onClick={() =>
                flight.airline &&
                dispatch(
                  setSelected({
                    type: "airline",
                    airlineId: flight.airline!.name,
                  }),
                )
              }
            />
          </div>
        )}

        {flight.plane && (
          <div className="plane-details">
            <h5>Plane:</h5>
            {flight.plane
              ? `${flight.plane.model || "unknown model"}${
                  flight.plane?.registration
                    ? ` • ${flight.plane?.registration}`
                    : ""
                }`
              : "Unknown Plane"}
          </div>
        )}

        {flight.note && (
          <div className="notes">
            <h5>Notes:</h5>
            {flight.note}
          </div>
        )}
      </div>

      <div className="action-buttons">
        <Button icon={icons.actions.edit(16)} onClick={handleEditFlight}>
          Edit
        </Button>
        <DeleteButton className="delete-button" onClick={handleDeleteFlight} />
      </div>
    </div>
  );
}

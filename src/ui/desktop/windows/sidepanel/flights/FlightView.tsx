import { m } from "../../../../../assets/text/messages";
import type {
  Airport,
  AirportType,
} from "../../../../../data/classes/flights/Airport";
import type { Flight } from "../../../../../data/classes/flights/Flight";
import {
  clearSelectedFlight,
  setEditingFlight,
} from "../../../../../data/flightsSlice";
import { useDeleteFlightMutation } from "../../../../../data/services/flights/flightsAPI";
import { useAppDispatch } from "../../../../../data/store";
import { joinClasses } from "../../../../../util/componentUtil";
import { confirm } from "../../../../notices/Confirm";

import { icons } from "../../../../../assets/text/icons";
import { Button } from "../../../../buttons/Button";
import { DeleteButton } from "../../../../buttons/DeleteButton";
import { Toasts } from "../../../../notices/Toast";
import { dispatchNotice } from "../../../../notices/dispatchNotice";
import "./FlightView.scss";

type FlightViewProps = {
  flight: Flight;
};

export function FlightView({ flight }: FlightViewProps) {
  const dispatch = useAppDispatch();

  const [deleteFlight] = useDeleteFlightMutation();

  const goBack = () => dispatch(clearSelectedFlight());

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

      goBack();
    }
  };

  const handleEditFlight = () => {
    dispatch(
      setEditingFlight({ flightId: flight.id, draft: flight.toDraft() }),
    );
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

        {flight.airline && (
          <div className="airline-details">
            <h5>Airline:</h5>
            {flight.airline.name}
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

        <div className="route-details">
          <h5>Route:</h5>
          <span className="route">
            {flight.route.origin.displayCode} {icons.flights.flightRoute(16)}{" "}
            {flight.route.destination.displayCode}
          </span>
        </div>

        <div className="airport-details">
          <div className="origin">
            <h5>Origin:</h5>
            {AirportDetails({ airport: flight.origin })}
          </div>

          <div className="destination">
            <h5>Destination:</h5>
            {AirportDetails({ airport: flight.destination })}
          </div>
        </div>

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

function AirportDetails({
  airport,
  className,
}: {
  airport: Airport;
  className?: string;
}) {
  return (
    <div className={joinClasses("AirportDetails", className)}>
      <div className="left">
        <AirportCodePill airport={airport} />
      </div>

      <div className="right">
        <span className="name">{airport.name}</span>

        <span className="subline">
          {displayAirportType(airport.type)} • {airport.city},{" "}
          {airport.isoRegion}, {airport.isoCountry}
        </span>
      </div>
    </div>
  );
}

function AirportCodePill({ airport }: { airport: Airport }) {
  return (
    <div className="AirportCodePill">
      {airport.displayCode}
      <span className="tooltip">
        IATA: {airport.iataCode || "N/A"} | ICAO: {airport.icaoCode || "N/A"} |
        Local: {airport.localCode || "N/A"}
      </span>
    </div>
  );
}

function displayAirportType(type: AirportType) {
  switch (type) {
    case "large_airport":
      return "Large Airport";
    case "medium_airport":
      return "Medium Airport";
    case "small_airport":
      return "Small Airport";
    case "seaplane_base":
      return "Seaplane Base";
    default:
      return type;
  }
}

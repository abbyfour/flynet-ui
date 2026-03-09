import { IconArrowMoveRight } from "@tabler/icons-react";
import type { Flight } from "../../../../../data/classes/flights/Flight";
import { setSelectedFlight } from "../../../../../data/flightsSlice";
import { useAppDispatch } from "../../../../../data/store";
import { joinClasses } from "../../../../../util/componentUtil";

import "./FlightListItem.scss";

type FlightListItemProps = {
  flight: Flight;
  highlighted?: boolean;
};

export function FlightListItem({ flight, highlighted }: FlightListItemProps) {
  const dispatch = useAppDispatch();

  const handleOnClick = () => {
    dispatch(setSelectedFlight(flight.id));
  };

  return (
    <div
      className={joinClasses("FlightListItem", highlighted && "highlighted")}
      onClick={handleOnClick}
    >
      <div className="icon"></div>

      <div className="details">
        <div className="header text-small">
          <div className="left">
            {flight.flightNumber && (
              <span className="flight-number">{flight.flightNumber}</span>
            )}
            <span className="route">
              {flight.origin.displayCode} <IconArrowMoveRight size={16} />{" "}
              {flight.destination.displayCode}
            </span>
          </div>

          <div className="right">{flight.date?.toDateString()}</div>
        </div>

        <div className="middle">
          {flight.origin.city} to {flight.destination.city}
        </div>

        <div className="footer text-small">
          <span className="plane-model">
            {flight.plane ? (
              <>
                {flight.plane?.model || "unknown model"}
                {flight.plane?.registration
                  ? ` • ${flight.plane?.registration}`
                  : ""}
              </>
            ) : (
              "unknown plane"
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

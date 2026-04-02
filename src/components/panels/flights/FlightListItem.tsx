import { icons } from "@assets/icons/icons";
import { AirlineTail } from "@assets/tails/AirlineTail";
import type { Flight } from "@data/classes/flights/Flight";
import { setSelected } from "@data/flightsSlice";
import { useAppDispatch } from "@data/store";
import { IconCircleFilled } from "@tabler/icons-react";
import { joinClasses } from "@util/componentUtil";
import "./FlightListItem.scss";

type FlightListItemProps = {
  flight: Flight;
  highlighted?: boolean;
};

export function FlightListItem({ flight, highlighted }: FlightListItemProps) {
  const dispatch = useAppDispatch();

  const handleOnClick = () => {
    dispatch(setSelected({ type: "flight", flightId: flight.id }));
  };

  return (
    <div
      className={joinClasses(
        "FlightListItem",
        highlighted && "highlighted",
        flight.upcoming && "upcoming",
      )}
      onClick={handleOnClick}
    >
      <div className="icon">
        <AirlineTail
          key={flight.id}
          airline={flight.airline}
          flightNumber={flight.flightNumber}
        />
      </div>

      <div className="details">
        <div className="header text-small">
          <div className="left">
            {flight.flightNumber && (
              <span className="flight-number">{flight.flightNumber}</span>
            )}
            <span className="route">
              {flight.origin.displayCode} {icons.flights.flightRoute(13)}
              {flight.destination.displayCode}
            </span>
          </div>

          <div className="right">
            {flight.upcoming && (
              <IconCircleFilled size={8} color="var(--teal)" />
            )}
            {flight.date?.toDateString()}
          </div>
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

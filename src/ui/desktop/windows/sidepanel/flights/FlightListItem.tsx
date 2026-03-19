import { Tooltip } from "@mantine/core";
import { IconCircleFilled } from "@tabler/icons-react";
import { getAirlineTailSvg } from "../../../../../assets/tails/airlineTailSvgs";
import { icons } from "../../../../../assets/text/icons";
import type { Flight } from "../../../../../data/classes/flights/Flight";
import { setSelected } from "../../../../../data/flightsSlice";
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
    dispatch(setSelected({ type: "flight", flightId: flight.id }));
  };

  const tailSvgFile = getAirlineTailSvg(flight.airline?.name);

  // Render SVG if found
  const tailIcon = tailSvgFile ? (
    <Tooltip label={flight.airline?.name || "Unknown Airline"} openDelay={500}>
      <img
        src={tailSvgFile}
        alt={flight.airline?.name + " tail"}
        className="tail-svg"
      />
    </Tooltip>
  ) : null;
  return (
    <div
      className={joinClasses(
        "FlightListItem",
        highlighted && "highlighted",
        flight.upcoming && "upcoming",
      )}
      onClick={handleOnClick}
    >
      <div className="icon">{tailIcon}</div>

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
              <IconCircleFilled size={8} color="rgb(133, 184, 51)" />
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

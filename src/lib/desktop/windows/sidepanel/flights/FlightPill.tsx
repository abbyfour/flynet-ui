import type { Flight } from "../../../../../data/classes/flights/Flight";
import { useAppDispatch } from "../../../../../data/store";
import { setSelectedFlight } from "../../../../../data/uiSlice";
import { joinClasses } from "../../../../../util/componentUtil";

type FlightPillProps = {
  flight: Flight;
  highlighted?: boolean;
};

export function FlightPill({ flight, highlighted }: FlightPillProps) {
  const dispatch = useAppDispatch();

  const handleOnClick = () => {
    dispatch(setSelectedFlight(flight.id));
  };

  return (
    <div
      className={joinClasses("FlightPill", highlighted && "highlighted")}
      key={flight.id}
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
              {flight.origin.displayCode} → {flight.destination.displayCode}
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

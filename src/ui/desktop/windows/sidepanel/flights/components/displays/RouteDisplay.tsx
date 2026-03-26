import { icons } from "../../../../../../../assets/icons/icons";
import type { Route } from "../../../../../../../data/classes/flights/Route";

import "./RouteDisplay.scss";

type RouteDisplayProps = {
  route: Route;
  onClick?: () => void;
};

export function RouteDisplay({ route, onClick }: RouteDisplayProps) {
  return (
    <div className="RouteDisplay" onClick={onClick}>
      <div className="terminus">
        <span className="iata">{route.origin.displayCode}</span>
        <div className="dot"></div>
      </div>

      <div className="line"></div>
      <div className="plane">{icons.flights.plane(24)}</div>

      <div className="terminus">
        <div className="dot"></div>
        <span className="iata">{route.destination.displayCode}</span>
      </div>
    </div>
  );
}

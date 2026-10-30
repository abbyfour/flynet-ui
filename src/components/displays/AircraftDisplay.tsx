import { AircraftIcon } from "@assets/aircraft-icons/AircraftIcon";
import type { Aircraft } from "@data/classes/flights/Aircraft";
import type { MouseEvent } from "react";

import "./AircraftDisplay.scss";

type AircraftDisplayProps = {
  aircraft: Aircraft;
  onClick?: () => void;
  onRegistrationClick?: () => void;
  noHover?: boolean;
};

const largeFootprintModels = new Set([
  "A388",
  "A380",
  "A225",
  "A124",
  "B748",
  "B744",
  "B742",
  "B74S",
  "C5M",
  "AN12",
]);

function normalizeModelText(value: string): string {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

export function AircraftDisplay({
  aircraft,
  onClick,
  onRegistrationClick,
  noHover = false,
}: AircraftDisplayProps) {
  const planeName = aircraft.model ?? "Unknown aircraft";
  const registrationCode = aircraft.registration ?? "";
  const normalizedModel = normalizeModelText(planeName);
  const iconSizeClass = largeFootprintModels.has(normalizedModel)
    ? "large-airframe"
    : "standard-airframe";

  const handleRegistrationClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onRegistrationClick?.();
  };

  return (
    <div
      className={`AircraftDisplay ${noHover ? "no-hover" : ""}`}
      onClick={onClick}
    >
      <div className={`aircraft-icon-frame ${iconSizeClass}`}>
        <AircraftIcon
          className="aircraft-icon"
          icaoCode={aircraft.icaoCode}
          ariaLabel={`${planeName} aircraft`}
        />
      </div>

      <div className="aircraft-details">
        <p className="aircraft-name">
          {aircraft.manufacturer && aircraft.manufacturer !== "Unknown" && (
            <span className="aircraft-manufacturer">
              {aircraft.manufacturer}{" "}
            </span>
          )}
          <span className="aircraft-model">{planeName}</span>
        </p>
        {onRegistrationClick && registrationCode ? (
          <button
            type="button"
            className="aircraft-registration text-small is-clickable"
            onClick={handleRegistrationClick}
          >
            Reg: {registrationCode}
          </button>
        ) : (
          <div className="aircraft-registration text-small">
            {registrationCode}
          </div>
        )}
      </div>
    </div>
  );
}

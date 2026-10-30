import { Tooltip } from "@mantine/core";
import type { Airline } from "../../data/classes/flights/Airline";
import {
  getAirlineTailURL,
  useGetTailsManifestQuery,
  type TailAirline,
  type TailsManifest,
} from "../../data/services/tails";

import noAirlineIcon from "./noairline.svg";
import notailIcon from "./notail.svg";

type AirlineTailProps = {
  airline: Airline | undefined;
  icaoCode?: string;
  iataCode?: string;
  noTooltip?: boolean;
};

export function AirlineTail({
  airline,
  icaoCode,
  iataCode,
  noTooltip,
}: AirlineTailProps) {
  const { data: tails } = useGetTailsManifestQuery();

  const airlineName = airline?.name ?? null;

  const tailAirline = findTailAirline(tails, airlineName, icaoCode, iataCode);

  const imgSrc = tailAirline
    ? getAirlineTailURL(tailAirline, tailAirline.tails[0])
    : airline
      ? notailIcon
      : noAirlineIcon;

  return (
    <Tooltip
      label={airline?.name || "Unknown Airline"}
      openDelay={500}
      disabled={noTooltip || !airline}
    >
      <img src={imgSrc} alt={airline?.name + " tail"} className="AirlineTail" />
    </Tooltip>
  );
}

function findTailAirline(
  tails: TailsManifest | undefined,
  airlineName: string | null,
  icaoCode: string | undefined,
  iataCode: string | undefined,
): TailAirline | null {
  if (!tails || (!airlineName && !icaoCode && !iataCode)) return null;

  const matchByTerm = (term: string | null | undefined): TailAirline | null => {
    if (!term) return null;
    const normalizedTerm = term.toLowerCase();

    for (const airline of tails.airlines) {
      const allNames = [airline.name, ...airline.alternateNames].map((name) =>
        name.toLowerCase(),
      );

      if (allNames.includes(normalizedTerm)) {
        return airline;
      }
    }

    return null;
  };

  return (
    matchByTerm(airlineName) || matchByTerm(icaoCode) || matchByTerm(iataCode)
  );
}

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
  flightNumber: string | undefined;
};

export function AirlineTail({ airline, flightNumber }: AirlineTailProps) {
  const { data: tails } = useGetTailsManifestQuery();

  const airlineName = airline?.name ?? null;
  const icaoCode = flightNumber?.substring(0, 2) ?? null;

  const tailAirline = findTailAirline(tails, airlineName, icaoCode);

  const imgSrc = tailAirline
    ? getAirlineTailURL(tailAirline, tailAirline.tails[0])
    : airline
      ? notailIcon
      : noAirlineIcon;

  return (
    <Tooltip label={airline?.name || "Unknown Airline"} openDelay={500}>
      <img src={imgSrc} alt={airline?.name + " tail"} className="AirlineTail" />
    </Tooltip>
  );
}

function findTailAirline(
  tails: TailsManifest | undefined,
  airlineName: string | null,
  icaoCode: string | null,
): TailAirline | null {
  if (!tails || (!airlineName && !icaoCode)) return null;

  const matchByTerm = (term: string | null): TailAirline | null => {
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

  return matchByTerm(airlineName) || matchByTerm(icaoCode);
}

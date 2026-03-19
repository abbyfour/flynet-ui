import AerLingusTail from "./Aer Lingus_tail.svg";
import AirCanadaTail from "./Air Canada_tail.svg";
import AirChinaTail from "./Air China_tail.svg";
import AirDolomitiTail from "./Air Dolomiti_tail.svg";
import AirFranceTail from "./Air France_tail.svg";
import AirIndiaTail from "./Air India_tail.svg";
import AirNorthTail from "./Air North_tail.svg";
import AirTransatTail from "./Air Transat_tail.svg";
import airBalticTail from "./airBaltic_tail.svg";
import AmericanAirlinesTail from "./American Airlines_tail.svg";
import ANATail from "./ANA_tail.svg";
import AviancaTail from "./Avianca_tail.svg";
import BritishAirwaysTail from "./British Airways_tail.svg";
import CathayPacificTail from "./Cathay Pacific_tail.svg";
import CondorBlueTail from "./Condor blue_tail.svg";
import CondorGoldTail from "./Condor gold_tail.svg";
import CondorGreenTail from "./Condor green_tail.svg";
import CondorRedTail from "./Condor red_tail.svg";
import CondorYellowTail from "./Condor yellow_tail.svg";
import DeltaTail from "./Delta_tail.svg";
import DrukairTail from "./Drukair_tail.svg";
import EdelweissTail from "./Edelweiss_tail.svg";
import EnerjetTail from "./Enerjet_tail.svg";
import EurowingsTail from "./Eurowings_tail.svg";
import FlairTail from "./Flair_tail.svg";
import HarbourAirTail from "./Harbour Air_tail.svg";
import HawaiianAirlinesTail from "./Hawaiian Airlines_tail.svg";
import JapanAirlinesTail from "./Japan Airlines_tail.svg";
import JetstarAltTail from "./Jetstar alt_tail.svg";
import JetstarTail from "./Jetstar_tail.svg";
import KLMTail from "./KLM_tail.svg";
import LufthansaTail from "./Lufthansa Old_tail.svg";
import MartinairTail from "./Martinair_tail.svg";
import PorterTail from "./Porter_tail.svg";
import RoyalAirMarocTail from "./Royal Air Maroc_tail.svg";
import RyanairTail from "./Ryanair_tail.svg";
import ScandinavianTail from "./SAS_tail.svg";
import SouthwestTail from "./Southwest_tail.svg";
import SunwingTail from "./Sunwing_tail.svg";
import SwissAirTail from "./Swiss Air_tail.svg";
import SwoopTail from "./Swoop_tail.svg";
import TurkishAirlinesTail from "./Turkish Airlines_tail.svg";
import UnitedTail from "./United_tail.svg";
import USAirwaysTail from "./US Airways_tail.svg";
import VolarisTail from "./Volaris_tail.svg";
import WestJetTail from "./WestJet_tail.svg";
import WizzAirTail from "./Wizz Air_tail.svg";

import knownAirlineTail from "./Known Airline_tail.svg";
import unknownAirlineTail from "./Unknown Airline_tail.svg";

// Airline tail SVG mapping
export const airlineTailSvgs: Record<string, string> = {
  unknownAirline: unknownAirlineTail,
  knownAirline: knownAirlineTail,

  // airlines
  Lufthansa: LufthansaTail,
  "Air Canada": AirCanadaTail,
  "Aer Lingus": AerLingusTail,
  "Air Transat": AirTransatTail,
  Avianca: AviancaTail,
  Delta: DeltaTail,
  Flair: FlairTail,
  KLM: KLMTail,
  "United Airlines": UnitedTail,
  WestJet: WestJetTail,
  "Harbour Air": HarbourAirTail,
  Porter: PorterTail,
  // pick one at random
  Condor: shuffle(
    CondorBlueTail,
    CondorGoldTail,
    CondorRedTail,
    CondorGreenTail,
    CondorYellowTail,
  ),
  "Wizz Air": WizzAirTail,
  Ryanair: RyanairTail,
  Swoop: SwoopTail,
  "Air North": AirNorthTail,
  "Scandinavian Airlines": ScandinavianTail,
  "Hawaiian Airlines": HawaiianAirlinesTail,
  "US Airways": USAirwaysTail,
  Martinair: MartinairTail,
  "American Airlines": AmericanAirlinesTail,
  Volaris: VolarisTail,
  "Air France": AirFranceTail,
  Drukair: DrukairTail,
  "Turkish Airlines": TurkishAirlinesTail,
  "Air India": AirIndiaTail,
  "Royal Air Maroc": RoyalAirMarocTail,
  Southwest: SouthwestTail,
  Enerjet: EnerjetTail,
  Sunwing: SunwingTail,
  ANA: ANATail,
  "Air China": AirChinaTail,
  Jetstar: shuffle(JetstarTail, JetstarAltTail),
  "Japan Airlines": JapanAirlinesTail,
  Edelweiss: EdelweissTail,
  "Cathay Pacific": CathayPacificTail,
  "Swiss Air": SwissAirTail,
  airBaltic: airBalticTail,
  "Air Dolomiti": AirDolomitiTail,
  Eurowings: EurowingsTail,
  "British Airways": BritishAirwaysTail,
};

function shuffle(...items: string[]) {
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}

export function getAirlineTailSvg(airlineName: string | undefined): string {
  if (!airlineName) {
    return airlineTailSvgs.unknownAirline;
  }
  return airlineTailSvgs[airlineName] || airlineTailSvgs.knownAirline;
}

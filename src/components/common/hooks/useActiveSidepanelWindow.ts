import { SidepanelWindows } from "@data/classes/ui";
import { LocationModule, type Location } from "@location/Location";
import { useLocation } from "@location/navigator/hooks";

/** The sidepanel window shown for each location module */
const WINDOW_FOR_MODULE: Partial<Record<LocationModule, SidepanelWindows>> = {
  [LocationModule.Flights]: SidepanelWindows.Flights,
  [LocationModule.Profile]: SidepanelWindows.Profile,
  [LocationModule.Social]: SidepanelWindows.Social,
  [LocationModule.Settings]: SidepanelWindows.Settings,
};

export function locationForWindow(
  window: SidepanelWindows,
): Location | undefined {
  const entry = Object.entries(WINDOW_FOR_MODULE).find(
    ([, migrated]) => migrated === window,
  );

  return entry ? ({ module: entry[0] } as Location) : undefined;
}

/** The sidepanel window for the current location, if it has one */
export function useActiveSidepanelWindow(): SidepanelWindows | undefined {
  const { module } = useLocation();
  return WINDOW_FOR_MODULE[module];
}

import { SidepanelWindows } from "@data/classes/ui";
import { LocationModule, type Location } from "@data/location/Location";
import { useLocation } from "@data/location/navigator/hooks";
import { useAppSelector } from "@data/store";

/**
 * Windows that have moved to the navigator, keyed by the location module that
 * shows them. Add a panel here when it is migrated; delete this file once
 * every panel is.
 */
export const MIGRATED_WINDOWS: Partial<
  Record<LocationModule, SidepanelWindows>
> = {
  [LocationModule.Flights]: SidepanelWindows.Flights,
  [LocationModule.Profile]: SidepanelWindows.Profile,
  [LocationModule.Settings]: SidepanelWindows.Settings,
};

export function locationForWindow(
  window: SidepanelWindows,
): Location | undefined {
  const entry = Object.entries(MIGRATED_WINDOWS).find(
    ([, migrated]) => migrated === window,
  );

  return entry ? ({ module: entry[0] } as Location) : undefined;
}

/**
 * Temporary bridge while panels move from Redux to the navigator: migrated
 * windows are driven by the navigator's location, the rest by Redux.
 */
export function useActiveSidepanelWindow(): SidepanelWindows | undefined {
  const { module } = useLocation();
  const reduxWindow = useAppSelector((state) => state.ui.activeSidepanelWindow);

  const migrated = MIGRATED_WINDOWS[module];
  if (migrated) {
    return migrated;
  }

  // A persisted migrated window has no location, so it must not show
  const isStaleMigratedWindow = Object.values(MIGRATED_WINDOWS).includes(
    reduxWindow as SidepanelWindows,
  );
  return isStaleMigratedWindow ? undefined : reduxWindow;
}

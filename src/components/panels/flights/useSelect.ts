import { LocationModule } from "@data/location/Location";
import { useNavigator } from "@data/location/navigator/hooks";
import type { Selected } from "@data/services/SelectionHistory";
import { useCallback } from "react";

/** Opens the flights panel on a selection, keeping the current scope */
export function useSelect() {
  const navigator = useNavigator();

  return useCallback(
    (selected: Selected) =>
      navigator.push({ module: LocationModule.Flights, selected }),
    [navigator],
  );
}

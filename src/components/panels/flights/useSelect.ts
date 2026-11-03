import { LocationModule } from "@location/Location";
import { useNavigator } from "@location/navigator/hooks";
import type { Selection } from "@location/Selection";
import { useCallback } from "react";

/** Opens the flights panel on a selection, keeping the current scope */
export function useSelect() {
  const navigator = useNavigator();

  return useCallback(
    (selected: Selection) =>
      navigator.push({ module: LocationModule.Flights, selected }),
    [navigator],
  );
}

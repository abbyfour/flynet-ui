import { clearAllUIFlightData } from "@data/flightsSlice";
import { clearFlightsCache } from "@data/services/flights/flightsAPI";
import { useAppDispatch } from "@data/store";
import { clearUser } from "@data/userSlice";
import { LocationModule } from "@location/Location";
import { useNavigator } from "@location/navigator/hooks";
import { useEphemeralThinking } from "@util/thinkingUtil";

export function useLogout() {
  const dispatch = useAppDispatch();
  const navigator = useNavigator();
  const setEphemeralThinking = useEphemeralThinking(dispatch);

  return (message = "goodbye! see you in the air") => {
    setEphemeralThinking(message);

    dispatch(clearUser());
    dispatch(clearAllUIFlightData());
    clearFlightsCache();
    navigator.reset({ module: LocationModule.Home });
  };
}

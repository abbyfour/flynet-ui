import { icons } from "@assets/icons/icons";
import { clearAllUIFlightData } from "@data/flightsSlice";
import { clearFlightsCache } from "@data/services/flights/flightsAPI";
import { useAppDispatch, useAppSelector } from "@data/store";
import { clearUser } from "@data/userSlice";
import { ActionIcon, Tooltip } from "@mantine/core";
import { useEphemeralThinking } from "@util/thinkingUtil";
import { useEffect, useState } from "react";
import { Thinking } from "./Thinking";

import logo from "@assets/icons/flynet-icon.svg";
import "./StatusBar.scss";

export function StatusBar() {
  const [now, setNow] = useState(() => new Date());
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const thinking = useAppSelector((state) => state.ui.thinking);
  const dispatch = useAppDispatch();
  const setEphemeralThinking = useEphemeralThinking(dispatch);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const logout = () => {
    setEphemeralThinking("goodbye! see you in the air");

    dispatch(clearUser());
    dispatch(clearAllUIFlightData());
    clearFlightsCache();
  };

  return (
    <div className="StatusBar">
      <div className="logo">
        <div className="text">
          <img src={logo} alt="FlyNet Logo" />
          flynet
        </div>

        <Thinking thinking={thinking} />
      </div>

      {currentUser && (
        <div className="user-management">
          <p className="user-message">
            Welcome back, {currentUser.nickname || currentUser.username}!
          </p>

          <Tooltip label="Logout" withArrow color="red">
            <ActionIcon variant="transparent" color="red" onClick={logout}>
              {icons.actions.logout(20)}
            </ActionIcon>
          </Tooltip>
        </div>
      )}

      <p className="time">
        {now
          .toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            second: "2-digit",
          })
          .replaceAll(",", "")}
      </p>
    </div>
  );
}

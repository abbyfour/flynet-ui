import { ActionIcon, Tooltip } from "@mantine/core";
import { IconLogout2 } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { clearAllUIFlightData } from "../../../data/flightsSlice";
import { clearFlightsCache } from "../../../data/services/flights/flightsAPI";
import { useAppDispatch, useAppSelector } from "../../../data/store";
import { clearUser } from "../../../data/userSlice";
import { useEphemeralThinking } from "../../../util/thinkingUtil";
import "./StatusBar.scss";
import { Thinking } from "./Thinking";

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
        <p className="text">✈ FlyNet</p>

        <Thinking thinking={thinking} />
      </div>

      {currentUser && (
        <div className="user-management">
          <p className="user-message">
            Welcome back, {currentUser.nickname || currentUser.username}!
          </p>

          <Tooltip label="Logout" withArrow color="red">
            <ActionIcon variant="transparent" color="red" onClick={logout}>
              <IconLogout2 size={20} />
            </ActionIcon>
          </Tooltip>
        </div>
      )}

      <p className="time">
        {now
          .toLocaleString("en-GB", {
            weekday: "short",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
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

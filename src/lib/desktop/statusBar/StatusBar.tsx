import { ActionIcon, Tooltip } from "@mantine/core";
import { IconLogout2 } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { clearFlightsCache } from "../../../data/services/flights/flightsAPI";
import { useAppDispatch, useAppSelector } from "../../../data/store";
import { clearAllUIFlightData } from "../../../data/uiSlice";
import { clearUser } from "../../../data/userSlice";
import "./StatusBar.scss";

export function StatusBar() {
  const [now, setNow] = useState(() => new Date());
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const logout = () => {
    dispatch(clearUser());
    dispatch(clearAllUIFlightData());
    clearFlightsCache();
  };

  return (
    <div className="StatusBar text-small">
      <p className="logo">✈ FlyNetOS</p>

      {currentUser && (
        <div className="user-management">
          <p className="user-message">
            Welcome back, {currentUser.nickname || currentUser.username}!
          </p>

          <Tooltip label="Logout" withArrow>
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

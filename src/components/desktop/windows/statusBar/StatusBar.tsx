import { icons } from "@assets/icons/icons";
import { useLogout } from "@components/common/hooks/useLogout";
import { useAppSelector } from "@data/store";
import { ActionIcon, Tooltip } from "@mantine/core";
import { useEffect, useState } from "react";
import { Thinking } from "./Thinking";

import logo from "@assets/icons/flynet-icon.svg";
import { getUserAvatarUrl } from "@data/classes/user";
import "./StatusBar.scss";

export function StatusBar() {
  const [now, setNow] = useState(() => new Date());
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const thinking = useAppSelector((state) => state.ui.thinking);
  const logout = useLogout();

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

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
          <span className="user-name">
            {currentUser.nickname || currentUser.username}
          </span>

          <img
            className="user-image"
            src={getUserAvatarUrl(currentUser)}
            alt="User Avatar"
          />

          <Tooltip label="Logout" withArrow color="red">
            <ActionIcon variant="transparent" color="red" onClick={() => logout()}>
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

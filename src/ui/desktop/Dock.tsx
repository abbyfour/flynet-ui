import "./Dock.scss";

import { SidepanelWindows } from "@data/classes/ui";
import { useAppDispatch, useAppSelector } from "@data/store";
import {
  closeActiveSidepanelWindow,
  selectThemeFallbackToSystem,
  setActiveSidepanelWindow,
} from "@data/uiSlice";

// icons
import flightsIconDarkBw from "@assets/dock/flights-bw-dark.svg";
import flightsIconBw from "@assets/dock/flights-bw.svg";
import flightsIconDark from "@assets/dock/flights-dark.svg";
import flightsIcon from "@assets/dock/flights.svg";
import friendsIconDarkBw from "@assets/dock/friends-bw-dark.svg";
import friendsIconBw from "@assets/dock/friends-bw.svg";
import friendsIconDark from "@assets/dock/friends-dark.svg";
import friendsIcon from "@assets/dock/friends.svg";
import profileIconDarkBw from "@assets/dock/profile-bw-dark.svg";
import profileIconBw from "@assets/dock/profile-bw.svg";
import profileIconDark from "@assets/dock/profile-dark.svg";
import profileIcon from "@assets/dock/profile.svg";
import settingsIconDarkBw from "@assets/dock/settings-bw-dark.svg";
import settingsIconBw from "@assets/dock/settings-bw.svg";
import settingsIconDark from "@assets/dock/settings-dark.svg";
import settingsIcon from "@assets/dock/settings.svg";

interface Window {
  name: SidepanelWindows;
  icon: string;
  iconBw: string;
  iconDark: string;
  iconDarkBw: string;
}

const windows = {
  flights: {
    name: SidepanelWindows.Flights,
    icon: flightsIcon,
    iconBw: flightsIconBw,
    iconDark: flightsIconDark,
    iconDarkBw: flightsIconDarkBw,
  },
  friends: {
    name: SidepanelWindows.Friends,
    icon: friendsIcon,
    iconBw: friendsIconBw,
    iconDark: friendsIconDark,
    iconDarkBw: friendsIconDarkBw,
  },
  profile: {
    name: SidepanelWindows.Profile,
    icon: profileIcon,
    iconBw: profileIconBw,
    iconDark: profileIconDark,
    iconDarkBw: profileIconDarkBw,
  },
  settings: {
    name: SidepanelWindows.Settings,
    icon: settingsIcon,
    iconBw: settingsIconBw,
    iconDark: settingsIconDark,
    iconDarkBw: settingsIconDarkBw,
  },
} satisfies Record<string, Window>;

export function Dock() {
  const activeWindow = useAppSelector(
    (state) => state.ui.activeSidepanelWindow,
  );
  const theme = useAppSelector(selectThemeFallbackToSystem);

  const dispatch = useAppDispatch();

  const changeWindow = (window: Window) => {
    return activeWindow === window.name
      ? dispatch(closeActiveSidepanelWindow())
      : dispatch(setActiveSidepanelWindow(window.name));
  };

  return (
    <div className="Dock">
      {Object.values(windows).map((window) => (
        <button
          key={window.name}
          className={
            "dock-icon-button" + (activeWindow === window.name ? " active" : "")
          }
          onClick={() => changeWindow(window)}
        >
          <img
            src={getIcon(window, activeWindow, theme)}
            alt={`${window.name} icon`}
            className="dock-icon-image"
            width="65px"
          />
        </button>
      ))}
    </div>
  );
}

function getIcon(
  window: Window,
  activeWindow: SidepanelWindows | undefined,
  theme: "light" | "dark",
) {
  if (activeWindow === window.name) {
    return theme === "dark" ? window.iconDark : window.icon;
  } else {
    return theme === "dark" ? window.iconDarkBw : window.iconBw;
  }
}

import "./Dock.scss";

import {
  locationForWindow,
  useActiveSidepanelWindow,
} from "@components/common/hooks/useActiveSidepanelWindow";
import { SidepanelWindows } from "@data/classes/ui";
import { useAppSelector } from "@data/store";
import { selectThemeFallbackToSystem } from "@data/uiSlice";
import { LocationModule } from "@location/Location";
import { useNavigator } from "@location/navigator/hooks";
import { Tooltip } from "@mantine/core";

// icons
import flightsIconDarkBw from "@assets/dock/flights-bw-dark.svg";
import flightsIconBw from "@assets/dock/flights-bw.svg";
import flightsIconDark from "@assets/dock/flights-dark.svg";
import flightsIcon from "@assets/dock/flights.svg";
import socialIconDarkBw from "@assets/dock/friends-bw-dark.svg";
import socialIconBw from "@assets/dock/friends-bw.svg";
import socialIconDark from "@assets/dock/friends-dark.svg";
import socialIcon from "@assets/dock/friends.svg";
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
  disabled?: boolean;
}

const windows = {
  flights: {
    name: SidepanelWindows.Flights,
    icon: flightsIcon,
    iconBw: flightsIconBw,
    iconDark: flightsIconDark,
    iconDarkBw: flightsIconDarkBw,
  },
  social: {
    name: SidepanelWindows.Social,
    icon: socialIcon,
    iconBw: socialIconBw,
    iconDark: socialIconDark,
    iconDarkBw: socialIconDarkBw,
    disabled: true,
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
  const activeWindow = useActiveSidepanelWindow();
  const theme = useAppSelector(selectThemeFallbackToSystem);
  const navigator = useNavigator();

  const changeWindow = (window: Window) => {
    if (window.disabled) {
      return;
    }

    // Switching windows keeps whoever is being viewed
    const { scope } = navigator.current;
    const location =
      activeWindow === window.name ? undefined : locationForWindow(window.name);

    navigator.reset(location ?? { module: LocationModule.Home }, scope);
  };

  return (
    <div className="Dock">
      {Object.values(windows).map((window) => (
        <Tooltip
          key={window.name}
          label={window.name.charAt(0).toUpperCase() + window.name.slice(1)}
          openDelay={600}
          withArrow
          position="top"
        >
          <span className="dock-icon-wrapper">
            <button
              className={
                "dock-icon-button" +
                (activeWindow === window.name ? " active" : "") +
                ("disabled" in window && window.disabled ? " disabled" : "")
              }
              disabled={"disabled" in window && window.disabled}
              onClick={() => changeWindow(window)}
            >
              <img
                src={getIcon(window, activeWindow, theme)}
                alt={`${window.name} icon`}
                className="dock-icon-image"
              />
            </button>
          </span>
        </Tooltip>
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

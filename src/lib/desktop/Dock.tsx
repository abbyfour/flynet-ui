import { SidepanelWindows } from "../../redux/uiSlice";
import "./Dock.scss";

// icons
import flightsIcon from "../../assets/dock/flights.svg";
import friendsIcon from "../../assets/dock/friends.svg";
import profileIcon from "../../assets/dock/profile.svg";
import settingsIcon from "../../assets/dock/settings.svg";
import { useAppDispatch, useAppSelector } from "../../redux/store";

interface Window {
  name: SidepanelWindows;
  icon: string;
}

const windows = {
  flights: { name: SidepanelWindows.Flights, icon: flightsIcon },
  friends: { name: SidepanelWindows.Friends, icon: friendsIcon },
  profile: { name: SidepanelWindows.Profile, icon: profileIcon },
  settings: { name: SidepanelWindows.Settings, icon: settingsIcon },
} satisfies Record<string, Window>;

export function Dock() {
  const activeWindow = useAppSelector(
    (state) => state.ui.activeSidepanelWindow,
  );
  const dispatch = useAppDispatch();

  const changeWindow = (window: Window) => {
    dispatch(
      activeWindow === window.name
        ? {
            type: "ui/closeActiveSidepanelWindow",
          }
        : {
            type: "ui/setActiveSidepanelWindow",
            payload: window.name,
          },
    );
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
            src={window.icon}
            alt={`${window.name} icon`}
            className="dock-icon-image"
            height="70px"
            width="70px"
          />
        </button>
      ))}
    </div>
  );
}

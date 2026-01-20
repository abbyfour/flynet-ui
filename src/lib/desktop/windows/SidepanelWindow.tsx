import { useAppDispatch, useAppSelector } from "../../../redux/store";
import {
  closeActiveSidepanelWindow,
  SidepanelWindows,
} from "../../../redux/uiSlice";
import { Flights } from "./sidepanel/Flights";
import { Friends } from "./sidepanel/Friends";
import { Profile } from "./sidepanel/Profile";
import { Settings } from "./sidepanel/Settings";

import "./SidepanelWindow.scss";

export function SidepanelWindow() {
  const activeWindow = useAppSelector(
    (state) => state.ui.activeSidepanelWindow,
  );
  const dispatch = useAppDispatch();

  return activeWindow ? (
    <div className="SidepanelWindow">
      <button onClick={() => dispatch(closeActiveSidepanelWindow())}>
        close
      </button>
      {getSidepanelWindow(activeWindow) || <></>}
    </div>
  ) : null;
}

function getSidepanelWindow(window: SidepanelWindows | undefined) {
  switch (window) {
    case SidepanelWindows.Flights:
      return <Flights />;
    case SidepanelWindows.Friends:
      return <Friends />;
    case SidepanelWindows.Profile:
      return <Profile />;
    case SidepanelWindows.Settings:
      return <Settings />;
    default:
      return undefined;
  }
}

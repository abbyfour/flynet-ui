import { ActionIcon } from "@mantine/core";
import { icons } from "../../../assets/icons/icons";
import { SidepanelWindows } from "../../../data/classes/ui";
import {
  clearSidepanelOptions,
  selectSidepanelOptions,
} from "../../../data/sidepanelSlice";
import { useAppDispatch, useAppSelector } from "../../../data/store";
import { closeActiveSidepanelWindow } from "../../../data/uiSlice";
import { SidepanelContainer } from "../SidepanelContainer";
import { FlightsPanel } from "./sidepanel/flights/FlightsPanel";
import { Social } from "./sidepanel/Friends";
import { Profile } from "./sidepanel/Profile";
import { Settings } from "./sidepanel/Settings";
import "./SidepanelWindow.scss";

export function SidepanelWindow() {
  const activeWindow = useAppSelector(
    (state) => state.ui.activeSidepanelWindow,
  );
  const sidepanelOptions = useAppSelector(selectSidepanelOptions);

  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(clearSidepanelOptions());
    dispatch(closeActiveSidepanelWindow());
  };

  const handleGoback = () => {
    if (sidepanelOptions.onGoBack) {
      sidepanelOptions.onGoBack();
    }
  };

  const handleGoHome = () => {
    if (sidepanelOptions.onGoHome) {
      sidepanelOptions.onGoHome();
    }
  };

  return activeWindow ? (
    <SidepanelContainer
      align="left"
      className={`SidepanelWindow ${activeWindow === SidepanelWindows.Profile ? "no-padding" : ""}`}
    >
      <div className="window-header">
        <div className="window-controls">
          <ActionIcon variant="transparent" color="dark" onClick={handleClose}>
            {icons.actions.window.close(18)}
          </ActionIcon>
          {sidepanelOptions.onGoBack && (
            <ActionIcon
              variant="transparent"
              color="dark"
              onClick={handleGoback}
            >
              {icons.actions.window.back(18)}
            </ActionIcon>
          )}
          {sidepanelOptions.onGoHome && (
            <ActionIcon
              variant="transparent"
              color="dark"
              onClick={handleGoHome}
            >
              {icons.actions.window.home(16)}
            </ActionIcon>
          )}
        </div>
        <span className="window-title">
          {sidepanelOptions.title || "FlyNet"}
        </span>
      </div>

      <div className="panel-content sidepanel-scroll-area">
        {getSidepanelWindow(activeWindow) || <></>}
      </div>
    </SidepanelContainer>
  ) : null;
}

function getSidepanelWindow(window: SidepanelWindows | undefined) {
  switch (window) {
    case SidepanelWindows.Flights:
      return <FlightsPanel />;
    case SidepanelWindows.Friends:
      return <Social />;
    case SidepanelWindows.Profile:
      return <Profile />;
    case SidepanelWindows.Settings:
      return <Settings />;
    default:
      return undefined;
  }
}

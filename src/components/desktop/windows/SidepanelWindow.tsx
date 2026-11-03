import { icons } from "@assets/icons/icons";
import { useActiveSidepanelWindow } from "@components/common/hooks/useActiveSidepanelWindow";
import { FlightsPanel } from "@components/panels/flights/FlightsPanel";
import { Profile } from "@components/panels/profile/Profile";
import { Settings } from "@components/panels/Settings";
import { Social } from "@components/panels/Social";
import { SidepanelWindows } from "@data/classes/ui";
import {
  clearSidepanelOptions,
  requestSidepanelBack,
  requestSidepanelHome,
  selectSidepanelOptions,
} from "@data/sidepanelSlice";
import { useAppDispatch, useAppSelector } from "@data/store";
import { LocationModule } from "@location/Location";
import { useNavigator } from "@location/navigator/hooks";
import { ActionIcon } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { SidepanelContainer } from "../SidepanelContainer";
import "./SidepanelWindow.scss";

export function SidepanelWindow() {
  const activeWindow = useActiveSidepanelWindow();
  const navigator = useNavigator();
  const sidepanelOptions = useAppSelector(selectSidepanelOptions);

  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const iconSize = isMobile ? 20 : 18;
  const homeIconSize = isMobile ? 18 : 16;

  const handleClose = () => {
    dispatch(clearSidepanelOptions());
    navigator.reset({ module: LocationModule.Home }, navigator.current.scope);
  };

  const handleGoback = () => {
    dispatch(requestSidepanelBack());
  };

  const handleGoHome = () => {
    dispatch(requestSidepanelHome());
  };

  return activeWindow ? (
    <SidepanelContainer
      align="left"
      className={`SidepanelWindow ${activeWindow === SidepanelWindows.Profile ? "no-padding" : ""}`}
    >
      <div className="window-header">
        <div className="window-controls">
          <ActionIcon
            className="window-control-button"
            variant="transparent"
            color="dark"
            onClick={handleClose}
          >
            {icons.actions.window.close(iconSize)}
          </ActionIcon>
          {sidepanelOptions.showGoBack && (
            <ActionIcon
              className="window-control-button"
              variant="transparent"
              color="dark"
              onClick={handleGoback}
            >
              {icons.actions.window.back(iconSize)}
            </ActionIcon>
          )}
          {sidepanelOptions.showGoHome && (
            <ActionIcon
              className="window-control-button"
              variant="transparent"
              color="dark"
              onClick={handleGoHome}
            >
              {icons.actions.window.home(homeIconSize)}
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
    case SidepanelWindows.Social:
      return <Social />;
    case SidepanelWindows.Profile:
      return <Profile />;
    case SidepanelWindows.Settings:
      return <Settings />;
    default:
      return undefined;
  }
}

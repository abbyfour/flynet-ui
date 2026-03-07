import { ActionIcon } from "@mantine/core";
import { IconChevronLeft, IconX } from "@tabler/icons-react";
import { SidepanelWindows } from "../../../data/classes/ui";
import {
  clearSidepanelOptions,
  selectSidepanelOptions,
} from "../../../data/sidepanelSlice";
import { useAppDispatch, useAppSelector } from "../../../data/store";
import { closeActiveSidepanelWindow } from "../../../data/uiSlice";
import { SidepanelContainer } from "../SidepanelContainer";
import { Flights } from "./sidepanel/flights/Flights";
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

  return activeWindow ? (
    <SidepanelContainer align="left" className="SidepanelWindow">
      <div className="window-header">
        <div className="window-controls">
          <ActionIcon variant="transparent" color="dark" onClick={handleClose}>
            <IconX size={20} />
          </ActionIcon>
          {sidepanelOptions.onGoBack && (
            <ActionIcon
              variant="transparent"
              color="dark"
              onClick={handleGoback}
            >
              <IconChevronLeft size={20} />
            </ActionIcon>
          )}
        </div>
        <span className="window-title">
          {sidepanelOptions.title || "FlyNet"}
        </span>
      </div>

      <div className="content sidepanel-scroll-area">
        {getSidepanelWindow(activeWindow) || <></>}
      </div>
    </SidepanelContainer>
  ) : null;
}

function getSidepanelWindow(window: SidepanelWindows | undefined) {
  switch (window) {
    case SidepanelWindows.Flights:
      return <Flights />;
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

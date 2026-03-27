import { useAppDispatch, useAppSelector } from "../../../data/store";

import darkToggleIcon from "../../../assets/icons/dark-toggle.svg";
import lightToggleIcon from "../../../assets/icons/light-toggle.svg";

import { Tooltip } from "@mantine/core";
import { AppTheme } from "../../../data/classes/ui";
import { setTheme } from "../../../data/uiSlice";
import "./ThemeToggle.scss";

export function ThemeToggle() {
  const theme = useAppSelector((state) => state.ui.theme);
  const dispatch = useAppDispatch();

  const toggleTheme = () => {
    dispatch(
      setTheme(theme === AppTheme.Dark ? AppTheme.Light : AppTheme.Dark),
    );
  };

  return (
    <div className="ThemeToggle">
      <Tooltip
        label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        openDelay={500}
        position="right"
      >
        <button type="button" onClick={toggleTheme}>
          <img
            src={theme === "dark" ? lightToggleIcon : darkToggleIcon}
            alt="Toggle theme"
          />
        </button>
      </Tooltip>
    </div>
  );
}

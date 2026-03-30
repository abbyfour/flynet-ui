import { Tooltip } from "@mantine/core";

import { AppTheme } from "@data/classes/ui";
import { useAppDispatch, useAppSelector } from "@data/store";
import { selectThemeFallbackToSystem, setTheme } from "@data/uiSlice";

import darkToggleIcon from "@assets/icons/dark-toggle.svg";
import lightToggleIcon from "@assets/icons/light-toggle.svg";
import "./ThemeToggle.scss";

export function ThemeToggle() {
  const theme = useAppSelector(selectThemeFallbackToSystem);
  const dispatch = useAppDispatch();

  const toggleTheme = () => {
    dispatch(
      setTheme(theme === AppTheme.Dark ? AppTheme.Light : AppTheme.Dark),
    );
  };

  return (
    <div className="ThemeToggle">
      <Tooltip
        label={`Switch to ${theme === AppTheme.Dark ? "light" : "dark"} mode`}
        openDelay={500}
        position="right"
      >
        <button type="button" onClick={toggleTheme}>
          <img
            src={theme === AppTheme.Dark ? lightToggleIcon : darkToggleIcon}
            alt="Toggle theme"
          />
        </button>
      </Tooltip>
    </div>
  );
}

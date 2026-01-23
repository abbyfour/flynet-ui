import { AppTheme } from "../../../data/classes/ui";
import { useAppDispatch, useAppSelector } from "../../../data/store";
import { setTheme } from "../../../data/uiSlice";
import "./ThemeToggle.scss";

export function ThemeToggle() {
  const theme = useAppSelector((state) => state.ui.theme);
  const dispatch = useAppDispatch();

  return (
    <div className="ThemeToggle">
      <input
        type="checkbox"
        id="theme-toggle"
        checked={theme === "dark"}
        onChange={(e) =>
          dispatch(setTheme(e.target.checked ? AppTheme.Dark : AppTheme.Light))
        }
      />
      <label htmlFor="theme-toggle" className="toggle-label">
        dark mode
      </label>
    </div>
  );
}

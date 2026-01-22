import Toggle from "react-toggle";
import { AppTheme } from "../../../data/classes/ui";
import { useAppDispatch, useAppSelector } from "../../../data/store";
import { setTheme } from "../../../data/uiSlice";
import "./ThemeToggle.scss";

export function ThemeToggle() {
  const theme = useAppSelector((state) => state.ui.theme);
  const dispatch = useAppDispatch();

  return (
    <div className="ThemeToggle">
      <Toggle
        id="theme-toggle"
        icons={false}
        checked={theme === "dark"}
        onChange={(e) =>
          dispatch(setTheme(e.target.checked ? AppTheme.Dark : AppTheme.Light))
        }
      />
    </div>
  );
}

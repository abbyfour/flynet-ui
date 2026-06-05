import { SubmitButton } from "@components/common/buttons/SubmitButton";
import { Toasts } from "@components/common/notices/Toast";
import { dispatchNotice } from "@components/common/notices/dispatchNotice";
import { AppTheme } from "@data/classes/ui";
import type { UserSettings } from "@data/classes/user";
import { useUpdateUserSettingsMutation } from "@data/services/usersAPI";
import { setSidepanelOptions } from "@data/sidepanelSlice";
import { useAppDispatch, useAppSelector } from "@data/store";
import { setTheme } from "@data/uiSlice";
import { saveUser } from "@data/userSlice";
import { useEffect, useState } from "react";
import "./Settings.scss";

export function Settings() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const [updateUserSettings, { isLoading }] = useUpdateUserSettingsMutation();
  const [uiMode, setUiMode] = useState<UserSettings["uiMode"] | undefined>(
    undefined,
  );

  useEffect(() => {
    dispatch(
      setSidepanelOptions({
        title: "Settings",
        showGoBack: false,
        showGoHome: false,
      }),
    );
  }, [dispatch]);

  if (!currentUser) {
    return <p>Please sign in to edit settings.</p>;
  }

  const selectedUiMode = uiMode ?? currentUser.userSettings.uiMode;
  const hasChanges = selectedUiMode !== currentUser.userSettings.uiMode;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const updatedSettings = await updateUserSettings({
        id: currentUser.userSettings.id,
        uiMode: selectedUiMode,
      }).unwrap();

      dispatch(
        saveUser({
          ...currentUser,
          userSettings: updatedSettings,
        }),
      );

      dispatch(
        setTheme(
          updatedSettings.uiMode === "system"
            ? undefined
            : updatedSettings.uiMode,
        ),
      );

      dispatchNotice(Toasts.success("Settings saved."));
    } catch {
      dispatchNotice(
        Toasts.error({
          title: "Couldn't save settings",
          message: "Please try again.",
        }),
      );
    }
  };

  return (
    <div className="Settings">
      <form onSubmit={handleSubmit}>
        <div className="settings-fields">
          <fieldset className="ui-mode-fieldset">
            <legend>Display mode</legend>

            <label>
              <input
                type="radio"
                name="uiMode"
                value="system"
                checked={selectedUiMode === "system"}
                disabled={isLoading}
                onChange={() => setUiMode("system")}
              />
              System
            </label>

            <label>
              <input
                type="radio"
                name="uiMode"
                value={AppTheme.Light}
                checked={selectedUiMode === AppTheme.Light}
                disabled={isLoading}
                onChange={() => setUiMode(AppTheme.Light)}
              />
              Light
            </label>

            <label>
              <input
                type="radio"
                name="uiMode"
                value={AppTheme.Dark}
                checked={selectedUiMode === AppTheme.Dark}
                disabled={isLoading}
                onChange={() => setUiMode(AppTheme.Dark)}
              />
              Dark
            </label>
          </fieldset>
        </div>

        <SubmitButton loading={isLoading} disabled={!hasChanges}>
          Save settings
        </SubmitButton>
      </form>
    </div>
  );
}

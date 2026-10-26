import { icons } from "@assets/icons/icons";
import { clearSelection } from "@data/flightsSlice";
import { useAppDispatch, useAppSelector } from "@data/store";
import { setViewedProfileUsername } from "@data/uiSlice";
import "./ProfileFlightsNotice.scss";

export function ProfileFlightsNotice() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const viewedProfileUsername = useAppSelector(
    (state) => state.ui.viewedProfileUsername,
  );

  const isViewingOtherProfile =
    Boolean(viewedProfileUsername) &&
    currentUser?.username !== viewedProfileUsername;

  if (!isViewingOtherProfile || !viewedProfileUsername) {
    return null;
  }

  const clearViewedUser = () => {
    dispatch(setViewedProfileUsername(undefined));
    dispatch(clearSelection());
  };

  return (
    <div className="ProfileFlightsNotice" role="status" aria-live="polite">
      <span className="message">
        showing <span className="username">{viewedProfileUsername}</span>'s
        flights
      </span>
      <button
        className="clear-viewing-user"
        type="button"
        onClick={clearViewedUser}
        aria-label="Stop viewing this user's flights"
      >
        {icons.actions.window.close(12)}
      </button>
    </div>
  );
}

import { icons } from "@assets/icons/icons";
import { useAppSelector } from "@data/store";
import { LocationModule, SELF_SCOPE, scopeUsername } from "@location/Location";
import { useNavigator, useScope } from "@location/navigator/hooks";
import "./ProfileFlightsNotice.scss";

export function ProfileFlightsNotice() {
  const navigator = useNavigator();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const viewedProfileUsername = scopeUsername(useScope());

  const isViewingOtherProfile =
    Boolean(viewedProfileUsername) &&
    currentUser?.username !== viewedProfileUsername;

  if (!isViewingOtherProfile || !viewedProfileUsername) {
    return null;
  }

  const clearViewedUser = () => {
    navigator.enterScope(SELF_SCOPE, { module: LocationModule.Flights });
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

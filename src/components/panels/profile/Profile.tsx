import { icons } from "@assets/icons/icons";
import banner from "@assets/profile-banner.svg";
import { Button } from "@components/common/buttons/Button";
import {
  useSidepanelHeader,
  useSidepanelRequests,
} from "@components/common/hooks/sidepanel";
import { Toasts } from "@components/common/notices/Toast";
import { dispatchNotice } from "@components/common/notices/dispatchNotice";
import { AirlineDisplay } from "@components/displays/AirlineDisplay";
import { AirportDisplay } from "@components/displays/AirportDisplay";
import { PlaneDisplay } from "@components/displays/PlaneDisplay";
import { EditProfileForm } from "@components/forms/EditProfileForm";
import { openCropAvatarModal } from "@components/forms/profile/openCropAvatarModal";
import type { Airline } from "@data/classes/flights/Airline";
import type { Airport } from "@data/classes/flights/Airport";
import { Flight } from "@data/classes/flights/Flight";
import type { Plane } from "@data/classes/flights/Plane";
import {
  getUserAvatarUrl,
  type ExtendedUserProperties,
} from "@data/classes/user";
import { clearSelection } from "@data/flightsSlice";
import {
  useGetFlightsQuery,
  useGetUserFlightsQuery,
} from "@data/services/flights/flightsAPI";
import {
  selectFlightsAsObjects,
  sortFlights,
} from "@data/services/flights/selectFlights";
import {
  useGetUserByUsernameQuery,
  useUpdateUserAvatarMutation,
} from "@data/services/usersAPI";
import { useAppDispatch, useAppSelector } from "@data/store";
import { setProfileEditing, setProfileUsername } from "@data/uiSlice";
import { joinClasses } from "@util/componentUtil";
import { useEffect, useMemo, useRef, useState } from "react";
import "./Profile.scss";

const ALLOWED_AVATAR_MIME_TYPES = new Set(["image/png", "image/jpeg"]);
const ALLOWED_AVATAR_EXTENSIONS = [".png", ".jpg", ".jpeg"];

export function Profile() {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const profileUsername = useAppSelector((state) => state.ui.profileUsername);
  const editing = useAppSelector((state) => state.ui.profileEditing);
  const dispatch = useAppDispatch();

  const profileHistoryRef = useRef<string[]>([]);
  const [profileHistoryDepth, setProfileHistoryDepth] = useState(0);

  const targetUsername = profileUsername ?? currentUser?.username;
  const isViewingOwnProfile =
    Boolean(currentUser?.username) && currentUser?.username === targetUsername;
  const canEditProfile = Boolean(isViewingOwnProfile);
  const isEditingOwnProfile = editing && canEditProfile;

  const { data: fetchedProfile, isFetching: profileLoading } =
    useGetUserByUsernameQuery(targetUsername ?? "", {
      skip: !targetUsername || isViewingOwnProfile,
    });

  const ownFlights = useAppSelector(selectFlightsAsObjects);
  useGetFlightsQuery(undefined, { skip: !currentUser });
  const { data: fetchedProfileFlights } = useGetUserFlightsQuery(
    targetUsername ?? "",
    { skip: !targetUsername || isViewingOwnProfile },
  );

  const viewedFlights = useMemo(
    () =>
      isViewingOwnProfile
        ? ownFlights
        : (fetchedProfileFlights?.items ?? [])
            .map((flight) => new Flight(flight))
            .sort(sortFlights),
    [fetchedProfileFlights?.items, isViewingOwnProfile, ownFlights],
  );

  const viewedUser = isViewingOwnProfile ? currentUser : fetchedProfile;

  useEffect(() => {
    if (!targetUsername) {
      return;
    }

    const stack = profileHistoryRef.current;

    if (stack.length === 0) {
      if (currentUser?.username && currentUser.username !== targetUsername) {
        stack.push(currentUser.username);
      }
      stack.push(targetUsername);
      setProfileHistoryDepth(stack.length);
      return;
    }

    if (stack[stack.length - 1] === targetUsername) {
      return;
    }

    const existingIndex = stack.lastIndexOf(targetUsername);
    if (existingIndex >= 0) {
      stack.splice(existingIndex + 1);
      setProfileHistoryDepth(stack.length);
      return;
    }

    stack.push(targetUsername);
    setProfileHistoryDepth(stack.length);
  }, [currentUser?.username, targetUsername]);

  // Reset selection when navigating to a different profile.
  useEffect(() => {
    dispatch(clearSelection());
  }, [targetUsername, dispatch]);

  const openEditProfile = () => {
    if (!isViewingOwnProfile) return;
    dispatch(setProfileEditing(true));
  };

  const clearEditing = () => {
    dispatch(setProfileEditing(false));
  };

  useEffect(() => {
    if (editing && !canEditProfile) {
      dispatch(setProfileEditing(false));
    }
  }, [canEditProfile, dispatch, editing]);

  const canGoBackProfiles = !isEditingOwnProfile && profileHistoryDepth > 1;

  useSidepanelHeader({
    title: isEditingOwnProfile ? "Edit profile" : "Profile",
    showGoBack: isEditingOwnProfile || canGoBackProfiles,
    showGoHome: false,
  });

  useSidepanelRequests({
    onBackRequest:
      isEditingOwnProfile || canGoBackProfiles
        ? () => {
            if (isEditingOwnProfile) {
              dispatch(setProfileEditing(false));
            } else if (canGoBackProfiles) {
              profileHistoryRef.current.pop();
              setProfileHistoryDepth(profileHistoryRef.current.length);
              const previousUsername =
                profileHistoryRef.current[profileHistoryRef.current.length - 1];

              if (!previousUsername) {
                return;
              }

              dispatch(clearSelection());

              dispatch(
                setProfileUsername(
                  previousUsername === currentUser?.username
                    ? undefined
                    : previousUsername,
                ),
              );
            }
          }
        : undefined,
  });

  if (!targetUsername) {
    return <div>Please sign in!</div>;
  }

  if (profileLoading) {
    return (
      <div className="Profile">
        <div className="main-content">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!viewedUser) {
    return (
      <div className="Profile">
        <div className="main-content">
          <p>Could not find @{targetUsername}.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="Profile">
      <div className="main-content">
        {isEditingOwnProfile ? (
          <EditProfileForm clearEditing={clearEditing} />
        ) : (
          <ProfileContent
            openEditProfile={openEditProfile}
            viewedUser={viewedUser}
            viewedFlights={viewedFlights}
            canEdit={canEditProfile}
          />
        )}
      </div>
    </div>
  );
}

function ProfileContent({
  openEditProfile,
  viewedUser,
  viewedFlights,
  canEdit,
}: {
  openEditProfile: () => void;
  viewedUser: ExtendedUserProperties;
  viewedFlights: Flight[];
  canEdit: boolean;
}) {
  const [currentAvatar, setCurrentAvatar] = useState<string | undefined>(
    undefined,
  );

  const [updateUserAvatar] = useUpdateUserAvatarMutation();

  const handlePFPUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    const normalizedName = file.name.toLowerCase();
    const hasAllowedMimeType = ALLOWED_AVATAR_MIME_TYPES.has(file.type);
    const hasAllowedExtension = ALLOWED_AVATAR_EXTENSIONS.some((extension) =>
      normalizedName.endsWith(extension),
    );

    if (!hasAllowedMimeType && !hasAllowedExtension) {
      dispatchNotice(
        Toasts.warning({
          title: "Unsupported image type",
          message: "Please upload a PNG, JPG, or JPEG image.",
        }),
      );
      return;
    }

    const croppedAvatar = await openCropAvatarModal({ file });

    if (!canEdit) {
      return;
    }

    if (croppedAvatar) {
      await updateUserAvatar({
        avatarDataUrl: croppedAvatar,
      }).unwrap();
      setCurrentAvatar(croppedAvatar);
    }
  };

  const homeAirport = mostVisitedAirport(viewedFlights);
  const favouriteAirline = mostFlownAirline(viewedFlights);
  const favouritePlane = mostFlownPlane(viewedFlights);

  return (
    <>
      <div className="banner">
        <img src={banner} alt="Profile Banner" width="100%" />

        {canEdit && (
          <Button
            className="edit-button"
            variant="filled"
            icon={icons.actions.edit(16)}
            onClick={openEditProfile}
          >
            Edit profile
          </Button>
        )}
      </div>

      <div className="profile-info">
        <label className={joinClasses("avatar-input", canEdit && "editable")}>
          <img
            src={currentAvatar || getUserAvatarUrl(viewedUser)}
            alt=""
            className="avatar"
          />
          {canEdit && <span className="avatar-hover-label">Edit</span>}
          {canEdit && (
            <input
              type="file"
              accept="image/png,image/jpeg,.jpg,.jpeg"
              hidden
              onChange={handlePFPUpload}
            />
          )}
        </label>

        <div className="names">
          <h3 className="nickname">
            {viewedUser.nickname || viewedUser.username}
          </h3>
          <h5 className="username">@{viewedUser.username}</h5>
        </div>
      </div>

      <div className="expanded-profile">
        <p className="bio">
          {viewedUser.bio || (
            <span className="default-bio">
              This user hasn't written a bio yet... they prefer to remain
              mysterious...
            </span>
          )}
        </p>

        <div className="separator">
          <hr />
        </div>

        {homeAirport && (
          <div className="home-airport">
            <h5 className="tiny-header">Home airport</h5>
            <AirportDisplay noHover airport={homeAirport} />
          </div>
        )}

        {favouriteAirline && (
          <div className="favourite-airline">
            <h5 className="tiny-header">Favourite airline</h5>
            <AirlineDisplay noHover airline={favouriteAirline} />
          </div>
        )}

        {favouritePlane && (
          <div className="favourite-plane">
            <h5 className="tiny-header">Favourite plane</h5>
            <PlaneDisplay noHover plane={favouritePlane} onClick={() => {}} />
          </div>
        )}
      </div>

      <div className="footer">
        <div className="barcode">flynet.ca/@{viewedUser.username}</div>
      </div>
    </>
  );
}

function mostVisitedAirport(flights: Flight[]): Airport | undefined {
  const counts = new Map<number, { airport: Airport; count: number }>();

  for (const flight of flights) {
    for (const airport of [flight.origin, flight.destination]) {
      const entry = counts.get(airport.id);
      if (entry) {
        entry.count++;
      } else {
        counts.set(airport.id, { airport, count: 1 });
      }
    }
  }

  if (counts.size === 0) return undefined;

  return [...counts.values()].reduce((a, b) => (b.count > a.count ? b : a))
    .airport;
}

function mostFlownAirline(flights: Flight[]): Airline | null {
  if (flights.length === 0) return null;

  const counts = new Map<string, { airline: Airline; count: number }>();

  for (const flight of flights) {
    const entry = flight.airline ? counts.get(flight.airline.id) : undefined;

    if (entry) {
      entry.count++;
    } else if (flight?.airline) {
      counts.set(flight.airline.id, { airline: flight.airline, count: 1 });
    }
  }

  return [...counts.values()].reduce((a, b) => (b.count > a.count ? b : a))
    .airline;
}

function mostFlownPlane(flights: Flight[]): Plane | null {
  if (flights.length === 0) return null;

  const counts = new Map<string, { plane: Plane; count: number }>();

  for (const flight of flights) {
    const entry = flight.plane ? counts.get(flight.plane.id) : undefined;

    if (entry) {
      entry.count++;
    } else if (flight?.plane) {
      counts.set(flight.plane.id, {
        plane: flight.plane.deregister(),
        count: 1,
      });
    }
  }

  return [...counts.values()].reduce((a, b) => (b.count > a.count ? b : a))
    .plane;
}

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
import type { Flight } from "@data/classes/flights/Flight";
import type { Plane } from "@data/classes/flights/Plane";
import {
  getUserAvatarUrl,
  type ExtendedUserProperties,
  type UserWithToken,
} from "@data/classes/user";
import { selectFlightsAsObjects } from "@data/services/flights/selectFlights";
import { useUpdateUserAvatarMutation } from "@data/services/usersAPI";
import { useAppSelector } from "@data/store";
import { useState } from "react";
import "./Profile.scss";

const ALLOWED_AVATAR_MIME_TYPES = new Set(["image/png", "image/jpeg"]);
const ALLOWED_AVATAR_EXTENSIONS = [".png", ".jpg", ".jpeg"];

export function Profile() {
  const currentUser = useAppSelector((state) => state.user.currentUser);

  const [editing, setEditing] = useState(false);

  const openEditProfile = () => {
    setEditing(true);
  };

  const clearEditing = () => {
    setEditing(false);
  };

  useSidepanelHeader({
    title: editing ? "Edit profile" : "Profile",
    showGoBack: editing,
    showGoHome: false,
  });

  useSidepanelRequests({
    onBackRequest: editing ? () => setEditing(false) : undefined,
  });

  if (!currentUser) {
    return <div>Please sign in!</div>;
  }

  return (
    <div className="Profile">
      <div className="main-content">
        {editing ? (
          <EditProfileForm clearEditing={clearEditing} />
        ) : (
          <ProfileContent
            openEditProfile={openEditProfile}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  );
}

function ProfileContent({
  openEditProfile,
  currentUser,
}: {
  openEditProfile: () => void;
  currentUser: UserWithToken<ExtendedUserProperties>;
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

    if (croppedAvatar) {
      await updateUserAvatar({
        avatarDataUrl: croppedAvatar,
      }).unwrap();
      setCurrentAvatar(croppedAvatar);
    }
  };

  const flights = useAppSelector(selectFlightsAsObjects);

  const homeAirport = mostVisitedAirport(flights);
  const favouriteAirline = mostFlownAirline(flights);
  const favouritePlane = mostFlownPlane(flights);

  return (
    <>
      <div className="banner">
        <img src={banner} alt="Profile Banner" width="100%" />

        <Button
          className="edit-button"
          variant="filled"
          icon={icons.actions.edit(16)}
          onClick={openEditProfile}
        >
          Edit profile
        </Button>
      </div>

      <div className="profile-info">
        <label className="avatar-input">
          <img
            src={currentAvatar || getUserAvatarUrl(currentUser)}
            alt=""
            className="avatar"
          />
          <span className="avatar-hover-label">Edit</span>
          <input
            type="file"
            accept="image/png,image/jpeg,.jpg,.jpeg"
            hidden
            onChange={handlePFPUpload}
          />
        </label>

        <div className="names">
          <h3 className="nickname">
            {currentUser.nickname || currentUser.username}
          </h3>
          <h5 className="username">@{currentUser.username}</h5>
        </div>
      </div>

      <div className="expanded-profile">
        <p className="bio">
          {currentUser.bio || (
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
        <div className="barcode">flynet.ca/@{currentUser.username}</div>
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

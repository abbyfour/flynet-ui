import { icons } from "@assets/icons/icons";
import banner from "@assets/profile-banner.svg";
import { Button } from "@components/common/buttons/Button";
import { AirlineDisplay } from "@components/displays/AirlineDisplay";
import { AirportDisplay } from "@components/displays/AirportDisplay";
import { PlaneDisplay } from "@components/displays/PlaneDisplay";
import { EditProfileForm } from "@components/forms/EditProfileForm";
import type { Airline } from "@data/classes/flights/Airline";
import type { Airport } from "@data/classes/flights/Airport";
import type { Flight } from "@data/classes/flights/Flight";
import type { Plane } from "@data/classes/flights/Plane";
import type { ExtendedUserProperties, UserWithToken } from "@data/classes/user";
import { selectFlightsAsObjects } from "@data/services/flights/selectFlights";
import { setSidepanelOptions } from "@data/sidepanelSlice";
import { useAppDispatch, useAppSelector } from "@data/store";
import { useEffect, useState } from "react";
import "./Profile.scss";

export function Profile() {
  const currentUser = useAppSelector((state) => state.user.currentUser);

  const [editing, setEditing] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSidepanelOptions({ title: "Profile" }));
  }, [dispatch]);

  const openEditProfile = () => {
    setEditing(true);
  };

  const clearEditing = () => {
    setEditing(false);
  };

  useEffect(() => {
    if (editing) {
      dispatch(
        setSidepanelOptions({
          title: "Edit profile",
          onGoBack: () => setEditing(false),
        }),
      );
    } else {
      dispatch(
        setSidepanelOptions({
          title: "Profile",
        }),
      );
    }
  }, [editing, dispatch]);

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
        <img
          src="https://up.quizlet.com/11bmuo-fk839-256s.png"
          alt=""
          className="avatar"
        />

        <div className="names">
          <h3 className="nickname">
            {currentUser.nickname || currentUser.username}
          </h3>
          <h5 className="username">@{currentUser.username}</h5>
        </div>
      </div>

      <div className="expanded-profile">
        <p className="bio">
          stand for the flag *alberta flag*,
          <br />
          kneel for the cross *westjet logo*
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

import { Button, Fieldset } from "@mantine/core";
import { IconPlaneArrival, IconPlaneDeparture } from "@tabler/icons-react";
import { useState } from "react";
import { m } from "../../../../../../assets/text/messages";
import type { NewFlightProperties } from "../../../../../../data/classes/flights/NewFlightProperties";
import { useAddFlightMutation } from "../../../../../../data/services/flights/flightsAPI";
import type { AddFlightRequestBody } from "../../../../../../data/services/flights/types";
import { useAppDispatch } from "../../../../../../data/store";
import { clearNewFlight } from "../../../../../../data/uiSlice";
import { AirportInput } from "../../../../../forms/AirportInput";
import { Input } from "../../../../../forms/Input";
import { dispatchNotice } from "../../../../../uilib/notices/dispatchNotice";
import { Toasts } from "../../../../../uilib/notices/Toast";
import "./AddFlight.scss";

export function AddFlight() {
  const [newFlightProperties, setNewFlightProperties] =
    useState<NewFlightProperties>({});
  const dispatch = useAppDispatch();

  const [addFlight, { isLoading }] = useAddFlightMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await addFlight(newFlightToRequest(newFlightProperties));

    if (result.error) {
      dispatchNotice(Toasts.error(m.flight.couldNotBeAdded));
    } else {
      dispatchNotice(Toasts.success(m.flight.addedSuccessfully));
    }

    dispatch(clearNewFlight());
  };

  return (
    <div className="AddFlight">
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          id="flightNumber"
          label="Flight Number"
          disabled={isLoading}
          onChange={(value) =>
            setNewFlightProperties((prev) => ({ ...prev, flightNumber: value }))
          }
        />

        <br />

        <Input
          type="date"
          id="date"
          label="Date"
          disabled={isLoading}
          onChange={(value) =>
            setNewFlightProperties((prev) => ({ ...prev, date: value }))
          }
        />

        <br />

        <Input
          type="text"
          id="airline"
          label="Airline"
          disabled={isLoading}
          onChange={(value) =>
            setNewFlightProperties((prev) => ({ ...prev, airline: value }))
          }
        />

        <br />

        <Fieldset legend="Route" radius={"xs"}>
          <AirportInput
            id="origin"
            label="Origin"
            value={newFlightProperties.origin}
            disabled={isLoading}
            onChange={(value) =>
              setNewFlightProperties((prev) => ({
                ...prev,
                origin: value,
              }))
            }
          />

          <br />

          <AirportInput
            id="destination"
            label="Destination"
            value={newFlightProperties.destination}
            disabled={isLoading}
            onChange={(value) =>
              setNewFlightProperties((prev) => ({
                ...prev,
                destination: value,
              }))
            }
          />
        </Fieldset>

        <br />

        <Input
          type="time"
          id="departureTime"
          label="Departure Time"
          disabled={isLoading}
          icon={<IconPlaneDeparture size={16} stroke={1.5} />}
          onChange={(value) =>
            setNewFlightProperties((prev) => ({
              ...prev,
              departureTime: value,
            }))
          }
        />

        <br />

        <Input
          type="time"
          id="arrivalTime"
          label="Arrival Time"
          disabled={isLoading}
          icon={<IconPlaneArrival size={16} stroke={1.5} />}
          onChange={(value) =>
            setNewFlightProperties((prev) => ({ ...prev, arrivalTime: value }))
          }
        />

        <br />

        <Input
          type="text"
          id="aircraft"
          label="Aircraft"
          disabled={isLoading}
          onChange={(value) =>
            setNewFlightProperties((prev) => ({ ...prev, planeModel: value }))
          }
        />

        <br />

        <Input
          type="text"
          id="tailNumber"
          label="Tail Number"
          disabled={isLoading}
          onChange={(value) =>
            setNewFlightProperties((prev) => ({
              ...prev,
              planeRegistration: value,
            }))
          }
        />

        <br />

        <Input
          type="longtext"
          id="notes"
          label="Notes"
          disabled={isLoading}
          onChange={(value) =>
            setNewFlightProperties((prev) => ({ ...prev, note: value }))
          }
        />

        <br />

        <Button
          type="submit"
          loading={isLoading}
          fullWidth
          variant="outline"
          color="dark"
        >
          Add flight
        </Button>
      </form>
    </div>
  );
}

function newFlightToRequest(
  newFlight: NewFlightProperties,
): AddFlightRequestBody {
  return {
    flightNumber: newFlight.flightNumber,
    date: newFlight.date?.toISOString(),
    airline: newFlight.airline,
    originAirportId: newFlight.origin?.id,
    destinationAirportId: newFlight.destination?.id,
    departureTime: newFlight.departureTime,
    arrivalTime: newFlight.arrivalTime,
    planeModel: newFlight.planeModel,
    planeRegistration: newFlight.planeRegistration,
    note: newFlight.note,
  };
}

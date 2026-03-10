import { Fieldset } from "@mantine/core";
import type { FlightDraft } from "../../data/classes/flights/FlightDraft";
import { updateDraftingFlight } from "../../data/flightsSlice";
import { useAppDispatch, useAppSelector } from "../../data/store";
import type { Time } from "../../util/types";
import { SubmitButton } from "../buttons/SubmitButton";
import { AirportInput } from "./AirportInput";
import { Input } from "./Input";

import { icons } from "../../assets/text/icons";
import "./FlightDrafter.scss";

interface FlightDrafterProps {
  onSubmit: () => void;
  isLoading: boolean;
}

export function FlightDrafter({ onSubmit, isLoading }: FlightDrafterProps) {
  const { draft, type } = useAppSelector(
    (state) => state.flights.inProgressDraft,
  ) ?? { draft: {} as FlightDraft, type: "new" };

  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSubmit();
  };

  const updateDraft = (updatedFields: Partial<FlightDraft>) => {
    dispatch(updateDraftingFlight(updatedFields));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Fieldset className="route-fieldset" legend="Route" radius={"xs"}>
        <AirportInput
          id="origin"
          label="Origin"
          required
          value={draft.origin}
          disabled={isLoading}
          onChange={(value) => updateDraft({ origin: value })}
        />

        <br />

        <AirportInput
          id="destination"
          label="Destination"
          required
          value={draft.destination}
          disabled={isLoading}
          onChange={(value) => updateDraft({ destination: value })}
        />
      </Fieldset>

      <Input
        type="date"
        id="date"
        label="Date"
        value={draft.date}
        disabled={isLoading}
        onChange={(value) => updateDraft({ date: value })}
      />

      <br />

      <Input
        type="text"
        id="flightNumber"
        label="Flight Number"
        value={draft.flightNumber}
        disabled={isLoading}
        onChange={(value) => updateDraft({ flightNumber: value })}
      />

      <br />

      <Input
        type="text"
        id="airline"
        label="Airline"
        value={draft.airline}
        disabled={isLoading}
        onChange={(value) => updateDraft({ airline: value })}
      />

      <br />

      <Input
        type="time"
        id="departureTime"
        label="Departure Time"
        disabled={isLoading}
        value={draft.departureTime as Time | undefined}
        icon={icons.flights.departure(16)}
        onChange={(value) => updateDraft({ departureTime: value })}
      />

      <br />

      <Input
        type="time"
        id="arrivalTime"
        label="Arrival Time"
        disabled={isLoading}
        value={draft.arrivalTime as Time | undefined}
        icon={icons.flights.arrival(16)}
        onChange={(value) => updateDraft({ arrivalTime: value })}
      />

      <br />

      <Input
        type="text"
        id="aircraft"
        label="Aircraft"
        disabled={isLoading}
        value={draft.planeModel as string | undefined}
        onChange={(value) => updateDraft({ planeModel: value })}
      />

      <br />

      <Input
        type="text"
        id="tailNumber"
        label="Tail Number"
        disabled={isLoading}
        value={draft.planeRegistration as string | undefined}
        onChange={(value) => updateDraft({ planeRegistration: value })}
      />

      <br />

      <Input
        type="longtext"
        id="notes"
        label="Notes"
        disabled={isLoading}
        value={draft.note as string | undefined}
        onChange={(value) => updateDraft({ note: value })}
      />

      <br />

      <br />

      <SubmitButton
        loading={isLoading}
        disabled={!draft.origin || !draft.destination}
      >
        {type === "new" ? "Add flight" : "Save changes"}
      </SubmitButton>
    </form>
  );
}

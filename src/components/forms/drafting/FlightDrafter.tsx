import { icons } from "@assets/icons/icons";
import { SubmitButton } from "@components/common/buttons/SubmitButton";
import type { FlightDraft } from "@data/classes/flights/FlightDraft";
import { Fieldset } from "@mantine/core";
import type { Time } from "@util/types";
import { useEffect, useState } from "react";
import { AirportInput } from "../AirportInput";
import { Input } from "../Input";

import "./FlightDrafter.scss";

interface FlightDrafterProps {
  initialDraft: FlightDraft;
  onSubmit: (draft: FlightDraft) => void;
  onDraftChange?: (draft: FlightDraft) => void;
  isLoading: boolean;
  mode: "new" | "edit";
}

export function FlightDrafter({
  initialDraft,
  onSubmit,
  onDraftChange,
  isLoading,
  mode,
}: FlightDrafterProps) {
  const [draft, setDraft] = useState<FlightDraft>(initialDraft);

  useEffect(() => {
    setDraft(initialDraft);
  }, [initialDraft]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(draft);
  };

  const updateDraft = (updatedFields: Partial<FlightDraft>) => {
    setDraft((currentDraft) => {
      const nextDraft = {
        ...currentDraft,
        ...updatedFields,
      };

      onDraftChange?.(nextDraft);
      return nextDraft;
    });
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
          fingerprinted={mode === "edit"}
        />

        <br />

        <AirportInput
          id="destination"
          label="Destination"
          required
          value={draft.destination}
          disabled={isLoading}
          onChange={(value) => updateDraft({ destination: value })}
          fingerprinted={mode === "edit"}
        />
      </Fieldset>

      <Input
        type="date"
        id="date"
        label="Date"
        value={draft.date}
        disabled={isLoading}
        onChange={(value) => updateDraft({ date: value })}
        fingerprinted={mode === "edit"}
      />

      <br />

      <Input
        type="text"
        id="flightNumber"
        label="Flight Number"
        value={draft.flightNumber}
        disabled={isLoading}
        onChange={(value) => updateDraft({ flightNumber: value })}
        fingerprinted={mode === "edit"}
      />

      <br />

      <Input
        type="text"
        id="airline"
        label="Airline"
        value={draft.airline}
        disabled={isLoading}
        onChange={(value) => updateDraft({ airline: value })}
        fingerprinted={mode === "edit"}
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
        fingerprinted={mode === "edit"}
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
        fingerprinted={mode === "edit"}
      />

      <br />

      <Input
        type="text"
        id="aircraft"
        label="Aircraft"
        disabled={isLoading}
        value={draft.planeModel as string | undefined}
        onChange={(value) => updateDraft({ planeModel: value })}
        fingerprinted={mode === "edit"}
      />

      <br />

      <Input
        type="text"
        id="tailNumber"
        label="Tail Number"
        disabled={isLoading}
        value={draft.planeRegistration as string | undefined}
        onChange={(value) => updateDraft({ planeRegistration: value })}
        fingerprinted={mode === "edit"}
      />

      <br />

      <Input
        required
        type="longtext"
        id="notes"
        label="Notes"
        disabled={isLoading}
        value={draft.note as string | undefined}
        onChange={(value) => updateDraft({ note: value })}
        fingerprinted={mode === "edit"}
      />

      <br />

      <br />

      <SubmitButton
        loading={isLoading}
        disabled={!draft.origin || !draft.destination}
      >
        {mode === "new" ? "Add flight" : "Save changes"}
      </SubmitButton>
    </form>
  );
}

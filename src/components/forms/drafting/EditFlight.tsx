import { m } from "@assets/text/messages";
import { useSidepanelRequests } from "@components/common/hooks/sidepanel";
import { confirm } from "@components/common/notices/Confirm";
import { dispatchNotice } from "@components/common/notices/dispatchNotice";
import { Toasts } from "@components/common/notices/Toast";
import { draftToNewRequest } from "@data/classes/flights/FlightDraft";
import { clearDraftingFlight } from "@data/flightsSlice";
import { useUpdateFlightMutation } from "@data/services/flights/flightsAPI";
import { selectFlightsAsObjects } from "@data/services/flights/selectFlights";
import { useAppDispatch, useAppSelector } from "@data/store";
import { findFlightFromID } from "@util/flights";
import { useEffect, useMemo, useRef } from "react";
import { FlightDrafter } from "./FlightDrafter";

export function EditFlight() {
  const [updateFlight, { isLoading }] = useUpdateFlightMutation();
  const drafting = useAppSelector((state) => state.flights.inProgressDraft);
  const flights = useAppSelector(selectFlightsAsObjects);
  const dispatch = useAppDispatch();
  const initialDraft = useMemo(
    () =>
      drafting?.type === "edit"
        ? findFlightFromID(flights, drafting.flightId)?.toDraft() || {}
        : {},
    [drafting, flights],
  );
  const latestDraftRef = useRef(initialDraft);
  const editingFlightRef = useRef(
    drafting?.type === "edit"
      ? findFlightFromID(flights, drafting.flightId)
      : undefined,
  );

  useEffect(() => {
    latestDraftRef.current = initialDraft;
  }, [initialDraft]);

  useEffect(() => {
    editingFlightRef.current =
      drafting?.type === "edit"
        ? findFlightFromID(flights, drafting.flightId)
        : undefined;
  }, [drafting, flights]);

  useSidepanelRequests({
    onBackRequest: () => {
      void (async () => {
        const flight = editingFlightRef.current;
        if (!flight || flight.isUnchangedFromDraft(latestDraftRef.current)) {
          dispatch(clearDraftingFlight());
          return;
        }

        const confirmation = await confirm({
          title: m.confirm.losingChanges.title,
          children: <p>{m.confirm.losingChanges.text}</p>,
          color: "red",
          labels: { confirm: "Yes.", cancel: "Wait, no!" },
        });

        if (confirmation) {
          dispatch(clearDraftingFlight());
        }
      })();
    },
  });

  const handleSubmit = async (
    draft: Parameters<typeof draftToNewRequest>[0],
  ) => {
    if (drafting?.type !== "edit") return;

    const result = await updateFlight({
      flightId: drafting.flightId,
      updatedData: draftToNewRequest(draft),
    });

    if (result.error) {
      dispatchNotice(Toasts.error(m.flight.couldNotBeUpdated));
    } else {
      dispatchNotice(Toasts.success(m.flight.updatedSuccessfully));
    }

    dispatch(clearDraftingFlight());
  };

  return (
    <div className="AddFlight">
      <FlightDrafter
        initialDraft={initialDraft}
        isLoading={isLoading}
        mode="edit"
        onDraftChange={(draft) => {
          latestDraftRef.current = draft;
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

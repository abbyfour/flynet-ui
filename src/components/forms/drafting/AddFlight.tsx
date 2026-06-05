import { m } from "@assets/text/messages";
import {
  useSidepanelRequests,
} from "@components/common/hooks/sidepanel";
import { dispatchNotice } from "@components/common/notices/dispatchNotice";
import { Toasts } from "@components/common/notices/Toast";
import { draftToNewRequest } from "@data/classes/flights/FlightDraft";
import { clearDraftingFlight } from "@data/flightsSlice";
import { useAddFlightMutation } from "@data/services/flights/flightsAPI";
import { useAppDispatch } from "@data/store";
import { FlightDrafter } from "./FlightDrafter";

export function AddFlight() {
  const [addFlight, { isLoading }] = useAddFlightMutation();
  const dispatch = useAppDispatch();

  useSidepanelRequests({
    onBackRequest: () => {
      dispatch(clearDraftingFlight());
    },
  });

  const handleSubmit = async (
    draft: Parameters<typeof draftToNewRequest>[0],
  ) => {
    const result = await addFlight(draftToNewRequest(draft));

    if (result.error) {
      dispatchNotice(Toasts.error(m.flight.couldNotBeAdded));
    } else {
      dispatchNotice(Toasts.success(m.flight.addedSuccessfully));
    }

    dispatch(clearDraftingFlight());
  };

  return (
    <div className="AddFlight">
      <FlightDrafter
        initialDraft={{}}
        isLoading={isLoading}
        mode="new"
        onSubmit={handleSubmit}
      />
    </div>
  );
}

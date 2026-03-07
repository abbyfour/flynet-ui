import { m } from "../../../../../../assets/text/messages";
import { draftToNewRequest } from "../../../../../../data/classes/flights/FlightDraft";
import { clearDraftingFlight } from "../../../../../../data/flightsSlice";
import { useUpdateFlightMutation } from "../../../../../../data/services/flights/flightsAPI";
import { useAppDispatch, useAppSelector } from "../../../../../../data/store";
import { FlightDrafter } from "../../../../../forms/FlightDrafter";
import { dispatchNotice } from "../../../../../notices/dispatchNotice";
import { Toasts } from "../../../../../notices/Toast";

export function EditFlight() {
  const [updateFlight, { isLoading }] = useUpdateFlightMutation();
  const drafting = useAppSelector((state) => state.flights.inProgressDraft);
  const dispatch = useAppDispatch();

  const handleSubmit = async () => {
    if (!drafting || !drafting.flightId) return;

    const result = await updateFlight({
      flightId: drafting.flightId,
      updatedData: draftToNewRequest(drafting.draft),
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
      <FlightDrafter isLoading={isLoading} onSubmit={handleSubmit} />
    </div>
  );
}

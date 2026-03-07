import { m } from "../../../../../../assets/text/messages";
import { draftToNewRequest } from "../../../../../../data/classes/flights/FlightDraft";
import { clearDraftingFlight } from "../../../../../../data/flightsSlice";
import { useAddFlightMutation } from "../../../../../../data/services/flights/flightsAPI";
import { useAppDispatch, useAppSelector } from "../../../../../../data/store";
import { FlightDrafter } from "../../../../../forms/FlightDrafter";
import { dispatchNotice } from "../../../../../notices/dispatchNotice";
import { Toasts } from "../../../../../notices/Toast";

export function AddFlight() {
  const [addFlight, { isLoading }] = useAddFlightMutation();
  const drafting = useAppSelector((state) => state.flights.inProgressDraft);
  const dispatch = useAppDispatch();

  const handleSubmit = async () => {
    if (!drafting) return;

    const result = await addFlight(draftToNewRequest(drafting.draft));

    if (result.error) {
      dispatchNotice(Toasts.error(m.flight.couldNotBeAdded));
    } else {
      dispatchNotice(Toasts.success(m.flight.addedSuccessfully));
    }

    dispatch(clearDraftingFlight());
  };

  return (
    <div className="AddFlight">
      <FlightDrafter isLoading={isLoading} onSubmit={handleSubmit} />
    </div>
  );
}

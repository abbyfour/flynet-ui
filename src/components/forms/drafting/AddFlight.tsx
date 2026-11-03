import { m } from "@assets/text/messages";
import { useSidepanelRequests } from "@components/common/hooks/sidepanel";
import { dispatchNotice } from "@components/common/notices/dispatchNotice";
import { Toasts } from "@components/common/notices/Toast";
import { draftToNewRequest } from "@data/classes/flights/FlightDraft";
import { useNavigator } from "@data/location/navigator/hooks";
import { useAddFlightMutation } from "@data/services/flights/flightsAPI";
import { FlightDrafter } from "./FlightDrafter";

export function AddFlight() {
  const [addFlight, { isLoading }] = useAddFlightMutation();
  const navigator = useNavigator();

  useSidepanelRequests({
    onBackRequest: () => {
      navigator.back();
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

    navigator.back();
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

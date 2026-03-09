import { useCallback, useEffect } from "react";
import { m } from "../../../../../assets/text/messages";
import {
  clearDraftingFlight,
  clearSelectedFlight,
} from "../../../../../data/flightsSlice";
import { useGetFlightsQuery } from "../../../../../data/services/flights/flightsAPI";
import {
  selectFlightsAsObjects,
  selectSelectedFlight,
} from "../../../../../data/services/flights/selectFlights";
import { setSidepanelOptions } from "../../../../../data/sidepanelSlice";
import { useAppDispatch, useAppSelector } from "../../../../../data/store";
import { confirm } from "../../../../notices/Confirm";
import { AddFlight } from "./drafting/AddFlight";
import { EditFlight } from "./drafting/EditFlight";
import { FlightsList } from "./FlightsList";
import { FlightView } from "./FlightView";

export function FlightsPanel() {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const selectedFlight = useAppSelector(selectSelectedFlight);
  const drafting = useAppSelector((state) => state.flights.inProgressDraft);
  const flights = useAppSelector(selectFlightsAsObjects);

  const { isLoading: flightsLoading, isError: flightsErrored } =
    useGetFlightsQuery();

  const flightsReady = !flightsLoading && !flightsErrored;

  const dispatch = useAppDispatch();

  const goBackFromEdit = useCallback(async () => {
    const confirmation = await confirm({
      title: m.confirm.losingChanges.title,
      children: <p>{m.confirm.losingChanges.text}</p>,
      color: "red",
      labels: { confirm: "Yes.", cancel: "Wait, no!" },
    });

    if (confirmation) {
      dispatch(clearDraftingFlight());
    }
  }, [dispatch]);

  useEffect(() => {
    if (drafting?.type === "new") {
      dispatch(
        setSidepanelOptions({
          title: "Add flight",
          onGoBack: () => dispatch(clearDraftingFlight()),
        }),
      );
    } else if (drafting?.type === "edit") {
      dispatch(
        setSidepanelOptions({
          title: "Edit flight",
          onGoBack: () => goBackFromEdit(),
        }),
      );
    } else if (selectedFlight) {
      dispatch(
        setSidepanelOptions({
          title: `Flight ${selectedFlight.flightNumber ?? ""}`,
          onGoBack: () => dispatch(clearSelectedFlight()),
        }),
      );
    } else if (!drafting) {
      dispatch(
        setSidepanelOptions({
          title: `Flights${flights && flights.length ? ` (${flights.length})` : ""}`,
          onGoBack: undefined,
        }),
      );
    }
  }, [dispatch, drafting, selectedFlight, flights, goBackFromEdit]);

  const isListVisible = Boolean(
    flightsReady && !selectedFlight && !drafting && flights && flights.length,
  );

  if (!currentUser) {
    return (
      <div>
        <p>Please log in to view your flights.</p>
      </div>
    );
  }

  const showAppropriateView = () => {
    if (drafting?.type === "new") {
      return <AddFlight />;
    }

    if (drafting?.type === "edit") {
      return <EditFlight />;
    }

    if (selectedFlight && !drafting) {
      return <FlightView flight={selectedFlight} />;
    }

    return <></>;
  };

  return (
    <div className="FlightsPanel">
      {showAppropriateView()}

      {/* Must remain rendered so the memory foam list can work */}
      <FlightsList isVisible={isListVisible} />
    </div>
  );
}

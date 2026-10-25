import { SidepanelWindows } from "@data/classes/ui";
import {
  clearDraftingFlight,
  clearSelection,
  setEditingFlight,
  setNewFlight,
  setSelected,
} from "@data/flightsSlice";
import { useAppDispatch, useAppSelector } from "@data/store";
import {
  closeActiveSidepanelWindow,
  setActiveSidepanelWindow,
  setIsEditingProfile,
  setViewedProfileUsername,
} from "@data/uiSlice";
import { useEffect, useMemo, useRef } from "react";
import {
  buildNavigationPath,
  parseNavigationPathname,
} from "./urlNavigationRoutes";

/**
 * Keeps the browser pathname and Redux navigation state in sync.
 *
 * It applies the current URL on mount and on browser back/forward navigation,
 * then updates the URL when navigation state changes. URL-driven state changes
 * suppress the next URL write so handling a pathname does not add a duplicate
 * history entry.
 */
export function useNavigationURLSync() {
  const dispatch = useAppDispatch();
  const activeWindow = useAppSelector(
    (state) => state.ui.activeSidepanelWindow,
  );
  const selected = useAppSelector((state) => state.flights.selected);
  const drafting = useAppSelector((state) => state.flights.inProgressDraft);
  const isEditingProfile = useAppSelector((state) => state.ui.isEditingProfile);
  const viewedProfileUsername = useAppSelector(
    (state) => state.ui.viewedProfileUsername,
  );
  const currentUsername = useAppSelector(
    (state) => state.user.currentUser?.username,
  );

  const suppressNextWriteRef = useRef(false);

  useEffect(() => {
    const applyNavigationPath = (pathname: string) => {
      const route = parseNavigationPathname(pathname);
      suppressNextWriteRef.current = true;

      dispatch(setViewedProfileUsername(undefined));
      dispatch(setIsEditingProfile(false));
      dispatch(clearDraftingFlight());
      dispatch(clearSelection());

      if (!route.window) {
        dispatch(closeActiveSidepanelWindow());
        return;
      }

      dispatch(setActiveSidepanelWindow(route.window));

      if (route.viewedProfileUsername) {
        dispatch(setViewedProfileUsername(route.viewedProfileUsername));
      }

      if (route.window === SidepanelWindows.Profile) {
        dispatch(setIsEditingProfile(Boolean(route.isEditingProfile)));
      }

      if (route.window === SidepanelWindows.Flights) {
        if (route.draft?.type === "new") {
          dispatch(setNewFlight());
        } else if (route.draft?.type === "edit") {
          dispatch(setEditingFlight({ flightId: route.draft.flightId }));
        }

        if (route.selected) {
          dispatch(setSelected(route.selected));
        }
      }
    };

    applyNavigationPath(window.location.pathname);

    const onPopState = () => {
      applyNavigationPath(window.location.pathname);
    };

    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, [dispatch]);

  const pathname = useMemo(
    () =>
      buildNavigationPath({
        activeWindow,
        selected,
        drafting,
        isEditingProfile: isEditingProfile,
        viewedProfileUsername: viewedProfileUsername,
        currentUsername: currentUsername,
      }),
    [
      activeWindow,
      currentUsername,
      drafting,
      isEditingProfile,
      viewedProfileUsername,
      selected,
    ],
  );

  useEffect(() => {
    if (suppressNextWriteRef.current) {
      suppressNextWriteRef.current = false;
      return;
    }

    if (window.location.pathname === pathname) {
      return;
    }

    window.history.pushState({}, "", pathname);
  }, [pathname]);
}

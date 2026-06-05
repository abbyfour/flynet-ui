import {
  clearSidepanelOptions,
  setSidepanelOptions,
  type SidepanelHeaderOptions,
} from "@data/sidepanelSlice";
import { useAppDispatch, useAppSelector } from "@data/store";
import { useEffect, useRef } from "react";

/**
 * Syncs the sidepanel header with the current component state.
 *
 * This keeps the title and control visibility declarative inside the panel
 * instead of requiring each caller to manage slice writes manually.
 */
export function useSidepanelHeader(options: SidepanelHeaderOptions) {
  const dispatch = useAppDispatch();
  const { title, showGoBack, showGoHome } = options;

  useEffect(() => {
    dispatch(setSidepanelOptions({ title, showGoBack, showGoHome }));
  }, [dispatch, title, showGoBack, showGoHome]);

  useEffect(() => {
    return () => {
      dispatch(clearSidepanelOptions());
    };
  }, [dispatch]);
}

/**
 * Listens for serialized sidepanel back/home requests and runs the supplied
 * local handlers exactly once per request.
 *
 * The request counters stay in Redux so the toolbar remains declarative, while
 * the actual behavior stays inside the owning panel component.
 */
export function useSidepanelRequests({
  onBackRequest,
  onHomeRequest,
}: {
  onBackRequest?: () => void;
  onHomeRequest?: () => void;
}) {
  const backRequestId = useAppSelector(
    (state) => state.sidepanel.backRequestId,
  );
  const homeRequestId = useAppSelector(
    (state) => state.sidepanel.homeRequestId,
  );

  const lastBackRequestId = useRef(backRequestId);
  const lastHomeRequestId = useRef(homeRequestId);

  useEffect(() => {
    if (backRequestId === lastBackRequestId.current) {
      return;
    }

    lastBackRequestId.current = backRequestId;
    onBackRequest?.();
  }, [backRequestId, onBackRequest]);

  useEffect(() => {
    if (homeRequestId === lastHomeRequestId.current) {
      return;
    }

    lastHomeRequestId.current = homeRequestId;
    onHomeRequest?.();
  }, [homeRequestId, onHomeRequest]);
}

import type { AppDispatch } from "@data/store";
import { clearThinking, setPermanentThinking } from "@data/uiSlice";

export function useEphemeralThinking(dispatch: AppDispatch) {
  return (message: string, duration: number = 2000) => {
    dispatch(setPermanentThinking(message));
    setTimeout(() => {
      dispatch(clearThinking());
    }, duration);
  };
}

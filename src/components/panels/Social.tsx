import { setSidepanelOptions } from "@data/sidepanelSlice";
import { useAppDispatch } from "@data/store";
import { useEffect } from "react";

export function Social() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      setSidepanelOptions({
        title: "Social",
        showGoBack: false,
        showGoHome: false,
      }),
    );
  }, [dispatch]);

  return (
    <div>
      <p>This is the Social sidepanel window</p>
    </div>
  );
}

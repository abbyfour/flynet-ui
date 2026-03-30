import { setSidepanelOptions } from "@data/sidepanelSlice";
import { useAppDispatch } from "@data/store";
import { useEffect } from "react";

export function Settings() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSidepanelOptions({ title: "Settings" }));
  }, [dispatch]);

  return (
    <div>
      <p>This is the Settings sidepanel window</p>
    </div>
  );
}

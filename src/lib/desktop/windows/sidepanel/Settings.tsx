import { useEffect } from "react";
import { setSidepanelOptions } from "../../../../data/sidepanelSlice";
import { useAppDispatch } from "../../../../data/store";

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

import { useEffect } from "react";
import { setSidepanelOptions } from "../../../../data/sidepanelSlice";
import { useAppDispatch } from "../../../../data/store";

export function Social() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSidepanelOptions({ title: "Social" }));
  }, [dispatch]);

  return (
    <div>
      <p>This is the Social sidepanel window</p>
    </div>
  );
}

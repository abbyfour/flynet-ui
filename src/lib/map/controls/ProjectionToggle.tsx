import Toggle from "react-toggle";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { MapProjection, setMapProjection } from "../../../redux/uiSlice";
import "./ProjectionToggle.css";

export function ProjectionToggle() {
  const projection = useAppSelector((state) => state.ui.mapProjection);
  const dispatch = useAppDispatch();

  return (
    <div className="ProjectionToggle">
      <Toggle
        id="projection-toggle"
        icons={false}
        checked={projection === MapProjection.Globe}
        onChange={(e) =>
          dispatch(
            setMapProjection(
              e.target.checked ? MapProjection.Globe : MapProjection.Mercator,
            ),
          )
        }
      />
    </div>
  );
}

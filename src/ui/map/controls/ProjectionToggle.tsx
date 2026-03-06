import { MapProjection } from "../../../data/classes/ui";
import { useAppDispatch, useAppSelector } from "../../../data/store";
import { setMapProjection } from "../../../data/uiSlice";
import "./ProjectionToggle.scss";

export function ProjectionToggle() {
  const projection = useAppSelector((state) => state.ui.mapProjection);
  const dispatch = useAppDispatch();

  return (
    <div className="ProjectionToggle">
      <input
        type="checkbox"
        id="projection-toggle"
        checked={projection === MapProjection.Globe}
        onChange={(e) =>
          dispatch(
            setMapProjection(
              e.target.checked ? MapProjection.Globe : MapProjection.Mercator,
            ),
          )
        }
      />
      <label htmlFor="projection-toggle" className="toggle-label">
        globe view
      </label>
    </div>
  );
}

import type { Plane } from "../../../../../../../data/classes/flights/Plane";

import airplaneTag from "../../../../../../../assets/icons/airplane-tag.svg";
import { joinClasses } from "../../../../../../../util/componentUtil";
import "./PlaneDisplay.scss";

type PlaneDisplayProps = {
  plane: Plane;
  onClick?: () => void;
  onRegistrationClick?: () => void;
  noHover?: boolean;
};

export function PlaneDisplay({
  plane,
  onClick,
  onRegistrationClick,
  noHover = false,
}: PlaneDisplayProps) {
  return (
    <div className={`PlaneDisplay ${noHover ? "no-hover" : ""}`}>
      <div className="tag" onClick={onClick}>
        <img src={airplaneTag} alt="" className="tag-img" />

        <div className="tag-text">
          <span className="manufacturer">{plane.manufacturer}</span>
          <span
            className={joinClasses(
              "model",
              scaleTextFromModel(plane.manufacturerModel),
            )}
          >
            {plane.manufacturerModel}
          </span>
        </div>
      </div>

      {plane.registration && (
        <div className="tag registration-tag" onClick={onRegistrationClick}>
          <img src={airplaneTag} alt="" className="tag-img" />

          <div className="tag-text">
            <div className="registration">
              <span className="reg-label">Reg: </span>
              <span className="registration-value">{plane.registration}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function scaleTextFromModel(model: string): string {
  const length = model.length;

  if (length <= 10) {
    return "short-name";
  } else if (length <= 15) {
    return "medium-name";
  } else if (length <= 20) {
    return "long-name";
  } else {
    return "default-name";
  }
}

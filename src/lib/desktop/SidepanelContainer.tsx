import { joinClasses } from "../../util/componentUtil";
import "./SidepanelContainer.scss";

type SidepanelContainerProps = {
  align: "left" | "right";
  children?: React.ReactNode;
  className?: string;
};

export function SidepanelContainer({
  align,
  children,
  className,
}: SidepanelContainerProps) {
  return (
    <div className={joinClasses("SidepanelContainer", align, className)}>
      {children}
    </div>
  );
}

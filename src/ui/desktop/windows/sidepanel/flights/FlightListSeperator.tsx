import { Checkbox } from "@mantine/core";
import "./FlightSeparator.scss";

type FlightListSeparatorProps = {
  label: string | number;
  onToggle?: (label: string | number, value: boolean) => void;
  toggleValue?: boolean;
};

export function FlightListSeparator({
  label,
  onToggle,
  toggleValue,
}: FlightListSeparatorProps) {
  return (
    <div className="FlightListSeparator">
      {onToggle && (
        <Checkbox
          onChange={(event) => onToggle(label, event.currentTarget.checked)}
          color="dark"
          size="xs"
          checked={toggleValue}
        />
      )}
      <span className="label">{label}</span>
    </div>
  );
}
